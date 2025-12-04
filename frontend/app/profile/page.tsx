"use client";

import { useEffect, useState } from 'react';
import { getProfile } from '../../lib/api';

type Profile = {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((data) => {
        if (!mounted) return;
        setProfile((data ?? null) as Profile);
      })
      .catch((e) => setError((e as Error)?.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
      window.location.href = '/login';
    }
  }

  if (loading) return <div className="p-6">Loading profile…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      {profile ? (
        <div className="space-y-2">
          <div><strong>ID:</strong> {profile.id}</div>
          <div><strong>Username:</strong> {profile.username ?? profile.name ?? '—'}</div>
          <div><strong>Email:</strong> {profile.email ?? '—'}</div>
          <div><strong>Admin:</strong> {profile.isAdmin ? 'Yes' : 'No'}</div>
          <div className="pt-4">
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded">Log out</button>
          </div>
        </div>
      ) : (
        <div>No profile data</div>
      )}
    </div>
  );
}
