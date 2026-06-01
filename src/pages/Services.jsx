import { motion } from "framer-motion"
import { Sparkles, Wrench, Banknote, RefreshCw, Star, Check } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { services } from "../data/services"
import { Link } from "react-router-dom"
import { useLang } from "../i18n/context"

const iconMap = {
  Sparkles, Wrench, Banknote, RefreshCw, Star,
}

export default function Services() {
  const { t } = useLang()

  const serviceKeys = {
    1: "sales",
    2: "finance",
    3: "maintenance",
    4: "detailing",
    5: "trade",
    6: "concierge",
  }
  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={t("services.subtitle")}
            title={t("services.title")}
            description={t("services.desc")}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Sparkles
            const sk = serviceKeys[service.id]
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-8 group hover:border-neon-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0 group-hover:bg-neon-500/20 transition-all">
                    <Icon size={32} className="text-neon-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-3">{t(`services.items.${sk}Title`)}</h3>
                    <p className="text-dark-200 text-sm leading-relaxed mb-5">{t(`services.items.${sk}Desc`)}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[1,2,3,4].map((j) => (
                        <div key={j} className="flex items-center gap-2 text-dark-200 text-xs">
                          <Check size={14} className="text-neon-500 shrink-0" />
                          {t(`services.items.${sk}Feat${j}`)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="relative py-12 md:py-20 bg-dark-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.04),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              {t("services.ctaTitle")}{" "}
              <span className="gradient-text">{t("services.ctaHighlight")}</span>
            </h2>
            <p className="text-dark-200 text-lg max-w-2xl mx-auto mb-10">
              {t("services.ctaDesc")}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_25px_rgba(0,212,255,0.3)]"
            >
              {t("services.ctaButton")}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
