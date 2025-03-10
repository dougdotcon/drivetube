'use client'

import { useState, useMemo } from 'react'
import { DriveVideo, DriveFolder } from '../types/drive'
import {
  ChevronDownIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon,
  FolderIcon, 
  VideoCameraIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
  ArrowPathIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

type SortOrder = 'asc' | 'desc' | 'numeric'

interface SidebarProps {
  folderStructure: DriveFolder
  onVideoSelect: (videoId: string) => void
  isOpen: boolean
  onToggle: () => void
  onRefresh: () => void
  isFolderExpanded: (folderId: string) => boolean
  toggleFolderExpanded: (folderId: string) => void
}

interface FolderItemProps {
  folder: DriveFolder
  onVideoSelect: (videoId: string) => void
  level?: number
  sortOrder: SortOrder
  isFolderExpanded: (folderId: string) => boolean
  toggleFolderExpanded: (folderId: string) => void
}

function sortFolders(folders: DriveFolder[], order: SortOrder): DriveFolder[] {
  return [...folders].sort((a, b) => {
    if (order === 'numeric') {
      // Extrai números dos nomes das pastas (ex: "Dia 1" -> 1)
      const numA = parseInt(a.name.match(/\d+/)?.[0] || '0')
      const numB = parseInt(b.name.match(/\d+/)?.[0] || '0')
      return numA - numB
    }
    return order === 'asc' 
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  })
}

const FolderItem = ({ 
  folder, 
  onVideoSelect, 
  level = 0, 
  sortOrder,
  isFolderExpanded,
  toggleFolderExpanded
}: FolderItemProps) => {
  const paddingLeft = `${level * 1.5}rem`

  const sortedSubfolders = useMemo(() => 
    sortFolders(folder.subfolders, sortOrder),
    [folder.subfolders, sortOrder]
  )

  const sortedFiles = useMemo(() => 
    [...folder.files].sort((a, b) => 
      sortOrder === 'desc' 
        ? b.name.localeCompare(a.name) 
        : a.name.localeCompare(b.name)
    ),
    [folder.files, sortOrder]
  )

  const hasContent = folder.subfolders.length > 0 || folder.files.length > 0
  const isExpanded = isFolderExpanded(folder.id)

  return (
    <div>
      {/* Pasta */}
      <div 
        className={`flex items-center py-2 px-4 hover:bg-yellow-100 cursor-pointer transition-colors ${
          hasContent ? 'hover:bg-yellow-100' : 'opacity-70 cursor-default'
        }`}
        style={{ paddingLeft }}
        onClick={() => hasContent && toggleFolderExpanded(folder.id)}
        title={hasContent ? undefined : 'Pasta vazia'}
      >
        {hasContent ? (
          isExpanded ? (
            <ChevronDownIcon className="h-4 w-4 text-gray-500 mr-2" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-gray-500 mr-2" />
          )
        ) : (
          <div className="w-4 mr-2" />
        )}
        <FolderIcon className={`h-5 w-5 mr-2 ${hasContent ? 'text-yellow-500' : 'text-gray-400'}`} />
        <span className={`font-medium truncate ${hasContent ? 'text-gray-700' : 'text-gray-500'}`}>
          {folder.name}
          {hasContent && (
            <span className="text-xs text-gray-500 ml-2">
              ({folder.files.length + folder.subfolders.length})
            </span>
          )}
        </span>
      </div>

      {/* Conteúdo da pasta */}
      {isExpanded && hasContent && (
        <div>
          {/* Vídeos da pasta atual */}
          {sortedFiles.map((video) => (
            <div
              key={video.id}
              className="flex items-center py-2 px-4 hover:bg-yellow-100 cursor-pointer transition-colors"
              style={{ paddingLeft: `${paddingLeft + 2}rem` }}
              onClick={() => onVideoSelect(video.id)}
            >
              <VideoCameraIcon className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600 truncate">
                {video.name}
              </span>
            </div>
          ))}

          {/* Subpastas */}
          {sortedSubfolders.map((subfolder) => (
            <FolderItem
              key={subfolder.id}
              folder={subfolder}
              onVideoSelect={onVideoSelect}
              level={level + 1}
              sortOrder={sortOrder}
              isFolderExpanded={isFolderExpanded}
              toggleFolderExpanded={toggleFolderExpanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ 
  folderStructure, 
  onVideoSelect, 
  isOpen, 
  onToggle,
  onRefresh,
  isFolderExpanded,
  toggleFolderExpanded
}: SidebarProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('numeric')

  const handleSortChange = (newOrder: SortOrder) => {
    setSortOrder(newOrder)
  }

  return (
    <>
      {/* Botão para abrir sidebar quando fechada */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-0 top-4 z-50 p-2 bg-white rounded-r-lg shadow-md hover:bg-gray-100 transition-colors"
          title="Abrir menu"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
        </button>
      )}

      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-80' : 'w-0'
        } flex flex-col h-full`}
      >
        {isOpen && (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">Vídeos</h2>
                <div className="flex gap-2">
                  <Link
                    href="/saved"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ver pastas salvas"
                  >
                    <BookmarkIcon className="h-5 w-5 text-gray-500" />
                  </Link>
                  <button
                    onClick={onRefresh}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Atualizar lista"
                  >
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button
                    onClick={onToggle}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Fechar menu"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Botões de ordenação */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange('numeric')}
                  className={`flex-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
                    sortOrder === 'numeric' 
                      ? 'bg-yellow-400 text-gray-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Ordenar por número (Dia 1, Dia 2...)"
                >
                  <ArrowsUpDownIcon className="h-4 w-4 inline mr-1" />
                  Numérica
                </button>
                <button
                  onClick={() => handleSortChange('asc')}
                  className={`flex-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
                    sortOrder === 'asc' 
                      ? 'bg-yellow-400 text-gray-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Ordenar de A a Z"
                >
                  <ArrowUpIcon className="h-4 w-4 inline mr-1" />
                  A-Z
                </button>
                <button
                  onClick={() => handleSortChange('desc')}
                  className={`flex-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
                    sortOrder === 'desc' 
                      ? 'bg-yellow-400 text-gray-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Ordenar de Z a A"
                >
                  <ArrowDownIcon className="h-4 w-4 inline mr-1" />
                  Z-A
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FolderItem 
                folder={folderStructure} 
                onVideoSelect={onVideoSelect} 
                sortOrder={sortOrder}
                isFolderExpanded={isFolderExpanded}
                toggleFolderExpanded={toggleFolderExpanded}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
} 