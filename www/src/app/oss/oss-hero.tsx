import Link from 'next/link';

import { FramedPanel } from './framed-panel';

type OssHeroProps = {
	signedIn: boolean;
	stats: {
		unclaimed: number;
	};
};

const numberFormatter = new Intl.NumberFormat('en-US');

const heroBullets = [
	'Your code ships to Corsair\u2019s open catalog, used by thousands of developers',
	'Claim an integration, open a PR, get merged to main',
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

					<p className="mt-4 max-w-[520px] text-[clamp(1.125rem,2vw,1.375rem)] font-light leading-[1.35] tracking-[-0.02em] text-[#1c1c1c]">
						Ship a plugin, get it merged —{' '}
						<span className="font-medium text-[#4a38f5]">earn AI credits</span>{' '}
						for every integration you write.
					</p>

					<ul className="mt-5 max-w-[480px] space-y-2 text-[14px] leading-relaxed text-[#1c1c1c99]">
						{heroBullets.map((bullet) => (
							<li key={bullet} className="flex gap-2.5">
								<span
									className="mt-[0.55em] size-1 shrink-0 rounded-full bg-[#4a38f5]"
									aria-hidden
								/>
								<span>{bullet}</span>
							</li>
						))}
					</ul>

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
