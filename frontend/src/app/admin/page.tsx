import { serverAuthApi, serverTeamsApi, serverGamesApi, ApiError } from "@/lib/server-api";
import { redirect } from "next/navigation";
import { AdminClient } from "./admin-client";

interface User {
  sub: string;
  username: string;
  isAdmin?: boolean;
}

interface Team {
  id: string;
  name: string;
  tag: string;
}

interface Game {
  id: string;
  name: string;
}

async function getAdminData() {
  try {
    const user = await serverAuthApi.getProfile();
    const typedUser = user as unknown as User;
    
    // Check if user is admin
    if (!typedUser.isAdmin) {
      return { authorized: false };
    }

    const [teams, games] = await Promise.all([
      serverTeamsApi.list().catch(() => []),
      serverGamesApi.list().catch(() => []),
    ]);

    return {
      authorized: true,
      user: typedUser,
      teams: teams as unknown as Team[],
      games: games as unknown as Game[],
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { authorized: false };
    }
    throw error;
  }
}

export default async function AdminPage() {
  const data = await getAdminData();

  if (!data.authorized) {
    redirect('/dashboard');
  }

  return (
    <AdminClient 
      user={data.user!} 
      teams={data.teams || []} 
      games={data.games || []} 
    />
  );
}
