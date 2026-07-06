import Link from 'next/link';

import { getSession } from '@/lib/auth-server';
import { getCurrentProfile } from '@/lib/current-user-server';
import { getApi } from '@/server/api/caller';
import {
	getCachedLeaderboard,
	getCachedListTags,
	getCachedOssStats,
	getCachedRecentActivity,
	getIntegrationListForPage,
} from '@/server/oss-public-cache';

import { ActivityFeed } from './activity-feed';
import { CategoryOnboarding } from './category-onboarding';
import { FramedPanel } from './framed-panel';
import { GithubUsernameCallout } from './github-username-callout';
import { HowItWorks } from './how-it-works';
import { IntegrationCard } from './integration-card';
import { IntegrationListSkeleton } from './integration-list-skeleton';
import { IntegrationTagFilter } from './integration-tag-filter';
import { LeaderboardPodium } from './leaderboard-podium';
import { LeaderboardTable } from './leaderboard-table';
import { OssHero } from './oss-hero';
import { buildOssHref } from './oss-url';
import { TopContributors } from './top-contributors';
import type { OssIntegrationsView } from './view-tabs';

export async function OssHeroSection() {
	const [session, stats] = await Promise.all([
		getSession(),
		getCachedOssStats(),
	]);

	return <OssHero signedIn={Boolean(session)} stats={stats} />;
}

type OssTagFilterSectionProps = {
	selectedTags: string[];
};

export async function OssTagFilterSection({
	selectedTags,
}: OssTagFilterSectionProps) {
	const { items: tags } = await getCachedListTags();
	return <IntegrationTagFilter tags={tags} selectedSlugs={selectedTags} />;
}

type OssCategoryOnboardingSectionProps = {
	selectedTags: string[];
	q: string;
};

export async function OssCategoryOnboardingSection({
	selectedTags,
	q,
}: OssCategoryOnboardingSectionProps) {
	const [session, { items: tags }] = await Promise.all([
		getSession(),
		getCachedListTags(),
	]);

	return (
		<CategoryOnboarding
			tags={tags}
			hasActiveFilters={selectedTags.length > 0 || q.length > 0}
			signedIn={Boolean(session)}
		/>
	);
}

export async function OssUserSection() {
	const session = await getSession();
	if (!session) return null;

	try {
		const profile = await getCurrentProfile();
		if (profile?.githubUsername) return null;
		return <GithubUsernameCallout />;
	} catch (error) {
		console.error('[oss] github username callout failed', error);
		return null;
	}
}

type OssIntegrationsSectionProps = {
	page: number;
	q: string;
	selectedTags: string[];
};

export async function OssIntegrationsSection({
	page,
	q,
	selectedTags,
}: OssIntegrationsSectionProps) {
	const session = await getSession();

	let integrationsData: Awaited<ReturnType<typeof getIntegrationListForPage>>;
	try {
		integrationsData = await getIntegrationListForPage(
			page,
			q,
			selectedTags,
			session?.user.id,
		);
	} catch (error) {
		console.error('[oss] integration list failed', error);
		return <IntegrationListSkeleton count={8} />;
	}

	const startIndex = (page - 1) * integrationsData.pageSize;

	if (integrationsData.items.length === 0) {
		return (
			<div className="border border-dashed border-[#1c1c1c33] px-6 py-12 text-center">
				<p className="text-sm text-[#1c1c1c66]">No integrations found.</p>
			</div>
		);
	}

	return (
		<div id="integrations">
			<div className="mb-4 flex flex-wrap items-baseline gap-3 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
				<span>
					{integrationsData.total} integration
					{integrationsData.total === 1 ? '' : 's'}
					{q ? (
						<>
							{' '}
							matching &ldquo;{q}&rdquo;{' '}
							<Link
								href={buildOssHref({ tags: selectedTags })}
								className="text-[#1c1c1c] underline underline-offset-2 hover:text-[#4a38f5]"
							>
								clear
							</Link>
						</>
					) : null}
				</span>
			</div>
			<FramedPanel>
				<div className="divide-y divide-[#1c1c1c0d]">
					{integrationsData.items.map((integration, index) => (
						<IntegrationCard
							key={integration.id}
							integration={integration}
							session={Boolean(session)}
							index={startIndex + index + 1}
							wipIntegrationName={integrationsData.wipIntegrationName}
							claimBlockReason={integrationsData.claimBlockReason}
						/>
					))}
				</div>
			</FramedPanel>
			{integrationsData.totalPages > 1 ? (
				<OssPagination
					page={page}
					totalPages={integrationsData.totalPages}
					q={q}
					tags={selectedTags}
					view="integrations"
				/>
			) : null}
		</div>
	);
}

type OssLeaderboardSectionProps = {
	page: number;
	q: string;
	selectedTags: string[];
};

