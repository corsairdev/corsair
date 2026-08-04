import { z } from 'zod';
import {
	CandidateSchema,
	ContentSchema,
	GenerationConfigSchema,
	SafetySettingSchema,
	UsageMetadataSchema,
} from '../schema/content';
import { GEMINI_IMAGE_MODELS, GeneratedImageSchema } from '../schema/images';
import { ModelSchema } from '../schema/models';
import {
	GEMINI_VIDEO_MODELS,
	VideoFileSchema,
	VideoInstanceSchema,
	VideoOperationSchema,
	VideoParametersSchema,
} from '../schema/videos';

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_COUNT_TOKENS
// ─────────────────────────────────────────────────────────────────────────────

const CountTokensInputSchema = z.object({
	model: z
		.string()
		.default('gemini-2.5-flash')
		.describe(
			'Gemini model to count tokens against, e.g. gemini-2.5-flash, gemini-2.5-pro',
		),
	contents: z.array(ContentSchema).describe('The content to count tokens for'),
});
export type CountTokensInput = z.infer<typeof CountTokensInputSchema>;

const CountTokensResponseSchema = z.object({
	totalTokens: z.number(),
	cachedContentTokenCount: z.number().optional(),
});
export type CountTokensResponse = z.infer<typeof CountTokensResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_EMBED_CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const EmbedContentInputSchema = z.object({
	model: z
		.string()
		.default('gemini-embedding-001')
		.describe('Gemini embedding model, e.g. gemini-embedding-001'),
	content: ContentSchema.describe('The content to embed'),
	taskType: z
		.string()
		.optional()
		.describe(
			'Optional task type hint, e.g. SEMANTIC_SIMILARITY, RETRIEVAL_QUERY, RETRIEVAL_DOCUMENT, CLASSIFICATION, CLUSTERING',
		),
	title: z
		.string()
		.optional()
		.describe('Optional title, used with RETRIEVAL_DOCUMENT taskType'),
});
export type EmbedContentInput = z.infer<typeof EmbedContentInputSchema>;

