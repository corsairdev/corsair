import { DesktopPreview } from '../app-preview/desktop-preview';
import { HeroBackground } from './hero-background';

export function LandingHero() {
	return (
		<section className="relative w-full overflow-clip bg-[#f4f4f4] pb-3 md:pb-4">
			<HeroBackground />
			<div className="relative z-[1] mx-auto grid max-w-[1440px] grid-cols-1 justify-items-center gap-5 px-4 pt-12 text-center sm:gap-6 sm:pt-16 md:px-10 md:pt-24">
				<div className="flex w-full max-w-[360px] flex-col items-center gap-3 md:max-w-[672px]">
					<h1 className="w-full text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]">
						<span className="font-[family-name:var(--landing-font-serif)]">
							Add any integration
						</span>{' '}
						<br />
						<span className="font-[family-name:var(--landing-font-sans)]">
							in minutes
						</span>
					</h1>
					<p className="w-full max-w-[360px] text-base leading-[1.55] text-[#1c1c1c99] md:max-w-[591px]">
						Corsair is the open source integration layer for products and
						agents.
						<br />
						Connect to the apps your users rely on without maintaining the
						infrastructure that keeps it working.
					</p>
				</div>

				<div className="flex w-full max-w-sm flex-col items-stretch gap-2.5 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
					<a
						href="https://github.com/corsairdev/corsair/"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center rounded-sm border border-[#1c1c1c] bg-transparent px-6 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-all duration-200 ease-out hover:bg-[#1c1c1c0d] sm:hover:-translate-y-0.5 sm:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
					>
						⭐ on Github
					</a>
					<a
						href="https://app.corsair.dev"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center rounded-sm border border-[#1c1c1c] bg-[#1c1c1c] px-6 py-3 text-sm font-medium text-white no-underline transition-all duration-200 ease-out hover:bg-[#333] sm:hover:-translate-y-0.5 sm:hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
					>
						Go to app
					</a>
				</div>

				<div className="w-full">
					<DesktopPreview />
				</div>
			</div>
		</section>
	);
}
