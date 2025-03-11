import { api } from '@/lib/api'

export interface FileSystemItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  lastModified?: Date
  extension?: string
}

export interface FileSystemResponse {
  items: FileSystemItem[]
  currentPath: string
  parentPath: string | null
}

export async function listDirectory(path: string): Promise<FileSystemResponse> {
  const response = await api.get<FileSystemResponse>(`/files/list`, {
    params: { path }
  })
  return response.data
}

export async function getFileDetails(path: string): Promise<FileSystemItem> {
  const response = await api.get<FileSystemItem>(`/files/details`, {
    params: { path }
  })
  return response.data
}

export async function openFile(path: string): Promise<void> {
  await api.post(`/files/open`, { path })
}

export function getFileIcon(type: string, extension?: string): string {
  if (type === 'directory') return '📁'
  
  const iconMap: { [key: string]: string } = {
    // Vídeos
    mp4: '🎥', mkv: '🎥', avi: '🎥', mov: '🎥',
    // Imagens
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️',
    // Documentos
    pdf: '📄', doc: '📄', docx: '📄',
    txt: '📝', md: '📝',
    // Planilhas
    xls: '📊', xlsx: '📊', csv: '📊',
    // Apresentações
    ppt: '📽️', pptx: '📽️',
    // Arquivos compactados
    zip: '📦', rar: '📦', '7z': '📦',
    // Código
    js: '💻', ts: '💻', jsx: '💻', tsx: '💻',
    py: '🐍', java: '☕', cpp: '⚙️', 
    html: '🌐', css: '🎨',
    // Outros
    default: '📄'
  }

  return extension ? (iconMap[extension.toLowerCase()] || iconMap.default) : iconMap.default
} 