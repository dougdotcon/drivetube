'use client'

import { useState } from 'react'
import { Playlist, PlaylistCreateData, PlaylistUpdateData } from '../types/playlist'
import Input from './Input'
import Button from './Button'

interface PlaylistFormProps {
  playlist?: Playlist
  onSubmit: (data: PlaylistCreateData | PlaylistUpdateData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function PlaylistForm({
  playlist,
  onSubmit,
  onCancel,
  isLoading = false
}: PlaylistFormProps) {
  const [name, setName] = useState(playlist?.name ?? '')
  const [description, setDescription] = useState(playlist?.description ?? '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('O nome da playlist é obrigatório')
      return
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined
      })
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao salvar playlist')
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

      <Input
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />

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
          {playlist ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
} 