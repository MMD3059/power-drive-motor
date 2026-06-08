import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MessageCircle, RefreshCw, Smartphone, LogOut, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

export default function AdminWhatsApp() {
  const [status, setStatus] = useState({ status: "disconnected", hasQR: false, phone: null })
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("admin-token")
  const intervalRef = useRef(null)

  const fetchStatus = async () => {
    try {
      const r = await fetch(`${API}/whatsapp/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      setStatus(data)
      if (data.status === "waiting_for_scan") {
        const qrRes = await fetch(`${API}/whatsapp/qr`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const qrData = await qrRes.json()
        setQrDataUrl(qrData.qr)
      } else {
        setQrDataUrl(null)
      }
    } catch (e) {
      console.error("WA status error:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    intervalRef.current = setInterval(fetchStatus, 3000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const handleLogout = async () => {
    if (!confirm("Log out WhatsApp? You'll need to scan QR again.")) return
    await fetch(`${API}/whatsapp/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    setStatus({ status: "disconnected", hasQR: false, phone: null })
    setQrDataUrl(null)
  }

  const StatusIcon = status.status === "connected" ? CheckCircle
    : status.status === "waiting_for_scan" ? Smartphone
    : status.status === "logged_out" ? AlertTriangle
    : XCircle

  const statusColor = status.status === "connected" ? "text-green-500"
    : status.status === "waiting_for_scan" ? "text-amber-500"
    : status.status === "logged_out" ? "text-red-500"
    : "text-dark-200"

  const statusText = status.status === "connected" ? "Connected"
    : status.status === "waiting_for_scan" ? "Waiting for Scan"
    : status.status === "logged_out" ? "Logged Out — Reconnecting..."
    : "Disconnected"

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <MessageCircle size={24} className="text-green-500" />
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">WhatsApp Connection</h1>
          <p className="text-dark-300 text-sm">Connect your WhatsApp to receive automatic notifications</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Status</h2>
            <button onClick={fetchStatus} className="p-2 rounded-lg text-dark-200 hover:text-white hover:bg-dark-700/50 transition-all">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <StatusIcon size={32} className={statusColor} />
            <div>
              <p className={`font-semibold ${statusColor}`}>{statusText}</p>
              {status.phone && (
                <p className="text-dark-200 text-sm mt-1">{status.phone}</p>
              )}
            </div>
          </div>

          {status.status === "connected" && (
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all">
              <LogOut size={16} />
              Log Out WhatsApp
            </button>
          )}
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">
            {status.status === "waiting_for_scan" ? "Scan QR Code" : "How to Connect"}
          </h2>

          {status.status === "waiting_for_scan" && qrDataUrl ? (
            <div className="flex flex-col items-center">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={qrDataUrl}
                alt="WhatsApp QR Code"
                className="w-64 h-64 rounded-xl bg-white p-2"
              />
              <p className="text-dark-200 text-sm mt-4 text-center">
                Open <strong className="text-white">WhatsApp</strong> on your phone<br />
                Tap <strong className="text-white">Menu</strong> → <strong className="text-white">Linked Devices</strong><br />
                Tap <strong className="text-white">Link a Device</strong> → Scan this QR
              </p>
            </div>
          ) : (
            <div className="text-dark-200 text-sm space-y-3">
              <p>1. Open <strong className="text-white">WhatsApp</strong> on your phone</p>
              <p>2. Tap <strong className="text-white">Menu ⋮</strong> → <strong className="text-white">Linked Devices</strong></p>
              <p>3. Tap <strong className="text-white">Link a Device</strong></p>
              <p className="text-amber-500 text-xs mt-4">
                <AlertTriangle size={12} className="inline mr-1" />
                QR code appears automatically when disconnected. Just wait.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-xl p-6 mt-6">
        <h2 className="text-white font-semibold mb-3">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-dark-700/30 rounded-xl p-4">
            <p className="text-neon-500 font-bold mb-1">1. Connect</p>
            <p className="text-dark-200">Scan QR once — session saved permanently</p>
          </div>
          <div className="bg-dark-700/30 rounded-xl p-4">
            <p className="text-neon-500 font-bold mb-1">2. Auto-Notify</p>
            <p className="text-dark-200">New contact/credit/trade-in/test-drive → WhatsApp</p>
          </div>
          <div className="bg-dark-700/30 rounded-xl p-4">
            <p className="text-neon-500 font-bold mb-1">3. Survives Restarts</p>
            <p className="text-dark-200">Session saved on persistent disk — no re-scan needed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
