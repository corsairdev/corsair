import { logEventFromContext } from 'corsair/core';
import { makeSecuritytrailsRequest } from '../client';
import type { SecuritytrailsEndpoints } from '../index';
import type { SecuritytrailsEndpointOutputs } from './types';
import { SecuritytrailsEndpointOutputSchemas } from './types';

/**
 * `GET /v1/ping` — verifies the key is accepted.
 * https://docs.securitytrails.com/reference/ping-old-1
 */
export const ping: SecuritytrailsEndpoints['ping'] = async (ctx) => {
	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['ping']
	>('ping', ctx.key, {
		method: 'GET',
		schema: SecuritytrailsEndpointOutputSchemas.ping,
	});

	await logEventFromContext(ctx, 'securitytrails.ping', {}, 'completed');

	return response;
};

/**
 * `GET /v1/account/usage` — monthly quota consumed vs allowed.
 * https://docs.securitytrails.com/reference/usage-old-1
 */
export const usage: SecuritytrailsEndpoints['accountUsage'] = async (ctx) => {
	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['accountUsage']
	>('account/usage', ctx.key, {
		method: 'GET',
		schema: SecuritytrailsEndpointOutputSchemas.accountUsage,
	});

	await logEventFromContext(
		ctx,
		'securitytrails.account.usage',
		{},
		'completed',
	);

	return response;
};
