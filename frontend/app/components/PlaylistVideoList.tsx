'use client'

import { useState } from 'react'
import { PlaylistVideo } from '../types/playlist'
import { usePlaylists } from '../hooks/usePlaylists'
import { cn } from '../utils/cn'

interface PlaylistVideoListProps {
  playlistId: string
  videos: PlaylistVideo[]
  currentVideoId: string | null
  onVideoSelect: (videoId: string) => void
  className?: string
}

export default function PlaylistVideoList({
  playlistId,
  videos,
  currentVideoId,
  onVideoSelect,
  className
}: PlaylistVideoListProps) {
  const { reorderPlaylistVideos } = usePlaylists()
  const [isDragging, setIsDragging] = useState(false)
  const [draggedVideo, setDraggedVideo] = useState<PlaylistVideo | null>(null)

  const handleDragStart = (video: PlaylistVideo) => {
    setIsDragging(true)
    setDraggedVideo(video)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (targetVideo: PlaylistVideo) => {
    if (!draggedVideo || draggedVideo.id === targetVideo.id) {
      setIsDragging(false)
      setDraggedVideo(null)
      return
    }

    const newVideos = [...videos]
    const draggedIndex = videos.findIndex((v) => v.id === draggedVideo.id)
    const targetIndex = videos.findIndex((v) => v.id === targetVideo.id)

    newVideos.splice(draggedIndex, 1)
    newVideos.splice(targetIndex, 0, draggedVideo)

    const reorderedVideos = newVideos.map((video, index) => ({
      id: video.id,
      position: index + 1
    }))

    try {
      await reorderPlaylistVideos(playlistId, { videos: reorderedVideos })
    } catch (error) {
      console.error('Erro ao reordenar vídeos:', error)
    }

    setIsDragging(false)
    setDraggedVideo(null)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {videos.map((video) => (
        <div
          key={video.id}
          draggable
          onDragStart={() => handleDragStart(video)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(video)}
          onClick={() => onVideoSelect(video.id)}
          className={cn(
            'flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors',
            currentVideoId === video.id
              ? 'bg-blue-50 text-blue-700'
              : 'hover:bg-gray-50',
            isDragging && draggedVideo?.id === video.id && 'opacity-50'
          )}
        >
          <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100">
            {video.thumbnailLink ? (
              <img
                src={video.thumbnailLink}
                alt={video.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                className="h-8 w-8 text-gray-400"
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
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <h4 className="font-medium text-gray-900 line-clamp-1">{video.name}</h4>
            {video.folder && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{video.folder}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 