import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const socialApiLookup: BuiltWithEndpoints['socialApiLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['socialApiLookup']
	>('social1/api.json', ctx.key, {
		method: 'GET',
		query: {
			LOOKUP: input.lookup,
		},
	});

	await logEventFromContext(
		ctx,
		'builtwith.social.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
