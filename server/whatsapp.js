const TWILIO_SID = process.env.TWILIO_SID
const TWILIO_TOKEN = process.env.TWILIO_TOKEN
const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP
const ADMIN_PHONE = process.env.ADMIN_PHONE

export async function sendWhatsAppNotification(type, data) {
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_WHATSAPP || !ADMIN_PHONE) {
    return { waLink: waUrl(ADMIN_PHONE, data) }
  }

  let text = `*${type}*\n`
  text += `Name: ${data.name}\n`
  text += `Email: ${data.email}\n`
  if (data.phone) text += `Phone: ${data.phone}\n`
  if (data.subject) text += `Subject: ${data.subject}\n`
  if (data.message) text += `\n${data.message}`

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`
    const auth = btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)
    const body = new URLSearchParams({
      From: `whatsapp:${TWILIO_WHATSAPP}`,
      To: `whatsapp:${ADMIN_PHONE}`,
      Body: text,
    })

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })

    const result = await res.json()
    if (result.sid) {
      console.log(`WhatsApp sent for ${type} from ${data.name}`)
      return { sent: true }
    } else {
      console.error("WhatsApp send failed:", result.message)
      return { sent: false, error: result.message }
    }
  } catch (e) {
    console.error("WhatsApp error:", e.message)
    return { sent: false, error: e.message }
  }
}

function waUrl(phone, data) {
  if (!phone) return ""
  const p = phone.replace(/[^0-9]/g, "")
  if (p.length < 7) return ""
  let text = `${data.subject || type}`
  text += `\nName: ${data.name}\nEmail: ${data.email}`
  if (data.phone) text += `\nPhone: ${data.phone}`
  if (data.message) text += `\n\n${data.message}`
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`
}
