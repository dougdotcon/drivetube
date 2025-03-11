import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { google } from 'googleapis'
import { prisma } from '../config/prisma'
import { oauth2Client, getAuthUrl } from '../lib/google'
import { loginSchema, registerSchema } from '../types/user'
import { GoogleUserInfo } from '../types/google'
import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/validate', AuthController.validateToken)

export default router

export async function authRoutes(app: FastifyInstance) {
  // Rota de registro
  app.post('/register', async (request, reply) => {
    try {
      const data = registerSchema.parse(request.body)

      // Verifica se o email já está em uso
      const userExists = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (userExists) {
        return reply.code(400).send({
          error: 'E-mail já está em uso'
        })
      }

      // Cria o hash da senha
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Cria o usuário
      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword
        }
      })

      // Gera o token JWT
      const token = app.jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email
      })

      return reply.send({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      })
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao criar conta'
      })
    }
  })

  // Rota de login
  app.post('/login', async (request, reply) => {
    try {
      const data = loginSchema.parse(request.body)

      // Busca o usuário pelo email
      const user = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (!user) {
        return reply.code(400).send({
          error: 'E-mail ou senha incorretos'
        })
      }

      // Verifica a senha
      const validPassword = await bcrypt.compare(data.password, user.password)

      if (!validPassword) {
        return reply.code(400).send({
          error: 'E-mail ou senha incorretos'
        })
      }

      // Gera o token JWT
      const token = app.jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email
      })

      return reply.send({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      })
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao fazer login'
      })
    }
  })

  // Rota de autenticação com Google
  app.get('/google', async (request, reply) => {
    const url = getAuthUrl()
    return reply.send({ url })
  })

  // Rota de callback do Google
  app.post('/google', async (request, reply) => {
    try {
      const { token } = request.body as { token: string }

      // Define o token de acesso
      oauth2Client.setCredentials({ access_token: token })

      // Obtém as informações do usuário
      const oauth2 = google.oauth2('v2')
      const { data } = await oauth2.userinfo.get({ auth: oauth2Client })
      const userInfo = data as GoogleUserInfo

      // Busca o usuário pelo email
      let user = await prisma.user.findUnique({
        where: { email: userInfo.email }
      })

      if (!user) {
        // Cria o usuário se não existir
        user = await prisma.user.create({
          data: {
            name: userInfo.name,
            email: userInfo.email,
            password: await bcrypt.hash(Math.random().toString(36), 10),
            avatarUrl: userInfo.picture
          }
        })
      }

      // Gera o token JWT
      const jwtToken = app.jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email
      })

      return reply.send({
        token: jwtToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      })
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao autenticar com Google'
      })
    }
  })

  // Rota para obter o usuário atual
  app.get('/me', async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id }
    })

    return {
      user: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        avatarUrl: user!.avatarUrl
      }
    }
  })
} 