import { logEventFromContext } from 'corsair/core';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import { readCachedRun, writeCachedRun } from './cache';
import type { TavilyEndpointOutputs, TavilyExtractRequest } from './types';

export const extract: TavilyEndpoints['extract'] = async (ctx, input) => {
	const body: TavilyExtractRequest = input;
	const urlCount = Array.isArray(body.urls) ? body.urls.length : 1;

	const cached = await readCachedRun(ctx, 'extract', body);
	if (cached) {
		await logEventFromContext(
			ctx,
			'tavily.extract',
			{ urlCount, cached: true },
			'completed',
		);
		return cached;
	}

	const response = await makeTavilyRequest<TavilyEndpointOutputs['extract']>(
		'extract',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await writeCachedRun(ctx, 'extract', body, response);
	await logEventFromContext(ctx, 'tavily.extract', { urlCount }, 'completed');
	return response;
};
