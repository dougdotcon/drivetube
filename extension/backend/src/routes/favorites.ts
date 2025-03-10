import { FastifyInstance } from 'fastify'
import { prisma } from '../config/prisma'

export async function favoriteRoutes(app: FastifyInstance) {
  // Rota para listar favoritos
  app.get('/', async (request) => {
    const favorites = await prisma.favorite.findMany({
      where: { userId: request.user.id },
      include: { video: true },
      orderBy: { createdAt: 'desc' }
    })

    return {
      favorites: favorites.map((favorite) => favorite.video)
    }
  })

  // Rota para adicionar aos favoritos
  app.post('/:videoId', async (request, reply) => {
    try {
      const { videoId } = request.params as { videoId: string }

      // Verifica se o vídeo existe e pertence ao usuário
      const video = await prisma.video.findUnique({
        where: { id: videoId }
      })

      if (!video) {
        return reply.code(404).send({
          error: 'Vídeo não encontrado'
        })
      }

      if (video.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para favoritar este vídeo'
        })
      }

      // Verifica se já está nos favoritos
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_videoId: {
            userId: request.user.id,
            videoId
          }
        }
      })

      if (favorite) {
        return reply.code(400).send({
          error: 'Vídeo já está nos favoritos'
        })
      }

      // Adiciona aos favoritos
      await prisma.favorite.create({
        data: {
          userId: request.user.id,
          videoId
        }
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao adicionar aos favoritos'
      })
    }
  })

  // Rota para remover dos favoritos
  app.delete('/:videoId', async (request, reply) => {
    try {
      const { videoId } = request.params as { videoId: string }

      // Remove dos favoritos
      await prisma.favorite.delete({
        where: {
          userId_videoId: {
            userId: request.user.id,
            videoId
          }
        }
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao remover dos favoritos'
      })
    }
  })
} 