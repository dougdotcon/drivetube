import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get('error')
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  return NextResponse.redirect(`${baseUrl}/login?error=${error || 'unknown'}`)
}