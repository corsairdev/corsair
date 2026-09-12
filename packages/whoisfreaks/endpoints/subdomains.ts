import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const subdomainsLookup: WhoisfreaksEndpoints['subdomainsLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['subdomainsLookup']
		>('/v1.0/subdomains', ctx.key, {
			method: 'GET',
			query: {
				domain: input.domain,
				after: input.after,
				before: input.before,
				status: input.status,
				page: input.page,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.subdomains.lookup',
			{
				domain: input.domain,
				after: input.after,
				before: input.before,
				status: input.status,
				page: input.page,
			},
			'completed',
		);

		return response;
	};

export const Subdomains = {
	lookup: subdomainsLookup,
};
