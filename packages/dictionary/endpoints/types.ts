import { z } from 'zod';

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
		src: z.string().optional(),
		section: z.string().optional(),
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
		et: z.array(z.unknown()).optional(),
		date: z.string().optional(),
	})
	.loose();

export type MWRawEntry = z.infer<typeof MWRawEntrySchema>;

export const MWLookupResponseSchema = z.array(
	z.union([MWRawEntrySchema, z.string()]),
);

const GetWordInputSchema = z.object({
	word: z.string().min(1).describe('The word to look up'),
});

export type GetWordInput = z.infer<typeof GetWordInputSchema>;

const DictionaryEntrySchema = z.object({
	id: z
		.string()
		.describe('Official meta.id, e.g. "pencil" or "pencil:2" for homographs'),
	headword: z.string().describe('Official hwi.hw, e.g. "pen*cil"'),
	partOfSpeech: z.string().optional().describe('Official fl'),
	pronunciation: z.string().optional().describe('Official hwi.prs[0].mw'),
	audioUrl: z
		.string()
		.optional()
		.describe('MP3 URL derived from official sound.audio'),
	shortDefinitions: z.array(z.string()).describe('Official shortdef'),
	etymology: z
		.array(z.string())
		.optional()
		.describe('Official et text members'),
	stems: z.array(z.string()).describe('Official meta.stems'),
	offensive: z.boolean().describe('Official meta.offensive'),
});

export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;

const GetWordResponseSchema = z.object({
	found: z.boolean(),
	entries: z.array(DictionaryEntrySchema),
	suggestions: z
		.array(z.string())
		.describe('Spelling suggestions when no entry matched'),
});

export type GetWordResponse = z.infer<typeof GetWordResponseSchema>;

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
