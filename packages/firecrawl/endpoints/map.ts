import { logEventFromContext } from 'corsair/core';
import type { FirecrawlEndpoints } from '..';
import { makeFirecrawlRequest } from '../client';
import type { MapRunResponse } from './types';

export const run: FirecrawlEndpoints['mapRun'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<MapRunResponse>(
		'v2/map',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (ctx.db.siteMaps) {
		try {
			await ctx.db.siteMaps.upsertByEntityId(input.url, {
				id: input.url,
				baseUrl: input.url,
				success: response.success,
				payload: response,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save map result to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.map.run',
		{ ...input },
		'completed',
	);
	return response;
};
