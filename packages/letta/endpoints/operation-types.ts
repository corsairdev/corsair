// Generated from Letta's OpenAPI spec (https://docs.letta.com/api,
// fetched 2026-11-27); letta-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput } from 'corsair/http';

export type LettaJsonValue =
	| null
	| boolean
	| number
	| string
	| LettaJsonValue[]
	| { [key: string]: LettaJsonValue | undefined };

export const LETTA_OPERATION_IDS = [
	'accessTokens.create',
	'accessTokens.delete',
	'accessTokens.list',
	'agents.archives.attach',
	'agents.archives.detach',
	'agents.blocks.attach',
	'agents.blocks.detach',
	'agents.blocks.get',
	'agents.blocks.list',
	'agents.blocks.update',
	'agents.create',
	'agents.delete',
	'agents.exportFile',
	'agents.files.close',
	'agents.files.closeAll',
	'agents.files.list',
	'agents.files.open',
	'agents.folders.attach',
	'agents.folders.detach',
	'agents.folders.list',
	'agents.get',
	'agents.identities.attach',
	'agents.identities.detach',
	'agents.importFile',
	'agents.list',
	'agents.messages.cancel',
	'agents.messages.compact',
	'agents.messages.create',
	'agents.messages.createAsync',
	'agents.messages.list',
	'agents.messages.reset',
	'agents.messages.stream',
	'agents.passages.create',
	'agents.passages.delete',
	'agents.passages.list',
	'agents.passages.search',
	'agents.recompile',
	'agents.schedule.create',
	'agents.schedule.delete',
	'agents.schedule.get',
	'agents.schedule.list',
	'agents.tools.attach',
	'agents.tools.detach',
	'agents.tools.list',
	'agents.tools.run',
	'agents.tools.updateApproval',
	'agents.update',
	'archives.create',
	'archives.delete',
	'archives.get',
	'archives.list',
	'archives.passages.create',
	'archives.passages.createMany',
	'archives.passages.delete',
	'archives.update',
	'blocks.agents.list',
	'blocks.create',
	'blocks.delete',
	'blocks.get',
	'blocks.list',
	'blocks.update',
	'client.health',
	'conversations.cancel',
	'conversations.create',
	'conversations.delete',
	'conversations.fork',
	'conversations.get',
	'conversations.list',
	'conversations.messages.compact',
	'conversations.messages.create',
	'conversations.messages.list',
	'conversations.messages.stream',
	'conversations.recompile',
	'conversations.update',
	'environments.get',
	'environments.list',
	'environments.sendMessage',
	'folders.agents.list',
	'folders.create',
	'folders.delete',
	'folders.files.delete',
	'folders.files.get',
	'folders.files.list',
	'folders.files.upload',
	'folders.get',
	'folders.list',
	'folders.update',
	'mcpServers.create',
	'mcpServers.delete',
	'mcpServers.get',
	'mcpServers.list',
	'mcpServers.refresh',
	'mcpServers.tools.get',
	'mcpServers.tools.list',
	'mcpServers.tools.run',
	'mcpServers.update',
	'messages.get',
	'messages.list',
	'messages.search',
	'models.embeddings.list',
	'models.list',
	'passages.search',
	'runs.get',
	'runs.list',
	'runs.messages.list',
	'runs.messages.stream',
	'runs.steps.list',
	'runs.trace.get',
	'runs.usage.get',
	'steps.feedback.create',
	'steps.get',
	'steps.list',
	'steps.messages.list',
	'steps.metrics.get',
	'steps.trace.get',
	'tags.list',
	'templates.agents.create',
	'templates.create',
	'templates.delete',
	'templates.rollback',
	'templates.save',
	'templates.update',
	'tools.create',
	'tools.delete',
	'tools.get',
	'tools.list',
	'tools.search',
	'tools.update',
	'tools.upsert',
] as const;

export type LettaOperationId = (typeof LETTA_OPERATION_IDS)[number];

/** Enum to represent the type of agent. */
export type LettaAgentTypeInput =
	| 'memgpt_agent'
	| 'memgpt_v2_agent'
	| 'letta_v1_agent'
	| 'react_agent'
	| 'workflow_agent'
	| 'split_thread_agent'
	| 'sleeptime_agent'
	| 'voice_convo_agent'
	| 'voice_sleeptime_agent';

export type LettaAnthropicModelSettingsInput = {
	/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
	effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'anthropic';
	/** The response format for the model. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
	strict?: boolean;
	/** The temperature of the model. */
	temperature?: number;
	/** The thinking configuration for the model. */
	thinking?: {
		/** The maximum number of tokens the model can use for extended thinking. */
		budget_tokens?: number;
		/** The type of thinking to use. */
		type?: 'enabled' | 'disabled';
	};
	/** Soft control for how verbose model output should be, used for GPT-5 models. */
	verbosity?: 'low' | 'medium' | 'high';
};

/** Input to approve or deny a tool call request */
export type LettaApprovalCreateInput = {
	/** The message ID of the approval request */
	approval_request_id?: string;
	/** The list of approval responses */
	approvals?: Array<LettaApprovalReturnInput | LettaToolReturnInput>;
	/** Whether the tool has been approved */
	approve?: boolean;
	/** The multi-agent group that the message was sent in */
	group_id?: string;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string;
	/** An optional explanation for the provided approval status */
	reason?: string;
	/** The message type to be created. */
	type?: 'approval';
};

export type LettaApprovalReturnInput = {
	/** Whether the tool has been approved */
	approve: boolean;
	/** The ID of the tool call that corresponds to this approval */
	tool_call_id: string;
	/** An optional explanation for the provided approval status */
	reason?: string;
	/** The message type to be created. */
	type?: 'approval';
};

/** Azure OpenAI model configuration (OpenAI-compatible). */
export type LettaAzureModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'azure';
	/** The response format for the model. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** The temperature of the model. */
	temperature?: number;
};

/** AWS Bedrock model configuration. */
export type LettaBedrockModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'bedrock';
	/** The response format for the model. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** The temperature of the model. */
	temperature?: number;
};

/** A ToolRule represents a tool that can be invoked by the agent. */
export type LettaChildToolRuleInput = {
	/** The children tools that can be invoked. */
	children: Array<string>;
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** Optional list of typed child argument overrides. Each node must reference a child in 'children'. */
	child_arg_nodes?: Array<{
		/** The name of the child tool to invoke next. */
		name: string;
		/** Optional prefilled arguments for this child tool. Keys must match the tool's parameter names and values must satisfy the tool's JSON schema. Supports partial prefill; non-overlapping parameters are left to the model. */
		args?: Record<string, LettaJsonValue>;
	}>;
	/** Optional template string (ignored). */
	prompt_template?: string;
	type?: 'constrain_child_tools';
};

/** A ToolRule that conditionally maps to different child tools based on the output. */
export type LettaConditionalToolRuleInput = {
	/** The output case to check for mapping */
	child_output_mapping: Record<string, string>;
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** The default child tool to be called. If None, any tool can be called. */
	default_child?: string;
	/** Optional template string (ignored). */
	prompt_template?: string;
	/** Whether to throw an error when output doesn't match any case */
	require_output_mapping?: boolean;
	type?: 'conditional';
};

/** Represents a tool rule configuration where if this tool gets called, it must continue the agent loop. */
export type LettaContinueToolRuleInput = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** Optional template string (ignored). */
	prompt_template?: string;
	type?: 'continue_loop';
};

/** Create a block */
export type LettaCreateBlockInput = {
	/** Label of the block. */
	label: string;
	/** Value of the block. */
	value: string;
	/** The base template id of the block. */
	base_template_id?: string;
	/** The id of the deployment. */
	deployment_id?: string;
	/** Description of the block. */
	description?: string;
	/** The id of the entity within the template. */
	entity_id?: string;
	/** If set to True, the block will be hidden. */
	hidden?: boolean;
	is_template?: boolean;
	/** Character limit of the block. */
	limit?: number;
	/** Metadata of the block. */
	metadata?: Record<string, LettaJsonValue>;
	/** Preserve the block on template migration. */
	preserve_on_migration?: boolean;
	/** The associated project id. */
	project_id?: string;
	/** Whether the agent has read-only access to the block. */
	read_only?: boolean;
	/** The tags to associate with the block. */
	tags?: Array<string>;
	/** The id of the template. */
	template_id?: string;
	/** Name of the block if it is a template. */
	template_name?: string;
};

/** Create a new SSE MCP server */
export type LettaCreateSseMcpServerInput = {
	/** The URL of the server */
	server_url: string;
	/** The name of the authentication header (e.g., 'Authorization') */
	auth_header?: string;
	/** The authentication token or API key value */
	auth_token?: string;
	/** Custom HTTP headers to include with requests */
	custom_headers?: Record<string, string>;
	mcp_server_type?: 'sse';
};

/** Create a new Stdio MCP server */
export type LettaCreateStdioMcpServerInput = {
	/** The arguments to pass to the command */
	args: Array<string>;
	/** The command to run (MCP 'local' client will run this command) */
	command: string;
	/** Environment variables to set */
	env?: Record<string, string>;
	mcp_server_type?: 'stdio';
};

/** Create a new Streamable HTTP MCP server */
export type LettaCreateStreamableHTTPMcpServerInput = {
	/** The URL of the server */
	server_url: string;
	/** The name of the authentication header (e.g., 'Authorization') */
	auth_header?: string;
	/** The authentication token or API key value */
	auth_token?: string;
	/** Custom HTTP headers to include with requests */
	custom_headers?: Record<string, string>;
	mcp_server_type?: 'streamable_http';
};

/** Deepseek model configuration (OpenAI-compatible). */
export type LettaDeepseekModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'deepseek';
	/** The response format for the model. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** The temperature of the model. */
	temperature?: number;
};

/** Configuration for embedding model connection and processing parameters. */
export type LettaEmbeddingConfigInput = {
	/** The dimension of the embedding. */
	embedding_dim: number;
	/** The endpoint type for the model. */
	embedding_endpoint_type:
		| 'openai'
		| 'anthropic'
		| 'bedrock'
		| 'google_ai'
		| 'google_vertex'
		| 'azure'
		| 'groq'
		| 'ollama'
		| 'webui'
		| 'webui-legacy'
		| 'lmstudio'
		| 'lmstudio-legacy'
		| 'llamacpp'
		| 'koboldcpp'
		| 'vllm'
		| 'hugging-face'
		| 'mistral'
		| 'together'
		| 'pinecone';
	/** The model for the embedding. */
	embedding_model: string;
	/** The Azure deployment for the model. */
	azure_deployment?: string;
	/** The Azure endpoint for the model. */
	azure_endpoint?: string;
	/** The Azure version for the model. */
	azure_version?: string;
	/** The maximum batch size for processing embeddings. */
	batch_size?: number;
	/** The chunk size of the embedding. */
	embedding_chunk_size?: number;
	/** The endpoint for the model (`None` if local). */
	embedding_endpoint?: string;
	/** The handle for this config, in the format provider/model-name. */
	handle?: string;
};

export type LettaGoogleAIModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'google_ai';
	/** The response schema for the model. */
	response_schema?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** The temperature of the model. */
	temperature?: number;
	/** The thinking configuration for the model. */
	thinking_config?: {
		/** Whether to include thoughts in the model's response. */
		include_thoughts?: boolean;
		/** The thinking budget for the model. */
		thinking_budget?: number;
	};
};

export type LettaGoogleVertexModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'google_vertex';
	/** The response schema for the model. */
	response_schema?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** The temperature of the model. */
	temperature?: number;
	/** The thinking configuration for the model. */
	thinking_config?: {
		/** Whether to include thoughts in the model's response. */
		include_thoughts?: boolean;
		/** The thinking budget for the model. */
		thinking_budget?: number;
	};
};

/** Groq model configuration (OpenAI-compatible). */
export type LettaGroqModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'groq';
	/** The response format for the model. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** The temperature of the model. */
	temperature?: number;
};

export type LettaImageContentInput = {
	/** The source of the image. */
	source:
		| {
				/** The URL of the image. */
				url: string;
				/** The source type for the image. */
				type?: 'url';
		  }
		| {
				/** The base64 encoded image data. */
				data: string;
				/** The media type for the image. */
				media_type: string;
				/** What level of detail to use when processing and understanding the image (low, high, or auto to let the model decide) */
				detail?: string;
				/** The source type for the image. */
				type?: 'base64';
		  }
		| {
				/** The unique identifier of the image file persisted in storage. */
				file_id: string;
				/** The base64 encoded image data. */
				data?: string;
				/** What level of detail to use when processing and understanding the image (low, high, or auto to let the model decide) */
				detail?: string;
				/** The media type for the image. */
				media_type?: string;
				/** The source type for the image. */
				type?: 'letta';
		  };
	/** The type of the message. */
	type?: 'image';
};

/** Represents the initial tool rule configuration. */
export type LettaInitToolRuleInput = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** Optional prefilled arguments for this tool. When present, these values will override any LLM-provided arguments with the same keys during invocation. Keys must match the tool's parameter names and values must satisfy the tool's JSON schema. Supports partial prefill; non-overlapping parameters… */
	args?: Record<string, LettaJsonValue>;
	/** Optional template string (ignored). Rendering uses fast built-in formatting for performance. */
	prompt_template?: string;
	type?: 'run_first';
};

/** Response format for JSON object responses. */
export type LettaJsonObjectResponseFormatInput = {
	/** The type of the response format. */
	type?: 'json_object';
};

/** Response format for JSON schema-based responses. */
export type LettaJsonSchemaResponseFormatInput = {
	/** The JSON schema of the response. */
	json_schema: Record<string, LettaJsonValue>;
	/** The type of the response format. */
	type?: 'json_schema';
};

/** Sent via the Anthropic Messages API */
export type LettaLettaMessageContentUnionInput =
	| {
			/** The text content of the message. */
			text: string;
			/** Stores a unique identifier for any reasoning associated with this text content. */
			signature?: string;
			/** The type of the message. */
			type?: 'text';
	  }
	| LettaImageContentInput
	| LettaToolCallContentInput
	| LettaToolReturnContentInput
	| LettaReasoningContentInput
	| LettaRedactedReasoningContentInput
	| LettaOmittedReasoningContentInput;

/** Configuration for Language Model (LLM) connection and generation parameters. .. deprecated:: LLMConfig is deprecated and should not be used as an input or return type in API calls. Use the schemas in letta.schemas.model (ModelSettings, OpenAIModelSettings, etc.) instead. For conversion, use the… */
export type LettaLlmConfigInput = {
	/** The context window size for the model. */
	context_window: number;
	/** LLM model name. */
	model: string;
	/** The endpoint type for the model. */
	model_endpoint_type:
		| 'openai'
		| 'anthropic'
		| 'google_ai'
		| 'google_vertex'
		| 'azure'
		| 'groq'
		| 'ollama'
		| 'webui'
		| 'webui-legacy'
		| 'lmstudio'
		| 'lmstudio-legacy'
		| 'lmstudio-chatcompletions'
		| 'llamacpp'
		| 'koboldcpp'
		| 'vllm'
		| 'hugging-face'
		| 'minimax'
		| 'moonshot'
		| 'moonshot_coding'
		| 'mistral'
		| 'together'
		| 'bedrock'
		| 'deepseek'
		| 'xai'
		| 'zai'
		| 'zai_coding'
		| 'baseten'
		| 'fireworks'
		| 'openrouter'
		| 'chatgpt_oauth';
	/** The framework compatibility type for the model. */
	compatibility_type?: 'gguf' | 'mlx';
	/** A human-friendly display name for the model. */
	display_name?: string;
	/** The effort level for Anthropic models that support it (Opus 4.5+). Controls token spending and thinking behavior. Not setting this gives similar performance to 'high'. */
	effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
	/** Whether or not the model should use extended thinking if it is a 'reasoning' style model */
	enable_reasoner?: boolean;
	/** Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. From OpenAI: Number between -2.0 and 2.0. */
	frequency_penalty?: number;
	/** The handle for this config, in the format provider/model-name. */
	handle?: string;
	/** Configurable thinking budget for extended thinking. Used for enable_reasoner and also for Google Vertex models like Gemini 2.5 Flash. Minimum value is 1024 when used with enable_reasoner. */
	max_reasoning_tokens?: number;
	/** The maximum number of tokens to generate. If not set, the model will use its default value. */
	max_tokens?: number;
	/** The endpoint for the model. */
	model_endpoint?: string;
	/** The wrapper for the model. */
	model_wrapper?: string;
	/** Deprecated: Use model_settings to configure parallel tool calls instead. If set to True, enables parallel tool calling. Defaults to False. */
	parallel_tool_calls?: boolean;
	/** The provider category for the model. */
	provider_category?: LettaProviderCategoryInput;
	/** The provider name for the model. */
	provider_name?: string;
	/** Puts 'inner_thoughts' as a kwarg in the function call if this is set to True. This helps with function calling performance and also the generation of inner thoughts. */
	put_inner_thoughts_in_kwargs?: boolean;
	/** The reasoning effort to use when generating text reasoning models */
	reasoning_effort?: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
	/** The response format for the model's output. Supports text, json_object, and json_schema (structured outputs). Can be set via model_settings. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** Whether to return log probabilities of the output tokens. Useful for RL training. */
	return_logprobs?: boolean;
	/** Whether to return token IDs for all LLM generations via SGLang native endpoint. Required for multi-turn RL training with loss masking. Only works with SGLang provider. */
	return_token_ids?: boolean;
	/** Enable strict mode for tool calling. When true, tool schemas include strict: true and additionalProperties: false, guaranteeing tool outputs match JSON schemas. */
	strict?: boolean;
	/** The temperature to use when generating text with the model. A higher temperature will result in more random text. */
	temperature?: number;
	/** The cost tier for the model (cloud only). */
	tier?: string;
	/** SGLang tool call parser name (e.g. 'glm47', 'qwen25', 'hermes'). Used by the SGLang native adapter to parse tool calls from raw model output. */
	tool_call_parser?: string;
	/** Number of most likely tokens to return at each position (0-20). Requires return_logprobs=True. */
	top_logprobs?: number;
	/** Soft control for how verbose model output should be, used for GPT-5 models. */
	verbosity?: 'low' | 'medium' | 'high';
};

/** Represents a tool rule configuration which constrains the total number of times this tool can be invoked in a single step. */
export type LettaMaxCountPerStepToolRuleInput = {
	/** The max limit for the total number of times this tool can be invoked in a single step. */
	max_count_limit: number;
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** Optional template string (ignored). */
	prompt_template?: string;
	type?: 'max_count_per_step';
};

/** Request to create a message */
export type LettaMessageCreateInput = {
	/** The content of the message. */
	content: Array<LettaLettaMessageContentUnionInput> | string;
	/** The role of the participant. */
	role: 'user' | 'system' | 'assistant';
	/** The id of the LLMBatchItem that this message is associated with */
	batch_item_id?: string;
	/** The multi-agent group that the message was sent in */
	group_id?: string;
	/** The name of the participant. */
	name?: string;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string;
	/** The id of the sender of the message, can be an identity id or agent id */
	sender_id?: string;
	/** The message type to be created. */
	type?: 'message';
};

export type LettaMessageTypeInput =
	| 'system_message'
	| 'user_message'
	| 'assistant_message'
	| 'reasoning_message'
	| 'hidden_reasoning_message'
	| 'tool_call_message'
	| 'tool_return_message'
	| 'approval_request_message'
	| 'approval_response_message'
	| 'summary_message'
	| 'event_message';

export type LettaNpmRequirementInput = {
	/** Name of the npm package. */
	name: string;
	/** Optional version of the package, following semantic versioning. */
	version?: string;
};

/** A placeholder for reasoning content we know is present, but isn't returned by the provider (e.g. OpenAI GPT-5 on ChatCompletions) */
export type LettaOmittedReasoningContentInput = {
	/** A unique identifier for this reasoning step. */
	signature?: string;
	/** Indicates this is an omitted reasoning step. */
	type?: 'omitted_reasoning';
};

export type LettaOpenAIModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'openai';
	/** The reasoning configuration for the model. */
	reasoning?: {
		/** The reasoning effort to use when generating text reasoning models */
		reasoning_effort?: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
	};
	/** The response format for the model. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
	strict?: boolean;
	/** The temperature of the model. */
	temperature?: number;
};

/** A ToolRule that only allows a child tool to be called if the parent has been called. */
export type LettaParentToolRuleInput = {
	/** The children tools that can be invoked. */
	children: Array<string>;
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** Optional template string (ignored). */
	prompt_template?: string;
	type?: 'parent_last_tool';
};

export type LettaPipRequirementInput = {
	/** Name of the pip package. */
	name: string;
	/** Optional version of the package, following semantic versioning. */
	version?: string;
};

export type LettaProviderCategoryInput = 'base' | 'byok';

export type LettaProviderTypeInput =
	| 'anthropic'
	| 'azure'
	| 'baseten'
	| 'bedrock'
	| 'cerebras'
	| 'chatgpt_oauth'
	| 'deepseek'
	| 'fireworks'
	| 'google_ai'
	| 'google_vertex'
	| 'groq'
	| 'hugging-face'
	| 'letta'
	| 'lmstudio_openai'
	| 'minimax'
	| 'moonshot'
	| 'moonshot_coding'
	| 'mistral'
	| 'ollama'
	| 'openai'
	| 'together'
	| 'vllm'
	| 'sglang'
	| 'openrouter'
	| 'xai'
	| 'zai'
	| 'zai_coding';

/** Sent via the Anthropic Messages API */
export type LettaReasoningContentInput = {
	/** Whether the reasoning content was generated by a reasoner model that processed this step. */
	is_native: boolean;
	/** The intermediate reasoning or thought process content. */
	reasoning: string;
	/** A unique identifier for this reasoning step. */
	signature?: string;
	/** Indicates this is a reasoning/intermediate step. */
	type?: 'reasoning';
};

/** Sent via the Anthropic Messages API */
export type LettaRedactedReasoningContentInput = {
	/** The redacted or filtered intermediate reasoning content. */
	data: string;
	/** Indicates this is a redacted thinking step. */
	type?: 'redacted_reasoning';
};

/** Represents a tool rule configuration where this tool must be called before the agent loop can exit. */
export type LettaRequiredBeforeExitToolRuleInput = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** Optional template string (ignored). */
	prompt_template?: string;
	type?: 'required_before_exit';
};

/** Represents a tool rule configuration which requires approval before the tool can be invoked. */
export type LettaRequiresApprovalToolRuleInput = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** Optional template string (ignored). Rendering uses fast built-in formatting for performance. */
	prompt_template?: string;
	type?: 'requires_approval';
};

export type LettaStopReasonTypeInput =
	| 'end_turn'
	| 'error'
	| 'llm_api_error'
	| 'invalid_llm_response'
	| 'invalid_tool_call'
	| 'max_steps'
	| 'max_tokens_exceeded'
	| 'no_tool_call'
	| 'tool_rule'
	| 'cancelled'
	| 'insufficient_credits'
	| 'requires_approval'
	| 'context_window_overflow_in_system_prompt';

/** Represents a terminal tool rule configuration where if this tool gets called, it must end the agent loop. */
export type LettaTerminalToolRuleInput = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name: string;
	/** Optional template string (ignored). */
	prompt_template?: string;
	type?: 'exit_loop';
};

export type LettaTextContentInput = {
	/** The text content of the message. */
	text: string;
	/** Stores a unique identifier for any reasoning associated with this text content. */
	signature?: string;
	/** The type of the message. */
	type?: 'text';
};

/** Response format for plain text responses. */
export type LettaTextResponseFormatInput = {
	/** The type of the response format. */
	type?: 'text';
};

/** Together AI model configuration (OpenAI-compatible). */
export type LettaTogetherModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'together';
	/** The response format for the model. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** The temperature of the model. */
	temperature?: number;
};

export type LettaToolCallContentInput = {
	/** A unique identifier for this specific tool call instance. */
	id: string;
	/** The parameters being passed to the tool, structured as a dictionary of parameter names to values. */
	input: Record<string, LettaJsonValue>;
	/** The name of the tool being called. */
	name: string;
	/** Stores a unique identifier for any reasoning associated with this tool call. */
	signature?: string;
	/** Indicates this content represents a tool call event. */
	type?: 'tool_call';
};

export type LettaToolReturnInput = {
	status: 'success' | 'error';
	tool_call_id: string;
	/** The tool return value - either a string or list of content parts (text/image) */
	tool_return: Array<LettaTextContentInput | LettaImageContentInput> | string;
	stderr?: Array<string>;
	stdout?: Array<string>;
	/** The message type to be created. */
	type?: 'tool';
};

export type LettaToolReturnContentInput = {
	/** The content returned by the tool execution. */
	content: string;
	/** Indicates whether the tool execution resulted in an error. */
	is_error: boolean;
	/** References the ID of the ToolCallContent that initiated this tool call. */
	tool_call_id: string;
	/** Indicates this content represents a tool return event. */
	type?: 'tool_return';
};

/** Update schema for SSE MCP server - all fields optional */
export type LettaUpdateSseMcpServerInput = {
	/** The URL of the server */
	server_url: string;
	/** The name of the authentication header (e.g., 'Authorization') */
	auth_header?: string;
	/** The authentication token or API key value */
	auth_token?: string;
	/** Custom HTTP headers to include with requests */
	custom_headers?: Record<string, string>;
	mcp_server_type?: 'sse';
};

/** Update schema for Stdio MCP server - all fields optional */
export type LettaUpdateStdioMcpServerInput = {
	/** The arguments to pass to the command */
	args: Array<string>;
	/** The command to run (MCP 'local' client will run this command) */
	command: string;
	/** Environment variables to set */
	env?: Record<string, string>;
	mcp_server_type?: 'stdio';
};

/** Update schema for Streamable HTTP MCP server - all fields optional */
export type LettaUpdateStreamableHTTPMcpServerInput = {
	/** The URL of the server */
	server_url: string;
	/** The name of the authentication header (e.g., 'Authorization') */
	auth_header?: string;
	/** The authentication token or API key value */
	auth_token?: string;
	/** Custom HTTP headers to include with requests */
	custom_headers?: Record<string, string>;
	mcp_server_type?: 'streamable_http';
};

/** xAI model configuration (OpenAI-compatible). */
export type LettaXaiModelSettingsInput = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean;
	/** The type of the provider. */
	provider_type?: 'xai';
	/** The response format for the model. */
	response_format?:
		| LettaTextResponseFormatInput
		| LettaJsonSchemaResponseFormatInput
		| LettaJsonObjectResponseFormatInput;
	/** The temperature of the model. */
	temperature?: number;
};

export type LettaAgentEnvironmentVariable = {
	/** The ID of the agent this environment variable belongs to. */
	agent_id?: string | null;
	/** The name of the environment variable. */
	key?: string | null;
	/** The value of the environment variable. */
	value?: string | null;
	/** The human-friendly ID of the Agent-env */
	id?: string | null;
	/** The timestamp when the object was created. */
	created_at?: string | null;
	/** The id of the user that made this object. */
	created_by_id?: string | null;
	/** An optional description of the environment variable. */
	description?: string | null;
	/** The id of the user that made this object. */
	last_updated_by_id?: string | null;
	/** The timestamp when the object was last updated. */
	updated_at?: string | null;
	/** Encrypted secret value (stored as encrypted string) */
	value_enc?: string | null;
};

