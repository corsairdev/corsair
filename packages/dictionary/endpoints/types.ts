import { z } from 'zod';

// ── Raw Merriam-Webster response shapes ──────────────────────────────────────
// The Collegiate Dictionary API's full entry format includes deeply nested,
// tagged-tuple definition trees (`def[].sseq`) that aren't practical to model
// with zod. `.loose()` keeps parsing tolerant of that structure while we only
// pull out the fields callers actually need (shortdef, headword, etc.).

const MWSoundSchema = z
	.object({
		audio: z.string(),
	})
	.loose();

const MWPronunciationSchema = z
	.object({
		mw: z.string().optional(),
		sound: MWSoundSchema.optional(),
	})
	.loose();

const MWHeadwordInfoSchema = z
	.object({
		hw: z.string(),
		prs: z.array(MWPronunciationSchema).optional(),
	})
	.loose();

const MWMetaSchema = z
	.object({
		id: z.string(),
		uuid: z.string().optional(),
		stems: z.array(z.string()).default([]),
		offensive: z.boolean().default(false),
	})
	.loose();

const MWRawEntrySchema = z
	.object({
		meta: MWMetaSchema,
		hwi: MWHeadwordInfoSchema.optional(),
		fl: z.string().optional(),
		shortdef: z.array(z.string()).default([]),
	})
	.loose();

export type MWRawEntry = z.infer<typeof MWRawEntrySchema>;

// Merriam-Webster returns an array of raw entries when the word matches, or
// an array of plain suggestion strings when it doesn't — always HTTP 200.
export const MWLookupResponseSchema = z.array(
	z.union([MWRawEntrySchema, z.string()]),
);

// ── words.get ─────────────────────────────────────────────────────────────────

const GetWordInputSchema = z.object({
	word: z.string().min(1).describe('The word to look up'),
});

export type GetWordInput = z.infer<typeof GetWordInputSchema>;

const DictionaryEntrySchema = z.object({
	id: z
		.string()
		.describe(
			'Merriam-Webster entry id, e.g. "pencil" or "pencil:2" for homographs',
		),
	headword: z
		.string()
		.describe('The headword with syllable breaks, e.g. "pen*cil"'),
	partOfSpeech: z.string().optional(),
	pronunciation: z
		.string()
		.optional()
		.describe('Phonetic pronunciation spelling'),
	audioUrl: z.string().optional().describe('MP3 pronunciation audio URL'),
	shortDefinitions: z.array(z.string()),
	stems: z
		.array(z.string())
		.describe('Related word forms (plurals, inflections, etc.)'),
	offensive: z.boolean(),
});

export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;

const GetWordResponseSchema = z.object({
	found: z.boolean(),
	entries: z.array(DictionaryEntrySchema),
	suggestions: z
		.array(z.string())
		.describe('Spelling suggestions returned when no entry matched the word'),
});

export type GetWordResponse = z.infer<typeof GetWordResponseSchema>;

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type DictionaryEndpointInputs = {
	wordsGet: GetWordInput;
};

export type DictionaryEndpointOutputs = {
	wordsGet: GetWordResponse;
};

export const DictionaryEndpointInputSchemas = {
	wordsGet: GetWordInputSchema,
} as const;

export const DictionaryEndpointOutputSchemas = {
	wordsGet: GetWordResponseSchema,
} as const;
