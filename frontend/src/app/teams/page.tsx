"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { teamsApi } from "@/lib/api";

interface Team {
  id: string;
  name: string;
  tag: string;
  region?: string;
  winRate?: number;
}

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTeams = async () => {
      try {
        const data = await teamsApi.list();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedTeams: Team[] = data.map((team: any) => ({
          id: String(team.id || ''),
          name: team.name || 'Unknown Team',
          tag: team.tag || 'UNK',
          region: team.region,
          winRate: team.winRate,
        }));
        setTeams(formattedTeams);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Demo data si pas d'équipes
  const demoTeams: Team[] = [
    { id: "1", name: "Team Liquid", tag: "TL", region: "NA", winRate: 72 },
    { id: "2", name: "G2 Esports", tag: "G2", region: "EU", winRate: 68 },
    { id: "3", name: "Fnatic", tag: "FNC", region: "EU", winRate: 65 },
    { id: "4", name: "Cloud9", tag: "C9", region: "NA", winRate: 61 },
    { id: "5", name: "T1", tag: "T1", region: "KR", winRate: 78 },
    { id: "6", name: "Gen.G", tag: "GEN", region: "KR", winRate: 75 },
    { id: "7", name: "NaVi", tag: "NAVI", region: "EU", winRate: 70 },
    { id: "8", name: "FaZe Clan", tag: "FAZE", region: "EU", winRate: 67 },
  ];

  const displayTeams = teams.length > 0 ? teams : demoTeams;

  const filteredTeams = displayTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRegionFlag = (region?: string) => {
    switch (region) {
      case "NA":
        return "🇺🇸";
      case "EU":
        return "🇪🇺";
      case "KR":
        return "🇰🇷";
      case "CN":
        return "🇨🇳";
      default:
        return "🌍";
    }
  };

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
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/matches"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Matches
            </Link>
            <Link href="/teams" className="text-cyan-400 font-medium">
              Teams
            </Link>
            <Link
              href="/profile"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Profile
            </Link>
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Teams 🏆</h1>
          <p className="text-neutral-400">
            Discover esports teams and their statistics
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Search for a team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-neutral-900/50 border-neutral-800 hover:border-cyan-500/50 transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        🏆
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {team.name}
                        </h3>
                        <p className="text-neutral-500 text-sm">{team.tag}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{getRegionFlag(team.region)}</span>
                        <span className="text-neutral-400">
                          {team.region || "International"}
                        </span>
                      </div>
                      {team.winRate && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-medium ${
                              team.winRate >= 70
                                ? "text-green-400"
                                : team.winRate >= 50
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {team.winRate}%
                          </span>
                          <span className="text-neutral-500">WR</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        View matches →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredTeams.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-neutral-400">No teams found</p>
          </div>
        )}
      </main>
    </div>
  );
}
