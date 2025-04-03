import { FastifyRequest, FastifyReply } from 'fastify';
import { AbacatePayService } from '../services/abacatepay';
import { AbacatePayConfig } from '../config/abacatepay';

const abacatePayService = new AbacatePayService();

export class AbacatePayController {
  async createSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { planId, customer } = request.body as any;

      if (!planId || !customer?.email || !customer?.name) {
        return reply.status(400).send({ message: 'Dados inválidos' });
      }

      const subscription = await abacatePayService.createSubscription(planId, customer);
      return reply.status(200).send(subscription);
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      return reply.status(500).send({ message: 'Erro ao criar assinatura' });
    }
  }

  async getSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { subscriptionId } = request.params as any;

      if (!subscriptionId) {
        return reply.status(400).send({ message: 'ID da assinatura não fornecido' });
      }

      const subscription = await abacatePayService.getSubscription(subscriptionId);
      return reply.status(200).send(subscription);
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
      return reply.status(500).send({ message: 'Erro ao buscar assinatura' });
    }
  }

  async cancelSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { subscriptionId } = request.params as any;

      if (!subscriptionId) {
        return reply.status(400).send({ message: 'ID da assinatura não fornecido' });
      }

      await abacatePayService.cancelSubscription(subscriptionId);
      return reply.status(200).send({ message: 'Assinatura cancelada com sucesso' });
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      return reply.status(500).send({ message: 'Erro ao cancelar assinatura' });
    }
  }

  async updateSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { subscriptionId } = request.params as any;
      const { planId } = request.body as any;

      if (!subscriptionId || !planId) {
        return reply.status(400).send({ message: 'Dados inválidos' });
      }

      const subscription = await abacatePayService.updateSubscription(subscriptionId, planId);
      return reply.status(200).send(subscription);
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      return reply.status(500).send({ message: 'Erro ao atualizar assinatura' });
    }
  }

  async handleWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const signature = request.headers['x-abacatepay-signature'];

      if (!signature) {
        return reply.status(400).send({ message: 'Assinatura não fornecida' });
      }

      const payload = JSON.stringify(request.body);
      const isValid = abacatePayService.verifyWebhookSignature(payload, signature as string);

      if (!isValid) {
        return reply.status(400).send({ message: 'Assinatura inválida' });
      }

      const event = request.body as any;

      switch (event.type) {
        case 'subscription.created':
          // Atualizar status da assinatura no banco de dados
          break;
        case 'subscription.updated':
          // Atualizar detalhes da assinatura
          break;
        case 'subscription.cancelled':
          // Cancelar assinatura
          break;
        case 'payment.succeeded':
          // Registrar pagamento bem-sucedido
          break;
        case 'payment.failed':
          // Registrar falha no pagamento
          break;
      }

      return reply.status(200).send({ received: true });
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return reply.status(500).send({ message: 'Erro ao processar webhook' });
    }
  }

  async getPlans(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send(AbacatePayConfig.PLANS);
  }
} 