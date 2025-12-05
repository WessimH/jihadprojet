"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, usersApi, betsApi } from "@/lib/api";

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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

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
        const userData = profileData as unknown as User;
        setUser(userData);
        setUsername(userData.username || "");
        setEmail(userData.email || "");
        setBets(betsData as unknown as Bet[]);
      } catch {
        // Demo data
        const demoUser = {
          id: "1",
          username: "demo_user",
          email: "demo@example.com",
          balance: 1250.0,
          createdAt: "2024-01-15T10:00:00Z",
        };
        setUser(demoUser);
        setUsername(demoUser.username);
        setEmail(demoUser.email);
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

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    setMessage("");

    try {
      const updatedUser = await usersApi.update(user.id, { username, email });
      setUser(updatedUser as unknown as User);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const betHistory = bets.length > 0 ? bets.map(bet => ({
    id: bet.id,
    match: bet.match ? `${bet.match.team1?.name || 'TBD'} vs ${bet.match.team2?.name || 'TBD'}` : 'Unknown Match',
    amount: bet.amount,
    odds: bet.odds,
    result: bet.status?.toLowerCase() || 'pending',
    profit: bet.profit || 0,
  })) : [
    {
      id: "1",
      match: "Team Liquid vs G2 Esports",
      amount: 50,
      odds: 1.85,
      result: "win",
      profit: 42.5,
    },
    {
      id: "2",
      match: "Fnatic vs Cloud9",
      amount: 30,
      odds: 2.1,
      result: "loss",
      profit: -30,
    },
    {
      id: "3",
      match: "T1 vs Gen.G",
      amount: 100,
      odds: 1.65,
      result: "win",
      profit: 65,
    },
    {
      id: "4",
      match: "NaVi vs FaZe",
      amount: 25,
      odds: 2.35,
      result: "pending",
      profit: 0,
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
            <Link
              href="/teams"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Teams
            </Link>
            <Link href="/profile" className="text-cyan-400 font-medium">
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Profile 👤</h1>
          <p className="text-neutral-400">
            Manage your information and view your history
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-neutral-900/50 border-neutral-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {user?.username}
                        </h2>
                        <p className="text-neutral-400">{user?.email}</p>
                        {user?.createdAt && (
                          <p className="text-neutral-500 text-sm mt-1">
                            Member since{" "}
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4 border-t border-neutral-800 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-neutral-300">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="bg-neutral-800/50 border-neutral-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-neutral-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-neutral-800/50 border-neutral-700 text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-cyan-500 hover:bg-cyan-600 text-black"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setUsername(user?.username || "");
                            setEmail(user?.email || "");
                          }}
                          className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
                      <div className="bg-neutral-800/30 rounded-lg p-4">
                        <p className="text-neutral-500 text-sm">Balance</p>
                        <p className="text-2xl font-bold text-green-400">
                          ${(user?.balance || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-neutral-800/30 rounded-lg p-4">
                        <p className="text-neutral-500 text-sm">Total Bets</p>
                        <p className="text-2xl font-bold text-white">24</p>
                      </div>
                    </div>
                  )}

                  {message && (
                    <p
                      className={`mt-4 text-sm ${
                        message.includes("success")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Bet History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Bet History
              </h3>
              <Card className="bg-neutral-900/50 border-neutral-800">
                <CardContent className="p-0">
                  <div className="divide-y divide-neutral-800">
                    {betHistory.map((bet) => (
                      <div
                        key={bet.id}
                        className="p-4 flex items-center justify-between hover:bg-neutral-800/30 transition-colors"
                      >
                        <div>
                          <p className="text-white font-medium">{bet.match}</p>
                          <p className="text-neutral-500 text-sm">
                            Stake: ${bet.amount} • Odds: {bet.odds}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              bet.result === "win"
                                ? "bg-green-500/20 text-green-400"
                                : bet.result === "loss"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {bet.result === "win"
                              ? "Won"
                              : bet.result === "loss"
                              ? "Lost"
                              : "Pending"}
                          </span>
                          {bet.profit !== 0 && bet.result !== "pending" && (
                            <p
                              className={`text-sm mt-1 ${
                                bet.profit > 0 ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {bet.profit > 0 ? "+" : ""}
                              ${bet.profit}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              <Button
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 h-auto py-4"
              >
                <div className="text-left">
                  <p className="font-medium">Deposit Funds</p>
                  <p className="text-xs text-neutral-500">
                    Add money to your account
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 h-auto py-4"
              >
                <div className="text-left">
                  <p className="font-medium">Withdraw Funds</p>
                  <p className="text-xs text-neutral-500">
                    Transfer to your bank account
                  </p>
                </div>
              </Button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
