import { z } from 'zod';

// Loose passthrough — Composio response shapes evolve; don't invent fields.
const JsonObject = z.record(z.string(), z.unknown());

/** Path / id segments sent upstream — block traversal / injection. */
const PathId = z
	.string()
	.min(1)
	.regex(/^[a-zA-Z0-9_-]+$/);

// ── Tools (v3: executable actions) ─────────────────────────────────────

const ToolsListInputSchema = z.object({
	toolkit_slug: z.string().optional(),
	tool_slugs: z.string().optional(),
	query: z.string().optional(),
	/** @deprecated use query */
	search: z.string().optional(),
	important: z.enum(['true', 'false']).optional(),
	include_deprecated: z.boolean().optional(),
	toolkit_versions: z.string().optional(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
});

export type ToolsListInput = z.infer<typeof ToolsListInputSchema>;

const ToolSchema = z
	.object({
		slug: z.string(),
		name: z.string(),
		description: z.string().optional(),
		toolkit: z
			.object({
				slug: z.string(),
				name: z.string().optional(),
				logo: z.string().optional(),
			})
			.passthrough()
			.optional(),
		input_parameters: JsonObject.optional(),
		output_parameters: JsonObject.optional(),
		no_auth: z.boolean().optional(),
		version: z.string().optional(),
		tags: z.array(z.string()).optional(),
		is_deprecated: z.boolean().optional(),
	})
	.passthrough();

export type Tool = z.infer<typeof ToolSchema>;

const PaginatedToolsSchema = z
	.object({
		items: z.array(ToolSchema),
		next_cursor: z.string().nullable().optional(),
		total_pages: z.number().optional(),
		current_page: z.number().optional(),
		total_items: z.number().optional(),
	})
	.passthrough();

export type ToolsListResponse = z.infer<typeof PaginatedToolsSchema>;

const ToolGetInputSchema = z.object({
	tool_slug: PathId,
	version: z.string().optional(),
	toolkit_versions: z.string().optional(),
});

export type ToolGetInput = z.infer<typeof ToolGetInputSchema>;

export type ToolGetResponse = Tool;

// ── Actions (aliases over tools — kept for PR surface) ─────────────────

const ActionsListInputSchema = z.object({
	toolkit_slug: z.string().optional(),
	/** @deprecated use toolkit_slug */
	appName: z.string().optional(),
	query: z.string().optional(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
	toolkit_versions: z.string().optional(),
});

export type ActionsListInput = z.infer<typeof ActionsListInputSchema>;

export type ActionsListResponse = ToolsListResponse;

const ActionGetInputSchema = z
	.object({
		tool_slug: PathId.optional(),
		/** @deprecated use tool_slug */
		actionId: PathId.optional(),
	})
	.refine(
		(data) => data.tool_slug !== undefined || data.actionId !== undefined,
		{ message: 'Either tool_slug or actionId is required' },
	);

export type ActionGetInput = z.infer<typeof ActionGetInputSchema>;

export type ActionGetResponse = Tool;

const ActionExecuteInputSchema = z
	.object({
		tool_slug: PathId.optional(),
		/** @deprecated use tool_slug */
		actionId: PathId.optional(),
		arguments: JsonObject.optional(),
		/** @deprecated use arguments */
		input: JsonObject.optional(),
		text: z.string().optional(),
		connected_account_id: PathId.optional(),
		/** @deprecated use connected_account_id */
		connectionId: PathId.optional(),
		user_id: z.string().optional(),
		version: z.string().optional(),
		toolkit_versions: z.string().optional(),
	})
	.refine(
		(data) => data.tool_slug !== undefined || data.actionId !== undefined,
		{ message: 'Either tool_slug or actionId is required' },
	);

export type ActionExecuteInput = z.infer<typeof ActionExecuteInputSchema>;

const ActionExecuteResponseSchema = z
	.object({
		data: JsonObject.optional(),
		error: z.string().nullable().optional(),
		successful: z.boolean().optional(),
		log_id: z.string().optional(),
		// Session metadata is an opaque, provider-defined descriptor whose shape
		// is undocumented; keep it loosely typed rather than invent fields.
		session_info: z.unknown().optional(),
	})
	.passthrough();

export type ActionExecuteResponse = z.infer<typeof ActionExecuteResponseSchema>;

// ── Connections → connected_accounts ───────────────────────────────────

const ConnectionsListInputSchema = z.object({
	toolkit_slugs: z.string().optional(),
	/** @deprecated use toolkit_slugs */
	appName: z.string().optional(),
	statuses: z.string().optional(),
	user_ids: z.string().optional(),
	auth_config_ids: z.string().optional(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
	account_type: z.enum(['PRIVATE', 'SHARED', 'ALL']).optional(),
});

export type ConnectionsListInput = z.infer<typeof ConnectionsListInputSchema>;

const ConnectionSchema = z
	.object({
		id: z.string(),
		status: z.string(),
		user_id: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		toolkit: z
			.object({
				slug: z.string(),
			})
			.passthrough()
			.optional(),
		auth_config: z
			.object({
				id: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export type Connection = z.infer<typeof ConnectionSchema>;

const ConnectionsListResponseSchema = z
	.object({
		items: z.array(ConnectionSchema),
		next_cursor: z.string().nullable().optional(),
		total_pages: z.number().optional(),
		current_page: z.number().optional(),
		total_items: z.number().optional(),
	})
	.passthrough();

export type ConnectionsListResponse = z.infer<
	typeof ConnectionsListResponseSchema
>;

const ConnectionCreateInputSchema = z.object({
	auth_config_id: z.string(),
	user_id: z.string(),
	alias: z.string().optional(),
	callback_url: z.string().optional(),
	/** @deprecated use callback_url */
	redirectUri: z.string().optional(),
});

export type ConnectionCreateInput = z.infer<typeof ConnectionCreateInputSchema>;

const ConnectionCreateResponseSchema = z
	.object({
		link_token: z.string().optional(),
		redirect_url: z.string().optional(),
		expires_at: z.string().optional(),
		connected_account_id: z.string().optional(),
	})
	.passthrough();

export type ConnectionCreateResponse = z.infer<
	typeof ConnectionCreateResponseSchema
>;

const ConnectionDeleteInputSchema = z
	.object({
		connected_account_id: PathId.optional(),
		/** @deprecated use connected_account_id */
		connectionId: PathId.optional(),
		revoke_on_delete: z.boolean().optional(),
	})
	.refine(
		(data) =>
			data.connected_account_id !== undefined ||
			data.connectionId !== undefined,
		{ message: 'Either connected_account_id or connectionId is required' },
	);

export type ConnectionDeleteInput = z.infer<typeof ConnectionDeleteInputSchema>;

const ConnectionDeleteResponseSchema = z
	.object({
		success: z.boolean(),
		revoke_job_id: z.string().optional(),
	})
	.passthrough();

export type ConnectionDeleteResponse = z.infer<
	typeof ConnectionDeleteResponseSchema
>;

// ── Apps → toolkits ────────────────────────────────────────────────────

const AppsListInputSchema = z.object({
	category: z.string().optional(),
	managed_by: z.enum(['composio', 'all', 'project']).optional(),
	type: z.enum(['native', 'custom', 'all']).optional(),
	sort_by: z.enum(['usage', 'alphabetically']).optional(),
	search: z.string().optional(),
	include_deprecated: z.boolean().optional(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
});

export type AppsListInput = z.infer<typeof AppsListInputSchema>;

const AppSchema = z
	.object({
		slug: z.string(),
		name: z.string(),
		type: z.string().optional(),
		auth_schemes: z.array(z.string()).optional(),
		no_auth: z.boolean().optional(),
		meta: JsonObject.optional(),
	})
	.passthrough();

export type App = z.infer<typeof AppSchema>;

const AppsListResponseSchema = z
	.object({
		items: z.array(AppSchema),
		next_cursor: z.string().nullable().optional(),
		total_pages: z.number().optional(),
		current_page: z.number().optional(),
		total_items: z.number().optional(),
	})
	.passthrough();

export type AppsListResponse = z.infer<typeof AppsListResponseSchema>;

// ── Endpoint maps ──────────────────────────────────────────────────────

export type ComposioEndpointInputs = {
	toolsList: ToolsListInput;
	toolGet: ToolGetInput;
	actionsList: ActionsListInput;
	actionGet: ActionGetInput;
	actionExecute: ActionExecuteInput;
	connectionsList: ConnectionsListInput;
	connectionCreate: ConnectionCreateInput;
	connectionDelete: ConnectionDeleteInput;
	appsList: AppsListInput;
};

export type ComposioEndpointOutputs = {
	toolsList: ToolsListResponse;
	toolGet: ToolGetResponse;
	actionsList: ActionsListResponse;
	actionGet: ActionGetResponse;
	actionExecute: ActionExecuteResponse;
	connectionsList: ConnectionsListResponse;
	connectionCreate: ConnectionCreateResponse;
	connectionDelete: ConnectionDeleteResponse;
	appsList: AppsListResponse;
};

export const ComposioEndpointInputSchemas = {
	toolsList: ToolsListInputSchema,
	toolGet: ToolGetInputSchema,
	actionsList: ActionsListInputSchema,
	actionGet: ActionGetInputSchema,
	actionExecute: ActionExecuteInputSchema,
	connectionsList: ConnectionsListInputSchema,
	connectionCreate: ConnectionCreateInputSchema,
	connectionDelete: ConnectionDeleteInputSchema,
	appsList: AppsListInputSchema,
} as const;

export const ComposioEndpointOutputSchemas = {
	toolsList: PaginatedToolsSchema,
	toolGet: ToolSchema,
	actionsList: PaginatedToolsSchema,
	actionGet: ToolSchema,
	actionExecute: ActionExecuteResponseSchema,
	connectionsList: ConnectionsListResponseSchema,
	connectionCreate: ConnectionCreateResponseSchema,
	connectionDelete: ConnectionDeleteResponseSchema,
	appsList: AppsListResponseSchema,
} as const;
