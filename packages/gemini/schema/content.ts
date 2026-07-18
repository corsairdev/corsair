import { z } from 'zod';

/**
 * A single piece of content — either inline text or inline binary data
 * (base64). Gemini also supports function-call/response parts, which are
 * out of scope for the operations this plugin exposes.
 */
export const PartSchema = z.object({
	text: z.string().optional(),
	inlineData: z
		.object({
			mimeType: z.string(),
			data: z.string().describe('Base64-encoded bytes'),
		})
		.optional(),
});
export type Part = z.infer<typeof PartSchema>;

export const ContentSchema = z.object({
	role: z.enum(['user', 'model']).optional(),
	parts: z.array(PartSchema),
});
export type Content = z.infer<typeof ContentSchema>;

export const SafetySettingSchema = z.object({
	// Google occasionally adds new harm categories/thresholds; keep these as
	// free-form strings rather than a rigid enum that would need updating.
	category: z.string(),
	threshold: z.string(),
});
export type SafetySetting = z.infer<typeof SafetySettingSchema>;

export const GenerationConfigSchema = z
	.object({
		temperature: z.number().optional(),
		topP: z.number().optional(),
		topK: z.number().optional(),
		candidateCount: z.number().optional(),
		maxOutputTokens: z.number().optional(),
		stopSequences: z.array(z.string()).optional(),
		responseModalities: z.array(z.enum(['TEXT', 'IMAGE', 'AUDIO'])).optional(),
	})
	// Forward-compat: Google adds new generationConfig fields (e.g. thinkingConfig)
	// independently of this plugin; unmodeled fields pass through untouched.
	.catchall(z.unknown());
export type GenerationConfig = z.infer<typeof GenerationConfigSchema>;

export const UsageMetadataSchema = z
	.object({
		promptTokenCount: z.number().optional(),
		candidatesTokenCount: z.number().optional(),
		totalTokenCount: z.number().optional(),
		cachedContentTokenCount: z.number().optional(),
	})
	// Forward-compat: Google adds new usage counters over time.
	.catchall(z.unknown());
export type UsageMetadata = z.infer<typeof UsageMetadataSchema>;

export const CandidateSchema = z
	.object({
		content: ContentSchema.optional(),
		finishReason: z.string().optional(),
		index: z.number().optional(),
		// Raw safety-rating objects vary by category/model and aren't worth
		// fully modeling for this plugin's purposes.
		safetyRatings: z.array(z.unknown()).optional(),
	})
	.catchall(z.unknown());
export type Candidate = z.infer<typeof CandidateSchema>;
