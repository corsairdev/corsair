import { z } from 'zod';

const MessagePartSchema = z.union([
	z.object({ type: z.literal('text'), text: z.string() }),
	z.object({
		type: z.literal('image_url'),
		image_url: z.object({ url: z.string(), detail: z.string().optional() }),
	}),
	z.object({
		type: z.literal('input_audio'),
		input_audio: z.object({
			data: z.string(),
			format: z.string(),
		}),
	}),
]);

export const ChatMessageSchema = z.union([
	z.object({
		role: z.literal('system'),
		content: z.string(),
	}),
	z.object({
		role: z.literal('assistant'),
		content: z.union([z.string(), z.array(MessagePartSchema)]).optional(),
	}),
	z.object({
		role: z.literal('user'),
		content: z.union([z.string(), z.array(MessagePartSchema)]),
	}),
	z.object({
		role: z.literal('tool'),
		tool_call_id: z.string(),
		content: z.string(),
	}),
]);

const ToolCallSchema = z.object({
	id: z.string(),
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		arguments: z.string(),
	}),
});

const ToolSchema = z.object({
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		description: z.string().optional(),
		// Parameters are a provider-defined JSON Schema; treating them as a
		// generic record is safe (passed through verbatim) and a better type
		// is not practical since each tool declares its own schema.
		parameters: z.record(z.string(), z.unknown()).optional(),
	}),
});

