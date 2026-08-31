import { logEventFromContext } from 'corsair/core';
import { makeNewsApiRequest } from '../client';
import type { NewsApiEndpoints } from '../index';
import {
	NewsApiEndpointInputSchemas,
	NewsApiEndpointOutputSchemas,
} from './types';

export const list: NewsApiEndpoints['sourcesList'] = async (ctx, rawInput) => {
	const input = NewsApiEndpointInputSchemas.sourcesList.parse(rawInput);

	const raw = await makeNewsApiRequest('v2/top-headlines/sources', ctx.key, {
		query: {
			category: input?.category,
			language: input?.language,
			country: input?.country,
		},
	});
	const response = NewsApiEndpointOutputSchemas.sourcesList.parse(raw);

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
		'newsapi.sources.list',
		{ ...input },
		'completed',
	);
	return response;
};
