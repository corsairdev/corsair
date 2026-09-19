import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const datasetsLookup: BuiltWithEndpoints['datasetsLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['datasetsLookup']
	>('trends/v6/api.json', ctx.key, {
		method: 'GET',
		query: {
			TECH: input.lookup,
		},
	});

	await logEventFromContext(
		ctx,
		'builtwith.datasets.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
