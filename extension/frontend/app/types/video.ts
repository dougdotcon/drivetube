export interface Video {
  id: string
  userId: string
  name: string
  driveId: string
  folder: string | null
  mimeType: string
  thumbnailLink?: string
  webViewLink?: string
  webContentLink?: string
  size: string
  createdAt: Date
  updatedAt: Date
}

export interface VideoCreateData {
  name: string
  driveId: string
  folder: string | null
  mimeType: string
  thumbnailLink?: string
  webViewLink?: string
  webContentLink?: string
  size: string
}

export interface VideoUpdateData {
  name?: string
  folder?: string | null
  thumbnailLink?: string
  webViewLink?: string
  webContentLink?: string
} 