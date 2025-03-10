'use client'

import { create } from 'zustand'
import { User } from '../types/user'
import * as authService from '../services/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  googleAuth: (token: string, name: string, email: string, picture: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? authService.getUser() : null,
  isAuthenticated: typeof window !== 'undefined' ? authService.isAuthenticated() : false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authService.login({ email, password })
      authService.setToken(response.token)
      authService.setUser(response.user)
      set({ user: response.user, isAuthenticated: true })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao fazer login' })
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authService.register({ name, email, password })
      authService.setToken(response.token)
      authService.setUser(response.user)
      set({ user: response.user, isAuthenticated: true })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao criar conta' })
    } finally {
      set({ isLoading: false })
    }
  },

  googleAuth: async (token: string, name: string, email: string, picture: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authService.googleAuth({ token, name, email, picture })
      authService.setToken(response.token)
      authService.setUser(response.user)
      set({ user: response.user, isAuthenticated: true })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao autenticar com Google' })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null })
})) 