import { z } from 'zod'

export const createVideoSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  driveId: z.string().min(1, 'O ID do Drive é obrigatório'),
  folder: z.string().nullable(),
  mimeType: z.string().min(1, 'O tipo MIME é obrigatório'),
  thumbnailLink: z.string().url().optional(),
  webViewLink: z.string().url().optional(),
  webContentLink: z.string().url().optional(),
  size: z.string().min(1, 'O tamanho é obrigatório')
})

export const updateVideoSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
  folder: z.string().nullable().optional(),
  thumbnailLink: z.string().url().optional(),
  webViewLink: z.string().url().optional(),
  webContentLink: z.string().url().optional()
})

export type CreateVideoData = z.infer<typeof createVideoSchema>
export type UpdateVideoData = z.infer<typeof updateVideoSchema> 