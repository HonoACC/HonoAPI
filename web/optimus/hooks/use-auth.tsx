"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'

interface User {
  id: number
  username: string
  display_name: string
  email: string
  role: number
  status: number
  quota: number
  used_quota: number
  group: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const t = localStorage.getItem('token')
      if (!t) {
        setIsLoading(false)
        return
      }
      setToken(t)
      const res = await api.get('/api/user/self')
      if (res.data.success) {
        setUser(res.data.data)
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = async (username: string, password: string) => {
    const res = await api.post('/api/user/login', { username, password })
    if (res.data.success) {
      const t = res.data.data
      localStorage.setItem('token', t)
      localStorage.setItem('user_id', res.data.data?.id?.toString() || '')
      setToken(t)
      await refresh()
    } else {
      throw new Error(res.data.message || 'Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 100,
      login,
      logout,
      refresh,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
