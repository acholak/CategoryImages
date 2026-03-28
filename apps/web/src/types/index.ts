export type CameraAngle = '45-degree' | 'top-down' | 'side-on' | 'POV';

export interface GenerateRequest {
  category: string;
  market: string;
  angle: CameraAngle;
  keyTexture?: string;
  notes?: string;
}

export interface GeneratedImage {
  id: number;
  url: string;
}

export interface GenerateResult {
  category: string;
  market: string;
  images: GeneratedImage[];
}

export interface ImageRecord {
  id: string;
  userId: string;
  category: string;
  market: string;
  angle: CameraAngle;
  figmaUrl: string;
  createdAt: string;
}
