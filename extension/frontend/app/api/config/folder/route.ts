import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { folderId } = await req.json()

    if (!folderId) {
      return NextResponse.json(
        { error: 'ID da pasta é obrigatório' },
        { status: 400 }
      )
    }

    // Verifica se a pasta existe e se o usuário tem acesso
    const accessToken = token.accessToken as string
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,mimeType`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Pasta não encontrada' },
          { status: 404 }
        )
      }

      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Você não tem permissão para acessar esta pasta' },
          { status: 403 }
        )
      }

      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Erro ao verificar pasta')
    }

    const folderData = await response.json()
    
    if (folderData.mimeType !== 'application/vnd.google-apps.folder') {
      return NextResponse.json(
        { error: 'O ID fornecido não é de uma pasta' },
        { status: 400 }
      )
    }

    // Aqui você pode salvar o ID da pasta em um banco de dados
    // Por enquanto, vamos apenas retornar sucesso
    return NextResponse.json({
      message: 'Pasta configurada com sucesso',
      folder: {
        id: folderData.id,
        name: folderData.name
      }
    })
  } catch (error: any) {
    console.error('Erro ao configurar pasta:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 