import nodemailer from "nodemailer"

console.log("EMAIL_USER:", process.env.EMAIL_USER)
console.log("EMAIL_PASS set:", !!process.env.EMAIL_PASS)

const transporter = process.env.EMAIL_PASS
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "Powerdrivemotorllc@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    })
  : null

if (transporter) {
  transporter.verify((err) => {
    if (err) console.error("EMAIL TRANSPORT VERIFY FAILED:", err.message)
    else console.log("EMAIL TRANSPORT READY")
  })
}

const TYPE_SUBJECTS = {
  contact: "New Contact Message",
  credit: "New Credit Application",
  "trade-in": "New Trade-In Submission",
  "test-drive": "New Test Drive Booking",
}

export async function sendEmailNotification(type, data) {
  if (!process.env.EMAIL_PASS) return

  const subject = TYPE_SUBJECTS[type] || "New Message"
  let body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "N/A"}\n`

  if (data.subject) body += `Subject: ${data.subject}\n`
  if (data.message) body += `\n---\n${data.message}`

  try {
    await transporter.sendMail({
      from: `"Power Drive Motor" <${process.env.EMAIL_USER || "Powerdrivemotorllc@gmail.com"}>`,
      to: "Powerdrivemotorllc@gmail.com",
      subject: `${subject} - ${data.name}`,
      text: body,
    })
    console.log(`Email sent for ${type} from ${data.name}`)
  } catch (e) {
    console.error("Email send failed:", e.message)
  }
}