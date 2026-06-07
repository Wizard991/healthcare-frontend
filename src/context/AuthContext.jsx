import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(JSON.parse(localStorage.getItem('user') || 'null'))
    }
    setLoading(false)
  }, [token])

  const login = (t, u) => {
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
    setToken(t); setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setToken(null); setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)