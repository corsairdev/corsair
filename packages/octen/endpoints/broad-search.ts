import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const broadSearchPost: OctenEndpoints['broadSearchPost'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.broadSearchPost.parse(input);
	const response = await makeOctenRequest('/broad-search', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.broadSearchPost.parse(response);

	await logEventFromContext(
		ctx,
		'octen.broadSearch.post',
		{ query: parsedInput.query, queryCount: parsed.queries?.length ?? 0 },
		'completed',
	);

	return parsed;
};
