export type CameraAngle = '45-degree' | 'top-down' | 'side-on' | 'POV';

export interface GenerateRequest {
  category: string;
  market: string;
  angle: CameraAngle;
  isGrocery?: boolean;
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
  category: string;
  market: string;
  angle: CameraAngle;
  notes: string | null;
  url_1: string;
  url_2: string;
  created_at: string;
}
