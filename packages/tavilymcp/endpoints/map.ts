import { logEventFromContext } from 'corsair/core';
import { makeTavilyMcpRequest } from '../client';
import type { TavilyMcpEndpoints } from '../index';
import type { TavilyMapResponse } from './types';
import { TavilyMapRequestSchema, TavilyMapResponseSchema } from './types';

export const map: TavilyMcpEndpoints['map'] = async (ctx, input) => {
	const query = TavilyMapRequestSchema.parse(input);

	const response = TavilyMapResponseSchema.parse(
		await makeTavilyMcpRequest<TavilyMapResponse>('map', ctx.key, {
			method: 'POST',
			body: query,
		}),
	);

	for (const url of response.results) {
		try {
			await ctx.db.mapResults.upsertByEntityId(url, {
				url,
				baseUrl: response.base_url,
				mappedAt: new Date(),
			});
		} catch (error) {
			console.warn(`[tavilymcp] Failed to save map result ${url}:`, error);
		}
	}

	await logEventFromContext(
		ctx,
		'tavilymcp.tavily.map',
		{ baseUrl: query.url, resultCount: response.results.length },
		'completed',
	);

	return response;
};
