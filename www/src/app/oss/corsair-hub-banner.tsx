'use client';

import { RocketLaunch } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';

import { APP_URL } from '@/lib/site-links';
import { cn } from '@/lib/utils';

import { FramedPanel } from './framed-panel';

function isIntegrationDetailPage(pathname: string) {
	const match = pathname.match(/^\/oss\/([^/]+)$/);
	if (!match) return false;

	const slug = match[1];
	return slug !== 'sign-in' && slug !== 'admin';
}

export function CorsairHubBanner() {
	const pathname = usePathname();
	const secondary = isIntegrationDetailPage(pathname ?? '');

	const content = (
		<>
			<div className="flex min-w-0 items-start gap-3 sm:items-center">
				<RocketLaunch
					size={secondary ? 16 : 18}
					className={cn(
						'mt-0.5 shrink-0 sm:mt-0',
						secondary ? 'text-[#4a38f5]/70' : 'text-[#4a38f5]',
					)}
					aria-hidden
				/>
				<div className="min-w-0">
					<p
						className={cn(
							'font-[family-name:var(--font-landing-mono)] font-medium tracking-[0.02em] uppercase',
							secondary
								? 'text-[9px] text-[#4a38f5]/80'
								: 'text-[10px] text-[#4a38f5]',
						)}
					>
						Corsair Hub
					</p>
					<p
						className={cn(
							'mt-0.5',
							secondary
								? 'text-[13px] leading-snug text-[#1c1c1c]/65'
								: 'text-sm text-[#1c1c1c]/80',
						)}
					>
						Wire Corsair into your app and let us handle OAuth, connect flows,
						and webhooks.
					</p>
				</div>
			</div>
			<a
				href={APP_URL}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					'inline-flex shrink-0 items-center font-[family-name:var(--font-landing-mono)] text-[11px] font-medium no-underline transition-colors',
					secondary
						? 'text-[#4a38f5] hover:text-[#8174f8]'
						: 'rounded-md border border-[#4a38f5]/20 bg-[#4a38f5]/[0.06] px-3 py-1.5 text-[#4a38f5] hover:bg-[#4a38f5]/[0.1]',
				)}
			>
				Go to Hub →
			</a>
		</>
	);

	return (
		<div
			role="region"
			aria-label="Corsair Hub"
			className={cn(
				'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10',
				secondary ? 'pt-3 pb-1' : 'pt-4 pb-2',
			)}
		>
			{secondary ? (
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#4a38f5]/20 bg-[#4a38f5]/[0.04] px-3.5 py-2.5 sm:px-4">
					{content}
				</div>
			) : (
				<FramedPanel className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:px-5">
					{content}
				</FramedPanel>
			)}
		</div>
	);
}
