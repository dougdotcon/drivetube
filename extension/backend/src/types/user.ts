import { z } from 'zod'

export interface User {
  id: string
  name: string
  email: string
  password: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserRegisterData {
  name: string
  email: string
  password: string
}

export interface UserLoginData {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
})

export const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  avatarUrl: z.string().url().optional()
})

export const updateUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').optional(),
  avatarUrl: z.string().url().optional()
})

export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema> 