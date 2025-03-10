import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '../config/prisma'
import { updateUserSchema } from '../types/user'

export async function userRoutes(app: FastifyInstance) {
  // Rota para atualizar o usuário
  app.put('/me', async (request, reply) => {
    try {
      const data = updateUserSchema.parse(request.body)

      // Se o email foi alterado, verifica se já está em uso
      if (data.email) {
        const userExists = await prisma.user.findFirst({
          where: {
            email: data.email,
            NOT: {
              id: request.user.id
            }
          }
        })

        if (userExists) {
          return reply.code(400).send({
            error: 'E-mail já está em uso'
          })
        }
      }

      // Se a senha foi alterada, cria o hash
      let hashedPassword: string | undefined
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10)
      }

      // Atualiza o usuário
      const user = await prisma.user.update({
        where: { id: request.user.id },
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          avatarUrl: data.avatarUrl
        }
      })

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      }
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao atualizar usuário'
      })
    }
  })

  // Rota para excluir o usuário
  app.delete('/me', async (request, reply) => {
    try {
      await prisma.user.delete({
        where: { id: request.user.id }
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao excluir usuário'
      })
    }
  })
} 