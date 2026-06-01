import { useEffect, useState } from "react"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return

    const script = document.createElement("script")
    script.id = "google-translate-script"
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateInit"
    script.async = true
    document.body.appendChild(script)

    window.googleTranslateInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      )
    }

    const checkReady = setInterval(() => {
      if (window.google && window.google.translate) {
        clearInterval(checkReady)
      }
    }, 500)

    return () => clearInterval(checkReady)
  }, [])

  const switchToSpanish = () => {
    const select = document.querySelector(".goog-te-combo")
    if (select) {
      select.value = "es"
      select.dispatchEvent(new Event("change"))
      setCurrentLang("es")
    } else {
      const el = document.getElementById("google_translate_element")
      if (el) {
        el.style.display = "block"
        setTimeout(() => {
          const s = document.querySelector(".goog-te-combo")
          if (s) {
            s.value = "es"
            s.dispatchEvent(new Event("change"))
            setCurrentLang("es")
          }
          el.style.display = "none"
        }, 1000)
      }
    }
  }

  const switchToEnglish = () => {
    const select = document.querySelector(".goog-te-combo")
    if (select) {
      select.value = "en"
      select.dispatchEvent(new Event("change"))
      setCurrentLang("en")
    }
  }

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <button
        onClick={currentLang === "en" ? switchToSpanish : switchToEnglish}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border border-neon-500/30 text-neon-500 rounded-lg hover:bg-neon-500/10 transition-all duration-300"
        title={currentLang === "en" ? "Switch to Spanish" : "Switch to English"}
      >
        <Globe size={14} />
        {currentLang === "en" ? "ES" : "EN"}
      </button>
    </>
  )
}
