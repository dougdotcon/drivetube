import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { pool } from '../database/connection'
import { Playlist, PlaylistVideo } from '../types/playlist'

export class PlaylistsController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM playlists WHERE user_id = ? ORDER BY name',
        [request.user.id]
      )

      const playlists = rows as Playlist[]

      return reply.send(playlists)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao listar playlists' })
    }
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)

      const [playlistRows] = await pool.execute(
        'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
        [id, request.user.id]
      )

      const playlists = playlistRows as Playlist[]
      const playlist = playlists[0]

      if (!playlist) {
        return reply.status(404).send({ error: 'Playlist não encontrada' })
      }

      const [videoRows] = await pool.execute(
        `SELECT v.*, pv.position
        FROM videos v
        INNER JOIN playlist_videos pv ON pv.video_id = v.id
        WHERE pv.playlist_id = ?
        ORDER BY pv.position`,
        [id]
      )

      const videos = videoRows as PlaylistVideo[]

      return reply.send({ ...playlist, videos })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao buscar playlist' })
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    })

    try {
      const playlistData = bodySchema.parse(request.body)

      const playlistId = randomUUID()

      await pool.execute(
        'INSERT INTO playlists (id, user_id, name, description) VALUES (?, ?, ?, ?)',
        [playlistId, request.user.id, playlistData.name, playlistData.description]
      )

      return reply.status(201).send({ id: playlistId })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao criar playlist' })
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)
      const playlistData = bodySchema.parse(request.body)

      const [result] = await pool.execute(
        `UPDATE playlists SET
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?`,
        [playlistData.name, playlistData.description, id, request.user.id]
      )

      const updateResult = result as { affectedRows: number }

      if (updateResult.affectedRows === 0) {
        return reply.status(404).send({ error: 'Playlist não encontrada' })
      }

      return reply.send({ message: 'Playlist atualizada com sucesso' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao atualizar playlist' })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)

      const [result] = await pool.execute(
        'DELETE FROM playlists WHERE id = ? AND user_id = ?',
        [id, request.user.id]
      )

      const deleteResult = result as { affectedRows: number }

      if (deleteResult.affectedRows === 0) {
        return reply.status(404).send({ error: 'Playlist não encontrada' })
      }

      return reply.send({ message: 'Playlist excluída com sucesso' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao excluir playlist' })
    }
  }

  async addVideo(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      videoId: z.string().uuid(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)
      const { videoId } = bodySchema.parse(request.body)

      // Verifica se a playlist existe e pertence ao usuário
      const [playlistRows] = await pool.execute(
        'SELECT id FROM playlists WHERE id = ? AND user_id = ?',
        [id, request.user.id]
      )

      const playlists = playlistRows as any[]
      if (playlists.length === 0) {
        return reply.status(404).send({ error: 'Playlist não encontrada' })
      }

      // Verifica se o vídeo existe e pertence ao usuário
      const [videoRows] = await pool.execute(
        'SELECT id FROM videos WHERE id = ? AND user_id = ?',
        [videoId, request.user.id]
      )

      const videos = videoRows as any[]
      if (videos.length === 0) {
        return reply.status(404).send({ error: 'Vídeo não encontrado' })
      }

      // Obtém a última posição
      const [positionRows] = await pool.execute(
        'SELECT COALESCE(MAX(position), 0) as lastPosition FROM playlist_videos WHERE playlist_id = ?',
        [id]
      )

      const positions = positionRows as [{ lastPosition: number }]
      const nextPosition = positions[0].lastPosition + 1

      // Adiciona o vídeo à playlist
      await pool.execute(
        'INSERT INTO playlist_videos (playlist_id, video_id, position) VALUES (?, ?, ?)',
        [id, videoId, nextPosition]
      )

      return reply.status(201).send({ message: 'Vídeo adicionado à playlist' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao adicionar vídeo à playlist' })
    }
  }

  async removeVideo(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
      videoId: z.string().uuid(),
    })

    try {
      const { id, videoId } = paramsSchema.parse(request.params)

      // Verifica se a playlist existe e pertence ao usuário
      const [playlistRows] = await pool.execute(
        'SELECT id FROM playlists WHERE id = ? AND user_id = ?',
        [id, request.user.id]
      )

      const playlists = playlistRows as any[]
      if (playlists.length === 0) {
        return reply.status(404).send({ error: 'Playlist não encontrada' })
      }

      // Remove o vídeo da playlist
      const [result] = await pool.execute(
        'DELETE FROM playlist_videos WHERE playlist_id = ? AND video_id = ?',
        [id, videoId]
      )

      const deleteResult = result as { affectedRows: number }

      if (deleteResult.affectedRows === 0) {
        return reply.status(404).send({ error: 'Vídeo não encontrado na playlist' })
      }

      // Reordena os vídeos restantes
      await pool.execute(
        `UPDATE playlist_videos
        SET position = (@row_number:=@row_number + 1)
        WHERE playlist_id = ?
        ORDER BY position`,
        [id]
      )

      return reply.send({ message: 'Vídeo removido da playlist' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao remover vídeo da playlist' })
    }
  }

  async reorderVideos(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      videos: z.array(
        z.object({
          id: z.string().uuid(),
          position: z.number().int().positive(),
        })
      ),
    })

    try {
      const { id } = paramsSchema.parse(request.params)
      const { videos } = bodySchema.parse(request.body)

      // Verifica se a playlist existe e pertence ao usuário
      const [playlistRows] = await pool.execute(
        'SELECT id FROM playlists WHERE id = ? AND user_id = ?',
        [id, request.user.id]
      )

      const playlists = playlistRows as any[]
      if (playlists.length === 0) {
        return reply.status(404).send({ error: 'Playlist não encontrada' })
      }

      // Atualiza a posição de cada vídeo
      for (const video of videos) {
        await pool.execute(
          'UPDATE playlist_videos SET position = ? WHERE playlist_id = ? AND video_id = ?',
          [video.position, id, video.id]
        )
      }

      return reply.send({ message: 'Ordem dos vídeos atualizada com sucesso' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao reordenar vídeos' })
    }
  }
} 