import { z } from 'zod';

const AttackDetectedSchema = z
	.object({
		zero_width_space: z.boolean().optional(),
		homoglyph_attack: z.boolean().optional(),
	})
	.loose();

const SentenceScoreSchema = z
	.object({
		text: z.string(),
		score: z.number(),
	})
	.loose();

const DetectAiTextInputSchema = z
	.object({
		text: z.string().optional(),
		file: z.string().optional(),
		website: z.string().optional(),
		version: z.string().optional(),
		sentences: z.boolean().optional(),
		language: z.string().optional(),
	})
	.refine((value) => Boolean(value.text || value.file || value.website), {
		message: 'Provide text, a public file URL, or a website URL',
	})
	.refine((value) => value.text === undefined || value.text.length >= 300, {
		message: 'text must be at least 300 characters',
	});

export type DetectAiTextInput = z.infer<typeof DetectAiTextInputSchema>;

const DetectAiTextResponseSchema = z
	.object({
		status: z.number().optional(),
		score: z.number(),
		sentences: z.array(SentenceScoreSchema).optional(),
		input: z.string().optional(),
		attack_detected: AttackDetectedSchema.optional(),
		readability_score: z.number().optional(),
		credits_used: z.number().optional(),
		credits_remaining: z.number().optional(),
		version: z.string().optional(),
		language: z.string().optional(),
	})
	.loose();

export type DetectAiTextResponse = z.infer<typeof DetectAiTextResponseSchema>;

const DetectPlagiarismInputSchema = z
	.object({
		text: z.string().optional(),
		file: z.string().optional(),
		website: z.string().optional(),
		excluded_sources: z.array(z.string()).optional(),
		language: z.string().optional(),
		country: z.string().optional(),
	})
	.refine((value) => Boolean(value.text || value.file || value.website), {
		message: 'Provide text, a public file URL, or a website URL',
	})
	.refine((value) => value.text === undefined || value.text.length >= 100, {
		message: 'text must be at least 100 characters',
	});

export type DetectPlagiarismInput = z.infer<typeof DetectPlagiarismInputSchema>;

const PlagiarismScanInformationSchema = z
	.object({
		service: z.string().optional(),
		scanTime: z.string().optional(),
		inputType: z.string().optional(),
		language: z.string().optional(),
	})
	.loose();

const PlagiarismResultSchema = z
	.object({
		score: z.number().optional(),
		sourceCounts: z.number().optional(),
		textWordCounts: z.number().optional(),
		totalPlagiarismWords: z.number().optional(),
		identicalWordCounts: z.number().optional(),
		similarWordCounts: z.number().optional(),
	})
	.loose();

const PlagiarismSequenceSchema = z
	.object({
		startIndex: z.number().optional(),
		endIndex: z.number().optional(),
		sequence: z.string().nullable().optional(),
	})
	.loose();

const PlagiarismSourceSchema = z
	.object({
		score: z.number().optional(),
		canAccess: z.boolean().optional(),
		url: z.string().optional(),
		title: z.string().optional(),
		plagiarismWords: z.number().optional(),
		identicalWordCounts: z.number().optional(),
		similarWordCounts: z.number().optional(),
		totalNumberOfWords: z.number().optional(),
		author: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		publishedDate: z.number().nullable().optional(),
		source: z.string().nullable().optional(),
		citation: z.boolean().optional(),
		plagiarismFound: z.array(PlagiarismSequenceSchema).optional(),
		is_excluded: z.boolean().optional(),
	})
	.loose();

const DetectPlagiarismResponseSchema = z
	.object({
		status: z.number().optional(),
		scanInformation: PlagiarismScanInformationSchema.optional(),
		result: PlagiarismResultSchema.optional(),
		sources: z.array(PlagiarismSourceSchema).optional(),
		attackDetected: AttackDetectedSchema.optional(),
		text: z.string().optional(),
		credits_used: z.number().optional(),
		credits_remaining: z.number().optional(),
	})
	.loose();

export type DetectPlagiarismResponse = z.infer<
	typeof DetectPlagiarismResponseSchema
>;

const DetectAiImageInputSchema = z.object({
	url: z.string().min(1),
	version: z.string().optional(),
});

export type DetectAiImageInput = z.infer<typeof DetectAiImageInputSchema>;

const DetectAiImageResponseSchema = z
	.object({
		score: z.number(),
		human_probability: z.number().optional(),
		ai_probability: z.number().optional(),
		version: z.string().optional(),
		mime_type: z.string().optional(),
		credits_used: z.number().optional(),
		credits_remaining: z.number().optional(),
	})
	.loose();

export type DetectAiImageResponse = z.infer<typeof DetectAiImageResponseSchema>;

export type WinstonaiEndpointInputs = {
	detectAiText: DetectAiTextInput;
	detectPlagiarism: DetectPlagiarismInput;
	detectAiImage: DetectAiImageInput;
};

export type WinstonaiEndpointOutputs = {
	detectAiText: DetectAiTextResponse;
	detectPlagiarism: DetectPlagiarismResponse;
	detectAiImage: DetectAiImageResponse;
};

export const WinstonaiEndpointInputSchemas = {
	detectAiText: DetectAiTextInputSchema,
	detectPlagiarism: DetectPlagiarismInputSchema,
	detectAiImage: DetectAiImageInputSchema,
} as const;

export const WinstonaiEndpointOutputSchemas = {
	detectAiText: DetectAiTextResponseSchema,
	detectPlagiarism: DetectPlagiarismResponseSchema,
	detectAiImage: DetectAiImageResponseSchema,
} as const;
