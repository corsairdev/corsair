import { revalidateTag, unstable_cache } from 'next/cache';

import { db } from '@/db';
import {
	getActiveClaimsForUser,
	getUserClaimEligibility,
} from '@/db/integration-status';
import { appRouter } from '@/server/api/root';

export const OSS_CACHE_TAGS = {
	stats: 'oss:stats',
	activity: 'oss:activity',
	tags: 'oss:tags',
	leaderboard: 'oss:leaderboard',
	list: 'oss:list',
	contributors: 'oss:contributors',
} as const;

export function revalidateOssWriteSurface() {
	revalidateTag(OSS_CACHE_TAGS.stats);
	revalidateTag(OSS_CACHE_TAGS.activity);
	revalidateTag(OSS_CACHE_TAGS.leaderboard);
	revalidateTag(OSS_CACHE_TAGS.list);
	revalidateTag(OSS_CACHE_TAGS.contributors);
}

const MAX_CACHE_Q_LENGTH = 64;

function normalizeQueryForCache(q: string): string {
	return q.trim().toLowerCase().slice(0, MAX_CACHE_Q_LENGTH);
}

function createPublicCaller() {
	return appRouter.createCaller({ db, session: null });
}

export const getCachedOssStats = unstable_cache(
	async () => createPublicCaller().integrations.stats(),
	['oss-stats'],
	{ revalidate: 30, tags: [OSS_CACHE_TAGS.stats] },
);

export const getCachedRecentActivity = unstable_cache(
	async (limit: number) =>
		createPublicCaller().integrations.recentActivity({ limit }),
	['oss-recent-activity'],
	{ revalidate: 30, tags: [OSS_CACHE_TAGS.activity] },
);

export const getCachedListTags = unstable_cache(
	async () => createPublicCaller().integrations.listTags(),
	['oss-list-tags'],
	{ revalidate: 60, tags: [OSS_CACHE_TAGS.tags] },
);

export const getCachedLeaderboard = unstable_cache(
	async (page: number) =>
		createPublicCaller().integrations.leaderboard({ page }),
	['oss-leaderboard'],
	{ revalidate: 30, tags: [OSS_CACHE_TAGS.leaderboard] },
);

const getCachedIntegrationList = unstable_cache(
	async (page: number, q: string, tagsKey: string) => {
		const tags = tagsKey ? tagsKey.split(',') : undefined;
		return createPublicCaller().integrations.list({
			page,
			q: q || undefined,
			tags,
		});
	},
	['oss-integration-list'],
	{ revalidate: 30, tags: [OSS_CACHE_TAGS.list] },
);

/** Cached list + one small query to mark the signed-in user's claims. */
export async function getIntegrationListForPage(
	page: number,
	q: string,
	tagSlugs: string[],
	userId?: string,
) {
	const tagsKey = tagSlugs.join(',');
	const normalizedQ = normalizeQueryForCache(q);
	const list = await getCachedIntegrationList(page, normalizedQ, tagsKey);

	if (!userId) return list;

	try {
		const [claims, claimEligibility] = await Promise.all([
			getActiveClaimsForUser(db, userId),
			getUserClaimEligibility(db, userId),
		]);
		const claimedIds = new Set(claims.map((claim) => claim.integrationId));
		const userCanClaim = claimEligibility.canClaim;

		return {
			...list,
			wipIntegrationName: claimEligibility.wipIntegrationName,
			claimBlockReason: claimEligibility.blockReason,
			items: list.items.map((item) => ({
				...item,
				claimedByCurrentUser: claimedIds.has(item.id),
				userCanClaim,
			})),
		};
	} catch (error) {
		console.error('[oss] claim overlay failed', error);
		// Fail safe: disable claim buttons rather than showing stale public-cache state.
		return {
			...list,
			wipIntegrationName: null,
			claimBlockReason: null,
			items: list.items.map((item) => ({
				...item,
				userCanClaim: false,
			})),
		};
	}
}

export const getCachedContributorProfile = unstable_cache(
	async (username: string) =>
		createPublicCaller().contributors.byGithubUsername({ username }),
	['oss-contributor-profile'],
	{ revalidate: 30, tags: [OSS_CACHE_TAGS.contributors] },
);
