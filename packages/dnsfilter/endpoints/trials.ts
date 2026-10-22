import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Create a trial - POST /v1/trials
export const trialsCreate: DnsfilterEndpoints['trialsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['trialsCreate']
	>('/v1/trials', ctx.key, {
		method: 'POST',
		body: {
			organization_id: input.organization_id,
			sku: input.sku,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.trials.create',
		input ?? {},
		'completed',
	);
	return response;
};
