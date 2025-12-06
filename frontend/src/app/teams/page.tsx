import { serverTeamsApi, serverAuthApi, ApiError } from "@/lib/server-api";
import { TeamsClient } from "./teams-client";

interface Team {
  id: string;
  name: string;
  tag: string;
  region?: string;
  winRate?: number;
}

interface User {
  username: string;
}

async function getTeamsData() {
  try {
    const teams = await serverTeamsApi.list();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return teams.map((team: any) => ({
      id: String(team.id || ''),
      name: team.name || 'Unknown Team',
      tag: team.tag || 'UNK',
      region: team.region,
      winRate: team.winRate,
    })) as Team[];
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    console.error('Failed to fetch teams:', error);
    return [];
  }
}

async function getAuthData() {
  try {
    const user = await serverAuthApi.getProfile();
    return user as unknown as User;
  } catch {
    return null;
  }
}

export default async function TeamsPage() {
  const [teams, user] = await Promise.all([
    getTeamsData(),
    getAuthData(),
  ]);
  
  if (teams === null) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  return <TeamsClient teams={teams} isAuthenticated={!!user} username={user?.username} />;
}
