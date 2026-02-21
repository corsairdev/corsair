import { logEventFromContext } from '../../utils/events';
import type { TavilyEndpoints } from '..';
import { makeTavilyRequest } from '../client';
import type { TavilyEndpointOutputs, TavilySearchRequest } from './types';

export const search: TavilyEndpoints['search'] = async (ctx, input) => {
	const body: TavilySearchRequest = input;
	const response = await makeTavilyRequest<TavilyEndpointOutputs['search']>(
		'search',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'tavily.search',
		{ query: body.query },
		'completed',
	);
	return response;
};
