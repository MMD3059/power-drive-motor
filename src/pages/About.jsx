import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, ArrowRight, Shield, Award, Sparkles, Star } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { useCars } from "../contexts/CarContext"
import { thumbnail } from "../utils/images"

const stats = [
  { icon: Award, value: "10+", label: "Years Excellence" },
  { icon: Sparkles, value: "2,500+", label: "Vehicles Sold" },
  { icon: Shield, value: "99%", label: "Client Satisfaction" },
  { icon: Star, value: "4.9", label: "Customer Rating" },
]

const values = [
  {
    title: "Integrity First",
    description: "Every vehicle we sell comes with a promise of transparency — honest pricing, detailed inspections, and no hidden fees.",
    icon: Shield,
  },
  {
    title: "Quality Selection",
    description: "We hand-select only quality pre-owned vehicles, ensuring each one meets our rigorous standards of reliability and value.",
    icon: Award,
  },
  {
    title: "Client Commitment",
    description: "From your first inquiry to long after you drive off, our dedicated team is here to support you every step of the way.",
    icon: Sparkles,
  },
]

export default function About() {
  const { cars } = useCars()
  const featuredCars = cars.slice(0, 4)

  return (
    <div className="pt-24 min-h-screen">
      <section className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="About Us"
            title="Your Trusted Automotive Partner"
            description="We are the dealership you can trust for integrity and value — serving Sioux Falls since 2014."
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
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Driven by Passion, Built on Trust
              </h2>
              <div className="space-y-4 text-dark-200 leading-relaxed">
                <p>
                  Power Drive Motor was founded with a simple mission: to provide 
                  an exceptional car buying experience built on transparency, quality, 
                  and genuine customer care. Located in the heart of Sioux Falls, 
                  South Dakota, we have grown from a small lot into a premier 
                  destination for quality pre-owned vehicles.
                </p>
                <p>
                  Every vehicle in our inventory undergoes a rigorous multi-point 
                  inspection to ensure it meets our exacting standards. We believe 
                  that buying a car should be exciting, not stressful — which is 
                  why we've eliminated the pressure tactics and hidden fees 
                  commonly found in traditional dealerships.
                </p>
                <p>
                  Whether you're looking for a reliable daily driver, a family SUV, 
                  or a powerful truck, our experienced team is here to 
                  help you find the perfect match. We also offer flexible financing 
                  options tailored to your budget, comprehensive maintenance 
                  services, and concierge-level support.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/inventory"
                  className="flex items-center gap-2 px-6 py-3 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  Browse Inventory <ArrowRight size={18} />
                </Link>
                <a
                  href="https://maps.google.com/?q=4309+E+12th+St+Sioux+Falls+SD+57103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-neon-500/30 text-neon-500 font-semibold rounded-xl hover:bg-neon-500/10 transition-all duration-300"
                >
                  <MapPin size={18} /> Get Directions
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
                  Dealer Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 text-dark-200">
                    <div className="w-10 h-10 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-neon-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Phone</p>
                      <p className="text-dark-200">(605) 501-2400</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-dark-200">
                    <div className="w-10 h-10 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-neon-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Address</p>
                      <p className="text-dark-200">4309 E 12th St</p>
                      <p className="text-dark-300 text-xs">Sioux Falls, SD 57103</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-dark-200">
                    <div className="w-10 h-10 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-neon-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Email</p>
                      <p className="text-dark-200">concierge@powerdrivemotor.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-xl glass-card">
                  <p className="text-neon-500 text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock size={16} /> Business Hours
                  </p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-dark-200">
                      <span>Mon - Fri</span>
                      <span className="text-white">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-dark-200">
                      <span>Saturday</span>
                      <span className="text-white">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-dark-200">
                      <span>Sunday</span>
                      <span className="text-red-400">Closed</span>
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
            subtitle="Our Values"
            title="What Sets Us Apart"
            description="We believe in a better way to buy cars — one built on trust, quality, and exceptional service."
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
              subtitle="Our Inventory"
              title="Featured Vehicles"
              description="Explore a selection of our quality pre-owned vehicles, each hand-picked and thoroughly inspected."
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
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={thumbnail(car.image || car.images?.[0], "400x300")}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {car.sold && (
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
                View All Vehicles <ArrowRight size={18} />
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
              Ready to Find Your Perfect Drive?
            </h2>
            <p className="text-dark-200 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Visit our showroom or contact us today. Our team is standing by to help 
              you find the vehicle that matches your lifestyle and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/inventory"
                className="px-8 py-3.5 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                Browse Inventory
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 border border-neon-500/30 text-neon-500 font-semibold rounded-xl hover:bg-neon-500/10 transition-all duration-300"
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
