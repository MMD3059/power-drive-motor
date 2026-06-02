import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Check, Loader2 } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { useLang } from "../i18n/context"

export default function TradeIn() {
  const { t } = useLang()
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", zip: "",
    year: "", make: "", model: "", mileage: "", condition: "good",
    contactMethod: "call", consent: false,
  })
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
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          subject: `Trade-In: ${form.year} ${form.make} ${form.model}`,
          message: JSON.stringify(form, null, 2),
          type: "trade-in",
        }),
      })
    } catch {}
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-xl p-10">
            <div className="w-16 h-16 rounded-full bg-neon-500/20 border border-neon-500/30 flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-neon-500" />
            </div>
            <h4 className="text-white text-xl font-bold mb-2">{t("tradeIn.sentTitle")}</h4>
            <p className="text-dark-200 mb-6">{t("tradeIn.sentDesc")}</p>
            <button onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", phone: "", zip: "", year: "", make: "", model: "", mileage: "", condition: "good", contactMethod: "call", consent: false }) }} className="px-6 py-3 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all">
              {t("tradeIn.submitAnother")}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle={t("tradeIn.subtitle")} title={t("tradeIn.title")} description={t("tradeIn.desc")} />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-2xl font-bold text-white mb-8">{t("tradeIn.formTitle")}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-5">
              <h4 className="text-neon-500 font-semibold text-sm tracking-wider uppercase">{t("tradeIn.contactInfo")}</h4>
              <div className="grid sm:grid-cols-2 gap-5">
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required placeholder={t("tradeIn.firstName")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required placeholder={t("tradeIn.lastName")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder={t("tradeIn.email")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder={t("tradeIn.phone")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
              </div>
              <input type="text" name="zip" value={form.zip} onChange={handleChange} required placeholder={t("tradeIn.zip")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
            </div>

            <div className="glass-card rounded-xl p-6 space-y-5">
              <h4 className="text-neon-500 font-semibold text-sm tracking-wider uppercase">{t("tradeIn.vehicleInfo")}</h4>
              <div className="grid sm:grid-cols-3 gap-5">
                <input type="text" name="year" value={form.year} onChange={handleChange} required placeholder={t("tradeIn.year")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
                <input type="text" name="make" value={form.make} onChange={handleChange} required placeholder={t("tradeIn.make")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
                <input type="text" name="model" value={form.model} onChange={handleChange} required placeholder={t("tradeIn.model")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <input type="number" name="mileage" value={form.mileage} onChange={handleChange} required placeholder={t("tradeIn.mileage")} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40" />
                <select name="condition" value={form.condition} onChange={handleChange} className="w-full px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 cursor-pointer">
                  <option value="excellent">{t("tradeIn.excellent")}</option>
                  <option value="good">{t("tradeIn.good")}</option>
                  <option value="fair">{t("tradeIn.fair")}</option>
                </select>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 space-y-4">
              <h4 className="text-neon-500 font-semibold text-sm tracking-wider uppercase">{t("tradeIn.contactMethod")}</h4>
              <div className="flex gap-4">
                {["call", "sms", "email"].map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="contactMethod" value={method} checked={form.contactMethod === method} onChange={handleChange} className="accent-neon-500" />
                    <span className="text-white text-sm">{t(`tradeIn.${method}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} className="mt-1 accent-neon-500" />
              <span className="text-dark-200 text-xs leading-relaxed">{t("contact.consent")}</span>
            </label>
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all disabled:opacity-70">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              {loading ? t("tradeIn.sending") : t("tradeIn.submit")}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}