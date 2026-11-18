import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const videoSearchPost: OctenEndpoints['videoSearchPost'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.videoSearchPost.parse(input);
	const response = await makeOctenRequest('/video-search', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.videoSearchPost.parse(response);

	await logEventFromContext(
		ctx,
		'octen.videoSearch.post',
		{ resultCount: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};
