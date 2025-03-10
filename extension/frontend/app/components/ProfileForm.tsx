'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Input from './Input'
import Button from './Button'

export default function ProfileForm() {
  const { user, isLoading } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      setError('Nome e e-mail são obrigatórios')
      return
    }

    try {
      // TODO: Implementar atualização de perfil
      setError(null)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao atualizar perfil')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        disabled={isLoading}
        required
      />

      <Input
        type="email"
        label="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        disabled={isLoading}
        required
      />

      <Input
        type="password"
        label="Nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error}
        disabled={isLoading}
        placeholder="Deixe em branco para manter a senha atual"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Salvar alterações
        </Button>
      </div>
    </form>
  )
} 