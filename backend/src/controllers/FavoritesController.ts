import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { pool } from '../database/connection'
import { DriveVideo } from '../types/drive'

export class FavoritesController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const [rows] = await pool.execute(
        `SELECT v.*
        FROM videos v
        INNER JOIN favorites f ON f.video_id = v.id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC`,
        [request.user.id]
      )

      const videos = rows as DriveVideo[]

      return reply.send(videos)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao listar favoritos' })
    }
  }

  async add(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    })

    try {
      const { videoId } = paramsSchema.parse(request.params)

      // Verifica se o vídeo existe e pertence ao usuário
      const [videoRows] = await pool.execute(
        'SELECT id FROM videos WHERE id = ? AND user_id = ?',
        [videoId, request.user.id]
      )

      const videos = videoRows as any[]
      if (videos.length === 0) {
        return reply.status(404).send({ error: 'Vídeo não encontrado' })
      }

      // Verifica se o vídeo já está nos favoritos
      const [favoriteRows] = await pool.execute(
        'SELECT 1 FROM favorites WHERE user_id = ? AND video_id = ?',
        [request.user.id, videoId]
      )

      const favorites = favoriteRows as any[]
      if (favorites.length > 0) {
        return reply.status(400).send({ error: 'Vídeo já está nos favoritos' })
      }

      // Adiciona aos favoritos
      await pool.execute(
        'INSERT INTO favorites (user_id, video_id) VALUES (?, ?)',
        [request.user.id, videoId]
      )

      return reply.status(201).send({ message: 'Vídeo adicionado aos favoritos' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao adicionar aos favoritos' })
    }
  }

  async remove(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    })

    try {
      const { videoId } = paramsSchema.parse(request.params)

      const [result] = await pool.execute(
        'DELETE FROM favorites WHERE user_id = ? AND video_id = ?',
        [request.user.id, videoId]
      )

      const deleteResult = result as { affectedRows: number }

      if (deleteResult.affectedRows === 0) {
        return reply.status(404).send({ error: 'Vídeo não encontrado nos favoritos' })
      }

      return reply.send({ message: 'Vídeo removido dos favoritos' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao remover dos favoritos' })
    }
  }
} 