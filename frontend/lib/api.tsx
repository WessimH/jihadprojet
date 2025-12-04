export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export function setToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('jwt', token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt');
}

async function authFetch(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
  const body = await res.json().catch(() => ({} as Record<string, unknown>));
  const maybeMessage = (body && (body as Record<string, unknown>)['message']) || res.statusText || 'Request failed';
  const err = new Error(String(maybeMessage)) as Error & { status?: number; body?: unknown };
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json().catch(() => null);
}

export async function loginApi(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body?.message || 'Login failed'), { status: res.status, body });
  }
  return res.json();
}

export async function getMatches() {
  return authFetch('/matches');
}

export async function getTeams() {
  return authFetch('/teams');
}

export async function getProfile() {
  return authFetch('/auth/profile');
}
