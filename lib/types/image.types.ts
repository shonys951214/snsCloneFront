// 이미지 관련 타입 정의

export interface Image {
  id: number;
  userId: number;
  url: string;
  originalName: string | null;
  size: number | null;
  mimeType: string | null;
  createdAt: Date;
}

export interface UploadImageResponse {
  id: number;
  userId: number;
  url: string;
  originalName: string | null;
  size: number | null;
  mimeType: string | null;
  createdAt: Date;
}

