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

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  location.pathname === link.path
                    ? "text-neon-500"
                    : "text-dark-200 hover:text-white"
                }`}
              >
                {t(`nav.${link.nameKey}`)}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-neon-500 rounded-full shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                )}
              </Link>
            ))}
            <Link
              to="/inventory"
              className="ml-4 px-6 py-2.5 bg-neon-500 text-dark-900 font-semibold text-sm rounded-lg hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
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

      <div
        className={`fixed inset-0 bg-dark-900/95 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-2xl font-bold tracking-wider transition-all duration-300 ${
                location.pathname === link.path
                  ? "text-neon-500"
                  : "text-white hover:text-neon-400"
              }`}
              style={{ transitionDelay: isOpen ? `${i * 80}ms` : "0ms" }}
            >
              {t(`nav.${link.nameKey}`)}
            </Link>
          ))}
          <Link
            to="/inventory"
            className="mt-6 px-10 py-4 bg-neon-500 text-dark-900 font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.4)]"
          >
            {t("nav.browseCars")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