/** Representation of an agent's state. This is the state of the agent at a given time, and is persisted in the DB backend. The state has all the information needed to recreate a persisted agent. */
export type LettaAgentState = {
	/** The id of the agent. Assigned by the database. */
	id?: string | null;
	/** The type of agent. */
	agent_type?: LettaAgentType | null;
	/** The memory blocks used by the agent. */
	blocks?: Array<LettaBlock> | null;
	/** Deprecated: Use `model` field instead. The LLM configuration used by the agent. */
	llm_config?: LettaLlmConfig | null;
	/** Deprecated: Use `blocks` field instead. The in-context memory of the agent. */
	memory?: {
		/** Memory blocks contained in the agent's in-context memory */
		blocks?: Array<LettaBlock> | null;
		/** Agent type controlling prompt rendering. */
		agent_type?: (LettaAgentType | string) | null;
		/** Special blocks representing the agent's in-context memory of an attached file */
		file_blocks?: Array<{
			/** Unique identifier of the file. */
			file_id?: string | null;
			/** True if the agent currently has the file open. */
			is_open?: boolean | null;
			/** Deprecated: Use `folder_id` field instead. Unique identifier of the source. */
			source_id?: string | null;
			/** Value of the block. */
			value?: string | null;
			/** The human-friendly ID of the Block */
			id?: string | null;
			/** The base template id of the block. */
			base_template_id?: string | null;
			/** The id of the user that made this Block. */
			created_by_id?: string | null;
			/** The id of the deployment. */
			deployment_id?: string | null;
			/** Description of the block. */
			description?: string | null;
			/** The id of the entity within the template. */
			entity_id?: string | null;
			/** If set to True, the block will be hidden. */
			hidden?: boolean | null;
			/** Whether the block is a template (e.g. saved human/persona options). */
			is_template?: boolean | null;
			/** Label of the block (e.g. 'human', 'persona') in the context window. */
			label?: string | null;
			/** UTC timestamp of the agent’s most recent access to this file. Any operations from the open, close, or search tools will update this field. */
			last_accessed_at?: string | null;
			/** The id of the user that last updated this Block. */
			last_updated_by_id?: string | null;
			/** Character limit of the block. */
			limit?: number | null;
			/** Metadata of the block. */
			metadata?: Record<string, LettaJsonValue> | null;
			/** Preserve the block on template migration. */
			preserve_on_migration?: boolean | null;
			/** The associated project id. */
			project_id?: string | null;
			/** Whether the agent has read-only access to the block. */
			read_only?: boolean | null;
			/** The tags associated with the block. */
			tags?: Array<string> | null;
			/** The id of the template. */
			template_id?: string | null;
			/** Name of the block if it is a template. */
			template_name?: string | null;
		}> | null;
		/** Whether this agent uses git-backed memory with structured labels. */
		git_enabled?: boolean | null;
		/** Deprecated. Ignored for performance. */
		prompt_template?: string | null;
	} | null;
	/** The name of the agent. */
	name?: string | null;
	/** Deprecated: Use `folders` field instead. The sources used by the agent. */
	sources?: Array<{
		/** The human-friendly ID of the Source */
		id?: string | null;
		/** The embedding configuration used by the source. */
		embedding_config?: LettaEmbeddingConfig | null;
		/** The name of the source. */
		name?: string | null;
		/** The timestamp when the source was created. */
		created_at?: string | null;
		/** The id of the user that made this Tool. */
		created_by_id?: string | null;
		/** The description of the source. */
		description?: string | null;
		/** Instructions for how to use the source. */
		instructions?: string | null;
		/** The id of the user that made this Tool. */
		last_updated_by_id?: string | null;
		/** Metadata associated with the source. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** The timestamp when the source was last updated. */
		updated_at?: string | null;
		/** The vector database provider used for this source's passages */
		vector_db_provider?: LettaVectorDBProvider | null;
	}> | null;
	/** The system prompt used by the agent. */
	system?: string | null;
	/** The tags associated with the agent. */
	tags?: Array<string> | null;
	/** The tools used by the agent. */
	tools?: Array<LettaTool> | null;
	/** The base template id of the agent. */
	base_template_id?: string | null;
	/** Configuration for conversation compaction / summarization. Per-model settings (temperature, max tokens, etc.) are derived from the default configuration for that handle. */
	compaction_settings?: {
		/** The maximum length of the summary in characters. If none, no clipping is performed. */
		clip_chars?: number | null;
		/** The type of summarization technique use. */
		mode?: string | null;
		/** Model handle to use for sliding_window/all summarization (format: provider/model-name). If None, uses lightweight provider-specific defaults. */
		model?: string | null;
		/** Optional model settings used to override defaults for the summarizer model. */
		model_settings?:
			| (
					| LettaOpenAIModelSettings
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The reasoning configuration for the model. */
							reasoning?: {
								/** The reasoning effort to use when generating text reasoning models */
								reasoning_effort?: string | null;
							} | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
							strict?: boolean | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| LettaAnthropicModelSettings
					| LettaGoogleAIModelSettings
					| LettaGoogleVertexModelSettings
					| LettaAzureModelSettings
					| LettaXaiModelSettings
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
							strict?: boolean | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** The temperature of the model. */
							temperature?: number | null;
							/** The thinking configuration for GLM-4.5+ models. */
							thinking?: {
								/** If False, preserved thinking is used (recommended for agents). */
								clear_thinking?: boolean | null;
								/** Whether thinking is enabled or disabled. */
								type?: string | null;
							} | null;
					  }
					| {
							/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
							effort?: string | null;
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
							strict?: boolean | null;
							/** The temperature of the model. */
							temperature?: number | null;
							/** The thinking configuration for the model. */
							thinking?: {
								/** The maximum number of tokens the model can use for extended thinking. */
								budget_tokens?: number | null;
								/** The type of thinking to use. */
								type?: string | null;
							} | null;
							/** Soft control for how verbose model output should be, used for GPT-5 models. */
							verbosity?: string | null;
					  }
					| LettaGroqModelSettings
					| LettaDeepseekModelSettings
					| LettaTogetherModelSettings
					| LettaBedrockModelSettings
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The reasoning configuration for the model. */
							reasoning?: {
								/** The reasoning effort level for GPT-5.x and o-series models. */
								reasoning_effort?: string | null;
							} | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
			  )
			| null;
		/** The prompt to use for summarization. If None, uses mode-specific default. */
		prompt?: string | null;
		/** Whether to include an acknowledgement post-prompt (helps prevent non-summary outputs). */
		prompt_acknowledgement?: boolean | null;
		/** The percentage of the context window to keep post-summarization (only used in sliding window modes). */
		sliding_window_percentage?: number | null;
	} | null;
	/** The timestamp when the object was created. */
	created_at?: string | null;
	/** The id of the user that made this object. */
	created_by_id?: string | null;
	/** The id of the deployment. */
	deployment_id?: string | null;
	/** The description of the agent. */
	description?: string | null;
	/** The embedding model handle used by the agent (format: provider/model-name). */
	embedding?: string | null;
	/** Configuration for embedding model connection and processing parameters. */
	embedding_config?: LettaEmbeddingConfig | null;
	/** If set to True, memory management will move to a background agent thread. */
	enable_sleeptime?: boolean | null;
	/** The id of the entity within the template. */
	entity_id?: string | null;
	/** If set to True, the agent will be hidden. */
	hidden?: boolean | null;
	/** The identities associated with this agent. */
	identities?: Array<{
		/** The human-friendly ID of the Identity */
		id?: string | null;
		/** The IDs of the agents associated with the identity. */
		agent_ids?: Array<string> | null;
		/** The IDs of the blocks associated with the identity. */
		block_ids?: Array<string> | null;
		/** External, user-generated identifier key of the identity. */
		identifier_key?: string | null;
		/** The type of the identity. */
		identity_type?: string | null;
		/** The name of the identity. */
		name?: string | null;
		/** The project id of the identity, if applicable. */
		project_id?: string | null;
		/** List of properties associated with the identity */
		properties?: Array<{
			/** The key of the property */
			key?: string | null;
			/** The type of the property */
			type?: string | null;
			/** The value of the property */
			value?:
				| (string | number | boolean | Record<string, LettaJsonValue>)
				| null;
		}> | null;
	}> | null;
	/** Deprecated: Use `identities` field instead. The ids of the identities associated with this agent. */
	identity_ids?: Array<string> | null;
	/** The timestamp when the agent last completed a run. */
	last_run_completion?: string | null;
	/** The duration in milliseconds of the agent's last run. */
	last_run_duration_ms?: number | null;
	/** The stop reason from the agent's last run. */
	last_stop_reason?: LettaStopReasonType | null;
	/** The id of the user that made this object. */
	last_updated_by_id?: string | null;
	/** The multi-agent group that this agent manages */
	managed_group?: {
		/** The id of the group. Assigned by the database. */
		id?: string | null;
		agent_ids?: Array<string> | null;
		description?: string | null;
		manager_type?: string | null;
		/** The base template id. */
		base_template_id?: string | null;
		/** The id of the deployment. */
		deployment_id?: string | null;
		/** If set to True, the group will be hidden. */
		hidden?: boolean | null;
		last_processed_message_id?: string | null;
		manager_agent_id?: string | null;
		/** The desired maximum length of messages in the context window of the convo agent. This is a best effort, and may be off slightly due to user/assistant interleaving. */
		max_message_buffer_length?: number | null;
		max_turns?: number | null;
		/** The desired minimum length of messages in the context window of the convo agent. This is a best effort, and may be off-by-one due to user/assistant interleaving. */
		min_message_buffer_length?: number | null;
		/** The associated project id. */
		project_id?: string | null;
		shared_block_ids?: Array<string> | null;
		sleeptime_agent_frequency?: number | null;
		/** The id of the template. */
		template_id?: string | null;
		termination_token?: string | null;
		turns_counter?: number | null;
	} | null;
	/** Maximum number of files that can be open at once for this agent. Setting this too high may exceed the context window, which will break the agent. */
	max_files_open?: number | null;
	/** If set to True, the agent will not remember previous messages (though the agent will still retain state via core memory blocks and archival/recall memory). Not recommended unless you have an advanced use case. */
	message_buffer_autoclear?: boolean | null;
	/** The ids of the messages in the agent's in-context memory. */
	message_ids?: Array<string> | null;
	/** The metadata of the agent. */
	metadata?: Record<string, LettaJsonValue> | null;
	/** The model handle used by the agent (format: provider/model-name). */
	model?: string | null;
	/** The model settings used by the agent. */
	model_settings?:
		| (
				| LettaOpenAIModelSettings
				| Record<string, LettaJsonValue>
				| LettaAnthropicModelSettings
				| LettaGoogleAIModelSettings
				| LettaGoogleVertexModelSettings
				| LettaAzureModelSettings
				| LettaXaiModelSettings
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean | null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** The temperature of the model. */
						temperature?: number | null;
						/** The thinking configuration for GLM-4.5+ models. */
						thinking?: {
							/** If False, preserved thinking is used (recommended for agents). */
							clear_thinking?: boolean | null;
							/** Whether thinking is enabled or disabled. */
							type?: string | null;
						} | null;
				  }
				| {
						/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
						effort?: string | null;
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean | null;
						/** The temperature of the model. */
						temperature?: number | null;
						/** The thinking configuration for the model. */
						thinking?: {
							/** The maximum number of tokens the model can use for extended thinking. */
							budget_tokens?: number | null;
							/** The type of thinking to use. */
							type?: string | null;
						} | null;
						/** Soft control for how verbose model output should be, used for GPT-5 models. */
						verbosity?: string | null;
				  }
				| LettaGroqModelSettings
				| LettaDeepseekModelSettings
				| LettaTogetherModelSettings
				| LettaBedrockModelSettings
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort level for GPT-5.x and o-series models. */
							reasoning_effort?: string | null;
						} | null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
		  )
		| null;
	/** Deprecated: Use `managed_group` field instead. The multi-agent group that this agent manages. */
	multi_agent_group?: {
		/** The id of the group. Assigned by the database. */
		id?: string | null;
		agent_ids?: Array<string> | null;
		description?: string | null;
		manager_type?: string | null;
		/** The base template id. */
		base_template_id?: string | null;
		/** The id of the deployment. */
		deployment_id?: string | null;
		/** If set to True, the group will be hidden. */
		hidden?: boolean | null;
		last_processed_message_id?: string | null;
		manager_agent_id?: string | null;
		/** The desired maximum length of messages in the context window of the convo agent. This is a best effort, and may be off slightly due to user/assistant interleaving. */
		max_message_buffer_length?: number | null;
		max_turns?: number | null;
		/** The desired minimum length of messages in the context window of the convo agent. This is a best effort, and may be off-by-one due to user/assistant interleaving. */
		min_message_buffer_length?: number | null;
		/** The associated project id. */
		project_id?: string | null;
		shared_block_ids?: Array<string> | null;
		sleeptime_agent_frequency?: number | null;
		/** The id of the template. */
		template_id?: string | null;
		termination_token?: string | null;
		turns_counter?: number | null;
	} | null;
	/** A message representing a request for approval to call a tool (generated by the LLM to trigger tool execution). Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message tool_call (ToolCall):… */
	pending_approval?: LettaApprovalRequestMessage | null;
	/** The per-file view window character limit for this agent. Setting this too high may exceed the context window, which will break the agent. */
	per_file_view_window_char_limit?: number | null;
	/** The id of the project the agent belongs to. */
	project_id?: string | null;
	/** The response format used by the agent */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The environment variables for tool execution specific to this agent. */
	secrets?: Array<LettaAgentEnvironmentVariable> | null;
	/** The id of the template the agent belongs to. */
	template_id?: string | null;
	/** The timezone of the agent (IANA format). */
	timezone?: string | null;
	/** Deprecated: use `secrets` field instead. */
	tool_exec_environment_variables?: Array<LettaAgentEnvironmentVariable> | null;
	/** The list of tool rules. */
	tool_rules?: Array<
		| LettaChildToolRule
		| LettaInitToolRule
		| LettaTerminalToolRule
		| LettaConditionalToolRule
		| LettaContinueToolRule
		| LettaRequiredBeforeExitToolRule
		| LettaMaxCountPerStepToolRule
		| LettaParentToolRule
		| LettaRequiresApprovalToolRule
	> | null;
	/** The timestamp when the object was last updated. */
	updated_at?: string | null;
};

/** Enum to represent the type of agent. */
export type LettaAgentType = string;

export type LettaAnthropicModelSettings = {
	/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
	effort?: string | null;
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response format for the model. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
	strict?: boolean | null;
	/** The temperature of the model. */
	temperature?: number | null;
	/** The thinking configuration for the model. */
	thinking?: {
		/** The maximum number of tokens the model can use for extended thinking. */
		budget_tokens?: number | null;
		/** The type of thinking to use. */
		type?: string | null;
	} | null;
	/** Soft control for how verbose model output should be, used for GPT-5 models. */
	verbosity?: string | null;
};

/** A message representing a request for approval to call a tool (generated by the LLM to trigger tool execution). Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message tool_call (ToolCall):… */
export type LettaApprovalRequestMessage = {
	id?: string | null;
	date?: string | null;
	/** The tool call that has been requested by the llm to run */
	tool_call?: (LettaToolCall | LettaToolCallDelta) | null;
	is_err?: boolean | null;
	/** The type of the message. */
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	step_id?: string | null;
	/** The tool calls that have been requested by the llm to run, which are pending approval */
	tool_calls?: (Array<LettaToolCall> | LettaToolCallDelta) | null;
};

/** A message representing a response form the user indicating whether a tool has been approved to run. Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message approve: (bool) Whether the tool… */
export type LettaApprovalResponseMessage = {
	id?: string | null;
	date?: string | null;
	/** The message ID of the approval request */
	approval_request_id?: string | null;
	/** The list of approval responses */
	approvals?: Array<LettaApprovalReturn | LettaToolReturn> | null;
	/** Whether the tool has been approved */
	approve?: boolean | null;
	is_err?: boolean | null;
	/** The type of the message. */
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	/** An optional explanation for the provided approval status */
	reason?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	step_id?: string | null;
};

export type LettaApprovalReturn = {
	/** Whether the tool has been approved */
	approve?: boolean | null;
	/** The ID of the tool call that corresponds to this approval */
	tool_call_id?: string | null;
	/** An optional explanation for the provided approval status */
	reason?: string | null;
	/** The message type to be created. */
	type?: string | null;
};

/** Representation of an archive - a collection of archival passages that can be shared between agents. */
export type LettaArchive = {
	/** The human-friendly ID of the Archive */
	id?: string | null;
	/** The creation date of the archive */
	created_at?: string | null;
	/** The name of the archive */
	name?: string | null;
	/** The id of the user that made this object. */
	created_by_id?: string | null;
	/** A description of the archive */
	description?: string | null;
	/** Configuration for embedding model connection and processing parameters. */
	embedding_config?: LettaEmbeddingConfig | null;
	/** The id of the user that made this object. */
	last_updated_by_id?: string | null;
	/** Additional metadata */
	metadata?: Record<string, LettaJsonValue> | null;
	/** The timestamp when the object was last updated. */
	updated_at?: string | null;
	/** The vector database provider used for this archive's passages */
	vector_db_provider?: LettaVectorDBProvider | null;
};

/** A message sent by the LLM in response to user input. Used in the LLM context. Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message content (Union[str,… */
export type LettaAssistantMessage = {
	id?: string | null;
	/** The message content sent by the agent (can be a string or an array of content parts) */
	content?: (Array<LettaLettaAssistantMessageContentUnion> | string) | null;
	date?: string | null;
	is_err?: boolean | null;
	/** The type of the message. */
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	step_id?: string | null;
};

/** Azure OpenAI model configuration (OpenAI-compatible). */
export type LettaAzureModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response format for the model. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The temperature of the model. */
	temperature?: number | null;
};

/** AWS Bedrock model configuration. */
export type LettaBedrockModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response format for the model. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The temperature of the model. */
	temperature?: number | null;
};

/** A Block represents a reserved section of the LLM's context window. */
export type LettaBlock = {
	/** Value of the block. */
	value?: string | null;
	/** The human-friendly ID of the Block */
	id?: string | null;
	/** The base template id of the block. */
	base_template_id?: string | null;
	/** The id of the user that made this Block. */
	created_by_id?: string | null;
	/** The id of the deployment. */
	deployment_id?: string | null;
	/** Description of the block. */
	description?: string | null;
	/** The id of the entity within the template. */
	entity_id?: string | null;
	/** If set to True, the block will be hidden. */
	hidden?: boolean | null;
	/** Whether the block is a template (e.g. saved human/persona options). */
	is_template?: boolean | null;
	/** Label of the block (e.g. 'human', 'persona') in the context window. */
	label?: string | null;
	/** The id of the user that last updated this Block. */
	last_updated_by_id?: string | null;
	/** Character limit of the block. */
	limit?: number | null;
	/** Metadata of the block. */
	metadata?: Record<string, LettaJsonValue> | null;
	/** Preserve the block on template migration. */
	preserve_on_migration?: boolean | null;
	/** The associated project id. */
	project_id?: string | null;
	/** Whether the agent has read-only access to the block. */
	read_only?: boolean | null;
	/** The tags associated with the block. */
	tags?: Array<string> | null;
	/** The id of the template. */
	template_id?: string | null;
	/** Name of the block if it is a template. */
	template_name?: string | null;
};

export type LettaBlockResponse = {
	/** The id of the block. */
	id?: string | null;
	/** Value of the block. */
	value?: string | null;
	/** (Deprecated) The base template id of the block. */
	base_template_id?: string | null;
	/** The id of the user that made this Block. */
	created_by_id?: string | null;
	/** (Deprecated) The id of the deployment. */
	deployment_id?: string | null;
	/** Description of the block. */
	description?: string | null;
	/** (Deprecated) The id of the entity within the template. */
	entity_id?: string | null;
	/** (Deprecated) If set to True, the block will be hidden. */
	hidden?: boolean | null;
	/** Whether the block is a template (e.g. saved human/persona options). */
	is_template?: boolean | null;
	/** Label of the block (e.g. 'human', 'persona') in the context window. */
	label?: string | null;
	/** The id of the user that last updated this Block. */
	last_updated_by_id?: string | null;
	/** Character limit of the block. */
	limit?: number | null;
	/** Metadata of the block. */
	metadata?: Record<string, LettaJsonValue> | null;
	/** (Deprecated) Preserve the block on template migration. */
	preserve_on_migration?: boolean | null;
	/** The associated project id. */
	project_id?: string | null;
	/** (Deprecated) Whether the agent has read-only access to the block. */
	read_only?: boolean | null;
	/** The tags associated with the block. */
	tags?: Array<string> | null;
	/** (Deprecated) The id of the template. */
	template_id?: string | null;
	/** (Deprecated) The name of the block template (if it is a template). */
	template_name?: string | null;
};

/** A ToolRule represents a tool that can be invoked by the agent. */
export type LettaChildToolRule = {
	/** The children tools that can be invoked. */
	children?: Array<string> | null;
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** Optional list of typed child argument overrides. Each node must reference a child in 'children'. */
	child_arg_nodes?: Array<{
		/** The name of the child tool to invoke next. */
		name?: string | null;
		/** Optional prefilled arguments for this child tool. Keys must match the tool's parameter names and values must satisfy the tool's JSON schema. Supports partial prefill; non-overlapping parameters are left to the model. */
		args?: Record<string, LettaJsonValue> | null;
	}> | null;
	/** Optional template string (ignored). */
	prompt_template?: string | null;
	type?: string | null;
};

export type LettaCompactionResponse = {
	num_messages_after?: number | null;
	num_messages_before?: number | null;
	summary?: string | null;
};

/** A ToolRule that conditionally maps to different child tools based on the output. */
export type LettaConditionalToolRule = {
	/** The output case to check for mapping */
	child_output_mapping?: Record<string, string> | null;
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** The default child tool to be called. If None, any tool can be called. */
	default_child?: string | null;
	/** Optional template string (ignored). */
	prompt_template?: string | null;
	/** Whether to throw an error when output doesn't match any case */
	require_output_mapping?: boolean | null;
	type?: string | null;
};

/** Represents a tool rule configuration where if this tool gets called, it must continue the agent loop. */
export type LettaContinueToolRule = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** Optional template string (ignored). */
	prompt_template?: string | null;
	type?: string | null;
};

/** Represents a conversation on an agent for concurrent messaging. */
export type LettaConversation = {
	/** The unique identifier of the conversation. */
	id?: string | null;
	/** The ID of the agent this conversation belongs to. */
	agent_id?: string | null;
	/** Whether the conversation is archived. */
	archived?: boolean | null;
	/** Timestamp of when the conversation was archived. */
	archived_at?: string | null;
	/** The context window limit for this conversation (overrides agent's context window). */
	context_window_limit?: number | null;
	/** The timestamp when the object was created. */
	created_at?: string | null;
	/** The id of the user that made this object. */
	created_by_id?: string | null;
	/** A generated description of the conversation used for search and bootstrap context. */
	description?: string | null;
	/** The IDs of in-context messages for the conversation. Null means this field was not retrieved/hydrated for this response. */
	in_context_message_ids?: Array<string> | null;
	/** Timestamp of the most recent message request sent to this conversation. */
	last_message_at?: string | null;
	/** The id of the user that made this object. */
	last_updated_by_id?: string | null;
	/** The model handle for this conversation (overrides agent's model). Format: provider/model-name. */
	model?: string | null;
	/** The model settings for this conversation (overrides agent's model settings). */
	model_settings?:
		| (
				| LettaOpenAIModelSettings
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort to use when generating text reasoning models */
							reasoning_effort?: string | null;
						} | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean | null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
				| LettaAnthropicModelSettings
				| LettaGoogleAIModelSettings
				| LettaGoogleVertexModelSettings
				| LettaAzureModelSettings
				| LettaXaiModelSettings
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean | null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** The temperature of the model. */
						temperature?: number | null;
						/** The thinking configuration for GLM-4.5+ models. */
						thinking?: {
							/** If False, preserved thinking is used (recommended for agents). */
							clear_thinking?: boolean | null;
							/** Whether thinking is enabled or disabled. */
							type?: string | null;
						} | null;
				  }
				| {
						/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
						effort?: string | null;
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean | null;
						/** The temperature of the model. */
						temperature?: number | null;
						/** The thinking configuration for the model. */
						thinking?: {
							/** The maximum number of tokens the model can use for extended thinking. */
							budget_tokens?: number | null;
							/** The type of thinking to use. */
							type?: string | null;
						} | null;
						/** Soft control for how verbose model output should be, used for GPT-5 models. */
						verbosity?: string | null;
				  }
				| LettaGroqModelSettings
				| LettaDeepseekModelSettings
				| LettaTogetherModelSettings
				| LettaBedrockModelSettings
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The response format for the model. */
						response_format?:
							| (
									| LettaTextResponseFormat
									| LettaJsonSchemaResponseFormat
									| LettaJsonObjectResponseFormat
							  )
							| null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number | null;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean | null;
						/** The type of the provider. */
						provider_type?: string | null;
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort level for GPT-5.x and o-series models. */
							reasoning_effort?: string | null;
						} | null;
						/** The temperature of the model. */
						temperature?: number | null;
				  }
		  )
		| null;
	/** A summary of the conversation. */
	summary?: string | null;
	/** The timestamp when the object was last updated. */
	updated_at?: string | null;
};

/** Deepseek model configuration (OpenAI-compatible). */
export type LettaDeepseekModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response format for the model. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The temperature of the model. */
	temperature?: number | null;
};

/** Configuration for embedding model connection and processing parameters. */
export type LettaEmbeddingConfig = {
	/** The dimension of the embedding. */
	embedding_dim?: number | null;
	/** The endpoint type for the model. */
	embedding_endpoint_type?: string | null;
	/** The model for the embedding. */
	embedding_model?: string | null;
	/** The Azure deployment for the model. */
	azure_deployment?: string | null;
	/** The Azure endpoint for the model. */
	azure_endpoint?: string | null;
	/** The Azure version for the model. */
	azure_version?: string | null;
	/** The maximum batch size for processing embeddings. */
	batch_size?: number | null;
	/** The chunk size of the embedding. */
	embedding_chunk_size?: number | null;
	/** The endpoint for the model (`None` if local). */
	embedding_endpoint?: string | null;
	/** The handle for this config, in the format provider/model-name. */
	handle?: string | null;
};

/** A message for notifying the developer that an event that has occured (e.g. a compaction). Events are NOT part of the context window. */
export type LettaEventMessage = {
	id?: string | null;
	date?: string | null;
	event_data?: Record<string, LettaJsonValue> | null;
	event_type?: string | null;
	is_err?: boolean | null;
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	step_id?: string | null;
};

/** Representation of a folder, which is a collection of files and passages. */
export type LettaFolder = {
	/** The human-friendly ID of the Source */
	id?: string | null;
	/** The embedding configuration used by the folder. */
	embedding_config?: LettaEmbeddingConfig | null;
	/** The name of the folder. */
	name?: string | null;
	/** The timestamp when the folder was created. */
	created_at?: string | null;
	/** The id of the user that made this Tool. */
	created_by_id?: string | null;
	/** The description of the folder. */
	description?: string | null;
	/** Instructions for how to use the folder. */
	instructions?: string | null;
	/** The id of the user that made this Tool. */
	last_updated_by_id?: string | null;
	/** Metadata associated with the folder. */
	metadata?: Record<string, LettaJsonValue> | null;
	/** The timestamp when the folder was last updated. */
	updated_at?: string | null;
};

export type LettaGoogleAIModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response schema for the model. */
	response_schema?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The temperature of the model. */
	temperature?: number | null;
	/** The thinking configuration for the model. */
	thinking_config?: {
		/** Whether to include thoughts in the model's response. */
		include_thoughts?: boolean | null;
		/** The thinking budget for the model. */
		thinking_budget?: number | null;
	} | null;
};

export type LettaGoogleVertexModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response schema for the model. */
	response_schema?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The temperature of the model. */
	temperature?: number | null;
	/** The thinking configuration for the model. */
	thinking_config?: {
		/** Whether to include thoughts in the model's response. */
		include_thoughts?: boolean | null;
		/** The thinking budget for the model. */
		thinking_budget?: number | null;
	} | null;
};

/** Groq model configuration (OpenAI-compatible). */
export type LettaGroqModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response format for the model. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The temperature of the model. */
	temperature?: number | null;
};

/** Representation of an agent's internal reasoning where reasoning content has been hidden from the response. Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message state (Literal["redacted",… */
export type LettaHiddenReasoningMessage = {
	id?: string | null;
	date?: string | null;
	state?: string | null;
	hidden_reasoning?: string | null;
	is_err?: boolean | null;
	/** The type of the message. */
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	step_id?: string | null;
};

export type LettaImageContent = {
	/** The source of the image. */
	source?:
		| (
				| {
						/** The URL of the image. */
						url?: string | null;
						/** The source type for the image. */
						type?: string | null;
				  }
				| {
						/** The base64 encoded image data. */
						data?: string | null;
						/** The media type for the image. */
						media_type?: string | null;
						/** What level of detail to use when processing and understanding the image (low, high, or auto to let the model decide) */
						detail?: string | null;
						/** The source type for the image. */
						type?: string | null;
				  }
				| {
						/** The unique identifier of the image file persisted in storage. */
						file_id?: string | null;
						/** The base64 encoded image data. */
						data?: string | null;
						/** What level of detail to use when processing and understanding the image (low, high, or auto to let the model decide) */
						detail?: string | null;
						/** The media type for the image. */
						media_type?: string | null;
						/** The source type for the image. */
						type?: string | null;
				  }
		  )
		| null;
	/** The type of the message. */
	type?: string | null;
};

/** Represents the initial tool rule configuration. */
export type LettaInitToolRule = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** Optional prefilled arguments for this tool. When present, these values will override any LLM-provided arguments with the same keys during invocation. Keys must match the tool's parameter names and values must satisfy the tool's JSON schema. Supports partial prefill; non-overlapping parameters… */
	args?: Record<string, LettaJsonValue> | null;
	/** Optional template string (ignored). Rendering uses fast built-in formatting for performance. */
	prompt_template?: string | null;
	type?: string | null;
};

/** Letta's internal representation of a message. Includes methods to convert to/from LLM provider formats. Attributes: id (str): The unique identifier of the message. role (MessageRole): The role of the participant. text (str): The text of the message. user_id (str): The unique identifier of the… */
export type LettaInternalMessage = {
	/** The human-friendly ID of the Message */
	id?: string | null;
	/** The role of the participant. */
	role?: LettaMessageRole | null;
	/** The unique identifier of the agent. */
	agent_id?: string | null;
	/** The id of the approval request if this message is associated with a tool call request. */
	approval_request_id?: string | null;
	/** The list of approvals for this message. */
	approvals?: Array<
		| LettaApprovalReturn
		| {
				/** Whether the tool has been approved */
				approve?: boolean | null;
				/** The ID of the tool call that corresponds to this approval */
				tool_call_id?: string | null;
				/** An optional explanation for the provided approval status */
				reason?: string | null;
				/** The message type to be created. */
				type?: string | null;
		  }
	> | null;
	/** Whether tool call is approved. */
	approve?: boolean | null;
	/** The id of the LLMBatchItem that this message is associated with */
	batch_item_id?: string | null;
	/** The content of the message. */
	content?: Array<
		| LettaTextContent
		| LettaImageContent
		| LettaToolCallContent
		| LettaToolReturnContent
		| LettaReasoningContent
		| LettaRedactedReasoningContent
		| LettaOmittedReasoningContent
		| {
				/** The unique identifier for this reasoning step. */
				id?: string | null;
				/** Summaries of the reasoning content. */
				summary?: Array<{
					/** The index of the summary part. */
					index?: number | null;
					/** The text of the summary part. */
					text?: string | null;
				}> | null;
				/** The encrypted reasoning content. */
				encrypted_content?: string | null;
				/** Indicates this is a summarized reasoning step. */
				type?: string | null;
		  }
	> | null;
	/** The conversation this message belongs to */
	conversation_id?: string | null;
	/** The timestamp when the object was created. */
	created_at?: string | null;
	/** The id of the user that made this object. */
	created_by_id?: string | null;
	/** The reason the tool call request was denied. */
	denial_reason?: string | null;
	/** The multi-agent group that the message was sent in */
	group_id?: string | null;
	/** Whether this message is part of an error step. Used only for debugging purposes. */
	is_err?: boolean | null;
	/** The id of the user that made this object. */
	last_updated_by_id?: string | null;
	/** The model used to make the function call. */
	model?: string | null;
	/** For role user/assistant: the (optional) name of the participant. For role tool/function: the name of the function called. */
	name?: string | null;
	/** The offline threading id associated with this message */
	otid?: string | null;
	/** The id of the run that this message was created in. */
	run_id?: string | null;
	/** The id of the sender of the message, can be an identity id or agent id */
	sender_id?: string | null;
	/** The id of the step that this message was created in. */
	step_id?: string | null;
	/** The ID of the tool call. Only applicable for role tool. */
	tool_call_id?: string | null;
	/** The list of tool calls requested. Only applicable for role assistant. */
	tool_calls?: Array<{
		id?: string | null;
		/** The function that the model called. */
		function?: {
			arguments?: string | null;
			name?: string | null;
		} | null;
		type?: string | null;
	}> | null;
	/** Tool execution return information for prior tool calls */
	tool_returns?: Array<{
		/** The status of the tool call */
		status?: string | null;
		/** The function response - either a string or list of content parts (text/image) */
		func_response?:
			| (
					| string
					| Array<LettaTextContent | LettaImageContent>
					| LettaImageContent
			  )
			| null;
		/** Captured stderr from the tool invocation */
		stderr?: Array<string> | null;
		/** Captured stdout (e.g. prints, logs) from the tool invocation */
		stdout?: Array<string> | null;
		/** The ID for the tool call */
		tool_call_id?: LettaJsonValue | null;
	}> | null;
	/** The timestamp when the object was last updated. */
	updated_at?: string | null;
};

/** Response format for JSON object responses. */
export type LettaJsonObjectResponseFormat = {
	/** The type of the response format. */
	type?: string | null;
};

/** Response format for JSON schema-based responses. */
export type LettaJsonSchemaResponseFormat = {
	/** The JSON schema of the response. */
	json_schema?: Record<string, LettaJsonValue> | null;
	/** The type of the response format. */
	type?: string | null;
};

export type LettaLettaAssistantMessageContentUnion = {
	/** The text content of the message. */
	text?: string | null;
	/** Stores a unique identifier for any reasoning associated with this text content. */
	signature?: string | null;
	/** The type of the message. */
	type?: string | null;
};

/** Response object from an agent interaction, consisting of the new messages generated by the agent and usage statistics. The type of the returned messages can be either `Message` or `LettaMessage`, depending on what was specified in the request. Attributes: messages (List[Union[Message,… */
export type LettaLettaResponse = {
	/** The messages returned by the agent. */
	messages?: Array<LettaMessage> | null;
	/** The stop reason from Letta indicating why agent loop stopped execution. */
	stop_reason?: {
		/** The reason why execution stopped. */
		stop_reason?: LettaStopReasonType | null;
		/** The type of the message. */
		message_type?: string | null;
	} | null;
	/** The usage statistics of the agent. */
	usage?: {
		/** The number of input tokens written to cache (Anthropic only). None if not reported by provider. */
		cache_write_tokens?: number | null;
		/** The number of input tokens served from cache. None if not reported by provider. */
		cached_input_tokens?: number | null;
		/** The number of tokens generated by the agent. */
		completion_tokens?: number | null;
		/** Estimate of tokens currently in the context window. */
		context_tokens?: number | null;
		message_type?: string | null;
		/** The number of tokens in the prompt. */
		prompt_tokens?: number | null;
		/** The number of reasoning/thinking tokens generated. None if not reported by provider. */
		reasoning_tokens?: number | null;
		/** The background task run IDs associated with the agent interaction */
		run_ids?: Array<string> | null;
		/** The number of steps taken by the agent. */
		step_count?: number | null;
		/** The total number of tokens processed by the agent. */
		total_tokens?: number | null;
	} | null;
	/** Log probabilities of the output tokens from the last LLM call. Only present if return_logprobs was enabled. */
	logprobs?: {
		content?: Array<{
			token?: string | null;
			logprob?: number | null;
			top_logprobs?: Array<{
				token?: string | null;
				logprob?: number | null;
				bytes?: Array<number> | null;
			}> | null;
			bytes?: Array<number> | null;
		}> | null;
		refusal?: Array<{
			token?: string | null;
			logprob?: number | null;
			top_logprobs?: Array<{
				token?: string | null;
				logprob?: number | null;
				bytes?: Array<number> | null;
			}> | null;
			bytes?: Array<number> | null;
		}> | null;
	} | null;
	/** Token data for all LLM generations in multi-turn agent interaction. Includes token IDs and logprobs for each assistant turn, plus tool result content. Only present if return_token_ids was enabled. Used for RL training with loss masking. */
	turns?: Array<{
		/** Role of this turn: 'assistant' for LLM generations (trainable), 'tool' for tool results (non-trainable). */
		role?: string | null;
		/** Text content. For tool turns, client tokenizes this with loss_mask=0. */
		content?: string | null;
		/** Token IDs from SGLang native endpoint. Only present for assistant turns. */
		output_ids?: Array<number> | null;
		/** Logprobs from SGLang: [[logprob, token_id, top_logprob_or_null], ...]. Only present for assistant turns. */
		output_token_logprobs?: Array<Array<LettaJsonValue>> | null;
		/** Name of the tool called. Only present for tool turns. */
		tool_name?: string | null;
	}> | null;
};

export type LettaLettaUserMessageContentUnion =
	| {
			/** The text content of the message. */
			text?: string | null;
			/** Stores a unique identifier for any reasoning associated with this text content. */
			signature?: string | null;
			/** The type of the message. */
			type?: string | null;
	  }
	| LettaImageContent;

/** Configuration for Language Model (LLM) connection and generation parameters. .. deprecated:: LLMConfig is deprecated and should not be used as an input or return type in API calls. Use the schemas in letta.schemas.model (ModelSettings, OpenAIModelSettings, etc.) instead. For conversion, use the… */
export type LettaLlmConfig = {
	/** The context window size for the model. */
	context_window?: number | null;
	/** LLM model name. */
	model?: string | null;
	/** The endpoint type for the model. */
	model_endpoint_type?: string | null;
	/** The framework compatibility type for the model. */
	compatibility_type?: string | null;
	/** A human-friendly display name for the model. */
	display_name?: string | null;
	/** The effort level for Anthropic models that support it (Opus 4.5+). Controls token spending and thinking behavior. Not setting this gives similar performance to 'high'. */
	effort?: string | null;
	/** Whether or not the model should use extended thinking if it is a 'reasoning' style model */
	enable_reasoner?: boolean | null;
	/** Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. From OpenAI: Number between -2.0 and 2.0. */
	frequency_penalty?: number | null;
	/** The handle for this config, in the format provider/model-name. */
	handle?: string | null;
	/** Configurable thinking budget for extended thinking. Used for enable_reasoner and also for Google Vertex models like Gemini 2.5 Flash. Minimum value is 1024 when used with enable_reasoner. */
	max_reasoning_tokens?: number | null;
	/** The maximum number of tokens to generate. If not set, the model will use its default value. */
	max_tokens?: number | null;
	/** The endpoint for the model. */
	model_endpoint?: string | null;
	/** The wrapper for the model. */
	model_wrapper?: string | null;
	/** Deprecated: Use model_settings to configure parallel tool calls instead. If set to True, enables parallel tool calling. Defaults to False. */
	parallel_tool_calls?: boolean | null;
	/** The provider category for the model. */
	provider_category?: LettaProviderCategory | null;
	/** The provider name for the model. */
	provider_name?: string | null;
	/** Puts 'inner_thoughts' as a kwarg in the function call if this is set to True. This helps with function calling performance and also the generation of inner thoughts. */
	put_inner_thoughts_in_kwargs?: boolean | null;
	/** The reasoning effort to use when generating text reasoning models */
	reasoning_effort?: string | null;
	/** The response format for the model's output. Supports text, json_object, and json_schema (structured outputs). Can be set via model_settings. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** Whether to return log probabilities of the output tokens. Useful for RL training. */
	return_logprobs?: boolean | null;
	/** Whether to return token IDs for all LLM generations via SGLang native endpoint. Required for multi-turn RL training with loss masking. Only works with SGLang provider. */
	return_token_ids?: boolean | null;
	/** Enable strict mode for tool calling. When true, tool schemas include strict: true and additionalProperties: false, guaranteeing tool outputs match JSON schemas. */
	strict?: boolean | null;
	/** The temperature to use when generating text with the model. A higher temperature will result in more random text. */
	temperature?: number | null;
	/** The cost tier for the model (cloud only). */
	tier?: string | null;
	/** SGLang tool call parser name (e.g. 'glm47', 'qwen25', 'hermes'). Used by the SGLang native adapter to parse tool calls from raw model output. */
	tool_call_parser?: string | null;
	/** Number of most likely tokens to return at each position (0-20). Requires return_logprobs=True. */
	top_logprobs?: number | null;
	/** Soft control for how verbose model output should be, used for GPT-5 models. */
	verbosity?: string | null;
};

