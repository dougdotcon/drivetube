'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { api } from '@/lib/api'
import { User } from '../types/user'
import * as authService from '../services/auth'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`
      validateToken()
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async () => {
    try {
      const response = await api.get('/auth/validate')
      setUser(response.data.user)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      api.defaults.headers.authorization = `Bearer ${token}`
      setUser(user)
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao fazer login'
      throw new Error(message)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      api.defaults.headers.authorization = `Bearer ${token}`
      setUser(user)
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao criar conta'
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.authorization
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 