'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function PlanosPage() {
  const { data: session } = useSession()
  const [periodo, setPeriodo] = useState<'mensal' | 'anual'>('mensal')

  const planos = [
    {
      nome: 'Básico',
      preco: periodo === 'mensal' ? 29.90 : 299.90,
      descricao: 'Perfeito para começar',
      recursos: [
        'Acesso a todos os vídeos',
        'Visualização em HD',
        'Suporte por email',
        'Acesso pelo computador e celular'
      ],
      destaque: false
    },
    {
      nome: 'Premium',
      preco: periodo === 'mensal' ? 49.90 : 499.90,
      descricao: 'Para quem quer mais',
      recursos: [
        'Todos os recursos do plano Básico',
        'Visualização em Full HD',
        'Download de vídeos',
        'Suporte prioritário',
        'Acesso antecipado a novos cursos'
      ],
      destaque: true
    },
    {
      nome: 'Empresarial',
      preco: periodo === 'mensal' ? 99.90 : 999.90,
      descricao: 'Ideal para equipes',
      recursos: [
        'Todos os recursos do plano Premium',
        'Visualização em 4K',
        'Múltiplos usuários',
        'Relatórios de progresso',
        'Treinamento personalizado',
        'Suporte 24/7'
      ],
      destaque: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Todos os planos incluem acesso ilimitado à nossa biblioteca de vídeos e cursos
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setPeriodo('mensal')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                periodo === 'mensal'
                  ? 'bg-yellow-400 text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriodo('anual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                periodo === 'anual'
                  ? 'bg-yellow-400 text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Anual
              <span className="ml-1 text-xs text-yellow-600">
                (2 meses grátis)
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {planos.map((plano) => (
            <div
              key={plano.nome}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                plano.destaque ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {plano.destaque && (
                <div className="bg-yellow-400 text-gray-800 text-center py-2 text-sm font-medium">
                  Mais Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plano.nome}
                </h3>
                <p className="text-gray-600 mb-6">{plano.descricao}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {plano.preco.toFixed(2)}
                  </span>
                  <span className="text-gray-600">/{periodo === 'mensal' ? 'mês' : 'ano'}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plano.recursos.map((recurso) => (
                    <li key={recurso} className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 text-yellow-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {recurso}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                    plano.destaque
                      ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Começar agora
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ainda com dúvidas?
          </h2>
          <p className="text-gray-600 mb-8">
            Entre em contato conosco e tire todas as suas dúvidas sobre nossos planos
          </p>
          <a
            href="mailto:contato@mulakintola.com"
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            contato@mulakintola.com
          </a>
        </div>
      </div>
    </div>
  )
} 