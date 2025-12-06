import { serverMatchesApi, ApiError } from "@/lib/server-api";
import { MatchesClient } from "./matches-client";

interface Team {
  id: string;
  name: string;
  tag: string;
}

interface Match {
  id: string;
  team1: Team;
  team2: Team;
  game: { name: string };
  matchDate: string;
  status: string;
  team1Score?: number;
  team2Score?: number;
}

async function getMatchesData() {
  try {
    const data = await serverMatchesApi.list();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((match: any) => ({
      id: String(match.id || ''),
      team1: match.team1 || { id: '', name: 'TBD', tag: 'TBD' },
      team2: match.team2 || { id: '', name: 'TBD', tag: 'TBD' },
      game: match.game || { name: 'Unknown' },
      matchDate: String(match.matchDate || match.startDate || new Date().toISOString()),
      status: String(match.status || 'UPCOMING'),
      team1Score: match.team1Score,
      team2Score: match.team2Score,
    })) as Match[];
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    console.error('Failed to fetch matches:', error);
    return [];
  }
}

export default async function MatchesPage() {
  const matches = await getMatchesData();
  
  if (matches === null) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  return <MatchesClient matches={matches} />;
}
