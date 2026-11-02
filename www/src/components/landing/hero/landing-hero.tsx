import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import {
	HERO_CLIENTS,
	HERO_SUBTITLE,
	HERO_TITLE_LEAD,
	HERO_TITLE_REST,
} from '@/lib/home-content';
import { YcBackedLink } from '../yc-backed-link';
import { HeroBackground } from './hero-background';
import { HeroStart } from './hero-start';

export function LandingHero() {
	return (
		<section className="relative w-full overflow-clip pb-10 md:pb-14">
			{/* Bottom fade — dots dissolve into the next section */}
			<div
				className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-b from-transparent to-[#f4f4f4]"
				aria-hidden
			/>
			<HeroBackground />
			<div className="relative z-[3] mx-auto grid max-w-[1440px] grid-cols-1 justify-items-center gap-6 px-4 pt-10 text-center sm:gap-7 sm:px-6 sm:pt-16 md:px-10 md:pt-20">
				<div className="animate-hero-fade-up flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] text-[#1c1c1c99]">
					<YcBackedLink
						height={28}
						className="inline-block mix-blend-multiply transition-transform duration-300 ease-out hover:-translate-y-0.5"
					/>
					<span
						aria-hidden
						className="hidden h-4 w-px bg-[#1c1c1c1f] sm:block"
					/>
					<Link
						href="/#pay-per-call"
						className="inline-flex items-center gap-1.5 rounded-full border border-[#4a38f5]/20 bg-[#4a38f5]/[0.06] px-3 py-1 font-medium text-[#3d2ee0] no-underline transition-colors hover:bg-[#4a38f5]/10"
					>
						New: tools with no API key, paid per call
						<ArrowRight size={12} weight="bold" aria-hidden />
					</Link>
				</div>

				<div className="flex w-full flex-col items-center gap-4 sm:gap-5 md:max-w-[780px]">
					<h1 className="animate-hero-fade-up delay-[100ms] w-full text-[clamp(2.25rem,6vw,4.5rem)] font-light leading-[1.05] tracking-tight text-[#1c1c1c]">
						<span className="pr-1.5 font-[family-name:var(--landing-font-serif)] italic">
							{HERO_TITLE_LEAD}
						</span>{' '}
						<br className="hidden sm:block" />
						<span className="font-[family-name:var(--landing-font-sans)] tracking-[-0.04em]">
							{HERO_TITLE_REST}
						</span>
					</h1>

					<p className="animate-hero-fade-up delay-[200ms] w-full max-w-[600px] text-balance font-[family-name:var(--landing-font-sans)] text-base font-medium leading-relaxed text-[#1c1c1c]/70 md:text-[17px]">
						{HERO_SUBTITLE}
					</p>
				</div>

				<div className="animate-hero-fade-up delay-[300ms] flex w-full justify-center">
					<HeroStart />
				</div>

				<div className="animate-hero-fade-up delay-[400ms] flex flex-col items-center gap-3">
					<ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[13px] text-[#1c1c1c99]">
						<li className="font-[family-name:var(--landing-font-mono)] text-[11px] uppercase tracking-[0.06em] text-[#1c1c1c66]">
							Works in
						</li>
						{HERO_CLIENTS.map((client) => (
							<li
								key={client}
								className="rounded-full border border-[#1c1c1c]/10 bg-white/70 px-2.5 py-0.5 text-[#1c1c1c]"
							>
								{client}
							</li>
						))}
					</ul>
					<Link
						href="/developers"
						className="text-[14px] font-medium text-[#1c1c1c99] no-underline transition-colors hover:text-[#4a38f5]"
					>
						Building your own app? The SDK is open source →
					</Link>
				</div>
			</div>
		</section>
	);
}
