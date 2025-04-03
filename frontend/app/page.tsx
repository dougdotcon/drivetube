'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col items-center justify-center space-y-8 md:space-y-12">
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4">
              <Image
                src="/images/mulakintola-logo.png"
                alt="Mulakintola Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <div className="text-center max-w-2xl px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 font-display">
                mulakintola
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed">
                Sua plataforma amigável para visualização de vídeos e cursos do Google Drive, 
                tornando o aprendizado mais fácil e acessível.
              </p>
              
              <div className="relative">
                <button
                  onClick={() => signIn('google')}
                  className="px-6 py-3 md:px-8 md:py-4 bg-yellow-400 text-gray-800 rounded-2xl hover:bg-yellow-500 
                           transition-all duration-300 transform hover:scale-105 shadow-lg
                           flex items-center space-x-3 mx-auto font-medium text-base md:text-lg"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                    />
                  </svg>
                  <span>Entrar com Google</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto mt-8 md:mt-16 px-4">
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-yellow-400 mb-3 md:mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Acesso Simplificado</h3>
                <p className="text-gray-600 text-sm md:text-base">Visualize seus vídeos do Google Drive de forma organizada e intuitiva</p>
              </div>

              <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-yellow-400 mb-3 md:mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Interface Amigável</h3>
                <p className="text-gray-600 text-sm md:text-base">Controles intuitivos e organização clara para melhor experiência</p>
              </div>

              <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 md:col-span-1">
                <div className="text-yellow-400 mb-3 md:mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Acesso Seguro</h3>
                <p className="text-gray-600 text-sm md:text-base">Autenticação segura com sua conta Google para proteger seu conteúdo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8">
          <div className="relative w-28 h-28 md:w-32 md:h-32 mb-2 md:mb-4">
            <Image
              src="/images/mulakintola-logo.png"
              alt="Mulakintola Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <div className="text-center max-w-2xl px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              Bem-vindo, {session.user?.name}!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Seus vídeos e cursos estão esperando por você
            </p>
            
            <Link
              href="/videos"
              className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-yellow-400 text-gray-800 rounded-2xl
                         hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105
                         shadow-lg font-medium text-base md:text-lg"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Acessar Meus Vídeos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 