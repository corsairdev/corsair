import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const sslLookup: WhoisfreaksEndpoints['sslLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeWhoisfreaksRequest<
		WhoisfreaksEndpointOutputs['sslLookup']
	>('/v1.0/ssl/live', ctx.key, {
		method: 'GET',
		query: {
			domainName: input.domainName,
			chain: input.chain,
			sslRaw: input.sslRaw,
		},
	});

	await logEventFromContext(
		ctx,
		'whoisfreaks.ssl.lookup',
		{
			domainName: input.domainName,
			chain: input.chain,
			sslRaw: input.sslRaw,
		},
		'completed',
	);

	return response;
};

export const Ssl = {
	lookup: sslLookup,
};
