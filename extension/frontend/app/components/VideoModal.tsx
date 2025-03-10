'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'

interface VideoModalProps {
  videoId: string
  onClose: () => void
  isOpen: boolean
}

export default function VideoModal({ videoId, onClose, isOpen }: VideoModalProps) {
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <Dialog.Title className="text-lg font-semibold text-gray-800">
                    Visualizando vídeo
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
                    onClick={onClose}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="relative aspect-video bg-black">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
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
                
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-600">
                        ID: {videoId}
                      </div>
                      <a 
                        href={`https://drive.google.com/file/d/${videoId}/view`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm"
                      >
                        Abrir no Google Drive
                      </a>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors shadow-sm text-sm font-medium"
                      onClick={onClose}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 