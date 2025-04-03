'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FolderConfig } from '../components/FolderConfig'
import Image from 'next/image'

export default function ConfigPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

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
          <p className="text-gray-600 mt-4 text-center">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-8">
            <Image
              src="/images/mulakintola-logo.png"
              alt="Mulakintola Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Configurações
            </h1>
            <p className="text-gray-600">
              Configure sua pasta de vídeos do Google Drive
            </p>
          </div>

          <FolderConfig />
        </div>
      </div>
    </div>
  )
} 