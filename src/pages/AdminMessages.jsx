import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, Mail, Phone, Calendar, MessageSquare } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const token = localStorage.getItem("admin-token")

  useEffect(() => {
    fetch(`${API}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setMessages)
  }, [token])

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return
    await fetch(`${API}/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    setMessages(messages.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-4">
          {messages.length === 0 ? (
            <p className="text-dark-200 text-sm text-center py-8">No messages yet.</p>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, i) => (
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
                    <div>
                      <p className="text-white font-semibold text-sm">{msg.name}</p>
                      <p className="text-dark-200 text-xs">{msg.subject || "No subject"}</p>
                    </div>
                    <span className="text-dark-200 text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-dark-200 text-xs line-clamp-2 mt-1">{msg.message}</p>
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
                <h2 className="text-white font-bold text-lg">{selected.name}</h2>
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
                <p className="text-white text-sm leading-relaxed">{selected.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
