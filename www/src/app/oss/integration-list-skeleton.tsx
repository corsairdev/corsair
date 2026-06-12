function IntegrationCardSkeleton() {
	return (
		<article className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="min-w-0 flex-1 space-y-3">
					<div className="flex flex-wrap items-center gap-2">
						<div className="h-5 w-8 animate-pulse rounded-full bg-muted" />
						<div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
						<div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
					</div>
					<div className="flex flex-wrap gap-2">
						<div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
						<div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
						<div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
					</div>
					<div className="flex flex-wrap gap-1.5">
						<div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
						<div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
						<div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
					</div>
				</div>
				<div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
			</div>
		</article>
	);
}

export function IntegrationListSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="space-y-3" aria-busy="true" aria-label="Loading integrations">
			<div className="mb-6 flex flex-wrap items-center gap-2">
				<div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
			</div>
			{Array.from({ length: count }, (_, index) => (
				<IntegrationCardSkeleton key={index} />
			))}
		</div>
	);
}
