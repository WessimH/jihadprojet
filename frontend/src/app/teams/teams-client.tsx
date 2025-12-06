"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BeamsBackground } from "@/components/ui/beams-background";
import { FloatingHeader } from "@/components/ui/floating-header";

interface Team {
  id: string;
  name: string;
  tag: string;
  region?: string;
  winRate?: number;
}

interface TeamsClientProps {
  teams: Team[];
}

export function TeamsClient({ teams }: TeamsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Demo data if no teams
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

        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-400">No teams found</p>
          </div>
        )}
      </main>
    </div>
  );
}
