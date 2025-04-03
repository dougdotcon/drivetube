export const AbacatePayConfig = {
  API_URL: process.env.ABACATE_PAY_API_URL || 'https://api.abacatepay.com/v1',
  PUBLIC_KEY: process.env.ABACATE_PAY_PUBLIC_KEY || '',
  SECRET_KEY: process.env.ABACATE_PAY_SECRET_KEY || '',
  WEBHOOK_SECRET: process.env.ABACATE_PAY_WEBHOOK_SECRET || '',
  PLANS: {
    BASIC: {
      id: 'plan_basic',
      name: 'Básico',
      price: 19.90,
      features: [
        'Acesso a vídeos básicos',
        'Suporte por email',
        '1 usuário'
      ]
    },
    PRO: {
      id: 'plan_pro',
      name: 'Pro',
      price: 49.90,
      features: [
        'Acesso a todos os vídeos',
        'Suporte prioritário',
        '3 usuários',
        'Recursos avançados'
      ]
    },
    ENTERPRISE: {
      id: 'plan_enterprise',
      name: 'Empresarial',
      price: 99.90,
      features: [
        'Acesso ilimitado',
        'Suporte 24/7',
        'Usuários ilimitados',
        'Recursos exclusivos',
        'API dedicada'
      ]
    }
  }
}; 