import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Send, Check, Loader2 } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { useLang } from "../i18n/context"

export default function Contact() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", consent: false })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.consent) {
      setError(t("contact.consentRequired"))
      return
    }
    setError("")
    setLoading(true)
    try {
      await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } catch {}
    setSubmitted(true)
    setForm({ name: "", email: "", phone: "", subject: "", message: "", consent: false })
    setLoading(false)
  }

  const contactInfo = [
    { icon: Phone, label: t("contact.phoneLabel"), value: "+1 605-501-2400", desc: t("contact.phoneDesc") },
    { icon: Mail, label: t("contact.emailLabel"), value: "Powerdrivemotorllc@gmail.com", desc: t("contact.emailDesc") },
    { icon: MapPin, label: t("contact.locationLabel"), value: "4309 E 12th St", desc: t("contact.locationDesc") },
    { icon: Clock, label: t("contact.hoursLabel"), value: "Mon-Fri: 9AM-6PM", desc: t("contact.hoursDesc") },
  ]

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={t("contact.subtitle")}
            title={t("contact.title")}
            description={t("contact.desc")}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">{t("contact.formTitle")}</h3>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-xl p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-neon-500/20 border border-neon-500/30 flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-neon-500" />
                </div>
                <h4 className="text-white text-xl font-bold mb-2">{t("contact.sentTitle")}</h4>
                <p className="text-dark-200 mb-6">{t("contact.sentDesc")}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all"
                >
                  {t("contact.sendAnother")}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-dark-200 tracking-wider uppercase mb-2">{t("contact.fullName")}</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40 focus:ring-1 focus:ring-neon-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-200 tracking-wider uppercase mb-2">{t("contact.email")}</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40 focus:ring-1 focus:ring-neon-500/20 transition-all"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-dark-200 tracking-wider uppercase mb-2">{t("contact.phone")}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 605-501-2400"
                      className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40 focus:ring-1 focus:ring-neon-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-200 tracking-wider uppercase mb-2">{t("contact.subject")}</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 cursor-pointer"
                    >
                      <option value="">{t("contact.selectSubject")}</option>
                      <option value="Vehicle Inquiry">{t("contact.subjectVehicle")}</option>
                      <option value="Financing">{t("contact.subjectFinancing")}</option>
                      <option value="Service Appointment">{t("contact.subjectService")}</option>
                      <option value="Trade-In">{t("contact.subjectTrade")}</option>
                      <option value="General">{t("contact.subjectGeneral")}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark-200 tracking-wider uppercase mb-2">{t("contact.message")}</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder={t("contact.messagePlaceholder")}
                    className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40 focus:ring-1 focus:ring-neon-500/20 transition-all resize-none"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} className="mt-1 accent-neon-500" />
                  <span className="text-dark-200 text-xs leading-relaxed">{t("contact.consent")}</span>
                </label>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                  {loading ? t("contact.sending") : t("contact.sendMessage")}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">{t("contact.contactInfo")}</h3>
            <div className="space-y-5 mb-10">
              {contactInfo.map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0">
                    <item.icon size={22} className="text-neon-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{item.label}</p>
                    <p className="text-dark-200 font-medium">{item.value}</p>
                    <p className="text-dark-300 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl overflow-hidden">
              <div className="aspect-[16/9] w-full relative">
                <iframe
                  src="https://maps.google.com/maps?q=4309+E+12th+St+Sioux+Falls+SD+57103&output=embed&z=15"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: "invert(0.9) hue-rotate(180deg) saturate(0.4)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Power Drive Motor Location"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-neon-500" />
                  <span className="text-dark-200 text-sm">4309 E 12th St, Sioux Falls, SD 57103</span>
                </div>
                <a
                  href="https://maps.google.com/?q=4309+E+12th+St+Sioux+Falls+SD+57103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 text-xs text-neon-500 border border-neon-500/30 rounded-lg hover:bg-neon-500/10 transition-all shrink-0"
                >
                  {t("contact.directions")}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
