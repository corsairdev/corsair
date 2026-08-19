import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import { buildContentQuery } from './shared';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * List sections (usfm headings) of a book.
 * API: GET /bibles/{bibleId}/books/{bookId}/sections
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const list: ApiBibleEndpoints['sectionsList'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['sectionsList']
	>(`bibles/${input.bibleId}/books/${input.bookId}/sections`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.sections.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Get a section with its content.
 * API: GET /bibles/{bibleId}/sections/{sectionId}
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const get: ApiBibleEndpoints['sectionsGet'] = async (ctx, input) => {
	const { bibleId, sectionId, ...contentOptions } = input;

	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['sectionsGet']
	>(`bibles/${bibleId}/sections/${sectionId}`, ctx.key, {
		query: buildContentQuery(contentOptions),
	});

	await logEventFromContext(
		ctx,
		'apibible.sections.get',
		{ ...input },
		'completed',
	);

	return response;
};
