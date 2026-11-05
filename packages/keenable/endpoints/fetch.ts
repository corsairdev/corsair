import { logEventFromContext } from 'corsair/core';
import type { KeenableEndpoints } from '..';
import { makeKeenableRequest } from '../client';
import type { FetchResponse } from './types';
import {
	KeenableEndpointInputSchemas,
	KeenableEndpointOutputSchemas,
} from './types';

export const fetch: KeenableEndpoints['fetch'] = async (ctx, input) => {
	const parsedInput = KeenableEndpointInputSchemas.fetch.parse(input);

	const response = await makeKeenableRequest<FetchResponse>(
		'/v1/fetch',
		ctx.key,
		{
			method: 'GET',
			query: {
				url: parsedInput.url,
				max_chars: parsedInput.max_chars,
				live: parsedInput.live,
				prompt: parsedInput.prompt,
			},
		},
	);

	const parsed = KeenableEndpointOutputSchemas.fetch.parse(response);

	await logEventFromContext(
		ctx,
		'keenable.fetch',
		{ url: parsedInput.url },
		'completed',
	);

	return parsed;
};
