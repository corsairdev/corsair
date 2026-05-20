'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const GITHUB_URL = 'https://github.com/corsairdev/corsair/';
const APP_URL = 'https://app.corsair.dev';

function ArrowRightIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	);
}

export function TwentyMenu() {
	const [hasScrolled, setHasScrolled] = useState(false);
	const [isScrolling, setIsScrolling] = useState(false);

	const handleScroll = useCallback(() => {
		const scrolled = window.scrollY > 8;
		setHasScrolled(scrolled);
		setIsScrolling(true);
		const t = window.setTimeout(() => setIsScrolling(false), 150);
		return () => window.clearTimeout(t);
	}, []);

	useEffect(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	return (
		<header
			className="sticky top-0 z-50 w-full transition-shadow duration-200"
			style={{
				backgroundColor: '#f4f4f4',
				backdropFilter: 'blur(10px)',
				WebkitBackdropFilter: 'blur(10px)',
				boxShadow:
					hasScrolled || isScrolling
						? '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
						: '0 1px 3px 0 rgba(0, 0, 0, 0)',
			}}
		>
			<div className="mx-auto max-w-[1440px] px-4 py-2 md:px-10">
				<nav
					className="flex min-h-12 w-full min-w-0 items-center justify-between gap-4 rounded-sm px-4 md:px-10"
					aria-label="Primary navigation"
				>
					<Link href="/twenty" aria-label="Corsair home" className="shrink-0">
						<Image
							src="/corsair-logo.ico"
							alt="Corsair"
							width={40}
							height={40}
							className="rounded-sm"
							priority
						/>
					</Link>

					<div className="flex shrink-0 items-center gap-2">
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-sm border border-[#1c1c1c] bg-transparent px-3 py-2 text-xs font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#1c1c1c0d] md:px-4 md:text-[13px]"
						>
							Github
						</a>
						<a
							href={APP_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 rounded-sm border border-[#1c1c1c] bg-[#1c1c1c] px-3 py-2 text-xs font-medium text-white no-underline transition-colors hover:bg-[#333] md:px-4 md:text-[13px]"
						>
							Go to App
							<ArrowRightIcon />
						</a>
					</div>
				</nav>
			</div>
		</header>
	);
}
