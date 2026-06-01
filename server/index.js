import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"
import carRoutes from "./routes/cars.js"
import messageRoutes from "./routes/messages.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

try {
  await import("./seed.js")
  console.log("Seed check complete")
} catch (err) {
  console.error("Seed error (non-fatal):", err.message)
}

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/PDM-admin", authRoutes)
app.use("/api/cars", carRoutes)
app.use("/api/messages", messageRoutes)

const distPath = path.join(__dirname, "..", "dist")
app.use(express.static(distPath))
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
