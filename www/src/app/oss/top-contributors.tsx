import Link from 'next/link';

import { ContributorLink } from './contributor-link';
import { formatPoints } from './integration-reward';

type Contributor = {
	rank: number;
	userId: string;
	githubUsername: string | null;
	avatarUrl: string | null;
	totalPoints: number;
	integrations: Array<{ id: string }>;
};

export function TopContributors({ items }: { items: Contributor[] }) {
	if (items.length === 0) return null;

	return (
		<section>
			<div className="flex items-baseline justify-between">
				<h2 className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
					Leaderboard
				</h2>
				<Link
					href="/oss?view=leaderboard"
					className="font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66] no-underline hover:text-[#1c1c1c] hover:underline"
				>
					all →
				</Link>
			</div>
			<ol className="mt-4 divide-y divide-[#1c1c1c0d]">
				{items.map((entry) => (
					<li
						key={entry.userId}
						className="flex items-center gap-3 py-2.5 text-[13px]"
					>
						<span className="w-4 font-[family-name:var(--font-landing-mono)] text-[11px] tabular-nums text-[#1c1c1c40]">
							{entry.rank}
						</span>
						{entry.avatarUrl ? (
							<img
								src={entry.avatarUrl}
								alt=""
								width={20}
								height={20}
								className="size-5 shrink-0 rounded-full"
							/>
						) : (
							<span className="size-5 shrink-0 rounded-full border border-[#1c1c1c1a] bg-[#1c1c1c0d]" />
						)}
						<span className="min-w-0 flex-1 truncate">
							{entry.githubUsername ? (
								<ContributorLink
									githubUsername={entry.githubUsername}
									className="font-medium text-[#1c1c1c] hover:text-[#4a38f5]"
								/>
							) : (
								<span className="text-[#1c1c1c66]">unknown</span>
							)}
						</span>
						<span className="font-[family-name:var(--font-landing-mono)] text-[12px] font-medium tabular-nums text-[#1c1c1c]">
							{formatPoints(entry.totalPoints)}
						</span>
					</li>
				))}
			</ol>
		</section>
	);
}
