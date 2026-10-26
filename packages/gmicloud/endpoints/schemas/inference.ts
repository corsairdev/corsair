import { z } from 'zod';

// Shapes follow the GMI Cloud inference references:
// https://docs.gmicloud.ai/inference-engine/api-reference/llm-api-reference
// https://docs.gmicloud.ai/inference-engine/api-reference/video-api-reference
// https://docs.gmicloud.ai/inference-engine/gmi-router/gmi-router-overview
// Responses are loose objects: the APIs are OpenAI-compatible and models add
// fields such as reasoning_content that callers should still receive.

// LLM models

export const ModelsListInputSchema = z.object({});

export const LlmModelSchema = z.looseObject({
	id: z.string(),
	object: z.string().optional(),
	name: z.string().nullish(),
	created: z.number().nullish(),
	owned_by: z.string().nullish(),
	context_length: z.number().nullish(),
	quantization: z.string().nullish(),
	// USD per token as decimal strings; some models add tiered overrides.
	pricing: z
		.looseObject({
			prompt: z.string().optional(),
			completion: z.string().optional(),
		})
		.nullish(),
});

export const ModelsListResponseSchema = z.looseObject({
	object: z.string().optional(),
	data: z.array(LlmModelSchema),
});

// Chat completions

const ContentPartSchema = z.looseObject({
	type: z
		.string()
		.describe('text, image_url, input_audio, or another part type'),
	text: z.string().optional(),
	image_url: z
		.object({ url: z.string(), detail: z.string().optional() })
		.optional(),
	input_audio: z.object({ data: z.string(), format: z.string() }).optional(),
});

const ToolCallSchema = z.looseObject({
	id: z.string(),
	type: z.literal('function'),
	function: z.object({ name: z.string(), arguments: z.string() }),
});

export const ChatMessageSchema = z.object({
	role: z.enum(['system', 'developer', 'user', 'assistant', 'tool']),
	content: z.union([z.string(), z.array(ContentPartSchema)]).nullable(),
	name: z.string().optional(),
	tool_calls: z.array(ToolCallSchema).optional(),
	tool_call_id: z.string().optional(),
});

const ToolSchema = z.object({
	type: z.literal('function'),
	function: z.object({
		name: z.string().min(1),
		description: z.string().optional(),
		// unknown: a JSON Schema object for the function's arguments.
		parameters: z.record(z.string(), z.unknown()).optional(),
		strict: z.boolean().optional(),
	}),
});

