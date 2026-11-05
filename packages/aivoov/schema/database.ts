import { z } from 'zod';

/**
 * AiVOOV caps `GET /voices` at 20 calls per day and its documentation
 * explicitly recommends keeping the catalogue locally:
 * "This endpoint api daily call limit is 20. So you can store the all voices
 * in your database and use as your requirement."
 *
 * This entity is that local mirror. Fields mirror the `/voices` payload
 * documented at https://github.com/AiVOOV/aivoov-api.
 */
export const AivoovVoice = z
	.object({
		// Stable identifier, also used as the entity id. Required by `create`.
		voice_id: z.string(),
		// Display name, e.g. "English Male 1".
		name: z.string(),
		// Provider-side value backing the voice, when AiVOOV exposes it.
		value: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		// BCP-47 code (e.g. `en-US`) and its human-readable name.
		language_code: z.string().nullable().optional(),
		language_name: z.string().nullable().optional(),
		// Pre-composed label AiVOOV uses in its own voice pickers.
		label: z.string().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	// Kept open so voices gain fields as Google/Amazon/IBM/Microsoft add them
	// upstream without requiring a schema bump here.
	.loose();

export type AivoovVoice = z.infer<typeof AivoovVoice>;
