import { cn } from '@/lib/utils';

import { ContributorLink } from './contributor-link';
import { FramedPanel } from './framed-panel';
import { IntegrationRewardDisplay } from './integration-reward-display';

type PodiumEntry = {
	rank: number;
	userId: string;
	githubUsername: string | null;
	avatarUrl: string | null;
	totalPoints: number;
	integrations: Array<{ id: string }>;
};

const rankWords: Record<number, string> = {
	1: 'First',
	2: 'Second',
	3: 'Third',
};

/** Stepped plinth heights — the podium silhouette. */
const plinthHeights: Record<number, string> = {
	1: 'sm:h-14',
	2: 'sm:h-[34px]',
	3: 'sm:h-[18px]',
};

function PodiumCard({ entry }: { entry: PodiumEntry }) {
	const isFirst = entry.rank === 1;

	return (
		<div className="flex h-full flex-col justify-end">
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
							<ContributorLink
								githubUsername={entry.githubUsername}
								className="block truncate text-sm font-medium text-[#1c1c1c] hover:text-[#4a38f5]"
							/>
						) : (
							<span className="block text-sm text-[#1c1c1c66]">unknown</span>
						)}
						<p className="mt-0.5 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
							{entry.integrations.length} integration
							{entry.integrations.length === 1 ? '' : 's'}
						</p>
					</div>
					<IntegrationRewardDisplay
						points={entry.totalPoints}
						variant="emphasis"
					/>
				</div>
			</FramedPanel>

			{/* Podium step — height carries the ranking. */}
			<div
				aria-hidden
				className={cn(
					'-mt-px hidden border border-t-0 border-[#1c1c1c1a] sm:block',
					plinthHeights[entry.rank] ?? 'sm:h-5',
					isFirst ? 'bg-[#4a38f508]' : 'bg-[#1c1c1c06]',
				)}
			/>
		</div>
	);
}

export function LeaderboardPodium({ entries }: { entries: PodiumEntry[] }) {
	if (entries.length === 0) return null;

	const [first, second, third] = entries;

	return (
		<section
			aria-label="Top three contributors"
			className="mb-8 grid gap-4 sm:mb-10 sm:grid-cols-3 sm:items-end sm:gap-2"
		>
			{second ? (
				<div className="order-2 sm:order-1">
					<PodiumCard entry={second} />
				</div>
			) : (
				<span aria-hidden className="hidden sm:order-1 sm:block" />
			)}
			{first ? (
				<div className="order-1 sm:order-2">
					<PodiumCard entry={first} />
				</div>
			) : null}
			{third ? (
				<div className="order-3">
					<PodiumCard entry={third} />
				</div>
			) : null}
		</section>
	);
}
