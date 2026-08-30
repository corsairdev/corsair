import { z } from 'zod';

// Fields mirror the documented Astica responses in ../endpoints/types.
// The submitted input is never persisted: inline inputs are the image or the
// recording itself, and URL inputs can carry a signed query string. Rows record
// a sha256 fingerprint of the input plus its shape, which is also the entity id.

/** Keyed by inputFingerprint. */
export const AsticaAiReadTextResult = z.object({
	inputFingerprint: z.string(),
	inputKind: z.enum(['url', 'inline']),
	inputLength: z.number().int(),
	modelVersion: z.string(),
	/** Flattened from readResult.content. */
	content: z.string().nullable().optional(),
	pageCount: z.number().int().optional(),
	lineCount: z.number().int().optional(),
	readAt: z.coerce.date().optional(),
});

/** Keyed by inputFingerprint. */
export const AsticaAiAudioTranscript = z.object({
	inputFingerprint: z.string(),
	inputKind: z.enum(['url', 'inline']),
	inputLength: z.number().int(),
	modelVersion: z.string(),
	text: z.string().nullable().optional(),
	/** Present instead of `text` when the job was queued with low_priority. */
	resultURI: z.string().nullable().optional(),
	transcribedAt: z.coerce.date().optional(),
});

export type AsticaAiReadTextResult = z.infer<typeof AsticaAiReadTextResult>;
export type AsticaAiAudioTranscript = z.infer<typeof AsticaAiAudioTranscript>;
