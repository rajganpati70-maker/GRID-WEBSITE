import React, { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, loginUser, getUserByUsername, updateUser } from '../data/store'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('grid_session')
      if (stored) {
        const { username } = JSON.parse(stored)
        const u = getUserByUsername(username)
        if (u) setUser(u)
      }
    } catch {}
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const u = loginUser(email, password)
    localStorage.setItem('grid_session', JSON.stringify({ username: u.username }))
    setUser(u)
    return u
  }

  const register = async (username, email, password, role) => {
    const u = registerUser(username, email, password, role)
    localStorage.setItem('grid_session', JSON.stringify({ username: u.username }))
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('grid_session')
    setUser(null)
  }

  const refreshUser = () => {
    if (!user) return
    const fresh = getUserByUsername(user.username)
    if (fresh) setUser(fresh)
  }

  const updateProfile = (updates) => {
    if (!user) return null
    const updated = updateUser(user.id, updates)
    if (updated) {
      setUser(updated)
      localStorage.setItem('grid_session', JSON.stringify({ username: updated.username }))
    }
    return updated
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refreshUser, updateProfile, token: user ? 'local' : null }}>
      {children}
    </AuthContext.Provider>
  )
}
