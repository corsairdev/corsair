import { FramedPanel } from './framed-panel';

export function Pulse({ className }: { className: string }) {
	return <div className={`animate-pulse bg-[#1c1c1c0d] ${className}`} />;
}

export function OssHeroSkeleton() {
	return (
		<section className="pt-12 pb-10 sm:pt-16 sm:pb-14">
			<div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
				<div>
					<div className="max-w-[520px] space-y-3.5" aria-hidden>
						{Array.from({ length: 4 }, (_, index) => (
							<div key={index} className="flex gap-4">
								<Pulse className="mt-2 size-2.5 shrink-0 rounded-full" />
								<Pulse
									className={`h-6 rounded ${index === 2 ? 'w-36' : index === 3 ? 'w-56' : 'w-32'}`}
								/>
							</div>
						))}
					</div>
					<div className="mt-7 flex flex-wrap gap-3">
						<Pulse className="h-10 w-36 rounded-lg" />
						<Pulse className="h-10 w-40 rounded-lg" />
					</div>
				</div>
				<FramedPanel>
					<div className="grid grid-cols-1 gap-px bg-[#1c1c1c1a] sm:grid-cols-2">
						{Array.from({ length: 2 }, (_, index) => (
							<div
								key={index}
								className="flex min-h-[140px] flex-col justify-center bg-white px-6 py-8 sm:px-8"
							>
								<Pulse className="h-8 w-24" />
								<Pulse className="mt-3 h-3 w-28" />
							</div>
						))}
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
