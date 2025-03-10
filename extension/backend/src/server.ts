import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { videoRoutes } from './routes/videos'
import { authRoutes } from './routes/auth'
import { configRoutes } from './routes/config'

export async function createServer(): Promise<FastifyInstance> {
  const app = require('fastify')({
    logger: true
  })

  await app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })

  // Rotas
  app.register(videoRoutes, { prefix: '/api/videos' })
  app.register(authRoutes, { prefix: '/api/auth' })
  app.register(configRoutes, { prefix: '/api/config' })

  return app
} 