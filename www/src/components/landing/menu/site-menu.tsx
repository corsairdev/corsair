'use client';

import type { Icon } from '@phosphor-icons/react';
import {
	ArrowUpRight,
	BookOpen,
	CaretDown,
	Code,
	DiscordLogo,
	GithubLogo,
	PlugsConnected,
	Scales,
	Sparkle,
	SquaresFour,
} from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu } from 'radix-ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	CLAIM_HREF,
	DISCORD_URL,
	DOCS_URL,
	GITHUB_URL,
	hubMeSignInUrl,
} from '@/lib/site-links';
import { PlusCorner } from '../icons';

// Corsair is the company; each product sits under Products, the way Vercel
// lists v0 and its other products. Lug's page is /mcp-gateway (/lug redirects
// there); Hub, for developers, is /developers.
type Product = { href: string; name: string; line: string; icon: Icon };

const PRODUCTS: readonly Product[] = [
	{
		href: '/mcp-gateway',
		name: 'Lug',
		line: 'MCP gateway: one URL for every app and agent',
		icon: PlugsConnected,
	},
	{
		href: '/developers',
		name: 'Hub',
		line: 'For developers: the open-source SDK, managed auth and the console',
		icon: Code,
	},
];

type ExploreLink = {
	href: string;
	label: string;
	icon: Icon;
	external?: boolean;
};

const EXPLORE_LINKS: readonly ExploreLink[] = [
	{ href: '/integrations', label: 'Integrations', icon: SquaresFour },
	{ href: '/skills', label: 'Skills', icon: Sparkle },
	{ href: '/compare', label: 'Compare', icon: Scales },
	{ href: DOCS_URL, label: 'Docs', icon: BookOpen, external: true },
];

/** Beside Products on the desktop bar; Docs (external) follows them. */
const NAV_LINKS = [
	{ href: '/skills', label: 'Skills' },
	{ href: '/pricing', label: 'Pricing' },
] as const;

const NAV_ITEM_CLASS =
	'whitespace-nowrap px-3 py-2 text-sm font-medium text-[#1c1c1c]/80 no-underline transition-colors duration-200 hover:text-[#1c1c1c] font-[family-name:var(--landing-font-sans)]';

const MOBILE_LINK_CLASS =
	'flex items-center justify-between rounded-lg border border-[#1c1c1c]/10 bg-white/60 px-4 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-white font-[family-name:var(--landing-font-sans)]';

function ProductMark({
	product,
	size = 36,
}: {
	product: Product;
	size?: number;
}) {
	const Mark = product.icon;
	const lug = product.name === 'Lug';
	return (
		<span
			aria-hidden="true"
			className={`grid shrink-0 place-items-center rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.12)] ${
				lug ? 'bg-[#4a38f5] text-white' : 'bg-[#1c1c1c] text-white'
			}`}
			style={{ width: size, height: size }}
		>
			<Mark size={Math.round(size * 0.5)} weight="bold" />
		</span>
	);
}

