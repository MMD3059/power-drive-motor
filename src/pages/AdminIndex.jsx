import { useOutletContext, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Car, MessageSquare, TrendingUp, DollarSign } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

export default function AdminIndex() {
  const { stats } = useOutletContext()
  const [recentCars, setRecentCars] = useState([])

  useEffect(() => {
    fetch(`${API}/cars`)
      .then((r) => r.json())
      .then((cars) => setRecentCars(cars.slice(0, 5)))
  }, [])

  const cards = [
    {
      label: "Total Cars",
      value: stats.cars,
      icon: Car,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      link: "/PDM-admin/cars",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      link: "/PDM-admin/messages",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {cards.map((card, i) => (
          <Link key={i} to={card.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-xl p-6 border ${card.border} hover:border-neon-500/30 transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.border} flex items-center justify-center`}>
                  <card.icon size={24} className={card.color} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-dark-200 text-sm">{card.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

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
                <div>
                  <p className="text-white text-sm font-semibold">{car.name}</p>
                  <p className="text-dark-200 text-xs">{car.brand} · {car.year}</p>
                </div>
                <p className="text-neon-500 font-bold">${car.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
