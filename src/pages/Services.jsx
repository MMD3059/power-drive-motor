import { motion } from "framer-motion"
import { Sparkles, Wrench, Banknote, RefreshCw, Star, Check } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { services } from "../data/services"
import { Link } from "react-router-dom"

const iconMap = {
  Sparkles, Wrench, Banknote, RefreshCw, Star,
}

export default function Services() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Services"
            title="Premium Automotive Services"
            description="Beyond sales — a complete ecosystem of world-class services designed to enhance your ownership experience."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Sparkles
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
                    <h3 className="text-white text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-dark-200 text-sm leading-relaxed mb-5">{service.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2 text-dark-200 text-xs">
                          <Check size={14} className="text-neon-500 shrink-0" />
                          {f}
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
              Not Sure What You Need?{" "}
              <span className="gradient-text">Let's Talk</span>
            </h2>
            <p className="text-dark-200 text-lg max-w-2xl mx-auto mb-10">
              Our concierge team is available to discuss your needs and create a 
              personalized plan that exceeds your expectations.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_25px_rgba(0,212,255,0.3)]"
            >
              Contact Our Team
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
