import { logEventFromContext } from 'corsair/core';
import type { SecuritytrailsEndpoints } from '..';
import { makeSecuritytrailsRequest } from '../client';
import type { SecuritytrailsEndpointOutputs } from './types';

export const get: SecuritytrailsEndpoints['domainGet'] = async (ctx, input) => {
	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['domainGet']
	>(`domain/${encodeURIComponent(input.hostname)}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'securitytrails.domain.get',
		{ ...input },
		'completed',
	);

	return response;
};
