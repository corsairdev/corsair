import { z } from 'zod';

/**
 * Schemas for the AiVOOV Text-to-Speech API (v8).
 *
 * Field names and value ranges below are taken from the official reference at
 * https://github.com/AiVOOV/aivoov-api and its Postman collection
 * (https://documenter.getpostman.com/view/5434397/2sB2qXki3a).
 */

// Documented SSML bounds. AiVOOV also accepts the literal string `default` for
// each of these to mean "leave the provider default alone".
export const AIVOOV_PITCH_RATE_MIN = -50;
export const AIVOOV_PITCH_RATE_MAX = 50;
export const AIVOOV_SPEAKING_RATE_MIN = 20;
export const AIVOOV_SPEAKING_RATE_MAX = 200;
export const AIVOOV_VOLUME_MIN = -40;
export const AIVOOV_VOLUME_MAX = 40;

const ssmlSetting = (min: number, max: number) =>
	z.union([z.number().int().min(min).max(max), z.literal('default')]);

export const ListVoicesInputSchema = z.object({
	// BCP-47 code such as `en-US`. The full list of accepted values lives in
	// https://github.com/AiVOOV/aivoov-api/blob/main/Languages.md
	language_code: z.string().min(2).optional(),
});

export type ListVoicesInput = z.infer<typeof ListVoicesInputSchema>;

export const VoiceSchema = z
	.object({
		// The only field required to synthesise audio; passed as `voice_id[]`.
		voice_id: z.string(),
		name: z.string(),
		value: z.string().optional(),
		gender: z.string().optional(),
		language_code: z.string().optional(),
		language_name: z.string().optional(),
		label: z.string().optional(),
	})
	// AiVOOV adds voices (and occasionally fields) as upstream providers ship
	// them, so unknown keys are preserved rather than stripped.
	.loose();

export type Voice = z.infer<typeof VoiceSchema>;

export const ListVoicesResponseSchema = z.object({
	status: z.boolean(),
	message: z.string().optional(),
	data: z.array(VoiceSchema),
});

export type ListVoicesResponse = z.infer<typeof ListVoicesResponseSchema>;

export const CreateAudioInputSchema = z
	.object({
		voice_id: z.array(z.string().min(1)).min(1),
		transcribe_text: z.array(z.string().min(1)).min(1),
		transcribe_ssml_pitch_rate: z
			.array(ssmlSetting(AIVOOV_PITCH_RATE_MIN, AIVOOV_PITCH_RATE_MAX))
			.optional(),
		transcribe_ssml_spk_rate: z
			.array(ssmlSetting(AIVOOV_SPEAKING_RATE_MIN, AIVOOV_SPEAKING_RATE_MAX))
			.optional(),
		transcribe_ssml_volume: z
			.array(ssmlSetting(AIVOOV_VOLUME_MIN, AIVOOV_VOLUME_MAX))
			.optional(),
	})
	// "All array parameters should be in the same order to match voice and text
	// pairs." AiVOOV pairs them positionally, so a length mismatch silently
	// mis-assigns text to the wrong voice instead of erroring. Catch it locally.
	.superRefine((input, ctx) => {
		const expected = input.voice_id.length;
		const parallel = [
			['transcribe_text', input.transcribe_text],
			['transcribe_ssml_pitch_rate', input.transcribe_ssml_pitch_rate],
			['transcribe_ssml_spk_rate', input.transcribe_ssml_spk_rate],
			['transcribe_ssml_volume', input.transcribe_ssml_volume],
		] as const;

		for (const [field, value] of parallel) {
			if (value !== undefined && value.length !== expected) {
				ctx.addIssue({
					code: 'custom',
					path: [field],
					message: `${field} must have the same number of entries as voice_id (${expected}), received ${value.length}`,
				});
			}
		}
	});

export type CreateAudioInput = z.infer<typeof CreateAudioInputSchema>;

export const CreateAudioResponseSchema = z.object({
	status: z.boolean(),
	message: z.string().optional(),
	// Base64-encoded audio, decodable with any standard Base64 decoder.
	audio: z.string(),
});

export type CreateAudioResponse = z.infer<typeof CreateAudioResponseSchema>;

export type AivoovEndpointInputs = {
	listVoices: ListVoicesInput;
	createAudio: CreateAudioInput;
};

export type AivoovEndpointOutputs = {
	listVoices: ListVoicesResponse;
	createAudio: CreateAudioResponse;
};

export const AivoovEndpointInputSchemas = {
	listVoices: ListVoicesInputSchema,
	createAudio: CreateAudioInputSchema,
} as const;

export const AivoovEndpointOutputSchemas = {
	listVoices: ListVoicesResponseSchema,
	createAudio: CreateAudioResponseSchema,
} as const;
