import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json(session || { user: null });
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 