import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, X, Image, CheckCircle, XCircle } from "lucide-react"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

const defaultCar = {
  name: "", brand: "Chevrolet", model: "", year: new Date().getFullYear(),
  price: "", fuelType: "Petrol", transmission: "Automatic", engine: "",
  horsepower: "", mileage: "", seats: 5, color: "", description: "", description_es: "",
  features: [], image: "", images: [], sold: false, vin: "",
}

const brands = [
  "AC Cars", "Acura", "Aiways", "Alfa Romeo", "Alpina", "Alpine", "Aro",
  "Arrinera", "Aston Martin", "Audi", "Austin", "Autobianchi", "BAC",
  "Bajaj", "Baojun", "Bentley", "Bertone", "BitAuto", "BMW", "Borgward",
  "Brabus", "Brilliance", "Bristol", "Bugatti", "Buick", "BYD", "Cadillac",
  "Caterham", "Changan", "Changhe", "Chery", "Chevrolet", "Chrysler",
  "Citroën", "Cupra", "Dacia", "Daewoo", "Daihatsu", "Datsun", "De Tomaso",
  "Delage", "Delorean", "Denza", "Dodge", "Dongfeng", "Donkervoort",
  "DS Automobiles", "Eagle", "FAW", "Ferrari", "Fiat", "Fisker", "Force",
  "Ford", "Foton", "FSO", "Geely", "Genesis", "Geo", "GMC", "Goggomobil",
  "Great Wall", "Gumpert", "Haval", "Heinkel", "Hennessey", "Hispano-Suiza",
  "Holden", "Honda", "Hongqi", "HUMMER", "Hyundai", "Infiniti", "Irizar",
  "Isuzu", "Iveco", "JAC", "Jaguar", "Jeep", "Jensen", "Jetta", "Jiangling",
  "Kaiser", "Kamaz", "Karma", "Keating", "Kenworth", "Kia", "Koenigsegg",
  "Lada", "Lamborghini", "Lancia", "Land Rover", "Landwind", "LEVC",
  "Lexus", "Lifan", "Lincoln", "Lotus", "Lucid", "Luxgen", "Mahindra",
  "MAN", "Marlin", "Maserati", "Mastretta", "Maybach", "Mazda", "McLaren",
  "Mercedes-AMG", "Mercedes-Benz", "Mercury", "MG", "Microcar", "MINI",
  "Mitsubishi", "Mitsuoka", "Mobilize", "Morgan", "Morris", "NIO",
  "Nissan", "Noble", "Oldsmobile", "Oltcit", "Opel", "Osca", "Pagani",
  "Panhard", "Panoz", "Perodua", "Peugeot", "Plymouth", "Polestar",
  "Pontiac", "Porsche", "Premier", "Proton", "Puch", "Qoros", "Ram",
  "Rambler", "Ravon", "Reliant", "Renault", "Renault Samsung", "Rezvani",
  "Rimac", "Rivian", "Roewe", "Rolls-Royce", "Rover", "Saab", "Saleen",
  "Samsung", "San", "Saturn", "Scania", "Scion", "SEAT", "Shanghai Maple",
  "Shelby", "Škoda", "Smart", "Soueast", "Spyker", "SsangYong", "Sterling",
  "Studebaker", "Subaru", "Suzuki", "Talbot", "Tata", "Tatra", "Tavria",
  "Techrules", "Tesla", "Toyota", "Trabant", "Tramontana", "Triumph",
  "TVR", "UAZ", "Ultima", "Vanden Plas", "Vauxhall", "Vector", "Venturi",
  "VinFast", "Volkswagen", "Volvo", "Voyah", "W Motors", "Wartburg",
  "Westfield", "Wiesmann", "Willys", "XPeng", "Yugo", "Zastava", "ZAZ",
  "Zedriv", "Zenvo", "Zotye", "ZX",
]

