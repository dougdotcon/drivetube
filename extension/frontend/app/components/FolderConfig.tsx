'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useFolderConfig } from '../hooks/useFolderConfig'

export function FolderConfig() {
  const [folderId, setFolderId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { folder, saveFolder } = useFolderConfig()

  const extractFolderId = (url: string) => {
    // Tenta extrair o ID da pasta de diferentes formatos de URL do Google Drive
    const patterns = [
      /\/folders\/([a-zA-Z0-9-_]+)/,  // formato: /folders/ID
      /id=([a-zA-Z0-9-_]+)/,          // formato: id=ID
      /^([a-zA-Z0-9-_]+)$/            // formato: apenas o ID
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const extractedId = extractFolderId(folderId)
      
      const response = await fetch('/api/config/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folderId: extractedId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao configurar pasta')
      }

      const data = await response.json()
      saveFolder(data.folder)
      toast.success('Pasta configurada com sucesso!')
      
      // Redireciona para a página de vídeos após configurar
      window.location.href = '/videos'
    } catch (error: any) {
      toast.error(error.message || 'Erro ao configurar pasta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Configurar Pasta de Vídeos
      </h2>
      
      {folder && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Pasta atual: <span className="font-medium text-gray-800">{folder.name}</span>
          </p>
        </div>
      )}

      <p className="text-gray-600 mb-6">
        Cole o link ou ID da pasta do Google Drive que contém seus vídeos
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="folderId" className="block text-sm font-medium text-gray-700 mb-1">
            Link ou ID da Pasta
          </label>
          <input
            type="text"
            id="folderId"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/seu-id-aqui"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !folderId}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isLoading || !folderId
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Configurando...
            </span>
          ) : (
            'Configurar Pasta'
          )}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-medium mb-2">Como obter o link da pasta:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Abra o Google Drive</li>
          <li>Localize a pasta que contém seus vídeos</li>
          <li>Clique com o botão direito na pasta</li>
          <li>Selecione &quot;Obter link&quot;</li>
          <li>Cole o link aqui</li>
        </ol>
      </div>
    </div>
  )
} 