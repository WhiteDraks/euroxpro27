// Tiny JSON-file store. Good for a congress-sized app (a few thousand users)
// and needs no database server, so it runs on any Node host with a disk.
"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", process.env.DATA_DIR || "data");
const FILE = path.join(DATA_DIR, "db.json");

function emptyDb() {
  return {
    users: [], // { id, email, name, entity, lang, passHash, salt, role, createdAt }
    sessions: {}, // tokenHash -> { userId, expires }
    messages: [], // { id, conv, from, text, lang, at, t: { [lang]: text } }
    reads: {}, // userId -> { conv: lastReadAt }
    agenda: null,
  };
}

let db = emptyDb();
let saveTimer = null;

function load(seedAgenda) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(FILE)) {
    db = Object.assign(emptyDb(), JSON.parse(fs.readFileSync(FILE, "utf8")));
  }
  if (!db.agenda) db.agenda = seedAgenda;
  saveNow();
  return db;
}

function saveNow() {
  clearTimeout(saveTimer);
  saveTimer = null;
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, FILE); // atomic swap, never leaves a half-written file
}

function save() {
  if (!saveTimer) saveTimer = setTimeout(saveNow, 250);
}

module.exports = { load, save, saveNow, get db() { return db; } };
