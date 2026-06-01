import { createContext, useContext, useState, useEffect } from "react"

const LangContext = createContext()

const saved = localStorage.getItem("lang")
const defaultLang = saved === "es" ? "es" : "en"

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(defaultLang)
  const [dict, setDict] = useState({})

  useEffect(() => {
    import(`./${lang}.json`).then((m) => setDict(m.default))
  }, [lang])

  const toggleLang = () => {
    const next = lang === "en" ? "es" : "en"
    setLang(next)
    localStorage.setItem("lang", next)
  }

  const t = (key) => {
    const keys = key.split(".")
    let val = dict
    for (const k of keys) {
      if (val == null) return key
      val = val[k]
    }
    return val ?? key
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
