import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const whoisLiveLookupV2: WhoisfreaksEndpoints['whoisLiveLookupV2'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['whoisLiveLookupV2']
		>('/v2.0/whois/live', ctx.key, {
			method: 'GET',
			query: {
				whois: 'live',
				domainName: input.domainName,
				format: input.format,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.whois.live_lookup_v2',
			{
				domainName: input.domainName,
				format: input.format,
			},
			'completed',
		);

		return response;
	};
