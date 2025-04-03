'use client'

import { Video } from '../types/video'
import VideoCard from './VideoCard'
import { cn } from '../utils/cn'

interface VideoGridProps {
  videos: Video[]
  onVideoSelect: (videoId: string) => void
  className?: string
}

export default function VideoGrid({ videos, onVideoSelect, className }: VideoGridProps) {
  if (videos.length === 0) {
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
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum vídeo encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Não há vídeos disponíveis no momento.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onClick={() => onVideoSelect(video.id)}
        />
      ))}
    </div>
  )
} 