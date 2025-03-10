import { FREE_TRIAL_DAYS, FREE_VIDEOS_PER_DAY } from '../config/plans';

interface SubscriptionStatus {
    isActive: boolean;
    planId: string | null;
    trialEndsAt: Date | null;
    videosWatchedToday: number;
    lastVideoWatchDate: Date | null;
}

export class SubscriptionService {
    private static readonly API_URL = 'http://localhost:3333/api';

    public static async getSubscriptionStatus(): Promise<SubscriptionStatus> {
        try {
            const response = await fetch(`${this.API_URL}/subscriptions/status`, {
                headers: {
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao obter status da assinatura');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter status:', error);
            return this.getDefaultStatus();
        }
    }

    public static async canWatchVideo(): Promise<boolean> {
        const status = await this.getSubscriptionStatus();

        if (status.isActive) {
            return true;
        }

        if (status.trialEndsAt && new Date(status.trialEndsAt) > new Date()) {
            const today = new Date().toDateString();
            const lastWatch = status.lastVideoWatchDate?.toDateString();

            if (lastWatch !== today) {
                return true;
            }

            return status.videosWatchedToday < FREE_VIDEOS_PER_DAY;
        }

        return false;
    }

    public static async recordVideoWatch(): Promise<void> {
        try {
            await fetch(`${this.API_URL}/subscriptions/record-watch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                }
            });
        } catch (error) {
            console.error('Erro ao registrar visualização:', error);
        }
    }

    public static async activateSubscription(planId: string): Promise<void> {
        try {
            await fetch(`${this.API_URL}/subscriptions/activate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                },
                body: JSON.stringify({ planId })
            });
        } catch (error) {
            console.error('Erro ao ativar assinatura:', error);
            throw error;
        }
    }

    public static async cancelSubscription(): Promise<void> {
        try {
            await fetch(`${this.API_URL}/subscriptions/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                }
            });
        } catch (error) {
            console.error('Erro ao cancelar assinatura:', error);
            throw error;
        }
    }

    private static async getAccessToken(): Promise<string> {
        const auth = await chrome.storage.local.get('accessToken');
        return auth.accessToken;
    }

    private static getDefaultStatus(): SubscriptionStatus {
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + FREE_TRIAL_DAYS);

        return {
            isActive: false,
            planId: null,
            trialEndsAt,
            videosWatchedToday: 0,
            lastVideoWatchDate: null
        };
    }
} 