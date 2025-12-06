"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BeamsBackground } from "@/components/ui/beams-background";
import { FloatingHeader } from "@/components/ui/floating-header";
import { loginAction } from "@/lib/auth-actions";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await loginAction(formData.username, formData.password);
    
    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error || "Invalid credentials");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 z-0">
        <BeamsBackground className="absolute inset-0" />
      </div>

      <div className="relative z-50">
        <FloatingHeader />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-[400px] bg-neutral-900/80 backdrop-blur-xl border-neutral-800">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <span className="text-4xl">🎮</span>
              </div>
              <CardTitle className="text-2xl text-center text-white">
                Login
              </CardTitle>
              <CardDescription className="text-center text-neutral-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-neutral-300">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-neutral-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <p className="text-sm text-neutral-400 text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
                <Link
                  href="/"
                  className="text-sm text-neutral-500 hover:text-neutral-400 transition-colors text-center"
                >
                  ← Back to home
                </Link>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
