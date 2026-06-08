import { sendMessage as baileysSend, getStatus } from "./whatsapp-client.js"

const TWILIO_SID = process.env.TWILIO_SID
const TWILIO_TOKEN = process.env.TWILIO_TOKEN
const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP
const ADMIN_PHONE = process.env.ADMIN_PHONE

export async function sendWhatsAppNotification(type, data) {
  const waLink = waUrl(ADMIN_PHONE, data)

  // Twilio (priority)
  if (TWILIO_SID && TWILIO_TOKEN && TWILIO_WHATSAPP && ADMIN_PHONE) {
    return await sendViaTwilio(type, data, waLink)
  }

  // Baileys (fallback)
  if (getStatus().status === "connected" && ADMIN_PHONE) {
    return await sendViaBaileys(type, data, waLink)
  }

  return { sent: false, waLink }
}

async function sendViaTwilio(type, data, waLink) {
  let text = `*${type}*\n`
  text += `Name: ${data.name}\n`
  text += `Email: ${data.email}\n`
  if (data.phone) text += `Phone: ${data.phone}\n`
  if (data.subject) text += `Subject: ${data.subject}\n`
  if (data.message) text += `\n${data.message}`

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64")
    const body = new URLSearchParams({
      From: `whatsapp:${TWILIO_WHATSAPP}`,
      To: `whatsapp:${ADMIN_PHONE}`,
      Body: text,
    })

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })

    const result = await res.json()
    if (result.sid) {
      console.log(`WhatsApp sent via Twilio for ${type} from ${data.name}`)
      return { sent: true, waLink }
    }
    console.error("Twilio error:", result.message)
    return { sent: false, error: result.message, waLink }
  } catch (e) {
    console.error("Twilio send failed:", e.message)
    return { sent: false, error: e.message, waLink }
  }
}

async function sendViaBaileys(type, data, waLink) {
  let text = `*${type}*\n`
  text += `Name: ${data.name}\n`
  text += `Email: ${data.email}\n`
  if (data.phone) text += `Phone: ${data.phone}\n`
  if (data.subject) text += `Subject: ${data.subject}\n`
  if (data.message) text += `\n${data.message}`

  try {
    await baileysSend(ADMIN_PHONE, text)
    console.log(`WhatsApp sent via Baileys for ${type} from ${data.name}`)
    return { sent: true, waLink }
  } catch (e) {
    console.error("Baileys send failed:", e.message)
    return { sent: false, error: e.message, waLink }
  }
}

function waUrl(phone, data) {
  if (!phone) return ""
  const p = phone.replace(/[^0-9]/g, "")
  if (p.length < 7) return ""
  let text = data.subject || ""
  text += `\nName: ${data.name}\nEmail: ${data.email}`
  if (data.phone) text += `\nPhone: ${data.phone}`
  if (data.message) text += `\n\n${data.message}`
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`
}
