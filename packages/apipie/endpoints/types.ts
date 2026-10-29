import { z } from 'zod';

const ModelMessageSchema = z
	.object({
		role: z.string(),
		content: z.string(),
	})
	.loose();

/**
 * One entry from `GET /v1/models`.
 *
 * Verified against a live response covering all 1217 catalogue entries. Every
 * field below is returned on every item; nullability marks the ones observed
 * null. Fields stay optional so a future API change degrades to a missing
 * value rather than failing the call, since `makeApipieRequest` parses.
 *
 * Note the string-typed numerics: `avg_cost`, `input_cost`, `output_cost`,
 * `latency` and `query_count` come back as numeric strings, not numbers.
 */
const ModelListItemSchema = z
	.object({
		id: z.string(),
		/** Provider-qualified name, e.g. `openai/gpt-4o`. */
		model: z.string().nullish(),
		provider: z.string().nullish(),
		type: z.string().nullish(),
		subtype: z.string().nullish(),
		route: z.string().nullish(),
		description: z.string().nullish(),
		/** APIpie returns 0/1 flags rather than booleans. */
		enabled: z.union([z.boolean(), z.number()]).nullish(),
		available: z.union([z.boolean(), z.number()]).nullish(),
		avg_cost: z.string().nullish(),
		input_cost: z.string().nullish(),
		output_cost: z.string().nullish(),
		price_type: z.string().nullish(),
		img_price: z.unknown().nullish(),
		img_json: z.record(z.string(), z.unknown()).nullish(),
		latency: z.string().nullish(),
		query_count: z.string().nullish(),
		max_tokens: z.number().nullish(),
		max_response_tokens: z.number().nullish(),
	})
	.loose();

const ModelsListResponseSchema = z.union([
	z.array(ModelListItemSchema),
	z
		.object({
			object: z.string().optional(),
			data: z.array(ModelListItemSchema),
		})
		.loose(),
]);

/**
 * One entry from `GET /v1/models/detailed`, verified against a live response
 * across all 1217 entries. This is a different, richer shape than the plain
 * list: it carries modality, capacity and quality fields the list omits.
 */
