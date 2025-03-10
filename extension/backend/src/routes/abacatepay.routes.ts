import { FastifyInstance } from 'fastify';
import { AbacatePayController } from '../controllers/abacatepay.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const controller = new AbacatePayController();

export default async function abacatePayRoutes(app: FastifyInstance) {
  // Rotas públicas
  app.get('/plans', controller.getPlans);

  // Rotas protegidas
  app.post('/subscriptions', { preHandler: authMiddleware }, controller.createSubscription);
  app.get('/subscriptions/:subscriptionId', { preHandler: authMiddleware }, controller.getSubscription);
  app.post('/subscriptions/:subscriptionId/cancel', { preHandler: authMiddleware }, controller.cancelSubscription);
  app.patch('/subscriptions/:subscriptionId', { preHandler: authMiddleware }, controller.updateSubscription);

  // Webhook
  app.post('/webhook', controller.handleWebhook);
} 