/** The Products panel: products on the left, the rest of the site on the right. */
function ProductsPanel() {
	return (
		<div className="site-menu-panel-card grid grid-cols-[1.4fr_1fr] gap-1 rounded-2xl border border-[#1c1c1c]/[0.08] bg-[#f7f7f7]/95 p-2 font-[family-name:var(--landing-font-sans)] shadow-[0_16px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
			<div className="flex flex-col gap-0.5 p-1">
				<p className="px-3 pb-1 pt-2 font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
					Products
				</p>
				{PRODUCTS.map((product) => (
					<NavigationMenu.Link key={product.href} asChild>
						<Link
							href={product.href}
							className="site-menu-panel-link flex items-start gap-3 rounded-xl p-3 no-underline outline-none transition-colors duration-150 hover:bg-white focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4a38f5]/40"
						>
							<ProductMark product={product} />
							<span className="flex min-w-0 flex-col gap-0.5">
								<span className="text-sm font-semibold text-[#1c1c1c]">
									{product.name}
								</span>
								<span className="text-[13px] leading-snug text-[#1c1c1c99]">
									{product.line}
								</span>
							</span>
						</Link>
					</NavigationMenu.Link>
				))}
			</div>
			<div className="flex flex-col gap-0.5 border-l border-[#1c1c1c]/[0.07] p-1 pl-2">
				<p className="px-3 pb-1 pt-2 font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
					Explore
				</p>
				{EXPLORE_LINKS.map((link) => {
					const LinkIcon = link.icon;
					const className =
						'site-menu-panel-link flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[#1c1c1c]/80 no-underline outline-none transition-colors duration-150 hover:bg-white hover:text-[#1c1c1c] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4a38f5]/40';
					const inner = (
						<>
							<LinkIcon
								size={16}
								weight="duotone"
								className="text-[#1c1c1c]/50"
								aria-hidden
							/>
							{link.label}
							{link.external ? (
								<ArrowUpRight
									size={12}
									className="ml-auto text-[#1c1c1c]/40"
									aria-hidden
								/>
							) : null}
						</>
					);
					return (
						<NavigationMenu.Link key={link.href} asChild>
							{link.external ? (
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className={className}
								>
									{inner}
								</a>
							) : (
								<Link href={link.href} className={className}>
									{inner}
								</Link>
							)}
						</NavigationMenu.Link>
					);
				})}
			</div>
		</div>
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
	// The open desktop panel ('' when none). Controlled so a mouse click on the
	// trigger after a hover has opened it keeps it open instead of closing it.
	const [openMenu, setOpenMenu] = useState('');
	const lastPointer = useRef('');
	const pathname = usePathname();

	// A new page closes both menus, however it was reached.
	useEffect(() => {
		setOpenMenu('');
		setIsMobileMenuOpen(false);
	}, [pathname]);

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

				<NavigationMenu.Root
					value={openMenu}
					onValueChange={setOpenMenu}
					delayDuration={80}
					className="relative flex w-full min-w-0 items-center gap-2 sm:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6"
					aria-label="Primary navigation"
				>
					<Link
						href="/"
						aria-label="Corsair home"
						className="relative z-10 inline-flex shrink-0 items-center gap-2 sm:gap-2.5 no-underline transition-opacity hover:opacity-80"
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

					{/* Desktop center: Products, then the pages people look for most */}
					<div className="absolute left-1/2 hidden -translate-x-1/2 xl:flex items-center">
						<NavigationMenu.List className="m-0 flex list-none items-center gap-0.5 p-0">
							<NavigationMenu.Item value="products">
								<NavigationMenu.Trigger
									className={`site-menu-trigger inline-flex items-center gap-1 rounded-md bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#4a38f5]/40 data-[state=open]:text-[#1c1c1c] [&[data-state=open]>svg]:rotate-180 ${NAV_ITEM_CLASS}`}
									onPointerDown={(event) => {
										lastPointer.current = event.pointerType;
									}}
									onClick={(event) => {
										// Hover already opened it: a mouse click shouldn't close it again.
										// Keyboard (detail 0) and touch still toggle.
										if (
											openMenu === 'products' &&
											lastPointer.current === 'mouse' &&
											event.detail > 0
										) {
											event.preventDefault();
										}
									}}
								>
									Products
									<CaretDown
										size={12}
										weight="bold"
										aria-hidden
										className="text-[#1c1c1c]/50 transition-transform duration-200 motion-reduce:transition-none"
									/>
								</NavigationMenu.Trigger>
								<NavigationMenu.Content className="site-menu-panel absolute left-1/2 top-full -ml-[310px] w-[620px] pt-5">
									<ProductsPanel />
								</NavigationMenu.Content>
							</NavigationMenu.Item>
							{NAV_LINKS.map((link) => (
								<NavigationMenu.Item key={link.href}>
									<NavigationMenu.Link asChild active={pathname === link.href}>
										<Link href={link.href} className={NAV_ITEM_CLASS}>
											{link.label}
										</Link>
									</NavigationMenu.Link>
								</NavigationMenu.Item>
							))}
							<NavigationMenu.Item>
								<NavigationMenu.Link asChild>
									<a
										href={DOCS_URL}
										target="_blank"
										rel="noopener noreferrer"
										className={NAV_ITEM_CLASS}
									>
										Docs
									</a>
								</NavigationMenu.Link>
							</NavigationMenu.Item>
						</NavigationMenu.List>
					</div>

					{/* Desktop right actions */}
					<div className="relative z-10 ml-auto hidden xl:flex shrink-0 items-center gap-0.5">
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
							href={hubMeSignInUrl()}
							className="ml-1 px-2 py-2 text-sm font-[family-name:var(--landing-font-sans)] font-medium text-[#1c1c1c99] no-underline transition-colors hover:text-[#1c1c1c]"
						>
							Sign in
						</a>
						<a
							href={CLAIM_HREF}
							className="ml-1 inline-flex items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-4 py-2 text-sm font-[family-name:var(--landing-font-sans)] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] no-underline transition-all duration-300 ease-out hover:bg-[#2a2a2a] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0"
						>
							Get started
						</a>
					</div>

					{/* Mobile Controls */}
					<div className="ml-auto flex xl:hidden items-center gap-1.5 sm:gap-2">
						<a
							href={CLAIM_HREF}
							className="inline-flex items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-3 py-1.5 text-xs font-[family-name:var(--landing-font-sans)] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] no-underline transition-all duration-300 ease-out hover:bg-[#2a2a2a] active:translate-y-0"
						>
							Get started
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
				</NavigationMenu.Root>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMobileMenuOpen && (
				<div className="xl:hidden w-full border-t border-[#1c1c1c]/[0.07] bg-[#f4f4f4]/95 backdrop-blur-xl px-4 py-4 shadow-lg rounded-b-lg">
					<p className="mb-2 px-1 font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
						Products
					</p>
					<div className="grid gap-2 sm:grid-cols-2">
						{PRODUCTS.map((product) => (
							<Link
								key={product.href}
								href={product.href}
								className="flex items-start gap-3 rounded-lg border border-[#1c1c1c]/10 bg-white/60 px-4 py-3 no-underline transition-colors hover:bg-white font-[family-name:var(--landing-font-sans)]"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<ProductMark product={product} size={32} />
								<span className="flex min-w-0 flex-col gap-0.5">
									<span className="text-sm font-semibold text-[#1c1c1c]">
										{product.name}
									</span>
									<span className="text-[13px] leading-snug text-[#1c1c1c99]">
										{product.line}
									</span>
								</span>
							</Link>
						))}
					</div>
					<div className="mt-4 grid grid-cols-2 gap-2">
						{[
							...NAV_LINKS,
							{ href: '/integrations', label: 'Integrations' },
						].map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={MOBILE_LINK_CLASS}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<a
							href={DOCS_URL}
							target="_blank"
							rel="noopener noreferrer"
							className={MOBILE_LINK_CLASS}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Docs
							<BookOpen size={16} weight="fill" className="text-[#1c1c1c]/50" />
						</a>
						<a
							href={hubMeSignInUrl()}
							className={MOBILE_LINK_CLASS}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Sign in
						</a>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className={MOBILE_LINK_CLASS}
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
							className={MOBILE_LINK_CLASS}
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
