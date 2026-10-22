import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Create a trial - POST /v1/trials
export const trialsCreate: DnsfilterEndpoints['trialsCreate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.trialsCreate.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['trialsCreate']
	>('/v1/trials', ctx.key, {
		method: 'POST',
		body: {
			organization_id: values.organization_id,
			sku: values.sku,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.trialsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.trials.create',
		redactSensitive(values),
		'completed',
	);
	return result;
};
