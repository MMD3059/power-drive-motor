import { motion } from "framer-motion"
import SectionTitle from "../components/SectionTitle"
import { useLang } from "../i18n/context"

export default function Privacy() {
  const { t } = useLang()

  const sections = [
    { title: t("privacy.collectTitle"), desc: t("privacy.collectDesc"), items: ["collect1", "collect2", "collect3", "collect4"] },
    { title: t("privacy.useTitle"), desc: t("privacy.useDesc"), items: ["use1", "use2", "use3", "use4", "use5"] },
    { title: t("privacy.shareTitle"), desc: t("privacy.shareDesc") },
    { title: t("privacy.securityTitle"), desc: t("privacy.securityDesc") },
    { title: t("privacy.rightsTitle"), desc: t("privacy.rightsDesc") },
  ]

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle={t("privacy.subtitle")} title={t("privacy.title")} description={t("privacy.desc")} />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-dark-300 text-sm mb-8">{t("privacy.lastUpdated")}</p>
          <p className="text-dark-200 leading-relaxed mb-12">{t("privacy.intro")}</p>
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i} className="glass-card rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                <p className="text-dark-200 leading-relaxed">{section.desc}</p>
                {section.items && (
                  <ul className="mt-4 space-y-2">
                    {section.items.map((key) => (
                      <li key={key} className="flex items-start gap-3 text-dark-200 text-sm">
                        <span className="text-neon-500 mt-1">•</span>
                        {t(`privacy.${key}`)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 rounded-xl bg-dark-700/50 border border-neon-500/10">
            <p className="text-dark-200 text-sm leading-relaxed">{t("privacy.contact")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}