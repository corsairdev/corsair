import { logEventFromContext } from 'corsair/core';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import { readCachedRun, writeCachedRun } from './cache';
import type { TavilyEndpointOutputs, TavilySearchRequest } from './types';

export const search: TavilyEndpoints['search'] = async (ctx, input) => {
	const body: TavilySearchRequest = input;

	const cached = await readCachedRun(ctx, 'search', body);
	if (cached) {
		await logEventFromContext(
			ctx,
			'tavily.search',
			{ query: body.query, cached: true },
			'completed',
		);
		return cached;
	}

	const response = await makeTavilyRequest<TavilyEndpointOutputs['search']>(
		'search',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await writeCachedRun(ctx, 'search', body, response);
	await logEventFromContext(
		ctx,
		'tavily.search',
		{ query: body.query },
		'completed',
	);
	return response;
};
