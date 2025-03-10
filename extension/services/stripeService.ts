import { Plan } from '../config/plans';

export class StripeService {
    private static readonly STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
    private static readonly API_URL = 'http://localhost:3333/api';

    public static async createCheckoutSession(plan: Plan): Promise<string> {
        try {
            const response = await fetch(`${this.API_URL}/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                },
                body: JSON.stringify({
                    priceId: plan.stripePriceId,
                    userId: await this.getCurrentUserId()
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar sessão de checkout');
            }

            const { sessionId } = await response.json();
            return sessionId;
        } catch (error) {
            console.error('Erro no checkout:', error);
            throw error;
        }
    }

    public static async handleWebhook(event: any): Promise<void> {
        try {
            const response = await fetch(`${this.API_URL}/stripe/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                throw new Error('Erro ao processar webhook');
            }
        } catch (error) {
            console.error('Erro no webhook:', error);
            throw error;
        }
    }

    private static async getCurrentUserId(): Promise<string> {
        const auth = await chrome.storage.local.get('userId');
        return auth.userId;
    }

    private static async getAccessToken(): Promise<string> {
        const auth = await chrome.storage.local.get('accessToken');
        return auth.accessToken;
    }
} 