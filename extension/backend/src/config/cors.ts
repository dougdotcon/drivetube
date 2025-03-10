import { FastifyCorsOptions } from '@fastify/cors'
import { config } from './server'

export const corsOptions: FastifyCorsOptions = {
  origin: config.env === 'development'
    ? true // Permite todas as origens em desenvolvimento
    : [
      'http://localhost:3000', // Frontend em desenvolvimento
      'https://mulakintola.vercel.app' // Frontend em produção
    ],
  credentials: true
} 