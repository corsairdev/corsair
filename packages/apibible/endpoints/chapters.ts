import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import { buildContentQuery } from './shared';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * List chapters of a book.
 * API: GET /bibles/{bibleId}/books/{bookId}/chapters
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const list: ApiBibleEndpoints['chaptersList'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['chaptersList']
	>(`bibles/${input.bibleId}/books/${input.bookId}/chapters`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.chapters.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Get a chapter with its content.
 * API: GET /bibles/{bibleId}/chapters/{chapterId}
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const get: ApiBibleEndpoints['chaptersGet'] = async (ctx, input) => {
	const { bibleId, chapterId, ...contentOptions } = input;

	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['chaptersGet']
	>(`bibles/${bibleId}/chapters/${chapterId}`, ctx.key, {
		query: buildContentQuery(contentOptions),
	});

	await logEventFromContext(
		ctx,
		'apibible.chapters.get',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * List sections (usfm headings) within a chapter.
 * API: GET /bibles/{bibleId}/chapters/{chapterId}/sections
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const listSections: ApiBibleEndpoints['chaptersListSections'] = async (
	ctx,
	input,
) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['chaptersListSections']
	>(`bibles/${input.bibleId}/chapters/${input.chapterId}/sections`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.chapters.listSections',
		{ ...input },
		'completed',
	);

	return response;
};
