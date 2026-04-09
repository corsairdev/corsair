import { logEventFromContext } from 'corsair/core';
import type { HackerNewsEndpoints } from '..';
import { makeHackerNewsAlgoliaRequest } from '../client';
import type { HackerNewsEndpointOutputs } from './types';

// Algolia search response envelope
type AlgoliaSearchRaw<T> = {
	hits: T[];
	nbHits: number;
	page: number;
	nbPages: number;
	hitsPerPage: number;
	query?: string;
};

export const posts: HackerNewsEndpoints['searchPosts'] = async (ctx, input) => {
	const tagsParam =
		input.tags && input.tags.length > 0 ? input.tags.join(',') : undefined;

	const result = await makeHackerNewsAlgoliaRequest<
		AlgoliaSearchRaw<HackerNewsEndpointOutputs['searchPosts']['hits'][number]>
	>('search', {
		query: {
			query: input.query,
			tags: tagsParam,
			page: input.page,
			hitsPerPage: input.size,
		},
	});

	if (ctx.db.items) {
		try {
			for (const hit of result.hits) {
				if (hit.objectID) {
					await ctx.db.items.upsertByEntityId(hit.objectID, {
						id: Number(hit.objectID),
						by: hit.author,
						title: hit.title ?? undefined,
						url: hit.url ?? undefined,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save search hits to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.search.posts',
		{ ...input },
		'completed',
	);
	return {
		...result,
		query: result.query ?? input.query,
	};
};

export const getLatest: HackerNewsEndpoints['searchGetLatest'] = async (
	ctx,
	input,
) => {
	const tagsParam =
		input.tags && input.tags.length > 0 ? input.tags.join(',') : undefined;

	const result = await makeHackerNewsAlgoliaRequest<
		AlgoliaSearchRaw<
			HackerNewsEndpointOutputs['searchGetLatest']['hits'][number]
		>
	>('search_by_date', {
		query: {
			tags: tagsParam,
			page: input.page,
			hitsPerPage: input.size,
		},
	});

	if (ctx.db.items) {
		try {
			for (const hit of result.hits) {
				if (hit.objectID) {
					await ctx.db.items.upsertByEntityId(hit.objectID, {
						id: Number(hit.objectID),
						by: hit.author,
						title: hit.title ?? undefined,
						url: hit.url ?? undefined,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save latest hits to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.search.getLatest',
		{ ...input },
		'completed',
	);
	return { ...result };
};

export const getFrontpage: HackerNewsEndpoints['searchGetFrontpage'] = async (
	ctx,
	input,
) => {
	const minPoints = input.min_points ?? 40;
	const numericFilters = `points>=${minPoints}`;

	const result = await makeHackerNewsAlgoliaRequest<
		AlgoliaSearchRaw<
			HackerNewsEndpointOutputs['searchGetFrontpage']['posts'][number]
		>
	>('search', {
		query: {
			tags: 'front_page',
			numericFilters,
			hitsPerPage: 50,
		},
	});

	if (ctx.db.items) {
		try {
			for (const hit of result.hits) {
				if (hit.objectID) {
					await ctx.db.items.upsertByEntityId(hit.objectID, {
						id: Number(hit.objectID),
						by: hit.author,
						title: hit.title ?? undefined,
						url: hit.url ?? undefined,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save frontpage hits to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.search.getFrontpage',
		{ ...input },
		'completed',
	);
	return {
		posts: result.hits,
		total_hits: result.nbHits,
	};
};

export const getTodays: HackerNewsEndpoints['searchGetTodays'] = async (
	ctx,
	input,
) => {
	// Calculate midnight UTC for today
	const now = new Date();
	const todayStart = Math.floor(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000,
	);

	const numericFilters =
		input.min_points !== undefined
			? `created_at_i>=${todayStart},points>=${input.min_points}`
			: `created_at_i>=${todayStart}`;

	const result = await makeHackerNewsAlgoliaRequest<
		AlgoliaSearchRaw<
			HackerNewsEndpointOutputs['searchGetTodays']['hits'][number]
		>
	>('search_by_date', {
		query: {
			tags: 'story',
			numericFilters,
			page: input.page,
			hitsPerPage: input.size,
		},
	});

	if (ctx.db.items) {
		try {
			for (const hit of result.hits) {
				if (hit.objectID) {
					await ctx.db.items.upsertByEntityId(hit.objectID, {
						id: Number(hit.objectID),
						by: hit.author,
						title: hit.title ?? undefined,
						url: hit.url ?? undefined,
					});
				}
			}
		} catch (error) {
			console.warn("Failed to save today's hits to database:", error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.search.getTodays',
		{ ...input },
		'completed',
	);
	return { ...result };
};
