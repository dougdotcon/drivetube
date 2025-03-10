'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import { FolderIcon } from '@heroicons/react/24/outline'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <Image
                src="/images/mulakintola-logo.png"
                alt="Mulakintola Logo"
                fill
                className="object-contain"
              />
            </div>
            <Link href="/" className="text-gray-800 text-xl font-bold">
              mulakintola
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/planos" 
              className="text-gray-700 hover:text-yellow-600 transition-colors font-medium"
            >
              Planos
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/saved"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FolderIcon className="h-5 w-5 mr-2" />
                  Pastas Salvas
                </Link>

                <Link 
                  href="/videos" 
                  className="text-gray-700 hover:text-yellow-600 transition-colors"
                >
                  Meus Vídeos
                </Link>
                
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white">
                      <span className="sr-only">Abrir menu do usuário</span>
                      {session.user.image ? (
                        <img
                          className="h-8 w-8 rounded-full border border-gray-200"
                          src={session.user.image}
                          alt={session.user.name || 'Usuário'}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-800 font-medium">
                          {session.user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/config"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-gray-700`}
                          >
                            Configurações
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                          >
                            Sair
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg
                         hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105
                         shadow-md font-medium text-sm"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                  />
                </svg>
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 