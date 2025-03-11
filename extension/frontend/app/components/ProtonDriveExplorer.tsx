'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, FolderOpen, Search, Upload, FolderPlus, Share2, Trash2 } from 'lucide-react'
import {
  ProtonDriveItem,
  listProtonDriveItems,
  downloadProtonDriveFile,
  uploadToProtonDrive,
  createProtonDriveFolder,
  deleteProtonDriveItem,
  shareProtonDriveItem,
  getProtonDriveIcon
} from '@/services/protonDrive'
import { formatBytes } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function ProtonDriveExplorer() {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>()
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [parentFolder, setParentFolder] = useState<{ id: string; name: string } | null>(null)
  const [items, setItems] = useState<ProtonDriveItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const loadFolder = async (folderId?: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await listProtonDriveItems(folderId)
      setItems(response.items)
      setCurrentPath(response.currentFolder.path)
      setParentFolder(response.parentFolder)
      setCurrentFolderId(folderId)
    } catch (err) {
      setError('Erro ao carregar pasta')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFolder()
  }, [])

  const handleItemClick = async (item: ProtonDriveItem) => {
    if (item.type === 'folder') {
      loadFolder(item.id)
    } else {
      try {
        const blob = await downloadProtonDriveFile(item.id)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = item.name
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (err) {
        toast({
          title: 'Erro',
          description: 'Erro ao baixar arquivo',
          variant: 'destructive'
        })
        console.error(err)
      }
    }
  }

  const handleParentClick = () => {
    if (parentFolder) {
      loadFolder(parentFolder.id)
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    try {
      setLoading(true)
      for (const file of Array.from(files)) {
        await uploadToProtonDrive(file, currentFolderId)
      }
      toast({
        title: 'Sucesso',
        description: 'Arquivos enviados com sucesso'
      })
      loadFolder(currentFolderId)
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao enviar arquivos',
        variant: 'destructive'
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFolder = async () => {
    const name = window.prompt('Nome da pasta:')
    if (!name) return

    try {
      setLoading(true)
      await createProtonDriveFolder(name, currentFolderId)
      toast({
        title: 'Sucesso',
        description: 'Pasta criada com sucesso'
      })
      loadFolder(currentFolderId)
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar pasta',
        variant: 'destructive'
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (item: ProtonDriveItem) => {
    if (!window.confirm(`Deseja excluir "${item.name}"?`)) return

    try {
      setLoading(true)
      await deleteProtonDriveItem(item.id)
      toast({
        title: 'Sucesso',
        description: 'Item excluído com sucesso'
      })
      loadFolder(currentFolderId)
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir item',
        variant: 'destructive'
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (item: ProtonDriveItem) => {
    try {
      setLoading(true)
      const { shareUrl } = await shareProtonDriveItem(item.id, {
        expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 dias
      })
      
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link copiado',
        description: 'Link de compartilhamento copiado para a área de transferência'
      })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao compartilhar item',
        variant: 'destructive'
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Proton Drive</CardTitle>
          <div className="flex items-center gap-2">
            {parentFolder && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleParentClick}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateFolder}
              className="flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              Nova Pasta
            </Button>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => loadFolder(currentFolderId)}
            className="flex items-center gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentPath.join(' / ') || 'Raiz'}
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum arquivo encontrado
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div
                  className="flex-1 flex items-center gap-3 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <span className="text-2xl">
                    {getProtonDriveIcon(item.type, item.mimeType)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type === 'file' && item.size !== undefined
                        ? formatBytes(item.size)
                        : item.type === 'folder'
                        ? 'Pasta'
                        : ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 