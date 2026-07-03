import Link from 'next/link';

import { FramedPanel } from './framed-panel';

type OssHeroProps = {
	signedIn: boolean;
	stats: {
		total: number;
		claimed: number;
		finished: number;
		inProgress: number;
		unclaimed: number;
		contributors: number;
	};
};

const numberFormatter = new Intl.NumberFormat('en-US');

function StatBlock({ label, value }: { label: string; value: number }) {
	return (
		<div className="bg-white px-5 py-4 sm:px-6">
			<p className="font-[family-name:var(--font-landing-mono)] text-[26px] font-light leading-none tabular-nums text-[#1c1c1c]">
				{numberFormatter.format(value)}
			</p>
			<p className="mt-2 font-[family-name:var(--font-landing-mono)] text-[10px] font-medium tracking-[0.08em] text-[#1c1c1c99] uppercase">
				{label}
			</p>
		</div>
	);
}

export function OssHero({ signedIn, stats }: OssHeroProps) {
	const shippedPct = stats.total > 0 ? (stats.finished / stats.total) * 100 : 0;
	const inProgressPct =
		stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0;

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
						Claim an integration, build the plugin, get it merged. Contributors
						earn points for every merge — redeemable for AI credits. Your work
						goes live in the open catalog, powering real agents in real products
						from day one.
					</p>
					<div className="mt-7 flex flex-wrap items-center gap-3">
						<Link
							href={signedIn ? '#integrations' : '/oss/sign-in'}
							className="inline-flex items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-5 py-2.5 text-sm font-medium text-white no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#2a2a2a] active:translate-y-0"
						>
							{signedIn ? 'Claim an integration' : 'Sign in to claim'}
						</Link>
						<a
							href="https://github.com/corsairdev/corsair/blob/main/CONTRIBUTING.md"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center justify-center rounded-lg border border-[#1c1c1c]/10 bg-white/50 px-5 py-2.5 text-sm font-medium text-[#1c1c1c] no-underline shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:translate-y-0"
						>
							Contribution guide
						</a>
					</div>
				</div>

				<FramedPanel>
					<div className="grid grid-cols-2 gap-px bg-[#1c1c1c1a] sm:grid-cols-4">
						<StatBlock label="Shipped" value={stats.finished} />
						<StatBlock label="In progress" value={stats.inProgress} />
						<StatBlock label="Up for grabs" value={stats.unclaimed} />
						<StatBlock label="Contributors" value={stats.contributors} />
					</div>
					<div className="border-t border-[#1c1c1c1a] px-5 py-4 sm:px-6">
						<svg
							className="block h-[8px] w-full"
							preserveAspectRatio="none"
							role="progressbar"
							aria-valuenow={stats.finished}
							aria-valuemin={0}
							aria-valuemax={stats.total}
							aria-label="Integrations shipped"
						>
							<line
								x1="0"
								y1="4"
								x2="100%"
								y2="4"
								stroke="#1c1c1c33"
								strokeWidth="1.5"
								strokeDasharray="3 6"
							/>
							<line
								x1="0"
								y1="4"
								x2={`${shippedPct + inProgressPct}%`}
								y2="4"
								stroke="#8174f8"
								strokeWidth="2"
								strokeDasharray="4 6"
							/>
							<line
								x1="0"
								y1="4"
								x2={`${shippedPct}%`}
								y2="4"
								stroke="#4a38f5"
								strokeWidth="2"
							/>
						</svg>
						<div className="mt-2.5 flex items-baseline justify-between font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c99]">
							<span>
								{numberFormatter.format(stats.finished)} shipped /{' '}
								{numberFormatter.format(stats.inProgress)} in flight
							</span>
							<span>{numberFormatter.format(stats.total)} total</span>
						</div>
					</div>
				</FramedPanel>
			</div>
		</section>
	);
}
