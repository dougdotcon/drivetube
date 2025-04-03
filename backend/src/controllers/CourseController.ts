import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createCourseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().optional(),
});

export class CourseController {
  async create(req: Request, res: Response) {
    try {
      const { userId } = req.user;
      const validation = createCourseSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.format() });
      }

      const { name, description, price } = validation.data;

      const course = await prisma.course.create({
        data: {
          name,
          description,
          price,
          creatorId: userId,
        },
      });

      return res.status(201).json(course);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { userId } = req.user;
      const courses = await prisma.course.findMany({
        where: {
          creatorId: userId,
        },
        include: {
          _count: {
            select: {
              enrollments: true,
              accessRequests: true,
            },
          },
        },
      });

      return res.json(courses);
    } catch (error) {
      console.error('Erro ao listar cursos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const validation = createCourseSchema.partial().safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.format() });
      }

      const course = await prisma.course.findUnique({
        where: { id },
      });

      if (!course) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      if (course.creatorId !== userId) {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const updatedCourse = await prisma.course.update({
        where: { id },
        data: validation.data,
      });

      return res.json(updatedCourse);
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      const course = await prisma.course.findUnique({
        where: { id },
      });

      if (!course) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      if (course.creatorId !== userId) {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      await prisma.course.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 