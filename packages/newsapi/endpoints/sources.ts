import { logEventFromContext } from 'corsair/core';
import { makeNewsApiRequest } from '../client';
import type { NewsApiEndpoints } from '../index';
import {
	NewsApiEndpointInputSchemas,
	NewsApiEndpointOutputSchemas,
} from './types';

export const get: NewsApiEndpoints['sourcesGet'] = async (ctx, rawInput) => {
	const input = NewsApiEndpointInputSchemas.sourcesGet.parse(rawInput);

	const raw = await makeNewsApiRequest('v2/top-headlines/sources', ctx.key, {
		query: {
			category: input?.category,
			language: input?.language,
			country: input?.country,
		},
	});
	const response = NewsApiEndpointOutputSchemas.sourcesGet.parse(raw);

	if (ctx.db.sources) {
		try {
			for (const source of response.sources) {
				await ctx.db.sources.upsertByEntityId(source.id, { ...source });
			}
		} catch (error) {
			console.warn('Failed to save sources to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'newsapi.sources.get',
		{ ...input },
		'completed',
	);
	return response;
};
