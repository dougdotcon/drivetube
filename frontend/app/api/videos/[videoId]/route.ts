import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    // Extrair o videoId da URL
    const videoId = params.videoId;
    console.log('Buscando vídeo específico:', videoId);
    
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      console.error('Sessão ou token não encontrado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.get({
      fileId: videoId,
      fields: 'id, name, thumbnailLink, mimeType, webContentLink, webViewLink',
      supportsAllDrives: true,
    });

    if (!response.data) {
      throw new Error('Vídeo não encontrado');
    }

    console.log('Vídeo encontrado:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar vídeo' },
      { status: 500 }
    );
  }
} 