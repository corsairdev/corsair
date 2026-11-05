import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const businessSearchPost: OctenEndpoints['businessSearchPost'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.businessSearchPost.parse(input);
	const response = await makeOctenRequest('/business-search', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.businessSearchPost.parse(response);

	await logEventFromContext(
		ctx,
		'octen.businessSearch.post',
		{ query: parsedInput.query, resultCount: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};
