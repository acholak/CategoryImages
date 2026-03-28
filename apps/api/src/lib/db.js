'use strict';

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/images.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id          TEXT PRIMARY KEY,
    category    TEXT NOT NULL,
    market      TEXT NOT NULL,
    angle       TEXT NOT NULL,
    notes       TEXT,
    url_1       TEXT NOT NULL,
    url_2       TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
  CREATE INDEX IF NOT EXISTS idx_images_created_at ON images (created_at DESC);
`);

const INSERT = db.prepare(`
  INSERT INTO images (id, category, market, angle, notes, url_1, url_2)
  VALUES (@id, @category, @market, @angle, @notes, @url_1, @url_2)
`);

const LIST = db.prepare(`
  SELECT * FROM images ORDER BY created_at DESC LIMIT @limit OFFSET @offset
`);

const COUNT = db.prepare(`SELECT COUNT(*) AS total FROM images`);

const GET = db.prepare(`SELECT * FROM images WHERE id = ?`);

module.exports = {
  saveImage: (record) => INSERT.run(record),
  listImages: (page = 1, pageSize = 20) => ({
    items: LIST.all({ limit: pageSize, offset: (page - 1) * pageSize }),
    total: COUNT.get().total,
  }),
  getImage: (id) => GET.get(id),
};
