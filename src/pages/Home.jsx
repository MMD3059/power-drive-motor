import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, Sparkles, Shield, Clock, Award } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { useCars } from "../contexts/CarContext"
import { services } from "../data/services"
import { testimonials } from "../data/testimonials"
import { thumbnail } from "../utils/images"

const featuredServices = services.slice(0, 3)

const stats = [
  { icon: Award, value: "15+", label: "Years Excellence" },
  { icon: Sparkles, value: "2,500+", label: "Vehicles Sold" },
  { icon: Shield, value: "99%", label: "Client Satisfaction" },
  { icon: Clock, value: "24/7", label: "Concierge Support" },
]

export default function Home() {
  const { cars } = useCars()
  const featuredCars = cars.slice(0, 4)
  return (
    <div>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/60 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,136,204,0.05),transparent_50%)]" />
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full border border-neon-500/10 animate-pulse-glow" />
          <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full border border-neon-500/5" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-neon-500 bg-neon-500/10 border border-neon-500/20 rounded-full mb-6">
                Premium Automotive Concierge
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Drive The{" "}
                <span className="gradient-text">Extraordinary</span>
                <br />
                Live The Legend
              </h1>
              <p className="text-lg text-dark-200 leading-relaxed max-w-xl mb-10">
                Curating the world's finest automobiles for discerning drivers. 
                From hypercars to bespoke luxury SUVs, every vehicle tells a story of excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/inventory"
                  className="group px-8 py-4 bg-neon-500 text-dark-900 font-bold text-base rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] flex items-center gap-2"
                >
                  Explore Collection
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-4 border border-neon-500/30 text-neon-500 font-bold text-base rounded-xl hover:bg-neon-500/10 hover:border-neon-500/50 transition-all duration-300"
                >
                  Our Services
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={cars[1].image}
                  alt="Featured Luxury Car"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass rounded-xl p-5">
                    <p className="text-neon-500 text-xs font-semibold tracking-widest uppercase mb-1">Featured</p>
                    <h3 className="text-white text-xl font-bold">{cars[1].name}</h3>
                    <p className="text-dark-200 text-sm">{cars[1].brand} {cars[1].model}</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-xl p-4">
                <p className="text-neon-500 text-2xl font-bold">${(cars[1].price / 1000).toFixed(0)}k</p>
                <p className="text-dark-200 text-xs">Starting From</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
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

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.03),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Collection"
            title="Featured Vehicles"
            description="Hand-picked excellence. Each vehicle in our collection meets the highest standards of performance, luxury, and prestige."
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
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={thumbnail(car.image, "400x300")}
                      alt={car.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-semibold bg-neon-500/20 text-neon-500 border border-neon-500/30 rounded-full backdrop-blur-sm">
                        {car.fuelType}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-dark-200 text-xs font-semibold tracking-wider uppercase mb-1">{car.brand}</p>
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-neon-500 transition-colors">{car.name}</h3>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-neon-500 font-bold text-xl">${car.price.toLocaleString()}</p>
                      <span className="text-dark-200 text-xs">{car.year}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neon-500 text-xs font-semibold">{car.mileage.toLocaleString()} mi</span>
                      <span className="text-dark-200 text-xs">{car.horsepower} HP</span>
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
              View Full Collection
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Services"
            title="Premium Services"
            description="From acquisition to ownership, we provide a complete ecosystem of automotive services tailored to your needs."
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
              Explore All Services
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Testimonials"
            title="What Our Clients Say"
            description="Trust built through exceptional service. Hear from our discerning clientele."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-8"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-neon-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-dark-200 text-sm leading-relaxed mb-6 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border border-neon-500/20"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-dark-200 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative bg-dark-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your{" "}
              <span className="gradient-text">Dream Car</span>?
            </h2>
            <p className="text-dark-200 text-lg max-w-2xl mx-auto mb-10">
              Schedule a private viewing or browse our collection online. 
              Our team is ready to assist you every step of the way.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/inventory"
                className="px-10 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_25px_rgba(0,212,255,0.3)]"
              >
                Browse Inventory
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 border border-neon-500/30 text-neon-500 font-bold rounded-xl hover:bg-neon-500/10 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
