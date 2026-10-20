import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const newsSearchPost: OctenEndpoints['newsSearchPost'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.newsSearchPost.parse(input);
	const response = await makeOctenRequest('/news-search', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.newsSearchPost.parse(response);

	await logEventFromContext(
		ctx,
		'octen.newsSearch.post',
		{ query: parsedInput.query, resultCount: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};
