'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface BetResult {
  success: boolean;
  error?: string;
  bet?: {
    id: string;
    amount: number;
    odds: number;
  };
}

export async function placeBetAction(
  matchId: string,
  teamId: string,
  amount: number,
  odds: number
): Promise<BetResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, error: 'You must be logged in to place a bet' };
    }

    const response = await fetch(`${API_BASE_URL}/bets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        matchId,
        selectedTeamId: teamId,
        amount,
        odds,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to place bet' }));
      return { success: false, error: error.message || 'Failed to place bet' };
    }

    const bet = await response.json();
    
    // Revalidate pages that show bets
    revalidatePath('/dashboard');
    revalidatePath('/matches');
    revalidatePath('/profile');

    return { success: true, bet };
  } catch (error) {
    console.error('Bet error:', error);
    return { success: false, error: 'Connection error. Please try again.' };
  }
}

export async function getUserBets() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/bets/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch {
    return [];
  }
}
