import { z } from 'zod';

// ── Tools ─────────────────────────────────────────────────────────────

const ToolsListInputSchema = z.object({
	page: z.number().optional(),
	pageSize: z.number().optional(),
	category: z.string().optional(),
	search: z.string().optional(),
});

export type ToolsListInput = z.infer<typeof ToolsListInputSchema>;

const ToolSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	category: z.string().optional(),
	image: z.string().optional(),
	appId: z.string().optional(),
	enabled: z.boolean().optional(),
});

export type Tool = z.infer<typeof ToolSchema>;

const ToolsListResponseSchema = z.object({
	items: z.array(ToolSchema),
	total: z.number().optional(),
	page: z.number().optional(),
	pageSize: z.number().optional(),
});

export type ToolsListResponse = z.infer<typeof ToolsListResponseSchema>;

const ToolGetInputSchema = z.object({
	toolId: z.string(),
});

export type ToolGetInput = z.infer<typeof ToolGetInputSchema>;

const ToolGetResponseSchema = ToolSchema;

export type ToolGetResponse = z.infer<typeof ToolGetResponseSchema>;

// ── Actions ────────────────────────────────────────────────────────────

const ActionsListInputSchema = z.object({
	appName: z.string().optional(),
	page: z.number().optional(),
	pageSize: z.number().optional(),
});

export type ActionsListInput = z.infer<typeof ActionsListInputSchema>;

const ActionSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string().optional(),
	description: z.string().optional(),
	appName: z.string(),
	inputSchema: z.record(z.unknown()).optional(),
	outputSchema: z.record(z.unknown()).optional(),
	enabled: z.boolean().optional(),
});

export type Action = z.infer<typeof ActionSchema>;

const ActionsListResponseSchema = z.object({
	items: z.array(ActionSchema),
	total: z.number().optional(),
});

export type ActionsListResponse = z.infer<typeof ActionsListResponseSchema>;

const ActionGetInputSchema = z.object({
	actionId: z.string(),
});

export type ActionGetInput = z.infer<typeof ActionGetInputSchema>;

const ActionGetResponseSchema = ActionSchema;

export type ActionGetResponse = z.infer<typeof ActionGetResponseSchema>;

const ActionExecuteInputSchema = z.object({
	actionId: z.string(),
	appName: z.string(),
	input: z.record(z.unknown()),
	connectionId: z.string().optional(),
});

export type ActionExecuteInput = z.infer<typeof ActionExecuteInputSchema>;

const ActionExecuteResponseSchema = z.object({
	executionId: z.string(),
	status: z.string(),
	output: z.record(z.unknown()).optional(),
	error: z.string().optional(),
});

export type ActionExecuteResponse = z.infer<typeof ActionExecuteResponseSchema>;

// ── Connections ────────────────────────────────────────────────────────

const ConnectionsListInputSchema = z.object({
	page: z.number().optional(),
	pageSize: z.number().optional(),
	appName: z.string().optional(),
});

export type ConnectionsListInput = z.infer<typeof ConnectionsListInputSchema>;

const ConnectionSchema = z.object({
	id: z.string(),
	appName: z.string(),
	integrationId: z.string().optional(),
	status: z.string(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	meta: z.record(z.unknown()).optional(),
});

export type Connection = z.infer<typeof ConnectionSchema>;

const ConnectionsListResponseSchema = z.object({
	items: z.array(ConnectionSchema),
	total: z.number().optional(),
});

export type ConnectionsListResponse = z.infer<
	typeof ConnectionsListResponseSchema
>;

const ConnectionCreateInputSchema = z.object({
	appName: z.string(),
	integrationId: z.string().optional(),
	authConfig: z.record(z.unknown()).optional(),
	redirectUri: z.string().optional(),
});

export type ConnectionCreateInput = z.infer<typeof ConnectionCreateInputSchema>;

const ConnectionCreateResponseSchema = ConnectionSchema;

export type ConnectionCreateResponse = z.infer<
	typeof ConnectionCreateResponseSchema
>;

const ConnectionDeleteInputSchema = z.object({
	connectionId: z.string(),
});

export type ConnectionDeleteInput = z.infer<typeof ConnectionDeleteInputSchema>;

const ConnectionDeleteResponseSchema = z.object({
	success: z.boolean(),
});

export type ConnectionDeleteResponse = z.infer<
	typeof ConnectionDeleteResponseSchema
>;

// ── Apps ───────────────────────────────────────────────────────────────

const AppsListInputSchema = z.object({
	page: z.number().optional(),
	pageSize: z.number().optional(),
	category: z.string().optional(),
});

export type AppsListInput = z.infer<typeof AppsListInputSchema>;

const AppSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string().optional(),
	description: z.string().optional(),
	category: z.string().optional(),
	image: z.string().optional(),
	authSchemes: z.array(z.string()).optional(),
	enabled: z.boolean().optional(),
});

export type App = z.infer<typeof AppSchema>;

const AppsListResponseSchema = z.object({
	items: z.array(AppSchema),
	total: z.number().optional(),
});

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
	toolsList: ToolsListResponseSchema,
	toolGet: ToolGetResponseSchema,
	actionsList: ActionsListResponseSchema,
	actionGet: ActionGetResponseSchema,
	actionExecute: ActionExecuteResponseSchema,
	connectionsList: ConnectionsListResponseSchema,
	connectionCreate: ConnectionCreateResponseSchema,
	connectionDelete: ConnectionDeleteResponseSchema,
	appsList: AppsListResponseSchema,
} as const;
