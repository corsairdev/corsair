import { logEventFromContext } from 'corsair/core';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import { readCachedRun, writeCachedRun } from './cache';
import type { TavilyEndpointOutputs, TavilyMapRequest } from './types';

export const map: TavilyEndpoints['map'] = async (ctx, input) => {
	const body: TavilyMapRequest = input;

	const cached = await readCachedRun(ctx, 'map', body);
	if (cached) {
		await logEventFromContext(
			ctx,
			'tavily.map',
			{ url: body.url, cached: true },
			'completed',
		);
		return cached;
	}

	const response = await makeTavilyRequest<TavilyEndpointOutputs['map']>(
		'map',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await writeCachedRun(ctx, 'map', body, response);
	await logEventFromContext(ctx, 'tavily.map', { url: body.url }, 'completed');
	return response;
};
