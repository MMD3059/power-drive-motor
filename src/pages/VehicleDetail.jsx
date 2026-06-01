import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Fuel, Gauge, Car, Zap, Users, ShieldCheck, Check, Phone, Mail, MapPin, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCars } from "../contexts/CarContext"

export default function VehicleDetail() {
  const { id } = useParams()
  const { cars } = useCars()
  const car = cars.find((c) => c.id === Number(id))
  const [currentImg, setCurrentImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!car) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Vehicle Not Found</h2>
          <Link to="/inventory" className="text-neon-500 hover:underline">Back to Inventory</Link>
        </div>
      </div>
    )
  }

  const allImages = (car.images && car.images.length > 0) ? car.images : [car.image]

  const specs = [
    { label: "Engine", value: car.engine, icon: Zap },
    { label: "Horsepower", value: `${car.horsepower} HP`, icon: Gauge },
    { label: "Transmission", value: car.transmission, icon: Car },
    { label: "Fuel Type", value: car.fuelType, icon: Fuel },
    { label: "Mileage", value: `${car.mileage.toLocaleString()} mi`, icon: MapPin },
    { label: "Seats", value: `${car.seats} Seats`, icon: Users },
    { label: "Year", value: car.year, icon: ShieldCheck },
  ]

  const prevImg = () => setCurrentImg((p) => (p === 0 ? allImages.length - 1 : p - 1))
  const nextImg = () => setCurrentImg((p) => (p === allImages.length - 1 ? 0 : p + 1))

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 text-dark-200 hover:text-neon-500 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {lightbox && (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
              <button onClick={() => setLightbox(false)} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10">
                <X size={32} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); prevImg(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-neon-500/30 transition-all">
                <ChevronLeft size={28} />
              </button>
              <img
                src={allImages[currentImg]}
                alt={car.name}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <button onClick={(e) => { e.stopPropagation(); nextImg(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-neon-500/30 transition-all">
                <ChevronRight size={28} />
              </button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {allImages.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                    className={`w-3 h-3 rounded-full transition-all ${i === currentImg ? "bg-neon-500 scale-125" : "bg-white/30 hover:bg-white/60"}`} />
                ))}
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setLightbox(true)}>
              <img
                src={allImages[currentImg]}
                alt={car.name}
                className="w-full aspect-[4/3] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent rounded-2xl" />
              {car.sold && (
                <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center rounded-2xl">
                  <span className="px-8 py-3 bg-red-600 text-white font-bold text-2xl rounded-xl rotate-[-15deg] shadow-lg border-2 border-red-400">
                    SOLD
                  </span>
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-4 py-1.5 text-xs font-semibold bg-neon-500/20 text-neon-500 border border-neon-500/30 rounded-full backdrop-blur-md">
                  {car.fuelType}
                </span>
                <span className="px-4 py-1.5 text-xs font-semibold bg-dark-700/80 text-dark-200 border border-white/10 rounded-full backdrop-blur-md">
                  {car.year}
                </span>
              </div>

              {allImages.length > 1 && (
                <>
                  <button onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-900/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-500/30">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-900/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-500/30">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImg(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-neon-500 w-4" : "bg-white/40 hover:bg-white/70"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)}
                    className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === currentImg ? "border-neon-500" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 glass rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {car.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-dark-200 text-sm">
                    <Check size={16} className="text-neon-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-neon-500 text-sm font-semibold tracking-widest uppercase mb-2">{car.brand}</p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2">{car.name}</h1>
            <p className="text-dark-200 text-lg mb-6">{car.model}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold gradient-text">
                ${car.price.toLocaleString()}
              </div>
              {car.sold && (
                <span className="px-4 py-1.5 bg-red-600/20 text-red-400 font-bold text-sm rounded-lg border border-red-500/40">
                  SOLD
                </span>
              )}
            </div>

            <p className="text-dark-200 leading-relaxed mb-8">{car.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {specs.map((spec, i) => (
                <div key={i} className="glass-card rounded-xl p-4 text-center">
                  <spec.icon size={22} className="text-neon-500 mx-auto mb-2" />
                  <p className="text-dark-200 text-xs uppercase tracking-wider mb-1">{spec.label}</p>
                  <p className="text-white font-semibold text-sm">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Interested in This Vehicle?</h3>
              <p className="text-dark-200 text-sm mb-6">
                Our team is ready to assist you with a personalized consultation, 
                financing options, and arranging a private viewing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  <Phone size={18} />
                  Inquire Now
                </Link>
                <Link
                  to="/financing"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-neon-500/30 text-neon-500 font-semibold rounded-xl hover:bg-neon-500/10 transition-all duration-300"
                >
                  <Mail size={18} />
                  Financing Options
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
