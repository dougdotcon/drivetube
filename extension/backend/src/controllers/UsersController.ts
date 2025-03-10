import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { pool } from '../database/connection'
import { UserResponse } from '../types/user'

export class UsersController {
  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, avatar_url, created_at, updated_at FROM users WHERE id = ?',
        [request.user.id]
      )

      const users = rows as any[]
      const userData = users[0]

      if (!userData) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }

      const userResponse: UserResponse = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatar_url,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at
      }

      return reply.send({ user: userResponse })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string().min(3).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      avatarUrl: z.string().url().optional()
    })

    try {
      const userData = bodySchema.parse(request.body)

      // Verifica se o email já existe
      if (userData.email) {
        const [existingUser] = await pool.execute(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [userData.email, request.user.id]
        )

        if (Array.isArray(existingUser) && existingUser.length > 0) {
          return reply.status(400).send({ error: 'Email já cadastrado' })
        }
      }

      // Hash da senha se fornecida
      let hashedPassword: string | undefined
      if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, 10)
      }

      // Atualiza o usuário
      await pool.execute(
        `UPDATE users SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          password = COALESCE(?, password),
          avatar_url = COALESCE(?, avatar_url),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.avatarUrl,
          request.user.id
        ]
      )

      return reply.send({ message: 'Usuário atualizado com sucesso' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [request.user.id]
      )

      return reply.send({ message: 'Usuário excluído com sucesso' })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }
} 