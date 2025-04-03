import api from './api'
import { 
  Playlist, 
  PlaylistWithVideos, 
  PlaylistCreateData, 
  PlaylistUpdateData,
  PlaylistVideoReorderData 
} from '../types/playlist'

export async function listPlaylists(): Promise<Playlist[]> {
  const response = await api.get<Playlist[]>('/playlists')
  return response.data
}

export async function getPlaylist(id: string): Promise<PlaylistWithVideos> {
  const response = await api.get<PlaylistWithVideos>(`/playlists/${id}`)
  return response.data
}

export async function createPlaylist(data: PlaylistCreateData): Promise<{ id: string }> {
  const response = await api.post<{ id: string }>('/playlists', data)
  return response.data
}

export async function updatePlaylist(id: string, data: PlaylistUpdateData): Promise<void> {
  await api.put(`/playlists/${id}`, data)
}

export async function deletePlaylist(id: string): Promise<void> {
  await api.delete(`/playlists/${id}`)
}

export async function addVideoToPlaylist(playlistId: string, videoId: string): Promise<void> {
  await api.post(`/playlists/${playlistId}/videos`, { videoId })
}

export async function removeVideoFromPlaylist(playlistId: string, videoId: string): Promise<void> {
  await api.delete(`/playlists/${playlistId}/videos/${videoId}`)
}

export async function reorderPlaylistVideos(playlistId: string, data: PlaylistVideoReorderData): Promise<void> {
  await api.put(`/playlists/${playlistId}/videos/reorder`, data)
} 