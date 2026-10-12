import { z } from 'zod';

// ── JSON values ────────────────────────────────────────────────────────

const JsonPrimitiveSchema = z
	.union([z.string(), z.number(), z.boolean(), z.null()])
	.describe('Primitive JSON value');

export type JsonValue =
	| z.infer<typeof JsonPrimitiveSchema>
	| { [key: string]: JsonValue }
	| JsonValue[];

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z
		.union([
			JsonPrimitiveSchema,
			z.array(JsonValueSchema),
			z.record(z.string(), JsonValueSchema),
		])
		.describe('Arbitrary JSON value'),
);

export const JsonObjectSchema = z
	.record(z.string(), JsonValueSchema)
	.describe('JSON object mapping string keys to JSON values');
export type JsonObject = z.infer<typeof JsonObjectSchema>;

/** Path segments sent upstream. Blocks traversal and injection. */
const PathId = z
	.string()
	.min(1)
	.regex(/^[a-zA-Z0-9_-]+$/);

const PageFields = {
	next_cursor: z.string().nullable().optional(),
	total_pages: z.number(),
	current_page: z.number(),
	total_items: z.number(),
};

// ── Tools ──────────────────────────────────────────────────────────────

const ToolsListInputSchema = z.object({
	toolkit_slug: z.string().optional(),
	tool_slugs: z.string().optional().describe('Comma-separated tool slugs'),
	query: z.string().optional(),
	important: z.enum(['true', 'false']).optional(),
	include_deprecated: z.boolean().optional(),
	toolkit_versions: z.string().optional(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
});
export type ToolsListInput = z.infer<typeof ToolsListInputSchema>;

const ToolSchema = z.object({
	slug: z.string(),
	name: z.string(),
	description: z.string(),
	toolkit: z.object({
		slug: z.string(),
		name: z.string(),
		logo: z.string().optional(),
	}),
	input_parameters: JsonObjectSchema,
	output_parameters: JsonObjectSchema,
	no_auth: z.boolean(),
	version: z.string(),
	available_versions: z.array(z.string()),
	scopes: z.array(z.string()).optional(),
	tags: z.array(z.string()),
	human_description: z.string().optional(),
	is_deprecated: z.boolean(),
});
export type Tool = z.infer<typeof ToolSchema>;

const ToolsListResponseSchema = z.object({
	items: z.array(ToolSchema),
	...PageFields,
});
export type ToolsListResponse = z.infer<typeof ToolsListResponseSchema>;

const ToolGetInputSchema = z.object({
	tool_slug: PathId,
	version: z.string().optional(),
});
export type ToolGetInput = z.infer<typeof ToolGetInputSchema>;

const ToolExecuteInputSchema = z.object({
	tool_slug: PathId,
	arguments: JsonObjectSchema.describe('Arguments the tool takes'),
	connected_account_id: z.string().optional(),
	user_id: z.string().optional(),
	version: z
		.string()
		.optional()
		.describe('Toolkit version. Composio runs the latest when omitted.'),
});
export type ToolExecuteInput = z.infer<typeof ToolExecuteInputSchema>;

const ToolExecuteResponseSchema = z.object({
	data: JsonObjectSchema,
	error: z.string().nullable(),
	successful: z.boolean(),
	log_id: z.string().optional(),
});
export type ToolExecuteResponse = z.infer<typeof ToolExecuteResponseSchema>;

// ── Connected accounts ─────────────────────────────────────────────────

const ConnectionsListInputSchema = z.object({
	toolkit_slugs: z.array(z.string()).optional(),
	statuses: z
		.array(
			z.enum([
				'INITIALIZING',
				'INITIATED',
				'ACTIVE',
				'FAILED',
				'EXPIRED',
				'INACTIVE',
				'REVOKED',
			]),
		)
		.optional(),
	user_ids: z.array(z.string()).optional(),
	auth_config_ids: z.array(z.string()).optional(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
	account_type: z.enum(['PRIVATE', 'SHARED', 'ALL']).optional(),
});
export type ConnectionsListInput = z.infer<typeof ConnectionsListInputSchema>;

const ConnectionSchema = z.object({
	id: z.string(),
	status: z.string(),
	user_id: z.string(),
	alias: z.string().nullable().optional(),
	created_at: z.string(),
	updated_at: z.string(),
	is_disabled: z.boolean(),
	toolkit: z.object({ slug: z.string() }),
	auth_config: z.object({
		id: z.string(),
		auth_scheme: z.string().optional(),
		is_composio_managed: z.boolean().optional(),
		is_disabled: z.boolean().optional(),
	}),
	authScheme: z.string().optional(),
	word_id: z.string().nullable().optional(),
	status_reason: z.string().nullable().optional(),
});
export type Connection = z.infer<typeof ConnectionSchema>;

const ConnectionsListResponseSchema = z.object({
	items: z.array(ConnectionSchema),
	...PageFields,
});
export type ConnectionsListResponse = z.infer<
	typeof ConnectionsListResponseSchema
>;

const ConnectionCreateInputSchema = z.object({
	auth_config_id: z.string(),
	user_id: z.string(),
	alias: z.string().optional(),
	callback_url: z.string().optional(),
});
export type ConnectionCreateInput = z.infer<typeof ConnectionCreateInputSchema>;

const ConnectionCreateResponseSchema = z.object({
	link_token: z.string(),
	redirect_url: z.string(),
	expires_at: z.string(),
	connected_account_id: z.string(),
});
export type ConnectionCreateResponse = z.infer<
	typeof ConnectionCreateResponseSchema
>;

const ConnectionDeleteInputSchema = z.object({
	connected_account_id: PathId,
	revoke_on_delete: z.boolean().optional(),
});
export type ConnectionDeleteInput = z.infer<typeof ConnectionDeleteInputSchema>;

const ConnectionDeleteResponseSchema = z.object({
	success: z.boolean(),
	revoke_job_id: z.string().optional(),
});
export type ConnectionDeleteResponse = z.infer<
	typeof ConnectionDeleteResponseSchema
>;

// ── Toolkits ───────────────────────────────────────────────────────────

const ToolkitsListInputSchema = z.object({
	category: z.string().optional(),
	managed_by: z.enum(['composio', 'all', 'project']).optional(),
	type: z.enum(['native', 'custom', 'all']).optional(),
	sort_by: z.enum(['usage', 'alphabetically']).optional(),
	search: z.string().optional(),
	include_deprecated: z.boolean().optional(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
});
export type ToolkitsListInput = z.infer<typeof ToolkitsListInputSchema>;

export const ComposioToolkitMeta = z.object({
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	description: z.string().optional(),
	logo: z.string().optional(),
	app_url: z.string().nullable().optional(),
	categories: z
		.array(z.object({ id: z.string(), name: z.string() }))
		.optional(),
	triggers_count: z.number().optional(),
	tools_count: z.number().optional(),
	version: z.string().optional(),
});

const ToolkitSchema = z.object({
	slug: z.string(),
	name: z.string(),
	type: z.string(),
	auth_schemes: z.array(z.string()).optional(),
	no_auth: z.boolean().optional(),
	composio_managed_auth_schemes: z.array(z.string()).optional(),
	is_local_toolkit: z.boolean().optional(),
	auth_guide_url: z.string().nullable().optional(),
	meta: ComposioToolkitMeta,
});
export type Toolkit = z.infer<typeof ToolkitSchema>;

const ToolkitsListResponseSchema = z.object({
	items: z.array(ToolkitSchema),
	...PageFields,
});
export type ToolkitsListResponse = z.infer<typeof ToolkitsListResponseSchema>;

// ── Sessions (tool router) ─────────────────────────────────────────────

const SessionCreateInputSchema = z.object({
	user_id: z.string().min(1),
	toolkits: z
		.union([
			z.object({ enable: z.array(z.string()) }),
			z.object({ disable: z.array(z.string()) }),
		])
		.optional()
		.describe('Allowlist (enable) or denylist (disable) of toolkit slugs'),
});
export type SessionCreateInput = z.infer<typeof SessionCreateInputSchema>;

const SessionCreateResponseSchema = z.object({
	session_id: z.string(),
	mcp: z.object({ type: z.literal('http'), url: z.string() }),
	tool_router_tools: z.array(z.string()),
	config: z.object({ user_id: z.string().optional() }).optional(),
	config_version: z.number().optional(),
});
export type SessionCreateResponse = z.infer<typeof SessionCreateResponseSchema>;

// ── Composio meta tools ────────────────────────────────────────────────
// Argument shapes follow https://docs.composio.dev/toolkits/composio.

const SessionIdArg = z
	.string()
	.optional()
	.describe('session_id returned by a prior COMPOSIO_SEARCH_TOOLS call');

const StepArgs = {
	current_step: z.string().optional(),
	current_step_metric: z
		.string()
		.optional()
		.describe('Progress as "done/total units", e.g. "3/10 pages"'),
};

const WaitModeArg = z.enum(['any', 'all']).optional();

const ConnectionCheckRequestSchema = z.object({
	toolkit: z.string().optional(),
	connected_account_id: z.string().optional(),
});

// Tools Composio runs through POST /tools/execute/{slug}.
const DirectToolArgs = {
	checkActiveConnection: ConnectionCheckRequestSchema,
	checkActiveConnections: z.object({
		requests: z.array(ConnectionCheckRequestSchema),
	}),
	createPlan: z.object({
		difficulty: z.enum(['medium', 'hard']),
		known_fields: z
			.string()
			.describe('Comma-separated key:value pairs, e.g. "channel_name:general"'),
		primary_tool_slugs: z.array(z.string()),
		reasoning: z.string(),
		use_case: z.string(),
		related_tool_slugs: z.array(z.string()).optional(),
		session_id: SessionIdArg,
	}),
	enableTrigger: z.object({
		connected_account_id: z.string(),
		toolkit_slug: z.string(),
		trigger_name: z.string(),
		config_params: JsonObjectSchema.optional(),
		user_id: z.string().optional(),
	}),
	executeTool: z.object({
		tool_slug: z.string(),
		arguments: JsonObjectSchema,
		connected_account_id: z.string().optional(),
		allow_destructive: z.boolean().optional(),
	}),
	getDependencyGraph: z.object({ tool_name: z.string() }),
	getRequiredParameters: z.object({ toolkit: z.string() }),
	getResponseSchema: z.object({ tool: z.string() }),
	initiateConnection: z.object({
		toolkit: z.string(),
		parameters: z
			.record(z.string(), z.string())
			.optional()
			.describe('Auth parameters, e.g. { generic_api_key: "..." }'),
	}),
	listToolkits: z.object({
		category: z.string().optional(),
		name_filter: z.string().optional(),
		min_tools: z.number().int().optional(),
		no_auth_only: z.boolean().optional(),
		size: z.number().int().optional(),
	}),
	listTriggers: z.object({ toolkit_names: z.array(z.string()).optional() }),
	waitForConnection: z.object({
		toolkits: z.array(z.string()),
		mode: WaitModeArg,
		timeout_seconds: z.number().int().max(600).optional(),
	}),
};

// Tools Composio only runs inside a session, through
// POST /tool_router/session/{session_id}/execute_meta.
const SessionToolArgs = {
	getToolSchemas: z.object({
		tool_slugs: z.array(z.string()),
		include: z.array(z.enum(['input_schema', 'output_schema'])).optional(),
		session_id: SessionIdArg,
	}),
	manageConnections: z.object({
		toolkits: z.array(z.string()),
		reinitiate_all: z.boolean().optional(),
		session_id: SessionIdArg,
	}),
	multiExecuteTool: z.object({
		tools: z.array(
			z.object({
				tool_slug: z.string(),
				arguments: JsonObjectSchema,
			}),
		),
		sync_response_to_workbench: z.boolean(),
		memory: z
			.record(z.string(), z.array(z.string()))
			.optional()
			.describe('App name to durable facts, e.g. { slack: ["..."] }'),
		thought: z.string().optional(),
		...StepArgs,
		session_id: SessionIdArg,
	}),
	remoteBashTool: z.object({
		command: z.string(),
		session_id: SessionIdArg,
	}),
	remoteWorkbench: z.object({
		code_to_execute: z
			.string()
			.describe('Python run in the persistent remote Jupyter sandbox'),
		thought: z.string().optional(),
		...StepArgs,
		session_id: SessionIdArg,
	}),
	searchTools: z.object({
		queries: z.array(
			z.object({
				use_case: z.string(),
				known_fields: z.string().optional(),
			}),
		),
		session: z
			.union([
				z.object({ generate_id: z.literal(true) }),
				z.object({ id: z.string() }),
			])
			.optional(),
		model: z.string().optional(),
		search_strategy: z.enum(['auto', 'tool_search']).optional(),
	}),
	waitForConnections: z.object({
		toolkits: z.array(z.string()),
		mode: WaitModeArg,
		session_id: SessionIdArg,
	}),
};

type DirectToolName = keyof typeof DirectToolArgs;
type SessionToolName = keyof typeof SessionToolArgs;
export type MetaToolName = DirectToolName | SessionToolName;

/** The corsair.dev operation id behind each endpoint. */
export const META_TOOL_SLUGS = {
	checkActiveConnection: 'COMPOSIO_CHECK_ACTIVE_CONNECTION',
	checkActiveConnections: 'COMPOSIO_CHECK_ACTIVE_CONNECTIONS',
	createPlan: 'COMPOSIO_CREATE_PLAN',
	enableTrigger: 'COMPOSIO_ENABLE_TRIGGER',
	executeTool: 'COMPOSIO_EXECUTE_TOOL',
	getDependencyGraph: 'COMPOSIO_GET_DEPENDENCY_GRAPH',
	getRequiredParameters: 'COMPOSIO_GET_REQUIRED_PARAMETERS',
	getResponseSchema: 'COMPOSIO_GET_RESPONSE_SCHEMA',
	initiateConnection: 'COMPOSIO_INITIATE_CONNECTION',
	listToolkits: 'COMPOSIO_LIST_TOOLKITS',
	listTriggers: 'COMPOSIO_LIST_TRIGGERS',
	waitForConnection: 'COMPOSIO_WAIT_FOR_CONNECTION',
	getToolSchemas: 'COMPOSIO_GET_TOOL_SCHEMAS',
	manageConnections: 'COMPOSIO_MANAGE_CONNECTIONS',
	multiExecuteTool: 'COMPOSIO_MULTI_EXECUTE_TOOL',
	remoteBashTool: 'COMPOSIO_REMOTE_BASH_TOOL',
	remoteWorkbench: 'COMPOSIO_REMOTE_WORKBENCH',
	searchTools: 'COMPOSIO_SEARCH_TOOLS',
	waitForConnections: 'COMPOSIO_WAIT_FOR_CONNECTIONS',
} as const satisfies Record<MetaToolName, `COMPOSIO_${string}`>;

function directInput<S extends z.ZodType>(args: S) {
	return z.object({
		arguments: args,
		user_id: z.string().optional().describe('Composio user the call runs for'),
		version: z
			.string()
			.optional()
			.describe('Toolkit version. Composio runs the latest when omitted.'),
	});
}

function sessionInput<S extends z.ZodType>(args: S) {
	return z.object({
		session_id: PathId.describe('Session id from sessions.create'),
		arguments: args,
	});
}

const DirectToolResultSchema = z.object({
	data: JsonObjectSchema,
	error: z.string().nullable(),
	successful: z.boolean(),
	log_id: z.string().optional(),
});
export type DirectToolResult = z.infer<typeof DirectToolResultSchema>;

const SessionToolResultSchema = z.discriminatedUnion('result_type', [
	z.object({
		result_type: z.enum(['completed', 'failed']),
		data: JsonObjectSchema,
		error: z.string().nullable(),
		log_id: z.string(),
	}),
	z.object({
		result_type: z.literal('input_required'),
		input_requests: z
			.record(z.string(), JsonObjectSchema)
			.describe('Questions for the user, keyed by the id answers reuse'),
		request_state: z.string().optional(),
	}),
]);
export type SessionToolResult = z.infer<typeof SessionToolResultSchema>;

const MetaToolInputSchemas = {
	checkActiveConnection: directInput(DirectToolArgs.checkActiveConnection),
	checkActiveConnections: directInput(DirectToolArgs.checkActiveConnections),
	createPlan: directInput(DirectToolArgs.createPlan),
	enableTrigger: directInput(DirectToolArgs.enableTrigger),
	executeTool: directInput(DirectToolArgs.executeTool),
	getDependencyGraph: directInput(DirectToolArgs.getDependencyGraph),
	getRequiredParameters: directInput(DirectToolArgs.getRequiredParameters),
	getResponseSchema: directInput(DirectToolArgs.getResponseSchema),
	initiateConnection: directInput(DirectToolArgs.initiateConnection),
	listToolkits: directInput(DirectToolArgs.listToolkits),
	listTriggers: directInput(DirectToolArgs.listTriggers),
	waitForConnection: directInput(DirectToolArgs.waitForConnection),
	getToolSchemas: sessionInput(SessionToolArgs.getToolSchemas),
	manageConnections: sessionInput(SessionToolArgs.manageConnections),
	multiExecuteTool: sessionInput(SessionToolArgs.multiExecuteTool),
	remoteBashTool: sessionInput(SessionToolArgs.remoteBashTool),
	remoteWorkbench: sessionInput(SessionToolArgs.remoteWorkbench),
	searchTools: sessionInput(SessionToolArgs.searchTools),
	waitForConnections: sessionInput(SessionToolArgs.waitForConnections),
} as const;

const MetaToolOutputSchemas = {
	checkActiveConnection: DirectToolResultSchema,
	checkActiveConnections: DirectToolResultSchema,
	createPlan: DirectToolResultSchema,
	enableTrigger: DirectToolResultSchema,
	executeTool: DirectToolResultSchema,
	getDependencyGraph: DirectToolResultSchema,
	getRequiredParameters: DirectToolResultSchema,
	getResponseSchema: DirectToolResultSchema,
	initiateConnection: DirectToolResultSchema,
	listToolkits: DirectToolResultSchema,
	listTriggers: DirectToolResultSchema,
	waitForConnection: DirectToolResultSchema,
	getToolSchemas: SessionToolResultSchema,
	manageConnections: SessionToolResultSchema,
	multiExecuteTool: SessionToolResultSchema,
	remoteBashTool: SessionToolResultSchema,
	remoteWorkbench: SessionToolResultSchema,
	searchTools: SessionToolResultSchema,
	waitForConnections: SessionToolResultSchema,
} as const satisfies Record<DirectToolName, typeof DirectToolResultSchema> &
	Record<SessionToolName, typeof SessionToolResultSchema>;

type MetaToolInputs = {
	[K in MetaToolName]: z.infer<(typeof MetaToolInputSchemas)[K]>;
};

type MetaToolOutputs = {
	[K in MetaToolName]: z.infer<(typeof MetaToolOutputSchemas)[K]>;
};

// ── Endpoint maps ──────────────────────────────────────────────────────

export type ComposioEndpointInputs = MetaToolInputs & {
	toolsList: ToolsListInput;
	toolGet: ToolGetInput;
	toolExecute: ToolExecuteInput;
	connectionsList: ConnectionsListInput;
	connectionCreate: ConnectionCreateInput;
	connectionDelete: ConnectionDeleteInput;
	toolkitsList: ToolkitsListInput;
	sessionCreate: SessionCreateInput;
};

export type ComposioEndpointOutputs = MetaToolOutputs & {
	toolsList: ToolsListResponse;
	toolGet: Tool;
	toolExecute: ToolExecuteResponse;
	connectionsList: ConnectionsListResponse;
	connectionCreate: ConnectionCreateResponse;
	connectionDelete: ConnectionDeleteResponse;
	toolkitsList: ToolkitsListResponse;
	sessionCreate: SessionCreateResponse;
};

export const ComposioEndpointInputSchemas = {
	...MetaToolInputSchemas,
	toolsList: ToolsListInputSchema,
	toolGet: ToolGetInputSchema,
	toolExecute: ToolExecuteInputSchema,
	connectionsList: ConnectionsListInputSchema,
	connectionCreate: ConnectionCreateInputSchema,
	connectionDelete: ConnectionDeleteInputSchema,
	toolkitsList: ToolkitsListInputSchema,
	sessionCreate: SessionCreateInputSchema,
} as const;

export const ComposioEndpointOutputSchemas = {
	...MetaToolOutputSchemas,
	toolsList: ToolsListResponseSchema,
	toolGet: ToolSchema,
	toolExecute: ToolExecuteResponseSchema,
	connectionsList: ConnectionsListResponseSchema,
	connectionCreate: ConnectionCreateResponseSchema,
	connectionDelete: ConnectionDeleteResponseSchema,
	toolkitsList: ToolkitsListResponseSchema,
	sessionCreate: SessionCreateResponseSchema,
} as const;
