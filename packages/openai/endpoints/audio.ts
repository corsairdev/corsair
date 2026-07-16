import { logEventFromContext } from 'corsair/core';
import { multipartOpenaiRequest, requestOpenaiBinary } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	AudioCreateSpeechResponse,
	AudioCreateTranscriptionResponse,
	AudioCreateTranslationResponse,
} from '../schema/audio';

export const createSpeech: OpenaiEndpoints['audioCreateSpeech'] = async (
	ctx,
	input,
) => {
	const buffer = await requestOpenaiBinary('audio/speech', ctx.key, {
		body: {
			model: input.model,
			input: input.input,
			voice: input.voice,
			response_format: input.responseFormat,
			speed: input.speed,
			instructions: input.instructions,
		},
	});
	const audioBase64 = Buffer.from(buffer).toString('base64');

	await logEventFromContext(
		ctx,
		'openai.audio.createSpeech',
		{ model: input.model, voice: input.voice },
		'completed',
	);
	const result: AudioCreateSpeechResponse = {
		audioBase64,
		format: input.responseFormat ?? 'mp3',
	};
	return result;
};

export const createTranscription: OpenaiEndpoints['audioCreateTranscription'] =
	async (ctx, input) => {
		const result =
			await multipartOpenaiRequest<AudioCreateTranscriptionResponse>(
				'audio/transcriptions',
				ctx.key,
				{
					files: [
						{ field: 'file', file: input.file, fileName: input.fileName },
					],
					fields: {
						model: input.model,
						language: input.language,
						prompt: input.prompt,
						response_format: input.responseFormat,
						temperature:
							input.temperature !== undefined
								? String(input.temperature)
								: undefined,
						// OpenAI expects one FormData entry per granularity:
						// timestamp_granularities[]=word&timestamp_granularities[]=segment
						'timestamp_granularities[]': input.timestampGranularities,
					},
				},
			);

		await logEventFromContext(
			ctx,
			'openai.audio.createTranscription',
			{ model: input.model, language: input.language },
			'completed',
		);
		return result;
	};

export const createTranslation: OpenaiEndpoints['audioCreateTranslation'] =
	async (ctx, input) => {
		const result = await multipartOpenaiRequest<AudioCreateTranslationResponse>(
			'audio/translations',
			ctx.key,
			{
				files: [{ field: 'file', file: input.file, fileName: input.fileName }],
				fields: {
					model: input.model,
					prompt: input.prompt,
					response_format: input.responseFormat,
					temperature:
						input.temperature !== undefined
							? String(input.temperature)
							: undefined,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'openai.audio.createTranslation',
			{ model: input.model },
			'completed',
		);
		return result;
	};
