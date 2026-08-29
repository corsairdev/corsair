import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import type { GetKeyResponse } from './types';

export const getKey: OpenRouterEndpoints['keyGet'] = async (ctx, _input) => {
	const result = await makeOpenRouterRequest<GetKeyResponse>('key', ctx.key);

	return result;
};
