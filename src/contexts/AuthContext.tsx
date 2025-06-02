'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentUser, setAuthToken, removeAuthToken } from '@/lib/auth'

interface User {
  id: string
  email: string
  nombre: string
  rol: string
  direcciones?: {
    id: string
    calle: string
    numero: string
    piso: string | null
    codigoPostal: string
    ciudad: string
    provincia: string
  }[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshUser()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (token: string) => {
    setAuthToken(token)
    await refreshUser()
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
