import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

interface DriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  webViewLink?: string
  createdTime?: string
  modifiedTime?: string
  size?: string
  description?: string
}

interface DriveFolder {
  id: string
  name: string
  files: DriveFile[]
  subfolders: DriveFolder[]
}

// Função para verificar se um arquivo é um vídeo
function isVideoFile(file: DriveFile): boolean {
  // Verificar pelo tipo MIME
  if (file.mimeType.startsWith('video/') || 
      file.mimeType === 'application/vnd.google-apps.video') {
    return true;
  }
  
  // Verificar pela extensão do arquivo
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];
  const fileName = file.name.toLowerCase();
  return videoExtensions.some(ext => fileName.endsWith(ext));
}

// Função para buscar o conteúdo de uma pasta recursivamente
async function fetchFolderContents(folderId: string, accessToken: string, depth: number = 0): Promise<DriveFolder> {
  // Limitar a profundidade da recursão para evitar loops infinitos
  if (depth > 3) {
    return {
      id: folderId,
      name: 'Limite de profundidade atingido',
      files: [],
      subfolders: []
    }
  }

  try {
    // Buscar informações da pasta
    const folderResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${folderId}?fields=name`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!folderResponse.ok) {
      throw new Error(`Erro ao obter informações da pasta: ${folderResponse.status}`)
    }

    const folderData = await folderResponse.json()

    // Buscar arquivos e subpastas
    const filesResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,mimeType,thumbnailLink,webViewLink,createdTime,modifiedTime,size,description)&pageSize=1000`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!filesResponse.ok) {
      throw new Error(`Erro ao buscar arquivos: ${filesResponse.status}`)
    }

    const filesData = await filesResponse.json()

    // Inicializar a estrutura da pasta
    const folder: DriveFolder = {
      id: folderId,
      name: folderData.name,
      files: [],
      subfolders: []
    }

    // Processar os arquivos e subpastas
    const subfolderPromises: Promise<DriveFolder>[] = []

    for (const file of filesData.files || []) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        // É uma subpasta, buscar seu conteúdo recursivamente
        subfolderPromises.push(fetchFolderContents(file.id, accessToken, depth + 1))
      } else if (isVideoFile(file)) {
        // É um vídeo, adicionar à lista de arquivos
        folder.files.push(file)
      }
    }

    // Aguardar todas as subpastas serem processadas
    const subfolders = await Promise.all(subfolderPromises)
    folder.subfolders = subfolders.filter(subfolder => 
      subfolder.files.length > 0 || subfolder.subfolders.length > 0
    )

    return folder
  } catch (error) {
    console.error(`Erro ao buscar pasta ${folderId}:`, error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folderId')

    if (!folderId) {
      return NextResponse.json(
        { error: 'ID da pasta não fornecido' },
        { status: 400 }
      )
    }

    try {
      // Buscar a estrutura da pasta recursivamente
      console.log(`Buscando estrutura da pasta ${folderId}...`)
      const folderStructure = await fetchFolderContents(folderId, session.accessToken)
      console.log(`Estrutura da pasta ${folderId} obtida com sucesso:`, {
        name: folderStructure.name,
        files: folderStructure.files.length,
        subfolders: folderStructure.subfolders.length
      })
      return NextResponse.json(folderStructure)
    } catch (error: any) {
      console.error('Erro ao buscar estrutura da pasta:', error)
      
      if (error.message.includes('401')) {
        return NextResponse.json(
          { error: 'Sessão expirada. Por favor, faça login novamente.' },
          { status: 401 }
        )
      }
      
      if (error.message.includes('403')) {
        return NextResponse.json(
          { error: 'Sem permissão para acessar a pasta. Por favor, verifique as permissões no Google Drive.' },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: error.message || 'Erro ao buscar vídeos' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Erro ao buscar vídeos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 