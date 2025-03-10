'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import Input from './Input'
import Button from './Button'

export default function RegisterForm() {
  const { register, error: authError, isLoading, clearError } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha todos os campos')
      return
    }

    try {
      await register(name.trim(), email.trim(), password)
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
        label="Nome"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          handleInputChange()
        }}
        error={error || authError}
        disabled={isLoading}
        required
      />

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
          Criar conta
        </Button>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Faça login
          </Link>
        </p>
      </div>
    </form>
  )
} 