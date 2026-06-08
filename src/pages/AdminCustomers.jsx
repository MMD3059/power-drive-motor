import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Phone, Mail, User, Tag, X, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"
const token = () => localStorage.getItem("admin-token")

const statusColors = {
  lead: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  deal: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  sold: "text-green-400 bg-green-500/10 border-green-500/20",
  lost: "text-red-400 bg-red-500/10 border-red-500/20",
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "", notes: "", status: "lead", interest: "" })
  const [activityText, setActivityText] = useState("")

  const load = () => {
    const url = `${API}/customers${search ? `?q=${search}` : ""}${statusFilter ? `${search ? "&" : "?"}status=${statusFilter}` : ""}`
    fetch(url, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()).then(setCustomers)
  }

  useEffect(load, [search, statusFilter])

  const loadDetail = (id) => {
    fetch(`${API}/customers/${id}`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()).then(setDetail)
  }

  const save = async () => {
    const url = editId ? `${API}/customers/${editId}` : `${API}/customers`
    const method = editId ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify(form) })
    setShowForm(false); setEditId(null); setForm({ name: "", email: "", phone: "", source: "", notes: "", status: "lead", interest: "" })
    load()
  }

  const addActivity = async () => {
    if (!activityText.trim() || !detail) return
    await fetch(`${API}/activities`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify({ customerId: detail.id, type: "note", description: activityText }) })
    setActivityText("")
    loadDetail(detail.id)
  }

  const createDeal = async () => {
    if (!detail) return
    await fetch(`${API}/deals`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify({ customerId: detail.id, status: "negotiation", price: 0 }) })
    loadDetail(detail.id)
    load()
  }

  const newLeadFromMessage = (msg) => {
    setForm({ name: msg.name, email: msg.email, phone: msg.phone, source: msg.subject || msg.type, notes: msg.message, status: "lead", interest: "" })
    setShowForm(true)
  }

  const edit = (c) => {
    setForm({ name: c.name, email: c.email, phone: c.phone, source: c.source, notes: c.notes, status: c.status, interest: c.interest })
    setEditId(c.id)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white mb-1">CRM — Customers</h1><p className="text-dark-300 text-sm">Track leads, customers & deals</p></div>
        <button onClick={() => { setEditId(null); setForm({ name: "", email: "", phone: "", source: "manual", notes: "", status: "lead", interest: "" }); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-500/10 border border-neon-500/20 text-neon-500 text-sm font-semibold hover:bg-neon-500/20 transition-all"><Plus size={16} />Add Customer</button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input type="text" placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-neon-500/30" />
        </div>
        {["", "lead", "deal", "sold", "lost"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? "bg-neon-500/10 text-neon-500 border border-neon-500/20" : "bg-dark-700/50 text-dark-200 border border-white/5 hover:text-white"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-4">{editId ? "Edit Customer" : "New Customer"}</h3>
            <div className="space-y-3">
              <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-4 py-3 text-white text-sm" />
              <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-4 py-3 text-white text-sm" />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-4 py-3 text-white text-sm" />
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-4 py-3 text-white text-sm">
                <option value="manual">Manual</option><option value="contact">Contact Form</option><option value="tradein">Trade-In</option><option value="testdrive">Test Drive</option><option value="credit">Credit App</option><option value="phone">Phone</option><option value="walkin">Walk-in</option>
              </select>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-4 py-3 text-white text-sm">
                <option value="lead">Lead</option><option value="deal">In Deal</option><option value="sold">Sold</option><option value="lost">Lost</option>
              </select>
              <textarea placeholder="Interest / Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-4 py-3 text-white text-sm h-20 resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl bg-dark-700/50 text-dark-200 text-sm">Cancel</button>
              <button onClick={save} className="flex-1 py-3 rounded-xl bg-neon-500/10 border border-neon-500/20 text-neon-500 text-sm font-semibold">{editId ? "Update" : "Save"}</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="space-y-2">
        {customers.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <div className="glass-card rounded-xl p-4 border border-white/5 hover:border-neon-500/20 transition-all cursor-pointer" onClick={() => setDetail(detail?.id === c.id ? null : c.id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-dark-700/50 border border-white/10 flex items-center justify-center"><User size={18} className="text-dark-200" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{c.name}</p>
                  <div className="flex gap-3 text-dark-300 text-xs mt-0.5">
                    {c.email && <span className="flex items-center gap-1"><Mail size={10} />{c.email}</span>}
                    {c.phone && <span className="flex items-center gap-1"><Phone size={10} />{c.phone}</span>}
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${statusColors[c.status] || statusColors.lead}`}>{c.status}</span>
                <span className="text-dark-400 text-[10px]">{c.source}</span>
                {detail?.id === c.id ? <ChevronUp size={16} className="text-dark-400" /> : <ChevronDown size={16} className="text-dark-400" />}
              </div>
              {detail?.id === c.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-neon-500/5 space-y-4">
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); edit(c) }} className="text-xs text-neon-500 hover:underline">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); createDeal() }} className="text-xs text-yellow-500 hover:underline">Create Deal</button>
                  </div>

                  {detail?.deals?.length > 0 && (
                    <div><p className="text-white text-xs font-semibold mb-2">Deals</p>
                      {detail.deals.map(d => (
                        <div key={d.id} className="flex items-center justify-between bg-dark-800/50 rounded-lg px-3 py-2 mb-1">
                          <span className="text-dark-200 text-xs">{d.car_name || "No car"} · ${d.price || 0}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[d.status] || statusColors.lead}`}>{d.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div><p className="text-white text-xs font-semibold mb-2">Activity Log</p>
                    <div className="flex gap-2 mb-2">
                      <input value={activityText} onChange={e => setActivityText(e.target.value)} placeholder="Add note..." className="flex-1 bg-dark-800 border border-neon-500/10 rounded-lg px-3 py-2 text-white text-xs" />
                      <button onClick={addActivity} className="px-3 py-2 rounded-lg bg-neon-500/10 text-neon-500 text-xs">Add</button>
                    </div>
                    {detail?.activities?.map(a => (
                      <div key={a.id} className="text-dark-300 text-xs py-1 border-b border-neon-500/5 last:border-0">{a.description} <span className="text-dark-400">· {a.created_at}</span></div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
        {customers.length === 0 && <p className="text-dark-200 text-sm text-center py-8">No customers yet.</p>}
      </div>
    </div>
  )
}
