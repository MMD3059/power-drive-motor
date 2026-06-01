import { Globe } from "lucide-react"
import { useLang } from "../i18n/context"

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLang()

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border border-neon-500/30 text-neon-500 rounded-lg hover:bg-neon-500/10 transition-all duration-300"
      title={lang === "en" ? "Switch to Spanish" : "Switch to English"}
    >
      <Globe size={14} />
      {lang === "en" ? "ES" : "EN"}
    </button>
  )
}
