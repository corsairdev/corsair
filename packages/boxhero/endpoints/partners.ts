import { logEventFromContext } from 'corsair/core';
import { makeBoxheroRequest } from '../client';
import type { BoxheroEndpoints } from '../index.ts';
import type { BoxheroEndpointOutputs } from './types';

export const listPartners: BoxheroEndpoints['partnersList'] = async (
	ctx,
	input,
) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['partnersList']
	>('/v1/partners', ctx.key, {
		method: 'GET',
		query: {
			type: input?.type,
			cursor: input?.cursor,
			limit: input?.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'boxhero.partners.list',
		input ?? {},
		'completed',
	);
	return response;
};
