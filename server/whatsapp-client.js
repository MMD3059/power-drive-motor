import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import pino from "pino"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const AUTH_DIR = process.env.DB_PATH
  ? path.join(path.dirname(process.env.DB_PATH), "wa-auth")
  : path.join(__dirname, "wa-auth")

let sock = null
let currentQR = null
let connectionStatus = "disconnected"
let connectedPhone = null
let statusSubscribers = []
let reconnectTimeout = null
let isInitializing = false

export function getStatus() {
  return { status: connectionStatus, hasQR: !!currentQR, phone: connectedPhone }
}

export function getQR() {
  return currentQR
}

export function onStatusChange(cb) {
  statusSubscribers.push(cb)
  return () => {
    statusSubscribers = statusSubscribers.filter((s) => s !== cb)
  }
}

function notify() {
  const s = getStatus()
  statusSubscribers.forEach((cb) => cb(s))
}

async function start() {
  if (isInitializing) return
  isInitializing = true

  try {
    const { version } = await fetchLatestBaileysVersion()
    console.log("Baileys version:", version)

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: "error" }),
      markOnlineOnConnect: false,
      syncFullHistory: false,
      browser: ["Power Drive Motor", "Chrome", "120.0.0.0"],
    })

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        currentQR = qr
        connectionStatus = "waiting_for_scan"
        notify()
      }

      if (connection === "open") {
        connectionStatus = "connected"
        currentQR = null
        try {
          connectedPhone = sock?.user?.id?.replace(/:.*/, "") || sock?.user?.name || null
        } catch {
          connectedPhone = null
        }
        notify()
        console.log("WhatsApp connected:", connectedPhone)
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode
        const statusMessage = lastDisconnect?.error?.output?.payload?.message || lastDisconnect?.error?.message
        console.log("WhatsApp closed, code:", statusCode, "msg:", statusMessage)

        currentQR = null
        connectedPhone = null

        if (statusCode === DisconnectReason.loggedOut) {
          connectionStatus = "logged_out"
          notify()
          try {
            if (fs.existsSync(AUTH_DIR)) {
              fs.rmSync(AUTH_DIR, { recursive: true, force: true })
              console.log("Deleted old auth files, fresh QR needed")
            }
          } catch (e) {
            console.error("Failed to delete auth dir:", e.message)
          }
          setTimeout(start, 1000)
        } else {
          connectionStatus = "disconnected"
          notify()
          if (statusCode !== DisconnectReason.restartRequired) {
            reconnectTimeout = setTimeout(start, 3000)
          }
        }
      }
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", () => {})

  } catch (e) {
    console.error("WhatsApp init error:", e.stack || e.message)
    connectionStatus = "error"
    notify()
    reconnectTimeout = setTimeout(start, 10000)
  } finally {
    isInitializing = false
  }
}

export async function sendMessage(to, text) {
  if (!sock || connectionStatus !== "connected") {
    throw new Error("WhatsApp not connected")
  }
  if (!to || to.replace(/[^0-9]/g, "").length < 7) {
    throw new Error("Invalid phone number")
  }
  const jid = `${to.replace(/[^0-9]/g, "")}@s.whatsapp.net`
  await sock.sendMessage(jid, { text })
}

export async function logout() {
  if (sock) {
    try {
      sock.ev.removeAllListeners("connection.update")
      sock.ev.removeAllListeners("creds.update")
      if (sock.ws?.close) sock.ws.close()
      if (sock.end) sock.end()
    } catch (e) {
      console.error("Logout error:", e.message)
    }
    sock = null
  }
  try {
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true })
    }
  } catch (e) {
    console.error("Failed to delete auth dir:", e.message)
  }
  currentQR = null
  connectionStatus = "disconnected"
  connectedPhone = null
  notify()
}

export async function forceRefresh() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
  if (sock) {
    try {
      sock.ev.removeAllListeners("connection.update")
      sock.ev.removeAllListeners("creds.update")
      if (sock.ws?.close) sock.ws.close()
      if (sock.end) sock.end()
    } catch (e) {
      console.error("Force refresh error:", e.message)
    }
    sock = null
  }
  currentQR = null
  connectionStatus = "disconnected"
  connectedPhone = null
  isInitializing = false
  notify()
  start()
}

start()

export { start }
