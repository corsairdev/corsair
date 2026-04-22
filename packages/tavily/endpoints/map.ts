import { logEventFromContext } from 'corsair/core';
import { makeTavilyRequest } from '../client';
import type { TavilyEndpoints } from '../index';
import type { TavilyMapResponse } from './types';

export const map: TavilyEndpoints['map'] = async (ctx, input) => {
	const response = await makeTavilyRequest<TavilyMapResponse>('map', ctx.key, {
		method: 'POST',
		body: input,
	});

	for (const url of response.results) {
		try {
			await ctx.db.mapResults.upsertByEntityId(url, {
				url,
				baseUrl: response.base_url,
				mappedAt: new Date(),
			});
		} catch (error) {
			console.warn(`[tavily] Failed to save map result ${url}:`, error);
		}
	}

	await logEventFromContext(
		ctx,
		'tavily.map.map',
		{ baseUrl: input.url, resultCount: response.results.length },
		'completed',
	);

	return response;
};