export default function AdminCars() {
  const [cars, setCars] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...defaultCar })
  const [featureInput, setFeatureInput] = useState("")
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("admin-token")

  useEffect(() => {
    fetch(`${API}/cars`)
      .then((r) => r.json())
      .then(setCars)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData()
    fd.append("name", form.name)
    fd.append("brand", form.brand)
    fd.append("model", form.model)
    fd.append("year", form.year)
    fd.append("price", form.price)
    fd.append("fuelType", form.fuelType)
    fd.append("transmission", form.transmission)
    fd.append("engine", form.engine)
    fd.append("horsepower", form.horsepower)
    fd.append("mileage", form.mileage)
    fd.append("seats", form.seats)
    fd.append("color", form.color)
    fd.append("description", form.description)
    fd.append("description_es", form.description_es)
    fd.append("vin", form.vin)
    fd.append("features", JSON.stringify(form.features))
    fd.append("sold", form.sold ? "true" : "false")

    if (editing) {
      fd.append("existingImages", JSON.stringify(form.images))
    }
    if (!editing && form.image && !imageFiles.length) {
      fd.append("existingImages", JSON.stringify([form.image]))
    }

    imageFiles.forEach((f) => fd.append("images", f))

    const url = editing ? `${API}/cars/${editing.id}` : `${API}/cars`
    const method = editing ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")

      if (editing) {
        setCars(cars.map((c) => (c.id === editing.id ? data : c)))
      } else {
        setCars([data, ...cars])
      }
      resetForm()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (car) => {
    if (!confirm(`Delete ${car.name}?`)) return
    try {
      await fetch(`${API}/cars/${car.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setCars(cars.filter((c) => c.id !== car.id))
    } catch (err) {
      alert(err.message)
    }
  }

  const toggleSold = async (car) => {
    try {
      const res = await fetch(`${API}/cars/${car.id}/sold`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setCars(cars.map((c) => (c.id === data.id ? { ...c, sold: data.sold } : c)))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEdit = (car) => {
    setEditing(car)
    setForm({ ...car, features: car.features || [], images: car.images || [] })
    setImageFiles([])
    setImagePreviews([])
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ ...defaultCar })
    setEditing(null)
    setShowForm(false)
    setImageFiles([])
    setImagePreviews([])
    setFeatureInput("")
  }

  const addFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] })
    }
    setFeatureInput("")
  }

  const removeFeature = (i) => {
    setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles((prev) => [...prev, ...files])
    const previews = files.map((f) => URL.createObjectURL(f))
    setImagePreviews((prev) => [...prev, ...previews])
  }

  const removeNewImage = (i) => {
    URL.revokeObjectURL(imagePreviews[i])
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i))
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const removeExistingImage = (i) => {
    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Cars</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all text-sm"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Car"}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <h2 className="text-white font-bold text-lg mb-4">{editing ? "Edit" : "Add"} Vehicle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-dark-200 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" required />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Brand</label>
                <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40">
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Model</label>
                <input type="text" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" required />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Year</label>
                <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" required />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Price ($)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" required />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Fuel Type</label>
                <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40">
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Hybrid</option>
                  <option>Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Transmission</label>
                <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40">
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>CVT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Engine</label>
                <input type="text" value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Horsepower</label>
                <input type="number" value={form.horsepower} onChange={(e) => setForm({ ...form, horsepower: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Mileage</label>
                <input type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Seats</label>
                <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">Color</label>
                <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40" />
              </div>
              <div>
                <label className="block text-xs text-dark-200 mb-1">VIN</label>
                <input type="text" value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40 font-mono uppercase" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={form.sold} onChange={(e) => setForm({ ...form, sold: e.target.checked })}
                    className="w-5 h-5 rounded border-neon-500/30 bg-dark-700 text-neon-500 focus:ring-neon-500/40 cursor-pointer" />
                  <span className="text-sm text-dark-200 group-hover:text-white transition-colors">Mark as Sold</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs text-dark-200 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40 min-h-[80px]" />
            </div>

            <div>
              <label className="block text-xs text-dark-200 mb-1">Description (Español)</label>
              <textarea value={form.description_es} onChange={(e) => setForm({ ...form, description_es: e.target.value })}
                className="w-full px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40 min-h-[80px]" />
            </div>

            <div>
              <label className="block text-xs text-dark-200 mb-1">Features</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-2.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-500/40"
                  placeholder="Type a feature and press Enter" />
                <button type="button" onClick={addFeature}
                  className="px-4 py-2.5 bg-dark-700 border border-neon-500/20 rounded-xl text-neon-500 text-sm hover:bg-neon-500/10">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-neon-500/10 text-neon-500 text-xs rounded-full border border-neon-500/20">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-dark-200 mb-1">Images (select multiple)</label>
              <input type="file" accept="image/*" multiple onChange={handleImageSelect}
                className="w-full text-sm text-dark-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-dark-700 file:text-neon-500 file:text-sm file:font-semibold hover:file:bg-dark-600" />

              {(form.images.length > 0 || imagePreviews.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {editing && form.images.map((img, i) => (
                    <div key={`e-${i}`} className="relative group">
                      <img src={img} alt="" className="h-20 w-28 object-cover rounded-lg border border-neon-500/20" />
                      <button type="button" onClick={() => removeExistingImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.map((preview, i) => (
                    <div key={`n-${i}`} className="relative group">
                      <img src={preview} alt="" className="h-20 w-28 object-cover rounded-lg border border-neon-500/40" />
                      <button type="button" onClick={() => removeNewImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all text-sm disabled:opacity-50">
                {loading ? "Saving..." : editing ? "Update" : "Create"}
              </button>
              <button type="button" onClick={resetForm}
                className="px-6 py-2.5 border border-neon-500/20 text-dark-200 rounded-xl hover:text-white transition-all text-sm">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neon-500/10 text-dark-200 text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-semibold">Vehicle</th>
                <th className="text-left p-4 font-semibold">Brand</th>
                <th className="text-left p-4 font-semibold">Year</th>
                <th className="text-left p-4 font-semibold">VIN</th>
                <th className="text-left p-4 font-semibold">Photos</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Price</th>
                <th className="text-right p-4 font-semibold">Mileage</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, i) => (
                <motion.tr
                  key={car.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-neon-500/5 hover:bg-dark-700/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={car.image} alt="" className="w-12 h-9 rounded-lg object-cover" />
                      <span className="text-white font-medium">{car.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-dark-200">{car.brand}</td>
                  <td className="p-4 text-dark-200">{car.year}</td>
                  <td className="p-4 text-dark-200 text-xs font-mono">{car.vin || "—"}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-dark-200 text-xs">
                      <Image size={14} /> {car.images?.length || 1}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleSold(car)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        car.sold
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                      }`}>
                      {car.sold ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      {car.sold ? "Sold" : "Available"}
                    </button>
                  </td>
                  <td className="p-4 text-neon-500 font-semibold text-right">${car.price.toLocaleString()}</td>
                  <td className="p-4 text-dark-200 text-right">{car.mileage?.toLocaleString()} mi</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(car)}
                        className="p-2 rounded-lg text-dark-200 hover:text-neon-500 hover:bg-neon-500/10 transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(car)}
                        className="p-2 rounded-lg text-dark-200 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && (
            <p className="text-center text-dark-200 py-8">No cars yet. Add your first one!</p>
          )}
        </div>
      </div>
    </div>
  )
}
