import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"
import carRoutes from "./routes/cars.js"
import messageRoutes from "./routes/messages.js"

import db from "./db.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// Auto-seed after server starts
setTimeout(async () => {
  try {
    await import("./seed.js")
  } catch (e) {
    console.error("Seed failed:", e.stack || e.message)
  }
}, 1000)

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/api/debug", (req, res) => {
  try {
    const cols = db.prepare("PRAGMA table_info(cars)").all()
    res.json(cols)
  } catch (e) {
    res.json({ error: e.message })
  }
})

app.use("/api/PDM-admin", authRoutes)
app.use("/api/cars", carRoutes)
app.use("/api/messages", messageRoutes)

const distPath = path.join(__dirname, "..", "dist")
app.use(express.static(distPath))
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"))
})

app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack || err.message || err)
  res.status(500).json({ error: err.message || "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
