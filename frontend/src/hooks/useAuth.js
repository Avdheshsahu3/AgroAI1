import { useState, useCallback } from 'react'

const STORAGE_KEY = 'agroai_farmer'

export function useAuth() {
  const [farmer, setFarmer] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const login = useCallback((farmerData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farmerData))
    setFarmer(farmerData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setFarmer(null)
  }, [])

  return { farmer, login, logout, isAuthenticated: !!farmer }
}
