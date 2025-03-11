'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Settings, FolderOpen, Video } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface FolderItem {
  id: string
  name: string
  type: 'folder' | 'video'
}

export default function ExtensionUI() {
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null)
  const [folderHistory, setFolderHistory] = useState<FolderItem[]>([])
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [items, setItems] = useState<FolderItem[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const auth = await chrome.storage.local.get('accessToken')
      if (auth.accessToken) {
        setAccessToken(auth.accessToken)
        loadRootFolder()
      }
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err)
    }
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      const token = await chrome.identity.getAuthToken({
        interactive: true,
        scopes: [
          "https://www.googleapis.com/auth/drive.readonly",
          "https://www.googleapis.com/auth/drive.metadata.readonly"
        ]
      })
      setAccessToken(token.token)
      await chrome.storage.local.set({ accessToken: token.token })
      loadRootFolder()
    } catch (err) {
      console.error('Erro no login:', err)
      toast({
        title: 'Erro',
        description: 'Falha ao fazer login',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadRootFolder = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3333/api/folders/root', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (!response.ok) throw new Error('Erro ao carregar pasta raiz')
      
      const data = await response.json()
      setCurrentFolder(data)
      setFolderHistory([])
      loadFolder(data)
    } catch (err) {
      console.error('Erro ao carregar pasta raiz:', err)
      setAccessToken(null)
      toast({
        title: 'Erro',
        description: 'Falha ao carregar pasta raiz',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadFolder = async (folder: FolderItem) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3333/api/folders/${folder.id}/contents`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (!response.ok) throw new Error('Erro ao carregar conteúdo da pasta')
      
      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error('Erro ao carregar pasta:', err)
      toast({
        title: 'Erro',
        description: 'Falha ao carregar pasta',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (folderHistory.length > 0) {
      const previousFolder = folderHistory[folderHistory.length - 1]
      setCurrentFolder(previousFolder)
      setFolderHistory(prev => prev.slice(0, -1))
      loadFolder(previousFolder)
    }
  }

  const navigateToFolder = (folder: FolderItem) => {
    setFolderHistory(prev => [...prev, currentFolder!])
    setCurrentFolder(folder)
    loadFolder(folder)
  }

  const openVideo = (video: FolderItem) => {
    chrome.tabs.create({ url: `http://localhost:3000/watch/${video.id}` })
  }

  const openSettings = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('pages/settings.html')
    })
  }

  if (!accessToken) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Carregando...' : 'Entrar com Google'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {folderHistory.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              disabled={loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle>{currentFolder?.name || 'Raiz'}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={openSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum item encontrado
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                onClick={() => item.type === 'folder' ? navigateToFolder(item) : openVideo(item)}
              >
                {item.type === 'folder' ? (
                  <FolderOpen className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Video className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 