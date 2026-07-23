import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. Separate nested domain from the
// existing `videos.translate*` operations (list/delete/update have no v1/v2 equivalent).

export const list: HeygenEndpoints['videoTranslationsList'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoTranslationsList']
	>('/v3/video-translations', ctx.key, {
		method: 'GET',
		query: { limit: input.limit, token: input.token },
	});

	await logEventFromContext(
		ctx,
		'heygen.videoTranslations.list',
		{},
		'completed',
	);
	return result;
};

export const deleteTranslation: HeygenEndpoints['videoTranslationsDelete'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['videoTranslationsDelete']
		>(`/v3/video-translations/${input.video_translation_id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'heygen.videoTranslations.delete',
			{ videoTranslationId: input.video_translation_id },
			'completed',
		);
		return result;
	};

export const update: HeygenEndpoints['videoTranslationsUpdate'] = async (
	ctx,
	input,
) => {
	const { video_translation_id, ...body } = input;
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoTranslationsUpdate']
	>(`/v3/video-translations/${video_translation_id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'heygen.videoTranslations.update',
		{ videoTranslationId: video_translation_id },
		'completed',
	);
	return result;
};