const DetailedModelListItemSchema = z
	.object({
		id: z.string(),
		model: z.string().nullish(),
		provider: z.string().nullish(),
		type: z.string().nullish(),
		subtype: z.string().nullish(),
		route: z.string().nullish(),
		description: z.string().nullish(),
		/** APIpie returns 0/1 flags rather than booleans. */
		enabled: z.union([z.boolean(), z.number()]).nullish(),
		available: z.union([z.boolean(), z.number()]).nullish(),
		abortable: z.boolean().nullish(),
		moderationRequired: z.boolean().nullish(),
		supports_multipart: z.boolean().nullish(),
		input_modalities: z.array(z.string()).nullish(),
		output_modalities: z.array(z.string()).nullish(),
		instruct_type: z.string().nullish(),
		quantization: z.string().nullish(),
		pool: z.string().nullish(),
		/** MMLU benchmark score; present for only a handful of models. */
		mmlu: z.number().nullish(),
		output_vector_size: z.number().nullish(),
		max_tokens: z.number().nullish(),
		max_response_tokens: z.number().nullish(),
		max_images_per_prompt: z.number().nullish(),
		max_audio_per_prompt: z.number().nullish(),
		max_audio_length_hours: z.number().nullish(),
		max_videos_per_prompt: z.number().nullish(),
		max_video_length: z.number().nullish(),
		max_pdf_size_mb: z.number().nullish(),
		/** Numeric strings, not numbers. */
		latency: z.string().nullish(),
		query_count: z.string().nullish(),
		pricing: z.record(z.string(), z.unknown()).nullish(),
		supported_input_parameters: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const ModelsDetailedResponseSchema = z
	.object({
		object: z.string().optional(),
		data: z.array(DetailedModelListItemSchema),
	})
	.loose();

const ChatCompletionChoiceSchema = z
	.object({
		index: z.number().optional(),
		message: ModelMessageSchema,
		finish_reason: z.string().optional(),
		finishReason: z.string().optional(),
	})
	.loose();

const ChatCompletionResponseSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		created: z.number().optional(),
		model: z.string().optional(),
		choices: z.array(ChatCompletionChoiceSchema),
		usage: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const EmbeddingItemSchema = z
	.object({
		object: z.string().optional(),
		index: z.number().optional(),
		embedding: z.array(z.number()),
	})
	.loose();

const EmbeddingsResponseSchema = z
	.object({
		object: z.string().optional(),
		model: z.string().optional(),
		data: z.array(EmbeddingItemSchema).min(1),
		usage: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ImageItemSchema = z
	.object({
		url: z.string().optional(),
		b64_json: z.string().optional(),
		revised_prompt: z.string().optional(),
	})
	.loose()
	.refine((v) => typeof v.url === 'string' || typeof v.b64_json === 'string', {
		message: 'url or b64_json is required',
	});

const ImagesResponseSchema = z
	.object({
		created: z.number().optional(),
		data: z.array(ImageItemSchema).min(1),
		usage: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ModelsListInputSchema = z
	.object({
		type: z.string().optional(),
		subtype: z.string().optional(),
		provider: z.string().optional(),
		model: z.string().optional(),
		enabled: z.number().optional(),
	})
	.loose();
const ModelsListDetailedInputSchema = z
	.object({
		type: z.string().optional(),
		provider: z.string().optional(),
		model: z.string().optional(),
	})
	.loose();
const ChatCreateCompletionInputSchema = z
	.object({
		model: z.string(),
		messages: z.array(ModelMessageSchema).min(1),
		provider: z.string().optional(),
		routing: z.enum(['price', 'perf', 'perf_avg']).optional(),
		maxTokens: z.number().optional(),
		temperature: z.number().optional(),
		topP: z.number().optional(),
		topK: z.number().optional(),
		frequencyPenalty: z.number().optional(),
		presencePenalty: z.number().optional(),
		stop: z.union([z.string(), z.array(z.string())]).optional(),
		n: z.number().optional(),
		memory: z.number().optional(),
		memSession: z.string().optional(),
		memExpire: z.number().optional(),
		memClear: z.number().optional(),
		integrity: z.number().optional(),
		integrityModel: z.string().optional(),
	})
	.loose();
const EmbeddingsCreateInputSchema = z
	.object({
		model: z.string(),
		input: z.union([z.string().min(1), z.array(z.string()).min(1)]),
		user: z.string().optional(),
	})
	.loose();
const ImagesGenerateInputSchema = z
	.object({
		model: z.string(),
		prompt: z.string().min(1),
		n: z.number().optional(),
		size: z.string().optional(),
		quality: z.string().optional(),
		style: z.string().optional(),
		responseFormat: z.string().optional(),
		user: z.string().optional(),
	})
	.loose();

export type ApipieEndpointInputs = {
	modelsList: z.infer<typeof ModelsListInputSchema>;
	modelsListDetailed: z.infer<typeof ModelsListDetailedInputSchema>;
	chatCreateCompletion: z.infer<typeof ChatCreateCompletionInputSchema>;
	embeddingsCreate: z.infer<typeof EmbeddingsCreateInputSchema>;
	imagesGenerate: z.infer<typeof ImagesGenerateInputSchema>;
};

export type ApipieEndpointOutputs = {
	modelsList: z.infer<typeof ModelsListResponseSchema>;
	modelsListDetailed: z.infer<typeof ModelsDetailedResponseSchema>;
	chatCreateCompletion: z.infer<typeof ChatCompletionResponseSchema>;
	embeddingsCreate: z.infer<typeof EmbeddingsResponseSchema>;
	imagesGenerate: z.infer<typeof ImagesResponseSchema>;
};

export const ApipieEndpointInputSchemas = {
	modelsList: ModelsListInputSchema,
	modelsListDetailed: ModelsListDetailedInputSchema,
	chatCreateCompletion: ChatCreateCompletionInputSchema,
	embeddingsCreate: EmbeddingsCreateInputSchema,
	imagesGenerate: ImagesGenerateInputSchema,
} as const;

export const ApipieEndpointOutputSchemas = {
	modelsList: ModelsListResponseSchema,
	modelsListDetailed: ModelsDetailedResponseSchema,
	chatCreateCompletion: ChatCompletionResponseSchema,
	embeddingsCreate: EmbeddingsResponseSchema,
	imagesGenerate: ImagesResponseSchema,
} as const;
