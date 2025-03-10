import { Video } from './video'

export interface Playlist {
  id: string
  userId: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface PlaylistVideo extends Video {
  position: number
}

export interface PlaylistWithVideos extends Playlist {
  videos: PlaylistVideo[]
}

export interface PlaylistCreateData {
  name: string
  description?: string
}

export interface PlaylistUpdateData {
  name?: string
  description?: string
}

export interface PlaylistVideoReorderData {
  videos: {
    id: string
    position: number
  }[]
} 