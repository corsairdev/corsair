import { logEventFromContext } from 'corsair/core';
import type { KeenableEndpoints } from '..';
import { makeKeenableRequest } from '../client';
import type { SearchResponse } from './types';
import {
	KeenableEndpointInputSchemas,
	KeenableEndpointOutputSchemas,
} from './types';

export const search: KeenableEndpoints['search'] = async (ctx, input) => {
	const parsedInput = KeenableEndpointInputSchemas.search.parse(input);

	const response = await makeKeenableRequest<SearchResponse>(
		'/v1/search',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	const parsed = KeenableEndpointOutputSchemas.search.parse(response);

	await logEventFromContext(
		ctx,
		'keenable.search',
		{ query: parsedInput.query, resultCount: parsed.results.length },
		'completed',
	);

	return parsed;
};
