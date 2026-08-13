import { createContext, useContext, useEffect, useState } from 'react'
import apiClient from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }

    apiClient
      .get('/me')
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('auth_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const response = await apiClient.post('/login', { email, password })
    localStorage.setItem('auth_token', response.data.token)
    setUser(response.data.user)
    return response.data.user
  }

  async function register(payload) {
    const response = await apiClient.post('/register', payload)
    localStorage.setItem('auth_token', response.data.token)
    setUser(response.data.user)
    return response.data.user
  }

  async function logout() {
    try {
      await apiClient.post('/logout')
    } finally {
      localStorage.removeItem('auth_token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>.")
  }
  return context
}
