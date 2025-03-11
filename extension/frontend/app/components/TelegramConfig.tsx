'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  connectTelegramBot,
  disconnectTelegramBot,
  getTelegramBotStatus
} from '@/services/telegram'

export default function TelegramConfig() {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<{
    connected: boolean
    username?: string
    lastUpdate?: Date
  }>({ connected: false })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      const status = await getTelegramBotStatus()
      setStatus(status)
    } catch (err) {
      console.error(err)
    }
  }

  const handleConnect = async () => {
    if (!token) {
      toast({
        title: 'Erro',
        description: 'Token do bot é obrigatório',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      await connectTelegramBot(token)
      await loadStatus()
      toast({
        title: 'Sucesso',
        description: 'Bot conectado com sucesso'
      })
      setToken('')
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao conectar bot',
        variant: 'destructive'
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setLoading(true)
      await disconnectTelegramBot()
      await loadStatus()
      toast({
        title: 'Sucesso',
        description: 'Bot desconectado com sucesso'
      })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao desconectar bot',
        variant: 'destructive'
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Telegram</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Esta funcionalidade está em desenvolvimento e pode sofrer alterações.
            Use com cautela.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <div className="text-sm font-medium">Status do Bot</div>
          <div className="text-sm">
            {status.connected ? (
              <>
                <span className="text-green-500">●</span> Conectado
                {status.username && ` como @${status.username}`}
                {status.lastUpdate && (
                  <div className="text-xs text-muted-foreground">
                    Última atualização: {new Date(status.lastUpdate).toLocaleString()}
                  </div>
                )}
              </>
            ) : (
              <>
                <span className="text-red-500">●</span> Desconectado
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Token do Bot"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type="password"
            disabled={loading || status.connected}
          />
          {status.connected ? (
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              disabled={loading}
            >
              Desconectar
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={loading || !token}
            >
              Conectar
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          Para obter um token, converse com o @BotFather no Telegram e siga as instruções
          para criar um novo bot.
        </div>
      </CardContent>
    </Card>
  )
} 