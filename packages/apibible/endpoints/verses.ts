import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import { buildContentQuery } from './shared';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * List verses of a chapter.
 * API: GET /bibles/{bibleId}/chapters/{chapterId}/verses
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const list: ApiBibleEndpoints['versesList'] = async (ctx, input) => {
	const { bibleId, chapterId, ...contentOptions } = input;

	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['versesList']
	>(`bibles/${bibleId}/chapters/${chapterId}/verses`, ctx.key, {
		query: buildContentQuery(contentOptions),
	});

	await logEventFromContext(
		ctx,
		'apibible.verses.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Get a single verse.
 * API: GET /bibles/{bibleId}/verses/{verseId}
 * Docs: https://api.bible and https://api.bible/content-api
 */
export const get: ApiBibleEndpoints['versesGet'] = async (ctx, input) => {
	const { bibleId, verseId, ...contentOptions } = input;

	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['versesGet']
	>(`bibles/${bibleId}/verses/${verseId}`, ctx.key, {
		query: buildContentQuery(contentOptions),
	});

	await logEventFromContext(
		ctx,
		'apibible.verses.get',
		{ ...input },
		'completed',
	);

	return response;
};
