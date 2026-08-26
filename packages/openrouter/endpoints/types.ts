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

const ToolCallSchema = z.object({
	id: z.string(),
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		arguments: z.string(),
	}),
});

export const ChatMessageSchema = z.union([
	z.object({
		role: z.literal('system'),
		content: z.string(),
	}),
	z.object({
		role: z.literal('assistant'),
		content: z
			.union([z.string(), z.array(MessagePartSchema)])
			.nullable()
			.optional(),
		tool_calls: z.array(ToolCallSchema).optional(),
	}),
	z.object({
		role: z.literal('user'),
		content: z.union([z.string(), z.array(MessagePartSchema)]),
	}),
	z.object({
		role: z.literal('tool'),
		tool_call_id: z.string(),
		content: z.union([z.string(), z.array(MessagePartSchema)]),
	}),
]);

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

const ProviderPreferencesSchema = z.object({
	order: z.array(z.string()).optional(),
	allow_fallbacks: z.boolean().optional(),
	ignore: z.array(z.string()).optional(),
	require_parameters: z.boolean().optional(),
	data_collection: z.string().optional(),
	zdr: z.boolean().optional(),
});

export const CreateChatCompletionInputSchema = z.object({
	model: z.string(),
	messages: z.array(ChatMessageSchema).min(1),
	stream: z.literal(false).optional(),
	temperature: z.number().optional(),
	topP: z.number().optional(),
	maxTokens: z.number().int().min(1).optional(),
	maxCompletionTokens: z.number().int().min(1).optional(),
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
		.object({
			effort: z
				.enum(['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'])
				.optional(),
			summary: z.enum(['auto', 'concise', 'detailed']).nullable().optional(),
		})
		.optional(),
	transforms: z.array(z.string()).optional(),
	models: z.array(z.string()).optional(),
	route: z.string().optional(),
	provider: ProviderPreferencesSchema.optional(),
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
	prompt_tokens_details: z
		.object({
			cached_tokens: z.number().optional(),
			cache_write_tokens: z.number().optional(),
			audio_tokens: z.number().optional(),
			video_tokens: z.number().optional(),
		})
		.optional(),
	completion_tokens_details: z
		.object({
			reasoning_tokens: z.number().optional(),
			audio_tokens: z.number().optional(),
			image_tokens: z.number().optional(),
		})
		.optional(),
	cost: z.number().optional(),
	is_byok: z.boolean().optional(),
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
				reasoning: z.string().nullable().optional(),
				reasoning_details: z
					.array(z.record(z.string(), z.unknown()))
					.optional(),
			}),
			finish_reason: z.string().nullable(),
		}),
	),
	usage: CompletionUsageSchema.optional(),
	provider: z.string().optional(),
	models: z.array(z.string()).optional(),
	// Anthropic-style native tool calls vary by model and tool definitions;
	// kept generic to stay forward-compatible with new tool shapes.
	native_tool_calls: z.array(z.unknown()).optional(),
});

const AnthropicBase64SourceSchema = z.object({
	type: z.literal('base64'),
	media_type: z.string(),
	data: z.string(),
});

const AnthropicUrlSourceSchema = z.object({
	type: z.literal('url'),
	url: z.string().url(),
});

const AnthropicImageSourceSchema = z.union([
	AnthropicBase64SourceSchema,
	AnthropicUrlSourceSchema,
]);

const AnthropicDocumentContentPartSchema = z.union([
	z.object({ type: z.literal('text'), text: z.string() }),
	z.object({
		type: z.literal('image'),
		source: AnthropicImageSourceSchema,
	}),
]);

const AnthropicDocumentSourceSchema = z.union([
	AnthropicBase64SourceSchema,
	AnthropicUrlSourceSchema,
	z.object({
		type: z.literal('text'),
		media_type: z.literal('text/plain'),
		data: z.string(),
	}),
	z.object({
		type: z.literal('content'),
		content: z.union([z.string(), z.array(AnthropicDocumentContentPartSchema)]),
	}),
	z.object({
		type: z.literal('file'),
		file_id: z.string(),
	}),
]);

const AnthropicContentBlockSchema = z.union([
	z.object({ type: z.literal('text'), text: z.string() }),
	z.object({
		type: z.literal('image'),
		source: AnthropicImageSourceSchema,
	}),
	z.object({
		type: z.literal('document'),
		source: AnthropicDocumentSourceSchema,
		title: z.string().nullable().optional(),
		context: z.string().nullable().optional(),
		citations: z
			.object({ enabled: z.boolean().optional() })
			.nullable()
			.optional(),
	}),
	z.object({
		type: z.literal('tool_use'),
		id: z.string(),
		name: z.string(),
		input: z.record(z.string(), z.unknown()),
	}),
	z.object({
		type: z.literal('tool_result'),
		tool_use_id: z.string(),
		content: z.union([z.string(), z.array(z.unknown())]),
		is_error: z.boolean().optional(),
	}),
	z.object({
		type: z.literal('thinking'),
		thinking: z.string(),
		signature: z.string().optional(),
	}),
	z.object({
		type: z.literal('redacted_thinking'),
		data: z.string(),
	}),
]);

const AnthropicToolSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	input_schema: z.record(z.string(), z.unknown()),
});

