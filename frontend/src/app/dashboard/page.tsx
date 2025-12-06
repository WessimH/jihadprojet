import { serverAuthApi, serverBetsApi, ApiError } from "@/lib/server-api";
import { DashboardClient } from "./dashboard-client";

interface User {
  sub: string;
  username: string;
  email?: string;
  isAdmin?: boolean;
}

interface Bet {
  id: string;
  match?: { team1?: { name: string }; team2?: { name: string } };
  amount: number;
  odds: number;
  status: string;
  selectedTeam?: { name: string };
}

async function getDashboardData() {
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

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  // Middleware handles redirect, but this is a fallback
  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  return <DashboardClient user={data.user} bets={data.bets} />;
}
