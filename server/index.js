import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { data, initDb, newId, save } from "./db.js";
import { emptyProgress, sanitizeProgress } from "./progress.js";
import { getNews } from "./news.js";
import { mergeProgress } from "../src/lib/merge.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(HERE, "..", "dist");
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10); // equalises timing for unknown emails
const dayStr = (d) => d.toISOString().slice(0, 10);

const publicUser = (u) => ({ id: u.id, name: u.progress.name, email: u.email });
const fail = (res, status, error, message) => res.status(status).json({ error, message });
const secret = () => process.env.JWT_SECRET || data().meta.secret;
const sign = (u) => jwt.sign({ sub: u.id }, secret(), { expiresIn: "30d" });

function weekXp(xpByDay = {}, now = new Date()) {
  let t = 0;
  for (let i = 0; i < 8; i++) t += xpByDay[dayStr(new Date(now.getTime() - i * 86400000))] || 0;
  return t;
}
const streakAlive = (p, now = new Date()) => !!p.lastDay && p.lastDay >= dayStr(new Date(now.getTime() - 2 * 86400000));

export async function createApp({ dataDir, newsOptions } = {}) {
  await initDb(dataDir);
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "200kb" }));
  if (process.env.CORS_ORIGIN) app.use(cors({ origin: process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) }));
  app.use((req, res, next) => {
    res.set({ "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN", "Permissions-Policy": "camera=(), microphone=(), geolocation=()" });
    next();
  });

  const authLimiter = rateLimit({ windowMs: 15 * 60_000, limit: Number(process.env.AUTH_RATE_LIMIT || 30), standardHeaders: true, legacyHeaders: false,
    handler: (req, res) => fail(res, 429, "rate_limited", "Too many attempts. Please try again in a few minutes.") });

  const userFromToken = (req) => {
    const h = req.headers.authorization || "";
    if (!h.startsWith("Bearer ")) return null;
    try { const { sub } = jwt.verify(h.slice(7), secret()); return data().users.find((u) => u.id === sub) || null; } catch { return null; }
  };
  const requireAuth = (req, res, next) => { const u = userFromToken(req); if (!u) return fail(res, 401, "unauthorized", "Please sign in again."); req.user = u; next(); };

  app.get("/api/health", (req, res) => res.json({ ok: true }));

  // ---------- auth ----------
  app.post("/api/auth/register", authLimiter, async (req, res) => {
    const name = String(req.body?.name ?? "").replace(/[\p{Cc}<>]/gu, "").trim().slice(0, 18);
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    if (!name) return fail(res, 400, "invalid_name", "Please enter your name.");
    if (!EMAIL.test(email)) return fail(res, 400, "invalid_email", "Please enter a valid email address.");
    if (password.length < 6 || password.length > 100) return fail(res, 400, "weak_password", "Password must be at least 6 characters.");
    if (data().users.some((u) => u.email === email)) return fail(res, 409, "email_taken", "An account with this email already exists. Try signing in.");
    const now = new Date().toISOString();
    const user = { id: newId(), email, passHash: await bcrypt.hash(password, 10), createdAt: now, updatedAt: now, progress: { ...emptyProgress(), name } };
    data().users.push(user);
    await save();
    res.status(201).json({ token: sign(user), user: publicUser(user), progress: user.progress });
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    const user = data().users.find((u) => u.email === email);
    const ok = await bcrypt.compare(password, user ? user.passHash : DUMMY_HASH);
    if (!user || !ok) return fail(res, 401, "bad_credentials", "Email or password is incorrect.");
    res.json({ token: sign(user), user: publicUser(user), progress: user.progress });
  });

  app.get("/api/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

  app.delete("/api/me", requireAuth, async (req, res) => {
    const ok = await bcrypt.compare(String(req.body?.password ?? ""), req.user.passHash);
    if (!ok) return fail(res, 403, "bad_credentials", "Password is incorrect.");
    data().users = data().users.filter((u) => u.id !== req.user.id);
    await save();
    res.json({ ok: true });
  });

  // ---------- progress sync ----------
  app.get("/api/progress", requireAuth, (req, res) => res.json({ progress: req.user.progress, updatedAt: req.user.updatedAt }));

  app.put("/api/progress", requireAuth, async (req, res) => {
    const incoming = sanitizeProgress(req.body?.progress);
    // Max/union merge: a stale device can never wipe newer progress.
    const merged = sanitizeProgress(mergeProgress(incoming, req.user.progress));
    req.user.progress = merged;
    req.user.updatedAt = new Date().toISOString();
    await save();
    res.json({ progress: merged, updatedAt: req.user.updatedAt });
  });

  app.delete("/api/progress", requireAuth, async (req, res) => {
    req.user.progress = { ...emptyProgress(), name: req.user.progress.name };
    req.user.updatedAt = new Date().toISOString();
    await save();
    res.json({ progress: req.user.progress, updatedAt: req.user.updatedAt });
  });

  // ---------- leaderboard (public; shows display name only) ----------
  app.get("/api/leaderboard", (req, res) => {
    const range = req.query.range === "all" ? "all" : "week";
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const me = userFromToken(req);
    const now = new Date();
    const rows = data().users.map((u) => {
      const p = u.progress;
      const weekly = weekXp(p.xpByDay, now);
      return { uid: u.id, name: p.name, xp: p.xp, weekXp: weekly, score: range === "all" ? p.xp : weekly, streak: streakAlive(p, now) ? p.streak : 0, level: Math.floor(p.xp / 100) + 1 };
    }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score || b.xp - a.xp || a.name.localeCompare(b.name));
    const shape = (r, i) => ({ rank: i + 1, name: r.name, xp: r.xp, weekXp: r.weekXp, score: r.score, streak: r.streak, level: r.level, you: !!me && r.uid === me.id,
      key: crypto.createHash("sha1").update(r.uid).digest("hex").slice(0, 8) });
    const entries = rows.slice(0, limit).map(shape);
    const idx = me ? rows.findIndex((r) => r.uid === me.id) : -1;
    res.json({ range, total: rows.length, entries, me: idx >= 0 ? shape(rows[idx], idx) : null });
  });

  // ---------- live news ----------
  app.get("/api/news", async (req, res) => {
    try {
      const news = await getNews(newsOptions);
      res.set("Cache-Control", "public, max-age=300").json(news);
    } catch {
      fail(res, 503, "news_unavailable", "Live headlines are unavailable right now.");
    }
  });

  app.use("/api", (req, res) => fail(res, 404, "not_found", "Unknown API route."));

  // ---------- serve the built app (one deploy, one URL) ----------
  if (fs.existsSync(path.join(DIST, "index.html"))) {
    app.use(express.static(DIST, { index: false, setHeaders: (res, p) => { if (p.endsWith("sw.js") || p.endsWith(".html")) res.set("Cache-Control", "no-cache"); } }));
    app.use((req, res, next) => (req.method === "GET" ? res.sendFile(path.join(DIST, "index.html")) : next()));
  }

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err?.type === "entity.parse.failed") return fail(res, 400, "bad_json", "Invalid request body.");
    console.error(err);
    fail(res, 500, "server_error", "Something went wrong on our side.");
  });
  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 8787);
  createApp().then((app) => app.listen(port, () => console.log(`HeritageHub API listening on http://localhost:${port}`)));
}