const ResponseFormatSchema = z.object({
	type: z.enum(['text', 'json_object', 'json_schema']),
	json_schema: z
		.object({
			name: z.string(),
			strict: z.boolean().optional(),
			// Arbitrary JSON Schema per the user's structured-output request;
			// passed through verbatim, so no tighter type is practical.
			schema: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
});

export const CreateChatCompletionInputSchema = z.object({
	model: z.string(),
	messages: z.array(ChatMessageSchema).min(1),
	stream: z.boolean().optional(),
	temperature: z.number().optional(),
	topP: z.number().optional(),
	maxTokens: z.number().optional(),
	maxCompletionTokens: z.number().optional(),
	n: z.number().optional(),
	stop: z.union([z.string(), z.array(z.string())]).optional(),
	presencePenalty: z.number().optional(),
	frequencyPenalty: z.number().optional(),
	logitBias: z.record(z.string(), z.number()).optional(),
	user: z.string().optional(),
	responseFormat: ResponseFormatSchema.optional(),
	tools: z.array(ToolSchema).optional(),
	toolChoice: z
		.union([
			z.string(),
			z.object({
				type: z.literal('function'),
				function: z.object({ name: z.string() }),
			}),
		])
		.optional(),
	reasoning: z
		.object({ effort: z.enum(['low', 'medium', 'high']).optional() })
		.optional(),
	transforms: z.array(z.string()).optional(),
	models: z.array(z.string()).optional(),
	route: z.string().optional(),
	provider: z
		.object({
			order: z.array(z.string()).optional(),
			allow_fallbacks: z.boolean().optional(),
			ignore: z.array(z.string()).optional(),
			require_parameters: z.boolean().optional(),
			data_collection: z.string().optional(),
		})
		.optional(),
	plugins: z
		.array(
			z.object({
				name: z.string(),
				max_tokens: z.number().optional(),
				num_images_per_prompt: z.number().optional(),
				image_format: z.string().optional(),
				num_prompts: z.number().optional(),
			}),
		)
		.optional(),
});

export const CompletionUsageSchema = z.object({
	prompt_tokens: z.number(),
	completion_tokens: z.number(),
	total_tokens: z.number(),
});

export const CreateChatCompletionOutputSchema = z.object({
	id: z.string(),
	object: z.literal('chat.completion'),
	created: z.number(),
	model: z.string(),
	choices: z.array(
		z.object({
			index: z.number(),
			message: z.object({
				role: z.literal('assistant'),
				content: z.string().nullable(),
				tool_calls: z.array(ToolCallSchema).optional(),
			}),
			finish_reason: z.string().nullable(),
		}),
	),
	usage: CompletionUsageSchema,
	provider: z.string().optional(),
	models: z.array(z.string()).optional(),
	// Anthropic-style native tool calls vary by model and tool definitions;
	// kept generic to stay forward-compatible with new tool shapes.
	native_tool_calls: z.array(z.unknown()).optional(),
});

export const CreateAnthropicMessageInputSchema = z.object({
	model: z.string(),
	maxTokens: z.number(),
	messages: z
		.array(
			z.object({
				role: z.enum(['user', 'assistant']),
				content: z.union([z.string(), z.array(MessagePartSchema)]),
			}),
		)
		.min(1),
	system: z.string().optional(),
	temperature: z.number().optional(),
	topP: z.number().optional(),
	stopSequences: z.array(z.string()).optional(),
});

export const CreateAnthropicMessageOutputSchema = z.object({
	id: z.string(),
	type: z.literal('message'),
	role: z.literal('assistant'),
	model: z.string(),
	stop_reason: z.string().nullable(),
	content: z.array(
		z.object({
			type: z.literal('text'),
			text: z.string(),
			// Citation objects differ per provider/source and are evolving;
			// kept generic rather than pinning a shape that will drift.
			citations: z.array(z.unknown()).optional(),
		}),
	),
	usage: z
		.object({
			input_tokens: z.number(),
			output_tokens: z.number(),
			cache_read_input_tokens: z.number().nullable().optional(),
			cache_creation_input_tokens: z.number().nullable().optional(),
			output_tokens_details: z
				.object({ thinking_tokens: z.number().optional() })
				.optional(),
		})
		// Anthropic adds usage fields as models evolve; unknown keys are
		// tolerated so newer responses still validate.
		.catchall(z.unknown()),
	provider: z.string().optional(),
});

export const ListModelsInputSchema = z.object({});

export const ModelSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	created: z.number().optional(),
	description: z.string().optional(),
	context_length: z.number().optional(),
	// Pricing keys vary per model (prompt/completion/input_cache_read/
	// discount/overrides...) and values are per-1k-token strings, numeric
	// multipliers, or nested override arrays/records; the union covers the
	// observed forms.
	pricing: z
		.record(
			z.string(),
			z.union([
				z.string(),
				z.number(),
				z.array(z.unknown()),
				z.record(z.string(), z.unknown()),
			]),
		)
		.optional(),
	architecture: z
		.object({
			modality: z.string().optional(),
			input_modalities: z.array(z.string()).optional(),
			output_modalities: z.array(z.string()).optional(),
			tokenizer: z.string().optional(),
			instruct_type: z.string().nullable().optional(),
		})
		.optional(),
	top_provider: z
		.object({
			context_length: z.number().nullable().optional(),
			max_completion_tokens: z.number().nullable().optional(),
			is_moderated: z.boolean().optional(),
		})
		.optional(),
	per_request_limits: z
		.object({
			prompt_tokens: z.string().nullable().optional(),
			completion_tokens: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
	supported_parameters: z.array(z.string()).optional(),
});

export const ListModelsOutputSchema = z.object({
	data: z.array(ModelSchema),
});

export const ListModelsCountInputSchema = z.object({});

export const ListModelsCountOutputSchema = z.object({
	data: z.object({
		count: z.number(),
	}),
});

export const ListEmbeddingModelsInputSchema = z.object({
	offset: z.number().optional(),
	limit: z.number().optional(),
});

export const ListEmbeddingModelsOutputSchema = z.object({
	data: z.array(ModelSchema),
});

export const ListUserModelsInputSchema = z.object({});

export const ListUserModelsOutputSchema = z.object({
	data: z.array(ModelSchema),
});

export const ListModelEndpointsInputSchema = z.object({
	author: z.string(),
	slug: z.string(),
});

const p95LatencySchema = z.object({
	p50: z.number().optional(),
	p75: z.number().optional(),
	p90: z.number().optional(),
	p99: z.number().optional(),
});

export const ModelEndpointSchema = z
	.object({
		name: z.string(),
		model_id: z.string().optional(),
		model_name: z.string().optional(),
		provider_name: z.string(),
		tag: z.string().optional(),
		context_length: z.number().optional(),
		max_completion_tokens: z.number().nullable().optional(),
		max_prompt_tokens: z.number().nullable().optional(),
		quantization: z.string().nullable().optional(),
		// Same pricing record shape as ModelSchema (string/number/array/record)
		pricing: z
			.record(
				z.string(),
				z.union([
					z.string(),
					z.number(),
					z.array(z.unknown()),
					z.record(z.string(), z.unknown()),
				]),
			)
			.optional(),
		supported_parameters: z.array(z.string()).optional(),
		status: z.number().optional(),
		uptime_last_30m: z.number().nullable().optional(),
		uptime_last_5m: z.number().nullable().optional(),
		uptime_last_1d: z.number().nullable().optional(),
		supports_implicit_caching: z.boolean().optional(),
		supports_voice_cloning: z.boolean().optional(),
		latency_last_30m: p95LatencySchema.nullable().optional(),
		throughput_last_30m: p95LatencySchema.nullable().optional(),
	})
	// Providers can add endpoint-level fields (e.g. new uptime metrics);
	// unknown keys are tolerated so newer responses still validate.
	.catchall(z.unknown());

export const ListModelEndpointsOutputSchema = z.object({
	data: z.object({
		id: z.string(),
		name: z.string(),
		created: z.number().optional(),
		description: z.string().optional(),
		// The model's architecture blob differs across model families;
		// kept generic for forward compatibility.
		architecture: z.record(z.string(), z.unknown()).optional(),
		endpoints: z.array(ModelEndpointSchema),
	}),
});

export const ListZdrEndpointsInputSchema = z.object({});

export const ListZdrEndpointsOutputSchema = z.object({
	data: z.array(ModelEndpointSchema),
});

export const CreateCoinbaseChargeInputSchema = z.object({
	amount: z.number(),
	sender: z.string(),
	chainId: z.union([z.literal(1), z.literal(137), z.literal(8453)]),
});

export const CreateCoinbaseChargeOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			chain_id: z.number().optional(),
			sender: z.string().optional(),
			addresses: z.record(z.string(), z.string()).optional(),
			calldata: z.record(z.string(), z.string()).optional(),
			created_at: z.string().optional(),
			expires_at: z.string().optional(),
		})
		// The Coinbase charge payload evolves (web3_data etc.); unknown keys
		// are tolerated so newer responses still validate.
		.catchall(z.unknown()),
});

