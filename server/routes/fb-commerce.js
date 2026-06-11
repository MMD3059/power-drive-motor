import { Router } from "express"
import db from "../db.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.post("/fb/save-config", requireAuth, (req, res) => {
  const { catalogId, accessToken } = req.body
  if (!catalogId || !accessToken) return res.status(400).json({ error: "Missing catalogId or accessToken" })
  const upsert = db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES (?, ?)")
  upsert.run("fb_catalog_id", catalogId)
  upsert.run("fb_access_token", accessToken)
  res.json({ ok: true })
})

router.get("/fb/config", requireAuth, (req, res) => {
  const get = (key) => { const r = db.prepare("SELECT value FROM admin_settings WHERE key = ?").get(key); return r?.value || "" }
  const catalogId = get("fb_catalog_id")
  const accessToken = get("fb_access_token")
  res.json({ catalogId, hasToken: !!accessToken })
})

router.post("/fb/commerce/add", requireAuth, (req, res) => {
  const { carId } = req.body
  if (!carId) return res.status(400).json({ error: "Missing carId" })

  const get = (key) => { const r = db.prepare("SELECT value FROM admin_settings WHERE key = ?").get(key); return r?.value || "" }
  const catalogId = get("fb_catalog_id")
  const accessToken = get("fb_access_token")

  if (!catalogId || !accessToken) return res.status(400).json({ error: "Facebook not configured" })

  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(carId)
  if (!car) return res.status(404).json({ error: "Car not found" })

  const productData = {
    title: car.name,
    description: car.description || "Excellent condition, well maintained. Contact us for more details.",
    price: car.price.toString(),
    currency: "USD",
    condition: "used",
    image_url: car.image,
    additional_image_urls: car.images ? JSON.parse(car.images).filter(Boolean) : [],
    inventory: car.sold ? 0 : 1,
    visibility: car.sold ? "draft" : "published",
    google_product_category: "VEHICLES",
    brand: car.brand,
    vehicle_attributes: {
      make: car.brand,
      model: car.model,
      year: car.year,
      mileage: { value: car.mileage, unit: "miles" },
      fuel_type: car.fuelType || "Gas",
      transmission: car.transmission || "Automatic",
      exterior_color: car.color || "",
      engine: car.engine || "",
      horsepower: car.horsepower,
      seats: car.seats,
    },
  }

  const url = `https://graph.facebook.com/v22.0/${catalogId}/products`

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...productData, access_token: accessToken }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.id) {
        db.prepare("UPDATE cars SET fb_commerce_id = ?, fb_commerce_status = ? WHERE id = ?").run(data.id, "posted", carId)
        res.json({ ok: true, fbId: data.id })
      } else {
        const msg = data.error?.message || "Facebook API error"
        db.prepare("UPDATE cars SET fb_commerce_status = ? WHERE id = ?").run("failed", carId)
        res.status(400).json({ error: msg, fbError: data.error })
      }
    })
    .catch((err) => {
      db.prepare("UPDATE cars SET fb_commerce_status = ? WHERE id = ?").run("failed", carId)
      res.status(500).json({ error: err.message })
    })
})

router.post("/fb/commerce/remove", requireAuth, (req, res) => {
  const { carId } = req.body
  if (!carId) return res.status(400).json({ error: "Missing carId" })
  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(carId)
  if (!car) return res.status(404).json({ error: "Car not found" })
  db.prepare("UPDATE cars SET fb_commerce_id = '', fb_commerce_status = '' WHERE id = ?").run(carId)
  res.json({ ok: true })
})

export default router
