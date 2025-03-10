import { FastifyInstance } from 'fastify'
import { prisma } from '../config/prisma'
import {
  createPlaylistSchema,
  updatePlaylistSchema,
  addVideoToPlaylistSchema,
  reorderPlaylistVideosSchema
} from '../types/playlist'

export async function playlistRoutes(app: FastifyInstance) {
  // Rota para listar playlists
  app.get('/', async (request) => {
    const playlists = await prisma.playlist.findMany({
      where: { userId: request.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return { playlists }
  })

  // Rota para obter uma playlist
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        videos: {
          include: {
            video: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    })

    if (!playlist) {
      return reply.code(404).send({
        error: 'Playlist não encontrada'
      })
    }

    if (playlist.userId !== request.user.id) {
      return reply.code(403).send({
        error: 'Você não tem permissão para acessar esta playlist'
      })
    }

    return {
      playlist: {
        ...playlist,
        videos: playlist.videos.map((pv) => ({
          ...pv.video,
          position: pv.position
        }))
      }
    }
  })

  // Rota para criar uma playlist
  app.post('/', async (request, reply) => {
    try {
      const data = createPlaylistSchema.parse(request.body)

      const playlist = await prisma.playlist.create({
        data: {
          ...data,
          userId: request.user.id
        }
      })

      return reply.code(201).send({ id: playlist.id })
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao criar playlist'
      })
    }
  })

  // Rota para atualizar uma playlist
  app.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const data = updatePlaylistSchema.parse(request.body)

      const playlist = await prisma.playlist.findUnique({
        where: { id }
      })

      if (!playlist) {
        return reply.code(404).send({
          error: 'Playlist não encontrada'
        })
      }

      if (playlist.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para atualizar esta playlist'
        })
      }

      await prisma.playlist.update({
        where: { id },
        data
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao atualizar playlist'
      })
    }
  })

  // Rota para excluir uma playlist
  app.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const playlist = await prisma.playlist.findUnique({
        where: { id }
      })

      if (!playlist) {
        return reply.code(404).send({
          error: 'Playlist não encontrada'
        })
      }

      if (playlist.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para excluir esta playlist'
        })
      }

      await prisma.playlist.delete({
        where: { id }
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao excluir playlist'
      })
    }
  })

  // Rota para adicionar um vídeo à playlist
  app.post('/:id/videos', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const data = addVideoToPlaylistSchema.parse(request.body)

      const playlist = await prisma.playlist.findUnique({
        where: { id },
        include: {
          videos: {
            orderBy: {
              position: 'desc'
            },
            take: 1
          }
        }
      })

      if (!playlist) {
        return reply.code(404).send({
          error: 'Playlist não encontrada'
        })
      }

      if (playlist.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para adicionar vídeos a esta playlist'
        })
      }

      // Verifica se o vídeo existe e pertence ao usuário
      const video = await prisma.video.findUnique({
        where: { id: data.videoId }
      })

      if (!video) {
        return reply.code(404).send({
          error: 'Vídeo não encontrado'
        })
      }

      if (video.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para adicionar este vídeo'
        })
      }

      // Verifica se o vídeo já está na playlist
      const videoInPlaylist = await prisma.playlistVideo.findUnique({
        where: {
          playlistId_videoId: {
            playlistId: id,
            videoId: data.videoId
          }
        }
      })

      if (videoInPlaylist) {
        return reply.code(400).send({
          error: 'Vídeo já está na playlist'
        })
      }

      // Adiciona o vídeo na última posição
      const lastPosition = playlist.videos[0]?.position ?? 0
      await prisma.playlistVideo.create({
        data: {
          playlistId: id,
          videoId: data.videoId,
          position: lastPosition + 1
        }
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao adicionar vídeo à playlist'
      })
    }
  })

  // Rota para remover um vídeo da playlist
  app.delete('/:id/videos/:videoId', async (request, reply) => {
    try {
      const { id, videoId } = request.params as { id: string; videoId: string }

      const playlist = await prisma.playlist.findUnique({
        where: { id }
      })

      if (!playlist) {
        return reply.code(404).send({
          error: 'Playlist não encontrada'
        })
      }

      if (playlist.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para remover vídeos desta playlist'
        })
      }

      // Remove o vídeo
      await prisma.playlistVideo.delete({
        where: {
          playlistId_videoId: {
            playlistId: id,
            videoId
          }
        }
      })

      // Reordena os vídeos restantes
      const videos = await prisma.playlistVideo.findMany({
        where: { playlistId: id },
        orderBy: { position: 'asc' }
      })

      await Promise.all(
        videos.map((video, index) =>
          prisma.playlistVideo.update({
            where: {
              playlistId_videoId: {
                playlistId: id,
                videoId: video.videoId
              }
            },
            data: { position: index + 1 }
          })
        )
      )

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao remover vídeo da playlist'
      })
    }
  })

  // Rota para reordenar vídeos da playlist
  app.put('/:id/videos/reorder', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const data = reorderPlaylistVideosSchema.parse(request.body)

      const playlist = await prisma.playlist.findUnique({
        where: { id }
      })

      if (!playlist) {
        return reply.code(404).send({
          error: 'Playlist não encontrada'
        })
      }

      if (playlist.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Você não tem permissão para reordenar vídeos desta playlist'
        })
      }

      // Atualiza a posição dos vídeos
      await Promise.all(
        data.videos.map((video) =>
          prisma.playlistVideo.update({
            where: {
              playlistId_videoId: {
                playlistId: id,
                videoId: video.id
              }
            },
            data: { position: video.position }
          })
        )
      )

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao reordenar vídeos'
      })
    }
  })
} 