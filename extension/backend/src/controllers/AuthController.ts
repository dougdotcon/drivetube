import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { pool } from '../database/connection'
import { User, UserResponse } from '../types/user'

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      avatarUrl: z.string().url().optional()
    })

    try {
      const userData = bodySchema.parse(request.body)

      // Verifica se o email já existe
      const [existingUser] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      )

      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return reply.status(400).send({ error: 'Email já cadastrado' })
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Cria o usuário
      const userId = randomUUID()

      await pool.execute(
        'INSERT INTO users (id, name, email, password, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [userId, userData.name, userData.email, hashedPassword, userData.avatarUrl]
      )

      // Gera o token JWT
      const token = await reply.jwtSign({
        id: userId,
        name: userData.name,
        email: userData.email
      })

      return reply.status(201).send({ token })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string()
    })

    try {
      const { email, password } = bodySchema.parse(request.body)

      // Busca o usuário pelo email
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      )

      const users = rows as User[]
      const user = users[0]

      if (!user) {
        return reply.status(401).send({ error: 'Credenciais inválidas' })
      }

      // Verifica a senha
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return reply.status(401).send({ error: 'Credenciais inválidas' })
      }

      // Gera o token JWT
      const token = await reply.jwtSign({
        id: user.id,
        name: user.name,
        email: user.email
      })

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      return reply.send({ token, user: userResponse })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }

  async googleAuth(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      token: z.string(),
      name: z.string(),
      email: z.string().email(),
      picture: z.string().url()
    })

    try {
      const userData = bodySchema.parse(request.body)

      // Busca o usuário pelo email
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [userData.email]
      )

      const users = rows as User[]
      let user = users[0]

      if (!user) {
        // Cria um novo usuário
        const userId = randomUUID()
        const randomPassword = randomUUID() // Senha aleatória para usuários do Google

        // Hash da senha
        const hashedPassword = await bcrypt.hash(randomPassword, 10)

        await pool.execute(
          'INSERT INTO users (id, name, email, password, avatar_url) VALUES (?, ?, ?, ?, ?)',
          [userId, userData.name, userData.email, hashedPassword, userData.picture]
        )

        user = {
          id: userId,
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          avatarUrl: userData.picture,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      // Gera o token JWT
      const token = await reply.jwtSign({
        id: user.id,
        name: user.name,
        email: user.email
      })

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      return reply.send({ token, user: userResponse })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }
} 