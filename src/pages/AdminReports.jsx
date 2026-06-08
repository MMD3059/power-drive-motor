import { useState, useEffect } from "react"
import { TrendingUp, Users, Car, DollarSign } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"
const token = () => localStorage.getItem("admin-token")

export default function AdminReports() {
  const [summary, setSummary] = useState(null)
  const [inventory, setInventory] = useState(null)

  useEffect(() => {
    fetch(`${API}/reports/summary`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()).then(setSummary)
    fetch(`${API}/reports/inventory`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()).then(setInventory)
  }, [])

  if (!summary || !inventory) return <div className="glass rounded-xl p-8 text-center"><p className="text-dark-200 text-sm">Loading reports...</p></div>

  const bigCards = [
    { label: "Total Revenue", value: `$${summary.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: "text-green-500" },
    { label: "Sold Cars", value: summary.soldCars, icon: Car, color: "text-blue-500" },
    { label: "Active Leads", value: summary.totalLeads, icon: Users, color: "text-purple-500" },
    { label: "Active Deals", value: summary.activeDeals, icon: TrendingUp, color: "text-yellow-500" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Reports & Analytics</h1>
        <p className="text-dark-300 text-sm">Performance metrics and insights</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {bigCards.map((c, i) => (
          <div key={i} className="glass-card rounded-xl p-4 border border-white/5">
            <c.icon size={20} className={c.color} />
            <p className="text-2xl font-bold text-white mt-2">{c.value}</p>
            <p className="text-dark-300 text-xs">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-bold text-sm mb-4">Leads by Source</h2>
          <div className="space-y-2">
            {summary.leadsBySource?.map(s => (
              <div key={s.source} className="flex items-center justify-between">
                <span className="text-dark-200 text-xs capitalize">{s.source || "direct"}</span>
                <div className="flex items-center gap-2 flex-1 mx-4">
                  <div className="h-2 rounded-full bg-neon-500/20 flex-1">
                    <div className="h-full rounded-full bg-neon-500" style={{ width: `${(s.count / Math.max(...summary.leadsBySource.map(x => x.count)) * 100)}%` }} />
                  </div>
                </div>
                <span className="text-white text-xs font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-bold text-sm mb-4">Inventory by Brand</h2>
          <div className="space-y-2">
            {inventory.byBrand?.map(b => (
              <div key={b.brand} className="flex items-center justify-between">
                <span className="text-dark-200 text-xs">{b.brand}</span>
                <div className="flex items-center gap-2 flex-1 mx-4">
                  <div className="h-2 rounded-full bg-blue-500/20 flex-1">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(b.count / Math.max(...inventory.byBrand.map(x => x.count)) * 100)}%` }} />
                  </div>
                </div>
                <span className="text-white text-xs font-semibold">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-bold text-sm mb-4">Sales by Month</h2>
          {summary.dealsByMonth?.length > 0 ? (
            <div className="space-y-2">
              {summary.dealsByMonth.slice().reverse().map(m => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-dark-300 text-xs w-16 shrink-0">{m.month}</span>
                  <div className="flex-1 h-5 rounded-full bg-dark-700/50 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-neon-500 to-blue-500" style={{ width: `${Math.min((m.revenue / Math.max(...summary.dealsByMonth.map(x => x.revenue)) * 100), 100)}%` }} />
                  </div>
                  <span className="text-white text-xs font-semibold w-20 text-right">${(m.revenue || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-dark-400 text-xs">No sales data yet</p>}
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-bold text-sm mb-4">Deals by Status</h2>
          <div className="grid grid-cols-2 gap-3">
            {summary.dealsByStatus?.map(d => (
              <div key={d.status} className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
                <p className="text-white font-bold text-lg">{d.count}</p>
                <p className="text-dark-300 text-xs capitalize">{d.status}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
              <p className="text-dark-300 text-xs">Avg Price (Available)</p>
              <p className="text-white font-bold">${(inventory.avgPrice || 0).toLocaleString()}</p>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
              <p className="text-dark-300 text-xs">Avg Mileage</p>
              <p className="text-white font-bold">{(inventory.avgMileage || 0).toLocaleString()} mi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-white font-bold text-sm mb-4">Recent Leads</h2>
        <div className="space-y-2">
          {summary.recentLeads?.map(l => (
            <div key={l.id} className="flex items-center justify-between py-2 border-b border-neon-500/5 last:border-0">
              <div><p className="text-white text-sm">{l.name}</p><p className="text-dark-300 text-xs">{l.email} · {l.source}</p></div>
              <span className="text-dark-400 text-[10px]">{l.created_at}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
