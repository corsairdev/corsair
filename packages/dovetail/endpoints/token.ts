import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import { DovetailEndpointOutputSchemas } from './types';

export const getInfo: DovetailEndpoints['tokenGetInfo'] = async (ctx) => {
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['tokenGetInfo']
	>('/v1/token/info', ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.tokenGetInfo.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.token.getInfo',
		{ id: validated.data.id, subdomain: validated.data.subdomain },
		'completed',
	);
	return validated;
};
