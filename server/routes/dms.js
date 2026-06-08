import { Router } from "express"
import db from "../db.js"
import { requireAuth } from "../middleware/auth.js"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = Router()

function parse(field) {
  try { return JSON.parse(field) } catch { return [] }
}

// ===================== CUSTOMERS =====================
router.get("/customers", requireAuth, (req, res) => {
  const q = req.query.q || ""
  const status = req.query.status || ""
  let sql = "SELECT * FROM customers WHERE (name LIKE ? OR email LIKE ? OR phone LIKE ?)"
  const params = [`%${q}%`, `%${q}%`, `%${q}%`]
  if (status) { sql += " AND status = ?"; params.push(status) }
  sql += " ORDER BY created_at DESC"
  res.json(db.prepare(sql).all(...params))
})

router.get("/customers/:id", requireAuth, (req, res) => {
  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id)
  if (!customer) return res.status(404).json({ error: "Not found" })
  customer.deals = db.prepare("SELECT d.*, c.name as car_name, c.price as car_price FROM deals d LEFT JOIN cars c ON d.car_id = c.id WHERE d.customer_id = ? ORDER BY d.created_at DESC").all(req.params.id)
  customer.activities = db.prepare("SELECT * FROM activities WHERE customer_id = ? ORDER BY created_at DESC").all(req.params.id)
  res.json(customer)
})

router.post("/customers", requireAuth, (req, res) => {
  const { name, email, phone, source, notes, status, interest } = req.body
  if (!name) return res.status(400).json({ error: "Name required" })
  const r = db.prepare("INSERT INTO customers (name, email, phone, source, notes, status, interest) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    name, email || "", phone || "", source || "manual", notes || "", status || "lead", interest || ""
  )
  res.json({ id: r.lastInsertRowid })
})

router.put("/customers/:id", requireAuth, (req, res) => {
  const { name, email, phone, source, notes, status, interest } = req.body
  db.prepare("UPDATE customers SET name=?, email=?, phone=?, source=?, notes=?, status=?, interest=?, updated_at=datetime('now') WHERE id=?").run(
    name, email || "", phone || "", source || "", notes || "", status || "lead", interest || "", req.params.id
  )
  res.json({ ok: true })
})

router.delete("/customers/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id)
  db.prepare("DELETE FROM deals WHERE customer_id = ?").run(req.params.id)
  db.prepare("DELETE FROM activities WHERE customer_id = ?").run(req.params.id)
  res.json({ ok: true })
})

// ===================== DEALS =====================
router.get("/deals", requireAuth, (req, res) => {
  const status = req.query.status || ""
  let sql = "SELECT d.*, c.name as customer_name, cr.name as car_name, cr.price as car_price FROM deals d LEFT JOIN customers c ON d.customer_id = c.id LEFT JOIN cars cr ON d.car_id = cr.id"
  const params = []
  if (status) { sql += " WHERE d.status = ?"; params.push(status) }
  sql += " ORDER BY d.created_at DESC"
  res.json(db.prepare(sql).all(...params))
})

router.post("/deals", requireAuth, (req, res) => {
  const { customerId, carId, status, price, notes } = req.body
  const r = db.prepare("INSERT INTO deals (customer_id, car_id, status, price, notes) VALUES (?, ?, ?, ?, ?)").run(
    customerId, carId || null, status || "negotiation", price || 0, notes || ""
  )
  db.prepare("UPDATE customers SET status = 'deal', updated_at = datetime('now') WHERE id = ?").run(customerId)
  db.prepare("INSERT INTO activities (customer_id, type, description) VALUES (?, ?, ?)").run(customerId, "deal", `New deal created: $${price || 0}`)
  res.json({ id: r.lastInsertRowid })
})

