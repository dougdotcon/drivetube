import api from './api'
import { Video, VideoCreateData, VideoUpdateData } from '../types/video'

export async function listVideos(): Promise<Video[]> {
  const response = await api.get<Video[]>('/videos')
  return response.data
}

export async function getVideo(id: string): Promise<Video> {
  const response = await api.get<Video>(`/videos/${id}`)
  return response.data
}

export async function getVideoEmbedUrl(id: string): Promise<string> {
  const response = await api.get<{ embedUrl: string }>(`/videos/${id}/embed`)
  return response.data.embedUrl
}

export async function createVideo(data: VideoCreateData): Promise<{ id: string }> {
  const response = await api.post<{ id: string }>('/videos', data)
  return response.data
}

export async function updateVideo(id: string, data: VideoUpdateData): Promise<void> {
  await api.put(`/videos/${id}`, data)
}

export async function deleteVideo(id: string): Promise<void> {
  await api.delete(`/videos/${id}`)
} 