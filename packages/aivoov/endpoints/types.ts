import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// List Voices
// API: GET /voices?language_code=<optional>
// Verified against live API: https://aivoov.com/api/v8/voices
// Response shape: { status: boolean, message: string, id: number, data: Voice[] }
// ─────────────────────────────────────────────────────────────────────────────

export const ListVoicesInputSchema = z.object({
	language_code: z
		.string()
		.optional()
		.describe(
			'BCP-47 language code to filter voices (e.g. "en-US", "af-ZA"). Omit to retrieve all 1000+ voices.',
		),
});

export type ListVoicesInput = z.infer<typeof ListVoicesInputSchema>;

export const VoiceSchema = z.object({
	/** Unique voice identifier — use this as voice_id when creating audio. */
	voice_id: z.string(),
	/** Duplicate of voice_id for compatibility with API response. */
	value: z.string(),
	name: z.string(),
	gender: z.string(),
	language_name: z.string(),
	language_code: z.string(),
	/** Human-readable label, e.g. "Jenny ( Female - Premium )". */
	label: z.string(),
});

export type Voice = z.infer<typeof VoiceSchema>;

export const ListVoicesResponseSchema = z.object({
	status: z.boolean(),
	message: z.string(),
	/** Request tracking ID returned by the AiVOOV API. */
	id: z.number().optional(),
	data: z.array(VoiceSchema),
});

export type ListVoicesResponse = z.infer<typeof ListVoicesResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Create Audio
// API: POST /create (application/x-www-form-urlencoded)
// All array params use the PHP-style `param[]` naming convention.
// ─────────────────────────────────────────────────────────────────────────────

export const CreateAudioInputSchema = z.object({
	/** Voice IDs to use, one per text segment. Must match transcribe_text length. */
	voice_id: z.array(z.string()).min(1),
	/** Text segments to synthesise, one per voice. */
	transcribe_text: z.array(z.string().min(1)).min(1),
	/**
	 * Pitch rate adjustments per segment.
	 * Integer in [-50, 50] or "default". Omit to use provider default.
	 */
	transcribe_ssml_pitch_rate: z
		.array(z.union([z.number().int().min(-50).max(50), z.literal('default')]))
		.optional(),
	/**
	 * Speaking rate per segment.
	 * Integer in [20, 200] (percent) or "default". Omit to use provider default.
	 */
	transcribe_ssml_spk_rate: z
		.array(z.union([z.number().int().min(20).max(200), z.literal('default')]))
		.optional(),
	/**
	 * Volume adjustments per segment.
	 * Integer in [-40, 40] (dB) or "default". Omit to use provider default.
	 */
	transcribe_ssml_volume: z
		.array(z.union([z.number().int().min(-40).max(40), z.literal('default')]))
		.optional(),
});

export type CreateAudioInput = z.infer<typeof CreateAudioInputSchema>;

export const CreateAudioResponseSchema = z.object({
	status: z.boolean(),
	message: z.string(),
	/** URL or base64 of the generated audio file. */
	audio: z.string(),
});

export type CreateAudioResponse = z.infer<typeof CreateAudioResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint I/O Map
// ─────────────────────────────────────────────────────────────────────────────

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
