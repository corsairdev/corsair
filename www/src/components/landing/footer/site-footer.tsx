'use client';

import { GithubLogo, TwitterLogo } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';

const DOCS_URL = 'https://docs.corsair.dev';
const GITHUB_URL = 'https://github.com/corsairdev/corsair/';
const APP_URL = 'https://app.corsair.dev';
const TWITTER_URL = 'https://x.com/corsairdotdev';

// Social Icons imported from @phosphor-icons/react

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
								<GithubLogo size={20} />
							</a>
							<a
								href={TWITTER_URL}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
								className="text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
							>
								<TwitterLogo size={20} />
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
