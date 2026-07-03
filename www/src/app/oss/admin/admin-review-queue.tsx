'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { IntegrationPhase } from '@/db/schema';

import { ContributorLink } from '../contributor-link';
import { FramedPanel } from '../framed-panel';
import { IntegrationStatusBadge } from '../integration-status-badge';
import { formatPoints } from '../integration-reward';
import { buildOssIntegrationHref } from '../oss-url';
import { adminMarkIntegrationMerged } from '@/server/actions/admin-mark-merged';

type ReviewQueueItem = {
	id: string;
	name: string;
	slug: string;
	points: number;
	phase: IntegrationPhase;
	phaseLabel: string;
	occurredAt: string;
	claimerName: string | null;
	claimerGithubUsername: string | null;
	claimerAvatarUrl: string | null;
	urls: {
		issueUrl: string | null;
		prUrl: string | null;
		docsUrl: string | null;
	};
};

export function AdminReviewQueue({
	items,
	readyToReviewCount,
}: {
	items: ReviewQueueItem[];
	readyToReviewCount: number;
}) {
	const readyItems = items.filter((item) => item.phase === 'ready_to_review');
	const otherItems = items.filter((item) => item.phase !== 'ready_to_review');

	return (
		<div className="space-y-10">
			<div className="flex flex-wrap items-baseline gap-3 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
				<span>{readyToReviewCount} ready to review</span>
				<span>{items.length} active claims total</span>
			</div>

			<QueueSection
				title="Ready to review"
				description="Merged PRs waiting to be marked complete."
				items={readyItems}
				emptyMessage="Nothing ready to review right now."
			/>

			<QueueSection
				title="Still in progress"
				description="Active claims that have not reached review yet."
				items={otherItems}
				emptyMessage="No other active claims."
			/>
		</div>
	);
}

function QueueSection({
	title,
	description,
	items,
	emptyMessage,
}: {
	title: string;
	description: string;
	items: ReviewQueueItem[];
	emptyMessage: string;
}) {
	return (
		<section>
			<h2 className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
				{title}
			</h2>
			<p className="mt-2 text-[13px] leading-relaxed text-[#1c1c1c66]">
				{description}
			</p>

			{items.length === 0 ? (
				<div className="mt-4 border border-dashed border-[#1c1c1c33] px-6 py-10 text-center">
					<p className="text-sm text-[#1c1c1c66]">{emptyMessage}</p>
				</div>
			) : (
				<FramedPanel className="mt-4">
					<div className="divide-y divide-[#1c1c1c0d]">
						{items.map((item) => (
							<ReviewQueueRow key={item.id} item={item} />
						))}
					</div>
				</FramedPanel>
			)}
		</section>
	);
}

function ReviewQueueRow({ item }: { item: ReviewQueueItem }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleMarkMerged = async () => {
		setLoading(true);
		setError('');

		try {
			await adminMarkIntegrationMerged(item.id);
			router.refresh();
		} catch (markError) {
			setError(
				markError instanceof Error
					? markError.message
					: 'Failed to mark as merged',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<article className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
			<div className="min-w-0 space-y-3">
				<div className="flex flex-wrap items-center gap-2">
					<Link
						href={buildOssIntegrationHref(item.slug)}
						className="text-[15px] font-medium text-[#1c1c1c] no-underline underline-offset-2 hover:underline"
					>
						{item.name}
					</Link>
					<span className="font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
						{item.slug}
					</span>
					<IntegrationStatusBadge isClaimed phase={item.phase} />
				</div>

				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
					<span>{formatPoints(item.points)} pts</span>
					{item.claimerGithubUsername ? (
						<span className="inline-flex items-center gap-1.5">
							{item.claimerAvatarUrl ? (
								<img
									src={item.claimerAvatarUrl}
									alt=""
									width={14}
									height={14}
									className="size-3.5 rounded-full"
								/>
							) : null}
							<ContributorLink
								githubUsername={item.claimerGithubUsername}
								className="text-[#1c1c1c99] hover:text-[#1c1c1c]"
							>
								@{item.claimerGithubUsername}
							</ContributorLink>
						</span>
					) : (
						<span>{item.claimerName ?? 'Unknown contributor'}</span>
					)}
				</div>

				<div className="flex flex-wrap gap-x-4 gap-y-1 font-[family-name:var(--font-landing-mono)] text-[11px]">
					{item.urls.issueUrl ? (
						<a
							href={item.urls.issueUrl}
							target="_blank"
							rel="noreferrer"
							className="text-[#4a38f5] no-underline hover:underline"
						>
							Issue
						</a>
					) : (
						<span className="text-[#1c1c1c40]">No issue linked</span>
					)}
					{item.urls.prUrl ? (
						<a
							href={item.urls.prUrl}
							target="_blank"
							rel="noreferrer"
							className="text-[#4a38f5] no-underline hover:underline"
						>
							PR
						</a>
					) : (
						<span className="text-[#1c1c1c40]">No PR linked</span>
					)}
				</div>

				{error ? <p className="text-xs text-destructive">{error}</p> : null}
			</div>

			<div className="flex shrink-0 items-center">
				<Button
					type="button"
					size="sm"
					onClick={handleMarkMerged}
					disabled={loading || item.phase !== 'ready_to_review'}
					className="rounded-lg"
				>
					{loading ? 'Marking...' : 'Mark merged'}
				</Button>
			</div>
		</article>
	);
}
