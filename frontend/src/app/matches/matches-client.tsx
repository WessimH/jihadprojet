"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BeamsBackground } from "@/components/ui/beams-background";
import { FloatingHeader } from "@/components/ui/floating-header";

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

interface MatchesClientProps {
  matches: Match[];
}

export function MatchesClient({ matches }: MatchesClientProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "finished">(
    "all"
  );

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return match.status === "UPCOMING";
    if (filter === "live") return match.status === "LIVE";
    if (filter === "finished") return match.status === "FINISHED";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LIVE":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 animate-pulse">
            🔴 LIVE
          </span>
        );
      case "UPCOMING":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
            ⏰ Upcoming
          </span>
        );
      case "FINISHED":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-neutral-500/20 text-neutral-400">
            ✓ Finished
          </span>
        );
      default:
        return null;
    }
  };

  // Demo data if no matches
  const demoMatches: Match[] = [
    {
      id: "1",
      team1: { id: "1", name: "Team Liquid", tag: "TL" },
      team2: { id: "2", name: "G2 Esports", tag: "G2" },
      game: { name: "League of Legends" },
      matchDate: "2025-12-06T15:00:00.000Z",
      status: "UPCOMING",
    },
    {
      id: "2",
      team1: { id: "3", name: "Fnatic", tag: "FNC" },
      team2: { id: "4", name: "Cloud9", tag: "C9" },
      game: { name: "CS2" },
      matchDate: "2025-12-05T14:00:00.000Z",
      status: "LIVE",
      team1Score: 12,
      team2Score: 10,
    },
    {
      id: "3",
      team1: { id: "5", name: "T1", tag: "T1" },
      team2: { id: "6", name: "Gen.G", tag: "GEN" },
      game: { name: "League of Legends" },
      matchDate: "2025-12-05T10:00:00.000Z",
      status: "FINISHED",
      team1Score: 3,
      team2Score: 2,
    },
  ];

  const displayMatches =
    filteredMatches.length > 0 ? filteredMatches : demoMatches;

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
          <h1 className="text-3xl font-bold text-white mb-2">Matches 🎯</h1>
          <p className="text-neutral-400">
            Browse matches and place your bets
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "live", label: "🔴 Live" },
            { key: "upcoming", label: "⏰ Upcoming" },
            { key: "finished", label: "✓ Finished" },
          ].map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key as typeof filter)}
              className={
                filter === f.key
                  ? "bg-cyan-500 hover:bg-cyan-600"
                  : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              }
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-4">
          {displayMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-neutral-400">
                      {match.game.name}
                    </span>
                    {getStatusBadge(match.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Team 1 */}
                    <div className="flex-1 text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <p className="text-white font-bold text-lg">
                        {match.team1.name}
                      </p>
                      <p className="text-neutral-500 text-sm">
                        {match.team1.tag}
                      </p>
                      {match.team1Score !== undefined && (
                        <p className="text-2xl font-bold text-white mt-2">
                          {match.team1Score}
                        </p>
                      )}
                    </div>

                    {/* VS */}
                    <div className="px-8">
                      <span className="text-2xl font-bold text-neutral-500">
                        VS
                      </span>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(match.matchDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Team 2 */}
                    <div className="flex-1 text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <p className="text-white font-bold text-lg">
                        {match.team2.name}
                      </p>
                      <p className="text-neutral-500 text-sm">
                        {match.team2.tag}
                      </p>
                      {match.team2Score !== undefined && (
                        <p className="text-2xl font-bold text-white mt-2">
                          {match.team2Score}
                        </p>
                      )}
                    </div>
                  </div>

                  {match.status !== "FINISHED" && (
                    <div className="flex gap-4 mt-6">
                      <Button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        disabled={match.status === "FINISHED"}
                      >
                        Bet on {match.team1.tag} (1.85)
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                        disabled={match.status === "FINISHED"}
                      >
                        Bet on {match.team2.tag} (2.10)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
