import { z } from 'zod';

const ModelMessageSchema = z
	.object({
		role: z.string(),
		content: z.string(),
	})
	.loose();

const ModelListItemSchema = z
	.object({
		id: z.string(),
		type: z.string().nullable().optional(),
		subtype: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		provider: z.string().nullable().optional(),
		/** APIpie returns 0/1 flags for some models. */
		enabled: z.union([z.boolean(), z.number()]).nullable().optional(),
		description: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ModelsListResponseSchema = z.union([
	z.array(ModelListItemSchema).min(1),
	z
		.object({
			object: z.string().optional(),
			data: z.array(ModelListItemSchema),
		})
		.loose(),
]);

const DetailedModelListItemSchema = z
	.object({
		id: z.string().nullable().optional(),
		model: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		provider: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		/** APIpie returns 0/1 flags for some models. */
		enabled: z.union([z.boolean(), z.number()]).nullable().optional(),
		capabilities: z.unknown().optional(),
		limits: z.unknown().optional(),
		pricing: z.unknown().optional(),
		supported_input_parameters: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
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
		stream: z.boolean().optional(),
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
