import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown } from "lucide-react"
import LanguageSwitcher from "./LanguageSwitcher"
import { useLang } from "../i18n/context"

const navLinks = [
  { nameKey: "home", path: "/" },
  { nameKey: "inventory", path: "/inventory" },
  { nameKey: "services", path: "/services" },
  { nameKey: "about", path: "/about" },
  { nameKey: "contact", path: "/contact" },
  { nameKey: "financing", path: "/financing" },
  { nameKey: "tradeIn", path: "/trade-in" },
  { nameKey: "testDrive", path: "/test-drive" },
  { nameKey: "applyNow", path: "/credit-application" },
]

export default function Navbar() {
  const { t } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-dark-700/90 backdrop-blur-xl shadow-lg shadow-neon-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.jpg"
              alt="Power Drive Motor"
              className="h-10 w-auto rounded-full border border-neon-500/30 group-hover:border-neon-500 transition-all duration-300"
            />
            <div>
              <h1 className="font-['Orbitron'] text-lg font-bold gradient-text tracking-wider">
                POWER DRIVE
              </h1>
              <p className="text-[10px] text-dark-200 tracking-[0.3em] uppercase -mt-1">
                Motor
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-nowrap">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-300 rounded-lg ${
                  location.pathname === link.path
                    ? "text-neon-500"
                    : "text-dark-200 hover:text-white"
                }`}
              >
                {t(`nav.${link.nameKey}`)}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-2 xl:left-3 right-2 xl:right-3 h-0.5 bg-neon-500 rounded-full shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                )}
              </Link>
            ))}
            <Link
              to="/inventory"
              className="ml-2 xl:ml-4 px-3 xl:px-5 py-2 bg-neon-500 text-dark-900 font-semibold text-xs xl:text-sm whitespace-nowrap rounded-lg hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
            >
              {t("nav.browseCars")}
            </Link>
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-50 p-2 text-white hover:text-neon-500 transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/70 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Side drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 bg-dark-800 border-l border-neon-500/10 shadow-2xl transition-transform duration-300 ease-out lg:hidden z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto pt-24 pb-8 px-6 gap-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-lg font-bold tracking-wider py-3 px-4 rounded-xl transition-all duration-300 ${
                location.pathname === link.path
                  ? "text-neon-500 bg-neon-500/10"
                  : "text-white hover:text-neon-400 hover:bg-white/5"
              }`}
              style={{ transitionDelay: isOpen ? `${i * 50}ms` : "0ms" }}
            >
              {t(`nav.${link.nameKey}`)}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 px-4">
            <Link
              to="/inventory"
              className="w-full text-center py-3 bg-neon-500 text-dark-900 font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            >
              {t("nav.browseCars")}
            </Link>
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
