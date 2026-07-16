import { z } from 'zod';

export const AudioCreateSpeechInputSchema = z.object({
	model: z.string(),
	input: z.string(),
	voice: z.string(),
	responseFormat: z
		.enum(['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm'])
		.optional(),
	speed: z.number().optional(),
	instructions: z.string().optional(),
});
export type AudioCreateSpeechInput = z.infer<
	typeof AudioCreateSpeechInputSchema
>;

export const AudioCreateSpeechResponseSchema = z.object({
	audioBase64: z.string(),
	format: z.string(),
});
export type AudioCreateSpeechResponse = z.infer<
	typeof AudioCreateSpeechResponseSchema
>;

export const AudioCreateTranscriptionInputSchema = z.object({
	file: z.union([z.instanceof(Blob), z.string()]),
	fileName: z.string(),
	model: z.string(),
	language: z.string().optional(),
	prompt: z.string().optional(),
	responseFormat: z
		.enum(['json', 'text', 'srt', 'verbose_json', 'vtt'])
		.optional(),
	temperature: z.number().optional(),
	timestampGranularities: z.array(z.enum(['word', 'segment'])).optional(),
});
export type AudioCreateTranscriptionInput = z.infer<
	typeof AudioCreateTranscriptionInputSchema
>;

// Extra fields (language, duration, segments, etc.) vary by responseFormat; using catchall to accept whatever the API returns.
export const AudioCreateTranscriptionResponseSchema = z
	.object({
		text: z.string(),
	})
	.catchall(z.unknown());
export type AudioCreateTranscriptionResponse = z.infer<
	typeof AudioCreateTranscriptionResponseSchema
>;

export const AudioCreateTranslationInputSchema = z.object({
	file: z.union([z.instanceof(Blob), z.string()]),
	fileName: z.string(),
	model: z.string(),
	prompt: z.string().optional(),
	responseFormat: z
		.enum(['json', 'text', 'srt', 'verbose_json', 'vtt'])
		.optional(),
	temperature: z.number().optional(),
});
export type AudioCreateTranslationInput = z.infer<
	typeof AudioCreateTranslationInputSchema
>;

// Extra fields vary by responseFormat, same as AudioCreateTranscriptionResponseSchema; using catchall to accept them.
export const AudioCreateTranslationResponseSchema = z
	.object({
		text: z.string(),
	})
	.catchall(z.unknown());
export type AudioCreateTranslationResponse = z.infer<
	typeof AudioCreateTranslationResponseSchema
>;
