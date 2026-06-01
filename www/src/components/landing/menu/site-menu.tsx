'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRightIcon, PlusCorner } from '../icons';

const DOCS_URL = 'https://docs.corsair.dev';
const GITHUB_URL = 'https://github.com/corsairdev/corsair/';
const APP_URL = 'https://app.corsair.dev';

export function SiteMenu() {
	const [hasScrolled, setHasScrolled] = useState(false);

	const handleScroll = useCallback(() => {
		const scrolled = window.scrollY > 8;
		setHasScrolled(scrolled);
	}, []);

	useEffect(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	return (
		<header
			className="sticky top-3 z-50 mx-3 sm:top-4 sm:mx-4 md:mx-10 transition-all duration-300"
		>
			<div
				className={`relative mx-auto max-w-[1440px] transition-all duration-300 ${
					hasScrolled
						? 'bg-[#f4f4f4]/90 backdrop-blur-xl shadow-sm'
						: 'bg-[#f4f4f4]/40 backdrop-blur-md'
				}`}
			>
				{/* The signature plus signs at all four corners */}
				<span className="pointer-events-none absolute -left-[7px] -top-[7px] z-10 transition-opacity duration-300">
					<PlusCorner />
				</span>
				<span className="pointer-events-none absolute -right-[7px] -top-[7px] z-10 transition-opacity duration-300">
					<PlusCorner />
				</span>
				<span className="pointer-events-none absolute -bottom-[7px] -left-[7px] z-10 transition-opacity duration-300">
					<PlusCorner />
				</span>
				<span className="pointer-events-none absolute -bottom-[7px] -right-[7px] z-10 transition-opacity duration-300">
					<PlusCorner />
				</span>

				<nav
					className="flex min-h-14 sm:min-h-16 w-full min-w-0 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6"
					aria-label="Primary navigation"
				>
					<Link
						href="/"
						aria-label="Corsair home"
						className="inline-flex shrink-0 items-center gap-2 sm:gap-2.5 no-underline transition-opacity hover:opacity-80"
					>
						<Image
							src="/corsair-logo.png"
							alt=""
							width={32}
							height={32}
							className="size-7 sm:size-8 rounded-sm"
							priority
						/>
						<span className="font-[family-name:var(--landing-font-sans)] text-base sm:text-lg font-semibold tracking-tight text-[#1c1c1c]">
							Corsair
						</span>
					</Link>

					<div className="flex shrink-0 items-center gap-1 sm:gap-2">
						<a
							href={DOCS_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="px-2 py-2 text-[13px] sm:px-3 sm:text-sm font-[family-name:var(--landing-font-sans)] font-medium text-[#1c1c1c]/60 no-underline transition-colors hover:text-[#1c1c1c]"
						>
							Docs
						</a>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="px-2 py-2 text-[13px] sm:px-3 sm:text-sm font-[family-name:var(--landing-font-sans)] font-medium text-[#1c1c1c]/60 no-underline transition-colors hover:text-[#1c1c1c]"
						>
							Github
						</a>
						<div className="ml-1 sm:ml-4 flex items-center">
							<a
								href={APP_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex min-h-9 items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-3 py-2 text-[13px] sm:min-h-0 sm:px-4 sm:py-2 sm:text-sm font-[family-name:var(--landing-font-sans)] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] no-underline transition-all duration-300 ease-out hover:bg-[#2a2a2a] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0"
							>
								<span className="sm:hidden">App</span>
								<span className="hidden sm:inline">Go to app</span>
								<span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5">
									<ArrowRightIcon />
								</span>
							</a>
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}
