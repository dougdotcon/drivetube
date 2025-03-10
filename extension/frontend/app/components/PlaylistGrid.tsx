'use client'

import { Playlist } from '../types/playlist'
import PlaylistCard from './PlaylistCard'
import { cn } from '../utils/cn'

interface PlaylistGridProps {
  playlists: Playlist[]
  onPlaylistSelect: (playlistId: string) => void
  className?: string
}

export default function PlaylistGrid({ playlists, onPlaylistSelect, className }: PlaylistGridProps) {
  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma playlist encontrada</h3>
        <p className="mt-1 text-sm text-gray-500">
          Crie uma nova playlist para começar.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onClick={() => onPlaylistSelect(playlist.id)}
        />
      ))}
    </div>
  )
} 