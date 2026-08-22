import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// AivoovVoice
// Verified against live AiVOOV API v8: GET /voices
// All fields confirmed present in every response object.
// ─────────────────────────────────────────────────────────────────────────────

export const AivoovVoice = z.object({
	/** Unique voice UUID — pass as voice_id in audio creation requests. */
	voice_id: z.string(),
	/** API alias for voice_id (same value, returned for compatibility). */
	value: z.string(),
	/** Human-readable voice name (e.g. "Jenny"). */
	name: z.string(),
	/** Gender classification returned by AiVOOV (e.g. "Female", "Male", "Kids"). */
	gender: z.string(),
	/** Full language display name (e.g. "English (US)"). */
	language_name: z.string(),
	/** BCP-47 language code (e.g. "en-US", "af-ZA"). */
	language_code: z.string(),
	/** UI display label (e.g. "Jenny ( Female - Premium )"). */
	label: z.string(),
});

export type AivoovVoice = z.infer<typeof AivoovVoice>;

// ─────────────────────────────────────────────────────────────────────────────
// AivoovAudio
// Verified against live AiVOOV API v8: POST /create
// ─────────────────────────────────────────────────────────────────────────────

export const AivoovAudio = z.object({
	/** Whether audio was generated successfully. */
	status: z.boolean(),
	/** Human-readable result message from the API. */
	message: z.string(),
	/** URL or base64 content of the generated audio file. */
	audio: z.string(),
});

export type AivoovAudio = z.infer<typeof AivoovAudio>;
