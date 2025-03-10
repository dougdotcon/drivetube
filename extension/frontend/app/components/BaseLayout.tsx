'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Toast from './Toast'

interface BaseLayoutProps {
  children: ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // Não renderiza o layout nas páginas de autenticação
  if (pathname === '/login' || pathname === '/register') {
    return (
      <>
        {children}
        <Toast />
      </>
    )
  }

  // Redireciona para o login se não estiver autenticado
  if (!isAuthenticated) {
    window.location.href = '/login'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Toast />
    </div>
  )
} 