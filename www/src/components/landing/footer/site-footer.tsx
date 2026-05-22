'use client';

import Image from 'next/image';
import Link from 'next/link';

const DOCS_URL = 'https://docs.corsair.dev';
const GITHUB_URL = 'https://github.com/corsairdev/corsair/';
const APP_URL = 'https://app.corsair.dev';
const TWITTER_URL = 'https://x.com/corsairdotdev';

function GitHubIcon() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
			<path d="M9 18c-4.51 2-5-2-7-2" />
		</svg>
	);
}

function TwitterIcon() {
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
			<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
		</svg>
	);
}

export function SiteFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full border-t border-[#1c1c1c1a] bg-[#f4f4f4] py-12 md:py-16">
			<div className="mx-auto max-w-[1440px] px-4 md:px-10">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
					{/* Brand Column */}
					<div className="flex flex-col items-start gap-4">
						<Link
							href="/"
							aria-label="Corsair home"
							className="inline-flex items-center gap-2.5 no-underline"
						>
							<Image
								src="/corsair-logo.png"
								alt=""
								width={32}
								height={32}
								className="rounded-sm"
							/>
							<span className="font-[family-name:var(--landing-font-sans)] text-lg font-medium tracking-[-0.02em] text-[#1c1c1c]">
								Corsair
							</span>
						</Link>
						<p className="text-sm leading-relaxed text-[#1c1c1c99]">
							AI-first integrations and tools platform. Secure, multi-tenant
							execution and OAuth management for developers.
						</p>
					</div>

					{/* Product Column */}
					<div className="flex flex-col gap-3">
						<h3 className="font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
							Product
						</h3>
						<ul className="flex flex-col gap-2 p-0 list-none">
							<li>
								<a
									href={DOCS_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-[#1c1c1c99] no-underline transition-colors hover:text-[#1c1c1c]"
								>
									Documentation
								</a>
							</li>
							<li>
								<a
									href={GITHUB_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-[#1c1c1c99] no-underline transition-colors hover:text-[#1c1c1c]"
								>
									GitHub
								</a>
							</li>
							<li>
								<a
									href={APP_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-[#1c1c1c99] no-underline transition-colors hover:text-[#1c1c1c]"
								>
									Cloud Dashboard
								</a>
							</li>
						</ul>
					</div>

					{/* Resources Column */}
					<div className="flex flex-col gap-3">
						<h3 className="font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
							Developers
						</h3>
						<ul className="flex flex-col gap-2 p-0 list-none">
							<li>
								<a
									href={`${GITHUB_URL}/issues`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-[#1c1c1c99] no-underline transition-colors hover:text-[#1c1c1c]"
								>
									Issues
								</a>
							</li>
							<li>
								<a
									href={`${GITHUB_URL}/blob/main/LICENSE`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-[#1c1c1c99] no-underline transition-colors hover:text-[#1c1c1c]"
								>
									License (MIT)
								</a>
							</li>
						</ul>
					</div>

					{/* Connect Column */}
					<div className="flex flex-col gap-3">
						<h3 className="font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
							Community
						</h3>
						<div className="flex items-center gap-4">
							<a
								href={GITHUB_URL}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub"
								className="text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
							>
								<GitHubIcon />
							</a>
							<a
								href={TWITTER_URL}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
								className="text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
							>
								<TwitterIcon />
							</a>
						</div>
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1c1c1c0d] pt-8 sm:flex-row">
					<p className="text-xs text-[#1c1c1c66]">
						&copy; {currentYear} Corsair. All rights reserved.
					</p>
					<div className="flex gap-4">
						<Link
							href="/privacy"
							className="text-xs text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="text-xs text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
