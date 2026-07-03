import type { Metadata } from 'next';
import Link from 'next/link';

import { getApi } from '@/server/api/caller';

import { AdminReviewQueue } from './admin-review-queue';

export const metadata: Metadata = {
	title: 'OSS Admin',
	robots: { index: false, follow: false },
};

export default async function OssAdminPage() {
	const api = await getApi();
	const queue = await api.admin.reviewQueue();

	return (
		<main className="pb-16">
			<Link
				href="/oss"
				className="mb-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
			>
				← Back to OSS
			</Link>

			<div className="pt-8 pb-6">
				<p className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
					Admin
				</p>
				<h1 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-light tracking-[-0.02em] text-[#1c1c1c]">
					Review queue
				</h1>
				<p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#1c1c1c99]">
					Mark integrations as merged after their PR lands in main. This awards
					points to the contributor and moves the integration to finished.
				</p>
			</div>

			<AdminReviewQueue
				items={queue.items}
				readyToReviewCount={queue.readyToReviewCount}
			/>
		</main>
	);
}
