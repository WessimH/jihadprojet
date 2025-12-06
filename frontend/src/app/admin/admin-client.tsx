"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BeamsBackground } from "@/components/ui/beams-background";
import { FloatingHeader } from "@/components/ui/floating-header";
import { createMatchAction } from "@/lib/match-actions";

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

interface AdminClientProps {
  user: User;
  teams: Team[];
  games: Game[];
}

export function AdminClient({ user, teams, games }: AdminClientProps) {
  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  const [gameId, setGameId] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team1Id || !team2Id || !gameId || !matchDate) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    if (team1Id === team2Id) {
      setMessage({ type: 'error', text: 'Teams must be different' });
      return;
    }

    setIsCreating(true);
    setMessage(null);

    const result = await createMatchAction({
      team1_id: team1Id,
      team2_id: team2Id,
      game_id: gameId,
      match_date: new Date(matchDate).toISOString(),
    });

    setIsCreating(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Match created successfully!' });
      // Reset form
      setTeam1Id("");
      setTeam2Id("");
      setGameId("");
      setMatchDate("");
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create match' });
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
        <FloatingHeader isAuthenticated={true} username={user.username} isAdmin={true} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel 🛠️</h1>
          <p className="text-neutral-400">
            Manage matches, teams, and games
          </p>
        </motion.div>

        {/* Create Match Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Create New Match</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMatch} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="team1" className="text-neutral-300">Team 1</Label>
                    <select
                      id="team1"
                      value={team1Id}
                      onChange={(e) => setTeam1Id(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white"
                    >
                      <option value="">Select Team 1</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.tag})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team2" className="text-neutral-300">Team 2</Label>
                    <select
                      id="team2"
                      value={team2Id}
                      onChange={(e) => setTeam2Id(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white"
                    >
                      <option value="">Select Team 2</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.tag})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game" className="text-neutral-300">Game</Label>
                  <select
                    id="game"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white"
                  >
                    <option value="">Select Game</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matchDate" className="text-neutral-300">Match Date & Time</Label>
                  <Input
                    id="matchDate"
                    type="datetime-local"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-white"
                  />
                </div>

                {message && (
                  <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message.text}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {isCreating ? "Creating..." : "Create Match"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-2 gap-4"
        >
          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-white">{teams.length}</p>
              <p className="text-neutral-400">Teams</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-white">{games.length}</p>
              <p className="text-neutral-400">Games</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
