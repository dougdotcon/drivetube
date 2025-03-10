'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface VideoPlayerProps {
  videoId: string | null
  onOpenModal?: () => void
}

export default function VideoPlayer({ videoId, onOpenModal }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (videoId) {
      setIsLoading(true)
      setError(null)
      
      // Criar URL do vídeo no Google Drive
      const url = `https://drive.google.com/file/d/${videoId}/preview`
      setVideoUrl(url)
    } else {
      setVideoUrl(null)
    }
  }, [videoId])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setError('Não foi possível carregar o vídeo. Verifique sua conexão ou tente novamente mais tarde.')
    setIsLoading(false)
  }

  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/images/mulakintola-logo.png"
              alt="Mulakintola Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum vídeo selecionado</h3>
          <p className="text-gray-600">Selecione um vídeo da lista para começar a assistir</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white p-4 shadow-sm mb-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Reproduzindo vídeo</h2>
        <p className="text-gray-600 text-sm">ID: {videoId}</p>
        <div className="flex mt-2 space-x-2">
          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="px-3 py-1 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors shadow-sm text-sm"
            >
              Ver em tela cheia
            </button>
          )}
          <a 
            href={`https://drive.google.com/file/d/${videoId}/view`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm"
          >
            Abrir no Google Drive
          </a>
        </div>
      </div>
      
      <div className="relative w-full flex-1 bg-black rounded-lg overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
              <p className="text-white mt-4">Carregando vídeo...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
            <div className="bg-white p-6 rounded-lg max-w-md text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Erro ao carregar vídeo</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => {
                  setIsLoading(true)
                  setError(null)
                }}
                className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors shadow-md"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}
        
        {videoUrl && (
          <iframe
            src={videoUrl}
            width="100%"
            height="100%"
            allow="autoplay"
            className="w-full h-full"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allowFullScreen
          />
        )}
      </div>
    </div>
  )
} 