import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List policy IPS - GET /v1/policy_ips
export const policyIpsList: DnsfilterEndpoints['policyIpsList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policyIpsList']
	>('/v1/policy_ips', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.policyIps.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Get a policy IPS - GET /v1/policy_ips/{id}
export const policyIpsGet: DnsfilterEndpoints['policyIpsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policyIpsGet']
	>('/v1/policy_ips/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.policyIps.get',
		input ?? {},
		'completed',
	);
	return response;
};