export const ChatCreateCompletionInputSchema = z.object({
	model: z
		.string()
		.min(1)
		.describe('Model ID from models.list, e.g. deepseek-ai/DeepSeek-R1'),
	messages: z.array(ChatMessageSchema).min(1),
	tools: z.array(ToolSchema).optional(),
	tool_choice: z
		.union([
			z.enum(['none', 'auto', 'required']),
			z.object({
				type: z.literal('function'),
				function: z.object({ name: z.string() }),
			}),
		])
		.optional(),
	max_tokens: z.number().int().min(1).optional(),
	temperature: z.number().min(0).max(2).optional(),
	top_p: z.number().min(0).max(1).optional(),
	top_k: z.number().int().min(1).max(128).optional(),
	frequency_penalty: z.number().min(-2).max(2).optional(),
	presence_penalty: z.number().min(-2).max(2).optional(),
	repetition_penalty: z.number().min(0).optional(),
	seed: z.number().int().optional(),
	ignore_eos: z.boolean().optional(),
	stop: z.union([z.string(), z.array(z.string()).max(4)]).optional(),
	response_format: z
		.object({
			type: z.enum(['text', 'json_object', 'json_schema']),
			// unknown: { name, schema, strict } where schema is any JSON Schema.
			json_schema: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
	context_length_exceeded_behavior: z.enum(['truncate', 'error']).optional(),
});

const UsageSchema = z.looseObject({
	prompt_tokens: z.number(),
	completion_tokens: z.number(),
	total_tokens: z.number(),
});

export const ChatCreateCompletionResponseSchema = z.looseObject({
	id: z.string(),
	object: z.string(),
	created: z.number(),
	model: z.string(),
	choices: z.array(
		z.looseObject({
			index: z.number().optional(),
			message: z.looseObject({
				role: z.string(),
				content: z.string().nullable(),
				reasoning_content: z.string().nullish(),
				tool_calls: z.array(ToolCallSchema).nullish(),
			}),
			finish_reason: z.string().nullish(),
		}),
	),
	usage: UsageSchema.nullish(),
});

// GMI Router

export const RouterAutorouteInputSchema = z.object({
	messages: z.array(ChatMessageSchema).min(1),
	mode: z
		.enum(['cost', 'balanced', 'quality'])
		.optional()
		.describe('What the router optimizes for; balanced by default'),
});

export const RouterAutorouteResponseSchema = z.looseObject({
	model: z.string(),
	message: z.looseObject({
		role: z.string(),
		content: z.string().nullable(),
	}),
	routing_metadata: z
		.looseObject({
			selected_model: z.string(),
			task_type: z.string().nullish(),
			selected_mode: z.string().nullish(),
			fallback_models: z.array(z.string()).nullish(),
			recommendation_id: z.string().nullish(),
		})
		.nullish(),
});

// Media request queue (video, image, and audio models)

export const MediaModelsListInputSchema = z.object({});

export const MediaModelsListResponseSchema = z.looseObject({
	model_ids: z.array(z.string()),
});

export const MediaModelsGetInputSchema = z.object({
	model_id: z
		.string()
		.min(1)
		.describe('Model ID from mediaModels.list, e.g. Veo3'),
});

export const MediaModelParameterSchema = z.looseObject({
	name: z.string(),
	display_name: z.string().nullish(),
	description: z.string().nullish(),
	type: z.string().nullish(),
	required: z.boolean().nullish(),
	// unknown: a default of whatever type the parameter declares.
	default: z.unknown().optional(),
});

export const MediaModelsGetResponseSchema = z.looseObject({
	model: z.string(),
	org_id: z.string().nullish(),
	brief_description: z.string().nullish(),
	detailed_description: z.string().nullish(),
	// unknown: modality descriptors differ by model and are not documented.
	modalities: z.record(z.string(), z.unknown()).nullish(),
	parameters: z.array(MediaModelParameterSchema).nullish(),
});

export const MediaRequestsCreateInputSchema = z.object({
	model: z.string().min(1).describe('Model ID from mediaModels.list'),
	// unknown: each model defines its own payload; mediaModels.get lists the parameters.
	payload: z
		.record(z.string(), z.unknown())
		.describe(
			'Model parameters, e.g. { prompt, durationSeconds, aspectRatio }',
		),
});

const MediaRequestBase = {
	request_id: z.string(),
	model: z.string(),
	status: z
		.string()
		.describe(
			'dispatched, processing, success, failed, or another queue state',
		),
	created_at: z.number().nullish(),
	updated_at: z.number().nullish(),
	queued_at: z.number().nullish(),
};

export const MediaRequestsCreateResponseSchema =
	z.looseObject(MediaRequestBase);

export const MediaRequestsGetInputSchema = z.object({
	request_id: z.string().min(1),
});

export const MediaRequestsGetResponseSchema = z.looseObject({
	...MediaRequestBase,
	org_id: z.string().nullish(),
	is_public: z.boolean().nullish(),
	// unknown: the payload echoes the model-specific request parameters.
	payload: z.record(z.string(), z.unknown()).nullish(),
	// unknown: outcome keys depend on the model, e.g. video_url and thumbnail_image_url.
	outcome: z.record(z.string(), z.unknown()).nullish(),
});

export const UploadsCreateUrlInputSchema = z.object({
	file_type: z.enum(['jpeg', 'jpg', 'png', 'mp4', 'mp3', 'wav']),
});

export const UploadsCreateUrlResponseSchema = z.looseObject({
	upload_url: z
		.string()
		.describe(
			'Pre-signed URL to PUT the raw bytes to; valid for about 15 minutes',
		),
	public_url: z
		.string()
		.describe('Stable public URL to pass in media requests'),
});
