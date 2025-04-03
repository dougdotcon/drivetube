import api from './api'
import { Video } from '../types/video'

export async function listFavorites(): Promise<Video[]> {
  const response = await api.get<Video[]>('/favorites')
  return response.data
}

export async function addToFavorites(videoId: string): Promise<void> {
  await api.post(`/favorites/${videoId}`)
}

export async function removeFromFavorites(videoId: string): Promise<void> {
  await api.delete(`/favorites/${videoId}`)
} 