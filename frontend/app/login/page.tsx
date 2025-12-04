"use client";

import { useState } from 'react';
import { loginApi, setToken } from '../../lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(username, password);
      const token = (data && (data.accessToken || data.access_token || data.token || data.jwt)) as string | undefined;
      if (token) setToken(token);
      // navigate to profile
      if (typeof window !== 'undefined') window.location.href = '/profile';
    } catch (err) {
      setError((err as Error)?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </div>
      </form>
    </div>
  );
}
