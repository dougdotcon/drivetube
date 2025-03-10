'use client'

import { cn } from '../utils/cn'

interface LoadingProps {
  className?: string
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span className="sr-only">Carregando...</span>
    </div>
  )
} 