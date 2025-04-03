'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
}

interface SubscriptionInfo {
  plan: string;
  expiryDate: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    // Carregar preferências do usuário
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = localStorage.getItem('notifications') === 'true';
    setDarkMode(savedDarkMode);
    setNotifications(savedNotifications);

    // Aplicar tema escuro se necessário
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Carregar informações do usuário
    fetchUserInfo();
    fetchSubscriptionInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Erro ao carregar informações do usuário:', error);
    }
  };

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch('/api/subscription');
      const data = await response.json();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Erro ao carregar informações da assinatura:', error);
    }
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNotificationsToggle = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('notifications', String(newNotifications));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Configurações</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Conta</h2>
        <div className="mb-6">
          {userInfo && (
            <div className="flex items-center mb-4">
              <Image
                src={userInfo.avatar}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full mr-4"
              />
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {userInfo.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userInfo.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Sair da conta
          </button>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assinatura</h2>
        <div className="mb-6">
          {subscriptionInfo && (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Plano atual: <span className="font-medium">{subscriptionInfo.plan}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Válido até: <span className="font-medium">{subscriptionInfo.expiryDate}</span>
              </p>
            </>
          )}
          <Link
            href="/subscription"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Gerenciar assinatura
          </Link>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferências</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Tema escuro</label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                className="hidden"
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
              <div
                className={`absolute inset-0 cursor-pointer rounded-full transition-colors ${
                  darkMode ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute left-0 inline-block w-6 h-6 transform transition-transform bg-white rounded-full shadow ${
                    darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Notificações</label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                className="hidden"
                checked={notifications}
                onChange={handleNotificationsToggle}
              />
              <div
                className={`absolute inset-0 cursor-pointer rounded-full transition-colors ${
                  notifications ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute left-0 inline-block w-6 h-6 transform transition-transform bg-white rounded-full shadow ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Mulakintola v1.0.0</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <Link href="/privacy" className="text-indigo-500 hover:text-indigo-600">
            Política de Privacidade
          </Link>{' '}
          •{' '}
          <Link href="/terms" className="text-indigo-500 hover:text-indigo-600">
            Termos de Uso
          </Link>
        </p>
      </div>
    </div>
  );
} 