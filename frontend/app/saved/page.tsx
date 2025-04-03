'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSavedFolders } from '../hooks/useSavedFolders'
import { FolderIcon, TrashIcon, PlayIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useFolderConfig } from '../hooks/useFolderConfig'

const ThumbnailImage = ({ src, alt }: { src: string; alt: string }) => {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <FolderIcon className="w-16 h-16 text-gray-300" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setError(true)}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
    />
  )
}

export default function SavedFoldersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { savedFolders, removeFolder } = useSavedFolders()
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null)
  const { setFolder } = useFolderConfig()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const handleFolderSelect = (folderId: string, folderName: string) => {
    setFolder({ id: folderId, name: folderName })
    router.push('/videos')
  }

  const handleRemoveFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation()
    removeFolder(folderId)
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-white">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="/images/mulakintola-logo.png"
              alt="Mulakintola Logo"
              fill
              className="object-contain animate-pulse"
              priority
            />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400 mt-4"></div>
          <p className="text-gray-600 mt-4 text-center">Iniciando...</p>
        </div>
      </div>
    )
  }

  if (savedFolders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-white">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src="/images/mulakintola-logo.png"
            alt="Mulakintola Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhuma pasta salva</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Você ainda não tem nenhuma pasta salva. Configure uma pasta do Google Drive para começar.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pastas Salvas</h1>
          <Link
            href="/config"
            className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 
                     transition-all duration-300 shadow-md font-medium text-sm"
          >
            Adicionar Pasta
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedFolders.map((folder) => (
            <div
              key={folder.id}
              className="relative group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredFolder(folder.id)}
              onMouseLeave={() => setHoveredFolder(null)}
              onClick={() => handleFolderSelect(folder.id, folder.name)}
            >
              {/* Thumbnail */}
              <div className="aspect-video relative bg-gray-100">
                <ThumbnailImage
                  src={folder.thumbnailUrl || ''}
                  alt={folder.name}
                />

                {/* Overlay com informações */}
                <div
                  className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredFolder === folder.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="text-center text-white p-4">
                    <p className="font-semibold mb-2">{folder.videoCount} vídeos</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFolderSelect(folder.id, folder.name)
                        }}
                        className="p-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors"
                        title="Assistir vídeos"
                      >
                        <PlayIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleRemoveFolder(e, folder.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Remover pasta"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações da pasta */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">{folder.name}</h3>
                <p className="text-sm text-gray-500">
                  Último acesso: {new Date(folder.lastAccessed).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 