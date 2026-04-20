import { clearToken, getToken, getStoredEmail } from '../token';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function handleUnauthorized() {
  if (typeof window === 'undefined') return;
  clearToken();
  window.location.href = '/sign-in';
}

interface ApiError extends Error {
  status?: number;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = getToken();
  const email = getStoredEmail();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (email) headers['X-User-Email'] = email;
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
    }
    const error = new Error() as ApiError;
    error.status = response.status;
    try {
      const body = await response.json();
      error.message = body.detail || body.message || `API Error: ${response.status}`;
    } catch {
      error.message = `Request failed: ${response.status} ${response.statusText}`;
    }
    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType?.includes('application/json')) {
    return undefined as unknown as T;
  }
  return response.json() as Promise<T>;
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export function del<T = void>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

export async function authPost<T>(
  path: '/v1/auth/login' | '/v1/auth/signup',
  body: { email: string; password: string }
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = new Error() as ApiError;
    error.status = response.status;
    try {
      const b = await response.json();
      error.message = b.detail || b.message || `Auth error: ${response.status}`;
    } catch {
      error.message = `Auth error: ${response.status}`;
    }
    throw error;
  }

  return response.json() as Promise<T>;
}
