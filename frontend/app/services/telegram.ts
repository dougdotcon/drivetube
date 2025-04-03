import { api } from '@/lib/api'

export interface TelegramMessage {
  id: string
  text: string
  from: {
    id: number
    username?: string
    firstName?: string
  }
  date: Date
  chatId: number
}

export interface TelegramChat {
  id: number
  title?: string
  type: 'private' | 'group' | 'supergroup' | 'channel'
  username?: string
}

// NOTA: API em desenvolvimento - sujeita a alterações
export async function sendTelegramMessage(chatId: number, text: string): Promise<TelegramMessage> {
  const response = await api.post<TelegramMessage>('/telegram/send', {
    chatId,
    text
  })
  return response.data
}

// NOTA: API em desenvolvimento - sujeita a alterações
export async function listTelegramChats(): Promise<TelegramChat[]> {
  const response = await api.get<TelegramChat[]>('/telegram/chats')
  return response.data
}

// NOTA: API em desenvolvimento - sujeita a alterações
export async function getRecentMessages(chatId: number): Promise<TelegramMessage[]> {
  const response = await api.get<TelegramMessage[]>(`/telegram/messages/${chatId}`)
  return response.data
}

// NOTA: API em desenvolvimento - sujeita a alterações
export async function connectTelegramBot(token: string): Promise<void> {
  await api.post('/telegram/connect', { token })
}

// NOTA: API em desenvolvimento - sujeita a alterações
export async function disconnectTelegramBot(): Promise<void> {
  await api.post('/telegram/disconnect')
}

// NOTA: API em desenvolvimento - sujeita a alterações
export async function getTelegramBotStatus(): Promise<{
  connected: boolean
  username?: string
  lastUpdate?: Date
}> {
  const response = await api.get('/telegram/status')
  return response.data
} 