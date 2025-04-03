import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Aqui você deve buscar as informações do usuário no banco de dados
    // Este é apenas um exemplo
    const userInfo = {
      name: session.user?.name,
      email: session.user?.email,
      avatar: session.user?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(session.user?.name || ''),
    };

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar informações do usuário' },
      { status: 500 }
    );
  }
} 