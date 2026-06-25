import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { IntegrationListSkeleton } from './integration-list-skeleton';
import { OssIntegrationsShell } from './oss-integrations-shell';
import {
	OssCategoryOnboardingSection,
	OssHeroSection,
	OssIntegrationsSection,
	OssLeaderboardSection,
	OssSidebarSection,
	OssTagFilterSection,
	OssUserSection,
} from './oss-sections';
import {
	LeaderboardSkeleton,
	OssHeroSkeleton,
	OssSidebarSkeleton,
	TagFilterSkeleton,
} from './oss-skeletons';
import { parseTagSlugs } from './oss-url';
import type { OssIntegrationsView } from './view-tabs';

export const metadata: Metadata = {
	title: 'OSS Integrations',
};

type PageProps = {
	searchParams: Promise<{
		page?: string;
		q?: string;
		tags?: string | string[];
		view?: string;
	}>;
};

function parseView(view?: string): OssIntegrationsView {
	return view === 'leaderboard' ? 'leaderboard' : 'integrations';
}

function normalizeQueryParam(
	value: string | string[] | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	if (Array.isArray(value)) return value.join(',');
	return value;
}

export default async function OssIntegrationsPage({ searchParams }: PageProps) {
	// gate: hackathon waitlist until launch
	redirect('/oss/waitlist');

	const params = await searchParams;
	const view = parseView(params.view);
	const page = Math.max(1, Number(params.page) || 1);
	const q = params.q?.trim() ?? '';
	const selectedTags = parseTagSlugs(normalizeQueryParam(params.tags));

	return (
		<main className="pb-16">
			<Suspense fallback={<OssHeroSkeleton />}>
				<OssHeroSection />
			</Suspense>

			<div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,3fr)]">
				<div>
					<Suspense fallback={null}>
						<OssUserSection />
					</Suspense>

					{view === 'integrations' ? (
						<Suspense fallback={null}>
							<OssCategoryOnboardingSection selectedTags={selectedTags} q={q} />
						</Suspense>
					) : null}

					<OssIntegrationsShell
						q={q}
						selectedTags={selectedTags}
						view={view}
						tagFilter={
							<Suspense fallback={<TagFilterSkeleton />}>
								<OssTagFilterSection selectedTags={selectedTags} />
							</Suspense>
						}
						integrationsContent={
							view === 'integrations' ? (
								<Suspense fallback={<IntegrationListSkeleton count={8} />}>
									<OssIntegrationsSection
										page={page}
										q={q}
										selectedTags={selectedTags}
									/>
								</Suspense>
							) : null
						}
						leaderboardContent={
							view === 'leaderboard' ? (
								<Suspense fallback={<LeaderboardSkeleton />}>
									<OssLeaderboardSection
										page={page}
										q={q}
										selectedTags={selectedTags}
									/>
								</Suspense>
							) : null
						}
					/>
				</div>

				<Suspense fallback={<OssSidebarSkeleton />}>
					<OssSidebarSection view={view} />
				</Suspense>
			</div>
		</main>
	);
}
