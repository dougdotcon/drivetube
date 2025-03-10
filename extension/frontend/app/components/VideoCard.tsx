'use client'

import { useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Video } from '../types/video'
import { useFavorites } from '../hooks/useFavorites'
import { cn } from '../utils/cn'

interface VideoCardProps {
  video: Video
  onClick: () => void
  className?: string
}

export default function VideoCard({ video, onClick, className }: VideoCardProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites()
  const [isHovered, setIsHovered] = useState(false)

  const isFavorite = favorites.some((favorite) => favorite.id === video.id)

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (isFavorite) {
        await removeFromFavorites(video.id)
      } else {
        await addToFavorites(video.id)
      }
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error)
    }
  }

  return (
    <div
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video w-full overflow-hidden">
        {video.thumbnailLink ? (
          <img
            src={video.thumbnailLink}
            alt={video.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{video.name}</h3>
        {video.folder && (
          <p className="mt-1 text-sm text-gray-500">{video.folder}</p>
        )}
      </div>

      <button
        onClick={toggleFavorite}
        className={cn(
          'absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm transition-opacity',
          isHovered || isFavorite ? 'opacity-100' : 'opacity-0'
        )}
      >
        {isFavorite ? (
          <HeartIconSolid className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
        )}
      </button>
    </div>
  )
} 