'use client'

import { useState } from 'react'
import { Video } from '../types/video'
import { usePlaylists } from '../hooks/usePlaylists'
import VideoSelect from './VideoSelect'
import Button from './Button'

interface AddVideoToPlaylistFormProps {
  playlistId: string
  videos: Video[]
  onSuccess: () => void
  onCancel: () => void
}

export default function AddVideoToPlaylistForm({
  playlistId,
  videos,
  onSuccess,
  onCancel
}: AddVideoToPlaylistFormProps) {
  const { addVideoToPlaylist, isLoading, error: playlistError } = usePlaylists()
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedVideo) {
      setError('Selecione um vídeo')
      return
    }

    try {
      await addVideoToPlaylist(playlistId, selectedVideo.id)
      onSuccess()
    } catch (error) {
      // O erro já é tratado pelo hook usePlaylists
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <VideoSelect
        value={selectedVideo}
        onChange={setSelectedVideo}
        videos={videos}
      />

      {(error || playlistError) && (
        <p className="text-sm text-red-500">
          {error || playlistError}
        </p>
      )}

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
          Adicionar
        </Button>
      </div>
    </form>
  )
} 