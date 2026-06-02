import { useState, useMemo } from "react"
import { useLang } from "../i18n/context"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X, Car } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { useCars } from "../contexts/CarContext"
import { brands, fuelTypes, priceRanges } from "../data/cars"
import { thumbnail } from "../utils/images"

export default function Inventory() {
  const { t } = useLang()
  const { cars } = useCars()
  const [search, setSearch] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("All")
  const [selectedFuel, setSelectedFuel] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState("All")
  const [sortBy, setSortBy] = useState("default")
  const [showFilters, setShowFilters] = useState(false)

  const filteredCars = useMemo(() => {
    let result = [...cars]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q)
      )
    }

    if (selectedBrand !== "All") {
      result = result.filter((c) => c.brand === selectedBrand)
    }
    if (selectedFuel !== "All") {
      result = result.filter((c) => c.fuelType === selectedFuel)
    }
    if (selectedPrice !== "All") {
      const range = priceRanges.find((p) => p.label === selectedPrice)
      if (range) {
        result = result.filter((c) => c.price >= range.min && c.price < range.max)
      }
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "year":
        result.sort((a, b) => b.year - a.year)
        break
    }

    return result
  }, [search, selectedBrand, selectedFuel, selectedPrice, sortBy])

  const clearFilters = () => {
    setSearch("")
    setSelectedBrand("All")
    setSelectedFuel("All")
    setSelectedPrice("All")
    setSortBy("default")
  }

  const hasFilters =
    search || selectedBrand !== "All" || selectedFuel !== "All" || selectedPrice !== "All"

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={t("inventory.subtitle")}
            title={t("inventory.title")}
            description={t("inventory.desc")}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" />
            <input
              type="text"
              placeholder={t("inventory.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:border-neon-500/40 focus:ring-1 focus:ring-neon-500/20 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3.5 bg-dark-700/80 border border-neon-500/10 rounded-xl text-dark-200 focus:outline-none focus:border-neon-500/40 text-sm cursor-pointer"
            >
              <option value="default">{t("inventory.sortDefault")}</option>
              <option value="price-asc">{t("inventory.sortLowHigh")}</option>
              <option value="price-desc">{t("inventory.sortHighLow")}</option>
              <option value="name">{t("inventory.sortName")}</option>
              <option value="year">{t("inventory.sortNewest")}</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3.5 border rounded-xl transition-all ${
                showFilters
                  ? "bg-neon-500/10 border-neon-500/40 text-neon-500"
                  : "bg-dark-700/80 border-neon-500/10 text-dark-200 hover:border-neon-500/30"
              }`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: showFilters ? "auto" : 0,
            opacity: showFilters ? 1 : 0,
          }}
          className="overflow-hidden mb-8"
        >
          <div className="glass rounded-xl p-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-dark-200 tracking-wider uppercase mb-2">{t("inventory.brand")}</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 text-sm cursor-pointer"
                >
                  <option value="All">{t("inventory.allBrands")}</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-200 tracking-wider uppercase mb-2">{t("inventory.fuelType")}</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 text-sm cursor-pointer"
                >
                  <option value="All">{t("inventory.allFuels")}</option>
                  {fuelTypes.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-200 tracking-wider uppercase mb-2">{t("inventory.priceRange")}</label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 text-sm cursor-pointer"
                >
                  <option value="All">{t("inventory.allPrices")}</option>
                  {priceRanges.map((p) => (
                    <option key={p.label} value={p.label}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-1 text-xs text-neon-500 hover:text-neon-400 transition-colors"
              >
                <X size={14} /> {t("inventory.clearAll")}
              </button>
            )}
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-dark-200 text-sm">
            {t("inventory.showing")} <span className="text-white font-semibold">{filteredCars.length}</span> {t("inventory.vehicles")}
          </p>
          <div className="flex gap-2 flex-wrap">
            {selectedBrand !== "All" && (
              <span className="px-3 py-1 text-xs bg-neon-500/10 text-neon-500 rounded-full border border-neon-500/20">
                {selectedBrand}
              </span>
            )}
            {selectedFuel !== "All" && (
              <span className="px-3 py-1 text-xs bg-neon-500/10 text-neon-500 rounded-full border border-neon-500/20">
                {selectedFuel}
              </span>
            )}
            {selectedPrice !== "All" && (
              <span className="px-3 py-1 text-xs bg-neon-500/10 text-neon-500 rounded-full border border-neon-500/20">
                {selectedPrice}
              </span>
            )}
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <Car size={60} className="mx-auto text-dark-300 mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">{t("inventory.noTitle")}</h3>
            <p className="text-dark-200 mb-6">{t("inventory.noDesc")}</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-neon-500 text-dark-900 font-semibold rounded-xl"
            >
              {t("inventory.clearFilters")}
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCars.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/inventory/${car.id}`}
                  className="group block glass-card rounded-xl overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={thumbnail(car.image, "400x300")}
                      alt={car.name}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {!!car.sold && (
                      <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center">
                        <span className="px-6 py-2 bg-red-600 text-white font-bold text-lg rounded-xl rotate-[-15deg] shadow-lg border-2 border-red-400">
                          {t("inventory.sold")}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-semibold bg-neon-500/20 text-neon-500 border border-neon-500/30 rounded-full backdrop-blur-sm">
                        {car.fuelType}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-dark-200 text-xs font-semibold tracking-wider uppercase mb-1">{car.brand}</p>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-neon-500 transition-colors">{car.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5 text-dark-200 text-sm">
                        <span className="text-neon-500 font-semibold">{car.mileage.toLocaleString()}</span> mi
                      </span>
                      <span className="text-dark-200 text-sm">{car.year}</span>
                    </div>
                    <div className="border-t border-neon-500/10 pt-3">
                      <p className="text-neon-500 font-bold text-xl">${car.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
