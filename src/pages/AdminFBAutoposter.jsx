import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, ExternalLink, Check, Search, Share2, Settings, ShoppingBag, RefreshCw, AlertCircle } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

export default function AdminFBAutoposter() {
  const [tab, setTab] = useState("commerce")
  const [cars, setCars] = useState([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState("copy")

  const [showConfig, setShowConfig] = useState(false)
  const [catalogId, setCatalogId] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [hasConfig, setHasConfig] = useState(false)
  const [posting, setPosting] = useState(null)
  const [postResult, setPostResult] = useState(null)

  useEffect(() => {
    fetch(`${API}/cars`).then(r => r.json()).then(setCars)
    fetch(`${API}/fb/config`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` },
    }).then(r => r.json()).then(d => {
      if (d.catalogId) { setCatalogId(d.catalogId); setHasConfig(true) }
    }).catch(() => {})
  }, [])

  const carsFiltered = cars.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.brand?.toLowerCase().includes(search.toLowerCase())
  )

  const saveConfig = async () => {
    const res = await fetch(`${API}/fb/save-config`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("admin-token")}` },
      body: JSON.stringify({ catalogId, accessToken }),
    })
    if (res.ok) { setHasConfig(true); setShowConfig(false) }
    else { alert("Failed to save config") }
  }

  const postToCommerce = async (car) => {
    setPosting(car.id)
    setPostResult(null)
    const res = await fetch(`${API}/fb/commerce/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("admin-token")}` },
      body: JSON.stringify({ carId: car.id }),
    })
    const data = await res.json()
    setPosting(null)
    setPostResult(data)
    if (data.ok) {
      setCars(cars.map(c => c.id === car.id ? { ...c, fb_commerce_id: data.fbId, fb_commerce_status: "posted" } : c))
    }
  }

  const buildText = (car) => {
    return `🚗 ${car.name}
📍 Year: ${car.year} | Mileage: ${car.mileage?.toLocaleString() || "N/A"} mi
⛽ Fuel: ${car.fuelType || "N/A"} | Transmission: ${car.transmission || "N/A"}
💰 Price: $${car.price?.toLocaleString() || "N/A"}
🔧 Engine: ${car.engine || "N/A"} | ${car.horsepower || "N/A"} HP
🪑 Seats: ${car.seats || "N/A"} | Color: ${car.color || "N/A"}`
  }

  const buildTags = (car) => {
    return ["#usedcars", "#cardealer", "#carsforsale", `#${car.brand?.replace(/\s+/g, "") || "car"}`, `#${car.model?.replace(/\s+/g, "") || "car"}`].join(" ")
  }

  const copyAll = (car) => {
    const text = `${buildText(car)}\n\n${car.description || ""}\n\n${buildTags(car)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setStep("open")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/PDM-admin" className="text-dark-200 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Facebook Integration</h1>
            <p className="text-dark-300 text-sm">Post cars to Commerce Manager & Marketplace</p>
          </div>
        </div>
        <button onClick={() => setShowConfig(!showConfig)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700/50 border border-white/10 text-dark-200 text-xs hover:text-white hover:border-white/20 transition-all">
          <Settings size={14} />
          Settings
        </button>
      </div>

      {showConfig && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-xl p-6 mb-6 overflow-hidden">
          <h3 className="text-white font-bold text-sm mb-4">Facebook Commerce Manager Config</h3>
          <div className="space-y-4">
            <div>
              <label className="text-dark-300 text-xs block mb-1">Catalog ID</label>
              <input value={catalogId} onChange={e => setCatalogId(e.target.value)} className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-500/30" placeholder="Your Facebook Commerce Catalog ID" />
            </div>
            <div>
              <label className="text-dark-300 text-xs block mb-1">Access Token</label>
              <input value={accessToken} onChange={e => setAccessToken(e.target.value)} type="password" className="w-full bg-dark-800 border border-neon-500/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-500/30" placeholder="Facebook Access Token" />
            </div>
            <div className="bg-dark-800/50 rounded-xl p-4 border border-yellow-500/10">
              <p className="text-yellow-400 text-xs font-semibold mb-2">How to get your Catalog ID & Access Token:</p>
              <ol className="text-dark-300 text-xs space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://business.facebook.com/" target="_blank" rel="noopener" className="text-neon-500">Facebook Business Manager</a></li>
                <li>Open <strong>Commerce Manager</strong> → Create a catalog</li>
                <li>Copy your <strong>Catalog ID</strong> from settings</li>
                <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener" className="text-neon-500">Meta Developers</a> → Create App</li>
                <li>Generate a <strong>Page Access Token</strong> with <code>catalog_management</code> permission</li>
              </ol>
            </div>
            <button onClick={saveConfig} className="px-6 py-3 rounded-xl bg-neon-500/10 border border-neon-500/20 text-neon-500 text-sm font-semibold hover:bg-neon-500/20 transition-all">
              Save Config
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("commerce")} className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === "commerce" ? "bg-neon-500/10 text-neon-500 border border-neon-500/20" : "bg-dark-700/50 text-dark-200 border border-white/5 hover:text-white"}`}>
          <ShoppingBag size={14} className="inline mr-1.5" />
          Auto Post (Commerce Manager)
        </button>
        <button onClick={() => setTab("manual")} className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === "manual" ? "bg-neon-500/10 text-neon-500 border border-neon-500/20" : "bg-dark-700/50 text-dark-200 border border-white/5 hover:text-white"}`}>
          <Share2 size={14} className="inline mr-1.5" />
          Manual (Copy & Paste)
        </button>
      </div>

      {postResult && !postResult.ok && (
        <div className="glass rounded-xl p-4 mb-6 border border-red-500/20">
          <p className="text-red-400 text-xs font-semibold">API Error: {postResult.error || "Unknown error"}</p>
          {postResult.fbError && <p className="text-dark-300 text-[10px] mt-1">{postResult.fbError.message}</p>}
        </div>
      )}

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
                  {car.fb_commerce_status === "posted" && (
                    <span className="text-[10px] text-green-500 font-semibold bg-green-500/10 px-2 py-1 rounded-full">In Shop</span>
                  )}
                  {car.fb_commerce_status === "failed" && (
                    <span className="text-[10px] text-red-500 font-semibold bg-red-500/10 px-2 py-1 rounded-full">Failed</span>
                  )}
                  {tab === "commerce" ? (
                    <button onClick={() => postToCommerce(car)} disabled={posting === car.id || !hasConfig}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {posting === car.id ? <RefreshCw size={14} className="animate-spin" /> : <ShoppingBag size={14} />}
                      {posting === car.id ? "Posting..." : "Post to Shop"}
                    </button>
                  ) : (
                    <button onClick={() => { setSelected(car); setCopied(false); setStep("copy") }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold hover:brightness-110 transition-all"
                    >
                      <Share2 size={14} />
                      Post to FB
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!hasConfig && tab === "commerce" && (
        <div className="glass rounded-xl p-6 mt-6 border border-yellow-500/10 text-center">
          <AlertCircle size={20} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-yellow-400 text-sm font-semibold">Facebook not configured</p>
          <p className="text-dark-300 text-xs mt-1">Click <strong>Settings</strong> to enter your Commerce Manager Catalog ID & Access Token</p>
        </div>
      )}

      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
                <p className="text-dark-200 text-xs whitespace-pre-wrap font-sans">{selected.description || "Excellent condition, well maintained.\n\nFor more info contact us!\n📞 Call/WhatsApp\n📍 Visit our dealership"}</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-dark-200 text-xs">{buildTags(selected)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => copyAll(selected)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neon-500/10 border border-neon-500/20 text-neon-500 text-sm font-semibold hover:bg-neon-500/20 transition-all">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied! Text is ready to paste" : "1. Copy Listing Text"}
              </button>
              {step === "open" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                  <button onClick={() => { window.open("https://www.facebook.com/marketplace/create", "_blank", "noopener") }} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:brightness-110 transition-all">
                    <ExternalLink size={16} />
                    2. Open Facebook & Paste (Ctrl+V / Cmd+V)
                  </button>
                </motion.div>
              )}
            </div>
            <p className="text-dark-400 text-[10px] text-center mt-4">Copy the text → Open Facebook Marketplace → Ctrl+V / Cmd+V to paste → Publish</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
