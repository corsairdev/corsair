import { logEventFromContext } from 'corsair/core';
import { toFileOutput } from 'corsair/http';
import {
	DOWNLOAD_MAX_BYTES,
	multipartOpenaiRequest,
	OPENAI_UPLOAD_MAX_BYTES,
	requestOpenaiBinary,
} from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	AudioCreateSpeechResponse,
	AudioCreateTranscriptionResponse,
	AudioCreateTranslationResponse,
} from '../schema/audio';

/** Media type of each speech format OpenAI returns. */
const SPEECH_TYPES = {
	mp3: 'audio/mpeg',
	opus: 'audio/opus',
	aac: 'audio/aac',
	flac: 'audio/flac',
	wav: 'audio/wav',
	pcm: 'audio/pcm',
} as const;

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

	await logEventFromContext(
		ctx,
		'openai.audio.createSpeech',
		{ model: input.model, voice: input.voice },
		'completed',
	);
	const format = input.responseFormat ?? 'mp3';
	// The audio keeps its own key, audioBase64; everything else is core's file output.
	const { contentBase64, ...file } = toFileOutput(
		new Uint8Array(buffer),
		SPEECH_TYPES[format],
		{ filename: `speech.${format}`, maxBytes: DOWNLOAD_MAX_BYTES, text: false },
	);
	const result: AudioCreateSpeechResponse = {
		...file,
		...(contentBase64 ? { audioBase64: contentBase64 } : {}),
		format,
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
						{
							field: 'file',
							file: input.file,
							fileName: input.fileName,
							maxBytes: OPENAI_UPLOAD_MAX_BYTES.audio,
						},
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
				files: [
					{
						field: 'file',
						file: input.file,
						fileName: input.fileName,
						maxBytes: OPENAI_UPLOAD_MAX_BYTES.audio,
					},
				],
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