const EmbedContentResponseSchema = z.object({
	embedding: z.object({
		values: z.array(z.number()),
	}),
});
export type EmbedContentResponse = z.infer<typeof EmbedContentResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_GENERATE_CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const GenerateContentInputSchema = z.object({
	model: z
		.string()
		.default('gemini-2.5-flash')
		.describe(
			'Gemini model to generate with, e.g. gemini-2.5-flash, gemini-2.5-pro',
		),
	contents: z
		.array(ContentSchema)
		.describe('Conversation contents to generate a response for'),
	generationConfig: GenerationConfigSchema.optional(),
	safetySettings: z.array(SafetySettingSchema).optional(),
	systemInstruction: ContentSchema.optional(),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentResponseSchema = z.object({
	candidates: z.array(CandidateSchema).optional(),
	usageMetadata: UsageMetadataSchema.optional(),
	text: z
		.string()
		.optional()
		.describe(
			'Convenience field: first candidate text with markdown code fences stripped',
		),
});
export type GenerateContentResponse = z.infer<
	typeof GenerateContentResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_GENERATE_IMAGE
// ─────────────────────────────────────────────────────────────────────────────

const GenerateImageInputSchema = z.object({
	model: z
		.string()
		.default(GEMINI_IMAGE_MODELS[0])
		.describe(
			`Nano Banana image model, e.g. ${GEMINI_IMAGE_MODELS.join(', ')}`,
		),
	prompt: z.string().describe('Text prompt describing the image to generate'),
	referenceImages: z
		.array(
			z.object({
				mimeType: z.string(),
				data: z.string().describe('Base64-encoded reference image bytes'),
			}),
		)
		.optional()
		.describe(
			'Optional reference/input images for image editing or composition',
		),
	generationConfig: GenerationConfigSchema.optional(),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageResponseSchema = z.object({
	images: z.array(GeneratedImageSchema),
	candidates: z.array(CandidateSchema).optional(),
	usageMetadata: UsageMetadataSchema.optional(),
});
export type GenerateImageResponse = z.infer<typeof GenerateImageResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_GENERATE_VIDEOS
// ─────────────────────────────────────────────────────────────────────────────

const GenerateVideosInputSchema = z.object({
	model: z
		.string()
		.default(GEMINI_VIDEO_MODELS[0])
		.describe(`Veo video model, e.g. ${GEMINI_VIDEO_MODELS.join(', ')}`),
	prompt: z.string().describe('Text prompt describing the video to generate'),
	image: VideoInstanceSchema.shape.image,
	parameters: VideoParametersSchema.optional(),
});
export type GenerateVideosInput = z.infer<typeof GenerateVideosInputSchema>;

const GenerateVideosResponseSchema = z.object({
	operationName: z
		.string()
		.describe('Pass to GEMINI_GET_VIDEOS_OPERATION or GEMINI_WAIT_FOR_VIDEO'),
	done: z.boolean().optional(),
});
export type GenerateVideosResponse = z.infer<
	typeof GenerateVideosResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_GET_VIDEOS_OPERATION (deprecated — prefer GEMINI_WAIT_FOR_VIDEO)
// ─────────────────────────────────────────────────────────────────────────────

const GetVideosOperationInputSchema = z.object({
	operationName: z
		.string()
		.describe('The operation name returned by GEMINI_GENERATE_VIDEOS'),
});
export type GetVideosOperationInput = z.infer<
	typeof GetVideosOperationInputSchema
>;

const GetVideosOperationResponseSchema = VideoOperationSchema;
export type GetVideosOperationResponse = z.infer<
	typeof GetVideosOperationResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_WAIT_FOR_VIDEO
// ─────────────────────────────────────────────────────────────────────────────

const WaitForVideoInputSchema = z.object({
	operationName: z
		.string()
		.describe('The operation name returned by GEMINI_GENERATE_VIDEOS'),
	pollIntervalMs: z
		.number()
		.default(10_000)
		.describe('Delay between status checks'),
	timeoutMs: z
		.number()
		.default(300_000)
		.describe('Give up and return done=false after this long'),
});
export type WaitForVideoInput = z.infer<typeof WaitForVideoInputSchema>;

const WaitForVideoResponseSchema = z.object({
	operationName: z.string(),
	done: z.boolean(),
	data: z
		.object({
			video_file: VideoFileSchema.optional(),
		})
		.optional(),
	error: z
		.object({
			code: z.number().optional(),
			message: z.string().optional(),
		})
		.optional(),
});
export type WaitForVideoResponse = z.infer<typeof WaitForVideoResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_LIST_MODELS
// ─────────────────────────────────────────────────────────────────────────────

const ListModelsInputSchema = z.object({
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;

const ListModelsResponseSchema = z.object({
	models: z.array(ModelSchema),
	nextPageToken: z.string().optional(),
});
export type ListModelsResponse = z.infer<typeof ListModelsResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Aggregate maps
// ─────────────────────────────────────────────────────────────────────────────

export type GeminiEndpointInputs = {
	countTokens: CountTokensInput;
	embedContent: EmbedContentInput;
	generateContent: GenerateContentInput;
	generateImage: GenerateImageInput;
	generateVideos: GenerateVideosInput;
	getVideosOperation: GetVideosOperationInput;
	waitForVideo: WaitForVideoInput;
	listModels: ListModelsInput;
};

export type GeminiEndpointOutputs = {
	countTokens: CountTokensResponse;
	embedContent: EmbedContentResponse;
	generateContent: GenerateContentResponse;
	generateImage: GenerateImageResponse;
	generateVideos: GenerateVideosResponse;
	getVideosOperation: GetVideosOperationResponse;
	waitForVideo: WaitForVideoResponse;
	listModels: ListModelsResponse;
};

export const GeminiEndpointInputSchemas = {
	countTokens: CountTokensInputSchema,
	embedContent: EmbedContentInputSchema,
	generateContent: GenerateContentInputSchema,
	generateImage: GenerateImageInputSchema,
	generateVideos: GenerateVideosInputSchema,
	getVideosOperation: GetVideosOperationInputSchema,
	waitForVideo: WaitForVideoInputSchema,
	listModels: ListModelsInputSchema,
} as const;

export const GeminiEndpointOutputSchemas = {
	countTokens: CountTokensResponseSchema,
	embedContent: EmbedContentResponseSchema,
	generateContent: GenerateContentResponseSchema,
	generateImage: GenerateImageResponseSchema,
	generateVideos: GenerateVideosResponseSchema,
	getVideosOperation: GetVideosOperationResponseSchema,
	waitForVideo: WaitForVideoResponseSchema,
	listModels: ListModelsResponseSchema,
} as const;
