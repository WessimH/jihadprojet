"use client";

import { useEffect, useState } from 'react';
import { getMatches } from '../../lib/api';

type Match = {
	id: string;
	status?: string;
	format?: string;
	team1_score?: number;
	team2_score?: number;
	match_date?: string;
};

export default function MatchesPage() {
	const [matches, setMatches] = useState<Match[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		getMatches()
			.then((data) => {
				if (!mounted) return;
				setMatches(Array.isArray(data) ? data as Match[] : []);
			})
			.catch((e) => setError((e as Error)?.message || 'Failed to load matches'))
			.finally(() => setLoading(false));
		return () => {
			mounted = false;
		};
	}, []);

	if (loading) return <div className="p-6">Loading matches...</div>;
	if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold">Matches</h1>
			<ul className="mt-4 space-y-3">
				{matches.map((m) => (
					<li key={m.id} className="border p-3 rounded">
						<div className="flex justify-between">
							<div>
								<div className="font-medium">{m.id}</div>
								<div className="text-sm text-zinc-600">{m.status} · {m.format}</div>
							</div>
							<div className="text-right">
								<div>{m.team1_score} — {m.team2_score}</div>
								<div className="text-sm">{m.match_date ? new Date(m.match_date).toLocaleString() : ''}</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
