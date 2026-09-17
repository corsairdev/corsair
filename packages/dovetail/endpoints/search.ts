import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const magicSearch: DovetailEndpoints['searchMagicSearch'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used here for arbitrary search payload values sent to the search API
	const body: Record<string, unknown> = {};
	if (input.query !== undefined) body.query = input.query;
	if (input.offset !== undefined) body.offset = input.offset;
	if (input.limit !== undefined) body.limit = input.limit;
	if (input.filter !== undefined) body.filter = input.filter;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['searchMagicSearch']
	>('/v1/search', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.search.magicSearch',
		{ query: input.query },
		'completed',
	);
	return result;
};
