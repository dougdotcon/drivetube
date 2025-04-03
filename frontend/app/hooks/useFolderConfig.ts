'use client'

import { useState, useEffect } from 'react'

const FOLDER_CONFIG_KEY = 'folder_config'

export interface FolderConfig {
  id: string
  name: string
}

export function useFolderConfig() {
  const [folder, setFolderState] = useState<FolderConfig | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FOLDER_CONFIG_KEY)
      if (saved) {
        setFolderState(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erro ao carregar configuração da pasta:', error)
    }
  }, [])

  const saveFolder = (newFolder: FolderConfig) => {
    try {
      localStorage.setItem(FOLDER_CONFIG_KEY, JSON.stringify(newFolder))
      setFolderState(newFolder)
    } catch (error) {
      console.error('Erro ao salvar configuração da pasta:', error)
    }
  }

  const clearFolder = () => {
    try {
      localStorage.removeItem(FOLDER_CONFIG_KEY)
      setFolderState(null)
    } catch (error) {
      console.error('Erro ao limpar configuração da pasta:', error)
    }
  }

  return {
    folder,
    saveFolder,
    clearFolder,
    setFolder: saveFolder // Alias para saveFolder para manter compatibilidade
  }
} 