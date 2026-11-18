// Live Nigerian headlines via public RSS/Atom feeds. We keep only headline, a short excerpt, source and link
// (always crediting and linking to the publisher) — never full article text or images.
import crypto from "node:crypto";
import { XMLParser } from "fast-xml-parser";

export const DEFAULT_FEEDS = [
  { name: "Premium Times", url: "https://www.premiumtimesng.com/feed" },
  { name: "Punch", url: "https://punchng.com/feed/" },
  { name: "Vanguard", url: "https://www.vanguardngr.com/feed/" },
  { name: "Channels TV", url: "https://www.channelstv.com/feed/" },
  { name: "The Guardian Nigeria", url: "https://guardian.ng/feed/" },
  { name: "Daily Trust", url: "https://dailytrust.com/feed/" },
  { name: "TheCable", url: "https://www.thecable.ng/feed" },
];

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", processEntities: true, trimValues: true });
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—" };

export function cleanText(v, max = 200) {
  let s = typeof v === "object" && v !== null ? String(v["#text"] ?? "") : String(v ?? "");
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ");
  s = s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Math.min(+n, 0x10ffff)))
       .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Math.min(parseInt(n, 16), 0x10ffff)))
       .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
  s = s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  s = s.replace(/\s*(The post .* appeared first on .*\.?|Read more.*)$/i, "").trim();
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

const safeUrl = (u) => { try { const x = new URL(String(u?.["@_href"] ?? u?.["#text"] ?? u ?? "").trim()); return /^https?:$/.test(x.protocol) ? x.href : null; } catch { return null; } };
const arr = (x) => (x === undefined ? [] : Array.isArray(x) ? x : [x]);

/** Parse an RSS 2.0 or Atom document into normalised items. */
export function parseFeed(xml, source) {
  let doc;
  try { doc = parser.parse(xml); } catch { return []; }
  const raw = doc?.rss?.channel ? arr(doc.rss.channel.item) : doc?.feed ? arr(doc.feed.entry) : [];
  const out = [];
  for (const it of raw) {
    const title = cleanText(it.title, 200);
    const linkNode = it.link && typeof it.link === "object" && !Array.isArray(it.link) && !it.link["@_href"] && !it["@_href"] ? it.link["#text"] : arr(it.link).find((l) => !l?.["@_rel"] || l["@_rel"] === "alternate") ?? it.link;
    const link = safeUrl(linkNode) || safeUrl(it.guid);
    const when = new Date(it.pubDate || it.published || it.updated || it["dc:date"] || Date.now());
    if (!title || !link) continue;
    out.push({
      id: crypto.createHash("sha1").update(link).digest("hex").slice(0, 12),
      title, link, source,
      publishedAt: Number.isNaN(+when) ? new Date().toISOString() : when.toISOString(),
      summary: cleanText(it.description ?? it.summary ?? it.content ?? "", 180),
    });
  }
  return out;
}

async function fetchFeed(feed, fetchImpl, timeout) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const res = await fetchImpl(feed.url, { signal: ctl.signal, headers: { "user-agent": "HeritageHub/1.0 (+education project)", accept: "application/rss+xml, application/xml, text/xml, */*" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseFeed(await res.text(), feed.name);
  } finally { clearTimeout(t); }
}

let cache = { at: 0, value: null };
export const resetNewsCache = () => { cache = { at: 0, value: null }; };

// Override the sources with NEWS_FEEDS='[{"name":"X","url":"https://…/feed"}]'
const envFeeds = () => { try { const f = JSON.parse(process.env.NEWS_FEEDS || "null"); return Array.isArray(f) && f.length ? f : null; } catch { return null; } };

export async function getNews({ feeds = envFeeds() || DEFAULT_FEEDS, fetchImpl = fetch, ttl = 10 * 60_000, timeout = 6000, perSource = 8, limit = 40 } = {}) {
  if (cache.value && Date.now() - cache.at < ttl) return cache.value;
  const results = await Promise.allSettled(feeds.map((f) => fetchFeed(f, fetchImpl, timeout)));
  const failed = [], items = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled" && r.value.length) items.push(...r.value.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, perSource));
    else failed.push(feeds[i].name);
  });
  const seen = new Set();
  const unique = items.filter((x) => { const k = x.title.toLowerCase().slice(0, 80); if (seen.has(x.link) || seen.has(k)) return false; seen.add(x.link); seen.add(k); return true; })
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, limit);
  if (!unique.length) {
    if (cache.value) return { ...cache.value, stale: true };   // serve the last good copy if every feed is down
    const err = new Error("news_unavailable"); err.failed = failed; throw err;
  }
  cache = { at: Date.now(), value: { updatedAt: new Date().toISOString(), items: unique, failed } };
  return cache.value;
}
