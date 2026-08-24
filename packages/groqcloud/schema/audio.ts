import { z } from 'zod';

export const audioSchemas = {
	audioCreateTranscription: {
		input: z
			.object({
				// Groq accepts either an uploaded file or a `url` it fetches
				// server-side. A plain string is uploaded as literal UTF-8 bytes and
				// rejected with "could not process file - is it a valid media file?",
				// so it is not accepted here.
				file: z
					.instanceof(Blob)
					.optional()
					.describe('The audio data to transcribe'),
				fileName: z
					.string()
					.optional()
					.describe('File name for the uploaded audio; required with `file`'),
				url: z
					.string()
					.optional()
					.describe('Publicly reachable URL of the audio to transcribe'),
				model: z.string().describe('The ID of the model to use'),
				language: z
					.string()
					.optional()
					.describe('The language of the input audio'),
				prompt: z
					.string()
					.optional()
					.describe('An optional text to guide the model'),
				response_format: z
					.enum(['json', 'text', 'verbose_json'])
					.optional()
					.describe(
						'Transcript output format. Groq accepts only json, text and verbose_json — srt and vtt are rejected with HTTP 400.',
					),
				temperature: z.number().optional().describe('The sampling temperature'),
			})
			.refine((v) => Boolean(v.file) !== Boolean(v.url), {
				message: 'Provide exactly one of `file` or `url`',
			})
			.refine((v) => !v.file || Boolean(v.fileName), {
				message: '`fileName` is required when `file` is provided',
			}),
		output: z
			.object({
				text: z.string().describe('The transcribed text'),
			})
			.passthrough(),
	},

	audioCreateTranslation: {
		input: z
			.object({
				// Groq accepts either an uploaded file or a `url` it fetches
				// server-side. A plain string is uploaded as literal UTF-8 bytes and
				// rejected with "could not process file - is it a valid media file?",
				// so it is not accepted here.
				file: z
					.instanceof(Blob)
					.optional()
					.describe('The audio data to translate'),
				fileName: z
					.string()
					.optional()
					.describe('File name for the uploaded audio; required with `file`'),
				url: z
					.string()
					.optional()
					.describe('Publicly reachable URL of the audio to translate'),
				model: z.string().describe('The ID of the model to use'),
				prompt: z
					.string()
					.optional()
					.describe('An optional text to guide the model'),
				response_format: z
					.enum(['json', 'text', 'verbose_json'])
					.optional()
					.describe(
						'Transcript output format. Groq accepts only json, text and verbose_json — srt and vtt are rejected with HTTP 400.',
					),
				temperature: z.number().optional().describe('The sampling temperature'),
			})
			.refine((v) => Boolean(v.file) !== Boolean(v.url), {
				message: 'Provide exactly one of `file` or `url`',
			})
			.refine((v) => !v.file || Boolean(v.fileName), {
				message: '`fileName` is required when `file` is provided',
			}),
		output: z
			.object({
				text: z.string().describe('The translated text'),
			})
			.passthrough(),
	},

	audioListVoices: {
		input: z.object({}),
		output: z.object({
			english: z.array(z.string()).describe('List of English TTS voices'),
			arabic: z.array(z.string()).describe('List of Arabic TTS voices'),
		}),
	},
};

export type AudioCreateTranscriptionInput = z.infer<
	typeof audioSchemas.audioCreateTranscription.input
>;
export type AudioCreateTranscriptionResponse = z.infer<
	typeof audioSchemas.audioCreateTranscription.output
>;

export type AudioCreateTranslationInput = z.infer<
	typeof audioSchemas.audioCreateTranslation.input
>;
export type AudioCreateTranslationResponse = z.infer<
	typeof audioSchemas.audioCreateTranslation.output
>;

export type AudioListVoicesInput = z.infer<
	typeof audioSchemas.audioListVoices.input
>;
export type AudioListVoicesResponse = z.infer<
	typeof audioSchemas.audioListVoices.output
>;
