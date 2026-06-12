import { cn } from '@/lib/utils';

import { FramedPanel } from './framed-panel';

type PodiumEntry = {
	rank: number;
	userId: string;
	githubUsername: string | null;
	avatarUrl: string | null;
	totalPoints: number;
	integrations: Array<{ id: string }>;
};

const numberFormatter = new Intl.NumberFormat('en-US');

const rankWords: Record<number, string> = {
	1: 'First',
	2: 'Second',
	3: 'Third',
};

function PodiumCard({ entry }: { entry: PodiumEntry }) {
	const isFirst = entry.rank === 1;

	return (
		<FramedPanel corners={isFirst}>
			<div className="flex flex-col items-center gap-3 px-5 py-7 text-center">
				<span
					className={cn(
						'font-[family-name:var(--font-landing-mono)] text-[10px] font-medium tracking-[0.16em] uppercase',
						isFirst ? 'text-[#4a38f5]' : 'text-[#1c1c1c66]',
					)}
				>
					{rankWords[entry.rank] ?? `#${entry.rank}`}
				</span>
				{entry.avatarUrl ? (
					<img
						src={entry.avatarUrl}
						alt=""
						width={isFirst ? 64 : 48}
						height={isFirst ? 64 : 48}
						className={cn('rounded-full', isFirst ? 'size-16' : 'size-12')}
					/>
				) : (
					<span
						className={cn(
							'rounded-full border border-[#1c1c1c1a] bg-[#1c1c1c0d]',
							isFirst ? 'size-16' : 'size-12',
						)}
					/>
				)}
				<div className="min-w-0">
					{entry.githubUsername ? (
						<a
							href={`https://github.com/${entry.githubUsername}`}
							target="_blank"
							rel="noreferrer"
							className="block truncate text-sm font-medium text-[#1c1c1c] no-underline hover:underline"
						>
							{entry.githubUsername}
						</a>
					) : (
						<span className="block text-sm text-[#1c1c1c66]">unknown</span>
					)}
					<p className="mt-0.5 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
						{entry.integrations.length} integration
						{entry.integrations.length === 1 ? '' : 's'}
					</p>
				</div>
				<p className="font-[family-name:var(--font-landing-mono)] text-[26px] font-light leading-none tabular-nums text-[#1c1c1c]">
					{numberFormatter.format(entry.totalPoints)}
					<span className="ml-1.5 text-[11px] text-[#1c1c1c66]">pts</span>
				</p>
			</div>
		</FramedPanel>
	);
}

export function LeaderboardPodium({ entries }: { entries: PodiumEntry[] }) {
	if (entries.length === 0) return null;

	const [first, second, third] = entries;

	return (
		<div className="mb-10 grid gap-4 sm:grid-cols-3 sm:items-center">
			{second ? <PodiumCard entry={second} /> : <span aria-hidden />}
			{first ? <PodiumCard entry={first} /> : null}
			{third ? <PodiumCard entry={third} /> : null}
		</div>
	);
}