/** Represents a tool rule configuration which constrains the total number of times this tool can be invoked in a single step. */
export type LettaMaxCountPerStepToolRule = {
	/** The max limit for the total number of times this tool can be invoked in a single step. */
	max_count_limit?: number | null;
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** Optional template string (ignored). */
	prompt_template?: string | null;
	type?: string | null;
};

/** A message generated by the system. Never streamed back on a response, only used for cursor pagination. Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message content (str): The message… */
export type LettaMessage =
	| {
			id?: string | null;
			/** The message content sent by the system */
			content?: string | null;
			date?: string | null;
			is_err?: boolean | null;
			/** The type of the message. */
			message_type?: string | null;
			name?: string | null;
			/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
			otid?: string | null;
			run_id?: string | null;
			sender_id?: string | null;
			seq_id?: number | null;
			step_id?: string | null;
	  }
	| LettaUserMessage
	| LettaReasoningMessage
	| LettaHiddenReasoningMessage
	| LettaToolCallMessage
	| LettaToolReturnMessage
	| LettaAssistantMessage
	| LettaApprovalRequestMessage
	| LettaApprovalResponseMessage
	| LettaSummaryMessage
	| LettaEventMessage;

export type LettaMessageRole = string;

export type LettaMessageType = string;

export type LettaNpmRequirement = {
	/** Name of the npm package. */
	name?: string | null;
	/** Optional version of the package, following semantic versioning. */
	version?: string | null;
};

/** A placeholder for reasoning content we know is present, but isn't returned by the provider (e.g. OpenAI GPT-5 on ChatCompletions) */
export type LettaOmittedReasoningContent = {
	/** A unique identifier for this reasoning step. */
	signature?: string | null;
	/** Indicates this is an omitted reasoning step. */
	type?: string | null;
};

export type LettaOpenAIModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The reasoning configuration for the model. */
	reasoning?: {
		/** The reasoning effort to use when generating text reasoning models */
		reasoning_effort?: string | null;
	} | null;
	/** The response format for the model. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
	strict?: boolean | null;
	/** The temperature of the model. */
	temperature?: number | null;
};

/** A ToolRule that only allows a child tool to be called if the parent has been called. */
export type LettaParentToolRule = {
	/** The children tools that can be invoked. */
	children?: Array<string> | null;
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** Optional template string (ignored). */
	prompt_template?: string | null;
	type?: string | null;
};

/** Representation of a passage, which is stored in archival memory. */
export type LettaPassage = {
	/** The embedding of the passage. */
	embedding?: Array<number> | null;
	/** Configuration for embedding model connection and processing parameters. */
	embedding_config?: LettaEmbeddingConfig | null;
	/** The text of the passage. */
	text?: string | null;
	/** The human-friendly ID of the Passage */
	id?: string | null;
	/** The unique identifier of the archive containing this passage. */
	archive_id?: string | null;
	/** The creation date of the passage. */
	created_at?: string | null;
	/** The id of the user that made this object. */
	created_by_id?: string | null;
	/** The unique identifier of the file associated with the passage. */
	file_id?: string | null;
	/** The name of the file (only for source passages). */
	file_name?: string | null;
	/** Whether this passage is deleted or not. */
	is_deleted?: boolean | null;
	/** The id of the user that made this object. */
	last_updated_by_id?: string | null;
	/** The metadata of the passage. */
	metadata?: Record<string, LettaJsonValue> | null;
	/** Deprecated: Use `folder_id` field instead. The data source of the passage. */
	source_id?: string | null;
	/** Tags associated with this passage. */
	tags?: Array<string> | null;
	/** The timestamp when the object was last updated. */
	updated_at?: string | null;
};

export type LettaPipRequirement = {
	/** Name of the pip package. */
	name?: string | null;
	/** Optional version of the package, following semantic versioning. */
	version?: string | null;
};

export type LettaProviderCategory = string;

/** Letta's internal representation of a provider trace. Attributes: id (str): The unique identifier of the provider trace. request_json (Dict[str, Any]): JSON content of the provider request. response_json (Dict[str, Any]): JSON content of the provider response. step_id (str): ID of the step that… */
export type LettaProviderTrace = {
	/** JSON content of the provider request */
	request_json?: Record<string, LettaJsonValue> | null;
	/** JSON content of the provider response */
	response_json?: Record<string, LettaJsonValue> | null;
	/** The human-friendly ID of the Provider_trace */
	id?: string | null;
	/** ID of the agent that generated this trace */
	agent_id?: string | null;
	/** Tags associated with the agent for filtering */
	agent_tags?: Array<string> | null;
	/** Billing context for LLM request cost tracking. */
	billing_context?: {
		/** Cost source: 'quota' or 'credits' */
		cost_source?: string | null;
		/** Customer ID for billing records */
		customer_id?: string | null;
		/** Subscription tier */
		plan_type?: string | null;
	} | null;
	/** Type of call (agent_step, summarization, etc.) */
	call_type?: string | null;
	/** Compaction/summarization settings (summarization calls only) */
	compaction_settings?: Record<string, LettaJsonValue> | null;
	/** The timestamp when the object was created. */
	created_at?: string | null;
	/** The id of the user that made this object. */
	created_by_id?: string | null;
	/** The id of the user that made this object. */
	last_updated_by_id?: string | null;
	/** LLM request latency in milliseconds */
	latency_ms?: number | null;
	/** LLM configuration used for this call (non-summarization calls only) */
	llm_config?: Record<string, LettaJsonValue> | null;
	/** ID of the organization */
	org_id?: string | null;
	/** ID of the run this trace is associated with */
	run_id?: string | null;
	/** Source service that generated this trace (memgpt-server, lettuce-py) */
	source?: string | null;
	/** ID of the step that this trace is associated with */
	step_id?: string | null;
	/** The timestamp when the object was last updated. */
	updated_at?: string | null;
};

export type LettaProviderType = string;

/** Sent via the Anthropic Messages API */
export type LettaReasoningContent = {
	/** Whether the reasoning content was generated by a reasoner model that processed this step. */
	is_native?: boolean | null;
	/** The intermediate reasoning or thought process content. */
	reasoning?: string | null;
	/** A unique identifier for this reasoning step. */
	signature?: string | null;
	/** Indicates this is a reasoning/intermediate step. */
	type?: string | null;
};

/** Representation of an agent's internal reasoning. Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message source (Literal["reasoner_model", "non_reasoner_model"]): Whether the reasoning… */
export type LettaReasoningMessage = {
	id?: string | null;
	date?: string | null;
	reasoning?: string | null;
	is_err?: boolean | null;
	/** The type of the message. */
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	signature?: string | null;
	source?: string | null;
	step_id?: string | null;
};

/** Sent via the Anthropic Messages API */
export type LettaRedactedReasoningContent = {
	/** The redacted or filtered intermediate reasoning content. */
	data?: string | null;
	/** Indicates this is a redacted thinking step. */
	type?: string | null;
};

/** Represents a tool rule configuration where this tool must be called before the agent loop can exit. */
export type LettaRequiredBeforeExitToolRule = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** Optional template string (ignored). */
	prompt_template?: string | null;
	type?: string | null;
};

/** Represents a tool rule configuration which requires approval before the tool can be invoked. */
export type LettaRequiresApprovalToolRule = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** Optional template string (ignored). Rendering uses fast built-in formatting for performance. */
	prompt_template?: string | null;
	type?: string | null;
};

/** Representation of a run - a conversation or processing session for an agent. Runs track when agents process messages and maintain the relationship between agents, steps, and messages. */
export type LettaRun = {
	/** The human-friendly ID of the Run */
	id?: string | null;
	/** The unique identifier of the agent associated with the run. */
	agent_id?: string | null;
	/** Whether the run was created in background mode. */
	background?: boolean | null;
	/** The base template ID that the run belongs to. */
	base_template_id?: string | null;
	/** Optional error message from attempting to POST the callback endpoint. */
	callback_error?: string | null;
	/** Timestamp when the callback was last attempted. */
	callback_sent_at?: string | null;
	/** HTTP status code returned by the callback endpoint. */
	callback_status_code?: number | null;
	/** If set, POST to this URL when the run completes. */
	callback_url?: string | null;
	/** The timestamp when the run was completed. */
	completed_at?: string | null;
	/** The unique identifier of the conversation associated with the run. */
	conversation_id?: string | null;
	/** The timestamp when the run was created. */
	created_at?: string | null;
	/** Additional metadata for the run. */
	metadata?: Record<string, LettaJsonValue> | null;
	/** The request configuration for the run. */
	request_config?: {
		/** The name of the message argument in the designated message tool. */
		assistant_message_tool_kwarg?: string | null;
		/** The name of the designated message tool. */
		assistant_message_tool_name?: string | null;
		/** Only return specified message types in the response. If `None` (default) returns all messages. */
		include_return_message_types?: Array<LettaMessageType> | null;
		/** Whether the server should parse specific tool call arguments (default `send_message`) as `AssistantMessage` objects. */
		use_assistant_message?: boolean | null;
	} | null;
	/** The current status of the run. */
	status?: string | null;
	/** The reason why the run was stopped. */
	stop_reason?: LettaStopReasonType | null;
	/** Total run duration in nanoseconds */
	total_duration_ns?: number | null;
	/** Time to first token for a run in nanoseconds */
	ttft_ns?: number | null;
};

/** A Stdio MCP server */
export type LettaStdioMcpServer = {
	/** The arguments to pass to the command */
	args?: Array<string> | null;
	/** The command to run (MCP 'local' client will run this command) */
	command?: string | null;
	/** The name of the MCP server */
	server_name?: string | null;
	/** The human-friendly ID of the Mcp_server */
	id?: string | null;
	/** Environment variables to set */
	env?: Record<string, string> | null;
	mcp_server_type?: string | null;
};

export type LettaStep = {
	/** The id of the step. Assigned by the database. */
	id?: string | null;
	/** The ID of the agent that performed the step. */
	agent_id?: string | null;
	/** The number of input tokens written to cache (Anthropic only). None if not reported by provider. */
	cache_write_tokens?: number | null;
	/** The number of input tokens served from cache. None if not reported by provider. */
	cached_input_tokens?: number | null;
	/** The number of tokens generated by the agent during this step. */
	completion_tokens?: number | null;
	/** Detailed completion token breakdown (e.g., reasoning_tokens). */
	completion_tokens_details?: Record<string, LettaJsonValue> | null;
	/** The context window limit configured for this step. */
	context_window_limit?: number | null;
	/** Error details including message, traceback, and additional context */
	error_data?: Record<string, LettaJsonValue> | null;
	/** The type/class of the error that occurred */
	error_type?: string | null;
	/** The feedback for this step. Must be either 'positive' or 'negative'. */
	feedback?: string | null;
	/** The messages generated during this step. Deprecated: use `GET /v1/steps/{step_id}/messages` endpoint instead */
	messages?: Array<LettaInternalMessage> | null;
	/** The name of the model used for this step. */
	model?: string | null;
	/** The model endpoint url used for this step. */
	model_endpoint?: string | null;
	/** The model handle (e.g., 'openai/gpt-4o-mini') used for this step. */
	model_handle?: string | null;
	/** The surface that this agent step was initiated from. */
	origin?: string | null;
	/** The project that the agent that executed this step belongs to (cloud only). */
	project_id?: string | null;
	/** The number of tokens in the prompt during this step. */
	prompt_tokens?: number | null;
	/** Detailed prompt token breakdown (e.g., cached_tokens, cache_read_tokens, cache_creation_tokens). */
	prompt_tokens_details?: Record<string, LettaJsonValue> | null;
	/** The category of the provider used for this step. */
	provider_category?: string | null;
	/** The unique identifier of the provider that was configured for this step */
	provider_id?: string | null;
	/** The name of the provider used for this step. */
	provider_name?: string | null;
	/** The number of reasoning/thinking tokens generated. None if not reported by provider. */
	reasoning_tokens?: number | null;
	/** The API request log ID from cloud-api for correlating steps with API requests. */
	request_id?: string | null;
	/** The unique identifier of the run that this step belongs to. Only included for async calls. */
	run_id?: string | null;
	/** Status of a step execution */
	status?: string | null;
	/** The stop reason associated with the step. */
	stop_reason?: LettaStopReasonType | null;
	/** Metadata tags. */
	tags?: Array<string> | null;
	/** The unique identifier of the transaction that processed this step. */
	tid?: string | null;
	/** The total number of tokens processed by the agent during this step. */
	total_tokens?: number | null;
	/** The trace id of the agent step. */
	trace_id?: string | null;
};

export type LettaStopReasonType = string;

/** A message representing a summary of the conversation. Sent to the LLM as a user or system message depending on the provider. */
export type LettaSummaryMessage = {
	id?: string | null;
	date?: string | null;
	summary?: string | null;
	/** Statistics about a memory compaction operation. */
	compaction_stats?: {
		/** The model's context window size */
		context_window?: number | null;
		/** Number of messages after compaction */
		messages_count_after?: number | null;
		/** Number of messages before compaction */
		messages_count_before?: number | null;
		/** What triggered the compaction (e.g., 'context_window_exceeded', 'post_step_context_check') */
		trigger?: string | null;
		/** Token count after compaction (message tokens only, does not include tool definitions) */
		context_tokens_after?: number | null;
		/** Token count before compaction (from LLM usage stats, includes full context sent to LLM) */
		context_tokens_before?: number | null;
	} | null;
	is_err?: boolean | null;
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	step_id?: string | null;
};

/** Represents a terminal tool rule configuration where if this tool gets called, it must end the agent loop. */
export type LettaTerminalToolRule = {
	/** The name of the tool. Must exist in the database for the user's organization. */
	tool_name?: string | null;
	/** Optional template string (ignored). */
	prompt_template?: string | null;
	type?: string | null;
};

export type LettaTextContent = {
	/** The text content of the message. */
	text?: string | null;
	/** Stores a unique identifier for any reasoning associated with this text content. */
	signature?: string | null;
	/** The type of the message. */
	type?: string | null;
};

/** Response format for plain text responses. */
export type LettaTextResponseFormat = {
	/** The type of the response format. */
	type?: string | null;
};

/** Together AI model configuration (OpenAI-compatible). */
export type LettaTogetherModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response format for the model. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The temperature of the model. */
	temperature?: number | null;
};

/** Representation of a tool, which is a function that can be called by the agent. */
export type LettaTool = {
	/** The human-friendly ID of the Tool */
	id?: string | null;
	/** The args JSON schema of the function. */
	args_json_schema?: Record<string, LettaJsonValue> | null;
	/** The id of the user that made this Tool. */
	created_by_id?: string | null;
	/** Default value for whether or not executing this tool requires approval. */
	default_requires_approval?: boolean | null;
	/** The description of the tool. */
	description?: string | null;
	/** If set to True, then this tool will potentially be executed concurrently with other tools. Default False. */
	enable_parallel_execution?: boolean | null;
	/** The JSON schema of the function. */
	json_schema?: Record<string, LettaJsonValue> | null;
	/** The id of the user that made this Tool. */
	last_updated_by_id?: string | null;
	/** A dictionary of additional metadata for the tool. */
	metadata_?: Record<string, LettaJsonValue> | null;
	/** The name of the function. */
	name?: string | null;
	/** Optional list of npm packages required by this tool. */
	npm_requirements?: Array<LettaNpmRequirement> | null;
	/** Optional list of pip packages required by this tool. */
	pip_requirements?: Array<LettaPipRequirement> | null;
	/** The project id of the tool. */
	project_id?: string | null;
	/** The maximum number of characters in the response. */
	return_char_limit?: number | null;
	/** The source code of the function. */
	source_code?: string | null;
	/** The type of the source code. */
	source_type?: string | null;
	/** Metadata tags. */
	tags?: Array<string> | null;
	/** The type of the tool. */
	tool_type?: LettaToolType | null;
};

export type LettaToolCall = {
	arguments?: string | null;
	name?: string | null;
	tool_call_id?: string | null;
};

export type LettaToolCallContent = {
	/** A unique identifier for this specific tool call instance. */
	id?: string | null;
	/** The parameters being passed to the tool, structured as a dictionary of parameter names to values. */
	input?: Record<string, LettaJsonValue> | null;
	/** The name of the tool being called. */
	name?: string | null;
	/** Stores a unique identifier for any reasoning associated with this tool call. */
	signature?: string | null;
	/** Indicates this content represents a tool call event. */
	type?: string | null;
};

export type LettaToolCallDelta = {
	arguments?: string | null;
	name?: string | null;
	tool_call_id?: string | null;
};

/** A message representing a request to call a tool (generated by the LLM to trigger tool execution). Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message tool_call (Union[ToolCall,… */
export type LettaToolCallMessage = {
	id?: string | null;
	date?: string | null;
	tool_call?: (LettaToolCall | LettaToolCallDelta) | null;
	is_err?: boolean | null;
	/** The type of the message. */
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	step_id?: string | null;
	tool_calls?: (Array<LettaToolCall> | LettaToolCallDelta) | null;
};

export type LettaToolExecutionResult = {
	/** The status of the tool execution and return object */
	status?: string | null;
	/** Representation of an agent's state. This is the state of the agent at a given time, and is persisted in the DB backend. The state has all the information needed to recreate a persisted agent. */
	agent_state?: LettaAgentState | null;
	/** The function return object */
	func_return?: LettaJsonValue | null;
	/** The fingerprint of the config for the sandbox */
	sandbox_config_fingerprint?: string | null;
	/** Captured stderr from the function invocation */
	stderr?: Array<string> | null;
	/** Captured stdout (prints, logs) from function invocation */
	stdout?: Array<string> | null;
};

export type LettaToolReturn = {
	status?: string | null;
	tool_call_id?: string | null;
	/** The tool return value - either a string or list of content parts (text/image) */
	tool_return?: (Array<LettaTextContent | LettaImageContent> | string) | null;
	stderr?: Array<string> | null;
	stdout?: Array<string> | null;
	/** The message type to be created. */
	type?: string | null;
};

export type LettaToolReturnContent = {
	/** The content returned by the tool execution. */
	content?: string | null;
	/** Indicates whether the tool execution resulted in an error. */
	is_error?: boolean | null;
	/** References the ID of the ToolCallContent that initiated this tool call. */
	tool_call_id?: string | null;
	/** Indicates this content represents a tool return event. */
	type?: string | null;
};

/** A message representing the return value of a tool call (generated by Letta executing the requested tool). Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message tool_return (str): The… */
export type LettaToolReturnMessage = {
	id?: string | null;
	date?: string | null;
	status?: string | null;
	tool_call_id?: string | null;
	tool_return?: string | null;
	is_err?: boolean | null;
	/** The type of the message. */
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	stderr?: Array<string> | null;
	stdout?: Array<string> | null;
	step_id?: string | null;
	tool_returns?: Array<LettaToolReturn> | null;
};

/** Result from a tool search operation. */
export type LettaToolSearchResult = {
	/** Combined relevance score (RRF for hybrid mode). */
	combined_score?: number | null;
	/** The matched tool. */
	tool?: LettaTool | null;
	/** The embedded text content used for matching. */
	embedded_text?: string | null;
	/** Full-text search rank position. */
	fts_rank?: number | null;
	/** Vector search rank position. */
	vector_rank?: number | null;
};

export type LettaToolType = string;

/** A message sent by the user. Never streamed back on a response, only used for cursor pagination. Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message content (Union[str,… */
export type LettaUserMessage = {
	id?: string | null;
	/** The message content sent by the user (can be a string or an array of multi-modal content parts) */
	content?: (Array<LettaLettaUserMessageContentUnion> | string) | null;
	date?: string | null;
	is_err?: boolean | null;
	/** The type of the message. */
	message_type?: string | null;
	name?: string | null;
	/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
	otid?: string | null;
	run_id?: string | null;
	sender_id?: string | null;
	seq_id?: number | null;
	step_id?: string | null;
};

/** Supported vector database providers for archival memory */
export type LettaVectorDBProvider = string;

/** xAI model configuration (OpenAI-compatible). */
export type LettaXaiModelSettings = {
	/** The maximum number of tokens the model can generate. */
	max_output_tokens?: number | null;
	/** Whether to enable parallel tool calling. */
	parallel_tool_calls?: boolean | null;
	/** The type of the provider. */
	provider_type?: string | null;
	/** The response format for the model. */
	response_format?:
		| (
				| LettaTextResponseFormat
				| LettaJsonSchemaResponseFormat
				| LettaJsonObjectResponseFormat
		  )
		| null;
	/** The temperature of the model. */
	temperature?: number | null;
};

