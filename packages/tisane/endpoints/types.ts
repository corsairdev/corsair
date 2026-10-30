import { z } from 'zod';

export const TisaneSettingsSchema = z
	.object({
		snippets: z.boolean().optional(),
		sentiment: z.boolean().optional(),
		entities: z.boolean().optional(),
		topics: z.boolean().optional(),
		abuse: z.boolean().optional(),
		format: z.string().optional(),
		explain: z.boolean().optional(),
		topic_stats: z.boolean().optional(),
	})
	.passthrough();

export type TisaneSettings = z.infer<typeof TisaneSettingsSchema>;

export const TisaneSentimentExpressionSchema = z
	.object({
		polarity: z.enum(['positive', 'negative', 'mixed', 'neutral']),
		offset: z.number().optional(),
		length: z.number().optional(),
		sentence_index: z.number().optional(),
		targets: z.array(z.unknown()).optional(),
		reasons: z.array(z.unknown()).optional(),
		text: z.string().optional(),
		explanation: z.string().optional(),
	})
	.passthrough();

export type TisaneSentimentExpression = z.infer<
	typeof TisaneSentimentExpressionSchema
>;

export const TisaneAbuseDetectionSchema = z
	.object({
		type: z.string(),
		severity: z.string().optional(),
		text: z.string().optional(),
		offset: z.number().optional(),
		length: z.number().optional(),
		sentence_index: z.number().optional(),
		explanation: z.string().optional(),
	})
	.passthrough();

export type TisaneAbuseDetection = z.infer<typeof TisaneAbuseDetectionSchema>;

export const TisaneEntitySummarySchema = z
	.object({
		name: z.string(),
		type: z.unknown().optional(),
		subtypes: z.array(z.unknown()).optional(),
		wikidata: z.string().optional(),
		mentions: z.array(z.unknown()).optional(),
	})
	.passthrough();

export type TisaneEntitySummary = z.infer<typeof TisaneEntitySummarySchema>;

const TisaneTopicObjectSchema = z.object({
	topic: z.string(),
	coverage: z.number().optional(),
});

export const TisaneTopicSchema = z.union([
	z.string(),
	TisaneTopicObjectSchema.passthrough(),
]);

export type TisaneTopic = z.infer<typeof TisaneTopicSchema>;

export const TisaneParseResultSchema = z
	.object({
		text: z.string(),
		language: z.string().optional(),
		topics: z.array(TisaneTopicSchema).optional(),
		abuse: z.array(TisaneAbuseDetectionSchema).optional(),
		entities_summary: z.array(TisaneEntitySummarySchema).optional(),
		sentiment_expressions: z.array(TisaneSentimentExpressionSchema).optional(),
	})
	.passthrough();

export type TisaneParseResult = z.infer<typeof TisaneParseResultSchema>;

const LanguageSchema = z.string().min(1);

export const TextParseInputSchema = z.object({
	content: z.string().describe('The text content to analyze'),
	language: LanguageSchema.describe('ISO 639-1 language code'),
	settings: TisaneSettingsSchema.optional(),
});
export type TextParseInput = z.infer<typeof TextParseInputSchema>;

export const TextParseResponseSchema = TisaneParseResultSchema;
export type TextParseResponse = z.infer<typeof TextParseResponseSchema>;

export const TextSentimentInputSchema = z.object({
	content: z.string().describe('Text to analyze for aspect-based sentiment'),
	language: LanguageSchema,
});
export type TextSentimentInput = z.infer<typeof TextSentimentInputSchema>;

export const TextSentimentResponseSchema = z.object({
	sentiment: z.array(TisaneSentimentExpressionSchema),
	text: z.string().optional(),
});
export type TextSentimentResponse = z.infer<typeof TextSentimentResponseSchema>;

export const TextModerateInputSchema = z.object({
	content: z
		.string()
		.describe('Text to check for abusive language, hate speech, or harassment'),
	language: LanguageSchema,
});
export type TextModerateInput = z.infer<typeof TextModerateInputSchema>;

export const TextModerateResponseSchema = z.object({
	abuse: z.array(TisaneAbuseDetectionSchema),
	flagged: z.boolean(),
});
export type TextModerateResponse = z.infer<typeof TextModerateResponseSchema>;

export const TextExtractEntitiesInputSchema = z.object({
	content: z
		.string()
		.describe('Text to extract named entities and topics from'),
	language: LanguageSchema,
});
export type TextExtractEntitiesInput = z.infer<
	typeof TextExtractEntitiesInputSchema
>;

export const TextExtractEntitiesResponseSchema = z.object({
	entities: z.array(TisaneEntitySummarySchema),
	topics: z.array(TisaneTopicObjectSchema),
});
export type TextExtractEntitiesResponse = z.infer<
	typeof TextExtractEntitiesResponseSchema
>;

export type TisaneEndpointInputs = {
	textParse: TextParseInput;
	textSentiment: TextSentimentInput;
	textModerate: TextModerateInput;
	textExtractEntities: TextExtractEntitiesInput;
};

export type TisaneEndpointOutputs = {
	textParse: TextParseResponse;
	textSentiment: TextSentimentResponse;
	textModerate: TextModerateResponse;
	textExtractEntities: TextExtractEntitiesResponse;
};

export const TisaneEndpointInputSchemas = {
	textParse: TextParseInputSchema,
	textSentiment: TextSentimentInputSchema,
	textModerate: TextModerateInputSchema,
	textExtractEntities: TextExtractEntitiesInputSchema,
} as const;

export const TisaneEndpointOutputSchemas = {
	textParse: TextParseResponseSchema,
	textSentiment: TextSentimentResponseSchema,
	textModerate: TextModerateResponseSchema,
	textExtractEntities: TextExtractEntitiesResponseSchema,
} as const;
