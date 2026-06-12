import type { Metadata } from 'next';
import Link from 'next/link';

import { getSession } from '@/lib/auth-server';
import { getApi } from '@/server/api/caller';

import { ActivityFeed } from './activity-feed';
import { CategoryOnboarding } from './category-onboarding';
import { FramedPanel } from './framed-panel';
import { GithubUsernameCallout } from './github-username-callout';
import { HowItWorks } from './how-it-works';
import { IntegrationCard } from './integration-card';
import { LeaderboardPodium } from './leaderboard-podium';
import { LeaderboardTable } from './leaderboard-table';
import { OssHero } from './oss-hero';
import { OssIntegrationsShell } from './oss-integrations-shell';
import { buildOssHref, parseTagSlugs } from './oss-url';
import { TopContributors } from './top-contributors';
import type { OssIntegrationsView } from './view-tabs';

export const metadata: Metadata = {
	title: 'OSS Integrations',
	description: 'Open source integrations catalog.',
};

type PageProps = {
	searchParams: Promise<{
		page?: string;
		q?: string;
		tags?: string;
		view?: string;
	}>;
};

function parseView(view?: string): OssIntegrationsView {
	return view === 'leaderboard' ? 'leaderboard' : 'integrations';
}

function buildPageHref(
	page: number,
	q: string,
	tags: string[],
	view: OssIntegrationsView,
) {
	return buildOssHref({ page, q, tags, view });
}

export default async function OssIntegrationsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const view = parseView(params.view);
	const page = Math.max(1, Number(params.page) || 1);
	const q = params.q?.trim() ?? '';
	const selectedTags = parseTagSlugs(params.tags);
	const api = await getApi();
	const session = await getSession();
	const [
		profile,
		myIntegrations,
		allTags,
		stats,
		recentActivity,
		integrationsData,
		leaderboardData,
	] = await Promise.all([
		session ? api.account.getProfile() : null,
		session ? api.integrations.listMine() : null,
		view === 'integrations' ? api.integrations.listTags() : null,
		api.integrations.stats(),
		api.integrations.recentActivity({ limit: 10 }),
		view === 'integrations'
			? api.integrations.list({
					page,
					q: q || undefined,
					tags: selectedTags.length > 0 ? selectedTags : undefined,
				})
			: null,
		api.integrations.leaderboard({
			page: view === 'leaderboard' ? page : 1,
		}),
	]);

	const startIndex = (page - 1) * (integrationsData?.pageSize ?? 50);
	const showPodium = view === 'leaderboard' && page === 1;
	const leaderboardTableItems = showPodium
		? leaderboardData.items.slice(3)
		: leaderboardData.items;

	return (
		<main className="pb-16">
			<OssHero signedIn={Boolean(session)} stats={stats} />

			<div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,3fr)]">
				<div>
					{session && !profile?.githubUsername ? (
						<GithubUsernameCallout />
					) : null}

					{view === 'integrations' && allTags ? (
						<CategoryOnboarding
							tags={allTags.items}
							hasActiveFilters={selectedTags.length > 0 || q.length > 0}
						/>
					) : null}

					<OssIntegrationsShell
						q={q}
						selectedTags={selectedTags}
						tags={allTags?.items ?? null}
						view={view}
						integrationsContent={
							integrationsData ? (
								<div id="integrations">
									<div className="mb-4 flex flex-wrap items-baseline gap-3 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
										<span>
											{integrationsData.total} integration
											{integrationsData.total === 1 ? '' : 's'}
										</span>
										{q ? (
											<>
												<span>matching &ldquo;{q}&rdquo;</span>
												<Link
													href={buildOssHref({ tags: selectedTags })}
													className="text-[#1c1c1c] underline underline-offset-2 hover:text-[#4a38f5]"
												>
													clear
												</Link>
											</>
										) : null}
									</div>

									{integrationsData.items.length === 0 ? (
										<div className="border border-dashed border-[#1c1c1c33] px-6 py-12 text-center">
											<p className="text-sm text-[#1c1c1c66]">
												No integrations found.
											</p>
										</div>
									) : (
										<FramedPanel>
											<div className="divide-y divide-[#1c1c1c0d]">
												{integrationsData.items.map((integration, index) => (
													<IntegrationCard
														key={integration.id}
														integration={integration}
														session={Boolean(session)}
														index={startIndex + index + 1}
													/>
												))}
											</div>
										</FramedPanel>
									)}

									{integrationsData.totalPages > 1 ? (
										<Pagination
											page={page}
											totalPages={integrationsData.totalPages}
											q={q}
											tags={selectedTags}
											view={view}
										/>
									) : null}
								</div>
							) : null
						}
						leaderboardContent={
							view === 'leaderboard' ? (
								<>
									{leaderboardData.items.length === 0 ? (
										<div className="border border-dashed border-[#1c1c1c33] px-6 py-12 text-center">
											<p className="text-sm text-[#1c1c1c66]">
												No claimed integrations yet.
											</p>
										</div>
									) : (
										<>
											{showPodium ? (
												<LeaderboardPodium
													entries={leaderboardData.items.slice(0, 3)}
												/>
											) : null}
											<LeaderboardTable entries={leaderboardTableItems} />
										</>
									)}

									{leaderboardData.totalPages > 1 ? (
										<Pagination
											page={page}
											totalPages={leaderboardData.totalPages}
											q={q}
											tags={selectedTags}
											view={view}
										/>
									) : null}
								</>
							) : null
						}
					/>
				</div>

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

					<TopContributors items={leaderboardData.items.slice(0, 5)} />

					<HowItWorks signedIn={Boolean(session)} />
				</aside>
			</div>
		</main>
	);
}

function Pagination({
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
					href={buildPageHref(page - 1, q, tags, view)}
					className="px-3 py-1.5 text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
				>
					← prev
				</Link>
			) : null}
			{Array.from({ length: totalPages }, (_, index) => {
				const pageNumber = index + 1;

				return pageNumber === page ? (
					<span
						key={pageNumber}
						className="inline-flex size-8 items-center justify-center border border-[#1c1c1c] bg-[#1c1c1c] tabular-nums text-white"
					>
						{pageNumber}
					</span>
				) : (
					<Link
						key={pageNumber}
						href={buildPageHref(pageNumber, q, tags, view)}
						className="inline-flex size-8 items-center justify-center border border-transparent tabular-nums text-[#1c1c1c66] transition-colors hover:border-[#1c1c1c1a] hover:text-[#1c1c1c]"
					>
						{pageNumber}
					</Link>
				);
			})}
			{page < totalPages ? (
				<Link
					href={buildPageHref(page + 1, q, tags, view)}
					className="px-3 py-1.5 text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
				>
					next →
				</Link>
			) : null}
		</nav>
	);
}