export const CreateEmbeddingInputSchema = z.object({
	model: z.string(),
	input: z.union([z.string(), z.array(z.string())]),
	encodingFormat: z.enum(['float', 'base64']).optional(),
	dimensions: z.number().optional(),
	user: z.string().optional(),
});

const EmbeddingUsageSchema = z
	.object({
		prompt_tokens: z.number(),
		total_tokens: z.number(),
	})
	// OpenRouter may append usage fields for new embedding models.
	.catchall(z.unknown());

export const CreateEmbeddingOutputSchema = z.object({
	id: z.string().optional(),
	object: z.literal('list'),
	data: z.array(
		z.object({
			index: z.number().optional(),
			object: z.literal('embedding'),
			embedding: z.union([z.array(z.number()), z.string()]),
		}),
	),
	model: z.string(),
	usage: EmbeddingUsageSchema,
});

export const ListProvidersInputSchema = z.object({});

export const ListProvidersOutputSchema = z.object({
	data: z.array(
		z.object({
			name: z.string(),
			slug: z.string(),
			privacy_policy_url: z.string().nullable().optional(),
			terms_of_service_url: z.string().nullable().optional(),
			status_page_url: z.string().nullable().optional(),
			headquarters: z.string().nullable().optional(),
			datacenters: z.array(z.string()).nullable().optional(),
		}),
	),
});

export const GetGenerationInputSchema = z.object({
	id: z.string(),
});

