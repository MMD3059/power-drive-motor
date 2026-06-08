import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Trash2, Mail, Phone, Calendar, MessageSquare, MessageCircle } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

const TYPE_LABELS = {
  contact: "Contact",
  credit: "Credit App",
  "trade-in": "Trade-In",
  "test-drive": "Test Drive",
}

const TYPE_COLORS = {
  contact: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  credit: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "trade-in": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "test-drive": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState("all")
  const token = localStorage.getItem("admin-token")

  useEffect(() => {
    fetch(`${API}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setMessages)
  }, [token])

  const filtered = useMemo(() => {
    if (filter === "all") return messages
    return messages.filter((m) => m.type === filter)
  }, [messages, filter])

  const counts = useMemo(() => {
    const c = { all: messages.length }
    for (const type of Object.keys(TYPE_LABELS)) {
      c[type] = messages.filter((m) => m.type === type).length
    }
    return c
  }, [messages])

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return
    await fetch(`${API}/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    setMessages(messages.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const renderMessage = (msg) => {
    if ((msg.type === "trade-in" || msg.type === "test-drive") && msg.message && msg.message.startsWith("{")) {
      try {
        const data = JSON.parse(msg.message)
        return (
          <div className="space-y-2 text-sm">
            {Object.entries(data).filter(([k]) => k !== "consent").map(([key, val]) => (
              <div key={key} className="flex gap-2">
                <span className="text-dark-200 capitalize min-w-[120px]">{key.replace(/([A-Z])/g, " $1")}:</span>
                <span className="text-white">{String(val)}</span>
              </div>
            ))}
          </div>
        )
      } catch {}
    }
    return <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[{ type: "all", label: "All" }, ...Object.entries(TYPE_LABELS).map(([type, label]) => ({ type, label }))].map(({ type, label }) => (
          <button
            key={type}
            onClick={() => { setFilter(type); setSelected(null) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === type
                ? "bg-neon-500/20 text-neon-500 border-neon-500/40"
                : "bg-dark-700/40 text-dark-200 border-transparent hover:bg-dark-700/60"
            }`}
          >
            {label}
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-dark-600/60">{counts[type] || 0}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-4">
          {filtered.length === 0 ? (
            <p className="text-dark-200 text-sm text-center py-8">No messages yet.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(msg)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selected?.id === msg.id
                      ? "bg-neon-500/10 border-neon-500/30"
                      : "bg-dark-700/30 border-transparent hover:bg-dark-700/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{msg.name}</p>
                      <p className="text-dark-200 text-xs truncate">{msg.subject || "No subject"}</p>
                    </div>
                    <span className="text-dark-200 text-xs shrink-0 ml-2">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${TYPE_COLORS[msg.type] || "bg-dark-600/50 text-dark-200 border-dark-500/30"}`}>
                      {TYPE_LABELS[msg.type] || msg.type}
                    </span>
                    <p className="text-dark-200 text-xs line-clamp-1 flex-1">{msg.message ? msg.message.replace(/[{}"\[\]]/g, "").substring(0, 60) : ""}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-6">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-dark-200 py-12">
              <MessageSquare size={40} className="mb-3 opacity-50" />
              <p className="text-sm">Select a message to view</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">{selected.name}</h2>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full border ${TYPE_COLORS[selected.type] || "bg-dark-600/50 text-dark-200 border-dark-500/30"}`}>
                    {TYPE_LABELS[selected.type] || selected.type}
                  </span>
                </div>
                <button onClick={() => handleDelete(selected.id)}
                  className="p-2 rounded-lg text-dark-200 hover:text-red-500 hover:bg-red-500/10 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-dark-200 text-sm">
                  <Mail size={16} className="text-neon-500" />
                  <a href={`mailto:${selected.email}`} className="hover:text-neon-500">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-dark-200 text-sm">
                    <Phone size={16} className="text-neon-500" />
                    <a href={`tel:${selected.phone}`} className="hover:text-neon-500">{selected.phone}</a>
                    <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${selected.name}, regarding your inquiry...`)}`} target="_blank" rel="noopener" className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 transition-all">
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-dark-200 text-sm">
                  <Calendar size={16} className="text-neon-500" />
                  {new Date(selected.created_at).toLocaleString()}
                </div>
                {selected.subject && (
                  <p className="text-dark-200 text-sm"><span className="text-white font-semibold">Subject:</span> {selected.subject}</p>
                )}
              </div>

              <div className="bg-dark-700/50 rounded-xl p-4">
                {renderMessage(selected)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
