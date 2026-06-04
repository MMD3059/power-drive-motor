import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, ArrowRight, Shield, Award, Sparkles, Star } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { useCars } from "../contexts/CarContext"
import { thumbnail } from "../utils/images"
import { useLang } from "../i18n/context"

export default function About() {
  const { cars } = useCars()
  const { t } = useLang()
  const featuredCars = cars.slice(0, 4)

  const stats = [
    { icon: Award, value: "10+", label: t("about.stats.years") },
    { icon: Sparkles, value: "2,500+", label: t("about.stats.sold") },
    { icon: Shield, value: "99%", label: t("about.stats.satisfaction") },
    { icon: Star, value: "4.9", label: t("about.stats.rating") },
  ]

  const values = [
    {
      title: t("about.values.integrityTitle"),
      description: t("about.values.integrityDesc"),
      icon: Shield,
    },
    {
      title: t("about.values.qualityTitle"),
      description: t("about.values.qualityDesc"),
      icon: Award,
    },
    {
      title: t("about.values.clientTitle"),
      description: t("about.values.clientDesc"),
      icon: Sparkles,
    },
  ]

  return (
    <div className="pt-24 min-h-screen">
      <section className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={t("about.subtitle")}
            title={t("about.title")}
            description={t("about.desc")}
          />
        </div>
      </section>

      <section className="py-12 md:py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,212,255,0.03),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-neon-500 bg-neon-500/10 border border-neon-500/20 rounded-full mb-4">
                {t("about.storyBadge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t("about.storyTitle")}
              </h2>
              <div className="space-y-4 text-dark-200 leading-relaxed">
                <p>{t("about.storyP1")}</p>
                <p>{t("about.storyP2")}</p>
                <p>{t("about.storyP3")}</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/inventory"
                  className="flex items-center gap-2 px-6 py-3 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  {t("about.browseInventory")} <ArrowRight size={18} />
                </Link>
                <a
                  href="https://maps.google.com/?q=4309+E+12th+St+Sioux+Falls+SD+57103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-neon-500/30 text-neon-500 font-semibold rounded-xl hover:bg-neon-500/10 transition-all duration-300"
                >
                  <MapPin size={18} /> {t("about.getDirections")}
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass rounded-2xl p-8">
                <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
                  <MapPin size={22} className="text-neon-500" />
                  {t("about.dealerInfo")}
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 text-dark-200">
                    <div className="w-10 h-10 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-neon-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t("about.phone")}</p>
                      <a href="tel:+16055012400" className="text-dark-200 hover:text-neon-500 transition-colors">(605) 501-2400</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-dark-200">
                    <div className="w-10 h-10 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-neon-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t("about.address")}</p>
                      <p className="text-dark-200">4309 E 12th St</p>
                      <p className="text-dark-300 text-xs">Sioux Falls, SD 57103</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-dark-200">
                    <div className="w-10 h-10 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-neon-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t("about.email")}</p>
                      <p className="text-dark-200">Powerdrivemotorllc@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-xl glass-card">
                  <p className="text-neon-500 text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock size={16} /> {t("about.businessHours")}
                  </p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-dark-200">
                      <span>{t("about.monFri")}</span>
                      <span className="text-white">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-dark-200">
                      <span>{t("about.sat")}</span>
                      <span className="text-white">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-dark-200">
                      <span>{t("about.sun")}</span>
                      <span className="text-red-400">{t("about.closed")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-dark-800/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.03),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={t("about.values.subtitle")}
            title={t("about.values.title")}
            description={t("about.values.desc")}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6 md:p-8 text-center group hover:border-neon-500/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-neon-500/20 transition-all">
                    <Icon size={32} className="text-neon-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{v.title}</h3>
                  <p className="text-dark-200 text-sm leading-relaxed">{v.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6 text-center"
                >
                  <Icon size={28} className="text-neon-500 mx-auto mb-3" />
                  <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">{s.value}</p>
                  <p className="text-dark-200 text-xs md:text-sm">{s.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {featuredCars.length > 0 && (
        <section className="py-12 md:py-20 bg-dark-800/50 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.03),transparent_60%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              subtitle={t("about.inventory.subtitle")}
              title={t("about.inventory.title")}
              description={t("about.inventory.desc")}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/inventory/${car.id}`} className="group block">
                    <div className="glass-card rounded-xl overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={thumbnail(car.image || car.images?.[0], "400x300")}
                          alt={car.name}
                          className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {!!car.sold && (
                          <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center">
                            <span className="px-6 py-2 bg-red-600/80 text-white font-bold text-lg rounded-lg border-2 border-red-400">
                              SOLD
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-neon-500 text-xs font-semibold tracking-wider uppercase mb-1">{car.brand}</p>
                        <h3 className="text-white font-semibold text-sm mb-2 truncate">{car.name}</h3>
                        <p className="text-neon-500 font-bold text-lg">${car.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                {t("about.inventory.viewAll")} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              {t("about.cta.title")}
            </h2>
            <p className="text-dark-200 text-base md:text-lg mb-8 max-w-2xl mx-auto">{t("about.cta.desc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/inventory"
                className="px-8 py-3.5 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                {t("about.cta.browseInventory")}
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 border border-neon-500/30 text-neon-500 font-semibold rounded-xl hover:bg-neon-500/10 transition-all duration-300"
              >
                {t("about.cta.contactUs")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
