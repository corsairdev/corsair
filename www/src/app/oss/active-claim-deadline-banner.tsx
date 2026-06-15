'use client';

import { ClockCountdown } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

export function ActiveClaimDeadlineBanner({
	claim,
}: {
	claim: {
		slug: string;
		name: string;
		deadlineAt: string;
		label: string;
	};
}) {
	const pathname = usePathname();
	const router = useRouter();
	const [remaining, setRemaining] = useState<string | null>(null);
	const [expired, setExpired] = useState(false);

	useEffect(() => {
		const deadline = new Date(claim.deadlineAt).getTime();
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
	}, [claim.deadlineAt, router]);

	if (pathname === `/oss/${claim.slug}`) {
		return null;
	}

	return (
		<div
			role="status"
			className={
				expired
					? 'border-b border-amber-600/40 bg-amber-600/15'
					: 'border-b border-amber-500/30 bg-amber-500/10'
			}
		>
			<div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-10">
				<div className="flex min-w-0 items-center gap-3">
					<ClockCountdown
						size={18}
						className="shrink-0 text-amber-900"
						aria-hidden
					/>
					<div className="min-w-0">
						<p className="font-[family-name:var(--font-landing-mono)] text-[10px] font-medium tracking-[0.02em] text-amber-950 uppercase">
							{expired ? 'Deadline passed' : claim.label}
						</p>
						<p className="text-sm text-amber-950/90">
							<span className="font-medium text-amber-950">{claim.name}</span>
							<span className="mx-2 text-amber-900/40" aria-hidden>
								·
							</span>
							<span className="font-[family-name:var(--font-landing-mono)] tabular-nums">
								{expired ? 'Claim releasing…' : (remaining ?? '--')}
							</span>
						</p>
					</div>
				</div>
				<Link
					href={`/oss/${claim.slug}`}
					className="inline-flex shrink-0 items-center rounded-md border border-amber-700/30 bg-amber-700/10 px-3 py-1.5 font-[family-name:var(--font-landing-mono)] text-[11px] font-medium text-amber-950 no-underline transition-colors hover:bg-amber-700/20"
				>
					Go to {claim.name} →
				</Link>
			</div>
		</div>
	);
}