export const GetGenerationOutputSchema = z.object({
	data: z
		.object({
			id: z.string(),
			model: z.string().optional(),
			provider: z.string().optional(),
			api_type: z.string().nullable().optional(),
			created_at: z.string().optional(),
			streamed: z.boolean().optional(),
			finish_reason: z.string().nullable().optional(),
			total_cost: z.number().nullable().optional(),
			prompt_tokens: z.number().optional(),
			completion_tokens: z.number().optional(),
			total_tokens: z.number().optional(),
			// Usage breakdown and the raw provider payload are provider-defined;
			// kept generic rather than pinning shapes that vary per provider.
			usage: z.record(z.string(), z.unknown()).optional(),
			provider_response: z.record(z.string(), z.unknown()).optional(),
		})
		// Generation records gain fields over time; unknown keys tolerated.
		.catchall(z.unknown()),
});

export const GetCreditsInputSchema = z.object({
	query: z.string().optional(),
	cursor: z.string().optional(),
	perPage: z.number().optional(),
	maxAge: z.number().optional(),
});

export const ListCreditsInputSchema = GetCreditsInputSchema;

export const ListCreditsOutputSchema = z.object({
	data: z
		.object({
			total_credits: z.number(),
			total_usage: z.number().optional(),
			limit_reached: z.boolean().optional(),
			prepaid: z.number().optional(),
			billed_prepaid: z.number().optional(),
			soft_limit: z.number().optional(),
			pending_balance: z.number().optional(),
		})
		// Credits payload gains ZDR fields as OpenRouter expands it.
		.catchall(z.unknown()),
});

export const GetKeyInputSchema = z.object({});

export const GetKeyOutputSchema = z.object({
	data: z
		.object({
			label: z.string().optional(),
			usage: z.number(),
			limit: z.number().nullable().optional(),
			limit_remaining: z.number().nullable().optional(),
			is_free_tier: z.boolean().optional(),
			is_management_key: z.boolean().optional(),
			is_provisioning_key: z.boolean().optional(),
			rate_limit: z
				.object({
					requests: z.number(),
					interval: z.string(),
				})
				.optional(),
			expires_at: z.string().nullable().optional(),
			created_at: z.string().optional(),
		})
		// Key metadata gains fields as OpenRouter expands it; unknown keys
		// are tolerated so newer responses still validate.
		.catchall(z.unknown()),
});

export type CreateChatCompletionInput = z.infer<
	typeof CreateChatCompletionInputSchema
>;
export type CreateChatCompletionResponse = z.infer<
	typeof CreateChatCompletionOutputSchema
>;
export type CreateAnthropicMessageInput = z.infer<
	typeof CreateAnthropicMessageInputSchema
>;
export type CreateAnthropicMessageResponse = z.infer<
	typeof CreateAnthropicMessageOutputSchema
>;
export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;
export type ListModelsResponse = z.infer<typeof ListModelsOutputSchema>;
export type ListModelsCountInput = z.infer<typeof ListModelsCountInputSchema>;
export type ListModelsCountResponse = z.infer<
	typeof ListModelsCountOutputSchema
>;
export type ListEmbeddingModelsInput = z.infer<
	typeof ListEmbeddingModelsInputSchema
>;
export type ListEmbeddingModelsResponse = z.infer<
	typeof ListEmbeddingModelsOutputSchema
>;
export type ListUserModelsInput = z.infer<typeof ListUserModelsInputSchema>;
export type ListUserModelsResponse = z.infer<typeof ListUserModelsOutputSchema>;
export type CreateEmbeddingInput = z.infer<typeof CreateEmbeddingInputSchema>;
export type CreateEmbeddingOutput = z.infer<typeof CreateEmbeddingOutputSchema>;
export type ListModelEndpointsInput = z.infer<
	typeof ListModelEndpointsInputSchema
>;
export type ListModelEndpointsResponse = z.infer<
	typeof ListModelEndpointsOutputSchema
>;
export type ListProvidersInput = z.infer<typeof ListProvidersInputSchema>;
export type ListProvidersResponse = z.infer<typeof ListProvidersOutputSchema>;
export type ListZdrEndpointsInput = z.infer<typeof ListZdrEndpointsInputSchema>;
export type ListZdrEndpointsResponse = z.infer<
	typeof ListZdrEndpointsOutputSchema
>;
export type CreateCoinbaseChargeInput = z.infer<
	typeof CreateCoinbaseChargeInputSchema
