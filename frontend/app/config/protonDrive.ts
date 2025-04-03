export const PROTON_DRIVE_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_PROTON_DRIVE_API_URL || 'https://api.proton.me/drive/v1',
  MAX_UPLOAD_SIZE: 1024 * 1024 * 100, // 100MB
  SUPPORTED_FILE_TYPES: [
    'image/*',
    'video/*',
    'audio/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
  ],
  FOLDER_ICON_COLOR: '#4f46e5',
  FILE_ICON_COLOR: '#6b7280',
  REFRESH_INTERVAL: 30000, // 30 segundos
  MAX_RETRY_ATTEMPTS: 3,
  TIMEOUT: 30000, // 30 segundos
  CHUNK_SIZE: 1024 * 1024 * 5, // 5MB para upload em chunks
}; 