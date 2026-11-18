// Tiny JSON-file datastore: fast, zero native dependencies, atomic writes.
// Swap for MongoDB/PostgreSQL later by re-implementing these few functions.
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
let file = null;
let db = null;
let queue = Promise.resolve();

export async function initDb(dir = process.env.DATA_DIR || path.join(HERE, "data")) {
  await fs.mkdir(dir, { recursive: true });
  file = path.join(dir, "db.json");
  try { db = JSON.parse(await fs.readFile(file, "utf8")); } catch { db = {}; }
  db.users ??= [];
  db.meta ??= {};
  db.meta.secret ??= crypto.randomBytes(48).toString("hex"); // dev fallback; set JWT_SECRET in production
  await save();
  return db;
}

export const data = () => db;

export function save() {
  queue = queue.then(async () => {
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db));
    await fs.rename(tmp, file);
  }).catch((e) => console.error("db write failed", e));
  return queue;
}

export const newId = () => crypto.randomUUID();
