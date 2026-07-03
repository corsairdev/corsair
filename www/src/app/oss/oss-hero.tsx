import Link from 'next/link';

import { FramedPanel } from './framed-panel';

type OssHeroProps = {
	signedIn: boolean;
	stats: {
		unclaimed: number;
	};
};

const numberFormatter = new Intl.NumberFormat('en-US');

const heroSteps: Array<{ label: string; accent?: boolean }> = [
	{ label: 'Ship a plugin' },
	{ label: 'Get it merged' },
	{ label: 'Earn AI credits', accent: true },
	{ label: 'Watch your code be used by thousands' },
];

function HeroStatBlock({
	label,
	value,
	accent = false,
}: {
	label: string;
	value: string;
	accent?: boolean;
}) {
	return (
		<div className="flex min-h-[140px] flex-col justify-center bg-white px-6 py-8 sm:px-8">
			<p
				className={
					accent
						? 'font-[family-name:var(--font-landing-mono)] text-[clamp(1.75rem,3.5vw,2.25rem)] font-light leading-none tabular-nums tracking-[-0.02em] text-[#4a38f5]'
						: 'font-[family-name:var(--font-landing-mono)] text-[clamp(1.75rem,3.5vw,2.25rem)] font-light leading-none tabular-nums tracking-[-0.02em] text-[#1c1c1c]'
				}
			>
				{value}
			</p>
			<p className="mt-3 font-[family-name:var(--font-landing-mono)] text-[10px] font-medium tracking-[0.08em] text-[#1c1c1c99] uppercase">
				{label}
			</p>
		</div>
	);
}

export function OssHero({ signedIn, stats }: OssHeroProps) {
	return (
		<section className="pt-12 pb-10 sm:pt-16 sm:pb-14">
			<div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
				<div>
					<h1 className="flex max-w-[520px] flex-col font-[family-name:var(--landing-font-sans)] text-[clamp(1.375rem,2.8vw,1.875rem)] font-light leading-snug tracking-[-0.02em]">
						{heroSteps.map((step, index) => {
							const isLast = index === heroSteps.length - 1;

							return (
								<span
									key={step.label}
									className={`flex gap-4 ${isLast ? '' : 'pb-3.5'}`}
								>
									<span
										className="relative flex w-3.5 shrink-0 flex-col items-center"
										aria-hidden
									>
										<span
											className={
												step.accent
													? 'mt-2 size-2.5 shrink-0 rounded-full bg-[#4a38f5]'
													: 'mt-2 size-2.5 shrink-0 rounded-full border border-[#1c1c1c]/20 bg-white'
											}
										/>
										{!isLast ? (
											<span className="mt-1 w-px flex-1 bg-[#1c1c1c]/12" />
										) : null}
									</span>
									<span
										className={
											step.accent
												? 'pb-0.5 font-medium text-[#4a38f5]'
												: 'text-[#1c1c1c]'
										}
									>
										{step.label}
									</span>
								</span>
							);
						})}
					</h1>

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
					<div className="grid grid-cols-1 gap-px bg-[#1c1c1c1a] sm:grid-cols-2">
						<HeroStatBlock
							accent
							value="$30,000+"
							label="AI credits to earn"
						/>
						<HeroStatBlock
							value={numberFormatter.format(stats.unclaimed)}
							label="Integrations available"
						/>
					</div>
				</FramedPanel>
			</div>
		</section>
	);
}