export type LettaOperationInputs = {
	'accessTokens.create': {
		/** The hostname of the client side application. Please specify the full URL including the protocol (http or https). */
		hostname: string;
		policy: Array<{
			id: string;
			access: Array<
				'read_messages' | 'write_messages' | 'read_agent' | 'write_agent'
			>;
			type: 'agent';
		}>;
		/** The expiration date of the token. If not provided, the token will expire in 5 minutes */
		expires_at?: string;
	};
	'accessTokens.delete': {
		token: string;
		body?: LettaJsonValue;
	};
	'accessTokens.list': {
		/** The agent ID to filter tokens by. If provided, only tokens for this agent will be returned. */
		agentId?: string;
		/** The number of tokens to return per page. Defaults to 10. */
		limit?: number;
		/** The offset for pagination. Defaults to 0. */
		offset?: number;
	};
	'agents.archives.attach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		archive_id: string;
	};
	'agents.archives.detach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		archive_id: string;
	};
	'agents.blocks.attach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The ID of the block in the format 'block-<uuid4>' */
		block_id: string;
	};
	'agents.blocks.detach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The ID of the block in the format 'block-<uuid4>' */
		block_id: string;
	};
	'agents.blocks.get': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		block_label: string;
	};
	'agents.blocks.list': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Cursor for pagination (block ID). Returns results relative to this ID in the specified sort order. Expected format: 'block-<uuid4>' */
		after?: string;
		/** Cursor for pagination (block ID). Returns results relative to this ID in the specified sort order. Expected format: 'block-<uuid4>' */
		before?: string;
		/** Maximum number of blocks to return */
		limit?: number;
		/** Sort order for blocks by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'agents.blocks.update': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		block_label: string;
		/** The base template id of the block. */
		base_template_id?: string;
		/** The id of the deployment. */
		deployment_id?: string;
		/** Description of the block. */
		description?: string;
		/** The id of the entity within the template. */
		entity_id?: string;
		/** If set to True, the block will be hidden. */
		hidden?: boolean;
		/** Whether the block is a template (e.g. saved human/persona options). */
		is_template?: boolean;
		/** Label of the block (e.g. 'human', 'persona') in the context window. */
		label?: string;
		/** Character limit of the block. */
		limit?: number;
		/** Metadata of the block. */
		metadata?: Record<string, LettaJsonValue>;
		/** Preserve the block on template migration. */
		preserve_on_migration?: boolean;
		/** The associated project id. */
		project_id?: string;
		/** Whether the agent has read-only access to the block. */
		read_only?: boolean;
		/** The tags to associate with the block. */
		tags?: Array<string>;
		/** The id of the template. */
		template_id?: string;
		/** Name of the block if it is a template. */
		template_name?: string;
		/** Value of the block. */
		value?: string;
	};
	'agents.create': {
		/** The type of agent. */
		agent_type?: LettaAgentTypeInput;
		/** Deprecated: No longer used. The base template id of the agent. */
		base_template_id?: string;
		/** The ids of the blocks used by the agent. */
		block_ids?: Array<string>;
		/** Configuration for conversation compaction / summarization. Per-model settings (temperature, max tokens, etc.) are derived from the default configuration for that handle. */
		compaction_settings?: {
			/** The maximum length of the summary in characters. If none, no clipping is performed. */
			clip_chars?: number;
			/** The type of summarization technique use. */
			mode?:
				| 'all'
				| 'sliding_window'
				| 'self_compact_all'
				| 'self_compact_sliding_window';
			/** Model handle to use for sliding_window/all summarization (format: provider/model-name). If None, uses lightweight provider-specific defaults. */
			model?: string;
			/** Optional model settings used to override defaults for the summarizer model. */
			model_settings?:
				| LettaOpenAIModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openai';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort to use when generating text reasoning models */
							reasoning_effort?:
								| 'none'
								| 'minimal'
								| 'low'
								| 'medium'
								| 'high'
								| 'xhigh';
						};
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| LettaAnthropicModelSettingsInput
				| LettaGoogleAIModelSettingsInput
				| LettaGoogleVertexModelSettingsInput
				| LettaAzureModelSettingsInput
				| LettaXaiModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'zai';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for GLM-4.5+ models. */
						thinking?: {
							/** If False, preserved thinking is used (recommended for agents). */
							clear_thinking?: boolean;
							/** Whether thinking is enabled or disabled. */
							type?: 'enabled' | 'disabled';
						};
				  }
				| {
						/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
						effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot_coding';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for the model. */
						thinking?: {
							/** The maximum number of tokens the model can use for extended thinking. */
							budget_tokens?: number;
							/** The type of thinking to use. */
							type?: 'enabled' | 'disabled';
						};
						/** Soft control for how verbose model output should be, used for GPT-5 models. */
						verbosity?: 'low' | 'medium' | 'high';
				  }
				| LettaGroqModelSettingsInput
				| LettaDeepseekModelSettingsInput
				| LettaTogetherModelSettingsInput
				| LettaBedrockModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'baseten';
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openrouter';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'chatgpt_oauth';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort level for GPT-5.x and o-series models. */
							reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
						};
						/** The temperature of the model. */
						temperature?: number;
				  };
			/** The prompt to use for summarization. If None, uses mode-specific default. */
			prompt?: string;
			/** Whether to include an acknowledgement post-prompt (helps prevent non-summary outputs). */
			prompt_acknowledgement?: boolean;
			/** The percentage of the context window to keep post-summarization (only used in sliding window modes). */
			sliding_window_percentage?: number;
		};
		/** The context window limit used by the agent. */
		context_window_limit?: number;
		/** The description of the agent. */
		description?: string;
		/** The embedding model handle used by the agent (format: provider/model-name). */
		embedding?: string;
		/** Deprecated: No longer used. The embedding chunk size used by the agent. */
		embedding_chunk_size?: number;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfigInput;
		/** Deprecated: Use `model` field to configure reasoning instead. Whether to enable internal extended thinking step for a reasoner model. */
		enable_reasoner?: boolean;
		/** If set to True, memory management will move to a background agent thread. */
		enable_sleeptime?: boolean;
		/** The ids of the folders used by the agent. */
		folder_ids?: Array<string>;
		/** Deprecated: please use the 'create agents from a template' endpoint instead. */
		from_template?: string;
		/** Deprecated: No longer used. If set to True, the agent will be hidden. */
		hidden?: boolean;
		/** The ids of the identities associated with this agent. */
		identity_ids?: Array<string>;
		/** If true, attaches the Letta base tool rules (e.g. deny all tools not explicitly allowed). */
		include_base_tool_rules?: boolean;
		/** If true, attaches the Letta core tools (e.g. core_memory related functions). */
		include_base_tools?: boolean;
		/** If true, automatically creates and attaches a default data source for this agent. */
		include_default_source?: boolean;
		/** The initial set of messages to put in the agent's in-context memory. */
		initial_message_sequence?: Array<LettaMessageCreateInput>;
		/** Configuration for Language Model (LLM) connection and generation parameters. .. deprecated:: LLMConfig is deprecated and should not be used as an input or return type in API calls. Use the schemas in letta.schemas.model (ModelSettings, OpenAIModelSettings, etc.) instead. For conversion, use the… */
		llm_config?: LettaLlmConfigInput;
		/** Maximum number of files that can be open at once for this agent. Setting this too high may exceed the context window, which will break the agent. */
		max_files_open?: number;
		/** Deprecated: Use `model` field to configure reasoning tokens instead. The maximum number of tokens to generate for reasoning step. */
		max_reasoning_tokens?: number;
		/** Deprecated: Use `model` field to configure max output tokens instead. The maximum number of tokens to generate, including reasoning step. */
		max_tokens?: number;
		/** The blocks to create in the agent's in-context memory. */
		memory_blocks?: Array<LettaCreateBlockInput>;
		/** Deprecated: Only relevant for creating agents from a template. Use the 'create agents from a template' endpoint instead. */
		memory_variables?: Record<string, string>;
		/** If set to True, the agent will not remember previous messages (though the agent will still retain state via core memory blocks and archival/recall memory). Not recommended unless you have an advanced use case. */
		message_buffer_autoclear?: boolean;
		/** The metadata of the agent. */
		metadata?: Record<string, LettaJsonValue>;
		/** The model handle for the agent to use (format: provider/model-name). */
		model?: string;
		/** The model settings for the agent. */
		model_settings?:
			| LettaOpenAIModelSettingsInput
			| Record<string, LettaJsonValue>
			| LettaAnthropicModelSettingsInput
			| LettaGoogleAIModelSettingsInput
			| LettaGoogleVertexModelSettingsInput
			| LettaAzureModelSettingsInput
			| LettaXaiModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'moonshot';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'zai';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** The temperature of the model. */
					temperature?: number;
					/** The thinking configuration for GLM-4.5+ models. */
					thinking?: {
						/** If False, preserved thinking is used (recommended for agents). */
						clear_thinking?: boolean;
						/** Whether thinking is enabled or disabled. */
						type?: 'enabled' | 'disabled';
					};
			  }
			| {
					/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
					effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'moonshot_coding';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
					/** The thinking configuration for the model. */
					thinking?: {
						/** The maximum number of tokens the model can use for extended thinking. */
						budget_tokens?: number;
						/** The type of thinking to use. */
						type?: 'enabled' | 'disabled';
					};
					/** Soft control for how verbose model output should be, used for GPT-5 models. */
					verbosity?: 'low' | 'medium' | 'high';
			  }
			| LettaGroqModelSettingsInput
			| LettaDeepseekModelSettingsInput
			| LettaTogetherModelSettingsInput
			| LettaBedrockModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'baseten';
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'openrouter';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'chatgpt_oauth';
					/** The reasoning configuration for the model. */
					reasoning?: {
						/** The reasoning effort level for GPT-5.x and o-series models. */
						reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
					};
					/** The temperature of the model. */
					temperature?: number;
			  };
		/** The name of the agent. */
		name?: string;
		/** Deprecated: Use `model_settings` to configure parallel tool calls instead. If set to True, enables parallel tool calling. */
		parallel_tool_calls?: boolean;
		/** The per-file view window character limit for this agent. Setting this too high may exceed the context window, which will break the agent. */
		per_file_view_window_char_limit?: number;
		/** Deprecated: Project should now be passed via the X-Project header instead of in the request body. If using the SDK, this can be done via the x_project parameter. */
		project?: string;
		/** Deprecated: No longer used. The id of the project the agent belongs to. */
		project_id?: string;
		/** Deprecated: Use `model` field to configure reasoning instead. Whether to enable reasoning for this agent. */
		reasoning?: boolean;
		/** Deprecated: Use `model_settings` field to configure response format instead. The response format for the agent. */
		response_format?:
			| LettaTextResponseFormatInput
			| LettaJsonSchemaResponseFormatInput
			| LettaJsonObjectResponseFormatInput;
		/** The environment variables for tool execution specific to this agent. */
		secrets?: Record<string, string>;
		/** Deprecated: Use `folder_ids` field instead. The ids of the sources used by the agent. */
		source_ids?: Array<string>;
		/** The system prompt used by the agent. */
		system?: string;
		/** The tags associated with the agent. */
		tags?: Array<string>;
		/** Deprecated: No longer used. */
		template?: boolean;
		/** Deprecated: No longer used. The id of the template the agent belongs to. */
		template_id?: string;
		/** The timezone of the agent (IANA format). */
		timezone?: string;
		/** Deprecated: Use `secrets` field instead. Environment variables for tool execution. */
		tool_exec_environment_variables?: Record<string, string>;
		/** The ids of the tools used by the agent. */
		tool_ids?: Array<string>;
		/** The tool rules governing the agent. */
		tool_rules?: Array<
			| LettaChildToolRuleInput
			| LettaInitToolRuleInput
			| LettaTerminalToolRuleInput
			| LettaConditionalToolRuleInput
			| LettaContinueToolRuleInput
			| LettaRequiredBeforeExitToolRuleInput
			| LettaMaxCountPerStepToolRuleInput
			| LettaParentToolRuleInput
			| LettaRequiresApprovalToolRuleInput
		>;
		/** The tools used by the agent. */
		tools?: Array<string>;
	};
	'agents.delete': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
	};
	'agents.exportFile': {
		agent_id: string;
		/** Conversation ID to export. If provided, uses messages from this conversation instead of the agent's global message history. */
		conversation_id?: string;
		max_steps?: number;
		/** If True, excludes all messages from the export. Useful for sharing agent configs without conversation history. */
		scrub_messages?: boolean;
		/** If True, exports using the legacy single-agent 'v1' format with inline tools/blocks. If False, exports using the new multi-entity 'v2' format, with separate agents, tools, blocks, files, etc. */
		use_legacy_format?: boolean;
	};
	'agents.files.close': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The ID of the file in the format 'file-<uuid4>' */
		file_id: string;
	};
	'agents.files.closeAll': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
	};
	'agents.files.list': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Cursor for pagination (file ID). Returns results relative to this ID in the specified sort order. Expected format: 'file-<uuid4>' */
		after?: string;
		/** Cursor for pagination (file ID). Returns results relative to this ID in the specified sort order. Expected format: 'file-<uuid4>' */
		before?: string;
		/** Pagination cursor from previous response (deprecated, use before/after) */
		cursor?: string;
		/** Filter by open status (true for open files, false for closed files) */
		is_open?: boolean;
		/** Maximum number of files to return */
		limit?: number;
		/** Sort order for files by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'agents.files.open': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The ID of the file in the format 'file-<uuid4>' */
		file_id: string;
	};
	'agents.folders.attach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
	};
	'agents.folders.detach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
	};
	'agents.folders.list': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Cursor for pagination (source ID). Returns results relative to this ID in the specified sort order. Expected format: 'source-<uuid4>' */
		after?: string;
		/** Cursor for pagination (source ID). Returns results relative to this ID in the specified sort order. Expected format: 'source-<uuid4>' */
		before?: string;
		/** Maximum number of sources to return */
		limit?: number;
		/** Sort order for sources by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'agents.get': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Specify which relational fields to include in the response. No relationships are included by default. */
		include?: Array<
			| 'agent.blocks'
			| 'agent.identities'
			| 'agent.managed_group'
			| 'agent.pending_approval'
			| 'agent.secrets'
			| 'agent.sources'
			| 'agent.tags'
			| 'agent.tools'
		>;
		/** Specify which relational fields (e.g., 'tools', 'sources', 'memory') to include in the response. If not provided, all relationships are loaded by default. Using this can optimize performance by reducing unnecessary joins.This is a legacy parameter, and no longer supported after 1.0.0 SDK versions. */
		include_relationships?: Array<string>;
	};
	'agents.identities.attach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		identity_id: string;
	};
	'agents.identities.detach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		identity_id: string;
	};
	'agents.importFile': {
		override_embedding_model?: string;
		/** The .af agent file to import. */
		file: FileInput;
		/** Model handle to use instead of the file's default model. */
		model?: string;
		/** Embedding handle to use instead of the file’s default. */
		embedding?: string;
		/** Replace tools that already exist with the same name. */
		override_existing_tools?: boolean;
		/** The project to import the agent into. */
		project_id?: string;
		/** Import the agent without its message history. */
		strip_messages?: boolean;
		/** Secrets as a JSON string, used by tools when they run. */
		secrets?: string;
		/** A name for the imported agent. */
		name?: string;
	};
	'agents.list': {
		/** Cursor for pagination */
		after?: string;
		/** Whether to sort agents oldest to newest (True) or newest to oldest (False, default) */
		ascending?: boolean;
		/** Search agents by base template ID */
		base_template_id?: string;
		/** Cursor for pagination */
		before?: string;
		/** Filter agents by the user who created them. */
		created_by_id?: string;
		/** Search agents by identifier keys */
		identifier_keys?: Array<string>;
		/** Search agents by identity ID */
		identity_id?: string;
		/** Specify which relational fields to include in the response. No relationships are included by default. */
		include?: Array<
			| 'agent.blocks'
			| 'agent.identities'
			| 'agent.managed_group'
			| 'agent.pending_approval'
			| 'agent.secrets'
			| 'agent.sources'
			| 'agent.tags'
			| 'agent.tools'
		>;
		/** Specify which relational fields (e.g., 'tools', 'sources', 'memory') to include in the response. If not provided, all relationships are loaded by default. Using this can optimize performance by reducing unnecessary joins.This is a legacy parameter, and no longer supported after 1.0.0 SDK versions. */
		include_relationships?: Array<string>;
		/** Filter agents by their last stop reason. */
		last_stop_reason?: LettaStopReasonTypeInput;
		/** Limit for pagination */
		limit?: number;
		/** If True, only returns agents that match ALL given tags. Otherwise, return agents that have ANY of the passed-in tags. */
		match_all_tags?: boolean;
		/** Name of the agent */
		name?: string;
		/** Sort order for agents by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at' | 'updated_at' | 'last_run_completion';
		/** Search agents by project ID - this will default to your default project on cloud */
		project_id?: string;
		/** Search agents by name */
		query_text?: string;
		/** Field to sort by. Options: 'created_at' (default), 'last_run_completion' */
		sort_by?: string;
		/** List of tags to filter agents by */
		tags?: Array<string>;
		/** Search agents by template ID */
		template_id?: string;
	};
	'agents.messages.cancel': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Optional list of run IDs to cancel */
		run_ids?: Array<string>;
	};
	'agents.messages.compact': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Configuration for conversation compaction / summarization. Per-model settings (temperature, max tokens, etc.) are derived from the default configuration for that handle. */
		compaction_settings?: {
			/** The maximum length of the summary in characters. If none, no clipping is performed. */
			clip_chars?: number;
			/** The type of summarization technique use. */
			mode?:
				| 'all'
				| 'sliding_window'
				| 'self_compact_all'
				| 'self_compact_sliding_window';
			/** Model handle to use for sliding_window/all summarization (format: provider/model-name). If None, uses lightweight provider-specific defaults. */
			model?: string;
			/** Optional model settings used to override defaults for the summarizer model. */
			model_settings?:
				| LettaOpenAIModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openai';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort to use when generating text reasoning models */
							reasoning_effort?:
								| 'none'
								| 'minimal'
								| 'low'
								| 'medium'
								| 'high'
								| 'xhigh';
						};
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| LettaAnthropicModelSettingsInput
				| LettaGoogleAIModelSettingsInput
				| LettaGoogleVertexModelSettingsInput
				| LettaAzureModelSettingsInput
				| LettaXaiModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'zai';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for GLM-4.5+ models. */
						thinking?: {
							/** If False, preserved thinking is used (recommended for agents). */
							clear_thinking?: boolean;
							/** Whether thinking is enabled or disabled. */
							type?: 'enabled' | 'disabled';
						};
				  }
				| {
						/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
						effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot_coding';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for the model. */
						thinking?: {
							/** The maximum number of tokens the model can use for extended thinking. */
							budget_tokens?: number;
							/** The type of thinking to use. */
							type?: 'enabled' | 'disabled';
						};
						/** Soft control for how verbose model output should be, used for GPT-5 models. */
						verbosity?: 'low' | 'medium' | 'high';
				  }
				| LettaGroqModelSettingsInput
				| LettaDeepseekModelSettingsInput
				| LettaTogetherModelSettingsInput
				| LettaBedrockModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'baseten';
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openrouter';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'chatgpt_oauth';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort level for GPT-5.x and o-series models. */
							reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
						};
						/** The temperature of the model. */
						temperature?: number;
				  };
			/** The prompt to use for summarization. If None, uses mode-specific default. */
			prompt?: string;
			/** Whether to include an acknowledgement post-prompt (helps prevent non-summary outputs). */
			prompt_acknowledgement?: boolean;
			/** The percentage of the context window to keep post-summarization (only used in sliding window modes). */
			sliding_window_percentage?: number;
		};
	};
	'agents.messages.create': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The name of the message argument in the designated message tool. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		assistant_message_tool_kwarg?: string;
		/** The name of the designated message tool. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		assistant_message_tool_name?: string;
		/** Whether to process the request in the background (only used when streaming=true). */
		background?: boolean;
		/** Client-side skills available in the environment. These are rendered in the system prompt's available skills section alongside agent-scoped skills from MemFS. */
		client_skills?: Array<{
			/** Description of what the skill does */
			description: string;
			/** Path or location hint for the skill (e.g. skills/my-skill/SKILL.md) */
			location: string;
			/** The name of the skill */
			name: string;
		}>;
		/** Client-side tools that the agent can call. When the agent calls a client-side tool, execution pauses and returns control to the client to execute the tool and provide the result via a ToolReturn. */
		client_tools?: Array<{
			/** The name of the tool function */
			name: string;
			/** Description of what the tool does */
			description?: string;
			/** JSON Schema for the function parameters */
			parameters?: Record<string, LettaJsonValue>;
		}>;
		/** If set to True, enables reasoning before responses or tool calls from the agent. */
		enable_thinking?: string;
		/** If True, compaction events emit structured `SummaryMessage` and `EventMessage` types. If False (default), compaction messages are not included in the response. */
		include_compaction_messages?: boolean;
		/** Whether to include periodic keepalive ping messages in the stream to prevent connection timeouts (only used when streaming=true). */
		include_pings?: boolean;
		/** Only return specified message types in the response. If `None` (default) returns all messages. */
		include_return_message_types?: Array<LettaMessageTypeInput>;
		/** Syntactic sugar for a single user message. Equivalent to messages=[{'role': 'user', 'content': input}]. */
		input?:
			| string
			| Array<
					| LettaTextContentInput
					| LettaImageContentInput
					| LettaToolCallContentInput
					| LettaToolReturnContentInput
					| LettaReasoningContentInput
					| LettaRedactedReasoningContentInput
					| LettaOmittedReasoningContentInput
					| {
							/** The unique identifier for this reasoning step. */
							id: string;
							/** Summaries of the reasoning content. */
							summary: Array<{
								/** The index of the summary part. */
								index: number;
								/** The text of the summary part. */
								text: string;
							}>;
							/** The encrypted reasoning content. */
							encrypted_content?: string;
							/** Indicates this is a summarized reasoning step. */
							type?: 'summarized_reasoning';
					  }
			  >
			| LettaImageContentInput
			| LettaToolCallContentInput;
		/** Maximum number of steps the agent should take to process the request. */
		max_steps?: number;
		/** The messages to be sent to the agent. */
		messages?: Array<
			| LettaMessageCreateInput
			| LettaApprovalCreateInput
			| {
					/** The content of the message. */
					content: Array<LettaLettaMessageContentUnionInput> | string;
					/** The role of the participant. */
					role: 'user' | 'system' | 'assistant';
					/** The id of the LLMBatchItem that this message is associated with */
					batch_item_id?: string;
					/** The multi-agent group that the message was sent in */
					group_id?: string;
					/** The name of the participant. */
					name?: string;
					/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
					otid?: string;
					/** The id of the sender of the message, can be an identity id or agent id */
					sender_id?: string;
					/** The message type to be created. */
					type?: 'message';
			  }
		>;
		/** Model handle to use for this request instead of the agent's default model. This allows sending a message to a different model without changing the agent's configuration. */
		override_model?: string;
		/** Optional per-request system prompt override. When set, this is passed directly to the underlying LLM request and bypasses the persisted/compiled system message for that request. */
		override_system?: string;
		/** If True, returns log probabilities of the output tokens in the response. Useful for RL training. Only supported for OpenAI-compatible providers (including SGLang). */
		return_logprobs?: boolean;
		/** If True, returns token IDs and logprobs for ALL LLM generations in the agent step, not just the last one. Uses SGLang native /generate endpoint. Returns 'turns' field with TurnTokenData for each assistant/tool turn. Required for proper multi-turn RL training with loss masking. */
		return_token_ids?: boolean;
		/** Flag to determine if individual tokens should be streamed, rather than streaming per step (only used when streaming=true). */
		stream_tokens?: boolean;
		/** If True, returns a streaming response (Server-Sent Events). If False (default), returns a complete response. */
		streaming?: boolean;
		/** Number of most likely tokens to return at each position (0-20). Requires return_logprobs=True. */
		top_logprobs?: number;
		/** Whether the server should parse specific tool call arguments (default `send_message`) as `AssistantMessage` objects. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		use_assistant_message?: boolean;
	};
	'agents.messages.createAsync': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The name of the message argument in the designated message tool. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		assistant_message_tool_kwarg?: string;
		/** The name of the designated message tool. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		assistant_message_tool_name?: string;
		/** Optional callback URL to POST to when the job completes */
		callback_url?: string;
		/** Client-side skills available in the environment. These are rendered in the system prompt's available skills section alongside agent-scoped skills from MemFS. */
		client_skills?: Array<{
			/** Description of what the skill does */
			description: string;
			/** Path or location hint for the skill (e.g. skills/my-skill/SKILL.md) */
			location: string;
			/** The name of the skill */
			name: string;
		}>;
		/** Client-side tools that the agent can call. When the agent calls a client-side tool, execution pauses and returns control to the client to execute the tool and provide the result via a ToolReturn. */
		client_tools?: Array<{
			/** The name of the tool function */
			name: string;
			/** Description of what the tool does */
			description?: string;
			/** JSON Schema for the function parameters */
			parameters?: Record<string, LettaJsonValue>;
		}>;
		/** If set to True, enables reasoning before responses or tool calls from the agent. */
		enable_thinking?: string;
		/** If True, compaction events emit structured `SummaryMessage` and `EventMessage` types. If False (default), compaction messages are not included in the response. */
		include_compaction_messages?: boolean;
		/** Only return specified message types in the response. If `None` (default) returns all messages. */
		include_return_message_types?: Array<LettaMessageTypeInput>;
		/** Syntactic sugar for a single user message. Equivalent to messages=[{'role': 'user', 'content': input}]. */
		input?:
			| string
			| Array<
					| LettaTextContentInput
					| LettaImageContentInput
					| LettaToolCallContentInput
					| LettaToolReturnContentInput
					| LettaReasoningContentInput
					| LettaRedactedReasoningContentInput
					| LettaOmittedReasoningContentInput
					| {
							/** The unique identifier for this reasoning step. */
							id: string;
							/** Summaries of the reasoning content. */
							summary: Array<{
								/** The index of the summary part. */
								index: number;
								/** The text of the summary part. */
								text: string;
							}>;
							/** The encrypted reasoning content. */
							encrypted_content?: string;
							/** Indicates this is a summarized reasoning step. */
							type?: 'summarized_reasoning';
					  }
			  >
			| LettaImageContentInput
			| LettaToolCallContentInput;
		/** Maximum number of steps the agent should take to process the request. */
		max_steps?: number;
		/** The messages to be sent to the agent. */
		messages?: Array<
			| LettaMessageCreateInput
			| LettaApprovalCreateInput
			| {
					/** The content of the message. */
					content: Array<LettaLettaMessageContentUnionInput> | string;
					/** The role of the participant. */
					role: 'user' | 'system' | 'assistant';
					/** The id of the LLMBatchItem that this message is associated with */
					batch_item_id?: string;
					/** The multi-agent group that the message was sent in */
					group_id?: string;
					/** The name of the participant. */
					name?: string;
					/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
					otid?: string;
					/** The id of the sender of the message, can be an identity id or agent id */
					sender_id?: string;
					/** The message type to be created. */
					type?: 'message';
			  }
		>;
		/** Model handle to use for this request instead of the agent's default model. This allows sending a message to a different model without changing the agent's configuration. */
		override_model?: string;
		/** Optional per-request system prompt override. When set, this is passed directly to the underlying LLM request and bypasses the persisted/compiled system message for that request. */
		override_system?: string;
		/** If True, returns log probabilities of the output tokens in the response. Useful for RL training. Only supported for OpenAI-compatible providers (including SGLang). */
		return_logprobs?: boolean;
		/** If True, returns token IDs and logprobs for ALL LLM generations in the agent step, not just the last one. Uses SGLang native /generate endpoint. Returns 'turns' field with TurnTokenData for each assistant/tool turn. Required for proper multi-turn RL training with loss masking. */
		return_token_ids?: boolean;
		/** Number of most likely tokens to return at each position (0-20). Requires return_logprobs=True. */
		top_logprobs?: number;
		/** Whether the server should parse specific tool call arguments (default `send_message`) as `AssistantMessage` objects. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		use_assistant_message?: boolean;
	};
	'agents.messages.list': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		after?: string;
		/** The name of the message argument. */
		assistant_message_tool_kwarg?: string;
		/** The name of the designated message tool. */
		assistant_message_tool_name?: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		before?: string;
		/** Conversation ID to filter messages by. */
		conversation_id?: string;
		/** Group ID to filter messages by. */
		group_id?: string;
		/** Whether to include error messages and error statuses. For debugging purposes only. */
		include_err?: boolean;
		/** Message types to include in response. When null, all message types are returned. */
		include_return_message_types?: Array<LettaMessageTypeInput>;
		/** Maximum number of messages to return */
		limit?: number;
		/** Sort order for messages by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
		/** Whether to use assistant messages */
		use_assistant_message?: boolean;
	};
	'agents.messages.reset': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** If true, adds the default initial messages after resetting. */
		add_default_initial_messages?: boolean;
	};
	'agents.messages.stream': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The name of the message argument in the designated message tool. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		assistant_message_tool_kwarg?: string;
		/** The name of the designated message tool. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		assistant_message_tool_name?: string;
		/** Whether to process the request in the background (only used when streaming=true). */
		background?: boolean;
		/** Client-side skills available in the environment. These are rendered in the system prompt's available skills section alongside agent-scoped skills from MemFS. */
		client_skills?: Array<{
			/** Description of what the skill does */
			description: string;
			/** Path or location hint for the skill (e.g. skills/my-skill/SKILL.md) */
			location: string;
			/** The name of the skill */
			name: string;
		}>;
		/** Client-side tools that the agent can call. When the agent calls a client-side tool, execution pauses and returns control to the client to execute the tool and provide the result via a ToolReturn. */
		client_tools?: Array<{
			/** The name of the tool function */
			name: string;
			/** Description of what the tool does */
			description?: string;
			/** JSON Schema for the function parameters */
			parameters?: Record<string, LettaJsonValue>;
		}>;
		/** If set to True, enables reasoning before responses or tool calls from the agent. */
		enable_thinking?: string;
		/** If True, compaction events emit structured `SummaryMessage` and `EventMessage` types. If False (default), compaction messages are not included in the response. */
		include_compaction_messages?: boolean;
		/** Whether to include periodic keepalive ping messages in the stream to prevent connection timeouts (only used when streaming=true). */
		include_pings?: boolean;
		/** Only return specified message types in the response. If `None` (default) returns all messages. */
		include_return_message_types?: Array<LettaMessageTypeInput>;
		/** Syntactic sugar for a single user message. Equivalent to messages=[{'role': 'user', 'content': input}]. */
		input?:
			| string
			| Array<
					| LettaTextContentInput
					| LettaImageContentInput
					| LettaToolCallContentInput
					| LettaToolReturnContentInput
					| LettaReasoningContentInput
					| LettaRedactedReasoningContentInput
					| LettaOmittedReasoningContentInput
					| {
							/** The unique identifier for this reasoning step. */
							id: string;
							/** Summaries of the reasoning content. */
							summary: Array<{
								/** The index of the summary part. */
								index: number;
								/** The text of the summary part. */
								text: string;
							}>;
							/** The encrypted reasoning content. */
							encrypted_content?: string;
							/** Indicates this is a summarized reasoning step. */
							type?: 'summarized_reasoning';
					  }
			  >
			| LettaImageContentInput
			| LettaToolCallContentInput;
		/** Maximum number of steps the agent should take to process the request. */
		max_steps?: number;
		/** The messages to be sent to the agent. */
		messages?: Array<
			| LettaMessageCreateInput
			| LettaApprovalCreateInput
			| {
					/** The content of the message. */
					content: Array<LettaLettaMessageContentUnionInput> | string;
					/** The role of the participant. */
					role: 'user' | 'system' | 'assistant';
					/** The id of the LLMBatchItem that this message is associated with */
					batch_item_id?: string;
					/** The multi-agent group that the message was sent in */
					group_id?: string;
					/** The name of the participant. */
					name?: string;
					/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
					otid?: string;
					/** The id of the sender of the message, can be an identity id or agent id */
					sender_id?: string;
					/** The message type to be created. */
					type?: 'message';
			  }
		>;
		/** Model handle to use for this request instead of the agent's default model. This allows sending a message to a different model without changing the agent's configuration. */
		override_model?: string;
		/** Optional per-request system prompt override. When set, this is passed directly to the underlying LLM request and bypasses the persisted/compiled system message for that request. */
		override_system?: string;
		/** If True, returns log probabilities of the output tokens in the response. Useful for RL training. Only supported for OpenAI-compatible providers (including SGLang). */
		return_logprobs?: boolean;
		/** If True, returns token IDs and logprobs for ALL LLM generations in the agent step, not just the last one. Uses SGLang native /generate endpoint. Returns 'turns' field with TurnTokenData for each assistant/tool turn. Required for proper multi-turn RL training with loss masking. */
		return_token_ids?: boolean;
		/** Flag to determine if individual tokens should be streamed, rather than streaming per step (only used when streaming=true). */
		stream_tokens?: boolean;
		/** If True, returns a streaming response (Server-Sent Events). If False (default), returns a complete response. */
		streaming?: boolean;
		/** Number of most likely tokens to return at each position (0-20). Requires return_logprobs=True. */
		top_logprobs?: number;
		/** Whether the server should parse specific tool call arguments (default `send_message`) as `AssistantMessage` objects. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		use_assistant_message?: boolean;
	};
	'agents.passages.create': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Text to write to archival memory. */
		text: string;
		/** Optional timestamp for the memory (defaults to current UTC time). */
		created_at?: string;
		/** Optional list of tags to attach to the memory. */
		tags?: Array<string>;
	};
	'agents.passages.delete': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		memory_id: string;
	};
	'agents.passages.list': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Unique ID of the memory to start the query range at. */
		after?: string;
		/** Whether to sort passages oldest to newest (True, default) or newest to oldest (False) */
		ascending?: boolean;
		/** Unique ID of the memory to end the query range at. */
		before?: string;
		/** How many results to include in the response. */
		limit?: number;
		/** Search passages by text */
		search?: string;
	};
	'agents.passages.search': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** String to search for using semantic similarity */
		query: string;
		/** Filter results to passages created before this datetime */
		end_datetime?: string;
		/** Filter results to passages created after this datetime */
		start_datetime?: string;
		/** How to match tags - 'any' to match passages with any of the tags, 'all' to match only passages with all tags */
		tag_match_mode?: 'any' | 'all';
		/** Optional list of tags to filter search results */
		tags?: Array<string>;
		/** Maximum number of results to return. Uses system default if not specified */
		top_k?: number;
	};
	'agents.recompile': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** If True, do not persist changes; still returns the compiled system prompt. */
		dry_run?: boolean;
		/** If True, update the in-context memory last edit timestamp embedded in the system prompt. */
		update_timestamp?: boolean;
	};
	'agents.schedule.create': {
		agent_id: string;
		messages: Array<{
			content:
				| Array<
						| Array<
								| {
										text: string;
										signature?: string;
										type?: 'text';
								  }
								| {
										source: {
											data: string;
											media_type: string;
											detail?: string;
											type?: 'base64';
										};
										type: 'image';
								  }
						  >
						| string
				  >
				| string;
			role: 'user' | 'assistant' | 'system';
			name?: string;
			otid?: string;
			sender_id?: string;
			type?: 'message';
		}>;
		schedule:
			| {
					scheduled_at: number;
					type?: 'one-time';
			  }
			| {
					cron_expression: string;
					type: 'recurring';
			  };
		callback_url?: string;
		include_return_message_types?: Array<
			| 'system_message'
			| 'user_message'
			| 'assistant_message'
			| 'reasoning_message'
			| 'hidden_reasoning_message'
			| 'tool_call_message'
			| 'tool_return_message'
			| 'approval_request_message'
			| 'approval_response_message'
		>;
		max_steps?: number;
	};
	'agents.schedule.delete': {
		agent_id: string;
		scheduled_message_id: string;
	};
	'agents.schedule.get': {
		agent_id: string;
		scheduled_message_id: string;
	};
	'agents.schedule.list': {
		agent_id: string;
		after?: string;
		limit?: string;
	};
	'agents.tools.attach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The ID of the tool in the format 'tool-<uuid4>' */
		tool_id: string;
	};
	'agents.tools.detach': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The ID of the tool in the format 'tool-<uuid4>' */
		tool_id: string;
	};
	'agents.tools.list': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** Cursor for pagination (tool ID). Returns results relative to this ID in the specified sort order. Expected format: 'tool-<uuid4>' */
		after?: string;
		/** Cursor for pagination (tool ID). Returns results relative to this ID in the specified sort order. Expected format: 'tool-<uuid4>' */
		before?: string;
		/** Maximum number of tools to return */
		limit?: number;
		/** Sort order for tools by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'agents.tools.run': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		tool_name: string;
		/** Arguments to pass to the tool */
		args?: Record<string, LettaJsonValue>;
	};
	'agents.tools.updateApproval': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		tool_name: string;
		/** Whether the tool requires approval before execution */
		requires_approval: boolean;
	};
	'agents.update': {
		/** The ID of the agent in the format 'agent-<uuid4>' */
		agent_id: string;
		/** The base template id of the agent. */
		base_template_id?: string;
		/** The ids of the blocks used by the agent. */
		block_ids?: Array<string>;
		/** Configuration for conversation compaction / summarization. Per-model settings (temperature, max tokens, etc.) are derived from the default configuration for that handle. */
		compaction_settings?: {
			/** The maximum length of the summary in characters. If none, no clipping is performed. */
			clip_chars?: number;
			/** The type of summarization technique use. */
			mode?:
				| 'all'
				| 'sliding_window'
				| 'self_compact_all'
				| 'self_compact_sliding_window';
			/** Model handle to use for sliding_window/all summarization (format: provider/model-name). If None, uses lightweight provider-specific defaults. */
			model?: string;
			/** Optional model settings used to override defaults for the summarizer model. */
			model_settings?:
				| LettaOpenAIModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openai';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort to use when generating text reasoning models */
							reasoning_effort?:
								| 'none'
								| 'minimal'
								| 'low'
								| 'medium'
								| 'high'
								| 'xhigh';
						};
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| LettaAnthropicModelSettingsInput
				| LettaGoogleAIModelSettingsInput
				| LettaGoogleVertexModelSettingsInput
				| LettaAzureModelSettingsInput
				| LettaXaiModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'zai';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for GLM-4.5+ models. */
						thinking?: {
							/** If False, preserved thinking is used (recommended for agents). */
							clear_thinking?: boolean;
							/** Whether thinking is enabled or disabled. */
							type?: 'enabled' | 'disabled';
						};
				  }
				| {
						/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
						effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot_coding';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for the model. */
						thinking?: {
							/** The maximum number of tokens the model can use for extended thinking. */
							budget_tokens?: number;
							/** The type of thinking to use. */
							type?: 'enabled' | 'disabled';
						};
						/** Soft control for how verbose model output should be, used for GPT-5 models. */
						verbosity?: 'low' | 'medium' | 'high';
				  }
				| LettaGroqModelSettingsInput
				| LettaDeepseekModelSettingsInput
				| LettaTogetherModelSettingsInput
				| LettaBedrockModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'baseten';
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openrouter';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'chatgpt_oauth';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort level for GPT-5.x and o-series models. */
							reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
						};
						/** The temperature of the model. */
						temperature?: number;
				  };
			/** The prompt to use for summarization. If None, uses mode-specific default. */
			prompt?: string;
			/** Whether to include an acknowledgement post-prompt (helps prevent non-summary outputs). */
			prompt_acknowledgement?: boolean;
			/** The percentage of the context window to keep post-summarization (only used in sliding window modes). */
			sliding_window_percentage?: number;
		};
		/** The context window limit used by the agent. */
		context_window_limit?: number;
		/** The description of the agent. */
		description?: string;
		/** The embedding model handle used by the agent (format: provider/model-name). */
		embedding?: string;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfigInput;
		/** If set to True, memory management will move to a background agent thread. */
		enable_sleeptime?: boolean;
		/** The ids of the folders used by the agent. */
		folder_ids?: Array<string>;
		/** If set to True, the agent will be hidden. */
		hidden?: boolean;
		/** The ids of the identities associated with this agent. */
		identity_ids?: Array<string>;
		/** The timestamp when the agent last completed a run. */
		last_run_completion?: string;
		/** The duration in milliseconds of the agent's last run. */
		last_run_duration_ms?: number;
		/** The stop reason from the agent's last run. */
		last_stop_reason?: LettaStopReasonTypeInput;
		/** Configuration for Language Model (LLM) connection and generation parameters. .. deprecated:: LLMConfig is deprecated and should not be used as an input or return type in API calls. Use the schemas in letta.schemas.model (ModelSettings, OpenAIModelSettings, etc.) instead. For conversion, use the… */
		llm_config?: LettaLlmConfigInput;
		/** Maximum number of files that can be open at once for this agent. Setting this too high may exceed the context window, which will break the agent. */
		max_files_open?: number;
		/** Deprecated: Use `model` field to configure max output tokens instead. The maximum number of tokens to generate, including reasoning step. */
		max_tokens?: number;
		/** If set to True, the agent will not remember previous messages (though the agent will still retain state via core memory blocks and archival/recall memory). Not recommended unless you have an advanced use case. */
		message_buffer_autoclear?: boolean;
		/** The ids of the messages in the agent's in-context memory. */
		message_ids?: Array<string>;
		/** The metadata of the agent. */
		metadata?: Record<string, LettaJsonValue>;
		/** The model handle used by the agent (format: provider/model-name). */
		model?: string;
		/** The model settings for the agent. */
		model_settings?:
			| LettaOpenAIModelSettingsInput
			| Record<string, LettaJsonValue>
			| LettaAnthropicModelSettingsInput
			| LettaGoogleAIModelSettingsInput
			| LettaGoogleVertexModelSettingsInput
			| LettaAzureModelSettingsInput
			| LettaXaiModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'moonshot';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'zai';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** The temperature of the model. */
					temperature?: number;
					/** The thinking configuration for GLM-4.5+ models. */
					thinking?: {
						/** If False, preserved thinking is used (recommended for agents). */
						clear_thinking?: boolean;
						/** Whether thinking is enabled or disabled. */
						type?: 'enabled' | 'disabled';
					};
			  }
			| {
					/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
					effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'moonshot_coding';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
					/** The thinking configuration for the model. */
					thinking?: {
						/** The maximum number of tokens the model can use for extended thinking. */
						budget_tokens?: number;
						/** The type of thinking to use. */
						type?: 'enabled' | 'disabled';
					};
					/** Soft control for how verbose model output should be, used for GPT-5 models. */
					verbosity?: 'low' | 'medium' | 'high';
			  }
			| LettaGroqModelSettingsInput
			| LettaDeepseekModelSettingsInput
			| LettaTogetherModelSettingsInput
			| LettaBedrockModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'baseten';
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'openrouter';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'chatgpt_oauth';
					/** The reasoning configuration for the model. */
					reasoning?: {
						/** The reasoning effort level for GPT-5.x and o-series models. */
						reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
					};
					/** The temperature of the model. */
					temperature?: number;
			  };
		/** The name of the agent. */
		name?: string;
		/** Deprecated: Use `model_settings` to configure parallel tool calls instead. If set to True, enables parallel tool calling. */
		parallel_tool_calls?: boolean;
		/** The per-file view window character limit for this agent. Setting this too high may exceed the context window, which will break the agent. */
		per_file_view_window_char_limit?: number;
		/** The id of the project the agent belongs to. */
		project_id?: string;
		/** Deprecated: Use `model` field to configure reasoning instead. Whether to enable reasoning for this agent. */
		reasoning?: boolean;
		/** Deprecated: Use `model_settings` field to configure response format instead. The response format for the agent. */
		response_format?:
			| LettaTextResponseFormatInput
			| LettaJsonSchemaResponseFormatInput
			| LettaJsonObjectResponseFormatInput;
		/** The environment variables for tool execution specific to this agent. */
		secrets?: Record<string, string>;
		/** Deprecated: Use `folder_ids` field instead. The ids of the sources used by the agent. */
		source_ids?: Array<string>;
		/** The system prompt used by the agent. */
		system?: string;
		/** The tags associated with the agent. */
		tags?: Array<string>;
		/** The id of the template the agent belongs to. */
		template_id?: string;
		/** The timezone of the agent (IANA format). */
		timezone?: string;
		/** Deprecated: use `secrets` field instead */
		tool_exec_environment_variables?: Record<string, string>;
		/** The ids of the tools used by the agent. */
		tool_ids?: Array<string>;
		/** The tool rules governing the agent. */
		tool_rules?: Array<
			| LettaChildToolRuleInput
			| LettaInitToolRuleInput
			| LettaTerminalToolRuleInput
			| LettaConditionalToolRuleInput
			| LettaContinueToolRuleInput
			| LettaRequiredBeforeExitToolRuleInput
			| LettaMaxCountPerStepToolRuleInput
			| LettaParentToolRuleInput
			| LettaRequiresApprovalToolRuleInput
		>;
	};
	'archives.create': {
		name: string;
		description?: string;
		/** Embedding model handle for the archive */
		embedding?: string;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfigInput;
	};
	'archives.delete': {
		/** The ID of the archive in the format 'archive-<uuid4>' */
		archive_id: string;
	};
	'archives.get': {
		/** The ID of the archive in the format 'archive-<uuid4>' */
		archive_id: string;
	};
	'archives.list': {
		/** Cursor for pagination (archive ID). Returns results relative to this ID in the specified sort order. Expected format: 'archive-<uuid4>' */
		after?: string;
		/** Only archives attached to this agent ID */
		agent_id?: string;
		/** Cursor for pagination (archive ID). Returns results relative to this ID in the specified sort order. Expected format: 'archive-<uuid4>' */
		before?: string;
		/** Maximum number of archives to return */
		limit?: number;
		/** Filter by archive name (exact match) */
		name?: string;
		/** Sort order for archives by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'archives.passages.create': {
		/** The ID of the archive in the format 'archive-<uuid4>' */
		archive_id: string;
		/** The text content of the passage */
		text: string;
		/** Optional creation datetime for the passage (ISO 8601 format) */
		created_at?: string;
		/** Optional metadata for the passage */
		metadata?: Record<string, LettaJsonValue>;
		/** Optional tags for categorizing the passage */
		tags?: Array<string>;
	};
	'archives.passages.createMany': {
		/** The ID of the archive in the format 'archive-<uuid4>' */
		archive_id: string;
		/** Passages to create in the archive */
		passages: Array<{
			/** The text content of the passage */
			text: string;
			/** Optional creation datetime for the passage (ISO 8601 format) */
			created_at?: string;
			/** Optional metadata for the passage */
			metadata?: Record<string, LettaJsonValue>;
			/** Optional tags for categorizing the passage */
			tags?: Array<string>;
		}>;
	};
	'archives.passages.delete': {
		/** The ID of the archive in the format 'archive-<uuid4>' */
		archive_id: string;
		/** The ID of the passage in the format 'passage-<uuid4>' */
		passage_id: string;
	};
	'archives.update': {
		/** The ID of the archive in the format 'archive-<uuid4>' */
		archive_id: string;
		description?: string;
		name?: string;
	};
	'blocks.agents.list': {
		/** The ID of the block in the format 'block-<uuid4>' */
		block_id: string;
		/** Cursor for pagination (agent ID). Returns results relative to this ID in the specified sort order. Expected format: 'agent-<uuid4>' */
		after?: string;
		/** Cursor for pagination (agent ID). Returns results relative to this ID in the specified sort order. Expected format: 'agent-<uuid4>' */
		before?: string;
		/** Specify which relational fields to include in the response. No relationships are included by default. */
		include?: Array<
			| 'agent.blocks'
			| 'agent.identities'
			| 'agent.managed_group'
			| 'agent.pending_approval'
			| 'agent.secrets'
			| 'agent.sources'
			| 'agent.tags'
			| 'agent.tools'
		>;
		/** Specify which relational fields (e.g., 'tools', 'sources', 'memory') to include in the response. If not provided, all relationships are loaded by default. Using this can optimize performance by reducing unnecessary joins.This is a legacy parameter, and no longer supported after 1.0.0 SDK versions. */
		include_relationships?: Array<string>;
		/** Maximum number of agents to return */
		limit?: number;
		/** Sort order for agents by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'blocks.create': {
		/** Label of the block. */
		label: string;
		/** Value of the block. */
		value: string;
		/** The base template id of the block. */
		base_template_id?: string;
		/** The id of the deployment. */
		deployment_id?: string;
		/** Description of the block. */
		description?: string;
		/** The id of the entity within the template. */
		entity_id?: string;
		/** If set to True, the block will be hidden. */
		hidden?: boolean;
		is_template?: boolean;
		/** Character limit of the block. */
		limit?: number;
		/** Metadata of the block. */
		metadata?: Record<string, LettaJsonValue>;
		/** Preserve the block on template migration. */
		preserve_on_migration?: boolean;
		/** The associated project id. */
		project_id?: string;
		/** Whether the agent has read-only access to the block. */
		read_only?: boolean;
		/** The tags to associate with the block. */
		tags?: Array<string>;
		/** The id of the template. */
		template_id?: string;
		/** Name of the block if it is a template. */
		template_name?: string;
	};
	'blocks.delete': {
		/** The ID of the block in the format 'block-<uuid4>' */
		block_id: string;
	};
	'blocks.get': {
		/** The ID of the block in the format 'block-<uuid4>' */
		block_id: string;
	};
	'blocks.list': {
		/** Cursor for pagination (block ID). Returns results relative to this ID in the specified sort order. Expected format: 'block-<uuid4>' */
		after?: string;
		/** Cursor for pagination (block ID). Returns results relative to this ID in the specified sort order. Expected format: 'block-<uuid4>' */
		before?: string;
		/** Filter blocks by the exact number of connected agents. If provided, returns blocks that have exactly this number of connected agents. */
		connected_to_agents_count_eq?: Array<number>;
		/** Filter blocks by the number of connected agents. If provided, returns blocks that have more than this number of connected agents. */
		connected_to_agents_count_gt?: number;
		/** Filter blocks by the number of connected agents. If provided, returns blocks that have less than this number of connected agents. */
		connected_to_agents_count_lt?: number;
		/** Search blocks by description. If provided, returns blocks whose description matches the search query. This is a full-text search on block descriptions. */
		description_search?: string;
		/** Search agents by identifier keys */
		identifier_keys?: Array<string>;
		/** The ID of the identity in the format 'identity-<uuid4>' */
		identity_id?: string;
		/** Label to include (alphanumeric, hyphens, underscores, forward slashes) */
		label?: string;
		/** Search blocks by label. If provided, returns blocks whose label matches the search query. This is a full-text search on block labels. */
		label_search?: string;
		/** Number of blocks to return */
		limit?: number;
		/** If True, only returns blocks that match ALL given tags. Otherwise, return blocks that have ANY of the passed-in tags. */
		match_all_tags?: boolean;
		/** Name filter (alphanumeric, spaces, hyphens, underscores) */
		name?: string;
		/** Sort order for blocks by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
		/** Search blocks by project id */
		project_id?: string;
		/** List of tags to filter blocks by */
		tags?: Array<string>;
		/** Whether to include only templates */
		templates_only?: boolean;
		/** Search blocks by value. If provided, returns blocks whose value matches the search query. This is a full-text search on block values. */
		value_search?: string;
	};
	'blocks.update': {
		/** The ID of the block in the format 'block-<uuid4>' */
		block_id: string;
		/** The base template id of the block. */
		base_template_id?: string;
		/** The id of the deployment. */
		deployment_id?: string;
		/** Description of the block. */
		description?: string;
		/** The id of the entity within the template. */
		entity_id?: string;
		/** If set to True, the block will be hidden. */
		hidden?: boolean;
		/** Whether the block is a template (e.g. saved human/persona options). */
		is_template?: boolean;
		/** Label of the block (e.g. 'human', 'persona') in the context window. */
		label?: string;
		/** Character limit of the block. */
		limit?: number;
		/** Metadata of the block. */
		metadata?: Record<string, LettaJsonValue>;
		/** Preserve the block on template migration. */
		preserve_on_migration?: boolean;
		/** The associated project id. */
		project_id?: string;
		/** Whether the agent has read-only access to the block. */
		read_only?: boolean;
		/** The tags to associate with the block. */
		tags?: Array<string>;
		/** The id of the template. */
		template_id?: string;
		/** Name of the block if it is a template. */
		template_name?: string;
		/** Value of the block. */
		value?: string;
	};
	'client.health': Record<string, never>;
	'conversations.cancel': {
		/** The conversation identifier. Can be a conversation ID ('conv-<uuid4>'), 'default' for agent-direct mode (with agent_id parameter), or an agent ID ('agent-<uuid4>') for backwards compatibility (deprecated). */
		conversation_id: string;
		/** Agent ID for agent-direct mode with 'default' conversation */
		agent_id?: string;
	};
	'conversations.create': {
		/** The agent ID to create a conversation for */
		agent_id: string;
		/** The context window limit for this conversation (overrides agent's context window). */
		context_window_limit?: number;
		/** A generated description of the conversation used for search and bootstrap context. */
		description?: string;
		/** Whether the new conversation should be hidden from listings. */
		hidden?: boolean;
		/** The model handle for this conversation (overrides agent's model). Format: provider/model-name. */
		model?: string;
		/** The model settings for this conversation (overrides agent's model settings). */
		model_settings?:
			| LettaOpenAIModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'openai';
					/** The reasoning configuration for the model. */
					reasoning?: {
						/** The reasoning effort to use when generating text reasoning models */
						reasoning_effort?:
							| 'none'
							| 'minimal'
							| 'low'
							| 'medium'
							| 'high'
							| 'xhigh';
					};
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| LettaAnthropicModelSettingsInput
			| LettaGoogleAIModelSettingsInput
			| LettaGoogleVertexModelSettingsInput
			| LettaAzureModelSettingsInput
			| LettaXaiModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'moonshot';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'zai';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** The temperature of the model. */
					temperature?: number;
					/** The thinking configuration for GLM-4.5+ models. */
					thinking?: {
						/** If False, preserved thinking is used (recommended for agents). */
						clear_thinking?: boolean;
						/** Whether thinking is enabled or disabled. */
						type?: 'enabled' | 'disabled';
					};
			  }
			| {
					/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
					effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'moonshot_coding';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
					/** The thinking configuration for the model. */
					thinking?: {
						/** The maximum number of tokens the model can use for extended thinking. */
						budget_tokens?: number;
						/** The type of thinking to use. */
						type?: 'enabled' | 'disabled';
					};
					/** Soft control for how verbose model output should be, used for GPT-5 models. */
					verbosity?: 'low' | 'medium' | 'high';
			  }
			| LettaGroqModelSettingsInput
			| LettaDeepseekModelSettingsInput
			| LettaTogetherModelSettingsInput
			| LettaBedrockModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'baseten';
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'openrouter';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'chatgpt_oauth';
					/** The reasoning configuration for the model. */
					reasoning?: {
						/** The reasoning effort level for GPT-5.x and o-series models. */
						reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
					};
					/** The temperature of the model. */
					temperature?: number;
			  };
		/** A summary of the conversation. */
		summary?: string;
	};
	'conversations.delete': {
		/** The ID of the conv in the format 'conv-<uuid4>' */
		conversation_id: string;
	};
	'conversations.fork': {
		/** The conversation identifier. Can be a conversation ID ('conv-<uuid4>'), 'default' for agent-direct mode (with agent_id parameter), or an agent ID ('agent-<uuid4>') for backwards compatibility (deprecated). */
		conversation_id: string;
		/** Agent ID for agent-direct mode with 'default' conversation */
		agent_id?: string;
		/** Whether the forked conversation should be hidden from listings */
		hidden?: boolean;
		/** The ID of the message in the format 'message-<uuid4>' */
		message_id?: string;
	};
	'conversations.get': {
		/** The ID of the conv in the format 'conv-<uuid4>' */
		conversation_id: string;
	};
	'conversations.list': {
		/** Cursor for pagination (conv ID). Returns results relative to this ID in the specified sort order. Expected format: 'conv-<uuid4>' */
		after?: string;
		/** The agent ID to list conversations for (optional - returns all conversations if not provided) */
		agent_id?: string;
		/** Whether to return unarchived conversations only, archived conversations only, or all conversations */
		archive_status?: 'unarchived' | 'archived' | 'all';
		/** Maximum number of conversations to return */
		limit?: number;
		/** Sort order for conversations. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at' | 'last_run_completion' | 'last_message_at';
		/** Search for text within conversation summaries */
		summary_search?: string;
	};
	'conversations.messages.compact': {
		/** The conversation identifier. Can be a conversation ID ('conv-<uuid4>'), 'default' for agent-direct mode (with agent_id parameter), or an agent ID ('agent-<uuid4>') for backwards compatibility (deprecated). */
		conversation_id: string;
		/** Agent ID for agent-direct mode with 'default' conversation. Use with conversation_id='default' in the URL path. */
		agent_id?: string;
		/** Configuration for conversation compaction / summarization. Per-model settings (temperature, max tokens, etc.) are derived from the default configuration for that handle. */
		compaction_settings?: {
			/** The maximum length of the summary in characters. If none, no clipping is performed. */
			clip_chars?: number;
			/** The type of summarization technique use. */
			mode?:
				| 'all'
				| 'sliding_window'
				| 'self_compact_all'
				| 'self_compact_sliding_window';
			/** Model handle to use for sliding_window/all summarization (format: provider/model-name). If None, uses lightweight provider-specific defaults. */
			model?: string;
			/** Optional model settings used to override defaults for the summarizer model. */
			model_settings?:
				| LettaOpenAIModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openai';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort to use when generating text reasoning models */
							reasoning_effort?:
								| 'none'
								| 'minimal'
								| 'low'
								| 'medium'
								| 'high'
								| 'xhigh';
						};
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| LettaAnthropicModelSettingsInput
				| LettaGoogleAIModelSettingsInput
				| LettaGoogleVertexModelSettingsInput
				| LettaAzureModelSettingsInput
				| LettaXaiModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'zai';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for GLM-4.5+ models. */
						thinking?: {
							/** If False, preserved thinking is used (recommended for agents). */
							clear_thinking?: boolean;
							/** Whether thinking is enabled or disabled. */
							type?: 'enabled' | 'disabled';
						};
				  }
				| {
						/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
						effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot_coding';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for the model. */
						thinking?: {
							/** The maximum number of tokens the model can use for extended thinking. */
							budget_tokens?: number;
							/** The type of thinking to use. */
							type?: 'enabled' | 'disabled';
						};
						/** Soft control for how verbose model output should be, used for GPT-5 models. */
						verbosity?: 'low' | 'medium' | 'high';
				  }
				| LettaGroqModelSettingsInput
				| LettaDeepseekModelSettingsInput
				| LettaTogetherModelSettingsInput
				| LettaBedrockModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'baseten';
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openrouter';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'chatgpt_oauth';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort level for GPT-5.x and o-series models. */
							reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
						};
						/** The temperature of the model. */
						temperature?: number;
				  };
			/** The prompt to use for summarization. If None, uses mode-specific default. */
			prompt?: string;
			/** Whether to include an acknowledgement post-prompt (helps prevent non-summary outputs). */
			prompt_acknowledgement?: boolean;
			/** The percentage of the context window to keep post-summarization (only used in sliding window modes). */
			sliding_window_percentage?: number;
		};
	};
	'conversations.messages.create': {
		/** The conversation identifier. Can be a conversation ID ('conv-<uuid4>'), 'default' for agent-direct mode (with agent_id parameter), or an agent ID ('agent-<uuid4>') for backwards compatibility (deprecated). */
		conversation_id: string;
		/** Agent ID for agent-direct mode with 'default' conversation. Use with conversation_id='default' in the URL path. */
		agent_id?: string;
		/** The name of the message argument in the designated message tool. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		assistant_message_tool_kwarg?: string;
		/** The name of the designated message tool. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		assistant_message_tool_name?: string;
		/** Whether to process the request in the background (only used when streaming=true). */
		background?: boolean;
		/** Client-side skills available in the environment. These are rendered in the system prompt's available skills section alongside agent-scoped skills from MemFS. */
		client_skills?: Array<{
			/** Description of what the skill does */
			description: string;
			/** Path or location hint for the skill (e.g. skills/my-skill/SKILL.md) */
			location: string;
			/** The name of the skill */
			name: string;
		}>;
		/** Client-side tools that the agent can call. When the agent calls a client-side tool, execution pauses and returns control to the client to execute the tool and provide the result via a ToolReturn. */
		client_tools?: Array<{
			/** The name of the tool function */
			name: string;
			/** Description of what the tool does */
			description?: string;
			/** JSON Schema for the function parameters */
			parameters?: Record<string, LettaJsonValue>;
		}>;
		/** If set to True, enables reasoning before responses or tool calls from the agent. */
		enable_thinking?: string;
		/** If True, compaction events emit structured `SummaryMessage` and `EventMessage` types. If False (default), compaction messages are not included in the response. */
		include_compaction_messages?: boolean;
		/** Whether to include periodic keepalive ping messages in the stream to prevent connection timeouts (only used when streaming=true). */
		include_pings?: boolean;
		/** Only return specified message types in the response. If `None` (default) returns all messages. */
		include_return_message_types?: Array<LettaMessageTypeInput>;
		/** Syntactic sugar for a single user message. Equivalent to messages=[{'role': 'user', 'content': input}]. */
		input?:
			| string
			| Array<
					| LettaTextContentInput
					| LettaImageContentInput
					| LettaToolCallContentInput
					| LettaToolReturnContentInput
					| LettaReasoningContentInput
					| LettaRedactedReasoningContentInput
					| LettaOmittedReasoningContentInput
					| {
							/** The unique identifier for this reasoning step. */
							id: string;
							/** Summaries of the reasoning content. */
							summary: Array<{
								/** The index of the summary part. */
								index: number;
								/** The text of the summary part. */
								text: string;
							}>;
							/** The encrypted reasoning content. */
							encrypted_content?: string;
							/** Indicates this is a summarized reasoning step. */
							type?: 'summarized_reasoning';
					  }
			  >
			| LettaImageContentInput
			| LettaToolCallContentInput;
		/** Maximum number of steps the agent should take to process the request. */
		max_steps?: number;
		/** The messages to be sent to the agent. */
		messages?: Array<
			| LettaMessageCreateInput
			| LettaApprovalCreateInput
			| {
					/** The content of the message. */
					content: Array<LettaLettaMessageContentUnionInput> | string;
					/** The role of the participant. */
					role: 'user' | 'system' | 'assistant';
					/** The id of the LLMBatchItem that this message is associated with */
					batch_item_id?: string;
					/** The multi-agent group that the message was sent in */
					group_id?: string;
					/** The name of the participant. */
					name?: string;
					/** The offline threading id (OTID). Set by the client to deduplicate requests. Used for idempotency in background streaming mode — each message in a request must have a unique OTID. Retries of the same request should reuse the same OTIDs. */
					otid?: string;
					/** The id of the sender of the message, can be an identity id or agent id */
					sender_id?: string;
					/** The message type to be created. */
					type?: 'message';
			  }
		>;
		/** Model handle to use for this request instead of the agent's default model. This allows sending a message to a different model without changing the agent's configuration. */
		override_model?: string;
		/** Optional per-request system prompt override. When set, this is passed directly to the underlying LLM request and bypasses the persisted/compiled system message for that request. */
		override_system?: string;
		/** If True, returns log probabilities of the output tokens in the response. Useful for RL training. Only supported for OpenAI-compatible providers (including SGLang). */
		return_logprobs?: boolean;
		/** If True, returns token IDs and logprobs for ALL LLM generations in the agent step, not just the last one. Uses SGLang native /generate endpoint. Returns 'turns' field with TurnTokenData for each assistant/tool turn. Required for proper multi-turn RL training with loss masking. */
		return_token_ids?: boolean;
		/** Flag to determine if individual tokens should be streamed, rather than streaming per step (only used when streaming=true). */
		stream_tokens?: boolean;
		/** If True (default), returns a streaming response (Server-Sent Events). If False, returns a complete JSON response. */
		streaming?: boolean;
		/** Number of most likely tokens to return at each position (0-20). Requires return_logprobs=True. */
		top_logprobs?: number;
		/** Whether the server should parse specific tool call arguments (default `send_message`) as `AssistantMessage` objects. Still supported for legacy agent types, but deprecated for letta_v1_agent onward. */
		use_assistant_message?: boolean;
	};
	'conversations.messages.list': {
		/** The conversation identifier. Can be a conversation ID ('conv-<uuid4>'), 'default' for agent-direct mode (with agent_id parameter), or an agent ID ('agent-<uuid4>') for backwards compatibility (deprecated). */
		conversation_id: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		after?: string;
		/** Agent ID for agent-direct mode with 'default' conversation */
		agent_id?: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		before?: string;
		/** Group ID to filter messages by. */
		group_id?: string;
		/** Whether to include error messages and error statuses. For debugging purposes only. */
		include_err?: boolean;
		/** Message types to include in response. When null, all message types are returned. */
		include_return_message_types?: Array<LettaMessageTypeInput>;
		/** Maximum number of messages to return */
		limit?: number;
		/** Sort order for messages by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'conversations.messages.stream': {
		/** The conversation identifier. Can be a conversation ID ('conv-<uuid4>'), 'default' for agent-direct mode (with agent_id parameter), or an agent ID ('agent-<uuid4>') for backwards compatibility (deprecated). */
		conversation_id: string;
		/** Agent ID for agent-direct mode with 'default' conversation. Use with conversation_id='default' in the URL path. */
		agent_id?: string;
		/** Number of entries to read per batch. */
		batch_size?: number;
		/** Whether to include periodic keepalive ping messages in the stream to prevent connection timeouts. */
		include_pings?: boolean;
		/** Offline threading ID to look up the run_id. Bypasses active run lookup if run_id not provided. */
		otid?: string;
		/** Seconds to wait between polls when no new data. */
		poll_interval?: number;
		/** Run ID to stream directly, bypassing run lookup. Use for recovery from duplicate requests. */
		run_id?: string;
		/** Sequence id to use as a cursor for pagination. Response will start streaming after this chunk sequence id */
		starting_after?: number;
	};
	'conversations.recompile': {
		/** The conversation identifier. Can be a conversation ID ('conv-<uuid4>'), 'default' for agent-direct mode (with agent_id parameter), or an agent ID ('agent-<uuid4>') for backwards compatibility (deprecated). */
		conversation_id: string;
		/** If True, do not persist changes; still returns the compiled system prompt. */
		dry_run?: boolean;
		/** Agent ID for agent-direct mode with 'default' conversation. Use with conversation_id='default' in the URL path. */
		agent_id?: string;
		/** Configuration for conversation compaction / summarization. Per-model settings (temperature, max tokens, etc.) are derived from the default configuration for that handle. */
		compaction_settings?: {
			/** The maximum length of the summary in characters. If none, no clipping is performed. */
			clip_chars?: number;
			/** The type of summarization technique use. */
			mode?:
				| 'all'
				| 'sliding_window'
				| 'self_compact_all'
				| 'self_compact_sliding_window';
			/** Model handle to use for sliding_window/all summarization (format: provider/model-name). If None, uses lightweight provider-specific defaults. */
			model?: string;
			/** Optional model settings used to override defaults for the summarizer model. */
			model_settings?:
				| LettaOpenAIModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openai';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort to use when generating text reasoning models */
							reasoning_effort?:
								| 'none'
								| 'minimal'
								| 'low'
								| 'medium'
								| 'high'
								| 'xhigh';
						};
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| LettaAnthropicModelSettingsInput
				| LettaGoogleAIModelSettingsInput
				| LettaGoogleVertexModelSettingsInput
				| LettaAzureModelSettingsInput
				| LettaXaiModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'zai';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for GLM-4.5+ models. */
						thinking?: {
							/** If False, preserved thinking is used (recommended for agents). */
							clear_thinking?: boolean;
							/** Whether thinking is enabled or disabled. */
							type?: 'enabled' | 'disabled';
						};
				  }
				| {
						/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
						effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'moonshot_coding';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
						strict?: boolean;
						/** The temperature of the model. */
						temperature?: number;
						/** The thinking configuration for the model. */
						thinking?: {
							/** The maximum number of tokens the model can use for extended thinking. */
							budget_tokens?: number;
							/** The type of thinking to use. */
							type?: 'enabled' | 'disabled';
						};
						/** Soft control for how verbose model output should be, used for GPT-5 models. */
						verbosity?: 'low' | 'medium' | 'high';
				  }
				| LettaGroqModelSettingsInput
				| LettaDeepseekModelSettingsInput
				| LettaTogetherModelSettingsInput
				| LettaBedrockModelSettingsInput
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'baseten';
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'openrouter';
						/** The response format for the model. */
						response_format?:
							| LettaTextResponseFormatInput
							| LettaJsonSchemaResponseFormatInput
							| LettaJsonObjectResponseFormatInput;
						/** The temperature of the model. */
						temperature?: number;
				  }
				| {
						/** The maximum number of tokens the model can generate. */
						max_output_tokens?: number;
						/** Whether to enable parallel tool calling. */
						parallel_tool_calls?: boolean;
						/** The type of the provider. */
						provider_type?: 'chatgpt_oauth';
						/** The reasoning configuration for the model. */
						reasoning?: {
							/** The reasoning effort level for GPT-5.x and o-series models. */
							reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
						};
						/** The temperature of the model. */
						temperature?: number;
				  };
			/** The prompt to use for summarization. If None, uses mode-specific default. */
			prompt?: string;
			/** Whether to include an acknowledgement post-prompt (helps prevent non-summary outputs). */
			prompt_acknowledgement?: boolean;
			/** The percentage of the context window to keep post-summarization (only used in sliding window modes). */
			sliding_window_percentage?: number;
		};
	};
	'conversations.update': {
		/** The ID of the conv in the format 'conv-<uuid4>' */
		conversation_id: string;
		/** Whether the conversation is archived. */
		archived?: boolean;
		/** The context window limit for this conversation (overrides agent's context window). */
		context_window_limit?: number;
		/** A generated description of the conversation used for search and bootstrap context. */
		description?: string;
		/** Timestamp of the most recent message request sent to this conversation. */
		last_message_at?: string;
		/** The model handle for this conversation (overrides agent's model). Format: provider/model-name. */
		model?: string;
		/** The model settings for this conversation (overrides agent's model settings). */
		model_settings?:
			| LettaOpenAIModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'openai';
					/** The reasoning configuration for the model. */
					reasoning?: {
						/** The reasoning effort to use when generating text reasoning models */
						reasoning_effort?:
							| 'none'
							| 'minimal'
							| 'low'
							| 'medium'
							| 'high'
							| 'xhigh';
					};
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| LettaAnthropicModelSettingsInput
			| LettaGoogleAIModelSettingsInput
			| LettaGoogleVertexModelSettingsInput
			| LettaAzureModelSettingsInput
			| LettaXaiModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'moonshot';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'zai';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** The temperature of the model. */
					temperature?: number;
					/** The thinking configuration for GLM-4.5+ models. */
					thinking?: {
						/** If False, preserved thinking is used (recommended for agents). */
						clear_thinking?: boolean;
						/** Whether thinking is enabled or disabled. */
						type?: 'enabled' | 'disabled';
					};
			  }
			| {
					/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
					effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'moonshot_coding';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
					strict?: boolean;
					/** The temperature of the model. */
					temperature?: number;
					/** The thinking configuration for the model. */
					thinking?: {
						/** The maximum number of tokens the model can use for extended thinking. */
						budget_tokens?: number;
						/** The type of thinking to use. */
						type?: 'enabled' | 'disabled';
					};
					/** Soft control for how verbose model output should be, used for GPT-5 models. */
					verbosity?: 'low' | 'medium' | 'high';
			  }
			| LettaGroqModelSettingsInput
			| LettaDeepseekModelSettingsInput
			| LettaTogetherModelSettingsInput
			| LettaBedrockModelSettingsInput
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'baseten';
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'openrouter';
					/** The response format for the model. */
					response_format?:
						| LettaTextResponseFormatInput
						| LettaJsonSchemaResponseFormatInput
						| LettaJsonObjectResponseFormatInput;
					/** The temperature of the model. */
					temperature?: number;
			  }
			| {
					/** The maximum number of tokens the model can generate. */
					max_output_tokens?: number;
					/** Whether to enable parallel tool calling. */
					parallel_tool_calls?: boolean;
					/** The type of the provider. */
					provider_type?: 'chatgpt_oauth';
					/** The reasoning configuration for the model. */
					reasoning?: {
						/** The reasoning effort level for GPT-5.x and o-series models. */
						reasoning_effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
					};
					/** The temperature of the model. */
					temperature?: number;
			  };
		/** A summary of the conversation. */
		summary?: string;
	};
	'environments.get': {
		deviceId: string;
	};
	'environments.list': {
		after?: string;
		limit?: string;
		onlineOnly?: string;
		source?: 'local' | 'remote';
		userId?: string;
	};
	'environments.sendMessage': {
		connectionId: string;
		messages: Array<
			| {
					client_message_id: string;
					content:
						| string
						| Array<{
								text: string;
								type: 'text';
						  }>;
					role: 'user';
					otid?: string;
			  }
			| {
					approvals: Array<
						| {
								status: 'success' | 'error';
								tool_call_id: string;
								tool_return:
									| string
									| Array<{
											text: string;
											type: 'text';
									  }>;
								stderr?: Array<string>;
								stdout?: Array<string>;
								type?: 'tool';
						  }
						| {
								approve: boolean;
								tool_call_id: string;
								reason?: string;
								type?: 'approval';
								updated_input?: Record<string, LettaJsonValue>;
						  }
					>;
					type: 'approval';
			  }
		>;
		agentId?: string;
		conversationId?: string;
	};
	'folders.agents.list': {
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
		/** Cursor for pagination (agent ID). Returns results relative to this ID in the specified sort order. Expected format: 'agent-<uuid4>' */
		after?: string;
		/** Cursor for pagination (agent ID). Returns results relative to this ID in the specified sort order. Expected format: 'agent-<uuid4>' */
		before?: string;
		/** Maximum number of agents to return */
		limit?: number;
		/** Sort order for agents by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'folders.create': {
		/** The name of the source. */
		name: string;
		/** The description of the source. */
		description?: string;
		/** The handle for the embedding config used by the source. */
		embedding?: string;
		/** The chunk size of the embedding. */
		embedding_chunk_size?: number;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfigInput;
		/** Instructions for how to use the source. */
		instructions?: string;
		/** Metadata associated with the source. */
		metadata?: Record<string, LettaJsonValue>;
	};
	'folders.delete': {
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
	};
	'folders.files.delete': {
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
		/** The ID of the file in the format 'file-<uuid4>' */
		file_id: string;
	};
	'folders.files.get': {
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
		/** The ID of the file in the format 'file-<uuid4>' */
		file_id: string;
		/** Whether to include full file content */
		include_content?: boolean;
	};
	'folders.files.list': {
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
		/** Cursor for pagination (file ID). Returns results relative to this ID in the specified sort order. Expected format: 'file-<uuid4>' */
		after?: string;
		/** Cursor for pagination (file ID). Returns results relative to this ID in the specified sort order. Expected format: 'file-<uuid4>' */
		before?: string;
		/** Whether to include full file content */
		include_content?: boolean;
		/** Maximum number of files to return */
		limit?: number;
		/** Sort order for files by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'folders.files.upload': {
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
		/** How to handle duplicate filenames */
		duplicate_handling?: 'skip' | 'error' | 'suffix' | 'replace';
		/** Optional custom name to override the uploaded file's name */
		name?: string;
		/** The file to upload. */
		file: FileInput;
	};
	'folders.get': {
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
	};
	'folders.list': {
		/** Cursor for pagination (source ID). Returns results relative to this ID in the specified sort order. Expected format: 'source-<uuid4>' */
		after?: string;
		/** Cursor for pagination (source ID). Returns results relative to this ID in the specified sort order. Expected format: 'source-<uuid4>' */
		before?: string;
		/** Maximum number of folders to return */
		limit?: number;
		/** Folder name to filter by */
		name?: string;
		/** Sort order for folders by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'folders.update': {
		/** The ID of the source in the format 'source-<uuid4>' */
		folder_id: string;
		/** The description of the source. */
		description?: string;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfigInput;
		/** Instructions for how to use the source. */
		instructions?: string;
		/** Metadata associated with the source. */
		metadata?: Record<string, LettaJsonValue>;
		/** The name of the source. */
		name?: string;
	};
	'mcpServers.create': {
		/** The MCP server configuration (Stdio, SSE, or Streamable HTTP) */
		config:
			| LettaCreateStdioMcpServerInput
			| LettaCreateSseMcpServerInput
			| LettaCreateStreamableHTTPMcpServerInput;
		/** The name of the MCP server */
		server_name: string;
	};
	'mcpServers.delete': {
		mcp_server_id: string;
	};
	'mcpServers.get': {
		mcp_server_id: string;
	};
	'mcpServers.list': Record<string, never>;
	'mcpServers.refresh': {
		mcp_server_id: string;
		agent_id?: string;
	};
	'mcpServers.tools.get': {
		mcp_server_id: string;
		tool_id: string;
	};
	'mcpServers.tools.list': {
		mcp_server_id: string;
	};
	'mcpServers.tools.run': {
		mcp_server_id: string;
		tool_id: string;
		/** Arguments to pass to the tool */
		args?: Record<string, LettaJsonValue>;
	};
	'mcpServers.update': {
		mcp_server_id: string;
		/** The MCP server configuration updates (Stdio, SSE, or Streamable HTTP) */
		config:
			| LettaUpdateStdioMcpServerInput
			| LettaUpdateSseMcpServerInput
			| LettaUpdateStreamableHTTPMcpServerInput;
		/** The name of the MCP server */
		server_name?: string;
	};
	'messages.get': {
		/** The ID of the message in the format 'message-<uuid4>' */
		message_id: string;
	};
	'messages.list': {
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		after?: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		before?: string;
		/** Conversation ID to filter messages by */
		conversation_id?: string;
		/** Message types to include in response. When null, all message types are returned. */
		include_return_message_types?: Array<LettaMessageTypeInput>;
		/** Maximum number of messages to return */
		limit?: number;
		/** Sort order for messages by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
	};
	'messages.search': {
		/** Text query for full-text search */
		query: string;
		/** Filter messages by agent ID */
		agent_id?: string;
		/** Filter messages by conversation ID */
		conversation_id?: string;
		/** Filter messages created on or before this date */
		end_date?: string;
		/** Maximum number of results to return */
		limit?: number;
		/** Search mode to use */
		search_mode?: 'vector' | 'fts' | 'hybrid';
		/** Filter messages created after this date */
		start_date?: string;
	};
	'models.embeddings.list': Record<string, never>;
	'models.list': {
		provider_category?: Array<LettaProviderCategoryInput>;
		provider_name?: string;
		provider_type?: LettaProviderTypeInput;
	};
	'passages.search': {
		/** Filter passages by agent ID */
		agent_id?: string;
		/** Filter passages by archive ID */
		archive_id?: string;
		/** Filter results to passages created before this datetime */
		end_date?: string;
		/** Maximum number of results to return */
		limit?: number;
		/** Text query for semantic search */
		query?: string;
		/** Filter results to passages created after this datetime */
		start_date?: string;
		/** How to match tags - 'any' to match passages with any of the tags, 'all' to match only passages with all tags */
		tag_match_mode?: 'any' | 'all';
		/** Optional list of tags to filter search results */
		tags?: Array<string>;
	};
	'runs.get': {
		run_id: string;
	};
	'runs.list': {
		/** Filter for active runs. */
		active?: boolean;
		/** Cursor for pagination (run ID). Returns results relative to this ID in the specified sort order. Expected format: 'run-<uuid4>' */
		after?: string;
		/** The unique identifier of the agent associated with the run. */
		agent_id?: string;
		/** The unique identifiers of the agents associated with the run. Deprecated in favor of agent_id field. */
		agent_ids?: Array<string>;
		/** Whether to sort agents oldest to newest (True) or newest to oldest (False, default). Deprecated in favor of order field. */
		ascending?: boolean;
		/** If True, filters for runs that were created in background mode. */
		background?: boolean;
		/** Cursor for pagination (run ID). Returns results relative to this ID in the specified sort order. Expected format: 'run-<uuid4>' */
		before?: string;
		/** Filter runs by conversation ID. */
		conversation_id?: string;
		/** Maximum number of runs to return */
		limit?: number;
		/** Sort order for runs by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
		/** Filter runs by status. Can specify multiple statuses. */
		statuses?: Array<string>;
		/** Filter runs by stop reason. */
		stop_reason?: LettaStopReasonTypeInput;
	};
	'runs.messages.list': {
		run_id: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		after?: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		before?: string;
		/** Maximum number of messages to return */
		limit?: number;
		/** Sort order for messages by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'runs.messages.stream': {
		run_id: string;
		/** Agent ID for agent-direct mode with 'default' conversation. Use with conversation_id='default' in the URL path. */
		agent_id?: string;
		/** Number of entries to read per batch. */
		batch_size?: number;
		/** Whether to include periodic keepalive ping messages in the stream to prevent connection timeouts. */
		include_pings?: boolean;
		/** Offline threading ID to look up the run_id. Bypasses active run lookup if run_id not provided. */
		otid?: string;
		/** Seconds to wait between polls when no new data. */
		poll_interval?: number;
		/** Sequence id to use as a cursor for pagination. Response will start streaming after this chunk sequence id */
		starting_after?: number;
	};
	'runs.steps.list': {
		run_id: string;
		/** Cursor for pagination (step ID). Returns results relative to this ID in the specified sort order. Expected format: 'step-<uuid4>' */
		after?: string;
		/** Cursor for pagination (step ID). Returns results relative to this ID in the specified sort order. Expected format: 'step-<uuid4>' */
		before?: string;
		/** Maximum number of messages to return */
		limit?: number;
		/** Sort order for steps by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
	};
	'runs.trace.get': {
		run_id: string;
		/** Maximum number of spans to return */
		limit?: number;
	};
	'runs.usage.get': {
		run_id: string;
	};
	'steps.feedback.create': {
		/** The ID of the step in the format 'step-<uuid4>' */
		step_id: string;
		/** Whether this feedback is positive or negative */
		feedback?: 'positive' | 'negative';
		/** Feedback tags to add to the step */
		tags?: Array<string>;
	};
	'steps.get': {
		/** The ID of the step in the format 'step-<uuid4>' */
		step_id: string;
	};
	'steps.list': {
		/** Cursor for pagination (step ID). Returns results relative to this ID in the specified sort order. Expected format: 'step-<uuid4>' */
		after?: string;
		/** Filter by the ID of the agent that performed the step */
		agent_id?: string;
		/** Cursor for pagination (step ID). Returns results relative to this ID in the specified sort order. Expected format: 'step-<uuid4>' */
		before?: string;
		/** Return steps before this ISO datetime (e.g. "2025-01-29T15:01:19-08:00") */
		end_date?: string;
		/** Filter by feedback */
		feedback?: 'positive' | 'negative';
		/** Filter by whether steps have feedback (true) or not (false) */
		has_feedback?: boolean;
		/** Maximum number of steps to return */
		limit?: number;
		/** Filter by the name of the model used for the step */
		model?: string;
		/** Sort order for steps by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
		/** Filter by the project ID that is associated with the step (cloud only). */
		project_id?: string;
		/** Return steps after this ISO datetime (e.g. "2025-01-29T15:01:19-08:00") */
		start_date?: string;
		/** Filter by tags */
		tags?: Array<string>;
		/** Filter by trace ids returned by the server */
		trace_ids?: Array<string>;
	};
	'steps.messages.list': {
		/** The ID of the step in the format 'step-<uuid4>' */
		step_id: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		after?: string;
		/** Cursor for pagination (message ID). Returns results relative to this ID in the specified sort order. Expected format: 'message-<uuid4>' */
		before?: string;
		/** Maximum number of messages to return */
		limit?: number;
		/** Sort order for messages by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Sort by field */
		order_by?: 'created_at';
	};
	'steps.metrics.get': {
		/** The ID of the step in the format 'step-<uuid4>' */
		step_id: string;
	};
	'steps.trace.get': {
		/** The ID of the step in the format 'step-<uuid4>' */
		step_id: string;
	};
	'tags.list': {
		/** Tag cursor for pagination. Returns tags that come after this tag in the specified sort order */
		after?: string;
		/** Tag cursor for pagination. Returns tags that come before this tag in the specified sort order */
		before?: string;
		/** Maximum number of tags to return */
		limit?: number;
		/** Filter tags by name */
		name?: string;
		/** Sort order for tags. 'asc' for alphabetical order, 'desc' for reverse alphabetical order */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'name';
		/** Filter tags by text search. Deprecated, please use name field instead */
		query_text?: string;
	};
	'templates.agents.create': {
		template_version: string;
		/** The name of the agent, optional otherwise a random one will be assigned */
		agent_name?: string;
		/** The identity ids to assign to the agent */
		identity_ids?: Array<string>;
		/** Set an initial sequence of messages, if not provided, the agent will start with the default message sequence, if an empty array is provided, the agent will start with no messages */
		initial_message_sequence?: Array<{
			content: string;
			role: 'user' | 'system' | 'assistant';
			batch_item_id?: string;
			group_id?: string;
			name?: string;
			otid?: string;
			sender_id?: string;
		}>;
		/** The memory variables to assign to the agent */
		memory_variables?: Record<string, string>;
		/** The tags to assign to the agent */
		tags?: Array<string>;
		/** The tool variables to assign to the agent */
		tool_variables?: Record<string, string>;
	};
	'templates.create': {
		/** The type of template to create, currently only agent templates are supported */
		body:
			| {
					/** The ID of the agent to use as a template, can be from any project */
					agent_id: string;
					type: 'agent';
					/** Optional custom name for the template. If not provided, a random name will be generated. */
					name?: string;
			  }
			| {
					/** The agent file to use as a template, this should be a JSON file exported from the platform */
					agent_file: Record<string, LettaJsonValue>;
					type: 'agent_file';
					/** Optional custom name for the template. If not provided, a random name will be generated. */
					name?: string;
					/** If true, update existing custom tools source_code and json_schema (source_type cannot be changed) */
					update_existing_tools?: boolean;
			  };
	};
	'templates.delete': {
		template_name: string;
	};
	'templates.rollback': {
		template_name: string;
		/** The target version to rollback to (e.g., "1", "2", "latest"). Cannot be "current" or "dev". */
		version: string;
	};
	'templates.save': {
		template_name: string;
		/** Strategy for reconciling memory blocks during migration: "reconcile-all" deletes blocks not in the template, "preserve-deleted" keeps them. Defaults to "preserve-deleted". */
		block_reconciliation_strategy?: 'reconcile-all' | 'preserve-deleted';
		/** A message to describe the changes made in this template version */
		message?: string;
		/** If true, existing agents attached to this template will be migrated to the new template version */
		migrate_agents?: boolean;
		/** If true, the core memories will be preserved in the template version when migrating agents */
		preserve_core_memories_on_migration?: boolean;
		/** If true, the environment variables will be preserved in the template version when migrating agents */
		preserve_environment_variables_on_migration?: boolean;
		/** If true, existing agent folders/sources will be preserved and merged with template sources during migration. If false, agent sources will be replaced with template sources. */
		preserve_sources_on_migration?: boolean;
	};
	'templates.update': {
		template_name: string;
		/** The agent file to update the current template version from */
		agent_file_json: Record<string, LettaJsonValue>;
		/** If true, Letta will automatically save any changes as a version before updating the template */
		save_existing_changes?: boolean;
		/** If true, update existing custom tools source_code and json_schema (source_type cannot be changed) */
		update_existing_tools?: boolean;
	};
	'tools.create': {
		/** The source code of the function. */
		source_code: string;
		/** The args JSON schema of the function. */
		args_json_schema?: Record<string, LettaJsonValue>;
		/** Whether or not to require approval before executing this tool. */
		default_requires_approval?: boolean;
		/** The description of the tool. */
		description?: string;
		/** If set to True, then this tool will potentially be executed concurrently with other tools. Default False. */
		enable_parallel_execution?: boolean;
		/** The JSON schema of the function (auto-generated from source_code if not provided) */
		json_schema?: Record<string, LettaJsonValue>;
		/** Optional list of npm packages required by this tool. */
		npm_requirements?: Array<LettaNpmRequirementInput>;
		/** Optional list of pip packages required by this tool. */
		pip_requirements?: Array<LettaPipRequirementInput>;
		/** The maximum number of characters in the response. */
		return_char_limit?: number;
		/** The source type of the function. */
		source_type?: string;
		/** Metadata tags. */
		tags?: Array<string>;
	};
	'tools.delete': {
		/** The ID of the tool in the format 'tool-<uuid4>' */
		tool_id: string;
	};
	'tools.get': {
		/** The ID of the tool in the format 'tool-<uuid4>' */
		tool_id: string;
	};
	'tools.list': {
		/** Cursor for pagination (tool ID). Returns results relative to this ID in the specified sort order. Expected format: 'tool-<uuid4>' */
		after?: string;
		/** Cursor for pagination (tool ID). Returns results relative to this ID in the specified sort order. Expected format: 'tool-<uuid4>' */
		before?: string;
		/** Tool type(s) to exclude - accepts repeated params or comma-separated values */
		exclude_tool_types?: Array<string>;
		/** Maximum number of tools to return */
		limit?: number;
		/** Filter by single tool name */
		name?: string;
		/** Filter by specific tool names */
		names?: Array<string>;
		/** Sort order for tools by creation time. 'asc' for oldest first, 'desc' for newest first */
		order?: 'asc' | 'desc';
		/** Field to sort by */
		order_by?: 'created_at';
		/** Return only tools with tool_type starting with 'letta_' */
		return_only_letta_tools?: boolean;
		/** Search tool names (case-insensitive partial match) */
		search?: string;
		/** Filter by specific tool IDs - accepts repeated params or comma-separated values */
		tool_ids?: Array<string>;
		/** Filter by tool type(s) - accepts repeated params or comma-separated values */
		tool_types?: Array<string>;
	};
	'tools.search': {
		/** Maximum number of results to return. */
		limit?: number;
		/** Text query for semantic search. */
		query?: string;
		/** Search mode: vector, fts, or hybrid. */
		search_mode?: 'vector' | 'fts' | 'hybrid';
		/** Filter by tags (match any). */
		tags?: Array<string>;
		/** Filter by tool types (e.g., 'custom', 'letta_core'). */
		tool_types?: Array<string>;
	};
	'tools.update': {
		/** The ID of the tool in the format 'tool-<uuid4>' */
		tool_id: string;
		/** The args JSON schema of the function. */
		args_json_schema?: Record<string, LettaJsonValue>;
		/** Whether or not to require approval before executing this tool. */
		default_requires_approval?: boolean;
		/** The description of the tool. */
		description?: string;
		/** If set to True, then this tool will potentially be executed concurrently with other tools. Default False. */
		enable_parallel_execution?: boolean;
		/** The JSON schema of the function (auto-generated from source_code if not provided) */
		json_schema?: Record<string, LettaJsonValue>;
		/** A dictionary of additional metadata for the tool. */
		metadata_?: Record<string, LettaJsonValue>;
		/** Optional list of npm packages required by this tool. */
		npm_requirements?: Array<LettaNpmRequirementInput>;
		/** Optional list of pip packages required by this tool. */
		pip_requirements?: Array<LettaPipRequirementInput>;
		/** The maximum number of characters in the response. */
		return_char_limit?: number;
		/** The source code of the function. */
		source_code?: string;
		/** The type of the source code. */
		source_type?: string;
		/** Metadata tags. */
		tags?: Array<string>;
	};
	'tools.upsert': {
		/** The source code of the function. */
		source_code: string;
		/** The args JSON schema of the function. */
		args_json_schema?: Record<string, LettaJsonValue>;
		/** Whether or not to require approval before executing this tool. */
		default_requires_approval?: boolean;
		/** The description of the tool. */
		description?: string;
		/** If set to True, then this tool will potentially be executed concurrently with other tools. Default False. */
		enable_parallel_execution?: boolean;
		/** The JSON schema of the function (auto-generated from source_code if not provided) */
		json_schema?: Record<string, LettaJsonValue>;
		/** Optional list of npm packages required by this tool. */
		npm_requirements?: Array<LettaNpmRequirementInput>;
		/** Optional list of pip packages required by this tool. */
		pip_requirements?: Array<LettaPipRequirementInput>;
		/** The maximum number of characters in the response. */
		return_char_limit?: number;
		/** The source type of the function. */
		source_type?: string;
		/** Metadata tags. */
		tags?: Array<string>;
	};
};

