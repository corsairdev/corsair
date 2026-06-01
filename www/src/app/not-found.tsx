import Link from 'next/link';
import { SiteMenu } from '@/components/landing/menu/site-menu';

export default function NotFound() {
	return (
		<div className="landing min-h-screen overflow-x-hidden bg-[#f4f4f4] flex flex-col">
			<SiteMenu />
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
				<div className="relative z-[1] max-w-md w-full flex flex-col items-center gap-6">
					<div className="text-[clamp(4rem,10vw,7rem)] font-light leading-none tracking-tight text-[#1c1c1c99] font-[family-name:var(--landing-font-serif)]">
						404
					</div>
					<h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1c1c] font-[family-name:var(--landing-font-sans)]">
						Page not found
					</h1>
					<p className="text-base text-[#1c1c1c99] leading-relaxed max-w-sm">
						The page you are looking for doesn't exist or has been moved to
						another URL.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-4">
						<Link
							href="/"
							className="inline-flex w-full sm:w-auto items-center justify-center rounded-sm border border-[#1c1c1c] bg-[#1c1c1c] px-6 py-2.5 text-xs sm:text-sm font-medium text-white no-underline transition-colors hover:bg-[#333]"
						>
							Back to home
						</Link>
						<a
							href="https://docs.corsair.dev"
							className="inline-flex w-full sm:w-auto items-center justify-center rounded-sm border border-[#1c1c1c] bg-transparent px-6 py-2.5 text-xs sm:text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#1c1c1c0d]"
						>
							Read the docs
						</a>
					</div>
				</div>
			</main>
		</div>
	);
}
