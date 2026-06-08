import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys"
import QRCode from "qrcode"
import path from "path"
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

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: "silent" }),
      markOnlineOnConnect: false,
      generateHighQualityLink: false,
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
        connectedPhone = sock?.user?.id?.split(":")?.[0] || sock?.user?.id || null
        notify()
        console.log("WhatsApp connected:", connectedPhone)
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode
        const shouldReconnect =
          statusCode !== DisconnectReason.loggedOut &&
          statusCode !== DisconnectReason.restartRequired

        currentQR = null
        connectedPhone = null

        if (statusCode === DisconnectReason.loggedOut) {
          connectionStatus = "logged_out"
          notify()
        } else {
          connectionStatus = "disconnected"
          notify()
        }

        if (shouldReconnect) {
          reconnectTimeout = setTimeout(start, 3000)
        }
      }
    })

    sock.ev.on("creds.update", saveCreds)
  } catch (e) {
    console.error("WhatsApp init error:", e.message)
    connectionStatus = "error"
    notify()
    reconnectTimeout = setTimeout(start, 10000)
  } finally {
    isInitializing = false
  }
}

export async function sendMessage(to, text) {
  if (!sock || (connectionStatus !== "connected")) {
    throw new Error("WhatsApp not connected")
  }
  const jid = `${to.replace(/[^0-9]/g, "")}@s.whatsapp.net`
  await sock.sendMessage(jid, { text })
}

export async function logout() {
  if (sock) {
    sock.ev.removeAllListeners("connection.update")
    sock.ev.removeAllListeners("creds.update")
    sock.logout()
    sock = null
  }
  currentQR = null
  connectionStatus = "disconnected"
  connectedPhone = null
  notify()
}

start()

export { start }
