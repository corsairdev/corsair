import { logEventFromContext } from 'corsair/core';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import type { TavilyEndpointOutputs, TavilyMapRequest } from './types';

export const map: TavilyEndpoints['map'] = async (ctx, input) => {
	const body: TavilyMapRequest = input;
	const response = await makeTavilyRequest<TavilyEndpointOutputs['map']>(
		'map',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(ctx, 'tavily.map', { url: body.url }, 'completed');
	return response;
};
