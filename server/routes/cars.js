import { Router } from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import db from "../db.js"
import { requireAuth } from "../middleware/auth.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = process.env.DB_PATH
  ? path.join(path.dirname(process.env.DB_PATH || "/data/data.db"), "uploads")
  : path.join(__dirname, "..", "uploads")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp)$/i
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true)
    } else {
      cb(new Error("Only jpg, jpeg, png, webp allowed"))
    }
  },
})

const router = Router()

function parseCar(c) {
  return {
    ...c,
    features: JSON.parse(c.features || "[]"),
    images: JSON.parse(c.images || "[]"),
  }
}

router.get("/", (req, res) => {
  const cars = db.prepare("SELECT * FROM cars ORDER BY created_at DESC").all()
  res.json(cars.map(parseCar))
})

router.get("/:id", (req, res) => {
  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id)
  if (!car) return res.status(404).json({ error: "Car not found" })
  res.json(parseCar(car))
})

router.post("/", requireAuth, upload.array("images", 10), (req, res) => {
  const {
    name, brand, model, year, price, fuelType, transmission,
    engine, horsepower, mileage, seats, color, description, description_es, features, vin,
  } = req.body

  let images = []
  if (req.files && req.files.length > 0) {
    images = req.files.map((f) => `/uploads/${f.filename}`)
  }
  if (req.body.existingImages) {
    try {
      const existing = JSON.parse(req.body.existingImages)
      images = [...existing, ...images]
    } catch {}
  }
  if (images.length === 0 && req.body.image) {
    images = [req.body.image]
  }

  const image = images[0] || ""
  const imagesStr = JSON.stringify(images)
  const featuresStr = JSON.stringify(features ? (Array.isArray(features) ? features : JSON.parse(features)) : [])

  const stmt = db.prepare(`
    INSERT INTO cars (name, brand, model, year, price, fuelType, transmission, engine, horsepower, mileage, seats, color, image, images, description, description_es, features, sold, vin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const sold = req.body.sold ? (req.body.sold === "true" || req.body.sold === true ? 1 : 0) : 0

  const result = stmt.run(
    name, brand, model, parseInt(year), parseFloat(price),
    fuelType || "Petrol", transmission || "Automatic", engine || "",
    parseInt(horsepower) || 0, parseInt(mileage) || 0, parseInt(seats) || 5,
    color || "", image, imagesStr, description || "", description_es || "", featuresStr, sold, vin || ""
  )

  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(result.lastInsertRowid)
  car.features = JSON.parse(car.features)
  car.images = JSON.parse(car.images || "[]")
  res.status(201).json(car)
})

router.put("/:id", requireAuth, upload.array("images", 10), (req, res) => {
  const existing = db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id)
  if (!existing) return res.status(404).json({ error: "Car not found" })

  const {
    name, brand, model, year, price, fuelType, transmission,
    engine, horsepower, mileage, seats, color, description, description_es, features, vin,
  } = req.body

  let images = []
  let hasExistingImages = false
  if (req.body.existingImages) {
    hasExistingImages = true
    try { images = JSON.parse(req.body.existingImages) } catch {}
  }
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => `/uploads/${f.filename}`)
    images = [...images, ...newImages]
  }
  if (!hasExistingImages && images.length === 0) {
    try { images = JSON.parse(existing.images || "[]") } catch {}
    if (images.length === 0 && existing.image) images = [existing.image]
  }

  const image = images[0] || existing.image
  const imagesStr = JSON.stringify(images)
  const featuresStr = JSON.stringify(features ? (Array.isArray(features) ? features : JSON.parse(features)) : [])

  const sold = req.body.sold !== undefined ? (req.body.sold === "true" || req.body.sold === true ? 1 : 0) : existing.sold

  db.prepare(`
    UPDATE cars SET name=?, brand=?, model=?, year=?, price=?, fuelType=?, transmission=?, engine=?, horsepower=?, mileage=?, seats=?, color=?, image=?, images=?, description=?, description_es=?, features=?, sold=?, vin=?
    WHERE id=?
  `).run(
    name || existing.name, brand || existing.brand, model || existing.model,
    parseInt(year) || existing.year, parseFloat(price) || existing.price,
    fuelType || existing.fuelType, transmission || existing.transmission,
    engine || existing.engine, parseInt(horsepower) || existing.horsepower,
    parseInt(mileage) || existing.mileage, parseInt(seats) || existing.seats,
    color || existing.color, image, imagesStr, description || existing.description,
    description_es || existing.description_es || "", featuresStr, sold,
    vin || existing.vin || "", req.params.id
  )

  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id)
  car.features = JSON.parse(car.features)
  car.images = JSON.parse(car.images || "[]")
  res.json(car)
})

router.patch("/:id/sold", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id)
  if (!existing) return res.status(404).json({ error: "Car not found" })

  const newSold = existing.sold ? 0 : 1
  db.prepare("UPDATE cars SET sold = ? WHERE id = ?").run(newSold, req.params.id)
  res.json({ id: existing.id, sold: newSold })
})

function deleteImageFile(imgPath) {
  if (imgPath && imgPath.startsWith("/uploads/")) {
    const filePath = path.join(uploadsDir, path.basename(imgPath))
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }
}

router.delete("/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id)
  if (!existing) return res.status(404).json({ error: "Car not found" })

  deleteImageFile(existing.image)
  try {
    const allImages = JSON.parse(existing.images || "[]")
    allImages.forEach(deleteImageFile)
  } catch {}

  db.prepare("DELETE FROM cars WHERE id = ?").run(req.params.id)
  res.json({ message: "Car deleted" })
})

export default router
