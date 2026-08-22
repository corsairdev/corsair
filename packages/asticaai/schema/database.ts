import { z } from 'zod';

// Fields mirror the documented Astica responses in ../endpoints/types.
// upsertByEntityId replaces the data column wholesale, so each entity notes the
// key it is stored under.

/** Keyed by the URI-encoded `input` (image URL or base64 digest). */
export const AsticaAiReadTextResult = z.object({
	input: z.string(),
	modelVersion: z.string(),
	/** Flattened from readResult.content. */
	content: z.string().nullable().optional(),
	pageCount: z.number().int().optional(),
	lineCount: z.number().int().optional(),
	readAt: z.coerce.date().optional(),
});

/** Keyed by the URI-encoded `input` (audio URL or base64 digest). */
export const AsticaAiAudioTranscript = z.object({
	input: z.string(),
	modelVersion: z.string(),
	text: z.string().nullable().optional(),
	/** Present instead of `text` when the job was queued with low_priority. */
	resultURI: z.string().nullable().optional(),
	transcribedAt: z.coerce.date().optional(),
});

export type AsticaAiReadTextResult = z.infer<typeof AsticaAiReadTextResult>;
export type AsticaAiAudioTranscript = z.infer<typeof AsticaAiAudioTranscript>;
