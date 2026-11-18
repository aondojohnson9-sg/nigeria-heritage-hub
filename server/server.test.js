import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createApp } from "./index.js";
import { parseFeed, cleanText, resetNewsCache } from "./news.js";

process.env.AUTH_RATE_LIMIT = "1000";
const RSS = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Test</title>
<item><title><![CDATA[Senate passes budget &amp; more]]></title><link>https://example.ng/a</link><pubDate>Tue, 17 Nov 2026 08:00:00 GMT</pubDate>
<description><![CDATA[<p>The Senate on Tuesday <b>passed</b> the bill.&nbsp;<script>alert(1)</script> The post Senate passes budget appeared first on Example.]]></description></item>
<item><title>Bad link item</title><link>javascript:alert(1)</link></item>
<item><title>Second story</title><link>https://example.ng/b</link><pubDate>Mon, 16 Nov 2026 08:00:00 GMT</pubDate><description>Plain text &#8217;quoted&#8217;</description></item></channel></rss>`;
const ATOM = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Atom headline</title><link rel="alternate" href="https://atom.ng/1"/><updated>2026-11-17T10:00:00Z</updated><summary>Atom summary</summary></entry></feed>`;

let server, base, dir;
const feeds = [{ name: "A", url: "https://a.test/feed" }, { name: "B", url: "https://b.test/feed" }, { name: "Down", url: "https://down.test/feed" }];
let mode = "ok";
const fakeFetch = async (url) => {
  if (mode === "alldown" || url.includes("down.test")) throw new Error("network");
  return { ok: true, text: async () => (url.includes("b.test") ? ATOM : RSS) };
};

before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "hh-"));
  const app = await createApp({ dataDir: dir, newsOptions: { feeds, fetchImpl: fakeFetch, ttl: 0, timeout: 500 } });
  await new Promise((r) => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { server.close(); fs.rmSync(dir, { recursive: true, force: true }); });
beforeEach(() => { mode = "ok"; resetNewsCache(); });

const call = async (p, { method = "GET", body, token } = {}) => {
  const res = await fetch(base + p, { method, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, json: await res.json().catch(() => null) };
};
const register = (name, email, password = "secret123") => call("/api/auth/register", { method: "POST", body: { name, email, password } });
const today = () => new Date().toISOString().slice(0, 10);

test("health", async () => { assert.equal((await call("/api/health")).json.ok, true); });

test("register validates input", async () => {
  assert.equal((await register("", "a@b.co")).json.error, "invalid_name");
  assert.equal((await register("Ada", "nope")).json.error, "invalid_email");
  assert.equal((await register("Ada", "ada@x.co", "123")).json.error, "weak_password");
});

test("register, duplicate email, login", async () => {
  const r = await register("Chika", "chika@x.co");
  assert.equal(r.status, 201); assert.ok(r.json.token); assert.equal(r.json.user.name, "Chika"); assert.equal(r.json.user.email, "chika@x.co");
  assert.equal((await register("Other", "CHIKA@x.co")).status, 409);
  assert.equal((await call("/api/auth/login", { method: "POST", body: { email: "chika@x.co", password: "wrong" } })).status, 401);
  assert.equal((await call("/api/auth/login", { method: "POST", body: { email: "nobody@x.co", password: "secret123" } })).status, 401);
  const ok = await call("/api/auth/login", { method: "POST", body: { email: "Chika@X.co", password: "secret123" } });
  assert.equal(ok.status, 200);
  assert.equal((await call("/api/me", { token: ok.json.token })).json.user.email, "chika@x.co");
});

test("progress needs auth; PUT sanitises and merges (never goes backwards)", async () => {
  assert.equal((await call("/api/progress")).status, 401);
  const { json: { token } } = await register("Tunde", "tunde@x.co");
  const put1 = await call("/api/progress", { method: "PUT", token, body: { progress: { name: "<b>Tunde</b>", xp: 999999999, streak: 5, learned: { history: ["nok", "benin"], hacked: ["x"] }, quizzes: { history: { best: 80, plays: 2 }, evil: { best: 100, plays: 1 } }, xpByDay: { [today()]: 50, "not-a-date": 9 } } } });
  assert.equal(put1.status, 200);
  const p = put1.json.progress;
  assert.equal(p.name, "bTunde/b");               // angle brackets stripped
  assert.equal(p.xp, 1_000_000);                  // clamped
  assert.deepEqual(p.learned.history, ["nok", "benin"]);
  assert.equal(p.learned.hacked, undefined);      // unknown module dropped
  assert.equal(p.quizzes.evil, undefined);        // unknown quiz dropped
  assert.equal(p.xpByDay["not-a-date"], undefined);
  const put2 = await call("/api/progress", { method: "PUT", token, body: { progress: { name: "Tunde", xp: 10, learned: { history: ["oyo"] } } } });
  assert.equal(put2.json.progress.xp, 1_000_000);                                  // lower xp can't overwrite
  assert.deepEqual(put2.json.progress.learned.history.sort(), ["benin", "nok", "oyo"]); // union
  const got = await call("/api/progress", { token });
  assert.equal(got.json.progress.name, "Tunde");
  const del = await call("/api/progress", { method: "DELETE", token });
  assert.equal(del.json.progress.xp, 0); assert.equal(del.json.progress.name, "Tunde");
});

test("leaderboard ranks, honours range, never leaks emails", async () => {
  const a = (await register("Amaka", "amaka@x.co")).json.token;
  const b = (await register("Bola", "bola@x.co")).json.token;
  const c = (await register("Chidi", "chidi@x.co")).json.token;
  await call("/api/progress", { method: "PUT", token: a, body: { progress: { name: "Amaka", xp: 500, lastDay: today(), streak: 4, xpByDay: { [today()]: 20 } } } });
  await call("/api/progress", { method: "PUT", token: b, body: { progress: { name: "Bola", xp: 300, lastDay: today(), streak: 2, xpByDay: { [today()]: 90 } } } });
  await call("/api/progress", { method: "PUT", token: c, body: { progress: { name: "Chidi" } } });
  const all = await call("/api/leaderboard?range=all", { token: b });
  assert.deepEqual(all.json.entries.map((e) => e.name).slice(0, 2), ["Amaka", "Bola"]);
  assert.equal(all.json.me.name, "Bola"); assert.equal(all.json.me.rank, 2);
  assert.ok(all.json.entries.find((e) => e.name === "Bola").you);
  const week = await call("/api/leaderboard?range=week");
  assert.equal(week.json.entries[0].name, "Bola");          // 90 XP this week beats 20
  assert.equal(week.json.me, null);                         // anonymous viewer
  assert.ok(!week.json.entries.some((e) => e.name === "Chidi")); // zero XP not listed
  assert.ok(!JSON.stringify(all.json).includes("@x.co"));   // no emails
});

test("delete account requires the password", async () => {
  const { json: { token } } = await register("Zainab", "zainab@x.co");
  assert.equal((await call("/api/me", { method: "DELETE", token, body: { password: "nope" } })).status, 403);
  assert.equal((await call("/api/me", { method: "DELETE", token, body: { password: "secret123" } })).status, 200);
  assert.equal((await call("/api/me", { token })).status, 401);
});

test("RSS/Atom parsing strips markup, blocks unsafe links, decodes entities", () => {
  const items = parseFeed(RSS, "Example");
  assert.equal(items.length, 2);                              // javascript: link dropped
  assert.equal(items[0].title, "Senate passes budget & more");
  assert.ok(!/script|alert|<|post .* appeared/i.test(items[0].summary), items[0].summary);
  assert.match(items[0].summary, /The Senate on Tuesday passed the bill\./);
  assert.equal(items[1].summary, "Plain text ’quoted’");
  assert.equal(items[0].publishedAt, "2026-11-17T08:00:00.000Z");
  const atom = parseFeed(ATOM, "Atom");
  assert.equal(atom[0].link, "https://atom.ng/1"); assert.equal(atom[0].title, "Atom headline");
  assert.equal(cleanText("x".repeat(500), 50).length, 50);
});

test("/api/news merges sources, survives a failing feed, 503s when all are down", async () => {
  const ok = await call("/api/news");
  assert.equal(ok.status, 200);
  assert.deepEqual(ok.json.failed, ["Down"]);
  assert.deepEqual(ok.json.items.map((i) => i.source).sort(), ["A", "A", "B"]);
  assert.equal(ok.json.items[0].source, "B");                 // newest first
  resetNewsCache(); mode = "alldown";
  const down = await call("/api/news");
  assert.equal(down.status, 503); assert.equal(down.json.error, "news_unavailable");
});

test("unknown api route and bad json", async () => {
  assert.equal((await call("/api/nope")).status, 404);
  const res = await fetch(base + "/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: "{oops" });
  assert.equal(res.status, 400);
});
