import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const searchPost: OctenEndpoints['searchPost'] = async (ctx, input) => {
	const parsedInput = OctenEndpointInputSchemas.searchPost.parse(input);
	const response = await makeOctenRequest('/search', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.searchPost.parse(response);

	await logEventFromContext(
		ctx,
		'octen.search.post',
		{ query: parsedInput.query, resultCount: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};
