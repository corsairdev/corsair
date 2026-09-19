import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const magicSearch: DovetailEndpoints['searchMagicSearch'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.searchMagicSearch.parse(input);
	// Justification: unknown is used here for arbitrary search payload values sent to the search API
	const body: Record<string, unknown> = {};
	if (parsed.query !== undefined) body.query = parsed.query;
	if (parsed.offset !== undefined) body.offset = parsed.offset;
	if (parsed.limit !== undefined) body.limit = parsed.limit;
	if (parsed.filter !== undefined) body.filter = parsed.filter;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['searchMagicSearch']
	>('/v1/search', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.searchMagicSearch.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.search.magicSearch',
		{ query: parsed.query },
		'completed',
	);
	return validated;
};
