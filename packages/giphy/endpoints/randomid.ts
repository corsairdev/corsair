import { logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import { resolveApiKey } from './auth';
import type { GiphyEndpointOutputs } from './types';
import { GiphyRandomIdResponseSchema } from './types';

// Random ID — https://developers.giphy.com/docs/api/endpoint/#random-id
// GET /v1/randomid. Generates a privacy-safe user identifier to pass as
// `customer_id` on other endpoints when the platform has no stable user ID.
export const get: GiphyEndpoints['randomIdGet'] = async (ctx) => {
	const apiKey = await resolveApiKey(ctx);

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['randomIdGet']
	>('/randomid', apiKey);

	const response = GiphyRandomIdResponseSchema.parse(rawResponse);

	await logEventFromContext(ctx, 'giphy.randomId.get', {}, 'completed');

	return response;
};

export const RandomId = {
	get,
};
