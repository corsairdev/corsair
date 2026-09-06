import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const mcpApiLookup: BuiltWithEndpoints['mcpApiLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['mcpApiLookup']
	>('mcp2/api.json', ctx.key, {
		method: 'GET',
		query: {
			SEARCH: input.domain,
		},
	});

	await logEventFromContext(
		ctx,
		'builtwith.mcp.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
