import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const asnWhoisLookup: WhoisfreaksEndpoints['asnWhoisLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeWhoisfreaksRequest<
		WhoisfreaksEndpointOutputs['asnWhoisLookup']
	>('/v2.0/asn-whois', ctx.key, {
		method: 'GET',
		query: {
			asn: input.asn,
		},
	});

	await logEventFromContext(
		ctx,
		'whoisfreaks.asn_whois.lookup',
		{
			asn: input.asn,
		},
		'completed',
	);

	return response;
};

export const ipWhoisLookup: WhoisfreaksEndpoints['ipWhoisLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeWhoisfreaksRequest<
		WhoisfreaksEndpointOutputs['ipWhoisLookup']
	>('/v1.0/ip-whois', ctx.key, {
		method: 'GET',
		query: {
			ip: input.ip,
		},
	});

	await logEventFromContext(
		ctx,
		'whoisfreaks.ip_whois.lookup',
		{
			ip: input.ip,
		},
		'completed',
	);

	return response;
};

export const AsnWhois = {
	lookup: asnWhoisLookup,
};

export const IpWhois = {
	lookup: ipWhoisLookup,
};
