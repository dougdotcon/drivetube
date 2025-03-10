'use client'

import { cn } from '../utils/cn'

interface ErrorProps {
  message?: string
  className?: string
}

export default function Error({ message = 'Algo deu errado', className }: ErrorProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <svg
        className="h-12 w-12 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">Erro</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  )
} 