'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { buildOssIntegrationHref } from './oss-url';

/** Navigates to a random famous, still-grabbable integration. The animated border
 *  is a spinning conic-gradient layer clipped to a 1.5px ring — no global CSS. */
export function PickForMeButton({ slugs }: { slugs: string[] }) {
	const router = useRouter();

	function pick() {
		if (slugs.length === 0) return;
		const slug = slugs[Math.floor(Math.random() * slugs.length)];
		router.push(buildOssIntegrationHref(slug));
	}

	return (
		<span className="relative inline-flex overflow-hidden rounded-lg bg-[#2b2b33] p-[1.5px]">
			<span
				aria-hidden
				className="pointer-events-none absolute inset-[-150%] animate-[spin_3s_linear_infinite] motion-reduce:animate-none"
				style={{
					background:
						'conic-gradient(from 0deg, transparent 0deg 248deg, #7c6cff 300deg, #ffffff 330deg, #7c6cff 356deg, transparent 360deg)',
				}}
			/>
			<Button
				type="button"
				size="sm"
				onClick={pick}
				className="relative gap-1.5 rounded-[8px] bg-[#18181b] font-[family-name:var(--font-landing-mono)] text-[11px] font-semibold tracking-wide text-white hover:bg-[#101013]"
			>
				<svg
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<title>Shuffle</title>
					<path d="M16 3h5v5" />
					<path d="M4 20 21 3" />
					<path d="M21 16v5h-5" />
					<path d="m15 15 6 6" />
					<path d="m4 4 5 5" />
				</svg>
				Pick one for me
			</Button>
		</span>
	);
}