router.put("/deals/:id", requireAuth, (req, res) => {
  const { status, price, notes } = req.body
  db.prepare("UPDATE deals SET status=?, price=?, notes=?, updated_at=datetime('now') WHERE id=?").run(
    status || "negotiation", price || 0, notes || "", req.params.id
  )
  const deal = db.prepare("SELECT customer_id, status FROM deals WHERE id = ?").get(req.params.id)
  if (deal) {
    db.prepare("INSERT INTO activities (customer_id, type, description) VALUES (?, ?, ?)").run(deal.customer_id, "deal", `Deal updated to: ${status || "negotiation"}`)
    if (status === "sold" || status === "lost") {
      db.prepare("UPDATE customers SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, deal.customer_id)
    }
  }
  res.json({ ok: true })
})

// ===================== ACTIVITIES =====================
router.post("/activities", requireAuth, (req, res) => {
  const { customerId, type, description } = req.body
  const r = db.prepare("INSERT INTO activities (customer_id, type, description) VALUES (?, ?, ?)").run(customerId, type || "note", description || "")
  res.json({ id: r.lastInsertRowid })
})

// ===================== REPORTS =====================
router.get("/reports/summary", requireAuth, (req, res) => {
  const totalCars = db.prepare("SELECT count(*) as c FROM cars").get().c
  const soldCars = db.prepare("SELECT count(*) as c FROM cars WHERE sold = 1").get().c
  const available = totalCars - soldCars
  const totalLeads = db.prepare("SELECT count(*) as c FROM customers").get().c
  const totalMessages = db.prepare("SELECT count(*) as c FROM messages").get().c
  const activeDeals = db.prepare("SELECT count(*) as c FROM deals WHERE status NOT IN ('sold','lost')").get().c
  const soldDeals = db.prepare("SELECT count(*) as c FROM deals WHERE status = 'sold'").get().c
  const totalRevenue = db.prepare("SELECT coalesce(sum(price), 0) as c FROM deals WHERE status = 'sold'").get().c

  const leadsBySource = db.prepare("SELECT source, count(*) as count FROM customers GROUP BY source ORDER BY count DESC").all()
  const dealsByStatus = db.prepare("SELECT status, count(*) as count FROM deals GROUP BY status ORDER BY count DESC").all()
  const dealsByMonth = db.prepare(`
    SELECT strftime('%Y-%m', created_at) as month, count(*) as count, coalesce(sum(price), 0) as revenue
    FROM deals WHERE status = 'sold' GROUP BY month ORDER BY month DESC LIMIT 12
  `).all()
  const recentLeads = db.prepare("SELECT * FROM customers ORDER BY created_at DESC LIMIT 5").all()

  res.json({ totalCars, soldCars, available, totalLeads, totalMessages, activeDeals, soldDeals, totalRevenue, leadsBySource, dealsByStatus, dealsByMonth, recentLeads })
})

router.get("/reports/inventory", requireAuth, (req, res) => {
  const byBrand = db.prepare("SELECT brand, count(*) as count, coalesce(sum(price), 0) as total FROM cars WHERE sold = 0 GROUP BY brand ORDER BY count DESC").all()
  const byYear = db.prepare("SELECT year, count(*) as count FROM cars WHERE sold = 0 GROUP BY year ORDER BY year DESC").all()
  const avgPrice = db.prepare("SELECT coalesce(round(avg(price)), 0) as avg FROM cars WHERE sold = 0").get().avg
  const avgMileage = db.prepare("SELECT coalesce(round(avg(mileage)), 0) as avg FROM cars WHERE sold = 0").get().avg
  res.json({ byBrand, byYear, avgPrice, avgMileage, total: db.prepare("SELECT count(*) as c FROM cars WHERE sold = 0").get().c })
})

// ===================== CSV IMPORT =====================
const upload = multer({
  dest: path.join(__dirname, "../uploads/temp/"),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith(".csv")) {
      return cb(new Error("Only CSV files allowed"), false)
    }
    cb(null, true)
  },
})

