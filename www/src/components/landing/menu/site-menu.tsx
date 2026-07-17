'use client';

import { BookOpen, Code, DiscordLogo, GithubLogo } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { APP_URL, DISCORD_URL, DOCS_URL, GITHUB_URL } from '@/lib/site-links';
import { ArrowRightIcon, PlusCorner } from '../icons';

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
			aria-hidden="true"
			focusable="false"
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
			aria-hidden="true"
			focusable="false"
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}

export function SiteMenu() {
	const [hasScrolled, setHasScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
		<header className="sticky top-3 z-50 mx-3 sm:top-4 sm:mx-4 md:mx-10 transition-all duration-300">
			<div
				className={`site-menu-container relative mx-auto max-w-[1440px] ${
					hasScrolled || isMobileMenuOpen ? 'site-menu-scrolled' : ''
				}`}
			>
				{/* The signature plus signs at all four corners */}
				<span className="site-menu-plus pointer-events-none absolute -left-[7px] -top-[7px] z-10">
					<PlusCorner />
				</span>
				<span className="site-menu-plus pointer-events-none absolute -right-[7px] -top-[7px] z-10">
					<PlusCorner />
				</span>
				<span className="site-menu-plus pointer-events-none absolute -bottom-[7px] -left-[7px] z-10">
					<PlusCorner />
				</span>
				<span className="site-menu-plus pointer-events-none absolute -bottom-[7px] -right-[7px] z-10">
					<PlusCorner />
				</span>

				<nav
					className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6"
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

					{/* Desktop Menu */}
					<div className="hidden md:flex shrink-0 items-center gap-0.5">
						<Link
							href="/#pricing"
							className="px-3 py-2 text-sm font-medium text-[#1c1c1c]/80 no-underline transition-colors duration-200 hover:text-[#1c1c1c] font-[family-name:var(--landing-font-sans)]"
						>
							Pricing
						</Link>
						<a
							href={DOCS_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="px-3 py-2 text-sm font-medium text-[#1c1c1c]/80 no-underline transition-colors duration-200 hover:text-[#1c1c1c] font-[family-name:var(--landing-font-sans)]"
						>
							Docs
						</a>
						<Link
							href="/oss"
							className="px-3 py-2 text-sm font-medium text-[#1c1c1c]/80 no-underline transition-colors duration-200 hover:text-[#1c1c1c] font-[family-name:var(--landing-font-sans)]"
						>
							Contribute
						</Link>
						<div className="mx-2 flex items-center gap-0.5 rounded-full border border-[#1c1c1c]/[0.09] bg-gradient-to-b from-white/80 to-white/30 p-1 shadow-[0_1px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
							<a
								href={GITHUB_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center rounded-full p-1.5 text-[#1c1c1c]/50 transition-all duration-200 hover:bg-[#1c1c1c]/[0.07] hover:text-[#1c1c1c]"
								aria-label="GitHub"
							>
								<GithubLogo size={18} weight="fill" />
							</a>
							<a
								href={DISCORD_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center rounded-full p-1.5 text-[#1c1c1c]/50 transition-all duration-200 hover:bg-[#1c1c1c]/[0.07] hover:text-[#1c1c1c]"
								aria-label="Discord"
							>
								<DiscordLogo size={18} weight="fill" />
							</a>
						</div>
						<a
							href={APP_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="ml-1 inline-flex items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-4 py-2 text-sm font-[family-name:var(--landing-font-sans)] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] no-underline transition-all duration-300 ease-out hover:bg-[#2a2a2a] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0"
						>
							Go to app
						</a>
					</div>

					{/* Mobile Controls */}
					<div className="flex md:hidden items-center gap-1.5 sm:gap-2">
						<a
							href={APP_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-3 py-1.5 text-xs font-[family-name:var(--landing-font-sans)] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] no-underline transition-all duration-300 ease-out hover:bg-[#2a2a2a] active:translate-y-0"
						>
							Go to app
						</a>
						<button
							onClick={() => setIsMobileMenuOpen((open) => !open)}
							aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
							aria-expanded={isMobileMenuOpen}
							className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1c1c1c]/10 bg-white/50 text-[#1c1c1c] hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-colors"
						>
							{isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
						</button>
					</div>
				</nav>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden w-full border-t border-[#1c1c1c]/[0.07] bg-[#f4f4f4]/95 backdrop-blur-xl px-4 py-4 shadow-lg rounded-b-lg">
					<div className="grid grid-cols-2 gap-2">
						<Link
							href="/#pricing"
							className="flex items-center justify-between rounded-lg border border-[#1c1c1c]/10 bg-white/60 px-4 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-white font-[family-name:var(--landing-font-sans)]"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Pricing
						</Link>
						<a
							href={DOCS_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between rounded-lg border border-[#1c1c1c]/10 bg-white/60 px-4 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-white font-[family-name:var(--landing-font-sans)]"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Docs
							<BookOpen size={16} weight="fill" className="text-[#1c1c1c]/50" />
						</a>
						<Link
							href="/oss"
							className="flex items-center justify-between rounded-lg border border-[#1c1c1c]/10 bg-white/60 px-4 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-white font-[family-name:var(--landing-font-sans)]"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Contribute
							<Code size={16} weight="fill" className="text-[#1c1c1c]/50" />
						</Link>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between rounded-lg border border-[#1c1c1c]/10 bg-white/60 px-4 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-white font-[family-name:var(--landing-font-sans)]"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							GitHub
							<GithubLogo
								size={16}
								weight="fill"
								className="text-[#1c1c1c]/50"
							/>
						</a>
						<a
							href={DISCORD_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between rounded-lg border border-[#1c1c1c]/10 bg-white/60 px-4 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-white font-[family-name:var(--landing-font-sans)]"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Discord
							<DiscordLogo
								size={16}
								weight="fill"
								className="text-[#1c1c1c]/50"
							/>
						</a>
					</div>
				</div>
			)}
		</header>
	);
}
