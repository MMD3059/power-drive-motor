import { useOutletContext, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Car, MessageSquare, Download, Globe, Search, Smartphone, Camera, ShoppingCart, Target, Users, MessageCircle, CheckCircle, XCircle, TrendingUp } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

const services = [
  { name: "Dealer Website", desc: "Professional dealership website", icon: Globe, color: "from-blue-600 to-cyan-400", status: true },
  { name: "Google Vehicle Listings", desc: "Auto ads on Google Search", icon: Search, color: "from-green-600 to-emerald-400", status: true },
  { name: "Craigslist", desc: "Auto poster to Craigslist", icon: Smartphone, color: "from-orange-600 to-yellow-400", status: true },
  { name: "FB Marketplace Autoposter", desc: "Auto list on Facebook Marketplace", icon: Camera, color: "from-indigo-600 to-blue-400", status: true },
  { name: "Google Shop / Network", desc: "Shop and display network ads", icon: ShoppingCart, color: "from-red-600 to-pink-400", status: true },
  { name: "FB Marketplace as Business", desc: "List as a business account", icon: TrendingUp, color: "from-purple-600 to-violet-400", status: true },
  { name: "Local Dominance", desc: "Dominate local search results", icon: Target, color: "from-teal-600 to-emerald-400", status: true },
  { name: "Smart CRM", desc: "Manage customers and leads", icon: Users, color: "from-rose-600 to-pink-400", status: true },
  { name: "Instant Messaging", desc: "Real-time customer chat", icon: MessageCircle, color: "from-sky-600 to-cyan-400", status: true },
]

export default function AdminIndex() {
  const { stats } = useOutletContext()
  const [allCars, setAllCars] = useState([])
  const recentCars = allCars.slice(0, 5)
  const available = allCars.filter(c => !c.sold).length
  const sold = allCars.filter(c => c.sold).length

  useEffect(() => {
    fetch(`${API}/cars`)
      .then((r) => r.json())
      .then((cars) => setAllCars(cars))
  }, [])

  const handleBackup = async () => {
    const token = localStorage.getItem("admin-token")
    try {
      const res = await fetch(`${API}/PDM-admin/backup`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { alert("Backup failed"); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `power-drive-motor-backup-${new Date().toISOString().split("T")[0]}.db`
      a.click()
      URL.revokeObjectURL(url)
    } catch { alert("Backup failed") }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-dark-200 text-sm">EMPOWERING DEALERSHIPS WITH AUTO DEALER 360</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/PDM-admin/cars">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all"
          >
            <p className="text-3xl font-bold text-white mb-1">{stats.cars}</p>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Total Cars</p>
          </motion.div>
        </Link>
        <Link to="/PDM-admin/messages">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all"
          >
            <p className="text-3xl font-bold text-white mb-1">{stats.messages}</p>
            <p className="text-green-400 text-xs font-semibold uppercase tracking-wider">Messages</p>
          </motion.div>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 border border-yellow-500/20"
        >
          <p className="text-3xl font-bold text-white mb-1">{available}</p>
          <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Available</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-xl p-4 border border-purple-500/20"
        >
          <p className="text-3xl font-bold text-white mb-1">{sold}</p>
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider">Sold</p>
        </motion.div>
      </div>

      <div className="mb-8">
        <h2 className="text-white font-bold text-lg mb-4">AUTO DEALER 360 SERVICES</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card rounded-xl p-5 border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br ${svc.color}`} />
              <div className="relative flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${svc.color} flex items-center justify-center shrink-0`}>
                  <svc.icon size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{svc.name}</p>
                  <p className="text-dark-300 text-xs mt-0.5 truncate">{svc.desc}</p>
                </div>
                <div className="shrink-0">
                  {svc.status ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : (
                    <XCircle size={14} className="text-red-500" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Recent Vehicles</h2>
            <Link to="/PDM-admin/cars" className="text-neon-500 text-sm hover:underline">View All</Link>
          </div>
          {recentCars.length === 0 ? (
            <p className="text-dark-200 text-sm">No vehicles yet.</p>
          ) : (
            <div className="space-y-3">
              {recentCars.map((car) => (
                <div key={car.id} className="flex items-center justify-between py-2 border-b border-neon-500/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <img src={car.image} alt="" className="w-10 h-8 rounded object-cover" />
                    <div>
                      <p className="text-white text-sm font-semibold">{car.name}</p>
                      <p className="text-dark-200 text-xs">{car.brand} · {car.year}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-neon-500 font-bold text-sm">${car.price.toLocaleString()}</p>
                    {car.sold && <span className="text-red-400 text-[10px] font-semibold">SOLD</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link to="/PDM-admin/cars"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700/50 border border-neon-500/10 hover:border-neon-500/30 transition-all group">
              <Car size={18} className="text-neon-500" />
              <span className="text-white text-sm font-medium group-hover:text-neon-500 transition-colors">Add New Vehicle</span>
            </Link>
            <div
              onClick={handleBackup}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700/50 border border-purple-500/10 hover:border-purple-500/30 transition-all cursor-pointer group">
              <Download size={18} className="text-purple-500" />
              <span className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors">Download Database Backup</span>
            </div>
            <Link to="/PDM-admin/messages"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700/50 border border-green-500/10 hover:border-green-500/30 transition-all group">
              <MessageSquare size={18} className="text-green-500" />
              <span className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">View Messages</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
