import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

function serpUrl(engine: string, q: string): string {
	const encoded = encodeURIComponent(q);
	if (engine === 'bing') return `https://www.bing.com/search?q=${encoded}`;
	if (engine === 'yahoo') return `https://search.yahoo.com/search?p=${encoded}`;
	if (engine === 'yandex') return `https://yandex.com/search/?text=${encoded}`;
	if (engine === 'duckduckgo') return `https://duckduckgo.com/?q=${encoded}`;
	return `https://www.google.com/search?q=${encoded}`;
}

export const serpSearch: BrightDataEndpoints['serpSearch'] = async (
	ctx,
	input,
) => {
	const engine = input.search_engine ?? 'google';
	const url = serpUrl(engine, input.q_keywords);
	const response = await makeBrightDataRequest<unknown>(
		'/request',
		requireBrightDataKey(ctx.key),
		{
			method: 'POST',
			body: {
				zone: input.zone,
				url,
				format: input.format ?? 'json',
				method: input.method ?? 'GET',
				country: input.country,
				data_format: input.data_format,
			},
		},
	);
	const parsed = BrightDataEndpointOutputSchemas.serpSearch.parse(response);
	await logEventFromContext(
		ctx,
		'brightdata.serp_search',
		{ zone: input.zone, search_engine: engine },
		'completed',
	);
	return parsed;
};
