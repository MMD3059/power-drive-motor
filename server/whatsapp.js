import { sendMessage, getStatus } from "./whatsapp-client.js"

export async function sendWhatsAppNotification(type, data) {
  const status = getStatus()
  const adminPhone = process.env.ADMIN_PHONE

  const waLink = waUrl(adminPhone, data)

  if (status.status !== "connected" || !adminPhone) {
    return { sent: false, waLink }
  }

  let text = `*${type}*\n`
  text += `Name: ${data.name}\n`
  text += `Email: ${data.email}\n`
  if (data.phone) text += `Phone: ${data.phone}\n`
  if (data.subject) text += `Subject: ${data.subject}\n`
  if (data.message) text += `\n${data.message}`

  try {
    await sendMessage(adminPhone, text)
    console.log(`WhatsApp sent via Baileys for ${type} from ${data.name}`)
    return { sent: true, waLink }
  } catch (e) {
    console.error("WhatsApp send failed:", e.message)
    return { sent: false, error: e.message, waLink }
  }
}

function waUrl(phone, data) {
  if (!phone) return ""
  const p = phone.replace(/[^0-9]/g, "")
  if (p.length < 7) return ""
  let text = (data.subject || "")
  text += `\nName: ${data.name}\nEmail: ${data.email}`
  if (data.phone) text += `\nPhone: ${data.phone}`
  if (data.message) text += `\n\n${data.message}`
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`
}
