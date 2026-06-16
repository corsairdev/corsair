import Link from 'next/link';

import { formatRelativeTime } from './relative-time';

type ActivityItem = {
	id: string;
	type: 'claimed' | 'unclaimed' | 'finished';
	createdAt: string;
	githubUsername: string | null;
	avatarUrl: string | null;
	integrationName: string;
	integrationSlug: string;
	points: number;
};

const eventLabel: Record<ActivityItem['type'], string> = {
	claimed: 'claimed',
	unclaimed: 'released',
	finished: 'shipped',
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
	return (
		<section>
			<h2 className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
				Ship log
			</h2>
			{items.length === 0 ? (
				<p className="mt-4 text-[13px] leading-relaxed text-[#1c1c1c66]">
					No activity yet. Claim the first integration.
				</p>
			) : (
				<ol className="mt-4 divide-y divide-[#1c1c1c0d]">
					{items.map((item) => (
						<li
							key={item.id}
							className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 py-2.5"
						>
							<span className="pt-px font-[family-name:var(--font-landing-mono)] text-[11px] whitespace-nowrap tabular-nums text-[#1c1c1c40]">
								{formatRelativeTime(item.createdAt)}
							</span>
							<p className="min-w-0 text-[13px] leading-snug text-[#1c1c1c99]">
								{item.githubUsername ? (
									<a
										href={`https://github.com/${item.githubUsername}`}
										target="_blank"
										rel="noreferrer"
										className="font-medium text-[#1c1c1c] no-underline hover:underline"
									>
										{item.githubUsername}
									</a>
								) : (
									<span className="font-medium text-[#1c1c1c]">someone</span>
								)}{' '}
								{eventLabel[item.type]}{' '}
								<Link
									href={`/oss/${item.integrationSlug}`}
									className="font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c] no-underline hover:underline"
								>
									{item.integrationSlug}
								</Link>
								{item.type === 'finished' ? (
									<span className="font-[family-name:var(--font-landing-mono)] text-[11px] font-medium text-[#4a38f5]">
										{' '}
										+{item.points}
									</span>
								) : null}
							</p>
						</li>
					))}
				</ol>
			)}
		</section>
	);
}
