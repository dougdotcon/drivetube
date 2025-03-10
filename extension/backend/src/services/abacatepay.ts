import axios from 'axios';
import { AbacatePayConfig } from '../config/abacatepay';

export interface AbacatePaySubscription {
  id: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  plan: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface AbacatePayPayment {
  id: string;
  status: 'pending' | 'succeeded' | 'failed';
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export class AbacatePayService {
  private readonly apiUrl: string;
  private readonly publicKey: string;
  private readonly secretKey: string;

  constructor() {
    this.apiUrl = AbacatePayConfig.API_URL;
    this.publicKey = AbacatePayConfig.PUBLIC_KEY;
    this.secretKey = AbacatePayConfig.SECRET_KEY;
  }

  async createSubscription(planId: string, customer: { email: string; name: string }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/subscriptions`,
        {
          plan_id: planId,
          customer,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  async getSubscription(subscriptionId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/subscriptions/${subscriptionId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId: string, planId: string) {
    try {
      const response = await axios.patch(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          plan_id: planId,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      throw error;
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Implementar verificação da assinatura do webhook
    return true;
  }
} 