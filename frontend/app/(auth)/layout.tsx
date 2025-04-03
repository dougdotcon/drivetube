'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verifica se já existe um token
    const token = localStorage.getItem('token')
    if (token && (pathname === '/login' || pathname === '/register')) {
      router.push('/videos')
    }
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
} 