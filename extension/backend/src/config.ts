import dotenv from 'dotenv'

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config()

export const config = {
  port: process.env.PORT || 3333,
  host: process.env.HOST || 'localhost',
  database: {
    url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/mulakintola'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_aqui',
    expiresIn: '1d'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3333/auth/google/callback',
    driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || ''
  }
} 