router.post("/csv/import", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" })
  const filePath = req.file.path
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const lines = content.split(/\r?\n/).filter(l => l.trim())
    if (lines.length < 2) return res.status(400).json({ error: "CSV must have header + data rows" })

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/["']/g, ""))
    const idx = (name) => headers.findIndex(h => h.includes(name))

    const mapped = {
      name: idx("name") >= 0 ? idx("name") : (idx("title") >= 0 ? idx("title") : -1),
      brand: idx("brand") >= 0 ? idx("brand") : (idx("make") >= 0 ? idx("make") : -1),
      model: idx("model") >= 0 ? idx("model") : -1,
      year: idx("year") >= 0 ? idx("year") : -1,
      price: idx("price") >= 0 ? idx("price") : -1,
      mileage: idx("mileage") >= 0 ? idx("mileage") : (idx("odometer") >= 0 ? idx("odometer") : -1),
      fuel: idx("fuel") >= 0 ? idx("fuel") : (idx("fueltype") >= 0 ? idx("fueltype") : -1),
      transmission: idx("transmission") >= 0 ? idx("transmission") : -1,
      engine: idx("engine") >= 0 ? idx("engine") : -1,
      horsepower: idx("horsepower") >= 0 ? idx("horsepower") : (idx("hp") >= 0 ? idx("hp") : -1),
      seats: idx("seats") >= 0 ? idx("seats") : -1,
      color: idx("color") >= 0 ? idx("color") : (idx("exterior") >= 0 ? idx("exterior") : -1),
      vin: idx("vin") >= 0 ? idx("vin") : -1,
      image: idx("image") >= 0 ? idx("image") : -1,
      description: idx("description") >= 0 ? idx("description") : -1,
    }

    const insert = db.prepare(`INSERT INTO cars (name, brand, model, year, price, mileage, fuelType, transmission, engine, horsepower, seats, color, vin, image, description, sold) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`)
    let imported = 0, skipped = 0, errors = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const vals = lines[i].split(",").map(v => v.trim().replace(/["']/g, ""))
        const name = mapped.name >= 0 ? vals[mapped.name] : ""
        const brand = mapped.brand >= 0 ? vals[mapped.brand] : ""
        const model = mapped.model >= 0 ? vals[mapped.model] : ""
        const year = parseInt(mapped.year >= 0 ? vals[mapped.year] : "0") || 0
        const price = parseFloat(mapped.price >= 0 ? vals[mapped.price] : "0") || 0
        if (!name || !brand || !year || !price) { skipped++; continue }
        const vin = mapped.vin >= 0 ? vals[mapped.vin] : ""
        const existing = db.prepare("SELECT id FROM cars WHERE vin = ? AND vin != ''").get(vin)
        if (existing) { skipped++; continue }
        insert.run(
          name, brand, model, year, price,
          parseInt(mapped.mileage >= 0 ? vals[mapped.mileage] : "0") || 0,
          mapped.fuel >= 0 ? vals[mapped.fuel] : "Petrol",
          mapped.transmission >= 0 ? vals[mapped.transmission] : "Automatic",
          mapped.engine >= 0 ? vals[mapped.engine] : "",
          parseInt(mapped.horsepower >= 0 ? vals[mapped.horsepower] : "0") || 0,
          parseInt(mapped.seats >= 0 ? vals[mapped.seats] : "5") || 5,
          mapped.color >= 0 ? vals[mapped.color] : "",
          vin,
          mapped.image >= 0 ? vals[mapped.image] : "",
          mapped.description >= 0 ? vals[mapped.description] : "",
        )
        imported++
      } catch (e) { errors.push(`Row ${i + 1}: ${e.message}`) }
    }

    fs.unlinkSync(filePath)
    res.json({ imported, skipped, errors, total: lines.length - 1 })
  } catch (e) {
    try { fs.unlinkSync(filePath) } catch {}
    res.status(500).json({ error: e.message })
  }
})

export default router
