import { create } from 'zustand'
import { 
  Playlist, 
  PlaylistWithVideos, 
  PlaylistCreateData, 
  PlaylistUpdateData,
  PlaylistVideoReorderData 
} from '../types/playlist'
import * as playlistsService from '../services/playlists'

interface PlaylistsState {
  playlists: Playlist[]
  currentPlaylist: PlaylistWithVideos | null
  isLoading: boolean
  error: string | null
  loadPlaylists: () => Promise<void>
  getPlaylist: (id: string) => Promise<void>
  createPlaylist: (data: PlaylistCreateData) => Promise<void>
  updatePlaylist: (id: string, data: PlaylistUpdateData) => Promise<void>
  deletePlaylist: (id: string) => Promise<void>
  addVideoToPlaylist: (playlistId: string, videoId: string) => Promise<void>
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => Promise<void>
  reorderPlaylistVideos: (playlistId: string, data: PlaylistVideoReorderData) => Promise<void>
  clearError: () => void
}

export const usePlaylists = create<PlaylistsState>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  loadPlaylists: async () => {
    try {
      set({ isLoading: true, error: null })
      const playlists = await playlistsService.listPlaylists()
      set({ playlists })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao carregar playlists' })
    } finally {
      set({ isLoading: false })
    }
  },

  getPlaylist: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const playlist = await playlistsService.getPlaylist(id)
      set({ currentPlaylist: playlist })
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao carregar playlist' })
    } finally {
      set({ isLoading: false })
    }
  },

  createPlaylist: async (data: PlaylistCreateData) => {
    try {
      set({ isLoading: true, error: null })
      await playlistsService.createPlaylist(data)
      await get().loadPlaylists()
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao criar playlist' })
    } finally {
      set({ isLoading: false })
    }
  },

  updatePlaylist: async (id: string, data: PlaylistUpdateData) => {
    try {
      set({ isLoading: true, error: null })
      await playlistsService.updatePlaylist(id, data)
      await get().loadPlaylists()
      if (get().currentPlaylist?.id === id) {
        await get().getPlaylist(id)
      }
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao atualizar playlist' })
    } finally {
      set({ isLoading: false })
    }
  },

  deletePlaylist: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      await playlistsService.deletePlaylist(id)
      set((state) => ({
        playlists: state.playlists.filter((playlist) => playlist.id !== id),
        currentPlaylist: state.currentPlaylist?.id === id ? null : state.currentPlaylist
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao excluir playlist' })
    } finally {
      set({ isLoading: false })
    }
  },

  addVideoToPlaylist: async (playlistId: string, videoId: string) => {
    try {
      set({ isLoading: true, error: null })
      await playlistsService.addVideoToPlaylist(playlistId, videoId)
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylist(playlistId)
      }
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao adicionar vídeo à playlist' })
    } finally {
      set({ isLoading: false })
    }
  },

  removeVideoFromPlaylist: async (playlistId: string, videoId: string) => {
    try {
      set({ isLoading: true, error: null })
      await playlistsService.removeVideoFromPlaylist(playlistId, videoId)
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylist(playlistId)
      }
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao remover vídeo da playlist' })
    } finally {
      set({ isLoading: false })
    }
  },

  reorderPlaylistVideos: async (playlistId: string, data: PlaylistVideoReorderData) => {
    try {
      set({ isLoading: true, error: null })
      await playlistsService.reorderPlaylistVideos(playlistId, data)
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylist(playlistId)
      }
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Erro ao reordenar vídeos' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null })
})) 