>;
export type CreateCoinbaseChargeResponse = z.infer<
	typeof CreateCoinbaseChargeOutputSchema
>;
export type GetGenerationInput = z.infer<typeof GetGenerationInputSchema>;
export type GetGenerationResponse = z.infer<typeof GetGenerationOutputSchema>;
export type ListCreditsInput = z.infer<typeof ListCreditsInputSchema>;
export type ListCreditsResponse = z.infer<typeof ListCreditsOutputSchema>;
export type GetKeyInput = z.infer<typeof GetKeyInputSchema>;
export type GetKeyResponse = z.infer<typeof GetKeyOutputSchema>;

export type OpenRouterEndpointInputs = {
	chatCompletionsCreate: CreateChatCompletionInput;
	messagesCreate: CreateAnthropicMessageInput;
	modelsList: ListModelsInput;
	modelsCount: ListModelsCountInput;
	modelsEmbeddingsList: ListEmbeddingModelsInput;
	modelsUserList: ListUserModelsInput;
	embeddingsCreate: CreateEmbeddingInput;
	modelsEndpointsList: ListModelEndpointsInput;
	providersList: ListProvidersInput;
	zdrEndpointsList: ListZdrEndpointsInput;
	creditsCoinbaseCreate: CreateCoinbaseChargeInput;
	generationsGet: GetGenerationInput;
	creditsList: ListCreditsInput;
	keyGet: GetKeyInput;
};

export type OpenRouterEndpointOutputs = {
	chatCompletionsCreate: CreateChatCompletionResponse;
	messagesCreate: CreateAnthropicMessageResponse;
	modelsList: ListModelsResponse;
	modelsCount: ListModelsCountResponse;
	modelsEmbeddingsList: ListEmbeddingModelsResponse;
	modelsUserList: ListUserModelsResponse;
	embeddingsCreate: CreateEmbeddingOutput;
	modelsEndpointsList: ListModelEndpointsResponse;
	providersList: ListProvidersResponse;
	zdrEndpointsList: ListZdrEndpointsResponse;
	creditsCoinbaseCreate: CreateCoinbaseChargeResponse;
	generationsGet: GetGenerationResponse;
	creditsList: ListCreditsResponse;
	keyGet: GetKeyResponse;
};

export const OpenRouterEndpointInputSchemas = {
	chatCompletionsCreate: CreateChatCompletionInputSchema,
	messagesCreate: CreateAnthropicMessageInputSchema,
	modelsList: ListModelsInputSchema,
	modelsCount: ListModelsCountInputSchema,
	modelsEmbeddingsList: ListEmbeddingModelsInputSchema,
	modelsUserList: ListUserModelsInputSchema,
	embeddingsCreate: CreateEmbeddingInputSchema,
	modelsEndpointsList: ListModelEndpointsInputSchema,
	providersList: ListProvidersInputSchema,
	zdrEndpointsList: ListZdrEndpointsInputSchema,
	creditsCoinbaseCreate: CreateCoinbaseChargeInputSchema,
	generationsGet: GetGenerationInputSchema,
	creditsList: ListCreditsInputSchema,
	keyGet: GetKeyInputSchema,
} as const;

export const OpenRouterEndpointOutputSchemas = {
	chatCompletionsCreate: CreateChatCompletionOutputSchema,
	messagesCreate: CreateAnthropicMessageOutputSchema,
	modelsList: ListModelsOutputSchema,
	modelsCount: ListModelsCountOutputSchema,
	modelsEmbeddingsList: ListEmbeddingModelsOutputSchema,
	modelsUserList: ListUserModelsOutputSchema,
	embeddingsCreate: CreateEmbeddingOutputSchema,
	modelsEndpointsList: ListModelEndpointsOutputSchema,
	providersList: ListProvidersOutputSchema,
	zdrEndpointsList: ListZdrEndpointsOutputSchema,
	creditsCoinbaseCreate: CreateCoinbaseChargeOutputSchema,
	generationsGet: GetGenerationOutputSchema,
	creditsList: ListCreditsOutputSchema,
	keyGet: GetKeyOutputSchema,
} as const;
