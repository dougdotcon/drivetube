import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string
      name: string
      email: string
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      name: string
      email: string
    }
  }
} 