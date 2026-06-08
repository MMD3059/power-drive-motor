import { Router } from "express"
import db from "../db.js"
import { requireAuth } from "../middleware/auth.js"
import { sendEmailNotification } from "../email.js"
import { sendWhatsAppNotification } from "../whatsapp.js"

const router = Router()

router.post("/", (req, res) => {
  const { name, email, phone, subject, message, type } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" })
  }

  db.prepare(
    "INSERT INTO messages (name, email, phone, subject, message, type) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(name, email, phone || "", subject || "", message, type || "contact")

  sendEmailNotification(type || "contact", { name, email, phone, subject, message })
  sendWhatsAppNotification(type || "contact", { name, email, phone, subject, message })

  res.status(201).json({ message: "Message sent successfully" })
})

router.get("/", requireAuth, (req, res) => {
  const messages = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all()
  res.json(messages)
})

router.delete("/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id)
  res.json({ message: "Message deleted" })
})

export default router
