import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createAccessRequestSchema = z.object({
  courseId: z.string().uuid(),
  message: z.string().optional(),
});

export class AccessRequestController {
  async create(req: Request, res: Response) {
    try {
      const { userId } = req.user;
      const validation = createAccessRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.format() });
      }

      const { courseId, message } = validation.data;

      const existingRequest = await prisma.accessRequest.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (existingRequest) {
        return res.status(400).json({ error: 'Já existe uma solicitação para este curso' });
      }

      const accessRequest = await prisma.accessRequest.create({
        data: {
          userId,
          courseId,
          message,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              name: true,
              creatorId: true,
            },
          },
        },
      });

      return res.status(201).json(accessRequest);
    } catch (error) {
      console.error('Erro ao criar solicitação de acesso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listForCreator(req: Request, res: Response) {
    try {
      const { userId } = req.user;
      const requests = await prisma.accessRequest.findMany({
        where: {
          course: {
            creatorId: userId,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              name: true,
            },
          },
        },
      });

      return res.json(requests);
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { userId } = req.user;

      if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const accessRequest = await prisma.accessRequest.findUnique({
        where: { id },
        include: {
          course: true,
        },
      });

      if (!accessRequest) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }

      if (accessRequest.course.creatorId !== userId) {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const updatedRequest = await prisma.accessRequest.update({
        where: { id },
        data: { status },
      });

      if (status === 'APPROVED') {
        await prisma.enrollment.create({
          data: {
            userId: accessRequest.userId,
            courseId: accessRequest.courseId,
          },
        });
      }

      return res.json(updatedRequest);
    } catch (error) {
      console.error('Erro ao atualizar status da solicitação:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 