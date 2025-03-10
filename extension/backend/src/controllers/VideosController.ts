import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { pool } from '../database/connection'
import { DriveVideo } from '../types/drive'

export class VideosController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM videos WHERE user_id = ? ORDER BY folder, name',
        [request.user.id]
      )

      const videos = rows as DriveVideo[]

      return reply.send(videos)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao listar vídeos' })
    }
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)

      const [rows] = await pool.execute(
        'SELECT * FROM videos WHERE id = ? AND user_id = ?',
        [id, request.user.id]
      )

      const videos = rows as DriveVideo[]
      const video = videos[0]

      if (!video) {
        return reply.status(404).send({ error: 'Vídeo não encontrado' })
      }

      return reply.send(video)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao buscar vídeo' })
    }
  }

  async getEmbedUrl(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)

      const [rows] = await pool.execute(
        'SELECT drive_id FROM videos WHERE id = ? AND user_id = ?',
        [id, request.user.id]
      )

      const videos = rows as { drive_id: string }[]
      const video = videos[0]

      if (!video) {
        return reply.status(404).send({ error: 'Vídeo não encontrado' })
      }

      const embedUrl = `https://drive.google.com/file/d/${video.drive_id}/preview`

      return reply.send({ embedUrl })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao gerar URL do vídeo' })
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      driveId: z.string(),
      folder: z.string().nullable(),
      mimeType: z.string(),
      thumbnailLink: z.string().optional(),
      webViewLink: z.string().optional(),
      webContentLink: z.string().optional(),
      size: z.string(),
    })

    try {
      const videoData = bodySchema.parse(request.body)

      const videoId = randomUUID()

      await pool.execute(
        `INSERT INTO videos (
          id, user_id, name, drive_id, folder, mime_type, 
          thumbnail_link, web_view_link, web_content_link, size
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          videoId,
          request.user.id,
          videoData.name,
          videoData.driveId,
          videoData.folder,
          videoData.mimeType,
          videoData.thumbnailLink,
          videoData.webViewLink,
          videoData.webContentLink,
          videoData.size,
        ]
      )

      return reply.status(201).send({ id: videoId })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao criar vídeo' })
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      name: z.string().optional(),
      folder: z.string().nullable().optional(),
      thumbnailLink: z.string().optional(),
      webViewLink: z.string().optional(),
      webContentLink: z.string().optional(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)
      const videoData = bodySchema.parse(request.body)

      const [result] = await pool.execute(
        `UPDATE videos SET
          name = COALESCE(?, name),
          folder = COALESCE(?, folder),
          thumbnail_link = COALESCE(?, thumbnail_link),
          web_view_link = COALESCE(?, web_view_link),
          web_content_link = COALESCE(?, web_content_link),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?`,
        [
          videoData.name,
          videoData.folder,
          videoData.thumbnailLink,
          videoData.webViewLink,
          videoData.webContentLink,
          id,
          request.user.id,
        ]
      )

      const updateResult = result as { affectedRows: number }

      if (updateResult.affectedRows === 0) {
        return reply.status(404).send({ error: 'Vídeo não encontrado' })
      }

      return reply.send({ message: 'Vídeo atualizado com sucesso' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao atualizar vídeo' })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)

      const [result] = await pool.execute(
        'DELETE FROM videos WHERE id = ? AND user_id = ?',
        [id, request.user.id]
      )

      const deleteResult = result as { affectedRows: number }

      if (deleteResult.affectedRows === 0) {
        return reply.status(404).send({ error: 'Vídeo não encontrado' })
      }

      return reply.send({ message: 'Vídeo excluído com sucesso' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao excluir vídeo' })
    }
  }
} 