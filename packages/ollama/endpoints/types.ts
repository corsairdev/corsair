import { z } from 'zod';

export const ChatInputSchema = z.object({
	model: z.string().describe('Name of the model to use for chat'),
	messages: z
		.array(
			z.object({
				role: z
					.string()
					.describe(
						'Role of the message author (system, user, assistant, tool)',
					),
				content: z.string().describe('Content of the message'),
				images: z
					.array(z.string())
					.optional()
					.describe('Base64-encoded images for multimodal models'),
				tool_calls: z
					.array(z.unknown())
					.optional()
					.describe('Tool calls made by the model'),
			}),
		)
		.describe('Conversation history'),
	tools: z
		.array(z.unknown())
		.optional()
		.describe('List of tools/functions available to the model'),
	format: z
		.union([z.string(), z.record(z.string(), z.unknown())])
		.optional()
		.describe('Output format, e.g. "json" or a JSON schema'),
	options: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Model configuration options (temperature, top_p, etc.)'),
	stream: z
		.boolean()
		.optional()
		.describe('Whether to stream responses (default false)'),
	keep_alive: z
		.union([z.string(), z.number()])
		.optional()
		.describe('Duration to keep the model loaded in memory'),
});

export const ChatResponseSchema = z
	.object({
		model: z.string(),
		created_at: z.string(),
		message: z.object({
			role: z.string(),
			content: z.string(),
			images: z.array(z.string()).optional(),
			tool_calls: z.array(z.unknown()).optional(),
		}),
		done: z.boolean(),
		total_duration: z.number().optional(),
		load_duration: z.number().optional(),
		prompt_eval_count: z.number().optional(),
		prompt_eval_duration: z.number().optional(),
		eval_count: z.number().optional(),
		eval_duration: z.number().optional(),
	})
	.passthrough();

export const GenerateInputSchema = z.object({
	model: z.string().describe('Name of the model to generate text with'),
	prompt: z
		.string()
		.optional()
		.describe('The prompt to generate a response for'),
	suffix: z.string().optional().describe('Text after the insertion point'),
	images: z
		.array(z.string())
		.optional()
		.describe('Base64-encoded images for multimodal models'),
	format: z
		.union([z.string(), z.record(z.string(), z.unknown())])
		.optional()
		.describe('Format of the response'),
	options: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Model configuration options'),
	system: z
		.string()
		.optional()
		.describe('System message to override model default'),
	template: z
		.string()
		.optional()
		.describe('Prompt template to override model default'),
	stream: z.boolean().optional().describe('Whether to stream response'),
	raw: z.boolean().optional().describe('Bypass prompt template when true'),
	keep_alive: z
		.union([z.string(), z.number()])
		.optional()
		.describe('Duration to keep the model loaded'),
});

export const GenerateResponseSchema = z
	.object({
		model: z.string(),
		created_at: z.string(),
		response: z.string(),
		done: z.boolean(),
		context: z.array(z.number()).optional(),
		total_duration: z.number().optional(),
		load_duration: z.number().optional(),
		prompt_eval_count: z.number().optional(),
		prompt_eval_duration: z.number().optional(),
		eval_count: z.number().optional(),
		eval_duration: z.number().optional(),
	})
	.passthrough();

export const VersionInputSchema = z.object({});

export const VersionResponseSchema = z
	.object({
		version: z.string(),
	})
	.passthrough();

export const ListModelsInputSchema = z.object({});

export const ModelDetailsSchema = z
	.object({
		parent_model: z.string().optional(),
		format: z.string().optional(),
		family: z.string().optional(),
		families: z.array(z.string()).optional(),
		parameter_size: z.string().optional(),
		quantization_level: z.string().optional(),
	})
	.passthrough();

export const ModelItemSchema = z
	.object({
		name: z.string(),
		model: z.string().optional(),
		modified_at: z.string().optional(),
		size: z.number().optional(),
		digest: z.string().optional(),
		details: ModelDetailsSchema.optional(),
	})
	.passthrough();

export const ListModelsResponseSchema = z
	.object({
		models: z.array(ModelItemSchema),
	})
	.passthrough();

export const ShowModelInputSchema = z.object({
	model: z.string().describe('Name of the model to show information for'),
	system: z.string().optional().describe('System prompt override'),
	template: z.string().optional().describe('Template override'),
	options: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Options override'),
});

export const ShowModelResponseSchema = z
	.object({
		modelfile: z.string().optional(),
		parameters: z.string().optional(),
		template: z.string().optional(),
		details: ModelDetailsSchema.optional(),
		model_info: z.record(z.string(), z.unknown()).optional(),
		modified_at: z.string().optional(),
		license: z.string().optional(),
	})
	.passthrough();

export const ListOpenAiModelsInputSchema = z.object({});

export const OpenAiModelItemSchema = z
	.object({
		id: z.string(),
		object: z.string(),
		created: z.number().optional(),
		owned_by: z.string().optional(),
	})
	.passthrough();

export const ListOpenAiModelsResponseSchema = z
	.object({
		object: z.string(),
		data: z.array(OpenAiModelItemSchema),
	})
	.passthrough();

export const CreateOpenAiChatCompletionInputSchema = z.object({
	model: z.string().describe('ID of the model to use'),
	messages: z
		.array(
			z.object({
				role: z.string().describe('Role of the author'),
				content: z.string().describe('Content of the message'),
			}),
		)
		.describe('Messages in the conversation'),
	temperature: z.number().optional().describe('Sampling temperature'),
	top_p: z.number().optional().describe('Nucleus sampling probability'),
	n: z.number().optional().describe('Number of completions to generate'),
	stream: z.boolean().optional().describe('Whether to stream responses'),
	stop: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.describe('Stop sequences'),
	max_tokens: z.number().optional().describe('Maximum tokens to generate'),
	presence_penalty: z.number().optional().describe('Presence penalty'),
	frequency_penalty: z.number().optional().describe('Frequency penalty'),
	user: z
		.string()
		.optional()
		.describe('Unique identifier representing end-user'),
});

