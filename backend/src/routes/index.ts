import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth'
import { configRoutes } from './config'
import stripeRoutes from './stripe.routes'
import abacatePayRoutes from './abacatepay.routes'

export async function registerRoutes(app: FastifyInstance) {
  // Rotas de autenticação
  app.register(authRoutes, { prefix: '/api/auth' })

  // Rotas de configuração
  app.register(configRoutes, { prefix: '/api/config' })

  // Rotas de stripe
  app.register(stripeRoutes, { prefix: '/api/stripe' })

  // Rotas de abacatepay
  app.register(abacatePayRoutes, { prefix: '/api/abacatepay' })
} 