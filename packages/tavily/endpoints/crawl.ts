import { logEventFromContext } from 'corsair/core';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import type { TavilyCrawlRequest, TavilyEndpointOutputs } from './types';

export const crawl: TavilyEndpoints['crawl'] = async (ctx, input) => {
	const body: TavilyCrawlRequest = input;
	const response = await makeTavilyRequest<TavilyEndpointOutputs['crawl']>(
		'crawl',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'tavily.crawl',
		{ url: body.url },
		'completed',
	);
	return response;
};
