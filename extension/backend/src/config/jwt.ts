import { FastifyJWTOptions } from '@fastify/jwt'
import { config } from './server'

export const jwtOptions: FastifyJWTOptions = {
  secret: config.jwt.secret,
  sign: {
    expiresIn: '7d' // Token expira em 7 dias
  }
} 