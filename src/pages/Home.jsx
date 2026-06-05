import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronRight, Sparkles, Shield, Clock, Award } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { useCars } from "../contexts/CarContext"
import { services } from "../data/services"
import { thumbnail } from "../utils/images"
import { useLang } from "../i18n/context"

const featuredServices = services.slice(0, 3)

export default function Home() {
  const { t } = useLang()
  const { cars } = useCars()
  const featuredCars = cars.slice(0, 4)
  const uniqueBrands = [...new Set(cars.map((c) => c.brand))]
  const [featuredIndex, setFeaturedIndex] = useState(0)

  const stats = [
    { icon: Award, value: "10+", label: t("home.stats.years") },
    { icon: Sparkles, value: "2,500+", label: t("home.stats.sold") },
    { icon: Shield, value: "99%", label: t("home.stats.satisfaction") },
    { icon: Clock, value: "24/7", label: t("home.stats.support") },
  ]

  useEffect(() => {
    if (cars.length === 0) return
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % cars.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [cars])

  const featured = cars[featuredIndex]
  return (
    <div>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/60 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,136,204,0.05),transparent_50%)]" />
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full border border-neon-500/10 animate-pulse-glow max-md:hidden" />
          <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full border border-neon-500/5 max-md:hidden" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-neon-500 bg-neon-500/10 border border-neon-500/20 rounded-full mb-6">
                {t("home.hero.badge")}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-4 md:mb-6">
                {t("home.hero.heading1")}{" "}
                <span className="gradient-text">{t("home.hero.heading2")}</span>
                <br />
                {t("home.hero.heading3")}
              </h1>
              <p className="text-lg text-dark-200 leading-relaxed max-w-xl mb-10">
                {t("home.hero.desc")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/inventory"
                  className="group px-8 py-4 bg-neon-500 text-dark-900 font-bold text-base rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] flex items-center gap-2"
                >
                  {t("home.hero.exploreCollection")}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-4 border border-neon-500/30 text-neon-500 font-bold text-base rounded-xl hover:bg-neon-500/10 hover:border-neon-500/50 transition-all duration-300"
                >
                  {t("home.hero.ourServices")}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative max-md:mt-6"
            >
              <div className="relative h-[300px] sm:h-[400px] flex items-center justify-center">
                <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-dark-900 to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-dark-900 to-transparent z-20 pointer-events-none" />
                {cars.map((car, i) => {
                  const diff = (i - featuredIndex + cars.length) % cars.length
                  const isPrev = diff === cars.length - 1
                  const isNext = diff === 1
                  const isCurrent = i === featuredIndex
                  if (!isPrev && !isCurrent && !isNext) return null
                  const pos = isPrev ? -1 : isNext ? 1 : 0
                  return (
                    <motion.div
                      key={car.id}
                      initial={false}
                      animate={{
                        x: pos * 60 + "%",
                        scale: isCurrent ? 1 : 0.75,
                        opacity: isCurrent ? 1 : 0.35,
                        zIndex: isCurrent ? 10 : 5,
                      }}
                      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                      className="absolute w-full max-w-md"
                    >
                      <Link
                        to={isCurrent ? `/inventory/${car.id}` : "#"}
                        onClick={(e) => { if (!isCurrent) { e.preventDefault(); setFeaturedIndex(i) } }}
                        className="block relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={car.image || car.images?.[0]}
                          alt={car.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                        {isCurrent && (
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="glass rounded-xl p-4">
                              <p className="text-neon-500 text-xs font-semibold tracking-widest uppercase mb-1">{t("home.hero.featured")}</p>
                              <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                  <h3 className="text-white text-lg font-bold truncate">{car.name}</h3>
                                  <p className="text-dark-200 text-xs">{car.brand} {car.model}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="text-neon-500 text-xl font-bold whitespace-nowrap">${car.price?.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-800/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center"
              >
                <stat.icon size={28} className="text-neon-500 mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-dark-200 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-dark-200 mb-2">{t("home.brands.subtitle")}</p>
            <h3 className="text-xl font-bold text-white">{t("home.brands.title")}</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {uniqueBrands.map((brand) => (
              <Link
                key={brand}
                to={`/inventory?brand=${brand}`}
                className="group flex flex-col items-center gap-2 px-6 py-4 rounded-xl hover:bg-neon-500/5 border border-transparent hover:border-neon-500/20 transition-all duration-300"
              >
                <img
                  src={`https://d1rcedcg4i52v4.cloudfront.net/website/common/images/makes-logos/${brand.toLowerCase()}.webp`}
                  alt={brand}
                  className="h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => { e.target.style.display = "none" }}
                />
                <span className="text-xs text-dark-300 group-hover:text-neon-500 transition-colors">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.03),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={t("home.featured.subtitle")}
            title={t("home.featured.title")}
            description={t("home.featured.desc")}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/inventory/${car.id}`}
                  className="group block glass-card rounded-xl overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={thumbnail(car.image, "400x300")}
                      alt={car.name}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {!!car.sold && (
                      <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center">
                        <span className="px-6 py-2 bg-red-600 text-white font-bold text-lg rounded-xl rotate-[-15deg] shadow-lg border-2 border-red-400">
                          SOLD
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-semibold bg-neon-500/20 text-neon-500 border border-neon-500/30 rounded-full backdrop-blur-sm">
                        {car.fuelType}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-dark-200 text-xs font-semibold tracking-wider uppercase mb-1">{car.brand}</p>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-neon-500 transition-colors">{car.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5 text-dark-200 text-sm">
                        <span className="text-neon-500 font-semibold">{car.mileage.toLocaleString()}</span> mi
                      </span>
                      <span className="text-dark-200 text-sm">{car.year}</span>
                    </div>
                    <div className="border-t border-neon-500/10 pt-3">
                      <p className="text-neon-500 font-bold text-xl">${car.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 px-8 py-4 border border-neon-500/30 text-neon-500 font-semibold rounded-xl hover:bg-neon-500/10 transition-all duration-300 group"
            >
              {t("home.featured.viewAll")}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20 relative bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={t("home.services.subtitle")}
            title={t("home.services.title")}
            description={t("home.services.desc")}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {featuredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-8 group hover:border-neon-500/30"
              >
                <div className="w-14 h-14 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center mb-6 group-hover:bg-neon-500/20 transition-all">
                  <Sparkles size={28} className="text-neon-500" />
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-dark-200 text-sm leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-dark-200 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all duration-300 group"
            >
              {t("home.services.exploreAll")}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20 relative bg-dark-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {t("home.cta.title")}{" "}
              <span className="gradient-text">{t("home.cta.highlight")}</span>?
            </h2>
            <p className="text-dark-200 text-lg max-w-2xl mx-auto mb-10">
              {t("home.cta.desc")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/inventory"
                className="px-10 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_25px_rgba(0,212,255,0.3)]"
              >
                {t("home.cta.browseInventory")}
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 border border-neon-500/30 text-neon-500 font-bold rounded-xl hover:bg-neon-500/10 transition-all duration-300"
              >
                {t("home.cta.contactUs")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
