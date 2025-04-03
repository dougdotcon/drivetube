'use client'

import FileExplorer from '@/components/FileExplorer'

export default function FilesPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Arquivos Locais</h1>
      <FileExplorer />
    </div>
  )
} 