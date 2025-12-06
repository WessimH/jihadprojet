import { serverAuthApi, serverBetsApi, ApiError } from "@/lib/server-api";
import { ProfileClient } from "./profile-client";

interface User {
  id: string;
  username: string;
  email: string;
  balance?: number;
  createdAt?: string;
}

interface Bet {
  id: string;
  match?: { team1?: { name: string }; team2?: { name: string } };
  amount: number;
  odds: number;
  status: string;
  profit?: number;
}

async function getProfileData() {
  try {
    const [user, bets] = await Promise.all([
      serverAuthApi.getProfile(),
      serverBetsApi.list().catch(() => []),
    ]);
    return { user: user as unknown as User, bets: bets as unknown as Bet[] };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export default async function ProfilePage() {
  const data = await getProfileData();
  
  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  return <ProfileClient user={data.user} bets={data.bets} />;
}
