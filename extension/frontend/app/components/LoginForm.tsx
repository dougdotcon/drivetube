'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import Input from './Input'
import Button from './Button'

export default function LoginForm() {
  const { login, error: authError, isLoading, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      setError('Preencha todos os campos')
      return
    }

    try {
      await login(email.trim(), password)
    } catch (error) {
      // O erro já é tratado pelo hook useAuth
    }
  }

  const handleInputChange = () => {
    setError(null)
    clearError()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="E-mail"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          handleInputChange()
        }}
        error={error || authError}
        disabled={isLoading}
        required
      />

      <Input
        type="password"
        label="Senha"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          handleInputChange()
        }}
        error={error || authError}
        disabled={isLoading}
        required
      />

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Entrar
        </Button>

        <p className="text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </form>
  )
} 