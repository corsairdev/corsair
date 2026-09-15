import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// GET /v1/info/ip_addresses
// Docs: https://docs.customer.io/integrations/api/app/tag/info/getCioAllowlist/
export const listIpAddresses: CustomerioEndpoints['listIpAddresses'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['listIpAddresses']
	>('/v1/info/ip_addresses', ctx.key, {
		method: 'GET',
		region: ctx.options.region,
	});
	await logEventFromContext(
		ctx,
		'customerio.info.listIpAddresses',
		{ ...input },
		'completed',
	);
	return response;
};
