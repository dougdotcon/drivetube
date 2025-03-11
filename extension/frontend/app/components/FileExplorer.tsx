'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, FolderOpen, Search } from 'lucide-react'
import { FileSystemItem, FileSystemResponse, listDirectory, openFile, getFileIcon } from '@/services/fileExplorer'
import { formatBytes } from '@/lib/utils'

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('')
  const [parentPath, setParentPath] = useState<string | null>(null)
  const [items, setItems] = useState<FileSystemItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadDirectory = async (path: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await listDirectory(path)
      setItems(response.items)
      setCurrentPath(response.currentPath)
      setParentPath(response.parentPath)
    } catch (err) {
      setError('Erro ao carregar diretório')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDirectory(currentPath)
  }, [])

  const handleItemClick = async (item: FileSystemItem) => {
    if (item.type === 'directory') {
      loadDirectory(item.path)
    } else {
      try {
        await openFile(item.path)
      } catch (err) {
        setError('Erro ao abrir arquivo')
        console.error(err)
      }
    }
  }

  const handleParentClick = () => {
    if (parentPath !== null) {
      loadDirectory(parentPath)
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Explorador de Arquivos</CardTitle>
          {parentPath !== null && (
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
            onClick={() => loadDirectory(currentPath)}
            className="flex items-center gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {currentPath || 'Raiz'}
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
                key={item.path}
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
              >
                <span className="text-2xl">
                  {getFileIcon(item.type, item.extension)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.type === 'file' && item.size !== undefined
                      ? formatBytes(item.size)
                      : item.type === 'directory'
                      ? 'Pasta'
                      : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 