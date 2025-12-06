import { cookies } from 'next/headers';

// Use internal URL for server-side requests (Docker network), fallback to public URL
const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  revalidate?: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Server-side fetch function that automatically includes auth token from cookies
 * Use this in Server Components and Server Actions
 */
export async function serverFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, cache, revalidate } = options;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache,
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.message || 'An error occurred');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

// Re-export types from api.ts
export type {
  User,
  CreateUserDto,
  Team,
  CreateTeamDto,
  Match,
  CreateMatchDto,
  Bet,
  CreateBetDto,
  Game,
  CreateGameDto,
  MatchOdd,
  CreateMatchOddDto,
} from './api';

// Server-side API functions
export const serverAuthApi = {
  getProfile: () => serverFetch<import('./api').User>('/auth/profile'),
};

export const serverTeamsApi = {
  list: () => serverFetch<import('./api').Team[]>('/teams', { cache: 'no-store' }),
  get: (id: string) => serverFetch<import('./api').Team>(`/teams/${id}`),
};

export const serverMatchesApi = {
  list: () => serverFetch<import('./api').Match[]>('/matches', { cache: 'no-store' }),
  get: (id: string) => serverFetch<import('./api').Match>(`/matches/${id}`),
};

export const serverGamesApi = {
  list: () => serverFetch<import('./api').Game[]>('/games', { cache: 'no-store' }),
  get: (id: string) => serverFetch<import('./api').Game>(`/games/${id}`),
};

export const serverBetsApi = {
  list: () => serverFetch<import('./api').Bet[]>('/bets', { cache: 'no-store' }),
  get: (id: string) => serverFetch<import('./api').Bet>(`/bets/${id}`),
};
