import type { GenerateRequest, GenerateResult, ImageRecord } from '@/types';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  generate: (body: GenerateRequest) =>
    request<GenerateResult>('/api/generate', { method: 'POST', body: JSON.stringify(body) }),

  getImages: (page = 1) =>
    request<{ items: ImageRecord[]; total: number }>(`/api/images?page=${page}`),
};
