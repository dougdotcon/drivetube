'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from '../components/Sidebar'
import VideoPlayer from '../components/VideoPlayer'
import VideoModal from '../components/VideoModal'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useFolderConfig } from '../hooks/useFolderConfig'
import { useVideoCache } from '../hooks/useVideoCache'
import Link from 'next/link'
import { useSavedFolders } from '../hooks/useSavedFolders'
import { API_ROUTES, API_URL } from '../config/api'

export default function VideosPage() {
  const { data: session, status } = useSession()
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalVideoId, setModalVideoId] = useState<string | null>(null)
  const router = useRouter()
  const { folder } = useFolderConfig()
  const { 
    cache: folderStructure, 
    updateCache, 
    clearCache,
    isFolderExpanded,
    toggleFolderExpanded
  } = useVideoCache(folder?.id)
  const { saveFolder, updateLastAccessed } = useSavedFolders()
  const previousFolderId = useRef<string | undefined>(folder?.id)

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const fetchVideos = useCallback(async (ignoreCache = false) => {
    if (!folder?.id) {
      setError('Nenhuma pasta configurada')
      setIsLoading(false)
      return
    }

    if (folderStructure && !ignoreCache) {
      setIsLoading(false)
      updateLastAccessed(folder.id)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Iniciando busca de vídeos na pasta:', folder.id)
      
      // Verificar se o usuário está autenticado
      if (!session?.accessToken) {
        setError('Você precisa estar autenticado para acessar os vídeos')
        router.push('/login')
        return
      }
      
      const response = await fetch(`${API_URL}${API_ROUTES.VIDEOS}?folderId=${folder.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro na resposta:', response.status, errorData)
        
        if (response.status === 401) {
          setError('Sua sessão expirou. Por favor, faça login novamente.')
          router.push('/login')
          return
        }
        
        if (response.status === 403) {
          setError('Você não tem permissão para acessar esta pasta. Por favor, verifique as permissões no Google Drive.')
          setIsLoading(false)
          return
        }
        
        throw new Error(errorData.error || 'Erro ao carregar vídeos')
      }
      
      const data = await response.json()
      console.log('Estrutura de pastas recebida:', data)
      
      if (!data || typeof data !== 'object') {
        throw new Error('Formato de dados inválido')
      }
      
      updateCache(data)
      saveFolder(data)
      setError(null)
    } catch (err: any) {
      console.error('Erro ao carregar vídeos:', err)
      setError(err.message || 'Erro ao carregar vídeos. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [folder?.id, folderStructure, updateCache, saveFolder, updateLastAccessed, router, session])

  useEffect(() => {
    let mounted = true

    const loadVideos = async () => {
      if (folder?.id && mounted && folder.id !== previousFolderId.current) {
        console.log('Iniciando carregamento de vídeos para a pasta:', folder.name)
        await fetchVideos()
        previousFolderId.current = folder.id
      }
    }

    loadVideos()

    return () => {
      mounted = false
    }
  }, [folder?.id, fetchVideos])

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleRefresh = () => {
    clearCache()
    fetchVideos(true)
  }

  // Estado de carregamento dos vídeos
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-gradient-to-br from-yellow-50 to-white">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="/images/drivetube-logo.png"
              alt="drivetube Logo"
              fill
              className="object-contain animate-pulse"
              priority
            />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400 mt-4"></div>
          <p className="text-gray-600 mt-4 text-center">Carregando seus vídeos...</p>
          <p className="text-sm text-gray-500 mt-2">Buscando na pasta: {folder?.name}</p>
        </div>
      </div>
    )
  }

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-gradient-to-br from-yellow-50 to-white">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src="/images/drivetube-logo.png"
            alt="drivetube Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhuma pasta configurada</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Para começar a ver seus vídeos, você precisa configurar uma pasta do Google Drive.
        </p>
        <Link
          href="/config"
          className="px-6 py-3 bg-yellow-400 text-gray-800 rounded-xl hover:bg-yellow-500 
                   transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
        >
          Configurar Pasta
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-gradient-to-br from-yellow-50 to-white">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src="/images/drivetube-logo.png"
            alt="drivetube Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar vídeos</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
        <div className="flex space-x-4">
          <button
            onClick={() => fetchVideos(true)}
            className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors shadow-md"
          >
            Tentar novamente
          </button>
          <Link
            href="/config"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors shadow-md"
          >
            Configurar Pasta
          </Link>
        </div>
      </div>
    )
  }

  if (!folderStructure) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-gradient-to-br from-yellow-50 to-white">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src="/images/drivetube-logo.png"
            alt="drivetube Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pasta vazia</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          A pasta selecionada não contém nenhum vídeo ou subpasta.
        </p>
        <Link
          href="/config"
          className="px-6 py-3 bg-yellow-400 text-gray-800 rounded-xl hover:bg-yellow-500 
                   transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
        >
          Configurar outra pasta
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-yellow-50 to-white">
      <Sidebar
        folderStructure={folderStructure}
        onVideoSelect={handleVideoSelect}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onRefresh={handleRefresh}
        isFolderExpanded={isFolderExpanded}
        toggleFolderExpanded={toggleFolderExpanded}
      />

      <div className="flex-1 overflow-hidden">
        {selectedVideoId ? (
          <VideoPlayer
            videoId={selectedVideoId}
            onOpenModal={() => {
              setModalVideoId(selectedVideoId)
              setModalOpen(true)
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione um vídeo para começar</p>
          </div>
        )}
      </div>

      {modalOpen && modalVideoId && (
        <VideoModal
          videoId={modalVideoId}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
} 