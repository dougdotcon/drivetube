import { FastifyInstance } from 'fastify'
import prisma from '../config/prisma'
import { createSubscriptionSchema, updateSubscriptionSchema } from '../types/subscription'
import { CryptoPaymentService } from '../services/CryptoPaymentService'

export async function subscriptionRoutes(app: FastifyInstance) {
  // Middleware para verificar autenticação
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      return reply.code(401).send({
        error: 'Não autorizado'
      })
    }
  })

  // Rota para obter a assinatura do usuário atual
  app.get('/me', async (request, reply) => {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: {
          userId: request.user.id
        },
        include: {
          plan: true,
          payments: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 5
          }
        }
      })

      if (!subscription) {
        return reply.code(404).send({
          error: 'Assinatura não encontrada'
        })
      }

      return reply.send(subscription)
    } catch (error: any) {
      return reply.code(500).send({
        error: error.message || 'Erro ao buscar assinatura'
      })
    }
  })

  // Rota para criar uma assinatura
  app.post('/', async (request, reply) => {
    try {
      const data = createSubscriptionSchema.parse(request.body)

      // Verificar se o plano existe
      const plan = await prisma.plan.findUnique({
        where: { id: data.planId }
      })

      if (!plan || !plan.isActive) {
        return reply.code(404).send({
          error: 'Plano não encontrado ou inativo'
        })
      }

      // Verificar se o usuário já tem uma assinatura
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId: request.user.id }
      })

      if (existingSubscription) {
        return reply.code(400).send({
          error: 'Usuário já possui uma assinatura ativa'
        })
      }

      // Calcular data de término com base no intervalo do plano
      let endDate = new Date(data.startDate)
      if (plan.interval === 'month') {
        endDate.setMonth(endDate.getMonth() + 1)
      } else if (plan.interval === 'year') {
        endDate.setFullYear(endDate.getFullYear() + 1)
      }

      // Criar a assinatura
      const subscription = await prisma.subscription.create({
        data: {
          ...data,
          userId: request.user.id,
          endDate
        },
        include: {
          plan: true
        }
      })

      // Gerar pagamento crypto usando TANOS
      const cryptoService = new CryptoPaymentService()
      const cryptoData = await cryptoService.generateCryptoPayment({
        amount: plan.price,
        description: `Assinatura ${plan.name} - DriveTube`,
        expirationMinutes: 1440, // 24 horas
        payerName: request.user.name,
        payerEmail: request.user.email,
        currency: 'USDT',
        network: 'BEP20' // Padrão BEP20, mas pode ser alterado
      })

      // Criar um pagamento pendente
      const payment = await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: plan.price,
          paymentMethod: 'crypto',
          status: 'pending',
          pixCode: cryptoData.walletAddress, // Reutilizar campo para wallet address
          pixExpiration: cryptoData.expiresAt,
          txId: cryptoData.txId
        }
      })

      return reply.code(201).send({
        subscription,
        payment: {
          ...payment,
          walletAddress: cryptoData.walletAddress,
          qrCode: cryptoData.qrCode,
          expectedAmount: cryptoData.expectedAmount,
          currency: cryptoData.currency,
          network: cryptoData.network,
          tanosSession: cryptoData.tanosSession
        }
      })
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao criar assinatura'
      })
    }
  })

  // Rota para atualizar uma assinatura
  app.put('/me', async (request, reply) => {
    try {
      const data = updateSubscriptionSchema.parse(request.body)

      // Buscar a assinatura do usuário
      const subscription = await prisma.subscription.findUnique({
        where: { userId: request.user.id }
      })

      if (!subscription) {
        return reply.code(404).send({
          error: 'Assinatura não encontrada'
        })
      }

      // Atualizar a assinatura
      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data,
        include: {
          plan: true
        }
      })

      return reply.send(updatedSubscription)
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao atualizar assinatura'
      })
    }
  })

  // Rota para cancelar uma assinatura
  app.post('/me/cancel', async (request, reply) => {
    try {
      // Buscar a assinatura do usuário
      const subscription = await prisma.subscription.findUnique({
        where: { userId: request.user.id }
      })

      if (!subscription) {
        return reply.code(404).send({
          error: 'Assinatura não encontrada'
        })
      }

      // Cancelar a assinatura
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'canceled'
        }
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(500).send({
        error: error.message || 'Erro ao cancelar assinatura'
      })
    }
  })

  // Rota para processar pagamentos (simulado)
  app.post('/payments/:id/process', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      // Buscar o pagamento
      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          subscription: true
        }
      })

      if (!payment) {
        return reply.code(404).send({
          error: 'Pagamento não encontrado'
        })
      }

      // Verificar se o pagamento pertence ao usuário
      if (payment.subscription.userId !== request.user.id) {
        return reply.code(403).send({
          error: 'Acesso não autorizado'
        })
      }

      // Atualizar o status do pagamento
      await prisma.payment.update({
        where: { id },
        data: {
          status: 'completed'
        }
      })

      // Atualizar a assinatura
      await prisma.subscription.update({
        where: { id: payment.subscription.id },
        data: {
          status: 'active',
          lastPaymentId: id
        }
      })

      return reply.send({ message: 'Pagamento processado com sucesso' })
    } catch (error: any) {
      return reply.code(500).send({
        error: error.message || 'Erro ao processar pagamento'
      })
    }
  })

  // Rota para verificar se o usuário tem acesso premium
  app.get('/check-access', async (request, reply) => {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: request.user.id }
      })

      const hasAccess = subscription?.status === 'active' &&
                        subscription.endDate > new Date()

      return reply.send({ hasAccess })
    } catch (error: any) {
      return reply.code(500).send({
        error: error.message || 'Erro ao verificar acesso'
      })
    }
  })
}
