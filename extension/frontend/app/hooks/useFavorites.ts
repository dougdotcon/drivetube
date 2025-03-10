import { create } from 'zustand'
import { Video } from '../types/video'
import * as favoritesService from '../services/favorites'

interface FavoritesState {
  favorites: Video[]
  isLoading: boolean
  error: string | null
  loadFavorites: () => Promise<void>
  addToFavorites: (videoId: string) => Promise<void>
  removeFromFavorites: (videoId: string) => Promise<void>
  clearError: () => void
}

export const useFavorites = create<FavoritesState>((set) => ({
  favorites: [],
  isLoading: false,
  error: null,

  loadFavorites: async () => {
    try {
      set({ isLoading: true, error: null })
      const favorites = await favoritesService.listFavorites()
      set({ favorites })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao carregar favoritos' })
    } finally {
      set({ isLoading: false })
    }
  },

  addToFavorites: async (videoId: string) => {
    try {
      set({ isLoading: true, error: null })
      await favoritesService.addToFavorites(videoId)
      const favorites = await favoritesService.listFavorites()
      set({ favorites })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao adicionar aos favoritos' })
    } finally {
      set({ isLoading: false })
    }
  },

  removeFromFavorites: async (videoId: string) => {
    try {
      set({ isLoading: true, error: null })
      await favoritesService.removeFromFavorites(videoId)
      set((state) => ({
        favorites: state.favorites.filter((video) => video.id !== videoId)
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao remover dos favoritos' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null })
})) 