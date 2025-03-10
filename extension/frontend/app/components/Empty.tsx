'use client'

import { cn } from '../utils/cn'

interface EmptyProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  className?: string
}

export default function Empty({ icon: Icon, title, description, className }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      {Icon && (
        <Icon className="h-12 w-12 text-gray-400" />
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  )
} 