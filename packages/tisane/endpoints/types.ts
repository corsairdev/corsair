import { z } from 'zod';
import {
	TisaneAbuseDetection,
	TisaneEntity,
	TisaneParseResult,
	TisaneSentimentAspect,
	TisaneTopic,
} from '../schema/database';

export const TisaneSettingsSchema = z
	.object({
		snippet: z.boolean().optional(),
		fetch_sentiment: z.boolean().optional(),
		fetch_topics: z.boolean().optional(),
		fetch_entities: z.boolean().optional(),
		fetch_abuse: z.boolean().optional(),
		format: z.string().optional(),
	})
	.passthrough();

export type TisaneSettings = z.infer<typeof TisaneSettingsSchema>;

// 1. Parse
export const TextParseInputSchema = z.object({
	content: z.string().describe('The text content to analyze'),
	language: z
		.string()
		.optional()
		.describe('Language code (e.g. "en", "es", "fr")'),
	settings: TisaneSettingsSchema.optional(),
});
export type TextParseInput = z.infer<typeof TextParseInputSchema>;

export const TextParseResponseSchema = TisaneParseResult;
export type TextParseResponse = z.infer<typeof TextParseResponseSchema>;

// 2. Sentiment
export const TextSentimentInputSchema = z.object({
	content: z.string().describe('Text to analyze for aspect-based sentiment'),
	language: z.string().optional(),
});
export type TextSentimentInput = z.infer<typeof TextSentimentInputSchema>;

export const TextSentimentResponseSchema = z.object({
	sentiment: z.array(TisaneSentimentAspect),
	text: z.string().optional(),
});
export type TextSentimentResponse = z.infer<typeof TextSentimentResponseSchema>;

// 3. Moderate / Abuse
export const TextModerateInputSchema = z.object({
	content: z
		.string()
		.describe('Text to check for abusive language, hate speech, or harassment'),
	language: z.string().optional(),
});
export type TextModerateInput = z.infer<typeof TextModerateInputSchema>;

export const TextModerateResponseSchema = z.object({
	abuse: z.array(TisaneAbuseDetection),
	flagged: z.boolean(),
});
export type TextModerateResponse = z.infer<typeof TextModerateResponseSchema>;

// 4. Extract Entities & Topics
export const TextExtractEntitiesInputSchema = z.object({
	content: z
		.string()
		.describe('Text to extract named entities and topics from'),
	language: z.string().optional(),
});
export type TextExtractEntitiesInput = z.infer<
	typeof TextExtractEntitiesInputSchema
>;

export const TextExtractEntitiesResponseSchema = z.object({
	entities: z.array(TisaneEntity),
	topics: z.array(TisaneTopic),
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
