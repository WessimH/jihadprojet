'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function createMatchAction(data: {
  team1_id: string;
  team2_id: string;
  game_id: string;
  match_date: string;
  status?: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    // For now, we'll create a simple match without tournament
    // The backend may need to handle this
    const response = await fetch(`${API_URL}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        tournament_id: '00000000-0000-0000-0000-000000000001', // Default tournament
        status: data.status || 'SCHEDULED',
        format: 'BO3',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || 'Failed to create match' };
    }

    const match = await response.json();
    return { success: true, match };
  } catch (error) {
    console.error('Create match error:', error);
    return { success: false, error: 'Network error' };
  }
}
