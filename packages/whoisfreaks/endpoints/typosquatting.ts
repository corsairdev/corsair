import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const typosquattingLookup: WhoisfreaksEndpoints['typosquattingLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['typosquattingLookup']
		>('/v3.0/domain/typos', ctx.key, {
			method: 'GET',
			query: {
				keyword: input.keyword,
				pattern: input.pattern,
				pageToken: input.pageToken,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.typosquatting.lookup',
			{
				keyword: input.keyword,
				pattern: input.pattern,
			},
			'completed',
		);

		return response;
	};

export const Typosquatting = {
	lookup: typosquattingLookup,
};
