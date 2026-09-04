import type { Metadata } from 'next';
import { Suspense } from 'react';

import { IntegrationListSkeleton } from './integration-list-skeleton';
import { OssIntegrationsShell } from './oss-integrations-shell';
import {
	OssCategoryOnboardingSection,
	OssHeroSection,
	OssIntegrationsSection,
	OssSidebarSection,
	OssTagFilterSection,
	OssUserSection,
} from './oss-sections';
import {
	OssHeroSkeleton,
	OssSidebarSkeleton,
	TagFilterSkeleton,
} from './oss-skeletons';
import { parseTagSlugs } from './oss-url';

export const metadata: Metadata = {
	title: 'OSS Integrations',
	description:
		"Build integrations in the open and earn AI credits — 1 point = $1. Your code ships to thousands of developers via Corsair's open catalog.",
};

type PageProps = {
	searchParams: Promise<{
		page?: string;
		q?: string;
		tags?: string | string[];
	}>;
};

function normalizeQueryParam(
	value: string | string[] | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	if (Array.isArray(value)) return value.join(',');
	return value;
}

export default async function OssIntegrationsPage({ searchParams }: PageProps) {
	const params = await searchParams;
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

					<Suspense fallback={null}>
						<OssCategoryOnboardingSection selectedTags={selectedTags} q={q} />
					</Suspense>

					<OssIntegrationsShell
						q={q}
						tagFilter={
							<Suspense fallback={<TagFilterSkeleton />}>
								<OssTagFilterSection selectedTags={selectedTags} />
							</Suspense>
						}
						integrationsContent={
							<Suspense fallback={<IntegrationListSkeleton count={8} />}>
								<OssIntegrationsSection
									page={page}
									q={q}
									selectedTags={selectedTags}
								/>
							</Suspense>
						}
					/>
				</div>

				<Suspense fallback={<OssSidebarSkeleton />}>
					<OssSidebarSection />
				</Suspense>
			</div>
		</main>
	);
}
