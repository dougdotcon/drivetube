'use client'

import TelegramConfig from '@/components/TelegramConfig'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export default function TelegramPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Telegram</h1>
      
      <div className="space-y-6">
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            O módulo do Telegram está em desenvolvimento. Algumas funcionalidades podem
            não estar disponíveis ou podem sofrer alterações significativas.
          </AlertDescription>
        </Alert>

        <TelegramConfig />
      </div>
    </div>
  )
} 