import type { ApiSport, ApiSportsQueryValue } from '../client';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsContext } from '../index';

function stableQueryKey(
	query: Record<string, ApiSportsQueryValue> | undefined,
) {
	if (!query) return '';
	return JSON.stringify(
		Object.keys(query)
			.sort()
			.reduce<Record<string, ApiSportsQueryValue>>((acc, key) => {
				acc[key] = query[key];
				return acc;
			}, {}),
	);
}

export function buildQueryEntityId(
	sport: ApiSport,
	path: string,
	query: Record<string, ApiSportsQueryValue> | undefined,
) {
	return `${sport}:${path}:${stableQueryKey(query)}`;
}

export async function cacheApiSportsQuery(
	ctx: ApiSportsContext,
	sport: ApiSport,
	path: string,
	query: Record<string, ApiSportsQueryValue> | undefined,
) {
	if (!ctx.db.queries) return;

	try {
		await ctx.db.queries.upsertByEntityId(
			buildQueryEntityId(sport, path, query),
			{
				sport,
				path,
				queriedAt: new Date(),
			},
		);
	} catch (error) {
		console.warn('[apisports] Failed to save query to database:', error);
	}
}

export async function executeApiSportsRequest<T>(
	ctx: ApiSportsContext,
	sport: ApiSport,
	path: string,
	options: {
		apiKey?: string;
		query?: Record<string, ApiSportsQueryValue>;
	} = {},
): Promise<T> {
	const response = await makeApiSportsRequest<T>(sport, path, options);
	await cacheApiSportsQuery(ctx, sport, path, options.query);
	return response;
}
