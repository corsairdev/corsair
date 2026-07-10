import { unstable_cache } from 'next/cache';
import { cache } from 'react';

import { db } from '@/db';
import {
	getClaimExpiredForUser,
	getLatestStatusForIntegration,
	getUserClaimEligibility,
} from '@/db/integration-status';
import { isIntegrationActivelyClaimed } from '@/lib/integration-phases';
import { appRouter } from '@/server/api/root';

export const INTEGRATIONS_CACHE_TAG = 'integrations';

export function integrationCacheTag(slug: string) {
	return `integration:${slug}`;
}

function createPublicCaller() {
	return appRouter.createCaller({ db, session: null });
}

function getCachedIntegrationSummary(slug: string) {
	return unstable_cache(
		async () => createPublicCaller().integrations.summaryBySlug({ slug }),
		['integration-summary', slug],
		{
			revalidate: 60,
			tags: [integrationCacheTag(slug), INTEGRATIONS_CACHE_TAG],
		},
	)();
}

function getCachedIntegrationCapabilities(slug: string) {
	return unstable_cache(
		async () => createPublicCaller().integrations.capabilitiesBySlug({ slug }),
		['integration-capabilities', slug],
		{
			revalidate: 60,
			tags: [integrationCacheTag(slug), INTEGRATIONS_CACHE_TAG],
		},
	)();
}

type CachedSummary = Awaited<ReturnType<typeof getCachedIntegrationSummary>>;

async function withCurrentUserFields(summary: CachedSummary, userId?: string) {
	if (!userId) {
		return {
			...summary,
			claimedByCurrentUser: false,
			claimExpiredForCurrentUser: null,
			canClaimAnother: true,
			wipIntegrationName: null,
			claimBlockReason: null,
		};
	}

	const [latestStatus, claimEligibility] = await Promise.all([
		getLatestStatusForIntegration(db, summary.id),
		getUserClaimEligibility(db, userId),
	]);

	const claimedByCurrentUser =
		latestStatus != null &&
		latestStatus.userId === userId &&
		isIntegrationActivelyClaimed(latestStatus.phase);

	const claimExpiredForCurrentUser = getClaimExpiredForUser(
		userId,
		latestStatus,
	);

	return {
		...summary,
		claimedByCurrentUser,
		claimExpiredForCurrentUser,
		canClaimAnother: claimEligibility.canClaim,
		wipIntegrationName: claimEligibility.wipIntegrationName,
		claimBlockReason: claimEligibility.blockReason,
	};
}

/** Per-request dedup for metadata + page header. Read-only. */
export const getIntegrationSummaryForPage = cache(
	async (slug: string, userId?: string) => {
		const summary = await getCachedIntegrationSummary(slug);
		return withCurrentUserFields(summary, userId);
	},
);

/** Capabilities stream in separately — heavy read, cached. */
export const getIntegrationCapabilitiesForPage = cache(async (slug: string) => {
	return getCachedIntegrationCapabilities(slug);
});
