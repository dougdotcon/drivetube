import { Request, Response } from 'express'
import { AuthService } from '../services/authService'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
      }

      const result = await AuthService.register(name, email, password)
      return res.status(201).json(result)
    } catch (error: any) {
      console.error('Erro no registro:', error)
      return res.status(400).json({ error: error.message })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' })
      }

      const result = await AuthService.login(email, password)
      return res.status(200).json(result)
    } catch (error: any) {
      console.error('Erro no login:', error)
      return res.status(401).json({ error: error.message })
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1]

      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' })
      }

      const result = await AuthService.validateToken(token)
      return res.status(200).json(result)
    } catch (error: any) {
      console.error('Erro na validação do token:', error)
      return res.status(401).json({ error: error.message })
    }
  }
} 