import { TrophyIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type LeaderboardEntryProps = {
	entry: {
		userId: string;
		rank: number;
		githubUsername: string | null;
		avatarUrl: string | null;
		totalPoints: number;
		integrations: Array<{
			id: string;
			slug: string;
			name: string;
			points: number;
		}>;
	};
};

function rankBadgeVariant(rank: number) {
	if (rank === 1) return 'accent' as const;
	if (rank <= 3) return 'warning' as const;
	return 'muted' as const;
}

export function LeaderboardEntry({ entry }: LeaderboardEntryProps) {
	return (
		<article
			className={cn(
				'rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all',
				'hover:border-border hover:bg-muted/20 hover:shadow-md',
			)}
		>
			<div className="flex items-center justify-between gap-4">
				<div className="flex min-w-0 items-center gap-3">
					<Badge
						variant={rankBadgeVariant(entry.rank)}
						className="min-w-8 justify-center font-mono text-xs"
					>
						#{entry.rank}
					</Badge>
					{entry.avatarUrl ? (
						<img
							src={entry.avatarUrl}
							alt=""
							width={32}
							height={32}
							className="rounded-full ring-2 ring-border/60"
						/>
					) : (
						<div className="size-8 rounded-full bg-muted" />
					)}
					<div className="min-w-0">
						{entry.githubUsername ? (
							<a
								href={`https://github.com/${entry.githubUsername}`}
								className="text-sm font-semibold text-foreground transition-colors hover:text-foreground/80"
								target="_blank"
							>
								@{entry.githubUsername}
							</a>
						) : (
							<span className="text-sm font-semibold text-muted-foreground">
								Unknown user
							</span>
						)}
						<p className="text-xs text-muted-foreground">
							{entry.integrations.length} integration
							{entry.integrations.length === 1 ? '' : 's'}
						</p>
					</div>
				</div>
				<div className="flex shrink-0 flex-col items-end gap-0.5">
					<div className="flex items-center gap-1.5 text-foreground">
						<TrophyIcon
							size={16}
							aria-hidden
							className="text-muted-foreground"
						/>
						<span className="font-mono text-lg font-semibold tabular-nums">
							{entry.totalPoints}
						</span>
					</div>
					<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
						points
					</span>
				</div>
			</div>

			{entry.integrations.length > 0 ? (
				<ul className="mt-3 flex flex-wrap gap-2">
					{entry.integrations.map((integration) => (
						<li key={integration.id}>
							<Link
								href={`/integrations/${integration.slug}`}
								className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-muted"
							>
								<span>{integration.name}</span>
								<span className="font-mono text-[10px] text-muted-foreground">
									{integration.points} pts
								</span>
							</Link>
						</li>
					))}
				</ul>
			) : null}
		</article>
	);
}
