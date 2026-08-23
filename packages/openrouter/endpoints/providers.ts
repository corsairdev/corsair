import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import { cacheProviders } from './persist';
import type { ListProvidersResponse } from './types';

export const listProviders: OpenRouterEndpoints['providersList'] = async (
	ctx,
	_input,
) => {
	const result = await makeOpenRouterRequest<ListProvidersResponse>(
		'providers',
		ctx.key,
	);

	await cacheProviders(ctx, result.data);
	return result;
};
