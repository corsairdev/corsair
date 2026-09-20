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

	await logEventFromContext(
		ctx,
		'builtwith.free.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
