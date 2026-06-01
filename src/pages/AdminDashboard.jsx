import { Outlet, useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Car, MessageSquare, LayoutDashboard, LogOut, Menu, X } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ cars: 0, messages: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      navigate("/PDM-admin/login")
      return
    }

    fetch(`${API}/cars`)
      .then((r) => r.json())
      .then((cars) => setStats((s) => ({ ...s, cars: cars.length })))

    fetch(`${API}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((msgs) => setStats((s) => ({ ...s, messages: msgs.length })))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    localStorage.removeItem("admin-user")
    navigate("/PDM-admin/login")
  }

  const navItems = [
    { to: "/PDM-admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/PDM-admin/cars", icon: Car, label: "Cars" },
    { to: "/PDM-admin/messages", icon: MessageSquare, label: "Messages" },
  ]

  const isActive = (path, end) => {
    if (end) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-800/90 border-r border-neon-500/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-neon-500/10">
          <Link to="/PDM-admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center">
              <Car size={22} className="text-neon-500" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Power Drive</p>
              <p className="text-dark-200 text-xs">Admin Panel</p>
            </div>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.to, item.end)
                  ? "bg-neon-500/10 text-neon-500 border border-neon-500/20"
                  : "text-dark-200 hover:text-white hover:bg-dark-700/50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-dark-200 hover:text-red-500 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-40 bg-dark-800/80 backdrop-blur-xl border-b border-neon-500/10 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-dark-200 hover:text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <p className="text-dark-200 text-sm">
            Welcome, <span className="text-white font-semibold">{localStorage.getItem("admin-user") || "Admin"}</span>
          </p>
        </header>

        <main className="p-6">
          <Outlet context={{ stats }} />
        </main>
      </div>
    </div>
  )
}
