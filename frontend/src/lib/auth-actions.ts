'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Use internal URL for server-side requests (Docker network), fallback to public URL
const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function loginAction(
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Invalid credentials' }));
      return { success: false, error: error.message || 'Invalid credentials' };
    }

    const data = await response.json();
    
    if (data.access_token) {
      const cookieStore = await cookies();
      cookieStore.set('token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      
      return { success: true };
    }

    return { success: false, error: 'Invalid response from server' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Connection error. Please try again.' };
  }
}

export async function signupAction(
  username: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      return { success: false, error: error.message || 'Registration failed' };
    }

    // Auto-login after signup
    return await loginAction(username, password);
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Connection error. Please try again.' };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (token) {
    // Call backend to invalidate session
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore errors, we'll delete the cookie anyway
    }
  }
  
  cookieStore.delete('token');
  redirect('/login');
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
}
