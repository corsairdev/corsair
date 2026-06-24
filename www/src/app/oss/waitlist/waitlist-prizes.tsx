import { FramedPanel } from '../framed-panel';

const hardwarePrizes = [
	{ place: '1st', prize: 'iPad Air' },
	{ place: '2nd', prize: 'AirPod Pros' },
] as const;

const creditPrizes = [
	{ place: '3rd', prize: '$500 OpenAI API Credits' },
	{ place: '4th', prize: '$250 OpenAI API Credits' },
	{ place: '5th', prize: '$150 OpenAI API Credits' },
] as const;

function PrizeRow({
	place,
	prize,
	highlight,
}: {
	place: string;
	prize: string;
	highlight?: boolean;
}) {
	return (
		<li className="flex items-baseline justify-between gap-4 px-5 py-3.5 sm:px-6">
			<span
				className={`font-[family-name:var(--font-landing-mono)] text-[11px] font-medium tracking-[0.08em] uppercase ${
					highlight ? 'text-[#4a38f5]' : 'text-[#1c1c1c66]'
				}`}
			>
				{place}
			</span>
			<span className="text-right text-[14px] font-medium text-[#1c1c1c]">
				{prize}
			</span>
		</li>
	);
}

export function WaitlistPrizes() {
	return (
		<section aria-labelledby="waitlist-prizes-heading">
			<h2
				id="waitlist-prizes-heading"
				className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase"
			>
				Prizes
			</h2>
			<p className="mt-3 max-w-[560px] text-[15px] leading-[1.65] text-[#1c1c1c99]">
				Claim integrations, open PRs, and rack up points as you merge. The top
				two engineers on the leaderboard win hardware — the next three take home
				OpenAI API credits.
			</p>

			<div className="mt-6 grid gap-6 lg:grid-cols-2">
				<div>
					<p className="font-[family-name:var(--font-landing-mono)] text-[11px] font-medium tracking-[0.08em] text-[#1c1c1c66] uppercase">
						Top 2 — hardware
					</p>
					<FramedPanel className="mt-3">
						<ul className="divide-y divide-[#1c1c1c0d]">
							{hardwarePrizes.map((entry) => (
								<PrizeRow
									key={entry.place}
									place={entry.place}
									prize={entry.prize}
									highlight
								/>
							))}
						</ul>
					</FramedPanel>
				</div>

				<div>
					<p className="font-[family-name:var(--font-landing-mono)] text-[11px] font-medium tracking-[0.08em] text-[#1c1c1c66] uppercase">
						Next 3 — OpenAI API credits
					</p>
					<FramedPanel className="mt-3">
						<ul className="divide-y divide-[#1c1c1c0d]">
							{creditPrizes.map((entry) => (
								<PrizeRow
									key={entry.place}
									place={entry.place}
									prize={entry.prize}
								/>
							))}
						</ul>
					</FramedPanel>
				</div>
			</div>
		</section>
	);
}