export const CreateAnthropicMessageInputSchema = z.object({
	model: z.string(),
	maxTokens: z.number().int().min(1).optional(),
	messages: z
		.array(
			z.object({
				role: z.enum(['user', 'assistant']),
				content: z.union([z.string(), z.array(AnthropicContentBlockSchema)]),
			}),
		)
		.min(1),
	system: z.string().optional(),
	temperature: z.number().optional(),
	topP: z.number().optional(),
	stopSequences: z.array(z.string()).optional(),
	tools: z.array(AnthropicToolSchema).optional(),
	toolChoice: z
		.union([
			z.object({ type: z.literal('tool'), name: z.string() }),
			z.object({ type: z.enum(['auto', 'any', 'none']) }),
		])
		.optional(),
	thinking: z
		.union([
			z.object({
				type: z.literal('enabled'),
				budget_tokens: z.number().int().positive(),
			}),
			z.object({ type: z.literal('disabled') }),
		])
		.optional(),
});

export const CreateAnthropicMessageOutputSchema = z.object({
	id: z.string(),
	type: z.literal('message'),
	role: z.literal('assistant'),
	model: z.string(),
	stop_reason: z.string().nullable(),
	content: z.array(
		z.union([
			z.object({
				type: z.literal('text'),
				text: z.string(),
				// Citation objects differ per provider/source and are evolving;
				// kept generic rather than pinning a shape that will drift.
				citations: z.array(z.unknown()).nullable().optional(),
			}),
			z.object({
				type: z.literal('thinking'),
				thinking: z.string(),
				signature: z.string().optional(),
			}),
			z.object({
				type: z.literal('redacted_thinking'),
				data: z.string(),
			}),
			z.object({
				type: z.literal('tool_use'),
				id: z.string(),
				name: z.string(),
				input: z.record(z.string(), z.unknown()),
			}),
		]),
	),
	usage: z
		.object({
			input_tokens: z.number(),
			output_tokens: z.number(),
			cache_read_input_tokens: z.number().nullable().optional(),
			cache_creation_input_tokens: z.number().nullable().optional(),
			output_tokens_details: z
				.object({ thinking_tokens: z.number().optional() })
				.nullable()
				.optional(),
		})
		// Anthropic adds usage fields as models evolve; unknown keys are
		// tolerated so newer responses still validate.
		.catchall(z.unknown()),
	provider: z.string().optional(),
});

const ModelListPaginationSchema = z.object({
	offset: z.number().int().nonnegative().optional(),
	limit: z.number().int().min(1).max(1000).optional(),
});

export const ListModelsInputSchema = ModelListPaginationSchema;

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
	links: z.object({ next: z.string().nullable().optional() }).optional(),
	total_count: z.number().optional(),
});

export const ListModelsCountInputSchema = z.object({});

export const ListModelsCountOutputSchema = z.object({
	data: z.object({
		count: z.number(),
	}),
});

export const ListEmbeddingModelsInputSchema = z.object({
	offset: z.number().int().nonnegative().optional(),
	limit: z.number().int().min(1).max(1000).optional(),
});

export const ListEmbeddingModelsOutputSchema = z.object({
	data: z.array(ModelSchema),
	links: z.object({ next: z.string().nullable().optional() }).optional(),
	total_count: z.number().optional(),
});

export const ListUserModelsInputSchema = ModelListPaginationSchema;

export const ListUserModelsOutputSchema = z.object({
	data: z.array(ModelSchema),
	links: z.object({ next: z.string().nullable().optional() }).optional(),
	total_count: z.number().optional(),
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

export const CreateEmbeddingInputSchema = z.object({
	model: z.string(),
	input: z.union([
		z.string(),
		z.array(z.string()),
		z.array(z.number()),
		z.array(z.array(z.number())),
		z.array(z.record(z.string(), z.unknown())),
	]),
	encodingFormat: z.enum(['float', 'base64']).optional(),
	dimensions: z.number().optional(),
	user: z.string().optional(),
	inputType: z.string().optional(),
	provider: ProviderPreferencesSchema.optional(),
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
	usage: EmbeddingUsageSchema.optional(),
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
			provider_name: z.string().nullable().optional(),
			api_type: z.string().nullable().optional(),
			created_at: z.string().optional(),
			streamed: z.boolean().nullable().optional(),
			finish_reason: z.string().nullable().optional(),
			total_cost: z.number().nullable().optional(),
			prompt_tokens: z.number().optional(),
			completion_tokens: z.number().optional(),
			total_tokens: z.number().optional(),
			// Usage breakdown and the raw provider payload are provider-defined;
			// kept generic rather than pinning shapes that vary per provider.
			usage: z
				.union([z.number(), z.record(z.string(), z.unknown())])
				.optional(),
			tokens_prompt: z.number().nullable().optional(),
			tokens_completion: z.number().nullable().optional(),
			provider_responses: z.array(z.unknown()).nullable().optional(),
			provider_response: z.record(z.string(), z.unknown()).optional(),
		})
		// Generation records gain fields over time; unknown keys tolerated.
		.catchall(z.unknown()),
});

export const GetCreditsInputSchema = z.object({}).strict();

export const ListCreditsInputSchema = GetCreditsInputSchema;

export const ListCreditsOutputSchema = z.object({
	data: z
		.object({
			total_credits: z.number(),
			total_usage: z.number(),
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
			usage_daily: z.number().optional(),
			usage_weekly: z.number().optional(),
			usage_monthly: z.number().optional(),
			byok_usage: z.number().optional(),
			byok_usage_daily: z.number().optional(),
			byok_usage_weekly: z.number().optional(),
			byok_usage_monthly: z.number().optional(),
			limit: z.number().nullable().optional(),
			limit_reset: z.string().nullable().optional(),
			limit_remaining: z.number().nullable().optional(),
			include_byok_in_limit: z.boolean().optional(),
			creator_user_id: z.string().nullable().optional(),
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
	generationsGet: GetGenerationOutputSchema,
	creditsList: ListCreditsOutputSchema,
	keyGet: GetKeyOutputSchema,
} as const;
