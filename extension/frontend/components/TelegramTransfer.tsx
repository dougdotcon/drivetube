import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

interface TransferStatus {
  status: 'idle' | 'downloading' | 'uploading' | 'completed' | 'error';
  progress: number;
  message: string;
}

export default function TelegramTransfer() {
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [botUsername, setBotUsername] = useState('');
  const [transferStatus, setTransferStatus] = useState<TransferStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  useEffect(() => {
    // Verifica se já existe conexão com Telegram
    checkTelegramConnection();
  }, []);

  const checkTelegramConnection = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/telegram/status');
      const data = await response.json();
      setTelegramConnected(data.connected);
      if (data.connected) {
        setBotUsername(data.botUsername);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
    }
  };

  const connectTelegram = async () => {
    try {
      // Abre página do Telegram Bot para iniciar conexão
      window.open('https://t.me/seu_bot', '_blank');
      
      // Inicia polling para verificar status da conexão
      const checkInterval = setInterval(async () => {
        const response = await fetch('http://localhost:3333/api/telegram/status');
        const data = await response.json();
        if (data.connected) {
          setTelegramConnected(true);
          setBotUsername(data.botUsername);
          clearInterval(checkInterval);
        }
      }, 2000);

      // Limpa intervalo após 2 minutos
      setTimeout(() => clearInterval(checkInterval), 120000);
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  };

  const startTransfer = async () => {
    try {
      setTransferStatus({
        status: 'downloading',
        progress: 0,
        message: 'Iniciando download do vídeo...'
      });

      // Inicia processo de transferência
      const response = await fetch('http://localhost:3333/api/transfer/start', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erro ao iniciar transferência');

      // Inicia polling do progresso
      const progressInterval = setInterval(async () => {
        const progressResponse = await fetch('http://localhost:3333/api/transfer/status');
        const data = await progressResponse.json();

        setTransferStatus({
          status: data.status,
          progress: data.progress,
          message: data.message
        });

        if (data.status === 'completed' || data.status === 'error') {
          clearInterval(progressInterval);
        }
      }, 1000);

    } catch (error) {
      console.error('Erro na transferência:', error);
      setTransferStatus({
        status: 'error',
        progress: 0,
        message: 'Erro ao realizar transferência'
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transferência Telegram → Drive</CardTitle>
      </CardHeader>
      <CardContent>
        {!telegramConnected ? (
          <div className="space-y-4">
            <p>Conecte-se ao bot do Telegram para começar:</p>
            <Button onClick={connectTelegram}>
              Conectar ao Telegram
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Conectado ao bot: @{botUsername}</p>
            <p>Envie o vídeo para o bot e clique em iniciar:</p>
            <Button 
              onClick={startTransfer}
              disabled={transferStatus.status !== 'idle'}
            >
              Iniciar Transferência
            </Button>

            {transferStatus.status !== 'idle' && (
              <div className="space-y-2">
                <Progress value={transferStatus.progress} />
                <p>{transferStatus.message}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 