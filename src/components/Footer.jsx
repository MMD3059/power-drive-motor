import { Link } from "react-router-dom"
import { Globe, Camera, MessageCircle, Play, Mail, Phone, MapPin, ChevronRight } from "lucide-react"
import { useLang } from "../i18n/context"

const quickLinks = [
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

export default function Footer() {
  const { t } = useLang()
  const svcItems = t("footer.serviceItems")
  const servicesList = Array.isArray(svcItems) ? svcItems : []
  return (
    <footer className="relative bg-dark-800 border-t border-neon-500/10">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-700/20 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.jpg"
                alt="Power Drive Motor"
                className="h-10 w-auto rounded-full border border-neon-500/30"
              />
              <div>
                <h3 className="font-['Orbitron'] text-lg font-bold gradient-text">
                  POWER DRIVE
                </h3>
                <p className="text-[10px] text-dark-200 tracking-[0.3em] uppercase">
                  Motor
                </p>
              </div>
            </div>
            <p className="text-dark-200 text-sm leading-relaxed mb-6">
              {t("footer.desc")}
            </p>
            <div className="flex gap-3">
              {[Globe, Camera, MessageCircle, Play].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 rounded-lg border border-neon-500/20 text-dark-200 hover:text-neon-500 hover:border-neon-500/50 hover:bg-neon-500/5 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-6">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-dark-200 hover:text-neon-500 transition-colors text-sm"
                  >
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {t(`nav.${link.nameKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-6">{t("footer.ourServices")}</h4>
            <ul className="space-y-3">
              {servicesList.map((s, i) => (
                <li key={i}>
                  <Link
                    to="/services"
                    className="group flex items-center gap-2 text-dark-200 hover:text-neon-500 transition-colors text-sm"
                  >
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-6">{t("footer.contactInfo")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-dark-200 text-sm">
                <MapPin size={18} className="text-neon-500 mt-0.5 shrink-0" />
                4309 E 12th St, Sioux Falls, SD 57103
              </li>
                <li className="flex items-center gap-3 text-dark-200 text-sm">
                  <Phone size={18} className="text-neon-500 shrink-0" />
                  <a href="tel:+16055012400" className="hover:text-neon-500 transition-colors">+1 605-501-2400</a>
                </li>
              <li className="flex items-center gap-3 text-dark-200 text-sm">
                <Mail size={18} className="text-neon-500 shrink-0" />
                <a href="mailto:Powerdrivemotorllc@gmail.com" className="hover:text-neon-500 transition-colors">Powerdrivemotorllc@gmail.com</a>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl glass-card">
              <p className="text-neon-500 text-sm font-semibold mb-1">{t("footer.businessHours")}</p>
              <p className="text-dark-200 text-xs">{t("footer.monFri")}</p>
              <p className="text-dark-200 text-xs">{t("footer.sat")}</p>
              <p className="text-dark-200 text-xs">{t("footer.sun")}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-neon-500/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-300 text-xs">
            &copy; {new Date().getFullYear()} Power Drive Motor. {t("footer.rights")}
          </p>
          <div className="flex gap-6 text-xs text-dark-300">
            <Link to="/privacy" className="hover:text-neon-500 transition-colors">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-neon-500 transition-colors">{t("footer.terms")}</Link>
            <a href="#" className="hover:text-neon-500 transition-colors">{t("footer.cookie")}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
