import Stripe from 'stripe';
import { config } from '../config';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
});

export class StripeService {
  static async createPaymentIntent(amount: number, currency: string = 'brl') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Erro ao criar PaymentIntent:', error);
      throw error;
    }
  }

  static async createSubscription(customerId: string, priceId: string) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  static async createCustomer(email: string, name: string) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });

      return customer;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  static async retrieveSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
      throw error;
    }
  }

  static async cancelSubscription(subscriptionId: string) {
    try {
      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
      return canceledSubscription;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  }

  static async createCheckoutSession(priceId: string, customerId: string, successUrl: string, cancelUrl: string) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return session;
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      throw error;
    }
  }
} 