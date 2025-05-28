import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { videoRoutes } from './routes/videos'
import { authRoutes } from './routes/auth'
import { subscriptionRoutes } from './routes/subscriptions'
import { planRoutes } from './routes/plans'
import { userRoutes } from './routes/users'
import { playlistRoutes } from './routes/playlists'
import { favoriteRoutes } from './routes/favorites'
import { waitlistRoutes } from './routes/waitlist'

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
  app.register(subscriptionRoutes, { prefix: '/api/subscriptions' })
  app.register(planRoutes, { prefix: '/api/plans' })
  app.register(userRoutes, { prefix: '/api/users' })
  app.register(playlistRoutes, { prefix: '/api/playlists' })
  app.register(favoriteRoutes, { prefix: '/api/favorites' })
  app.register(waitlistRoutes, { prefix: '/api/waitlist' })

  return app
}

// Iniciar o servidor se este arquivo for executado diretamente
if (require.main === module) {
  const start = async () => {
    try {
      const app = await createServer()
      const port = Number(process.env.PORT) || 3333
      const host = process.env.HOST || 'localhost'

      await app.listen({ port, host })
      console.log(`🚀 Servidor rodando em http://${host}:${port}`)
    } catch (err) {
      console.error('❌ Erro ao iniciar servidor:', err)
      process.exit(1)
    }
  }

  start()
}