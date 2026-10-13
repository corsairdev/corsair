import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const freeApiLookup: BuiltWithEndpoints['freeApiLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['freeApiLookup']
	>('free1/api.json', ctx.key, {
		method: 'GET',
		query: {
			LOOKUP: input.lookup,
		},
	});

	if (response.domain && ctx.db.domainCoverage) {
		try {
			await ctx.db.domainCoverage.upsertByEntityId(response.domain, {
				id: response.domain,
				domain: response.domain,
				first: response.first,
				last: response.last,
				groups: response.groups,
			});
		} catch (error) {
			console.warn('Failed to save BuiltWith coverage to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'builtwith.free.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
