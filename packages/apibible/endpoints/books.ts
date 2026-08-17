import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * List all books of a Bible version.
 * API: GET /bibles/{bibleId}/books
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const list: ApiBibleEndpoints['booksList'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['booksList']
	>(`bibles/${input.bibleId}/books`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.books.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Get a specific book of a Bible version.
 * API: GET /bibles/{bibleId}/books/{bookId}
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const get: ApiBibleEndpoints['booksGet'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['booksGet']
	>(`bibles/${input.bibleId}/books/${input.bookId}`, ctx.key, {
		query:
			typeof input.includeChapters === 'boolean'
				? { 'include-chapters': input.includeChapters }
				: undefined,
	});

	await logEventFromContext(
		ctx,
		'apibible.books.get',
		{ ...input },
		'completed',
	);

	return response;
};
