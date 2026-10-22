import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List policy IPs - GET /v1/policy_ips
export const policyIpsList: DnsfilterEndpoints['policyIpsList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.policyIpsList.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policyIpsList']
	>('/v1/policy_ips', ctx.key, {
		method: 'GET',
	});
	const result = DnsfilterEndpointOutputSchemas.policyIpsList.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.policyIps.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get a policy IP - GET /v1/policy_ips/{id}
export const policyIpsGet: DnsfilterEndpoints['policyIpsGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.policyIpsGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policyIpsGet']
	>('/v1/policy_ips/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.policyIpsGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.policyIps.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};
