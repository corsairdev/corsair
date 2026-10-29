import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import type { ListCreditsResponse } from './types';

// GET /credits returns the account credit balance for a management key.
export const listCredits: OpenRouterEndpoints['creditsList'] = async (
	ctx,
	_input,
) => {
	const result = await makeOpenRouterRequest<ListCreditsResponse>(
		'credits',
		ctx.key,
	);

	return result;
};
