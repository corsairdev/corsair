import { DesktopPreview } from '../app-preview/desktop-preview';
import { YcBackedLink } from '../yc-backed-link';
import { HeroBackground } from './hero-background';

export function LandingHero() {
	return (
		<section className="relative w-full overflow-clip pb-3 md:pb-4">
			{/* Bottom fade — dots dissolve into the next section */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-b from-transparent to-[#f4f4f4]" aria-hidden />
			<HeroBackground />
			<div className="relative z-[1] mx-auto grid max-w-[1440px] grid-cols-1 justify-items-center gap-6 px-4 pt-16 text-center sm:gap-8 sm:pt-20 md:px-10 md:pt-24">
				


				<div className="flex w-full max-w-[360px] flex-col items-center gap-5 md:max-w-[720px]">
					{/* High-Fidelity Typography Headline */}
					<h1 
						className="animate-hero-fade-up delay-[100ms] w-full text-[clamp(2.25rem,6vw,4.5rem)] font-light leading-[1.05] tracking-tight text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)] italic text-transparent bg-clip-text bg-gradient-to-br from-[#1c1c1c] to-[#555]">
							Add any integration
						</span>{' '}
						<br className="hidden sm:block" />
						<span className="font-[family-name:var(--landing-font-sans)] tracking-[-0.04em]">
							in minutes
						</span>
					</h1>

					{/* Balanced Description */}
					<p 
						className="animate-hero-fade-up delay-[200ms] w-full max-w-[360px] text-base leading-relaxed text-[#1c1c1c]/70 md:max-w-[591px] text-balance font-[family-name:var(--landing-font-sans)] font-medium"
					>
						Corsair is the open source integration layer for products and
						agents.
						<br className="hidden sm:block" />
						Connect to the apps your users rely on without maintaining the
						infrastructure that keeps it working.
					</p>
				</div>

				{/* Premium CTAs */}
				<div 
					className="animate-hero-fade-up delay-[300ms] flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 mt-2"
				>
					<a
						href="https://github.com/corsairdev/corsair/"
						target="_blank"
						rel="noopener noreferrer"
						className="group inline-flex items-center justify-center gap-2 rounded-lg border border-[#1c1c1c]/10 bg-white/50 px-6 py-3 text-sm font-[family-name:var(--landing-font-sans)] font-medium text-[#1c1c1c] no-underline shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 active:translate-y-0"
					>
						<span className="transition-transform duration-300 ease-out group-hover:scale-110">⭐</span>
						Star on Github
					</a>
					<a
						href="https://app.corsair.dev"
						target="_blank"
						rel="noopener noreferrer"
						className="group inline-flex items-center justify-center gap-2 rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-6 py-3 text-sm font-[family-name:var(--landing-font-sans)] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] no-underline transition-all duration-300 ease-out hover:bg-[#2a2a2a] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0"
					>
						Go to app
						<span className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
					</a>
				</div>

				<div 
					className="animate-hero-fade-up delay-[400ms] flex w-full flex-col items-center gap-6 sm:gap-8 mt-4"
				>
					<YcBackedLink
						height={56}
						className="opacity-70 mix-blend-multiply transition-opacity duration-300 hover:opacity-100"
					/>
					<DesktopPreview />
				</div>
			</div>
		</section>
	);
}
