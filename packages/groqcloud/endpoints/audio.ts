import { logEventFromContext } from 'corsair/core';
import { multipartGroqcloudRequest } from '../client';
import type { GroqcloudEndpoints } from '../index';
import type {
	AudioCreateTranscriptionResponse,
	AudioCreateTranslationResponse,
	AudioListVoicesResponse,
} from '../schema/audio';

export const createTranscription: GroqcloudEndpoints['audioCreateTranscription'] =
	async (ctx, input) => {
		const result =
			await multipartGroqcloudRequest<AudioCreateTranscriptionResponse>(
				'audio/transcriptions',
				ctx.key,
				{
					// Either an uploaded file or a `url` Groq fetches server-side;
					// the input schema guarantees exactly one is present.
					files: input.file
						? [
								{
									field: 'file',
									file: input.file,
									fileName: input.fileName ?? 'audio',
								},
							]
						: [],
					fields: {
						url: input.url,
						model: input.model,
						language: input.language,
						prompt: input.prompt,
						response_format: input.response_format,
						temperature: input.temperature?.toString(),
					},
				},
			);

		await logEventFromContext(
			ctx,
			'groqcloud.audio.createTranscription',
			{ model: input.model },
			'completed',
		);

		return result;
	};

export const createTranslation: GroqcloudEndpoints['audioCreateTranslation'] =
	async (ctx, input) => {
		const result =
			await multipartGroqcloudRequest<AudioCreateTranslationResponse>(
				'audio/translations',
				ctx.key,
				{
					// Either an uploaded file or a `url` Groq fetches server-side;
					// the input schema guarantees exactly one is present.
					files: input.file
						? [
								{
									field: 'file',
									file: input.file,
									fileName: input.fileName ?? 'audio',
								},
							]
						: [],
					fields: {
						url: input.url,
						model: input.model,
						prompt: input.prompt,
						response_format: input.response_format,
						temperature: input.temperature?.toString(),
					},
				},
			);

		await logEventFromContext(
			ctx,
			'groqcloud.audio.createTranslation',
			{ model: input.model },
			'completed',
		);

		return result;
	};

export const listVoices: GroqcloudEndpoints['audioListVoices'] = async (
	ctx,
) => {
	const result: AudioListVoicesResponse = {
		english: [
			'Arista-PlayAI',
			'Atlas-PlayAI',
			'Basil-PlayAI',
			'Briggs-PlayAI',
			'Calum-PlayAI',
			'Celeste-PlayAI',
			'Cheyenne-PlayAI',
			'Chip-PlayAI',
			'Cillian-PlayAI',
			'Deedee-PlayAI',
			'Fritz-PlayAI',
			'Gail-PlayAI',
			'Indigo-PlayAI',
			'Mamaw-PlayAI',
			'Mason-PlayAI',
			'Mikail-PlayAI',
			'Mitch-PlayAI',
			'Quinn-PlayAI',
			'Thunder-PlayAI',
		],
		arabic: ['Nasser-PlayAI', 'Khalid-PlayAI', 'Amira-PlayAI', 'Ahmad-PlayAI'],
	};

	await logEventFromContext(ctx, 'groqcloud.audio.listVoices', {}, 'completed');

	return result;
};
