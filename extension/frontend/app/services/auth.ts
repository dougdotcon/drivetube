'use client'

import { api } from '@/lib/api'
import { User, AuthResponse, LoginData, RegisterData, GoogleAuthData } from '../types/user'

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data)
  return response.data
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data)
  return response.data
}

export async function googleAuth(data: GoogleAuthData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/google', data)
  return response.data
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export function setUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token')
  }
  return false
}

export async function validateToken(): Promise<AuthResponse> {
  const response = await api.get<AuthResponse>('/auth/validate')
  return response.data
}

export async function logout(): Promise<void> {
  localStorage.removeItem('token')
  delete api.defaults.headers.authorization
} 