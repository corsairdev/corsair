import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const getInfo: DovetailEndpoints['tokenGetInfo'] = async (ctx) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['tokenGetInfo']
	>('/v1/token/info', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'dovetail.token.getInfo',
		{ id: result.data.id, subdomain: result.data.subdomain },
		'completed',
	);
	return result;
};
