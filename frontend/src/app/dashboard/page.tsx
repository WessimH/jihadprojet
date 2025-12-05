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

interface User {
  sub: string;
  username: string;
  isAdmin?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:3001/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setIsLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
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
    { label: "Paris actifs", value: "3", icon: "🎯" },
    { label: "Paris gagnés", value: "12", icon: "🏆" },
    { label: "Solde", value: "150€", icon: "💰" },
    { label: "Taux de réussite", value: "67%", icon: "📈" },
  ];

  const recentBets = [
    {
      match: "Team Liquid vs G2",
      team: "Team Liquid",
      amount: "25€",
      odds: "1.85",
      status: "pending",
    },
    {
      match: "Fnatic vs Cloud9",
      team: "Fnatic",
      amount: "50€",
      odds: "2.10",
      status: "won",
    },
    {
      match: "T1 vs Gen.G",
      team: "T1",
      amount: "30€",
      odds: "1.65",
      status: "lost",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-white text-lg">Esports Betting</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-cyan-400 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/matches"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Matchs
            </Link>
            <Link
              href="/teams"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Équipes
            </Link>
            <Link
              href="/profile"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Profil
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400 text-sm hidden sm:block">
              Bonjour, <span className="text-white">{user?.username}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue, {user?.username} 👋
          </h1>
          <p className="text-neutral-400">
            Voici un aperçu de votre activité de paris
          </p>
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
                <CardTitle className="text-white">🎯 Parier maintenant</CardTitle>
                <CardDescription className="text-neutral-300">
                  Consultez les matchs en cours et placez vos paris
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/matches">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Voir les matchs
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
                <CardTitle className="text-white">🏆 Équipes favorites</CardTitle>
                <CardDescription className="text-neutral-300">
                  Suivez vos équipes préférées et leurs performances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/teams">
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    Explorer les équipes
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
              <CardTitle className="text-white">Paris récents</CardTitle>
              <CardDescription className="text-neutral-400">
                Vos 3 derniers paris
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
                        Pari sur {bet.team} • Cote {bet.odds}
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
                          ? "Gagné"
                          : bet.status === "lost"
                          ? "Perdu"
                          : "En cours"}
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
