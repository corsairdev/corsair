import { logEventFromContext } from 'corsair/core';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import { readCachedRun, writeCachedRun } from './cache';
import type { TavilyCrawlRequest, TavilyEndpointOutputs } from './types';

export const crawl: TavilyEndpoints['crawl'] = async (ctx, input) => {
	const body: TavilyCrawlRequest = input;

	const cached = await readCachedRun(ctx, 'crawl', body);
	if (cached) {
		await logEventFromContext(
			ctx,
			'tavily.crawl',
			{ url: body.url, cached: true },
			'completed',
		);
		return cached;
	}

	const response = await makeTavilyRequest<TavilyEndpointOutputs['crawl']>(
		'crawl',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await writeCachedRun(ctx, 'crawl', body, response);
	await logEventFromContext(
		ctx,
		'tavily.crawl',
		{ url: body.url },
		'completed',
	);
	return response;
};
