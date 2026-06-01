import { createContext, useContext, useState, useEffect } from "react"
import { cars as staticCars } from "../data/cars"

const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

const CarContext = createContext()

export function CarProvider({ children }) {
  const [cars, setCars] = useState(staticCars)
  const [loading, setLoading] = useState(true)
  const [usingApi, setUsingApi] = useState(false)

  useEffect(() => {
    fetch(`${API}/cars`)
      .then((r) => {
        if (!r.ok) throw new Error("API not available")
        return r.json()
      })
      .then((data) => {
        if (data && data.length > 0) {
          setCars(data)
          setUsingApi(true)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const refreshCars = () => {
    fetch(`${API}/cars`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) setCars(data)
      })
      .catch(() => {})
  }

  return (
    <CarContext.Provider value={{ cars, loading, usingApi, refreshCars }}>
      {children}
    </CarContext.Provider>
  )
}

export function useCars() {
  return useContext(CarContext)
}
