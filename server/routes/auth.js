import { Router } from "express"
import bcrypt from "bcryptjs"
import db from "../db.js"
import { generateToken } from "../middleware/auth.js"

const router = Router()

router.post("/login", (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" })
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username)

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const token = generateToken(username)

  res.json({
    token,
    username: user.username,
    message: "Login successful",
  })
})

router.post("/setup", (req, res) => {
  const existing = db.prepare("SELECT count(*) as count FROM users").get()
  if (existing.count > 0) {
    return res.status(400).json({ error: "Admin already exists" })
  }

  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" })
  }

  const hashed = bcrypt.hashSync(password, 10)
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashed)

  const token = generateToken(username)

  res.json({ token, username, message: "Admin created successfully" })
})

export default router
