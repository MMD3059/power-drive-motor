import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, ExternalLink, Facebook, Check, Search } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

export default function AdminFBAutoposter() {
  const [cars, setCars] = useState([])
  const [posted, setPosted] = useState(JSON.parse(localStorage.getItem("fb-posted") || "[]"))
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch(`${API}/cars`)
      .then(r => r.json())
      .then(setCars)
  }, [])

  const carsFiltered = cars.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.brand?.toLowerCase().includes(search.toLowerCase())
  )

  const buildText = (car) => {
    return `🚗 ${car.name}
📍 Year: ${car.year} | Mileage: ${car.mileage?.toLocaleString() || "N/A"} mi
⛽ Fuel: ${car.fuelType || "N/A"} | Transmission: ${car.transmission || "N/A"}
💰 Price: $${car.price?.toLocaleString() || "N/A"}
🔧 Engine: ${car.engine || "N/A"} | ${car.horsepower || "N/A"} HP
🪑 Seats: ${car.seats || "N/A"} | Color: ${car.color || "N/A"}`
  }

  const buildTags = (car) => {
    const tags = ["#usedcars", "#cardealer", "#carsforsale", `#${car.brand?.replace(/\s+/g, "") || "car"}`, `#${car.model?.replace(/\s+/g, "") || "car"}`]
    return tags.join(" ")
  }

  const buildDesc = (car) => {
    return `${car.description || "Excellent condition, well maintained."}\n\nFor more info contact us!\n📞 Call/WhatsApp\n📍 Visit our dealership`
  }

  const copyAll = (car) => {
    const text = `${buildText(car)}\n\n${car.description || ""}\n\n${buildTags(car)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const markPosted = (id) => {
    const updated = posted.includes(id) ? posted : [...posted, id]
    setPosted(updated)
    localStorage.setItem("fb-posted", JSON.stringify(updated))
  }

  const openFB = () => {
    window.open("https://www.facebook.com/marketplace/create", "_blank", "noopener")
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/PDM-admin" className="text-dark-200 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">FB Marketplace Autoposter</h1>
          <p className="text-dark-300 text-sm">Post your inventory to Facebook Marketplace</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-dark-800 border border-neon-500/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-neon-500/30"
        />
      </div>

      {carsFiltered.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-dark-200 text-sm">No cars found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {carsFiltered.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="glass-card rounded-xl p-4 border border-white/5 hover:border-neon-500/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <img src={car.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{car.name}</p>
                  <p className="text-dark-300 text-xs">{car.year} · ${car.price?.toLocaleString()} · {car.mileage?.toLocaleString()}mi</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {posted.includes(car.id) && (
                    <span className="text-[10px] text-green-500 font-semibold bg-green-500/10 px-2 py-1 rounded-full">Posted</span>
                  )}
                  <button
                    onClick={() => { setSelected(car); setCopied(false) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold hover:brightness-110 transition-all"
                  >
                    <Facebook size={14} />
                    Post to FB
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Post to Facebook</h3>
              <button onClick={() => setSelected(null)} className="text-dark-300 hover:text-white text-xl">&times;</button>
            </div>

            <img src={selected.image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />

            <div className="space-y-3 mb-6">
              <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-white font-semibold mb-2">{selected.name}</p>
                <pre className="text-dark-200 text-xs whitespace-pre-wrap font-sans">{buildText(selected)}</pre>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-dark-200 text-xs whitespace-pre-wrap font-sans">{buildDesc(selected)}</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-dark-200 text-xs">{buildTags(selected)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => copyAll(selected)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neon-500/10 border border-neon-500/20 text-neon-500 text-sm font-semibold hover:bg-neon-500/20 transition-all"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Listing Text"}
              </button>
              <button
                onClick={() => { markPosted(selected.id); openFB() }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:brightness-110 transition-all"
              >
                <ExternalLink size={16} />
                Open Facebook & Paste
              </button>
            </div>

            <p className="text-dark-400 text-[10px] text-center mt-4">
              1. Click "Copy Listing Text" · 2. Click "Open Facebook" · 3. Paste & Publish
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
