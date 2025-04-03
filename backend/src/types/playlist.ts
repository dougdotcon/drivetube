import { DriveVideo } from './drive'
import { z } from 'zod'

export interface Playlist {
  id: string
  userId: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface PlaylistVideo extends DriveVideo {
  position: number
}

export interface PlaylistWithVideos extends Playlist {
  videos: PlaylistVideo[]
}

export const createPlaylistSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional()
})

export const updatePlaylistSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
  description: z.string().optional()
})

export const addVideoToPlaylistSchema = z.object({
  videoId: z.string().min(1, 'O ID do vídeo é obrigatório')
})

export const reorderPlaylistVideosSchema = z.object({
  videos: z.array(
    z.object({
      id: z.string().min(1, 'O ID do vídeo é obrigatório'),
      position: z.number().min(1, 'A posição deve ser maior que 0')
    })
  )
})

export type CreatePlaylistData = z.infer<typeof createPlaylistSchema>
export type UpdatePlaylistData = z.infer<typeof updatePlaylistSchema>
export type AddVideoToPlaylistData = z.infer<typeof addVideoToPlaylistSchema>
export type ReorderPlaylistVideosData = z.infer<typeof reorderPlaylistVideosSchema> 