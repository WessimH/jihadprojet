"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BeamsBackground } from "@/components/ui/beams-background";
import { FloatingHeader } from "@/components/ui/floating-header";
import { placeBetAction } from "@/lib/bet-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  isAuthenticated?: boolean;
  username?: string;
}

export function MatchesClient({ matches, isAuthenticated = false, username }: MatchesClientProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "finished">(
    "all"
  );
  const [betDialog, setBetDialog] = useState<{
    open: boolean;
    match: Match | null;
    team: Team | null;
    odds: number;
  }>({ open: false, match: null, team: null, odds: 0 });
  const [betAmount, setBetAmount] = useState("");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [betMessage, setBetMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleOpenBetDialog = (match: Match, team: Team, odds: number) => {
    setBetDialog({ open: true, match, team, odds });
    setBetAmount("");
    setBetMessage(null);
  };

  const handlePlaceBet = async () => {
    if (!betDialog.match || !betDialog.team || !betAmount) return;
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setBetMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setIsPlacingBet(true);
    setBetMessage(null);

    const result = await placeBetAction(
      betDialog.match.id,
      betDialog.team.id,
      amount,
      betDialog.odds
    );

    setIsPlacingBet(false);

    if (result.success) {
      setBetMessage({ type: 'success', text: `Bet placed successfully! Potential win: $${(amount * betDialog.odds).toFixed(2)}` });
      setTimeout(() => {
        setBetDialog({ open: false, match: null, team: null, odds: 0 });
      }, 2000);
    } else {
      setBetMessage({ type: 'error', text: result.error || 'Failed to place bet' });
    }
  };

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return match.status === "SCHEDULED";
    if (filter === "live") return match.status === "LIVE";
    if (filter === "finished") return match.status === "COMPLETED";
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
      case "SCHEDULED":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
            ⏰ Upcoming
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-neutral-500/20 text-neutral-400">
            ✓ Finished
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
            ✗ Cancelled
          </span>
        );
      default:
        return null;
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
        <FloatingHeader isAuthenticated={isAuthenticated} username={username} />
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
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">No matches found</p>
              <p className="text-neutral-500 text-sm mt-2">Check back later for upcoming matches</p>
            </div>
          ) : (
            filteredMatches.map((match, index) => (
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

                  {match.status !== "COMPLETED" && match.status !== "CANCELLED" && isAuthenticated && (
                    <div className="flex gap-4 mt-6">
                      <Button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        onClick={() => handleOpenBetDialog(match, match.team1, 1.85)}
                      >
                        Bet on {match.team1.tag} (1.85)
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                        onClick={() => handleOpenBetDialog(match, match.team2, 2.10)}
                      >
                        Bet on {match.team2.tag} (2.10)
                      </Button>
                    </div>
                  )}
                  {match.status !== "COMPLETED" && match.status !== "CANCELLED" && !isAuthenticated && (
                    <div className="mt-6 text-center">
                      <p className="text-neutral-500 text-sm">
                        <a href="/login" className="text-cyan-400 hover:underline">Login</a> to place bets
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
          )}
        </div>
      </main>

      {/* Bet Dialog */}
      <Dialog open={betDialog.open} onOpenChange={(open) => !open && setBetDialog({ open: false, match: null, team: null, odds: 0 })}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Place Your Bet</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {betDialog.match && betDialog.team && (
                <>
                  Betting on <span className="text-cyan-400 font-semibold">{betDialog.team.name}</span> in{" "}
                  <span className="text-white">{betDialog.match.team1.name} vs {betDialog.match.team2.name}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="betAmount">Bet Amount ($)</Label>
              <Input
                id="betAmount"
                type="number"
                min="1"
                step="1"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            
            {betAmount && betDialog.odds > 0 && (
              <div className="bg-neutral-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Odds</span>
                  <span className="text-white">{betDialog.odds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Potential Win</span>
                  <span className="text-green-400 font-semibold">
                    ${(parseFloat(betAmount) * betDialog.odds).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {betMessage && (
              <p className={`text-sm ${betMessage.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {betMessage.text}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBetDialog({ open: false, match: null, team: null, odds: 0 })}
              className="border-neutral-700 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              disabled={isPlacingBet || !betAmount || parseFloat(betAmount) <= 0}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {isPlacingBet ? "Placing..." : "Place Bet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
