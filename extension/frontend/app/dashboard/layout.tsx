'use client'

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Home, Video, BookOpen, UserPlus, FolderOpen, Shield, MessageSquare } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const isContentCreator = user?.role === 'CONTENT_CREATOR';

  const sidebarItems = [
    {
      title: 'Geral',
      items: [
        {
          title: 'Dashboard',
          icon: Home,
          href: '/dashboard',
        },
        {
          title: 'Meus Vídeos',
          icon: Video,
          href: '/dashboard/videos',
        },
        {
          title: 'Arquivos Locais',
          icon: FolderOpen,
          href: '/dashboard/files',
        },
        {
          title: 'Proton Drive',
          icon: Shield,
          href: '/dashboard/proton',
        },
        {
          title: 'Telegram (Beta)',
          icon: MessageSquare,
          href: '/dashboard/telegram',
        },
      ],
    },
  ];

  if (isContentCreator) {
    sidebarItems.push({
      title: 'Cursos',
      items: [
        {
          title: 'Meus Cursos',
          icon: BookOpen,
          href: '/dashboard/courses',
        },
        {
          title: 'Solicitações de Acesso',
          icon: UserPlus,
          href: '/dashboard/access-requests',
        },
      ],
    });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
} 