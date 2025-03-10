'use client'

import { useState } from 'react'
import { Video, VideoUpdateData } from '../types/video'
import Input from './Input'
import FolderSelect from './FolderSelect'
import Button from './Button'

interface VideoFormProps {
  video: Video
  onSubmit: (data: VideoUpdateData) => Promise<void>
  onCancel: () => void
  folders: string[]
  isLoading?: boolean
}

export default function VideoForm({
  video,
  onSubmit,
  onCancel,
  folders,
  isLoading = false
}: VideoFormProps) {
  const [name, setName] = useState(video.name)
  const [folder, setFolder] = useState<string | null>(video.folder)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('O nome do vídeo é obrigatório')
      return
    }

    try {
      await onSubmit({ name: name.trim(), folder })
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao atualizar vídeo')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        disabled={isLoading}
        required
      />

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Pasta
        </label>
        <FolderSelect
          value={folder}
          onChange={setFolder}
          folders={folders}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Salvar
        </Button>
      </div>
    </form>
  )
} 