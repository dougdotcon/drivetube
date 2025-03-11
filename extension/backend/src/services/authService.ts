import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const prisma = new PrismaClient();

export class AuthService {
  static async register(name: string, email: string, password: string) {
    try {
      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        }
      });

      // Gerar token
      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token
      };
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          subscription: true
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Senha incorreta');
      }

      // Gerar token
      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          subscription: user.subscription
        },
        token
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          subscription: true
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          subscription: user.subscription
        }
      };
    } catch (error) {
      console.error('Erro na validação do token:', error);
      throw error;
    }
  }

  private static generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }
} 