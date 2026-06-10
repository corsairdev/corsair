import { Badge } from '@/components/ui/badge';

function formatTimelineTime(isoDate: string) {
	const date = new Date(isoDate);

	const datePart = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date);

	const timePart = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}).format(date);

	return { datePart, timePart };
}

type TimelineEvent = {
	id: string;
	type: 'claimed' | 'unclaimed';
	createdAt: string;
	githubUsername: string | null;
	avatarUrl: string | null;
};

export function ClaimTimeline({ events }: { events: TimelineEvent[] }) {
	if (events.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-8 text-center">
				<p className="text-sm text-muted-foreground">No claim activity yet.</p>
			</div>
		);
	}

	return (
		<div className="relative space-y-0">
			<div
				aria-hidden
				className="absolute top-3 bottom-3 left-[88px] w-px bg-border"
			/>
			<ol className="m-0 list-none space-y-4 p-0">
				{events.map((event) => {
					const { datePart, timePart } = formatTimelineTime(event.createdAt);

					return (
						<li key={event.id} className="relative flex items-start gap-3">
							<div className="w-[76px] shrink-0 pt-0.5 text-right">
								<div className="text-[11px] font-medium text-muted-foreground">
									{datePart}
								</div>
								<div className="text-[10px] text-muted-foreground/70">
									{timePart}
								</div>
							</div>
							<div className="relative z-1 flex w-6 shrink-0 justify-center pt-1.5">
								<div
									aria-hidden
									className="size-2.5 rounded-full border-2 border-border bg-card ring-4 ring-[#f7f7f5]"
								/>
							</div>
							<div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-sm">
								<div className="flex flex-wrap items-center gap-2">
									{event.avatarUrl ? (
										<img
											src={event.avatarUrl}
											alt=""
											width={20}
											height={20}
											className="rounded-full ring-1 ring-border"
										/>
									) : null}
									{event.githubUsername ? (
										<a
											href={`https://github.com/${event.githubUsername}`}
											className="text-sm font-medium transition-colors hover:text-foreground/80"
											target="_blank"
										>
											@{event.githubUsername}
										</a>
									) : (
										<span className="text-sm text-muted-foreground">
											Unknown user
										</span>
									)}
									<Badge
										variant={
											event.type === 'claimed' ? 'success' : 'muted'
										}
										className="text-[10px]"
									>
										{event.type === 'claimed' ? 'Claimed' : 'Unclaimed'}
									</Badge>
								</div>
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
