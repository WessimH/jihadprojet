"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BeamsBackground } from "@/components/ui/beams-background";
import { FloatingHeader } from "@/components/ui/floating-header";
import { authApi, betsApi } from "@/lib/api";

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileData, betsData] = await Promise.all([
          authApi.getProfile(),
          betsApi.list().catch(() => []),
        ]);
        setUser(profileData as unknown as User);
        setBets(betsData as unknown as Bet[]);
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const stats = [
    { label: "Active Bets", value: String(bets.filter(b => b.status === 'PENDING').length || 0), icon: "🎯" },
    { label: "Won Bets", value: String(bets.filter(b => b.status === 'WON').length || 0), icon: "🏆" },
    { label: "Balance", value: "$150", icon: "💰" },
    { label: "Win Rate", value: bets.length > 0 ? `${Math.round((bets.filter(b => b.status === 'WON').length / bets.length) * 100)}%` : "0%", icon: "📈" },
  ];

  const recentBets = bets.length > 0 ? bets.slice(0, 3).map(bet => ({
    match: bet.match ? `${bet.match.team1?.name || 'TBD'} vs ${bet.match.team2?.name || 'TBD'}` : 'Unknown Match',
    team: bet.selectedTeam?.name || 'Unknown',
    amount: `$${bet.amount}`,
    odds: String(bet.odds),
    status: bet.status?.toLowerCase() || 'pending',
  })) : [
    {
      match: "Team Liquid vs G2",
      team: "Team Liquid",
      amount: "$25",
      odds: "1.85",
      status: "pending",
    },
    {
      match: "Fnatic vs Cloud9",
      team: "Fnatic",
      amount: "$50",
      odds: "2.10",
      status: "won",
    },
    {
      match: "T1 vs Gen.G",
      team: "T1",
      amount: "$30",
      odds: "1.65",
      status: "lost",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950">
      {/* Beams Background */}
      <div className="absolute inset-0 z-0">
        <BeamsBackground className="absolute inset-0" />
      </div>

      {/* Header */}
      <div className="relative z-50">
        <FloatingHeader />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.username} 👋
          </h1>
          <p className="text-neutral-400">
            Here&apos;s an overview of your betting activity
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="mt-4 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          >
            Logout
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-neutral-900/50 border-neutral-800">
                <CardContent className="p-6">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">🎯 Place a Bet</CardTitle>
                <CardDescription className="text-neutral-300">
                  Check ongoing matches and place your bets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/matches">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    View Matches
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">🏆 Favorite Teams</CardTitle>
                <CardDescription className="text-neutral-300">
                  Follow your favorite teams and their performances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/teams">
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    Explore Teams
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Bets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Bets</CardTitle>
              <CardDescription className="text-neutral-400">
                Your last 3 bets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBets.map((bet, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-800/50"
                  >
                    <div>
                      <p className="text-white font-medium">{bet.match}</p>
                      <p className="text-sm text-neutral-400">
                        Bet on {bet.team} • Odds {bet.odds}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{bet.amount}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          bet.status === "won"
                            ? "bg-green-500/20 text-green-400"
                            : bet.status === "lost"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {bet.status === "won"
                          ? "Won"
                          : bet.status === "lost"
                          ? "Lost"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
