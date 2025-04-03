'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { SessionProvider } from 'next-auth/react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>{children}</main>
        </div>
        <Toaster />
      </GoogleOAuthProvider>
    </SessionProvider>
  )
} 