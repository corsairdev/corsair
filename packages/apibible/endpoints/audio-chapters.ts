import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * List chapters of an audio book.
 * API: GET /audio-bibles/{audioBibleId}/books/{bookId}/chapters
 * Docs: https://api.bible and https://api.bible/audio-api
 */
export const list: ApiBibleEndpoints['audioChaptersList'] = async (
	ctx,
	input,
) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['audioChaptersList']
	>(
		`audio-bibles/${input.audioBibleId}/books/${input.bookId}/chapters`,
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'apibible.audioChapters.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Get an audio chapter (includes a signed mp3 resource URL).
 * API: GET /audio-bibles/{audioBibleId}/chapters/{chapterId}
 * Docs: https://api.bible and https://api.bible/audio-api
 */
export const get: ApiBibleEndpoints['audioChaptersGet'] = async (
	ctx,
	input,
) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['audioChaptersGet']
	>(`audio-bibles/${input.audioBibleId}/chapters/${input.chapterId}`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.audioChapters.get',
		{ ...input },
		'completed',
	);

	return response;
};
