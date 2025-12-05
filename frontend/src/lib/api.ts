const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new ApiError(response.status, error.message || 'An error occurred');
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network error or other fetch error
    console.error('API Error:', err);
    throw new ApiError(0, 'Connection error. Please check if the server is running.');
  }
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    fetchApi<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),
  
  getProfile: () =>
    fetchApi<User>('/auth/profile'),
  
  healthCheck: () =>
    fetchApi<{ status: string }>('/auth/health'),
};

// Users API
export const usersApi = {
  create: (data: CreateUserDto) =>
    fetchApi<User>('/users', {
      method: 'POST',
      body: data,
    }),
  
  list: () =>
    fetchApi<User[]>('/users'),
  
  get: (id: string) =>
    fetchApi<User>(`/users/${id}`),
  
  update: (id: string, data: Partial<User>) =>
    fetchApi<User>(`/users/${id}`, {
      method: 'PATCH',
      body: data,
    }),
  
  delete: (id: string) =>
    fetchApi<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Teams API
export const teamsApi = {
  create: (data: CreateTeamDto) =>
    fetchApi<Team>('/teams', {
      method: 'POST',
      body: data,
    }),
  
  list: () =>
    fetchApi<Team[]>('/teams'),
  
  get: (id: string) =>
    fetchApi<Team>(`/teams/${id}`),
  
  update: (id: string, data: Partial<Team>) =>
    fetchApi<Team>(`/teams/${id}`, {
      method: 'PATCH',
      body: data,
    }),
  
  delete: (id: string) =>
    fetchApi<void>(`/teams/${id}`, {
      method: 'DELETE',
    }),
};

// Matches API
export const matchesApi = {
  create: (data: CreateMatchDto) =>
    fetchApi<Match>('/matches', {
      method: 'POST',
      body: data,
    }),
  
  list: () =>
    fetchApi<Match[]>('/matches'),
  
  get: (id: string) =>
    fetchApi<Match>(`/matches/${id}`),
  
  update: (id: string, data: Partial<Match>) =>
    fetchApi<Match>(`/matches/${id}`, {
      method: 'PATCH',
      body: data,
    }),
  
  delete: (id: string) =>
    fetchApi<void>(`/matches/${id}`, {
      method: 'DELETE',
    }),
};

// Bets API
export const betsApi = {
  place: (data: CreateBetDto) =>
    fetchApi<Bet>('/bets', {
      method: 'POST',
      body: data,
    }),
  
  list: () =>
    fetchApi<Bet[]>('/bets'),
  
  get: (id: string) =>
    fetchApi<Bet>(`/bets/${id}`),
  
  update: (id: string, data: Partial<Bet>) =>
    fetchApi<Bet>(`/bets/${id}`, {
      method: 'PATCH',
      body: data,
    }),
  
  delete: (id: string) =>
    fetchApi<void>(`/bets/${id}`, {
      method: 'DELETE',
    }),
};

// Games API
export const gamesApi = {
  create: (data: CreateGameDto) =>
    fetchApi<Game>('/games', {
      method: 'POST',
      body: data,
    }),
  
  list: () =>
    fetchApi<Game[]>('/games'),
  
  get: (id: string) =>
    fetchApi<Game>(`/games/${id}`),
  
  update: (id: string, data: Partial<Game>) =>
    fetchApi<Game>(`/games/${id}`, {
      method: 'PATCH',
      body: data,
    }),
  
  delete: (id: string) =>
    fetchApi<void>(`/games/${id}`, {
      method: 'DELETE',
    }),
};

// Match Odds API
export const matchOddsApi = {
  create: (data: CreateMatchOddDto) =>
    fetchApi<MatchOdd>('/match-odds', {
      method: 'POST',
      body: data,
    }),
  
  list: () =>
    fetchApi<MatchOdd[]>('/match-odds'),
  
  get: (id: string) =>
    fetchApi<MatchOdd>(`/match-odds/${id}`),
  
  update: (id: string, data: Partial<MatchOdd>) =>
    fetchApi<MatchOdd>(`/match-odds/${id}`, {
      method: 'PATCH',
      body: data,
    }),
  
  delete: (id: string) =>
    fetchApi<void>(`/match-odds/${id}`, {
      method: 'DELETE',
    }),
};

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  balance?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  username: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logoUrl?: string;
  region?: string;
  createdAt?: string;
}

export interface CreateTeamDto {
  name: string;
  tag: string;
  logoUrl?: string;
  region?: string;
}

export interface Match {
  id: string;
  teamAId: string;
  teamBId: string;
  teamA?: Team;
  teamB?: Team;
  gameId: string;
  game?: Game;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
  scoreA?: number;
  scoreB?: number;
  odds?: MatchOdd[];
  createdAt?: string;
}

export interface CreateMatchDto {
  teamAId: string;
  teamBId: string;
  gameId: string;
  startTime: string;
  status?: 'upcoming' | 'live' | 'finished';
}

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  match?: Match;
  amount: number;
  prediction: 'teamA' | 'teamB' | 'draw';
  odds: number;
  status: 'pending' | 'won' | 'lost';
  potentialWin: number;
  createdAt?: string;
}

export interface CreateBetDto {
  matchId: string;
  amount: number;
  prediction: 'teamA' | 'teamB' | 'draw';
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface CreateGameDto {
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface MatchOdd {
  id: string;
  matchId: string;
  teamAOdds: number;
  teamBOdds: number;
  drawOdds?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMatchOddDto {
  matchId: string;
  teamAOdds: number;
  teamBOdds: number;
  drawOdds?: number;
}