export async function OssLeaderboardSection({
	page,
	q,
	selectedTags,
}: OssLeaderboardSectionProps) {
	const leaderboardData = await getCachedLeaderboard(page);
	const showPodium = page === 1;
	const tableItems = showPodium
		? leaderboardData.items.slice(3)
		: leaderboardData.items;

	if (leaderboardData.items.length === 0) {
		return (
			<div className="border border-dashed border-[#1c1c1c33] px-6 py-12 text-center">
				<p className="text-sm text-[#1c1c1c66]">No claimed integrations yet.</p>
			</div>
		);
	}

	return (
		<>
			{showPodium ? (
				<LeaderboardPodium entries={leaderboardData.items.slice(0, 3)} />
			) : null}
			<LeaderboardTable entries={tableItems} />
			{leaderboardData.totalPages > 1 ? (
				<OssPagination
					page={page}
					totalPages={leaderboardData.totalPages}
					q={q}
					tags={selectedTags}
					view="leaderboard"
				/>
			) : null}
		</>
	);
}

type OssSidebarSectionProps = {
	view: OssIntegrationsView;
};

export async function OssSidebarSection({ view }: OssSidebarSectionProps) {
	const session = await getSession();
	const api = session ? await getApi() : null;

	const [recentActivityResult, leaderboardResult, myIntegrationsResult] =
		await Promise.allSettled([
			getCachedRecentActivity(10),
			getCachedLeaderboard(1),
			api ? api.integrations.listMine() : Promise.resolve(null),
		]);

	if (recentActivityResult.status === 'rejected') {
		console.error('[oss sidebar] recent activity failed', recentActivityResult.reason);
	}
	if (leaderboardResult.status === 'rejected') {
		console.error('[oss sidebar] leaderboard failed', leaderboardResult.reason);
	}
	if (myIntegrationsResult.status === 'rejected') {
		console.error('[oss sidebar] listMine failed', myIntegrationsResult.reason);
	}

	const recentActivity =
		recentActivityResult.status === 'fulfilled'
			? recentActivityResult.value
			: { items: [] };
	const leaderboardData =
		leaderboardResult.status === 'fulfilled'
			? leaderboardResult.value
			: { items: [], totalPages: 1 };
	const myIntegrations =
		myIntegrationsResult.status === 'fulfilled'
			? myIntegrationsResult.value
			: null;

	return (
		<aside className="space-y-10 lg:sticky lg:top-20 lg:self-start">
			{myIntegrations && myIntegrations.items.length > 0 ? (
				<section>
					<h2 className="mb-3 font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
						Your integrations
					</h2>
					<ul className="flex flex-wrap gap-x-3 gap-y-1.5">
						{myIntegrations.items.map((integration) => (
							<li key={integration.id}>
								<Link
									href={`/integrations/${integration.slug}`}
									className="font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#4a38f5] hover:text-[#4a38f5]"
								>
									{integration.slug}
								</Link>
							</li>
						))}
					</ul>
				</section>
			) : null}
			<ActivityFeed items={recentActivity.items} />
			{view !== 'leaderboard' ? (
				<TopContributors items={leaderboardData.items.slice(0, 5)} />
			) : null}
			<HowItWorks signedIn={Boolean(session)} />
		</aside>
	);
}

function getPaginationItems(
	page: number,
	totalPages: number,
): Array<number | 'ellipsis'> {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	const items: Array<number | 'ellipsis'> = [1];
	const start = Math.max(2, page - 1);
	const end = Math.min(totalPages - 1, page + 1);
	if (start > 2) items.push('ellipsis');
	for (let i = start; i <= end; i++) items.push(i);
	if (end < totalPages - 1) items.push('ellipsis');
	items.push(totalPages);
	return items;
}

function OssPagination({
	page,
	totalPages,
	q,
	tags,
	view,
}: {
	page: number;
	totalPages: number;
	q: string;
	tags: string[];
	view: OssIntegrationsView;
}) {
	return (
		<nav
			className="mt-8 flex flex-wrap items-center justify-center gap-1 font-[family-name:var(--font-landing-mono)] text-[12px]"
			aria-label="Pagination"
		>
			{page > 1 ? (
				<Link
					href={buildOssHref({ page: page - 1, q, tags, view })}
					className="px-3 py-1.5 text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
				>
					← prev
				</Link>
			) : null}
			{getPaginationItems(page, totalPages).map((item, index) =>
				item === 'ellipsis' ? (
					<span
						key={`ellipsis-${index}`}
						className="inline-flex size-8 items-center justify-center text-[#1c1c1c66]"
						aria-hidden="true"
					>
						…
					</span>
				) : item === page ? (
					<span
						key={item}
						aria-current="page"
						className="inline-flex size-8 items-center justify-center border border-[#1c1c1c] bg-[#1c1c1c] tabular-nums text-white"
					>
						{item}
					</span>
				) : (
					<Link
						key={item}
						href={buildOssHref({ page: item, q, tags, view })}
						className="inline-flex size-8 items-center justify-center border border-transparent tabular-nums text-[#1c1c1c66] transition-colors hover:border-[#1c1c1c1a] hover:text-[#1c1c1c]"
					>
						{item}
					</Link>
				),
			)}
			{page < totalPages ? (
				<Link
					href={buildOssHref({ page: page + 1, q, tags, view })}
					className="px-3 py-1.5 text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
				>
					next →
				</Link>
			) : null}
		</nav>
	);
}
