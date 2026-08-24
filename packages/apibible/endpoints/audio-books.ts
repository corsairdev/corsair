import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * List all books of an audio Bible.
 * API: GET /audio-bibles/{audioBibleId}/books
 * Docs: https://api.bible and https://api.bible/audio-api
 */
export const list: ApiBibleEndpoints['audioBooksList'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['audioBooksList']
	>(`audio-bibles/${input.audioBibleId}/books`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.audioBooks.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Get a specific book of an audio Bible.
 * API: GET /audio-bibles/{audioBibleId}/books/{bookId}
 * Docs: https://api.bible and https://api.bible/audio-api
 */
export const get: ApiBibleEndpoints['audioBooksGet'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['audioBooksGet']
	>(`audio-bibles/${input.audioBibleId}/books/${input.bookId}`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.audioBooks.get',
		{ ...input },
		'completed',
	);

	return response;
};
