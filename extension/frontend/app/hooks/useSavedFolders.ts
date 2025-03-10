import { useState, useEffect, useCallback } from 'react'
import { DriveFolder } from '../types/drive'

const SAVED_FOLDERS_KEY = 'saved_folders'

interface SavedFolder {
  id: string
  name: string
  thumbnailUrl?: string
  lastAccessed: number
  videoCount: number
  structure: DriveFolder
}

export function useSavedFolders() {
  const [savedFolders, setSavedFolders] = useState<SavedFolder[]>([])

  // Carrega as pastas salvas
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_FOLDERS_KEY)
      if (saved) {
        setSavedFolders(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erro ao carregar pastas salvas:', error)
    }
  }, [])

  // Encontra a primeira thumbnail de vídeo na estrutura de pastas
  const findFirstThumbnail = useCallback((folder: DriveFolder): string | undefined => {
    // Procura primeiro nos arquivos da pasta atual
    const firstVideoWithThumbnail = folder.files.find(file => file.thumbnailLink)
    if (firstVideoWithThumbnail?.thumbnailLink) {
      return firstVideoWithThumbnail.thumbnailLink
    }

    // Se não encontrou, procura nas subpastas
    for (const subfolder of folder.subfolders) {
      const thumbnail = findFirstThumbnail(subfolder)
      if (thumbnail) {
        return thumbnail
      }
    }

    return undefined
  }, [])

  // Conta o número total de vídeos na estrutura de pastas
  const countVideos = useCallback((folder: DriveFolder): number => {
    let count = folder.files.length
    for (const subfolder of folder.subfolders) {
      count += countVideos(subfolder)
    }
    return count
  }, [])

  // Adiciona ou atualiza uma pasta
  const saveFolder = useCallback((folder: DriveFolder) => {
    try {
      const thumbnail = findFirstThumbnail(folder)
      const videoCount = countVideos(folder)

      const newFolder: SavedFolder = {
        id: folder.id,
        name: folder.name,
        thumbnailUrl: thumbnail,
        lastAccessed: Date.now(),
        videoCount,
        structure: folder
      }

      setSavedFolders(prev => {
        const existing = prev.findIndex(f => f.id === folder.id)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = newFolder
          localStorage.setItem(SAVED_FOLDERS_KEY, JSON.stringify(updated))
          return updated
        } else {
          const updated = [...prev, newFolder]
          localStorage.setItem(SAVED_FOLDERS_KEY, JSON.stringify(updated))
          return updated
        }
      })
    } catch (error) {
      console.error('Erro ao salvar pasta:', error)
    }
  }, [findFirstThumbnail, countVideos])

  // Remove uma pasta
  const removeFolder = useCallback((folderId: string) => {
    setSavedFolders(prev => {
      const updated = prev.filter(f => f.id !== folderId)
      localStorage.setItem(SAVED_FOLDERS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Atualiza o timestamp de último acesso
  const updateLastAccessed = useCallback((folderId: string) => {
    setSavedFolders(prev => {
      const updated = prev.map(f => 
        f.id === folderId 
          ? { ...f, lastAccessed: Date.now() }
          : f
      )
      localStorage.setItem(SAVED_FOLDERS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Retorna as pastas ordenadas por último acesso
  const getRecentFolders = useCallback(() => {
    return [...savedFolders].sort((a, b) => b.lastAccessed - a.lastAccessed)
  }, [savedFolders])

  return {
    savedFolders,
    saveFolder,
    removeFolder,
    updateLastAccessed,
    getRecentFolders
  }
} 