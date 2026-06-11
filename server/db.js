import Database from "better-sqlite3"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.DB_PATH || path.join(__dirname, "data.db")

const db = new Database(dbPath)

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price REAL NOT NULL,
    fuelType TEXT NOT NULL DEFAULT 'Gas',
    transmission TEXT NOT NULL DEFAULT 'Automatic',
    engine TEXT NOT NULL DEFAULT '',
    horsepower INTEGER NOT NULL DEFAULT 0,
    mileage INTEGER NOT NULL DEFAULT 0,
    seats INTEGER NOT NULL DEFAULT 5,
    color TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    description TEXT NOT NULL DEFAULT '',
    features TEXT NOT NULL DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'contact',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`)

// Migrations for existing tables
try { db.exec("ALTER TABLE cars ADD COLUMN images TEXT NOT NULL DEFAULT '[]'"); } catch {}
try { db.exec("ALTER TABLE cars ADD COLUMN sold INTEGER NOT NULL DEFAULT 0"); } catch {}
try { db.exec("ALTER TABLE cars ADD COLUMN description_es TEXT NOT NULL DEFAULT ''"); } catch {}
try { db.exec("ALTER TABLE cars ADD COLUMN vin TEXT NOT NULL DEFAULT ''"); } catch {}
try { db.exec("ALTER TABLE cars ADD COLUMN fb_commerce_id TEXT NOT NULL DEFAULT ''"); } catch {}
try { db.exec("ALTER TABLE cars ADD COLUMN fb_commerce_status TEXT NOT NULL DEFAULT ''"); } catch {}

// DMS tables
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT 'manual',
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'lead',
    interest TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    car_id INTEGER,
    status TEXT NOT NULL DEFAULT 'negotiation',
    price REAL,
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'note',
    description TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`)

// DMS migrations
try { db.exec("ALTER TABLE messages ADD COLUMN source TEXT NOT NULL DEFAULT 'contact'"); } catch {}
try { db.exec("ALTER TABLE messages ADD COLUMN customer_id INTEGER DEFAULT 0"); } catch {}

// Login attempt tracking
db.exec(`CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  ip TEXT NOT NULL DEFAULT '',
  success INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
)`)

// Lockout check: more than 5 failed attempts in last 15 minutes
export function isLockedOut(username, ip) {
  const row = db.prepare(`
    SELECT count(*) as count FROM login_attempts
    WHERE username = ? AND ip = ? AND success = 0
    AND datetime(created_at) > datetime('now', '-15 minutes')
  `).get(username, ip || "")
  return row.count >= 5
}

export function recordLoginAttempt(username, ip, success) {
  db.prepare("INSERT INTO login_attempts (username, ip, success) VALUES (?, ?, ?)").run(username, ip || "", success ? 1 : 0)
}

export default db