export const CreateOpenAiChatCompletionResponseSchema = z
	.object({
		id: z.string(),
		object: z.string(),
		created: z.number(),
		model: z.string(),
		choices: z.array(
			z.object({
				index: z.number(),
				message: z.object({
					role: z.string(),
					content: z.string(),
				}),
				finish_reason: z.string().nullable().optional(),
			}),
		),
		usage: z
			.object({
				prompt_tokens: z.number(),
				completion_tokens: z.number(),
				total_tokens: z.number(),
			})
			.optional(),
	})
	.passthrough();

export const CreateOpenAiCompletionInputSchema = z.object({
	model: z.string().describe('ID of the model to use'),
	prompt: z
		.union([z.string(), z.array(z.string())])
		.describe('Prompt text to complete'),
	suffix: z.string().optional().describe('Suffix to insert'),
	max_tokens: z.number().optional().describe('Maximum tokens to generate'),
	temperature: z.number().optional().describe('Sampling temperature'),
	top_p: z.number().optional().describe('Nucleus sampling probability'),
	n: z.number().optional().describe('Number of completions to generate'),
	stream: z.boolean().optional().describe('Whether to stream responses'),
	logprobs: z
		.number()
		.nullable()
		.optional()
		.describe('Include log probabilities'),
	echo: z.boolean().optional().describe('Echo prompt in completion'),
	stop: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.describe('Stop sequences'),
	presence_penalty: z.number().optional().describe('Presence penalty'),
	frequency_penalty: z.number().optional().describe('Frequency penalty'),
	best_of: z
		.number()
		.optional()
		.describe('Generates best_of completions server-side'),
	user: z
		.string()
		.optional()
		.describe('Unique identifier representing end-user'),
});

export const CreateOpenAiCompletionResponseSchema = z
	.object({
		id: z.string(),
		object: z.string(),
		created: z.number(),
		model: z.string(),
		choices: z.array(
			z.object({
				index: z.number(),
				text: z.string(),
				logprobs: z.unknown().nullable().optional(),
				finish_reason: z.string().nullable().optional(),
			}),
		),
		usage: z
			.object({
				prompt_tokens: z.number(),
				completion_tokens: z.number(),
				total_tokens: z.number(),
			})
			.optional(),
	})
	.passthrough();

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

export type GenerateInput = z.infer<typeof GenerateInputSchema>;
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;

export type VersionInput = z.infer<typeof VersionInputSchema>;
export type VersionResponse = z.infer<typeof VersionResponseSchema>;

export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;
export type ListModelsResponse = z.infer<typeof ListModelsResponseSchema>;

export type ShowModelInput = z.infer<typeof ShowModelInputSchema>;
export type ShowModelResponse = z.infer<typeof ShowModelResponseSchema>;

export type ListOpenAiModelsInput = z.infer<typeof ListOpenAiModelsInputSchema>;
export type ListOpenAiModelsResponse = z.infer<
	typeof ListOpenAiModelsResponseSchema
>;

export type CreateOpenAiChatCompletionInput = z.infer<
	typeof CreateOpenAiChatCompletionInputSchema
>;
export type CreateOpenAiChatCompletionResponse = z.infer<
	typeof CreateOpenAiChatCompletionResponseSchema
>;

export type CreateOpenAiCompletionInput = z.infer<
	typeof CreateOpenAiCompletionInputSchema
>;
export type CreateOpenAiCompletionResponse = z.infer<
	typeof CreateOpenAiCompletionResponseSchema
>;

export type OllamaEndpointInputs = {
	chat: ChatInput;
	generate: GenerateInput;
	version: VersionInput;
	listModels: ListModelsInput;
	showModel: ShowModelInput;
	listOpenAiModels: ListOpenAiModelsInput;
	createOpenAiChatCompletion: CreateOpenAiChatCompletionInput;
	createOpenAiCompletion: CreateOpenAiCompletionInput;
};

export type OllamaEndpointOutputs = {
	chat: ChatResponse;
	generate: GenerateResponse;
	version: VersionResponse;
	listModels: ListModelsResponse;
	showModel: ShowModelResponse;
	listOpenAiModels: ListOpenAiModelsResponse;
	createOpenAiChatCompletion: CreateOpenAiChatCompletionResponse;
	createOpenAiCompletion: CreateOpenAiCompletionResponse;
};

export const OllamaEndpointInputSchemas = {
	chat: ChatInputSchema,
	generate: GenerateInputSchema,
	version: VersionInputSchema,
	listModels: ListModelsInputSchema,
	showModel: ShowModelInputSchema,
	listOpenAiModels: ListOpenAiModelsInputSchema,
	createOpenAiChatCompletion: CreateOpenAiChatCompletionInputSchema,
	createOpenAiCompletion: CreateOpenAiCompletionInputSchema,
} as const;

export const OllamaEndpointOutputSchemas = {
	chat: ChatResponseSchema,
	generate: GenerateResponseSchema,
	version: VersionResponseSchema,
	listModels: ListModelsResponseSchema,
	showModel: ShowModelResponseSchema,
	listOpenAiModels: ListOpenAiModelsResponseSchema,
	createOpenAiChatCompletion: CreateOpenAiChatCompletionResponseSchema,
	createOpenAiCompletion: CreateOpenAiCompletionResponseSchema,
} as const;
