export interface DriveVideo {
  id: string;
  name: string;
  mimeType: string;
  folder: string | null;
  thumbnailLink?: string;
  webViewLink: string;
  webContentLink?: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  description?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  files: DriveVideo[];
  subfolders: DriveFolder[];
} 