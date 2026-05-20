'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { TwentyLogo } from '../icons/twenty-logo';

const NAV_ITEMS = [
	{ label: 'Why', href: '/why-twenty' },
	{ label: 'Resources', href: '#', hasDropdown: true },
	{ label: 'Customers', href: '/customers' },
	{ label: 'Pricing', href: '/pricing' },
] as const;

function GithubIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
			<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
		</svg>
	);
}

function DiscordIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
			<path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
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
					className="grid min-h-12 w-full grid-cols-[auto_1fr_auto] items-center gap-4 rounded-sm px-4 md:px-10"
					aria-label="Primary navigation"
				>
					<Link href="/twenty" aria-label="Home" className="shrink-0">
						<TwentyLogo size={40} fillColor="#ffffff" backgroundColor="#1c1c1c" />
					</Link>

					<ul className="hidden items-center gap-8 md:flex">
						{NAV_ITEMS.map((item, index) => (
							<li key={item.label} className="flex items-center gap-8">
								<Link
									href={item.href}
									className="font-[family-name:var(--twenty-font-mono)] text-[13px] font-medium uppercase tracking-normal text-[#1c1c1c] no-underline transition-colors hover:text-[#4a38f5]"
								>
									{item.label}
									{'hasDropdown' in item && item.hasDropdown ? (
										<svg
											className="ml-1 inline-block"
											width="8"
											height="8"
											viewBox="0 0 10 10"
											fill="none"
											aria-hidden
										>
											<path
												d="M2 3.5L5 6.5L8 3.5"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									) : null}
								</Link>
								{index < NAV_ITEMS.length - 1 ? (
									<span
										className="h-2.5 border-l border-[#1c1c1c66]"
										aria-hidden
									/>
								) : null}
							</li>
						))}
					</ul>

					<div className="hidden items-center gap-5 md:flex">
						<a
							href="https://github.com/twentyhq/twenty"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center text-[#1c1c1c] no-underline"
							aria-label="GitHub (opens in new tab)"
						>
							<GithubIcon />
						</a>
						<span className="h-2.5 border-l border-[#1c1c1c66]" aria-hidden />
						<a
							href="https://discord.gg/cx5n4Jzs57"
							target="_blank"
							rel="noopener noreferrer"
							className="hidden text-[#1c1c1c] no-underline lg:flex"
							aria-label="Discord (opens in new tab)"
						>
							<DiscordIcon />
						</a>
						<span className="hidden h-2.5 border-l border-[#1c1c1c66] lg:block" aria-hidden />
						<Link
							href="https://app.twenty.com/welcome"
							className="rounded-sm border border-[#1c1c1c] bg-transparent px-4 py-2 text-[13px] font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#1c1c1c0d]"
						>
							Log in
						</Link>
						<Link
							href="https://app.twenty.com/welcome"
							className="rounded-sm border border-[#1c1c1c] bg-[#1c1c1c] px-4 py-2 text-[13px] font-medium text-white no-underline transition-colors hover:bg-[#333]"
						>
							Get started
						</Link>
					</div>

					<div className="flex items-center gap-1 md:hidden">
						<Link
							href="https://app.twenty.com/welcome"
							className="rounded-sm border border-[#1c1c1c] bg-[#1c1c1c] px-3 py-2 text-xs font-medium text-white no-underline"
						>
							Get started
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
