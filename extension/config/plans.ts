export interface Plan {
    id: string;
    name: string;
    price: number;
    priceUSD: number;
    features: string[];
    cryptoAddresses: {
        [key: string]: string;
    };
    stripePriceId?: string;
}

export const PLANS: Plan[] = [
    {
        id: 'basic',
        name: 'Básico',
        price: 2,
        priceUSD: 2,
        features: [
            'Acesso ilimitado a vídeos',
            'Suporte por email',
            'Atualizações de segurança'
        ],
        cryptoAddresses: {
            'BNB': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'USDT': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'BTC': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'ETH': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'QANX': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'RON': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424'
        },
        stripePriceId: 'price_basic_monthly'
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 5,
        priceUSD: 5,
        features: [
            'Tudo do plano Básico',
            'Download de vídeos',
            'Suporte prioritário',
            'Recursos avançados'
        ],
        cryptoAddresses: {
            'BNB': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'USDT': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'BTC': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'ETH': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'QANX': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'RON': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424'
        },
        stripePriceId: 'price_pro_monthly'
    },
    {
        id: 'enterprise',
        name: 'Empresarial',
        price: 10,
        priceUSD: 10,
        features: [
            'Tudo do plano Pro',
            'API dedicada',
            'Suporte 24/7',
            'Recursos personalizados',
            'Treinamento exclusivo'
        ],
        cryptoAddresses: {
            'BNB': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'USDT': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'BTC': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'ETH': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'QANX': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424',
            'RON': '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424'
        },
        stripePriceId: 'price_enterprise_monthly'
    }
];

export const FREE_TRIAL_DAYS = 30;
export const FREE_VIDEOS_PER_DAY = 1; 