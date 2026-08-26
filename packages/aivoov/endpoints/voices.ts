import { logEventFromContext } from 'corsair/core';
import { assertAivoovSuccess, makeAivoovRequest } from '../client';
import type { AivoovContext, AivoovEndpoints } from '../index';
import type { ListVoicesResponse, Voice } from './types';

// An unfiltered `/voices` call returns well over a thousand voices, so the
// mirror is written in batches rather than one round trip per voice.
const VOICE_UPSERT_CHUNK_SIZE = 25;

async function cacheVoices(ctx: AivoovContext, voices: Voice[]): Promise<void> {
	for (let i = 0; i < voices.length; i += VOICE_UPSERT_CHUNK_SIZE) {
		const chunk = voices.slice(i, i + VOICE_UPSERT_CHUNK_SIZE);
		await Promise.all(
			chunk.map((voice) =>
				ctx.db.voices.upsertByEntityId(voice.voice_id, {
					...voice,
					updatedAt: new Date(),
				}),
			),
		);
	}
}

export const list: AivoovEndpoints['listVoices'] = async (ctx, input) => {
	const response = await makeAivoovRequest<ListVoicesResponse>(
		'/voices',
		ctx.key,
		{ query: { language_code: input.language_code } },
	);

	assertAivoovSuccess(response, 'voices.list');

	// AiVOOV limits this endpoint to 20 calls per day and explicitly recommends
	// storing the catalogue locally, so every call refreshes the mirror. A
	// database failure must not fail the API call itself.
	try {
		await cacheVoices(ctx, response.data);
	} catch (error) {
		console.warn('[aivoov] Failed to cache voices:', error);
	}

	await logEventFromContext(
		ctx,
		'aivoov.voices.list',
		{
			language_code: input.language_code,
			voice_count: response.data.length,
		},
		'completed',
	);

	return response;
};
