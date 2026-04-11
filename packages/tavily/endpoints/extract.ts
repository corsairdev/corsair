import { logEventFromContext } from 'corsair/core';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import type { TavilyEndpointOutputs, TavilyExtractRequest } from './types';

export const extract: TavilyEndpoints['extract'] = async (ctx, input) => {
	const body: TavilyExtractRequest = input;
	const response = await makeTavilyRequest<TavilyEndpointOutputs['extract']>(
		'extract',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	const urlCount = Array.isArray(body.urls) ? body.urls.length : 1;
	await logEventFromContext(ctx, 'tavily.extract', { urlCount }, 'completed');
	return response;
};
