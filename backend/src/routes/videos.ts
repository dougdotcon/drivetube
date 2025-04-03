import { FastifyInstance } from 'fastify'
import { drive } from '../lib/google'
import { prisma } from '../config/prisma'
import { createVideoSchema, updateVideoSchema } from '../types/video'
import { DriveFile } from '../types/drive'

export async function videoRoutes(app: FastifyInstance) {
  // Rota para listar vídeos
  app.get('/', async (request) => {
    const videos = await prisma.video.findMany({
      where: { userId: request.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return { videos }
  })

  // Rota para obter um vídeo
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const video = await prisma.video.findUnique({
      where: { id }
    })

    if (!video) {
      return reply.code(404).send({
        error: 'Vídeo não encontrado'
      })
    }

    if (video.userId !== request.user.id) {
      return reply.code(403).send({
        error: 'Você não tem permissão para acessar este vídeo'
      })
    }

    return { video }
  })

  // Rota para obter a URL de incorporação do vídeo
  app.get('/:id/embed', async (request, reply) => {
    const { id } = request.params as { id: string }

    const video = await prisma.video.findUnique({
      where: { id }
    })

    if (!video) {
      return reply.code(404).send({
        error: 'Vídeo não encontrado'
      })
    }

    if (video.userId !== request.user.id) {
      return reply.code(403).send({
        error: 'Você não tem permissão para acessar este vídeo'
      })
    }

    // Obtém o arquivo do Drive
    const { data } = await drive.files.get({
      fileId: video.driveId,
      fields: 'webViewLink'
    })

    // Extrai o ID do vídeo da URL do Drive
    const embedUrl = data.webViewLink?.replace(
      /\/view\?usp=sharing$/,
      '/preview'
    )

    return { embedUrl }
  })

  // Rota para criar um vídeo
  app.post('/', async (request, reply) => {
    try {
      const data = createVideoSchema.parse(request.body)

      // Verifica se o arquivo existe no Drive
      const { data: file } = await drive.files.get({
        fileId: data.driveId,
        fields: '*'
      })

      const driveFile = file as DriveFile

      // Cria o vídeo
      const video = await prisma.video.create({
        data: {
          ...data,
          userId: request.user.id
        }
      })

      return reply.code(201).send({ id: video.id })
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao criar vídeo'
      })
    }
  })

  // Rota para atualizar um vídeo
  app.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const data = updateVideoSchema.parse(request.body)

      // Verifica se o vídeo existe
      const video = await prisma.video.findUnique({
        where: { id }
      })

      if (!video) {
        return reply.code(404).send({
          error: 'Vídeo não encontrado'
        })
      }

      if (video.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para atualizar este vídeo'
        })
      }

      // Atualiza o vídeo
      await prisma.video.update({
        where: { id },
        data
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao atualizar vídeo'
      })
    }
  })

  // Rota para excluir um vídeo
  app.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      // Verifica se o vídeo existe
      const video = await prisma.video.findUnique({
        where: { id }
      })

      if (!video) {
        return reply.code(404).send({
          error: 'Vídeo não encontrado'
        })
      }

      if (video.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para excluir este vídeo'
        })
      }

      // Exclui o vídeo
      await prisma.video.delete({
        where: { id }
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao excluir vídeo'
      })
    }
  })
} 