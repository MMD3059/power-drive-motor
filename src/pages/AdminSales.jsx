import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, Search, Filter } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"
const token = () => localStorage.getItem("admin-token")

const statusColors = {
  negotiation: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "test-drive": "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "credit-app": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  sold: "text-green-400 bg-green-500/10 border-green-500/20",
  lost: "text-red-400 bg-red-500/10 border-red-500/20",
}

const stages = ["negotiation", "test-drive", "credit-app", "sold", "lost"]

export default function AdminSales() {
  const [deals, setDeals] = useState([])
  const [filter, setFilter] = useState("")
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ status: "", price: 0, notes: "" })

  const load = () => {
    const url = `${API}/deals${filter ? `?status=${filter}` : ""}`
    fetch(url, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()).then(setDeals)
  }

  useEffect(load, [filter])

  const updateDeal = async (id) => {
    await fetch(`${API}/deals/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify(editForm) })
    setEditId(null); load()
  }

  const totalValue = deals.filter(d => d.status !== "lost").reduce((s, d) => s + (d.price || 0), 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Sales Desk</h1>
        <p className="text-dark-300 text-sm">Track deals from negotiation to sold</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stages.slice(0, 4).map(s => (
          <div key={s} className="glass-card rounded-xl p-4 border border-white/5">
            <p className="text-2xl font-bold text-white">{deals.filter(d => d.status === s).length}</p>
            <p className="text-dark-300 text-xs capitalize">{s.replace("-", " ")}</p>
          </div>
        ))}
        <div className="glass-card rounded-xl p-4 border border-green-500/10">
          <p className="text-2xl font-bold text-green-500">${totalValue.toLocaleString()}</p>
          <p className="text-dark-300 text-xs">Total Value</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter("")} className={`px-3 py-2 rounded-xl text-xs font-semibold ${!filter ? "bg-neon-500/10 text-neon-500 border border-neon-500/20" : "bg-dark-700/50 text-dark-200 border border-white/5 hover:text-white"}`}>All</button>
        {stages.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize ${filter === s ? "bg-neon-500/10 text-neon-500 border border-neon-500/20" : "bg-dark-700/50 text-dark-200 border border-white/5 hover:text-white"}`}>{s.replace("-", " ")}</button>
        ))}
      </div>

      <div className="space-y-2">
        {deals.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="glass-card rounded-xl p-4 border border-white/5 hover:border-neon-500/20 transition-all">
            {editId === d.id ? (
              <div className="space-y-3">
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-3 py-2 text-white text-sm">
                  {stages.map(s => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
                </select>
                <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-3 py-2 text-white text-sm" placeholder="Price" />
                <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-3 py-2 text-white text-sm" placeholder="Notes" />
                <div className="flex gap-2">
                  <button onClick={() => setEditId(null)} className="px-4 py-2 rounded-xl bg-dark-700/50 text-dark-200 text-xs">Cancel</button>
                  <button onClick={() => updateDeal(d.id)} className="px-4 py-2 rounded-xl bg-neon-500/10 text-neon-500 text-xs font-semibold">Save</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">{d.customer_name || "Unknown"}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColors[d.status] || statusColors.negotiation}`}>{d.status?.replace("-", " ")}</span>
                  </div>
                  <p className="text-dark-300 text-xs mt-0.5">{d.car_name || "No car"} · Created {d.created_at}</p>
                </div>
                <p className="text-neon-500 font-bold">${(d.price || 0).toLocaleString()}</p>
                <button onClick={() => { setEditId(d.id); setEditForm({ status: d.status, price: d.price || 0, notes: d.notes || "" }) }} className="text-xs text-dark-300 hover:text-white">Edit</button>
              </div>
            )}
          </motion.div>
        ))}
        {deals.length === 0 && <p className="text-dark-200 text-sm text-center py-8">No deals yet.</p>}
      </div>
    </div>
  )
}
