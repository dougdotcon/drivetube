import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('[NextAuth]', data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar log:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 