import { google } from 'googleapis'
import { config } from '../config'

// Configuração do OAuth2
export const oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
)

// Configuração do Drive
export const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
})

// Escopos necessários
export const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.readonly'
]

// Gera a URL de autorização
export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  })
} 