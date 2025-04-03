import { create } from 'zustand'
import { Video, VideoCreateData, VideoUpdateData } from '../types/video'
import * as videosService from '../services/videos'

interface VideosState {
  videos: Video[]
  currentVideo: Video | null
  isLoading: boolean
  error: string | null
  loadVideos: () => Promise<void>
  getVideo: (id: string) => Promise<void>
  createVideo: (data: VideoCreateData) => Promise<void>
  updateVideo: (id: string, data: VideoUpdateData) => Promise<void>
  deleteVideo: (id: string) => Promise<void>
  clearError: () => void
}

export const useVideos = create<VideosState>((set, get) => ({
  videos: [],
  currentVideo: null,
  isLoading: false,
  error: null,

  loadVideos: async () => {
    try {
      set({ isLoading: true, error: null })
      const videos = await videosService.listVideos()
      set({ videos })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao carregar vídeos' })
    } finally {
      set({ isLoading: false })
    }
  },

  getVideo: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const video = await videosService.getVideo(id)
      set({ currentVideo: video })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao carregar vídeo' })
    } finally {
      set({ isLoading: false })
    }
  },

  createVideo: async (data: VideoCreateData) => {
    try {
      set({ isLoading: true, error: null })
      await videosService.createVideo(data)
      await get().loadVideos()
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao criar vídeo' })
    } finally {
      set({ isLoading: false })
    }
  },

  updateVideo: async (id: string, data: VideoUpdateData) => {
    try {
      set({ isLoading: true, error: null })
      await videosService.updateVideo(id, data)
      await get().loadVideos()
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao atualizar vídeo' })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteVideo: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      await videosService.deleteVideo(id)
      set((state) => ({
        videos: state.videos.filter((video) => video.id !== id),
        currentVideo: state.currentVideo?.id === id ? null : state.currentVideo
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao excluir vídeo' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null })
})) 