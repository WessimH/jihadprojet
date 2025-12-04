"use client";

import { useEffect, useState } from 'react';
import { getTeams } from '../../lib/api';

type Team = {
  id: string;
  name?: string;
  tag?: string;
  country?: string;
  total_earnings?: number;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getTeams()
      .then((data) => {
        if (!mounted) return;
        setTeams(Array.isArray(data) ? (data as Team[]) : []);
      })
      .catch((e) => setError((e as Error)?.message || 'Failed to load teams'))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-6">Loading teams...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Teams</h1>
      <ul className="mt-4 space-y-3">
        {teams.map((t) => (
          <li key={t.id} className="border p-3 rounded">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-zinc-600">{t.tag} · {t.country}</div>
              </div>
              <div className="text-right">
                <div>{t.total_earnings}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
