import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import type { ListZdrEndpointsResponse } from './types';

// GET /endpoints/zdr returns the Zero-Data Residency (ZDR) endpoint
// specification for the account's ZDR frontend.
export const listZdrEndpoints: OpenRouterEndpoints['zdrEndpointsList'] = async (
	ctx,
	_input,
) => {
	const result = await makeOpenRouterRequest<ListZdrEndpointsResponse>(
		'endpoints/zdr',
		ctx.key,
	);

	return result;
};
