import { z } from 'zod';

export const GetEntryInputSchema = z.object({
	word: z.string().trim().min(1, 'Word must not be empty'),
});

export type GetEntryInput = z.infer<typeof GetEntryInputSchema>;

export const DictionaryEntryMetaSchema = z
	.object({
		id: z.string(),
		uuid: z.string().optional(),
		sort: z.string().optional(),
		src: z.string().optional(),
		section: z.string().optional(),
		stems: z.array(z.string()).optional(),
		offensive: z.boolean().optional(),
	})
	.passthrough();

export type DictionaryEntryMeta = z.infer<typeof DictionaryEntryMetaSchema>;

export const DictionaryEntryPronunciationSchema = z
	.object({
		mw: z.string().optional(),
		sound: z
			.object({
				audio: z.string().optional(),
				ref: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export type DictionaryEntryPronunciation = z.infer<
	typeof DictionaryEntryPronunciationSchema
>;

export const DictionaryEntryHeadwordSchema = z
	.object({
		hw: z.string().optional(),
		prs: z.array(DictionaryEntryPronunciationSchema).optional(),
	})
	.passthrough();

export type DictionaryEntryHeadword = z.infer<
	typeof DictionaryEntryHeadwordSchema
>;

export const DictionaryEntrySchema = z
	.object({
		meta: DictionaryEntryMetaSchema.optional(),
		hwi: DictionaryEntryHeadwordSchema.optional(),
		fl: z.string().optional(),
		shortdef: z.array(z.string()).optional(),
		date: z.string().optional(),
		def: z.array(z.unknown()).optional(),
		et: z.array(z.unknown()).optional(),
	})
	.passthrough();

export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;

export const GetEntryOutputSchema = z.array(
	z.union([DictionaryEntrySchema, z.string()]),
);

export type GetEntryOutput = z.infer<typeof GetEntryOutputSchema>;

export type DictionaryApiEndpointInputs = {
	entriesGet: GetEntryInput;
};

export type DictionaryApiEndpointOutputs = {
	entriesGet: GetEntryOutput;
};

export const DictionaryApiEndpointInputSchemas = {
	entriesGet: GetEntryInputSchema,
} as const;

export const DictionaryApiEndpointOutputSchemas = {
	entriesGet: GetEntryOutputSchema,
} as const;
