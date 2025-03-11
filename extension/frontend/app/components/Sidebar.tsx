'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  title: string
  icon: LucideIcon
  href: string
}

interface SidebarSectionProps {
  title: string
  items: SidebarItemProps[]
}

interface SidebarProps {
  items: SidebarSectionProps[]
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-card">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Mula Kintola</h2>
        <nav className="space-y-6">
          {items.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                        pathname === item.href
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent/50'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
} 