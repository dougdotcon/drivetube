import { useState, useEffect, useRef } from 'react'
import { DriveFolder } from '../types/drive'

const CACHE_KEY = 'video_structure_cache'
const CACHE_EXPIRATION = 1000 * 60 * 30 // 30 minutos
const EXPANDED_FOLDERS_KEY = 'expanded_folders'

interface CacheData {
  folderStructure: DriveFolder
  timestamp: number
  folderId: string
}

export function useVideoCache(folderId: string | undefined) {
  const [cache, setCache] = useState<DriveFolder | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const previousFolderId = useRef<string | undefined>(folderId)

  // Carrega o cache inicial e estado das pastas expandidas
  useEffect(() => {
    if (folderId === previousFolderId.current) return

    try {
      // Carrega as pastas expandidas
      const savedExpandedFolders = localStorage.getItem(EXPANDED_FOLDERS_KEY)
      if (savedExpandedFolders) {
        setExpandedFolders(new Set(JSON.parse(savedExpandedFolders)))
      }

      // Carrega o cache de vídeos
      const savedCache = localStorage.getItem(CACHE_KEY)
      if (savedCache && folderId) {
        const cacheData: CacheData = JSON.parse(savedCache)
        const isExpired = Date.now() - cacheData.timestamp > CACHE_EXPIRATION
        const isSameFolder = cacheData.folderId === folderId

        if (!isExpired && isSameFolder) {
          console.log('Usando dados do cache')
          setCache(cacheData.folderStructure)
        } else {
          console.log('Cache expirado ou pasta diferente')
          localStorage.removeItem(CACHE_KEY)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cache:', error)
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(EXPANDED_FOLDERS_KEY)
    }

    previousFolderId.current = folderId
  }, [folderId])

  // Salva o cache
  const updateCache = (newFolderStructure: DriveFolder) => {
    try {
      if (!folderId) return

      const cacheData: CacheData = {
        folderStructure: newFolderStructure,
        timestamp: Date.now(),
        folderId
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
      setCache(newFolderStructure)
    } catch (error) {
      console.error('Erro ao salvar cache:', error)
    }
  }

  // Gerencia o estado de expansão das pastas
  const toggleFolderExpanded = (folderId: string) => {
    const newExpandedFolders = new Set(expandedFolders)
    if (newExpandedFolders.has(folderId)) {
      newExpandedFolders.delete(folderId)
    } else {
      newExpandedFolders.add(folderId)
    }
    setExpandedFolders(newExpandedFolders)
    try {
      localStorage.setItem(EXPANDED_FOLDERS_KEY, JSON.stringify([...newExpandedFolders]))
    } catch (error) {
      console.error('Erro ao salvar estado das pastas:', error)
    }
  }

  const isFolderExpanded = (folderId: string) => expandedFolders.has(folderId)

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(EXPANDED_FOLDERS_KEY)
    setCache(null)
    setExpandedFolders(new Set())
  }

  return {
    cache,
    updateCache,
    clearCache,
    isFolderExpanded,
    toggleFolderExpanded
  }
} 