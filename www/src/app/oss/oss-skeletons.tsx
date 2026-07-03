import { FramedPanel } from './framed-panel';

export function Pulse({ className }: { className: string }) {
	return <div className={`animate-pulse bg-[#1c1c1c0d] ${className}`} />;
}

export function OssHeroSkeleton() {
	return (
		<section className="pt-12 pb-10 sm:pt-16 sm:pb-14">
			<div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
				<div>
					<p className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
						Open source contributor program
					</p>
					<h1 className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]">
						<span className="font-[family-name:var(--landing-font-serif)] italic">
							Every integration,
						</span>
						<br />
						<span className="font-[family-name:var(--landing-font-sans)] tracking-[-0.04em]">
							built in the open.
						</span>
					</h1>
					<p className="mt-5 max-w-[460px] text-[15px] leading-[1.65] text-[#1c1c1c99]">
						Claim an integration, build the plugin, get it merged — and earn
						points for every contribution.
					</p>
					<div className="mt-7 flex flex-wrap gap-3">
						<Pulse className="h-10 w-36 rounded-lg" />
						<Pulse className="h-10 w-40 rounded-lg" />
					</div>
				</div>
				<FramedPanel>
					<div className="grid grid-cols-2 gap-px bg-[#1c1c1c1a] sm:grid-cols-4">
						{Array.from({ length: 4 }, (_, i) => (
							<div key={i} className="bg-white px-5 py-4 sm:px-6">
								<Pulse className="h-7 w-12" />
								<Pulse className="mt-2 h-3 w-16" />
							</div>
						))}
					</div>
					<div className="border-t border-[#1c1c1c1a] px-5 py-4 sm:px-6">
						<Pulse className="h-2 w-full rounded" />
						<Pulse className="mt-2.5 h-3 w-48" />
					</div>
				</FramedPanel>
			</div>
		</section>
	);
}

export function TagFilterSkeleton() {
	return (
		<div className="flex flex-wrap gap-2" aria-hidden>
			{Array.from({ length: 6 }, (_, i) => (
				<Pulse key={i} className="h-7 w-20 rounded-full" />
			))}
		</div>
	);
}

export function LeaderboardSkeleton() {
	return (
		<div aria-busy="true" aria-label="Loading leaderboard">
			<div className="mb-10 grid gap-4 sm:grid-cols-3 sm:items-end sm:gap-2">
				{Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="space-y-0">
						<Pulse className="h-48 w-full border border-[#1c1c1c1a]" />
						<Pulse className="h-9 w-full" />
					</div>
				))}
			</div>
			<FramedPanel corners={false}>
				<div className="space-y-0 divide-y divide-[#1c1c1c0d]">
					{Array.from({ length: 5 }, (_, i) => (
						<div key={i} className="flex items-center gap-3 px-6 py-3">
							<Pulse className="h-3 w-4" />
							<Pulse className="size-5 rounded-full" />
							<Pulse className="h-4 flex-1 max-w-32" />
							<Pulse className="h-4 w-10" />
						</div>
					))}
				</div>
			</FramedPanel>
		</div>
	);
}

export function OssSidebarSkeleton() {
	return (
		<aside className="space-y-10" aria-busy="true" aria-label="Loading sidebar">
			<div>
				<Pulse className="h-3 w-16" />
				<div className="mt-4 space-y-3">
					{Array.from({ length: 4 }, (_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Pulse className="h-3 w-8" />
							<Pulse className="size-5 rounded-full" />
							<Pulse className="h-4 flex-1" />
						</div>
					))}
				</div>
			</div>
			<div>
				<Pulse className="h-3 w-24" />
				<div className="mt-4 space-y-3">
					{Array.from({ length: 3 }, (_, i) => (
						<Pulse key={i} className="h-10 w-full" />
					))}
				</div>
			</div>
		</aside>
	);
}
