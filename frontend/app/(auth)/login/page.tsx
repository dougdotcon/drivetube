'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const error = searchParams.get('error')

  useEffect(() => {
    const params = new URLSearchParams()
    if (callbackUrl) params.append('callbackUrl', callbackUrl)
    if (error) params.append('error', error)
    
    router.push(`/auth/signin${params.toString() ? `?${params.toString()}` : ''}`)
  }, [router, callbackUrl, error])

  return null
}