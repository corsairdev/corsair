'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const DOCS_URL = 'https://docs.corsair.dev';
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
			className="shrink-0"
		>
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	);
}

function MenuIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="4" y1="12" x2="20" y2="12" />
			<line x1="4" y1="6" x2="20" y2="6" />
			<line x1="4" y1="18" x2="20" y2="18" />
		</svg>
	);
}

function CloseIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}

export function SiteMenu() {
	const [hasScrolled, setHasScrolled] = useState(false);
	const [isScrolling, setIsScrolling] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
				backgroundColor: 'rgba(244, 244, 244, 0.9)',
				backdropFilter: 'blur(10px)',
				WebkitBackdropFilter: 'blur(10px)',
				boxShadow:
					hasScrolled || isScrolling || isMobileMenuOpen
						? '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
						: '0 1px 3px 0 rgba(0, 0, 0, 0)',
			}}
		>
			<div className="mx-auto max-w-[1440px] px-4 py-2 md:px-10">
				<nav
					className="flex min-h-12 w-full min-w-0 items-center justify-between gap-4 rounded-sm px-2 sm:px-4 md:px-10"
					aria-label="Primary navigation"
				>
					<Link
						href="/"
						aria-label="Corsair home"
						className="inline-flex shrink-0 items-center gap-2 sm:gap-2.5 no-underline"
					>
						<Image
							src="/corsair-logo.png"
							alt=""
							width={36}
							height={36}
							className="rounded-sm sm:w-10 sm:h-10"
							priority
						/>
						<span className="font-[family-name:var(--landing-font-sans)] text-base sm:text-lg font-medium tracking-[-0.02em] text-[#1c1c1c]">
							Corsair
						</span>
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex shrink-0 items-center gap-2">
						<a
							href={DOCS_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-sm border border-[#1c1c1c] bg-transparent px-3 py-2 text-xs font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#1c1c1c0d] md:px-4 md:text-[13px]"
						>
							Docs
						</a>
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
							Start free
							<ArrowRightIcon />
						</a>
					</div>

					{/* Mobile Controls */}
					<div className="flex md:hidden items-center gap-1.5 sm:gap-2">
						<a
							href={APP_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 rounded-sm border border-[#1c1c1c] bg-[#1c1c1c] px-2.5 py-1.5 text-[11px] sm:text-xs font-medium text-white no-underline transition-colors hover:bg-[#333]"
						>
							Start free
						</a>
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
							className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1c1c1c] bg-transparent text-[#1c1c1c] hover:bg-[#1c1c1c0d] transition-colors"
						>
							{isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
						</button>
					</div>
				</nav>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden w-full border-t border-[#1c1c1c1a] bg-[#f4f4f4] px-6 py-6 shadow-lg">
					<div className="flex flex-col gap-3">
						<a
							href={DOCS_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between rounded-sm border border-[#1c1c1c] bg-transparent px-4 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#1c1c1c0d]"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							<span>Docs</span>
							<ArrowRightIcon />
						</a>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between rounded-sm border border-[#1c1c1c] bg-transparent px-4 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#1c1c1c0d]"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							<span>Github</span>
							<ArrowRightIcon />
						</a>
					</div>
				</div>
			)}
		</header>
	);
}
