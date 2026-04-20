import { authPost, get } from './client';
import { clearToken } from '../token';
import type { AuthResponse } from '@thesis-ai/api-types';

export type { AuthResponse };

export function signIn(email: string, password: string): Promise<AuthResponse> {
  return authPost<AuthResponse>('/v1/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  });
}

export function signUp(email: string, password: string): Promise<AuthResponse> {
  return authPost<AuthResponse>('/v1/auth/signup', {
    email: email.trim().toLowerCase(),
    password,
  });
}

export function getMe(): Promise<{ id: string; email: string; created_at: string }> {
  return get('/v1/auth/me');
}

/** Clear stored credentials and redirect to sign-in. */
export function signOut(): void {
  clearToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in';
  }
}
