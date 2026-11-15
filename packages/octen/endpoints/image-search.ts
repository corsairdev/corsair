import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const imageSearchPost: OctenEndpoints['imageSearchPost'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.imageSearchPost.parse(input);
	const response = await makeOctenRequest('/image-search', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.imageSearchPost.parse(response);

	// The input can carry an image URL or base64 payload, so only the result
	// count is logged.
	await logEventFromContext(
		ctx,
		'octen.imageSearch.post',
		{ resultCount: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};
