export interface DriveVideo {
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

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  webViewLink?: string
  webContentLink?: string
  size: string
  parents?: string[]
} 