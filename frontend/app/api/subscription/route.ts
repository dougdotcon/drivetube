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

    // Aqui você deve buscar as informações da assinatura no banco de dados
    // Este é apenas um exemplo
    const subscriptionInfo = {
      plan: 'Pro', // Deve vir do banco de dados
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // Exemplo: 30 dias a partir de hoje
    };

    return NextResponse.json(subscriptionInfo);
  } catch (error) {
    console.error('Erro ao buscar informações da assinatura:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar informações da assinatura' },
      { status: 500 }
    );
  }
} 