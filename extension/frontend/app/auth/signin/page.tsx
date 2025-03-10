'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Se não houver erro, redirecionar automaticamente para o login do Google
    if (!error) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSignIn();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [error]);

  const handleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="text-center max-w-md p-10 bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="mb-8">
          <svg className="w-24 h-24 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Interface Google Drive Videos</h2>
        <p className="text-gray-300 mb-6 text-lg">
          Faça login com sua conta do Google para acessar seus vídeos
        </p>
        
        <div className="mb-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg text-left">
          <p className="text-gray-200 text-sm mb-2 font-medium">
            Permissões necessárias:
          </p>
          <ul className="text-gray-400 text-sm list-disc pl-5">
            <li className="mb-1">Acesso para leitura dos seus arquivos no Google Drive</li>
            <li className="mb-1">Acesso aos metadados dos arquivos (nomes, miniaturas)</li>
            <li className="mb-1">Informações básicas do seu perfil</li>
          </ul>
          <p className="text-gray-400 text-xs mt-2 italic">
            Nota: Não modificamos ou excluímos nenhum arquivo. Apenas leitura é necessária.
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-50 rounded-lg text-white">
            {error === 'AccessDenied' 
              ? 'Você precisa conceder permissões para acessar seus vídeos do Google Drive.' 
              : 'Ocorreu um erro durante o login. Por favor, tente novamente.'}
          </div>
        )}
        
        {!error && (
          <p className="text-gray-400 mb-4">
            Redirecionando para o login em {countdown} segundos...
          </p>
        )}
        
        <button
          onClick={handleSignIn}
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg transform hover:-translate-y-1 font-medium flex items-center justify-center"
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
            />
          </svg>
          Entrar com Google
        </button>
      </div>
    </div>
  );
} 