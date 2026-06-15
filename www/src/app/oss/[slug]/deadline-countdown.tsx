'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function formatRemaining(ms: number) {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	if (minutes > 0) {
		return `${minutes}m ${seconds}s`;
	}
	return `${seconds}s`;
}

export function DeadlineCountdown({
	deadlineIso,
	label,
}: {
	deadlineIso: string;
	label: string;
}) {
	const router = useRouter();
	const [remaining, setRemaining] = useState<string | null>(null);
	const [expired, setExpired] = useState(false);

	useEffect(() => {
		const deadline = new Date(deadlineIso).getTime();
		let refreshed = false;

		const update = () => {
			const ms = deadline - Date.now();

			if (ms <= 0) {
				setExpired(true);
				setRemaining('0s');
				if (!refreshed) {
					refreshed = true;
					router.refresh();
				}
				return;
			}

			setExpired(false);
			setRemaining(formatRemaining(ms));
		};

		update();
		const interval = window.setInterval(update, 1000);
		return () => window.clearInterval(interval);
	}, [deadlineIso, router]);

	return (
		<div
			className={
				expired
					? 'rounded-lg border border-amber-600/40 bg-amber-600/15 px-4 py-3'
					: 'rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3'
			}
		>
			<p className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-amber-950 uppercase">
				{expired ? 'Deadline passed' : label}
			</p>
			<p className="mt-1 font-[family-name:var(--font-landing-mono)] text-lg tabular-nums text-amber-900">
				{expired ? 'Claim releasing…' : (remaining ?? '--')}
			</p>
		</div>
	);
}
