import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import QRCode from "qrcode"
import { getStatus, getQR, logout } from "../whatsapp-client.js"

const router = Router()

router.get("/whatsapp/status", requireAuth, (req, res) => {
  res.json(getStatus())
})

router.get("/whatsapp/qr", requireAuth, async (req, res) => {
  try {
    const qr = getQR()
    if (!qr) return res.json({ qr: null, status: getStatus() })
    const dataUrl = await QRCode.toDataURL(qr, {
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    })
    res.json({ qr: dataUrl, status: getStatus() })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post("/whatsapp/logout", requireAuth, async (req, res) => {
  try {
    await logout()
    res.json({ message: "Logged out" })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