export type LettaOperationOutputs = {
	'accessTokens.create': {
		token?: string | null;
		expiresAt?: string | null;
		hostname?: string | null;
		policy?: {
			data?: Array<{
				id?: string | null;
				access?: Array<string> | null;
				type?: string | null;
			}> | null;
			version?: string | null;
		} | null;
	};
	'accessTokens.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'accessTokens.list':
		| Array<{
				hasNextPage?: boolean | null;
				tokens?: Array<{
					token?: string | null;
					expiresAt?: string | null;
					hostname?: string | null;
					policy?: {
						data?: Array<{
							id?: string | null;
							access?: Array<string> | null;
							type?: string | null;
						}> | null;
						version?: string | null;
					} | null;
				}> | null;
		  }>
		| {
				hasNextPage?: boolean | null;
				tokens?: Array<{
					token?: string | null;
					expiresAt?: string | null;
					hostname?: string | null;
					policy?: {
						data?: Array<{
							id?: string | null;
							access?: Array<string> | null;
							type?: string | null;
						}> | null;
						version?: string | null;
					} | null;
				}> | null;
		  };
	'agents.archives.attach':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.archives.detach':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.blocks.attach': LettaAgentState;
	'agents.blocks.detach': LettaAgentState;
	'agents.blocks.get': LettaBlockResponse;
	'agents.blocks.list': Array<{
		/** The id of the block. */
		id?: string | null;
		/** Value of the block. */
		value?: string | null;
		/** (Deprecated) The base template id of the block. */
		base_template_id?: string | null;
		/** The id of the user that made this Block. */
		created_by_id?: string | null;
		/** (Deprecated) The id of the deployment. */
		deployment_id?: string | null;
		/** Description of the block. */
		description?: string | null;
		/** (Deprecated) The id of the entity within the template. */
		entity_id?: string | null;
		/** (Deprecated) If set to True, the block will be hidden. */
		hidden?: boolean | null;
		/** Whether the block is a template (e.g. saved human/persona options). */
		is_template?: boolean | null;
		/** Label of the block (e.g. 'human', 'persona') in the context window. */
		label?: string | null;
		/** The id of the user that last updated this Block. */
		last_updated_by_id?: string | null;
		/** Character limit of the block. */
		limit?: number | null;
		/** Metadata of the block. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** (Deprecated) Preserve the block on template migration. */
		preserve_on_migration?: boolean | null;
		/** The associated project id. */
		project_id?: string | null;
		/** (Deprecated) Whether the agent has read-only access to the block. */
		read_only?: boolean | null;
		/** The tags associated with the block. */
		tags?: Array<string> | null;
		/** (Deprecated) The id of the template. */
		template_id?: string | null;
		/** (Deprecated) The name of the block template (if it is a template). */
		template_name?: string | null;
	}>;
	'agents.blocks.update': LettaBlockResponse;
	'agents.create': LettaAgentState;
	'agents.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.exportFile':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.files.close':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.files.closeAll':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.files.list': {
		files?: Array<{
			/** List of file attachments for the agent */
			files?: Array<{
				/** Unique identifier of the file-agent relationship */
				id?: string | null;
				/** Unique identifier of the file */
				file_id?: string | null;
				/** Name of the file */
				file_name?: string | null;
				/** Unique identifier of the folder/source */
				folder_id?: string | null;
				/** Name of the folder/source */
				folder_name?: string | null;
				/** Whether the file is currently open in the agent's context */
				is_open?: boolean | null;
				/** Ending line number if file was opened with line range */
				end_line?: number | null;
				/** Timestamp of last access by the agent */
				last_accessed_at?: string | null;
				/** Starting line number if file was opened with line range */
				start_line?: number | null;
				/** Portion of the file visible to the agent if open */
				visible_content?: string | null;
			}> | null;
			/** Whether more results exist after this page */
			has_more?: boolean | null;
			/** Cursor for fetching the next page (file-agent relationship ID) */
			next_cursor?: string | null;
		}> | null;
		next_cursor?: string | null;
		has_more?: boolean | null;
	};
	'agents.files.open':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.folders.attach': LettaAgentState;
	'agents.folders.detach': LettaAgentState;
	'agents.folders.list': Array<{
		/** The human-friendly ID of the Source */
		id?: string | null;
		/** The embedding configuration used by the source. */
		embedding_config?: LettaEmbeddingConfig | null;
		/** The name of the source. */
		name?: string | null;
		/** The timestamp when the source was created. */
		created_at?: string | null;
		/** The id of the user that made this Tool. */
		created_by_id?: string | null;
		/** The description of the source. */
		description?: string | null;
		/** Instructions for how to use the source. */
		instructions?: string | null;
		/** The id of the user that made this Tool. */
		last_updated_by_id?: string | null;
		/** Metadata associated with the source. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** The timestamp when the source was last updated. */
		updated_at?: string | null;
		/** The vector database provider used for this source's passages */
		vector_db_provider?: LettaVectorDBProvider | null;
	}>;
	'agents.get': LettaAgentState;
	'agents.identities.attach':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.identities.detach':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.importFile': {
		/** List of IDs of the imported agents */
		agent_ids?: Array<string> | null;
	};
	'agents.list': Array<{
		/** The id of the agent. Assigned by the database. */
		id?: string | null;
		/** The type of agent. */
		agent_type?: LettaAgentType | null;
		/** The memory blocks used by the agent. */
		blocks?: Array<LettaBlock> | null;
		/** Deprecated: Use `model` field instead. The LLM configuration used by the agent. */
		llm_config?: LettaLlmConfig | null;
		/** Deprecated: Use `blocks` field instead. The in-context memory of the agent. */
		memory?: {
			/** Memory blocks contained in the agent's in-context memory */
			blocks?: Array<LettaBlock> | null;
			/** Agent type controlling prompt rendering. */
			agent_type?: (LettaAgentType | string) | null;
			/** Special blocks representing the agent's in-context memory of an attached file */
			file_blocks?: Array<{
				/** Unique identifier of the file. */
				file_id?: string | null;
				/** True if the agent currently has the file open. */
				is_open?: boolean | null;
				/** Deprecated: Use `folder_id` field instead. Unique identifier of the source. */
				source_id?: string | null;
				/** Value of the block. */
				value?: string | null;
				/** The human-friendly ID of the Block */
				id?: string | null;
				/** The base template id of the block. */
				base_template_id?: string | null;
				/** The id of the user that made this Block. */
				created_by_id?: string | null;
				/** The id of the deployment. */
				deployment_id?: string | null;
				/** Description of the block. */
				description?: string | null;
				/** The id of the entity within the template. */
				entity_id?: string | null;
				/** If set to True, the block will be hidden. */
				hidden?: boolean | null;
				/** Whether the block is a template (e.g. saved human/persona options). */
				is_template?: boolean | null;
				/** Label of the block (e.g. 'human', 'persona') in the context window. */
				label?: string | null;
				/** UTC timestamp of the agent’s most recent access to this file. Any operations from the open, close, or search tools will update this field. */
				last_accessed_at?: string | null;
				/** The id of the user that last updated this Block. */
				last_updated_by_id?: string | null;
				/** Character limit of the block. */
				limit?: number | null;
				/** Metadata of the block. */
				metadata?: Record<string, LettaJsonValue> | null;
				/** Preserve the block on template migration. */
				preserve_on_migration?: boolean | null;
				/** The associated project id. */
				project_id?: string | null;
				/** Whether the agent has read-only access to the block. */
				read_only?: boolean | null;
				/** The tags associated with the block. */
				tags?: Array<string> | null;
				/** The id of the template. */
				template_id?: string | null;
				/** Name of the block if it is a template. */
				template_name?: string | null;
			}> | null;
			/** Whether this agent uses git-backed memory with structured labels. */
			git_enabled?: boolean | null;
			/** Deprecated. Ignored for performance. */
			prompt_template?: string | null;
		} | null;
		/** The name of the agent. */
		name?: string | null;
		/** Deprecated: Use `folders` field instead. The sources used by the agent. */
		sources?: Array<{
			/** The human-friendly ID of the Source */
			id?: string | null;
			/** The embedding configuration used by the source. */
			embedding_config?: LettaEmbeddingConfig | null;
			/** The name of the source. */
			name?: string | null;
			/** The timestamp when the source was created. */
			created_at?: string | null;
			/** The id of the user that made this Tool. */
			created_by_id?: string | null;
			/** The description of the source. */
			description?: string | null;
			/** Instructions for how to use the source. */
			instructions?: string | null;
			/** The id of the user that made this Tool. */
			last_updated_by_id?: string | null;
			/** Metadata associated with the source. */
			metadata?: Record<string, LettaJsonValue> | null;
			/** The timestamp when the source was last updated. */
			updated_at?: string | null;
			/** The vector database provider used for this source's passages */
			vector_db_provider?: LettaVectorDBProvider | null;
		}> | null;
		/** The system prompt used by the agent. */
		system?: string | null;
		/** The tags associated with the agent. */
		tags?: Array<string> | null;
		/** The tools used by the agent. */
		tools?: Array<LettaTool> | null;
		/** The base template id of the agent. */
		base_template_id?: string | null;
		/** Configuration for conversation compaction / summarization. Per-model settings (temperature, max tokens, etc.) are derived from the default configuration for that handle. */
		compaction_settings?: {
			/** The maximum length of the summary in characters. If none, no clipping is performed. */
			clip_chars?: number | null;
			/** The type of summarization technique use. */
			mode?: string | null;
			/** Model handle to use for sliding_window/all summarization (format: provider/model-name). If None, uses lightweight provider-specific defaults. */
			model?: string | null;
			/** Optional model settings used to override defaults for the summarizer model. */
			model_settings?:
				| (
						| LettaOpenAIModelSettings
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The reasoning configuration for the model. */
								reasoning?: {
									/** The reasoning effort to use when generating text reasoning models */
									reasoning_effort?: string | null;
								} | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
								strict?: boolean | null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
						| LettaAnthropicModelSettings
						| LettaGoogleAIModelSettings
						| LettaGoogleVertexModelSettings
						| LettaAzureModelSettings
						| LettaXaiModelSettings
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
								strict?: boolean | null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** The temperature of the model. */
								temperature?: number | null;
								/** The thinking configuration for GLM-4.5+ models. */
								thinking?: {
									/** If False, preserved thinking is used (recommended for agents). */
									clear_thinking?: boolean | null;
									/** Whether thinking is enabled or disabled. */
									type?: string | null;
								} | null;
						  }
						| {
								/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
								effort?: string | null;
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
								strict?: boolean | null;
								/** The temperature of the model. */
								temperature?: number | null;
								/** The thinking configuration for the model. */
								thinking?: {
									/** The maximum number of tokens the model can use for extended thinking. */
									budget_tokens?: number | null;
									/** The type of thinking to use. */
									type?: string | null;
								} | null;
								/** Soft control for how verbose model output should be, used for GPT-5 models. */
								verbosity?: string | null;
						  }
						| LettaGroqModelSettings
						| LettaDeepseekModelSettings
						| LettaTogetherModelSettings
						| LettaBedrockModelSettings
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The reasoning configuration for the model. */
								reasoning?: {
									/** The reasoning effort level for GPT-5.x and o-series models. */
									reasoning_effort?: string | null;
								} | null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
				  )
				| null;
			/** The prompt to use for summarization. If None, uses mode-specific default. */
			prompt?: string | null;
			/** Whether to include an acknowledgement post-prompt (helps prevent non-summary outputs). */
			prompt_acknowledgement?: boolean | null;
			/** The percentage of the context window to keep post-summarization (only used in sliding window modes). */
			sliding_window_percentage?: number | null;
		} | null;
		/** The timestamp when the object was created. */
		created_at?: string | null;
		/** The id of the user that made this object. */
		created_by_id?: string | null;
		/** The id of the deployment. */
		deployment_id?: string | null;
		/** The description of the agent. */
		description?: string | null;
		/** The embedding model handle used by the agent (format: provider/model-name). */
		embedding?: string | null;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfig | null;
		/** If set to True, memory management will move to a background agent thread. */
		enable_sleeptime?: boolean | null;
		/** The id of the entity within the template. */
		entity_id?: string | null;
		/** If set to True, the agent will be hidden. */
		hidden?: boolean | null;
		/** The identities associated with this agent. */
		identities?: Array<{
			/** The human-friendly ID of the Identity */
			id?: string | null;
			/** The IDs of the agents associated with the identity. */
			agent_ids?: Array<string> | null;
			/** The IDs of the blocks associated with the identity. */
			block_ids?: Array<string> | null;
			/** External, user-generated identifier key of the identity. */
			identifier_key?: string | null;
			/** The type of the identity. */
			identity_type?: string | null;
			/** The name of the identity. */
			name?: string | null;
			/** The project id of the identity, if applicable. */
			project_id?: string | null;
			/** List of properties associated with the identity */
			properties?: Array<{
				/** The key of the property */
				key?: string | null;
				/** The type of the property */
				type?: string | null;
				/** The value of the property */
				value?:
					| (string | number | boolean | Record<string, LettaJsonValue>)
					| null;
			}> | null;
		}> | null;
		/** Deprecated: Use `identities` field instead. The ids of the identities associated with this agent. */
		identity_ids?: Array<string> | null;
		/** The timestamp when the agent last completed a run. */
		last_run_completion?: string | null;
		/** The duration in milliseconds of the agent's last run. */
		last_run_duration_ms?: number | null;
		/** The stop reason from the agent's last run. */
		last_stop_reason?: LettaStopReasonType | null;
		/** The id of the user that made this object. */
		last_updated_by_id?: string | null;
		/** The multi-agent group that this agent manages */
		managed_group?: {
			/** The id of the group. Assigned by the database. */
			id?: string | null;
			agent_ids?: Array<string> | null;
			description?: string | null;
			manager_type?: string | null;
			/** The base template id. */
			base_template_id?: string | null;
			/** The id of the deployment. */
			deployment_id?: string | null;
			/** If set to True, the group will be hidden. */
			hidden?: boolean | null;
			last_processed_message_id?: string | null;
			manager_agent_id?: string | null;
			/** The desired maximum length of messages in the context window of the convo agent. This is a best effort, and may be off slightly due to user/assistant interleaving. */
			max_message_buffer_length?: number | null;
			max_turns?: number | null;
			/** The desired minimum length of messages in the context window of the convo agent. This is a best effort, and may be off-by-one due to user/assistant interleaving. */
			min_message_buffer_length?: number | null;
			/** The associated project id. */
			project_id?: string | null;
			shared_block_ids?: Array<string> | null;
			sleeptime_agent_frequency?: number | null;
			/** The id of the template. */
			template_id?: string | null;
			termination_token?: string | null;
			turns_counter?: number | null;
		} | null;
		/** Maximum number of files that can be open at once for this agent. Setting this too high may exceed the context window, which will break the agent. */
		max_files_open?: number | null;
		/** If set to True, the agent will not remember previous messages (though the agent will still retain state via core memory blocks and archival/recall memory). Not recommended unless you have an advanced use case. */
		message_buffer_autoclear?: boolean | null;
		/** The ids of the messages in the agent's in-context memory. */
		message_ids?: Array<string> | null;
		/** The metadata of the agent. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** The model handle used by the agent (format: provider/model-name). */
		model?: string | null;
		/** The model settings used by the agent. */
		model_settings?:
			| (
					| LettaOpenAIModelSettings
					| Record<string, LettaJsonValue>
					| LettaAnthropicModelSettings
					| LettaGoogleAIModelSettings
					| LettaGoogleVertexModelSettings
					| LettaAzureModelSettings
					| LettaXaiModelSettings
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
							strict?: boolean | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** The temperature of the model. */
							temperature?: number | null;
							/** The thinking configuration for GLM-4.5+ models. */
							thinking?: {
								/** If False, preserved thinking is used (recommended for agents). */
								clear_thinking?: boolean | null;
								/** Whether thinking is enabled or disabled. */
								type?: string | null;
							} | null;
					  }
					| {
							/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
							effort?: string | null;
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
							strict?: boolean | null;
							/** The temperature of the model. */
							temperature?: number | null;
							/** The thinking configuration for the model. */
							thinking?: {
								/** The maximum number of tokens the model can use for extended thinking. */
								budget_tokens?: number | null;
								/** The type of thinking to use. */
								type?: string | null;
							} | null;
							/** Soft control for how verbose model output should be, used for GPT-5 models. */
							verbosity?: string | null;
					  }
					| LettaGroqModelSettings
					| LettaDeepseekModelSettings
					| LettaTogetherModelSettings
					| LettaBedrockModelSettings
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The reasoning configuration for the model. */
							reasoning?: {
								/** The reasoning effort level for GPT-5.x and o-series models. */
								reasoning_effort?: string | null;
							} | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
			  )
			| null;
		/** Deprecated: Use `managed_group` field instead. The multi-agent group that this agent manages. */
		multi_agent_group?: {
			/** The id of the group. Assigned by the database. */
			id?: string | null;
			agent_ids?: Array<string> | null;
			description?: string | null;
			manager_type?: string | null;
			/** The base template id. */
			base_template_id?: string | null;
			/** The id of the deployment. */
			deployment_id?: string | null;
			/** If set to True, the group will be hidden. */
			hidden?: boolean | null;
			last_processed_message_id?: string | null;
			manager_agent_id?: string | null;
			/** The desired maximum length of messages in the context window of the convo agent. This is a best effort, and may be off slightly due to user/assistant interleaving. */
			max_message_buffer_length?: number | null;
			max_turns?: number | null;
			/** The desired minimum length of messages in the context window of the convo agent. This is a best effort, and may be off-by-one due to user/assistant interleaving. */
			min_message_buffer_length?: number | null;
			/** The associated project id. */
			project_id?: string | null;
			shared_block_ids?: Array<string> | null;
			sleeptime_agent_frequency?: number | null;
			/** The id of the template. */
			template_id?: string | null;
			termination_token?: string | null;
			turns_counter?: number | null;
		} | null;
		/** A message representing a request for approval to call a tool (generated by the LLM to trigger tool execution). Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message tool_call (ToolCall):… */
		pending_approval?: LettaApprovalRequestMessage | null;
		/** The per-file view window character limit for this agent. Setting this too high may exceed the context window, which will break the agent. */
		per_file_view_window_char_limit?: number | null;
		/** The id of the project the agent belongs to. */
		project_id?: string | null;
		/** The response format used by the agent */
		response_format?:
			| (
					| LettaTextResponseFormat
					| LettaJsonSchemaResponseFormat
					| LettaJsonObjectResponseFormat
			  )
			| null;
		/** The environment variables for tool execution specific to this agent. */
		secrets?: Array<LettaAgentEnvironmentVariable> | null;
		/** The id of the template the agent belongs to. */
		template_id?: string | null;
		/** The timezone of the agent (IANA format). */
		timezone?: string | null;
		/** Deprecated: use `secrets` field instead. */
		tool_exec_environment_variables?: Array<LettaAgentEnvironmentVariable> | null;
		/** The list of tool rules. */
		tool_rules?: Array<
			| LettaChildToolRule
			| LettaInitToolRule
			| LettaTerminalToolRule
			| LettaConditionalToolRule
			| LettaContinueToolRule
			| LettaRequiredBeforeExitToolRule
			| LettaMaxCountPerStepToolRule
			| LettaParentToolRule
			| LettaRequiresApprovalToolRule
		> | null;
		/** The timestamp when the object was last updated. */
		updated_at?: string | null;
	}>;
	'agents.messages.cancel':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.messages.compact': LettaCompactionResponse;
	'agents.messages.create': LettaLettaResponse;
	'agents.messages.createAsync': LettaRun;
	'agents.messages.list': Array<LettaMessage>;
	'agents.messages.reset': LettaAgentState | null;
	'agents.messages.stream': {
		/** The response body as text. */
		text: string;
		/** The content type Letta answered with. */
		contentType: string | null;
	};
	'agents.passages.create': Array<LettaPassage>;
	'agents.passages.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.passages.list':
		| Array<{
				/** The embedding of the passage. */
				embedding?: Array<number> | null;
				/** Configuration for embedding model connection and processing parameters. */
				embedding_config?: LettaEmbeddingConfig | null;
				/** The text of the passage. */
				text?: string | null;
				/** The human-friendly ID of the Passage */
				id?: string | null;
				/** The unique identifier of the archive containing this passage. */
				archive_id?: string | null;
				/** The creation date of the passage. */
				created_at?: string | null;
				/** The id of the user that made this object. */
				created_by_id?: string | null;
				/** The unique identifier of the file associated with the passage. */
				file_id?: string | null;
				/** The name of the file (only for source passages). */
				file_name?: string | null;
				/** Whether this passage is deleted or not. */
				is_deleted?: boolean | null;
				/** The id of the user that made this object. */
				last_updated_by_id?: string | null;
				/** The metadata of the passage. */
				metadata?: Record<string, LettaJsonValue> | null;
				/** Deprecated: Use `folder_id` field instead. The data source of the passage. */
				source_id?: string | null;
				/** Tags associated with this passage. */
				tags?: Array<string> | null;
				/** The timestamp when the object was last updated. */
				updated_at?: string | null;
		  }>
		| {
				/** The embedding of the passage. */
				embedding?: Array<number> | null;
				/** Configuration for embedding model connection and processing parameters. */
				embedding_config?: LettaEmbeddingConfig | null;
				/** The text of the passage. */
				text?: string | null;
				/** The human-friendly ID of the Passage */
				id?: string | null;
				/** The unique identifier of the archive containing this passage. */
				archive_id?: string | null;
				/** The creation date of the passage. */
				created_at?: string | null;
				/** The id of the user that made this object. */
				created_by_id?: string | null;
				/** The unique identifier of the file associated with the passage. */
				file_id?: string | null;
				/** The name of the file (only for source passages). */
				file_name?: string | null;
				/** Whether this passage is deleted or not. */
				is_deleted?: boolean | null;
				/** The id of the user that made this object. */
				last_updated_by_id?: string | null;
				/** The metadata of the passage. */
				metadata?: Record<string, LettaJsonValue> | null;
				/** Deprecated: Use `folder_id` field instead. The data source of the passage. */
				source_id?: string | null;
				/** Tags associated with this passage. */
				tags?: Array<string> | null;
				/** The timestamp when the object was last updated. */
				updated_at?: string | null;
		  };
	'agents.passages.search': {
		/** Total number of results returned */
		count?: number | null;
		/** List of search results matching the query */
		results?: Array<{
			/** Unique identifier of the archival memory passage */
			id?: string | null;
			/** Text content of the archival memory passage */
			content?: string | null;
			/** Timestamp of when the memory was created, formatted in agent's timezone */
			timestamp?: string | null;
			/** List of tags associated with this memory */
			tags?: Array<string> | null;
		}> | null;
	};
	'agents.recompile':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'agents.schedule.create': {
		id?: string | null;
		next_scheduled_at?: string | null;
	};
	'agents.schedule.delete': {
		success?: boolean | null;
	};
	'agents.schedule.get': {
		id?: string | null;
		agent_id?: string | null;
		message?: {
			messages?: Array<{
				content?:
					| (
							| Array<
									| Array<
											| {
													text?: string | null;
													signature?: string | null;
													type?: string | null;
											  }
											| {
													source?: {
														data?: string | null;
														media_type?: string | null;
														detail?: string | null;
														type?: string | null;
													} | null;
													type?: string | null;
											  }
									  >
									| string
							  >
							| string
					  )
					| null;
				role?: string | null;
				name?: string | null;
				otid?: string | null;
				sender_id?: string | null;
				type?: string | null;
			}> | null;
			callback_url?: string | null;
			include_return_message_types?: Array<string> | null;
			max_steps?: number | null;
		} | null;
		next_scheduled_time?: string | null;
		schedule?:
			| (
					| {
							scheduled_at?: number | null;
							type?: string | null;
					  }
					| {
							cron_expression?: string | null;
							type?: string | null;
					  }
			  )
			| null;
	};
	'agents.schedule.list':
		| Array<{
				has_next_page?: boolean | null;
				scheduled_messages?: Array<{
					id?: string | null;
					agent_id?: string | null;
					message?: {
						messages?: Array<{
							content?:
								| (
										| Array<
												| Array<
														| {
																text?: string | null;
																signature?: string | null;
																type?: string | null;
														  }
														| {
																source?: {
																	data?: string | null;
																	media_type?: string | null;
																	detail?: string | null;
																	type?: string | null;
																} | null;
																type?: string | null;
														  }
												  >
												| string
										  >
										| string
								  )
								| null;
							role?: string | null;
							name?: string | null;
							otid?: string | null;
							sender_id?: string | null;
							type?: string | null;
						}> | null;
						callback_url?: string | null;
						include_return_message_types?: Array<string> | null;
						max_steps?: number | null;
					} | null;
					next_scheduled_time?: string | null;
					schedule?:
						| (
								| {
										scheduled_at?: number | null;
										type?: string | null;
								  }
								| {
										cron_expression?: string | null;
										type?: string | null;
								  }
						  )
						| null;
				}> | null;
		  }>
		| {
				has_next_page?: boolean | null;
				scheduled_messages?: Array<{
					id?: string | null;
					agent_id?: string | null;
					message?: {
						messages?: Array<{
							content?:
								| (
										| Array<
												| Array<
														| {
																text?: string | null;
																signature?: string | null;
																type?: string | null;
														  }
														| {
																source?: {
																	data?: string | null;
																	media_type?: string | null;
																	detail?: string | null;
																	type?: string | null;
																} | null;
																type?: string | null;
														  }
												  >
												| string
										  >
										| string
								  )
								| null;
							role?: string | null;
							name?: string | null;
							otid?: string | null;
							sender_id?: string | null;
							type?: string | null;
						}> | null;
						callback_url?: string | null;
						include_return_message_types?: Array<string> | null;
						max_steps?: number | null;
					} | null;
					next_scheduled_time?: string | null;
					schedule?:
						| (
								| {
										scheduled_at?: number | null;
										type?: string | null;
								  }
								| {
										cron_expression?: string | null;
										type?: string | null;
								  }
						  )
						| null;
				}> | null;
		  };
	'agents.tools.attach': LettaAgentState;
	'agents.tools.detach': LettaAgentState;
	'agents.tools.list': Array<{
		/** The human-friendly ID of the Tool */
		id?: string | null;
		/** The args JSON schema of the function. */
		args_json_schema?: Record<string, LettaJsonValue> | null;
		/** The id of the user that made this Tool. */
		created_by_id?: string | null;
		/** Default value for whether or not executing this tool requires approval. */
		default_requires_approval?: boolean | null;
		/** The description of the tool. */
		description?: string | null;
		/** If set to True, then this tool will potentially be executed concurrently with other tools. Default False. */
		enable_parallel_execution?: boolean | null;
		/** The JSON schema of the function. */
		json_schema?: Record<string, LettaJsonValue> | null;
		/** The id of the user that made this Tool. */
		last_updated_by_id?: string | null;
		/** A dictionary of additional metadata for the tool. */
		metadata_?: Record<string, LettaJsonValue> | null;
		/** The name of the function. */
		name?: string | null;
		/** Optional list of npm packages required by this tool. */
		npm_requirements?: Array<LettaNpmRequirement> | null;
		/** Optional list of pip packages required by this tool. */
		pip_requirements?: Array<LettaPipRequirement> | null;
		/** The project id of the tool. */
		project_id?: string | null;
		/** The maximum number of characters in the response. */
		return_char_limit?: number | null;
		/** The source code of the function. */
		source_code?: string | null;
		/** The type of the source code. */
		source_type?: string | null;
		/** Metadata tags. */
		tags?: Array<string> | null;
		/** The type of the tool. */
		tool_type?: LettaToolType | null;
	}>;
	'agents.tools.run': LettaToolExecutionResult;
	'agents.tools.updateApproval': LettaAgentState;
	'agents.update': LettaAgentState;
	'archives.create': LettaArchive;
	'archives.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'archives.get': LettaArchive;
	'archives.list': Array<{
		/** The human-friendly ID of the Archive */
		id?: string | null;
		/** The creation date of the archive */
		created_at?: string | null;
		/** The name of the archive */
		name?: string | null;
		/** The id of the user that made this object. */
		created_by_id?: string | null;
		/** A description of the archive */
		description?: string | null;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfig | null;
		/** The id of the user that made this object. */
		last_updated_by_id?: string | null;
		/** Additional metadata */
		metadata?: Record<string, LettaJsonValue> | null;
		/** The timestamp when the object was last updated. */
		updated_at?: string | null;
		/** The vector database provider used for this archive's passages */
		vector_db_provider?: LettaVectorDBProvider | null;
	}>;
	'archives.passages.create': LettaPassage | Array<LettaPassage>;
	'archives.passages.createMany': {
		/** The embedding of the passage. */
		embedding?: Array<number> | null;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfig | null;
		/** The text of the passage. */
		text?: string | null;
		/** The human-friendly ID of the Passage */
		id?: string | null;
		/** The unique identifier of the archive containing this passage. */
		archive_id?: string | null;
		/** The creation date of the passage. */
		created_at?: string | null;
		/** The id of the user that made this object. */
		created_by_id?: string | null;
		/** The unique identifier of the file associated with the passage. */
		file_id?: string | null;
		/** The name of the file (only for source passages). */
		file_name?: string | null;
		/** Whether this passage is deleted or not. */
		is_deleted?: boolean | null;
		/** The id of the user that made this object. */
		last_updated_by_id?: string | null;
		/** The metadata of the passage. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** Deprecated: Use `folder_id` field instead. The data source of the passage. */
		source_id?: string | null;
		/** Tags associated with this passage. */
		tags?: Array<string> | null;
		/** The timestamp when the object was last updated. */
		updated_at?: string | null;
	};
	'archives.passages.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'archives.update': LettaArchive;
	'blocks.agents.list': Array<{
		/** The id of the agent. Assigned by the database. */
		id?: string | null;
		/** The type of agent. */
		agent_type?: LettaAgentType | null;
		/** The memory blocks used by the agent. */
		blocks?: Array<LettaBlock> | null;
		/** Deprecated: Use `model` field instead. The LLM configuration used by the agent. */
		llm_config?: LettaLlmConfig | null;
		/** Deprecated: Use `blocks` field instead. The in-context memory of the agent. */
		memory?: {
			/** Memory blocks contained in the agent's in-context memory */
			blocks?: Array<LettaBlock> | null;
			/** Agent type controlling prompt rendering. */
			agent_type?: (LettaAgentType | string) | null;
			/** Special blocks representing the agent's in-context memory of an attached file */
			file_blocks?: Array<{
				/** Unique identifier of the file. */
				file_id?: string | null;
				/** True if the agent currently has the file open. */
				is_open?: boolean | null;
				/** Deprecated: Use `folder_id` field instead. Unique identifier of the source. */
				source_id?: string | null;
				/** Value of the block. */
				value?: string | null;
				/** The human-friendly ID of the Block */
				id?: string | null;
				/** The base template id of the block. */
				base_template_id?: string | null;
				/** The id of the user that made this Block. */
				created_by_id?: string | null;
				/** The id of the deployment. */
				deployment_id?: string | null;
				/** Description of the block. */
				description?: string | null;
				/** The id of the entity within the template. */
				entity_id?: string | null;
				/** If set to True, the block will be hidden. */
				hidden?: boolean | null;
				/** Whether the block is a template (e.g. saved human/persona options). */
				is_template?: boolean | null;
				/** Label of the block (e.g. 'human', 'persona') in the context window. */
				label?: string | null;
				/** UTC timestamp of the agent’s most recent access to this file. Any operations from the open, close, or search tools will update this field. */
				last_accessed_at?: string | null;
				/** The id of the user that last updated this Block. */
				last_updated_by_id?: string | null;
				/** Character limit of the block. */
				limit?: number | null;
				/** Metadata of the block. */
				metadata?: Record<string, LettaJsonValue> | null;
				/** Preserve the block on template migration. */
				preserve_on_migration?: boolean | null;
				/** The associated project id. */
				project_id?: string | null;
				/** Whether the agent has read-only access to the block. */
				read_only?: boolean | null;
				/** The tags associated with the block. */
				tags?: Array<string> | null;
				/** The id of the template. */
				template_id?: string | null;
				/** Name of the block if it is a template. */
				template_name?: string | null;
			}> | null;
			/** Whether this agent uses git-backed memory with structured labels. */
			git_enabled?: boolean | null;
			/** Deprecated. Ignored for performance. */
			prompt_template?: string | null;
		} | null;
		/** The name of the agent. */
		name?: string | null;
		/** Deprecated: Use `folders` field instead. The sources used by the agent. */
		sources?: Array<{
			/** The human-friendly ID of the Source */
			id?: string | null;
			/** The embedding configuration used by the source. */
			embedding_config?: LettaEmbeddingConfig | null;
			/** The name of the source. */
			name?: string | null;
			/** The timestamp when the source was created. */
			created_at?: string | null;
			/** The id of the user that made this Tool. */
			created_by_id?: string | null;
			/** The description of the source. */
			description?: string | null;
			/** Instructions for how to use the source. */
			instructions?: string | null;
			/** The id of the user that made this Tool. */
			last_updated_by_id?: string | null;
			/** Metadata associated with the source. */
			metadata?: Record<string, LettaJsonValue> | null;
			/** The timestamp when the source was last updated. */
			updated_at?: string | null;
			/** The vector database provider used for this source's passages */
			vector_db_provider?: LettaVectorDBProvider | null;
		}> | null;
		/** The system prompt used by the agent. */
		system?: string | null;
		/** The tags associated with the agent. */
		tags?: Array<string> | null;
		/** The tools used by the agent. */
		tools?: Array<LettaTool> | null;
		/** The base template id of the agent. */
		base_template_id?: string | null;
		/** Configuration for conversation compaction / summarization. Per-model settings (temperature, max tokens, etc.) are derived from the default configuration for that handle. */
		compaction_settings?: {
			/** The maximum length of the summary in characters. If none, no clipping is performed. */
			clip_chars?: number | null;
			/** The type of summarization technique use. */
			mode?: string | null;
			/** Model handle to use for sliding_window/all summarization (format: provider/model-name). If None, uses lightweight provider-specific defaults. */
			model?: string | null;
			/** Optional model settings used to override defaults for the summarizer model. */
			model_settings?:
				| (
						| LettaOpenAIModelSettings
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The reasoning configuration for the model. */
								reasoning?: {
									/** The reasoning effort to use when generating text reasoning models */
									reasoning_effort?: string | null;
								} | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
								strict?: boolean | null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
						| LettaAnthropicModelSettings
						| LettaGoogleAIModelSettings
						| LettaGoogleVertexModelSettings
						| LettaAzureModelSettings
						| LettaXaiModelSettings
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
								strict?: boolean | null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** The temperature of the model. */
								temperature?: number | null;
								/** The thinking configuration for GLM-4.5+ models. */
								thinking?: {
									/** If False, preserved thinking is used (recommended for agents). */
									clear_thinking?: boolean | null;
									/** Whether thinking is enabled or disabled. */
									type?: string | null;
								} | null;
						  }
						| {
								/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
								effort?: string | null;
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
								strict?: boolean | null;
								/** The temperature of the model. */
								temperature?: number | null;
								/** The thinking configuration for the model. */
								thinking?: {
									/** The maximum number of tokens the model can use for extended thinking. */
									budget_tokens?: number | null;
									/** The type of thinking to use. */
									type?: string | null;
								} | null;
								/** Soft control for how verbose model output should be, used for GPT-5 models. */
								verbosity?: string | null;
						  }
						| LettaGroqModelSettings
						| LettaDeepseekModelSettings
						| LettaTogetherModelSettings
						| LettaBedrockModelSettings
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The response format for the model. */
								response_format?:
									| (
											| LettaTextResponseFormat
											| LettaJsonSchemaResponseFormat
											| LettaJsonObjectResponseFormat
									  )
									| null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
						| {
								/** The maximum number of tokens the model can generate. */
								max_output_tokens?: number | null;
								/** Whether to enable parallel tool calling. */
								parallel_tool_calls?: boolean | null;
								/** The type of the provider. */
								provider_type?: string | null;
								/** The reasoning configuration for the model. */
								reasoning?: {
									/** The reasoning effort level for GPT-5.x and o-series models. */
									reasoning_effort?: string | null;
								} | null;
								/** The temperature of the model. */
								temperature?: number | null;
						  }
				  )
				| null;
			/** The prompt to use for summarization. If None, uses mode-specific default. */
			prompt?: string | null;
			/** Whether to include an acknowledgement post-prompt (helps prevent non-summary outputs). */
			prompt_acknowledgement?: boolean | null;
			/** The percentage of the context window to keep post-summarization (only used in sliding window modes). */
			sliding_window_percentage?: number | null;
		} | null;
		/** The timestamp when the object was created. */
		created_at?: string | null;
		/** The id of the user that made this object. */
		created_by_id?: string | null;
		/** The id of the deployment. */
		deployment_id?: string | null;
		/** The description of the agent. */
		description?: string | null;
		/** The embedding model handle used by the agent (format: provider/model-name). */
		embedding?: string | null;
		/** Configuration for embedding model connection and processing parameters. */
		embedding_config?: LettaEmbeddingConfig | null;
		/** If set to True, memory management will move to a background agent thread. */
		enable_sleeptime?: boolean | null;
		/** The id of the entity within the template. */
		entity_id?: string | null;
		/** If set to True, the agent will be hidden. */
		hidden?: boolean | null;
		/** The identities associated with this agent. */
		identities?: Array<{
			/** The human-friendly ID of the Identity */
			id?: string | null;
			/** The IDs of the agents associated with the identity. */
			agent_ids?: Array<string> | null;
			/** The IDs of the blocks associated with the identity. */
			block_ids?: Array<string> | null;
			/** External, user-generated identifier key of the identity. */
			identifier_key?: string | null;
			/** The type of the identity. */
			identity_type?: string | null;
			/** The name of the identity. */
			name?: string | null;
			/** The project id of the identity, if applicable. */
			project_id?: string | null;
			/** List of properties associated with the identity */
			properties?: Array<{
				/** The key of the property */
				key?: string | null;
				/** The type of the property */
				type?: string | null;
				/** The value of the property */
				value?:
					| (string | number | boolean | Record<string, LettaJsonValue>)
					| null;
			}> | null;
		}> | null;
		/** Deprecated: Use `identities` field instead. The ids of the identities associated with this agent. */
		identity_ids?: Array<string> | null;
		/** The timestamp when the agent last completed a run. */
		last_run_completion?: string | null;
		/** The duration in milliseconds of the agent's last run. */
		last_run_duration_ms?: number | null;
		/** The stop reason from the agent's last run. */
		last_stop_reason?: LettaStopReasonType | null;
		/** The id of the user that made this object. */
		last_updated_by_id?: string | null;
		/** The multi-agent group that this agent manages */
		managed_group?: {
			/** The id of the group. Assigned by the database. */
			id?: string | null;
			agent_ids?: Array<string> | null;
			description?: string | null;
			manager_type?: string | null;
			/** The base template id. */
			base_template_id?: string | null;
			/** The id of the deployment. */
			deployment_id?: string | null;
			/** If set to True, the group will be hidden. */
			hidden?: boolean | null;
			last_processed_message_id?: string | null;
			manager_agent_id?: string | null;
			/** The desired maximum length of messages in the context window of the convo agent. This is a best effort, and may be off slightly due to user/assistant interleaving. */
			max_message_buffer_length?: number | null;
			max_turns?: number | null;
			/** The desired minimum length of messages in the context window of the convo agent. This is a best effort, and may be off-by-one due to user/assistant interleaving. */
			min_message_buffer_length?: number | null;
			/** The associated project id. */
			project_id?: string | null;
			shared_block_ids?: Array<string> | null;
			sleeptime_agent_frequency?: number | null;
			/** The id of the template. */
			template_id?: string | null;
			termination_token?: string | null;
			turns_counter?: number | null;
		} | null;
		/** Maximum number of files that can be open at once for this agent. Setting this too high may exceed the context window, which will break the agent. */
		max_files_open?: number | null;
		/** If set to True, the agent will not remember previous messages (though the agent will still retain state via core memory blocks and archival/recall memory). Not recommended unless you have an advanced use case. */
		message_buffer_autoclear?: boolean | null;
		/** The ids of the messages in the agent's in-context memory. */
		message_ids?: Array<string> | null;
		/** The metadata of the agent. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** The model handle used by the agent (format: provider/model-name). */
		model?: string | null;
		/** The model settings used by the agent. */
		model_settings?:
			| (
					| LettaOpenAIModelSettings
					| Record<string, LettaJsonValue>
					| LettaAnthropicModelSettings
					| LettaGoogleAIModelSettings
					| LettaGoogleVertexModelSettings
					| LettaAzureModelSettings
					| LettaXaiModelSettings
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
							strict?: boolean | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** The temperature of the model. */
							temperature?: number | null;
							/** The thinking configuration for GLM-4.5+ models. */
							thinking?: {
								/** If False, preserved thinking is used (recommended for agents). */
								clear_thinking?: boolean | null;
								/** Whether thinking is enabled or disabled. */
								type?: string | null;
							} | null;
					  }
					| {
							/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
							effort?: string | null;
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
							strict?: boolean | null;
							/** The temperature of the model. */
							temperature?: number | null;
							/** The thinking configuration for the model. */
							thinking?: {
								/** The maximum number of tokens the model can use for extended thinking. */
								budget_tokens?: number | null;
								/** The type of thinking to use. */
								type?: string | null;
							} | null;
							/** Soft control for how verbose model output should be, used for GPT-5 models. */
							verbosity?: string | null;
					  }
					| LettaGroqModelSettings
					| LettaDeepseekModelSettings
					| LettaTogetherModelSettings
					| LettaBedrockModelSettings
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The response format for the model. */
							response_format?:
								| (
										| LettaTextResponseFormat
										| LettaJsonSchemaResponseFormat
										| LettaJsonObjectResponseFormat
								  )
								| null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
					| {
							/** The maximum number of tokens the model can generate. */
							max_output_tokens?: number | null;
							/** Whether to enable parallel tool calling. */
							parallel_tool_calls?: boolean | null;
							/** The type of the provider. */
							provider_type?: string | null;
							/** The reasoning configuration for the model. */
							reasoning?: {
								/** The reasoning effort level for GPT-5.x and o-series models. */
								reasoning_effort?: string | null;
							} | null;
							/** The temperature of the model. */
							temperature?: number | null;
					  }
			  )
			| null;
		/** Deprecated: Use `managed_group` field instead. The multi-agent group that this agent manages. */
		multi_agent_group?: {
			/** The id of the group. Assigned by the database. */
			id?: string | null;
			agent_ids?: Array<string> | null;
			description?: string | null;
			manager_type?: string | null;
			/** The base template id. */
			base_template_id?: string | null;
			/** The id of the deployment. */
			deployment_id?: string | null;
			/** If set to True, the group will be hidden. */
			hidden?: boolean | null;
			last_processed_message_id?: string | null;
			manager_agent_id?: string | null;
			/** The desired maximum length of messages in the context window of the convo agent. This is a best effort, and may be off slightly due to user/assistant interleaving. */
			max_message_buffer_length?: number | null;
			max_turns?: number | null;
			/** The desired minimum length of messages in the context window of the convo agent. This is a best effort, and may be off-by-one due to user/assistant interleaving. */
			min_message_buffer_length?: number | null;
			/** The associated project id. */
			project_id?: string | null;
			shared_block_ids?: Array<string> | null;
			sleeptime_agent_frequency?: number | null;
			/** The id of the template. */
			template_id?: string | null;
			termination_token?: string | null;
			turns_counter?: number | null;
		} | null;
		/** A message representing a request for approval to call a tool (generated by the LLM to trigger tool execution). Args: id (str): The ID of the message date (datetime): The date the message was created in ISO format name (Optional[str]): The name of the sender of the message tool_call (ToolCall):… */
		pending_approval?: LettaApprovalRequestMessage | null;
		/** The per-file view window character limit for this agent. Setting this too high may exceed the context window, which will break the agent. */
		per_file_view_window_char_limit?: number | null;
		/** The id of the project the agent belongs to. */
		project_id?: string | null;
		/** The response format used by the agent */
		response_format?:
			| (
					| LettaTextResponseFormat
					| LettaJsonSchemaResponseFormat
					| LettaJsonObjectResponseFormat
			  )
			| null;
		/** The environment variables for tool execution specific to this agent. */
		secrets?: Array<LettaAgentEnvironmentVariable> | null;
		/** The id of the template the agent belongs to. */
		template_id?: string | null;
		/** The timezone of the agent (IANA format). */
		timezone?: string | null;
		/** Deprecated: use `secrets` field instead. */
		tool_exec_environment_variables?: Array<LettaAgentEnvironmentVariable> | null;
		/** The list of tool rules. */
		tool_rules?: Array<
			| LettaChildToolRule
			| LettaInitToolRule
			| LettaTerminalToolRule
			| LettaConditionalToolRule
			| LettaContinueToolRule
			| LettaRequiredBeforeExitToolRule
			| LettaMaxCountPerStepToolRule
			| LettaParentToolRule
			| LettaRequiresApprovalToolRule
		> | null;
		/** The timestamp when the object was last updated. */
		updated_at?: string | null;
	}>;
	'blocks.create': LettaBlockResponse;
	'blocks.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'blocks.get': LettaBlockResponse;
	'blocks.list': Array<{
		/** The id of the block. */
		id?: string | null;
		/** Value of the block. */
		value?: string | null;
		/** (Deprecated) The base template id of the block. */
		base_template_id?: string | null;
		/** The id of the user that made this Block. */
		created_by_id?: string | null;
		/** (Deprecated) The id of the deployment. */
		deployment_id?: string | null;
		/** Description of the block. */
		description?: string | null;
		/** (Deprecated) The id of the entity within the template. */
		entity_id?: string | null;
		/** (Deprecated) If set to True, the block will be hidden. */
		hidden?: boolean | null;
		/** Whether the block is a template (e.g. saved human/persona options). */
		is_template?: boolean | null;
		/** Label of the block (e.g. 'human', 'persona') in the context window. */
		label?: string | null;
		/** The id of the user that last updated this Block. */
		last_updated_by_id?: string | null;
		/** Character limit of the block. */
		limit?: number | null;
		/** Metadata of the block. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** (Deprecated) Preserve the block on template migration. */
		preserve_on_migration?: boolean | null;
		/** The associated project id. */
		project_id?: string | null;
		/** (Deprecated) Whether the agent has read-only access to the block. */
		read_only?: boolean | null;
		/** The tags associated with the block. */
		tags?: Array<string> | null;
		/** (Deprecated) The id of the template. */
		template_id?: string | null;
		/** (Deprecated) The name of the block template (if it is a template). */
		template_name?: string | null;
	}>;
	'blocks.update': LettaBlockResponse;
	'client.health': {
		status?: string | null;
		version?: string | null;
	};
	'conversations.cancel':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'conversations.create': LettaConversation;
	'conversations.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'conversations.fork': LettaConversation;
	'conversations.get': LettaConversation;
	'conversations.list':
		| Array<{
				/** The unique identifier of the conversation. */
				id?: string | null;
				/** The ID of the agent this conversation belongs to. */
				agent_id?: string | null;
				/** Whether the conversation is archived. */
				archived?: boolean | null;
				/** Timestamp of when the conversation was archived. */
				archived_at?: string | null;
				/** The context window limit for this conversation (overrides agent's context window). */
				context_window_limit?: number | null;
				/** The timestamp when the object was created. */
				created_at?: string | null;
				/** The id of the user that made this object. */
				created_by_id?: string | null;
				/** A generated description of the conversation used for search and bootstrap context. */
				description?: string | null;
				/** The IDs of in-context messages for the conversation. Null means this field was not retrieved/hydrated for this response. */
				in_context_message_ids?: Array<string> | null;
				/** Timestamp of the most recent message request sent to this conversation. */
				last_message_at?: string | null;
				/** The id of the user that made this object. */
				last_updated_by_id?: string | null;
				/** The model handle for this conversation (overrides agent's model). Format: provider/model-name. */
				model?: string | null;
				/** The model settings for this conversation (overrides agent's model settings). */
				model_settings?:
					| (
							| LettaOpenAIModelSettings
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The reasoning configuration for the model. */
									reasoning?: {
										/** The reasoning effort to use when generating text reasoning models */
										reasoning_effort?: string | null;
									} | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
									strict?: boolean | null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
							| LettaAnthropicModelSettings
							| LettaGoogleAIModelSettings
							| LettaGoogleVertexModelSettings
							| LettaAzureModelSettings
							| LettaXaiModelSettings
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
									strict?: boolean | null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** The temperature of the model. */
									temperature?: number | null;
									/** The thinking configuration for GLM-4.5+ models. */
									thinking?: {
										/** If False, preserved thinking is used (recommended for agents). */
										clear_thinking?: boolean | null;
										/** Whether thinking is enabled or disabled. */
										type?: string | null;
									} | null;
							  }
							| {
									/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
									effort?: string | null;
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
									strict?: boolean | null;
									/** The temperature of the model. */
									temperature?: number | null;
									/** The thinking configuration for the model. */
									thinking?: {
										/** The maximum number of tokens the model can use for extended thinking. */
										budget_tokens?: number | null;
										/** The type of thinking to use. */
										type?: string | null;
									} | null;
									/** Soft control for how verbose model output should be, used for GPT-5 models. */
									verbosity?: string | null;
							  }
							| LettaGroqModelSettings
							| LettaDeepseekModelSettings
							| LettaTogetherModelSettings
							| LettaBedrockModelSettings
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The reasoning configuration for the model. */
									reasoning?: {
										/** The reasoning effort level for GPT-5.x and o-series models. */
										reasoning_effort?: string | null;
									} | null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
					  )
					| null;
				/** A summary of the conversation. */
				summary?: string | null;
				/** The timestamp when the object was last updated. */
				updated_at?: string | null;
		  }>
		| {
				/** The unique identifier of the conversation. */
				id?: string | null;
				/** The ID of the agent this conversation belongs to. */
				agent_id?: string | null;
				/** Whether the conversation is archived. */
				archived?: boolean | null;
				/** Timestamp of when the conversation was archived. */
				archived_at?: string | null;
				/** The context window limit for this conversation (overrides agent's context window). */
				context_window_limit?: number | null;
				/** The timestamp when the object was created. */
				created_at?: string | null;
				/** The id of the user that made this object. */
				created_by_id?: string | null;
				/** A generated description of the conversation used for search and bootstrap context. */
				description?: string | null;
				/** The IDs of in-context messages for the conversation. Null means this field was not retrieved/hydrated for this response. */
				in_context_message_ids?: Array<string> | null;
				/** Timestamp of the most recent message request sent to this conversation. */
				last_message_at?: string | null;
				/** The id of the user that made this object. */
				last_updated_by_id?: string | null;
				/** The model handle for this conversation (overrides agent's model). Format: provider/model-name. */
				model?: string | null;
				/** The model settings for this conversation (overrides agent's model settings). */
				model_settings?:
					| (
							| LettaOpenAIModelSettings
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The reasoning configuration for the model. */
									reasoning?: {
										/** The reasoning effort to use when generating text reasoning models */
										reasoning_effort?: string | null;
									} | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
									strict?: boolean | null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
							| LettaAnthropicModelSettings
							| LettaGoogleAIModelSettings
							| LettaGoogleVertexModelSettings
							| LettaAzureModelSettings
							| LettaXaiModelSettings
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
									strict?: boolean | null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** The temperature of the model. */
									temperature?: number | null;
									/** The thinking configuration for GLM-4.5+ models. */
									thinking?: {
										/** If False, preserved thinking is used (recommended for agents). */
										clear_thinking?: boolean | null;
										/** Whether thinking is enabled or disabled. */
										type?: string | null;
									} | null;
							  }
							| {
									/** Effort level for supported Anthropic models (controls token spending). 'xhigh' and 'max' are available on Opus 4.6+. Not setting this gives similar performance to 'high'. */
									effort?: string | null;
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** Enable strict mode for tool calling. When true, tool outputs are guaranteed to match JSON schemas. */
									strict?: boolean | null;
									/** The temperature of the model. */
									temperature?: number | null;
									/** The thinking configuration for the model. */
									thinking?: {
										/** The maximum number of tokens the model can use for extended thinking. */
										budget_tokens?: number | null;
										/** The type of thinking to use. */
										type?: string | null;
									} | null;
									/** Soft control for how verbose model output should be, used for GPT-5 models. */
									verbosity?: string | null;
							  }
							| LettaGroqModelSettings
							| LettaDeepseekModelSettings
							| LettaTogetherModelSettings
							| LettaBedrockModelSettings
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The response format for the model. */
									response_format?:
										| (
												| LettaTextResponseFormat
												| LettaJsonSchemaResponseFormat
												| LettaJsonObjectResponseFormat
										  )
										| null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
							| {
									/** The maximum number of tokens the model can generate. */
									max_output_tokens?: number | null;
									/** Whether to enable parallel tool calling. */
									parallel_tool_calls?: boolean | null;
									/** The type of the provider. */
									provider_type?: string | null;
									/** The reasoning configuration for the model. */
									reasoning?: {
										/** The reasoning effort level for GPT-5.x and o-series models. */
										reasoning_effort?: string | null;
									} | null;
									/** The temperature of the model. */
									temperature?: number | null;
							  }
					  )
					| null;
				/** A summary of the conversation. */
				summary?: string | null;
				/** The timestamp when the object was last updated. */
				updated_at?: string | null;
		  };
	'conversations.messages.compact': LettaCompactionResponse;
	'conversations.messages.create': LettaLettaResponse | string;
	'conversations.messages.list': Array<LettaMessage>;
	'conversations.messages.stream': {
		/** The response body as text. */
		text: string;
		/** The content type Letta answered with. */
		contentType: string | null;
	};
	'conversations.recompile':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'conversations.update': LettaConversation;
	'environments.get': {
		id?: string | null;
		connectedAt?: number | null;
		connectionId?: string | null;
		connectionName?: string | null;
		deviceId?: string | null;
		firstSeenAt?: number | null;
		lastHeartbeat?: number | null;
		lastSeenAt?: number | null;
		organizationId?: string | null;
		podId?: string | null;
		apiKeyOwner?: string | null;
		currentMode?: string | null;
		metadata?: {
			gitBranch?: string | null;
			lettaCodeVersion?: string | null;
			nodeVersion?: string | null;
			os?: string | null;
			self_update?: {
				supported?: boolean | null;
				writable?: boolean | null;
				install_path?: string | null;
				manual_command?: string | null;
				reason?: string | null;
			} | null;
			supported_commands?: Array<string> | null;
			workingDirectory?: string | null;
		} | null;
		userId?: string | null;
	};
	'environments.list':
		| Array<{
				connections?: Array<{
					id?: string | null;
					connectedAt?: number | null;
					connectionId?: string | null;
					connectionName?: string | null;
					deviceId?: string | null;
					firstSeenAt?: number | null;
					lastHeartbeat?: number | null;
					lastSeenAt?: number | null;
					organizationId?: string | null;
					podId?: string | null;
					apiKeyOwner?: string | null;
					currentMode?: string | null;
					metadata?: {
						gitBranch?: string | null;
						lettaCodeVersion?: string | null;
						nodeVersion?: string | null;
						os?: string | null;
						self_update?: {
							supported?: boolean | null;
							writable?: boolean | null;
							install_path?: string | null;
							manual_command?: string | null;
							reason?: string | null;
						} | null;
						supported_commands?: Array<string> | null;
						workingDirectory?: string | null;
					} | null;
					userId?: string | null;
				}> | null;
				hasNextPage?: boolean | null;
		  }>
		| {
				connections?: Array<{
					id?: string | null;
					connectedAt?: number | null;
					connectionId?: string | null;
					connectionName?: string | null;
					deviceId?: string | null;
					firstSeenAt?: number | null;
					lastHeartbeat?: number | null;
					lastSeenAt?: number | null;
					organizationId?: string | null;
					podId?: string | null;
					apiKeyOwner?: string | null;
					currentMode?: string | null;
					metadata?: {
						gitBranch?: string | null;
						lettaCodeVersion?: string | null;
						nodeVersion?: string | null;
						os?: string | null;
						self_update?: {
							supported?: boolean | null;
							writable?: boolean | null;
							install_path?: string | null;
							manual_command?: string | null;
							reason?: string | null;
						} | null;
						supported_commands?: Array<string> | null;
						workingDirectory?: string | null;
					} | null;
					userId?: string | null;
				}> | null;
				hasNextPage?: boolean | null;
		  };
	'environments.sendMessage': {
		message?: string | null;
		success?: boolean | null;
	};
	'folders.agents.list':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'folders.create': LettaFolder;
	'folders.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'folders.files.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'folders.files.get': {
		/** The human-friendly ID of the File */
		id?: string | null;
		/** Deprecated: Use `folder_id` field instead. The unique identifier of the source associated with the document. */
		source_id?: string | null;
		/** Number of chunks that have been embedded. */
		chunks_embedded?: number | null;
		/** Optional full-text content of the file; only populated on demand due to its size. */
		content?: string | null;
		/** The creation date of the file. */
		created_at?: string | null;
		/** Optional error message if the file failed processing. */
		error_message?: string | null;
		/** The creation date of the file. */
		file_creation_date?: string | null;
		/** The last modified date of the file. */
		file_last_modified_date?: string | null;
		/** The name of the file. */
		file_name?: string | null;
		/** The path to the file. */
		file_path?: string | null;
		/** The size of the file in bytes. */
		file_size?: number | null;
		/** The type of the file (MIME type). */
		file_type?: string | null;
		/** The original name of the file as uploaded. */
		original_file_name?: string | null;
		/** The current processing status of the file (e.g. pending, parsing, embedding, completed, error). */
		processing_status?: string | null;
		/** Total number of chunks for the file. */
		total_chunks?: number | null;
		/** The update date of the file. */
		updated_at?: string | null;
	};
	'folders.files.list': Array<{
		/** The human-friendly ID of the File */
		id?: string | null;
		/** Deprecated: Use `folder_id` field instead. The unique identifier of the source associated with the document. */
		source_id?: string | null;
		/** Number of chunks that have been embedded. */
		chunks_embedded?: number | null;
		/** Optional full-text content of the file; only populated on demand due to its size. */
		content?: string | null;
		/** The creation date of the file. */
		created_at?: string | null;
		/** Optional error message if the file failed processing. */
		error_message?: string | null;
		/** The creation date of the file. */
		file_creation_date?: string | null;
		/** The last modified date of the file. */
		file_last_modified_date?: string | null;
		/** The name of the file. */
		file_name?: string | null;
		/** The path to the file. */
		file_path?: string | null;
		/** The size of the file in bytes. */
		file_size?: number | null;
		/** The type of the file (MIME type). */
		file_type?: string | null;
		/** The original name of the file as uploaded. */
		original_file_name?: string | null;
		/** The current processing status of the file (e.g. pending, parsing, embedding, completed, error). */
		processing_status?: string | null;
		/** Total number of chunks for the file. */
		total_chunks?: number | null;
		/** The update date of the file. */
		updated_at?: string | null;
	}>;
	'folders.files.upload': {
		/** The human-friendly ID of the File */
		id?: string | null;
		/** Deprecated: Use `folder_id` field instead. The unique identifier of the source associated with the document. */
		source_id?: string | null;
		/** Number of chunks that have been embedded. */
		chunks_embedded?: number | null;
		/** Optional full-text content of the file; only populated on demand due to its size. */
		content?: string | null;
		/** The creation date of the file. */
		created_at?: string | null;
		/** Optional error message if the file failed processing. */
		error_message?: string | null;
		/** The creation date of the file. */
		file_creation_date?: string | null;
		/** The last modified date of the file. */
		file_last_modified_date?: string | null;
		/** The name of the file. */
		file_name?: string | null;
		/** The path to the file. */
		file_path?: string | null;
		/** The size of the file in bytes. */
		file_size?: number | null;
		/** The type of the file (MIME type). */
		file_type?: string | null;
		/** The original name of the file as uploaded. */
		original_file_name?: string | null;
		/** The current processing status of the file (e.g. pending, parsing, embedding, completed, error). */
		processing_status?: string | null;
		/** Total number of chunks for the file. */
		total_chunks?: number | null;
		/** The update date of the file. */
		updated_at?: string | null;
	};
	'folders.get': LettaFolder;
	'folders.list': Array<{
		/** The human-friendly ID of the Source */
		id?: string | null;
		/** The embedding configuration used by the folder. */
		embedding_config?: LettaEmbeddingConfig | null;
		/** The name of the folder. */
		name?: string | null;
		/** The timestamp when the folder was created. */
		created_at?: string | null;
		/** The id of the user that made this Tool. */
		created_by_id?: string | null;
		/** The description of the folder. */
		description?: string | null;
		/** Instructions for how to use the folder. */
		instructions?: string | null;
		/** The id of the user that made this Tool. */
		last_updated_by_id?: string | null;
		/** Metadata associated with the folder. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** The timestamp when the folder was last updated. */
		updated_at?: string | null;
	}>;
	'folders.update': LettaFolder;
	'mcpServers.create': LettaStdioMcpServer;
	'mcpServers.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'mcpServers.get': LettaStdioMcpServer;
	'mcpServers.list': Array<LettaStdioMcpServer> | LettaStdioMcpServer;
	'mcpServers.refresh':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'mcpServers.tools.get': LettaTool;
	'mcpServers.tools.list':
		| Array<{
				/** The human-friendly ID of the Tool */
				id?: string | null;
				/** The args JSON schema of the function. */
				args_json_schema?: Record<string, LettaJsonValue> | null;
				/** The id of the user that made this Tool. */
				created_by_id?: string | null;
				/** Default value for whether or not executing this tool requires approval. */
				default_requires_approval?: boolean | null;
				/** The description of the tool. */
				description?: string | null;
				/** If set to True, then this tool will potentially be executed concurrently with other tools. Default False. */
				enable_parallel_execution?: boolean | null;
				/** The JSON schema of the function. */
				json_schema?: Record<string, LettaJsonValue> | null;
				/** The id of the user that made this Tool. */
				last_updated_by_id?: string | null;
				/** A dictionary of additional metadata for the tool. */
				metadata_?: Record<string, LettaJsonValue> | null;
				/** The name of the function. */
				name?: string | null;
				/** Optional list of npm packages required by this tool. */
				npm_requirements?: Array<LettaNpmRequirement> | null;
				/** Optional list of pip packages required by this tool. */
				pip_requirements?: Array<LettaPipRequirement> | null;
				/** The project id of the tool. */
				project_id?: string | null;
				/** The maximum number of characters in the response. */
				return_char_limit?: number | null;
				/** The source code of the function. */
				source_code?: string | null;
				/** The type of the source code. */
				source_type?: string | null;
				/** Metadata tags. */
				tags?: Array<string> | null;
				/** The type of the tool. */
				tool_type?: LettaToolType | null;
		  }>
		| {
				/** The human-friendly ID of the Tool */
				id?: string | null;
				/** The args JSON schema of the function. */
				args_json_schema?: Record<string, LettaJsonValue> | null;
				/** The id of the user that made this Tool. */
				created_by_id?: string | null;
				/** Default value for whether or not executing this tool requires approval. */
				default_requires_approval?: boolean | null;
				/** The description of the tool. */
				description?: string | null;
				/** If set to True, then this tool will potentially be executed concurrently with other tools. Default False. */
				enable_parallel_execution?: boolean | null;
				/** The JSON schema of the function. */
				json_schema?: Record<string, LettaJsonValue> | null;
				/** The id of the user that made this Tool. */
				last_updated_by_id?: string | null;
				/** A dictionary of additional metadata for the tool. */
				metadata_?: Record<string, LettaJsonValue> | null;
				/** The name of the function. */
				name?: string | null;
				/** Optional list of npm packages required by this tool. */
				npm_requirements?: Array<LettaNpmRequirement> | null;
				/** Optional list of pip packages required by this tool. */
				pip_requirements?: Array<LettaPipRequirement> | null;
				/** The project id of the tool. */
				project_id?: string | null;
				/** The maximum number of characters in the response. */
				return_char_limit?: number | null;
				/** The source code of the function. */
				source_code?: string | null;
				/** The type of the source code. */
				source_type?: string | null;
				/** Metadata tags. */
				tags?: Array<string> | null;
				/** The type of the tool. */
				tool_type?: LettaToolType | null;
		  };
	'mcpServers.tools.run': LettaToolExecutionResult;
	'mcpServers.update': LettaStdioMcpServer;
	'messages.get': Array<LettaMessage>;
	'messages.list': Array<LettaMessage>;
	'messages.search': Array<Record<string, LettaJsonValue>>;
	'models.embeddings.list':
		| Array<{
				/** Display name for the model shown in UI */
				display_name?: string | null;
				/** The dimension of the embedding */
				embedding_dim?: number | null;
				/** Deprecated: Use 'provider_type' field instead. The endpoint type for the embedding model. */
				embedding_endpoint_type?: string | null;
				/** Deprecated: Use 'name' field instead. Embedding model name. */
				embedding_model?: string | null;
				/** The actual model name used by the provider */
				name?: string | null;
				/** The name of the provider */
				provider_name?: string | null;
				/** The type of the provider */
				provider_type?: LettaProviderType | null;
				/** Deprecated: The Azure deployment for the model. */
				azure_deployment?: string | null;
				/** Deprecated: The Azure endpoint for the model. */
				azure_endpoint?: string | null;
				/** Deprecated: The Azure version for the model. */
				azure_version?: string | null;
				/** Deprecated: The maximum batch size for processing embeddings. */
				batch_size?: number | null;
				/** Deprecated: The chunk size of the embedding. */
				embedding_chunk_size?: number | null;
				/** Deprecated: The endpoint for the model. */
				embedding_endpoint?: string | null;
				/** The handle for this config, in the format provider/model-name. */
				handle?: string | null;
				/** Type of model (llm or embedding) */
				model_type?: string | null;
		  }>
		| {
				/** Display name for the model shown in UI */
				display_name?: string | null;
				/** The dimension of the embedding */
				embedding_dim?: number | null;
				/** Deprecated: Use 'provider_type' field instead. The endpoint type for the embedding model. */
				embedding_endpoint_type?: string | null;
				/** Deprecated: Use 'name' field instead. Embedding model name. */
				embedding_model?: string | null;
				/** The actual model name used by the provider */
				name?: string | null;
				/** The name of the provider */
				provider_name?: string | null;
				/** The type of the provider */
				provider_type?: LettaProviderType | null;
				/** Deprecated: The Azure deployment for the model. */
				azure_deployment?: string | null;
				/** Deprecated: The Azure endpoint for the model. */
				azure_endpoint?: string | null;
				/** Deprecated: The Azure version for the model. */
				azure_version?: string | null;
				/** Deprecated: The maximum batch size for processing embeddings. */
				batch_size?: number | null;
				/** Deprecated: The chunk size of the embedding. */
				embedding_chunk_size?: number | null;
				/** Deprecated: The endpoint for the model. */
				embedding_endpoint?: string | null;
				/** The handle for this config, in the format provider/model-name. */
				handle?: string | null;
				/** Type of model (llm or embedding) */
				model_type?: string | null;
		  };
	'models.list':
		| Array<{
				/** Deprecated: Use 'max_context_window' field instead. The context window size for the model. */
				context_window?: number | null;
				/** The maximum context window for the model */
				max_context_window?: number | null;
				/** Deprecated: Use 'name' field instead. LLM model name. */
				model?: string | null;
				/** Deprecated: Use 'provider_type' field instead. The endpoint type for the model. */
				model_endpoint_type?: string | null;
				/** The actual model name used by the provider */
				name?: string | null;
				/** The type of the provider */
				provider_type?: LettaProviderType | null;
				/** Deprecated: The framework compatibility type for the model. */
				compatibility_type?: string | null;
				/** A human-friendly display name for the model. */
				display_name?: string | null;
				/** The effort level for Anthropic models that support it (Opus 4.5+). Controls token spending and thinking behavior. Not setting this gives similar performance to 'high'. */
				effort?: string | null;
				/** Deprecated: Whether or not the model should use extended thinking if it is a 'reasoning' style model. */
				enable_reasoner?: boolean | null;
				/** Deprecated: Positive values penalize new tokens based on their existing frequency in the text so far. */
				frequency_penalty?: number | null;
				/** The handle for this config, in the format provider/model-name. */
				handle?: string | null;
				/** Deprecated: Configurable thinking budget for extended thinking. */
				max_reasoning_tokens?: number | null;
				/** Deprecated: The maximum number of tokens to generate. */
				max_tokens?: number | null;
				/** Deprecated: The endpoint for the model. */
				model_endpoint?: string | null;
				/** Type of model (llm or embedding) */
				model_type?: string | null;
				/** Deprecated: The wrapper for the model. */
				model_wrapper?: string | null;
				/** Deprecated: If set to True, enables parallel tool calling. */
				parallel_tool_calls?: boolean | null;
				/** Deprecated: The provider category for the model. */
				provider_category?: LettaProviderCategory | null;
				/** The provider name for the model. */
				provider_name?: string | null;
				/** Deprecated: Puts 'inner_thoughts' as a kwarg in the function call. */
				put_inner_thoughts_in_kwargs?: boolean | null;
				/** Deprecated: The reasoning effort to use when generating text reasoning models. */
				reasoning_effort?: string | null;
				/** The response format for the model's output. Supports text, json_object, and json_schema (structured outputs). Can be set via model_settings. */
				response_format?:
					| (
							| LettaTextResponseFormat
							| LettaJsonSchemaResponseFormat
							| LettaJsonObjectResponseFormat
					  )
					| null;
				/** Whether to return log probabilities of the output tokens. Useful for RL training. */
				return_logprobs?: boolean | null;
				/** Whether to return token IDs for all LLM generations via SGLang native endpoint. Required for multi-turn RL training with loss masking. Only works with SGLang provider. */
				return_token_ids?: boolean | null;
				/** Enable strict mode for tool calling. When true, tool schemas include strict: true and additionalProperties: false, guaranteeing tool outputs match JSON schemas. */
				strict?: boolean | null;
				/** Deprecated: The temperature to use when generating text with the model. */
				temperature?: number | null;
				/** Deprecated: The cost tier for the model (cloud only). */
				tier?: string | null;
				/** SGLang tool call parser name (e.g. 'glm47', 'qwen25', 'hermes'). Used by the SGLang native adapter to parse tool calls from raw model output. */
				tool_call_parser?: string | null;
				/** Number of most likely tokens to return at each position (0-20). Requires return_logprobs=True. */
				top_logprobs?: number | null;
				/** Deprecated: Soft control for how verbose model output should be. */
				verbosity?: string | null;
		  }>
		| {
				/** Deprecated: Use 'max_context_window' field instead. The context window size for the model. */
				context_window?: number | null;
				/** The maximum context window for the model */
				max_context_window?: number | null;
				/** Deprecated: Use 'name' field instead. LLM model name. */
				model?: string | null;
				/** Deprecated: Use 'provider_type' field instead. The endpoint type for the model. */
				model_endpoint_type?: string | null;
				/** The actual model name used by the provider */
				name?: string | null;
				/** The type of the provider */
				provider_type?: LettaProviderType | null;
				/** Deprecated: The framework compatibility type for the model. */
				compatibility_type?: string | null;
				/** A human-friendly display name for the model. */
				display_name?: string | null;
				/** The effort level for Anthropic models that support it (Opus 4.5+). Controls token spending and thinking behavior. Not setting this gives similar performance to 'high'. */
				effort?: string | null;
				/** Deprecated: Whether or not the model should use extended thinking if it is a 'reasoning' style model. */
				enable_reasoner?: boolean | null;
				/** Deprecated: Positive values penalize new tokens based on their existing frequency in the text so far. */
				frequency_penalty?: number | null;
				/** The handle for this config, in the format provider/model-name. */
				handle?: string | null;
				/** Deprecated: Configurable thinking budget for extended thinking. */
				max_reasoning_tokens?: number | null;
				/** Deprecated: The maximum number of tokens to generate. */
				max_tokens?: number | null;
				/** Deprecated: The endpoint for the model. */
				model_endpoint?: string | null;
				/** Type of model (llm or embedding) */
				model_type?: string | null;
				/** Deprecated: The wrapper for the model. */
				model_wrapper?: string | null;
				/** Deprecated: If set to True, enables parallel tool calling. */
				parallel_tool_calls?: boolean | null;
				/** Deprecated: The provider category for the model. */
				provider_category?: LettaProviderCategory | null;
				/** The provider name for the model. */
				provider_name?: string | null;
				/** Deprecated: Puts 'inner_thoughts' as a kwarg in the function call. */
				put_inner_thoughts_in_kwargs?: boolean | null;
				/** Deprecated: The reasoning effort to use when generating text reasoning models. */
				reasoning_effort?: string | null;
				/** The response format for the model's output. Supports text, json_object, and json_schema (structured outputs). Can be set via model_settings. */
				response_format?:
					| (
							| LettaTextResponseFormat
							| LettaJsonSchemaResponseFormat
							| LettaJsonObjectResponseFormat
					  )
					| null;
				/** Whether to return log probabilities of the output tokens. Useful for RL training. */
				return_logprobs?: boolean | null;
				/** Whether to return token IDs for all LLM generations via SGLang native endpoint. Required for multi-turn RL training with loss masking. Only works with SGLang provider. */
				return_token_ids?: boolean | null;
				/** Enable strict mode for tool calling. When true, tool schemas include strict: true and additionalProperties: false, guaranteeing tool outputs match JSON schemas. */
				strict?: boolean | null;
				/** Deprecated: The temperature to use when generating text with the model. */
				temperature?: number | null;
				/** Deprecated: The cost tier for the model (cloud only). */
				tier?: string | null;
				/** SGLang tool call parser name (e.g. 'glm47', 'qwen25', 'hermes'). Used by the SGLang native adapter to parse tool calls from raw model output. */
				tool_call_parser?: string | null;
				/** Number of most likely tokens to return at each position (0-20). Requires return_logprobs=True. */
				top_logprobs?: number | null;
				/** Deprecated: Soft control for how verbose model output should be. */
				verbosity?: string | null;
		  };
	'passages.search': {
		/** The passage object */
		passage?: LettaPassage | null;
		/** Relevance score */
		score?: number | null;
		/** Additional metadata about the search result */
		metadata?: Record<string, LettaJsonValue> | null;
	};
	'runs.get': LettaRun;
	'runs.list': Array<{
		/** The human-friendly ID of the Run */
		id?: string | null;
		/** The unique identifier of the agent associated with the run. */
		agent_id?: string | null;
		/** Whether the run was created in background mode. */
		background?: boolean | null;
		/** The base template ID that the run belongs to. */
		base_template_id?: string | null;
		/** Optional error message from attempting to POST the callback endpoint. */
		callback_error?: string | null;
		/** Timestamp when the callback was last attempted. */
		callback_sent_at?: string | null;
		/** HTTP status code returned by the callback endpoint. */
		callback_status_code?: number | null;
		/** If set, POST to this URL when the run completes. */
		callback_url?: string | null;
		/** The timestamp when the run was completed. */
		completed_at?: string | null;
		/** The unique identifier of the conversation associated with the run. */
		conversation_id?: string | null;
		/** The timestamp when the run was created. */
		created_at?: string | null;
		/** Additional metadata for the run. */
		metadata?: Record<string, LettaJsonValue> | null;
		/** The request configuration for the run. */
		request_config?: {
			/** The name of the message argument in the designated message tool. */
			assistant_message_tool_kwarg?: string | null;
			/** The name of the designated message tool. */
			assistant_message_tool_name?: string | null;
			/** Only return specified message types in the response. If `None` (default) returns all messages. */
			include_return_message_types?: Array<LettaMessageType> | null;
			/** Whether the server should parse specific tool call arguments (default `send_message`) as `AssistantMessage` objects. */
			use_assistant_message?: boolean | null;
		} | null;
		/** The current status of the run. */
		status?: string | null;
		/** The reason why the run was stopped. */
		stop_reason?: LettaStopReasonType | null;
		/** Total run duration in nanoseconds */
		total_duration_ns?: number | null;
		/** Time to first token for a run in nanoseconds */
		ttft_ns?: number | null;
	}>;
	'runs.messages.list': Array<LettaMessage>;
	'runs.messages.stream': {
		/** The response body as text. */
		text: string;
		/** The content type Letta answered with. */
		contentType: string | null;
	};
	'runs.steps.list': Array<{
		/** The id of the step. Assigned by the database. */
		id?: string | null;
		/** The ID of the agent that performed the step. */
		agent_id?: string | null;
		/** The number of input tokens written to cache (Anthropic only). None if not reported by provider. */
		cache_write_tokens?: number | null;
		/** The number of input tokens served from cache. None if not reported by provider. */
		cached_input_tokens?: number | null;
		/** The number of tokens generated by the agent during this step. */
		completion_tokens?: number | null;
		/** Detailed completion token breakdown (e.g., reasoning_tokens). */
		completion_tokens_details?: Record<string, LettaJsonValue> | null;
		/** The context window limit configured for this step. */
		context_window_limit?: number | null;
		/** Error details including message, traceback, and additional context */
		error_data?: Record<string, LettaJsonValue> | null;
		/** The type/class of the error that occurred */
		error_type?: string | null;
		/** The feedback for this step. Must be either 'positive' or 'negative'. */
		feedback?: string | null;
		/** The messages generated during this step. Deprecated: use `GET /v1/steps/{step_id}/messages` endpoint instead */
		messages?: Array<LettaInternalMessage> | null;
		/** The name of the model used for this step. */
		model?: string | null;
		/** The model endpoint url used for this step. */
		model_endpoint?: string | null;
		/** The model handle (e.g., 'openai/gpt-4o-mini') used for this step. */
		model_handle?: string | null;
		/** The surface that this agent step was initiated from. */
		origin?: string | null;
		/** The project that the agent that executed this step belongs to (cloud only). */
		project_id?: string | null;
		/** The number of tokens in the prompt during this step. */
		prompt_tokens?: number | null;
		/** Detailed prompt token breakdown (e.g., cached_tokens, cache_read_tokens, cache_creation_tokens). */
		prompt_tokens_details?: Record<string, LettaJsonValue> | null;
		/** The category of the provider used for this step. */
		provider_category?: string | null;
		/** The unique identifier of the provider that was configured for this step */
		provider_id?: string | null;
		/** The name of the provider used for this step. */
		provider_name?: string | null;
		/** The number of reasoning/thinking tokens generated. None if not reported by provider. */
		reasoning_tokens?: number | null;
		/** The API request log ID from cloud-api for correlating steps with API requests. */
		request_id?: string | null;
		/** The unique identifier of the run that this step belongs to. Only included for async calls. */
		run_id?: string | null;
		/** Status of a step execution */
		status?: string | null;
		/** The stop reason associated with the step. */
		stop_reason?: LettaStopReasonType | null;
		/** Metadata tags. */
		tags?: Array<string> | null;
		/** The unique identifier of the transaction that processed this step. */
		tid?: string | null;
		/** The total number of tokens processed by the agent during this step. */
		total_tokens?: number | null;
		/** The trace id of the agent step. */
		trace_id?: string | null;
	}>;
	'runs.trace.get':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'runs.usage.get': {
		completion_tokens?: number | null;
		completion_tokens_details?: {
			reasoning_tokens?: number | null;
		} | null;
		prompt_tokens?: number | null;
		prompt_tokens_details?: {
			cache_creation_tokens?: number | null;
			cache_read_tokens?: number | null;
			cached_tokens?: number | null;
		} | null;
		total_tokens?: number | null;
	};
	'steps.feedback.create': LettaStep;
	'steps.get': LettaStep;
	'steps.list': Array<{
		/** The id of the step. Assigned by the database. */
		id?: string | null;
		/** The ID of the agent that performed the step. */
		agent_id?: string | null;
		/** The number of input tokens written to cache (Anthropic only). None if not reported by provider. */
		cache_write_tokens?: number | null;
		/** The number of input tokens served from cache. None if not reported by provider. */
		cached_input_tokens?: number | null;
		/** The number of tokens generated by the agent during this step. */
		completion_tokens?: number | null;
		/** Detailed completion token breakdown (e.g., reasoning_tokens). */
		completion_tokens_details?: Record<string, LettaJsonValue> | null;
		/** The context window limit configured for this step. */
		context_window_limit?: number | null;
		/** Error details including message, traceback, and additional context */
		error_data?: Record<string, LettaJsonValue> | null;
		/** The type/class of the error that occurred */
		error_type?: string | null;
		/** The feedback for this step. Must be either 'positive' or 'negative'. */
		feedback?: string | null;
		/** The messages generated during this step. Deprecated: use `GET /v1/steps/{step_id}/messages` endpoint instead */
		messages?: Array<LettaInternalMessage> | null;
		/** The name of the model used for this step. */
		model?: string | null;
		/** The model endpoint url used for this step. */
		model_endpoint?: string | null;
		/** The model handle (e.g., 'openai/gpt-4o-mini') used for this step. */
		model_handle?: string | null;
		/** The surface that this agent step was initiated from. */
		origin?: string | null;
		/** The project that the agent that executed this step belongs to (cloud only). */
		project_id?: string | null;
		/** The number of tokens in the prompt during this step. */
		prompt_tokens?: number | null;
		/** Detailed prompt token breakdown (e.g., cached_tokens, cache_read_tokens, cache_creation_tokens). */
		prompt_tokens_details?: Record<string, LettaJsonValue> | null;
		/** The category of the provider used for this step. */
		provider_category?: string | null;
		/** The unique identifier of the provider that was configured for this step */
		provider_id?: string | null;
		/** The name of the provider used for this step. */
		provider_name?: string | null;
		/** The number of reasoning/thinking tokens generated. None if not reported by provider. */
		reasoning_tokens?: number | null;
		/** The API request log ID from cloud-api for correlating steps with API requests. */
		request_id?: string | null;
		/** The unique identifier of the run that this step belongs to. Only included for async calls. */
		run_id?: string | null;
		/** Status of a step execution */
		status?: string | null;
		/** The stop reason associated with the step. */
		stop_reason?: LettaStopReasonType | null;
		/** Metadata tags. */
		tags?: Array<string> | null;
		/** The unique identifier of the transaction that processed this step. */
		tid?: string | null;
		/** The total number of tokens processed by the agent during this step. */
		total_tokens?: number | null;
		/** The trace id of the agent step. */
		trace_id?: string | null;
	}>;
	'steps.messages.list': Array<LettaMessage>;
	'steps.metrics.get': {
		/** The id of the step this metric belongs to (matches steps.id). */
		id?: string | null;
		/** The unique identifier of the agent. */
		agent_id?: string | null;
		/** The base template ID that the step belongs to (cloud only). */
		base_template_id?: string | null;
		/** Time spent on LLM requests in nanoseconds. */
		llm_request_ns?: number | null;
		/** The timestamp of the start of the llm request in nanoseconds. */
		llm_request_start_ns?: number | null;
		/** The project that the step belongs to (cloud only). */
		project_id?: string | null;
		/** The unique identifier of the provider. */
		provider_id?: string | null;
		/** The unique identifier of the run. */
		run_id?: string | null;
		/** Total time for the step in nanoseconds. */
		step_ns?: number | null;
		/** The timestamp of the start of the step in nanoseconds. */
		step_start_ns?: number | null;
		/** The template ID that the step belongs to (cloud only). */
		template_id?: string | null;
		/** Time spent on tool execution in nanoseconds. */
		tool_execution_ns?: number | null;
	};
	'steps.trace.get': LettaProviderTrace;
	'tags.list':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'templates.agents.create': {
		/** Array of created agent IDs */
		agent_ids?: Array<string> | null;
		/** The deployment ID for the created agents */
		deployment_id?: string | null;
		/** Optional group ID if agents were created in a group */
		group_id?: string | null;
	};
	'templates.create': {
		id?: string | null;
		/** The latest version of the template */
		latest_version?: string | null;
		/** The exact name of the template */
		name?: string | null;
		project_id?: string | null;
		project_slug?: string | null;
		/** The full name of the template, including version and project slug */
		template_deployment_slug?: string | null;
		/** When the template was last updated */
		updated_at?: string | null;
		description?: string | null;
	};
	'templates.delete': {
		success?: boolean | null;
	};
	'templates.rollback': {
		success?: boolean | null;
		message?: string | null;
	};
	'templates.save': {
		id?: string | null;
		/** The latest version of the template */
		latest_version?: string | null;
		/** The exact name of the template */
		name?: string | null;
		project_id?: string | null;
		project_slug?: string | null;
		/** The full name of the template, including version and project slug */
		template_deployment_slug?: string | null;
		/** When the template was last updated */
		updated_at?: string | null;
		description?: string | null;
	};
	'templates.update': {
		success?: boolean | null;
		message?: string | null;
	};
	'tools.create': LettaTool;
	'tools.delete':
		| LettaJsonValue
		| {
				/** Letta accepted the call; it answered with no body. */ success: true;
		  };
	'tools.get': LettaTool;
	'tools.list': Array<{
		/** The human-friendly ID of the Tool */
		id?: string | null;
		/** The args JSON schema of the function. */
		args_json_schema?: Record<string, LettaJsonValue> | null;
		/** The id of the user that made this Tool. */
		created_by_id?: string | null;
		/** Default value for whether or not executing this tool requires approval. */
		default_requires_approval?: boolean | null;
		/** The description of the tool. */
		description?: string | null;
		/** If set to True, then this tool will potentially be executed concurrently with other tools. Default False. */
		enable_parallel_execution?: boolean | null;
		/** The JSON schema of the function. */
		json_schema?: Record<string, LettaJsonValue> | null;
		/** The id of the user that made this Tool. */
		last_updated_by_id?: string | null;
		/** A dictionary of additional metadata for the tool. */
		metadata_?: Record<string, LettaJsonValue> | null;
		/** The name of the function. */
		name?: string | null;
		/** Optional list of npm packages required by this tool. */
		npm_requirements?: Array<LettaNpmRequirement> | null;
		/** Optional list of pip packages required by this tool. */
		pip_requirements?: Array<LettaPipRequirement> | null;
		/** The project id of the tool. */
		project_id?: string | null;
		/** The maximum number of characters in the response. */
		return_char_limit?: number | null;
		/** The source code of the function. */
		source_code?: string | null;
		/** The type of the source code. */
		source_type?: string | null;
		/** Metadata tags. */
		tags?: Array<string> | null;
		/** The type of the tool. */
		tool_type?: LettaToolType | null;
	}>;
	'tools.search': Array<LettaToolSearchResult>;
	'tools.update': LettaTool;
	'tools.upsert': LettaTool;
};
