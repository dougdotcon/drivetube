'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirecionar automaticamente após 5 segundos
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          signIn('google', { callbackUrl: '/' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getErrorMessage = () => {
    switch (error) {
      case 'AccessDenied':
        return 'Você não concedeu as permissões necessárias para acessar seus vídeos do Google Drive. Por favor, aceite todas as permissões solicitadas.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
        return 'Ocorreu um problema durante a autenticação com o Google. Por favor, tente novamente.';
      case 'Callback':
        return 'Houve um erro no processo de callback da autenticação. Por favor, tente novamente.';
      case 'Configuration':
        return 'Há um problema na configuração do servidor. Por favor, contate o administrador.';
      default:
        return 'Ocorreu um erro durante a autenticação. Por favor, tente novamente e certifique-se de aceitar todas as permissões solicitadas.';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-red-900">
      <div className="text-center max-w-md p-10 bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="text-red-400 mb-8">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Erro de Autenticação</h2>
        <p className="text-gray-300 mb-8 text-lg">
          {getErrorMessage()}
        </p>
        <div className="mb-8 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
          <p className="text-gray-300 text-sm mb-2">
            <strong>Dica:</strong> Certifique-se de:
          </p>
          <ul className="text-gray-400 text-sm text-left list-disc pl-5">
            <li className="mb-1">Aceitar todas as permissões solicitadas</li>
            <li className="mb-1">Usar uma conta Google com acesso aos vídeos</li>
            <li className="mb-1">Verificar sua conexão com a internet</li>
          </ul>
        </div>
        <p className="text-gray-400 mb-8">
          Você será redirecionado automaticamente em {countdown} segundos...
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg transform hover:-translate-y-1 font-medium"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
} 