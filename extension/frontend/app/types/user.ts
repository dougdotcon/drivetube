export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface GoogleAuthData {
  token: string
  name: string
  email: string
  picture: string
} 