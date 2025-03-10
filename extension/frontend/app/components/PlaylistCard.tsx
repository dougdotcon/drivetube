'use client'

import { PlayCircleIcon } from '@heroicons/react/24/outline'
import { Playlist } from '../types/playlist'
import { cn } from '../utils/cn'

interface PlaylistCardProps {
  playlist: Playlist
  onClick: () => void
  className?: string
}

export default function PlaylistCard({ playlist, onClick, className }: PlaylistCardProps) {
  return (
    <div
      className={cn(
        'group cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <PlayCircleIcon className="h-6 w-6" />
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="font-medium text-gray-900 line-clamp-1">{playlist.name}</h3>
          {playlist.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{playlist.description}</p>
          )}
        </div>
      </div>
    </div>
  )
} 