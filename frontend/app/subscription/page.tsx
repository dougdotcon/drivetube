'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 2,
    features: [
      'Acesso ilimitado a vídeos',
      'Suporte por email',
      'Atualizações de segurança'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5,
    features: [
      'Tudo do plano Básico',
      'Download de vídeos',
      'Suporte prioritário',
      'Recursos avançados'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 10,
    features: [
      'Tudo do plano Pro',
      'API dedicada',
      'Suporte 24/7',
      'Recursos personalizados',
      'Treinamento exclusivo'
    ]
  }
];

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  const handleStripePayment = async (planId: string) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Erro no pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  const handleCryptoPayment = (planId: string) => {
    setCurrentPlan(planId);
    setShowCryptoModal(true);
  };

  const verifyCryptoPayment = async () => {
    const hash = (document.getElementById('transactionHash') as HTMLInputElement).value;
    const currency = (document.getElementById('cryptoCurrency') as HTMLSelectElement).value;

    if (!hash) {
      alert('Por favor, insira o hash da transação');
      return;
    }

    try {
      const response = await fetch('/api/verify-crypto-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: currentPlan,
          hash,
          currency,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Pagamento verificado com sucesso!');
        setShowCryptoModal(false);
      } else {
        alert('Erro na verificação do pagamento. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
      alert('Erro ao verificar pagamento. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Desbloqueie todo o potencial do Mulakintola
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
                plan.popular ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="px-6 py-8 relative">
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">/mês</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-4">
                  <button
                    onClick={() => handleStripePayment(plan.id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Assinar com Cartão
                  </button>
                  <button
                    onClick={() => handleCryptoPayment(plan.id)}
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Pagar com Crypto
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCryptoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pagamento com Criptomoeda
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selecione a moeda
                </label>
                <select
                  id="cryptoCurrency"
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="BNB">BNB</option>
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="QANX">QANX</option>
                  <option value="RON">RON</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hash da Transação
                </label>
                <input
                  type="text"
                  id="transactionHash"
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Cole o hash da sua transação"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCryptoModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={verifyCryptoPayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Verificar Pagamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 