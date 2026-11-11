import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listFilterFields: SalesflareEndpoints['listFilterFields'] = async (
	ctx,
	input,
) => {
	const { entity, ...query } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listFilterFields']
	>(
		ctx,
		salesflarePathParameter('/filterfields/{entity}', 'entity', input.entity),
		{ method: 'GET', query: query },
	);
	await logEventFromContext(
		ctx,
		'salesflare.filterfields.listFilterFields',
		input,
		'completed',
	);
	return response;
};
