import { api } from '@/lib/api'

export interface ProtonDriveItem {
  id: string
  name: string
  type: 'file' | 'folder'
  mimeType?: string
  size?: number
  lastModified: Date
  parentId?: string
  shareId?: string
  linkId?: string
  signatureAddress?: string
  hasThumbnail?: boolean
  isShared?: boolean
}

export interface ProtonDriveResponse {
  items: ProtonDriveItem[]
  currentFolder: {
    id: string
    name: string
    path: string[]
  }
  parentFolder: {
    id: string
    name: string
  } | null
}

export async function listProtonDriveItems(folderId?: string): Promise<ProtonDriveResponse> {
  const response = await api.get<ProtonDriveResponse>('/proton/list', {
    params: { folderId }
  })
  return response.data
}

export async function getProtonDriveItemDetails(itemId: string): Promise<ProtonDriveItem> {
  const response = await api.get<ProtonDriveItem>(`/proton/details/${itemId}`)
  return response.data
}

export async function downloadProtonDriveFile(itemId: string): Promise<Blob> {
  const response = await api.get(`/proton/download/${itemId}`, {
    responseType: 'blob'
  })
  return response.data
}

export async function uploadToProtonDrive(
  file: File,
  parentId?: string
): Promise<ProtonDriveItem> {
  const formData = new FormData()
  formData.append('file', file)
  if (parentId) {
    formData.append('parentId', parentId)
  }

  const response = await api.post<ProtonDriveItem>('/proton/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export async function createProtonDriveFolder(
  name: string,
  parentId?: string
): Promise<ProtonDriveItem> {
  const response = await api.post<ProtonDriveItem>('/proton/create-folder', {
    name,
    parentId
  })
  return response.data
}

export async function deleteProtonDriveItem(itemId: string): Promise<void> {
  await api.delete(`/proton/delete/${itemId}`)
}

export async function shareProtonDriveItem(
  itemId: string,
  options: {
    expirationTime?: number
    maxDownloads?: number
    password?: string
  }
): Promise<{ shareUrl: string }> {
  const response = await api.post<{ shareUrl: string }>(`/proton/share/${itemId}`, options)
  return response.data
}

export function getProtonDriveIcon(type: string, mimeType?: string): string {
  if (type === 'folder') return '📁'
  
  const mimeTypeMap: { [key: string]: string } = {
    // Vídeos
    'video/mp4': '🎥',
    'video/x-matroska': '🎥',
    'video/quicktime': '🎥',
    // Imagens
    'image/jpeg': '🖼️',
    'image/png': '🖼️',
    'image/gif': '🖼️',
    // Documentos
    'application/pdf': '📄',
    'application/msword': '📄',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📄',
    'text/plain': '📝',
    'text/markdown': '📝',
    // Planilhas
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'text/csv': '📊',
    // Apresentações
    'application/vnd.ms-powerpoint': '📽️',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📽️',
    // Arquivos compactados
    'application/zip': '📦',
    'application/x-rar-compressed': '📦',
    'application/x-7z-compressed': '📦',
    // Código
    'text/javascript': '💻',
    'application/typescript': '💻',
    'text/html': '🌐',
    'text/css': '🎨',
    // Outros
    'default': '📄'
  }

  return mimeType ? (mimeTypeMap[mimeType] || mimeTypeMap.default) : mimeTypeMap.default
} 