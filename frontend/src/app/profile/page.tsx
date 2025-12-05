"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  username: string;
  email: string;
  balance?: number;
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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

    fetch("http://localhost:3001/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setIsLoading(false);
      })
      .catch(() => {
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
        setIsLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditing(false);
        setMessage("Profil mis à jour avec succès !");
      } else {
        setMessage("Erreur lors de la mise à jour");
      }
    } catch {
      setMessage("Erreur de connexion au serveur");
    } finally {
      setIsSaving(false);
    }
  };

  const demoHistory = [
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
              Matchs
            </Link>
            <Link
              href="/teams"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Équipes
            </Link>
            <Link href="/profile" className="text-cyan-400 font-medium">
              Profil
            </Link>
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          >
            Déconnexion
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
          <h1 className="text-3xl font-bold text-white mb-2">Mon Profil 👤</h1>
          <p className="text-neutral-400">
            Gérez vos informations et consultez votre historique
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
                            Membre depuis{" "}
                            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
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
                        Modifier
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4 border-t border-neutral-800 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-neutral-300">
                          Nom d&apos;utilisateur
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
                          {isSaving ? "Enregistrement..." : "Enregistrer"}
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
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
                      <div className="bg-neutral-800/30 rounded-lg p-4">
                        <p className="text-neutral-500 text-sm">Solde</p>
                        <p className="text-2xl font-bold text-green-400">
                          {(user?.balance || 0).toFixed(2)} €
                        </p>
                      </div>
                      <div className="bg-neutral-800/30 rounded-lg p-4">
                        <p className="text-neutral-500 text-sm">Total paris</p>
                        <p className="text-2xl font-bold text-white">24</p>
                      </div>
                    </div>
                  )}

                  {message && (
                    <p
                      className={`mt-4 text-sm ${
                        message.includes("succès")
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
                Historique des paris
              </h3>
              <Card className="bg-neutral-900/50 border-neutral-800">
                <CardContent className="p-0">
                  <div className="divide-y divide-neutral-800">
                    {demoHistory.map((bet) => (
                      <div
                        key={bet.id}
                        className="p-4 flex items-center justify-between hover:bg-neutral-800/30 transition-colors"
                      >
                        <div>
                          <p className="text-white font-medium">{bet.match}</p>
                          <p className="text-neutral-500 text-sm">
                            Mise: {bet.amount}€ • Cote: {bet.odds}
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
                              ? "Gagné"
                              : bet.result === "loss"
                              ? "Perdu"
                              : "En cours"}
                          </span>
                          {bet.profit !== 0 && bet.result !== "pending" && (
                            <p
                              className={`text-sm mt-1 ${
                                bet.profit > 0 ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {bet.profit > 0 ? "+" : ""}
                              {bet.profit}€
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
                  <p className="font-medium">Déposer des fonds</p>
                  <p className="text-xs text-neutral-500">
                    Ajouter de l&apos;argent à votre compte
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 h-auto py-4"
              >
                <div className="text-left">
                  <p className="font-medium">Retirer des fonds</p>
                  <p className="text-xs text-neutral-500">
                    Transférer vers votre compte bancaire
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
