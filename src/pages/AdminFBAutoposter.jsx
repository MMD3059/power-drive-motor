import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Share2, Check } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"
const SITE = "https://www.powerdrivemotor.com"

export default function AdminFBAutoposter() {
  const [cars, setCars] = useState([])
  const [search, setSearch] = useState("")
  const [shared, setShared] = useState(JSON.parse(localStorage.getItem("fb-shared") || "[]"))
  const [posting, setPosting] = useState(null)
  const [done, setDone] = useState(null)

  useEffect(() => {
    fetch(`${API}/cars`).then(r => r.json()).then(setCars)
  }, [])

  const carsFiltered = cars.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.brand?.toLowerCase().includes(search.toLowerCase())
  )

  const shareToFB = (car) => {
    setPosting(car.id)
    const text = `🚗 ${car.name}\n💰 $${car.price?.toLocaleString()}\n📍 Year: ${car.year} | Mileage: ${car.mileage?.toLocaleString()} mi\n\n${car.description ? car.description.substring(0, 200) : ""}`
    const url = `${SITE}/inventory/${car.id}`
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`

    setPosting(null)
    const updated = shared.includes(car.id) ? shared : [...shared, car.id]
    setShared(updated)
    localStorage.setItem("fb-shared", JSON.stringify(updated))
    setDone(car.id)
    setTimeout(() => setDone(null), 2000)

    window.open(shareUrl, "_blank", "width=600,height=500,noopener")
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/PDM-admin" className="text-dark-200 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Share to Facebook</h1>
          <p className="text-dark-300 text-sm">Post cars to your Facebook timeline in one click</p>
        </div>
      </div>

      <div className="glass rounded-xl p-5 mb-6 border border-blue-500/10">
        <p className="text-dark-200 text-xs">
          Click <strong className="text-white">Share to Facebook</strong> → Facebook window byftah b car details + photos → <strong className="text-white">deghos "Post"</strong> w khalas.
          Ma fi setup, ma fi token, ma fi app.
        </p>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
        <input type="text" placeholder="Search cars..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-neon-500/30" />
      </div>

      {carsFiltered.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center"><p className="text-dark-200 text-sm">No cars found.</p></div>
      ) : (
        <div className="space-y-3">
          {carsFiltered.map((car, i) => (
            <motion.div key={car.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="glass-card rounded-xl p-4 border border-white/5 hover:border-neon-500/20 transition-all">
              <div className="flex items-center gap-4">
                <img src={car.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{car.name}</p>
                  <p className="text-dark-300 text-xs">{car.year} · ${car.price?.toLocaleString()} · {car.mileage?.toLocaleString()}mi</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {shared.includes(car.id) && (
                    <span className="text-[10px] text-green-500 font-semibold bg-green-500/10 px-2 py-1 rounded-full">Shared</span>
                  )}
                  <button onClick={() => shareToFB(car)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold hover:brightness-110 transition-all"
                  >
                    {done === car.id ? <Check size={14} /> : <Share2 size={14} />}
                    {done === car.id ? "Done!" : "Share to Facebook"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
