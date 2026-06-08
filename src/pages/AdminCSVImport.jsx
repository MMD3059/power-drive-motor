import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, Check, AlertCircle, FileText } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"
const token = () => localStorage.getItem("admin-token")

export default function AdminCSVImport() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const ref = useRef()

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch(`${API}/csv/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      })
      const data = await res.json()
      setResult(data)
    } catch { setResult({ error: "Upload failed" }) }
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">CSV Import</h1>
        <p className="text-dark-300 text-sm">Import cars from Frazer DMS M-8 Export or any CSV file</p>
      </div>

      <div className="glass rounded-xl p-6 mb-6">
        <div className="border-2 border-dashed border-neon-500/20 rounded-xl p-8 text-center hover:border-neon-500/40 transition-all cursor-pointer" onClick={() => ref.current?.click()}>
          <input ref={ref} type="file" accept=".csv" className="hidden" onChange={e => setFile(e.target.files[0])} />
          <Upload size={32} className="text-dark-400 mx-auto mb-3" />
          <p className="text-white font-semibold text-sm mb-1">{file ? file.name : "Click to select CSV file"}</p>
          <p className="text-dark-300 text-xs">Frazer M-8 Export · Must have headers row</p>
        </div>
        {file && (
          <button onClick={handleUpload} disabled={loading} className="mt-4 w-full py-3 rounded-xl bg-neon-500/10 border border-neon-500/20 text-neon-500 text-sm font-semibold hover:bg-neon-500/20 transition-all disabled:opacity-50">
            {loading ? "Importing..." : `Import ${file.name}`}
          </button>
        )}
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
          {result.error ? (
            <div className="flex items-start gap-3 text-red-400"><AlertCircle size={18} className="shrink-0 mt-0.5" /><p className="text-sm">{result.error}</p></div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4"><Check size={20} className="text-green-500" /><p className="text-white font-semibold">Import Complete</p></div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5"><p className="text-2xl font-bold text-green-500">{result.imported}</p><p className="text-dark-300 text-xs">Imported</p></div>
                <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5"><p className="text-2xl font-bold text-yellow-500">{result.skipped}</p><p className="text-dark-300 text-xs">Skipped (duplicates)</p></div>
                <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5"><p className="text-2xl font-bold text-dark-200">{result.total}</p><p className="text-dark-300 text-xs">Total Rows</p></div>
              </div>
              {result.errors?.length > 0 && (
                <div><p className="text-red-400 text-xs font-semibold mb-2">Errors:</p>{result.errors.map((e, i) => <p key={i} className="text-dark-300 text-[10px]">{e}</p>)}</div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
