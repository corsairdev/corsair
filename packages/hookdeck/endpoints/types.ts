import { z } from 'zod';

// --- Connections ---

const ConnectionRuleSchema = z.object({
	type: z.string(),
	count: z.number().optional(),
	interval: z.number().optional(),
	strategy: z.string().optional(),
});

const ConnectionSchema = z.object({
	id: z.string(),
	team_id: z.string(),
	name: z.string().nullable(),
	full_name: z.string(),
	disabled_at: z.string().nullable(),
	paused_at: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
	rules: z.array(ConnectionRuleSchema).optional(),
});

const ConnectionsListInputSchema = z.object({
	limit: z.number().optional(),
	next: z.string().optional(),
	prev: z.string().optional(),
	order_by: z.string().optional(),
	dir: z.enum(['asc', 'desc']).optional(),
});
const HookdeckPaginationSchema = z.object({
	order_by: z.string(),
	dir: z.enum(['asc', 'desc']),
	limit: z.number(),
	next: z.string().optional(),
	prev: z.string().optional(),
});
const ConnectionsListResponseSchema = z.object({
	models: z.array(ConnectionSchema),
	count: z.number(),
	pagination: HookdeckPaginationSchema.optional(),
});

const ConnectionsCreateInputSchema = z.object({
	name: z.string(),
	source_id: z.string().optional(),
	destination_id: z.string().optional(),
	rules: z.array(ConnectionRuleSchema).optional(),
});
const ConnectionsCreateResponseSchema = ConnectionSchema;

const ConnectionsGetInputSchema = z.object({
	id: z.string(),
});
const ConnectionsGetResponseSchema = ConnectionSchema;

const ConnectionsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	rules: z.array(ConnectionRuleSchema).optional(),
});
const ConnectionsUpdateResponseSchema = ConnectionSchema;

const ConnectionsDeleteInputSchema = z.object({
	id: z.string(),
});
const ConnectionsDeleteResponseSchema = z.object({
	id: z.string(),
});

export type ConnectionsListInput = z.infer<typeof ConnectionsListInputSchema>;
export type ConnectionsListResponse = z.infer<
	typeof ConnectionsListResponseSchema
>;
export type ConnectionsCreateInput = z.infer<
	typeof ConnectionsCreateInputSchema
>;
export type ConnectionsCreateResponse = z.infer<
	typeof ConnectionsCreateResponseSchema
>;
export type ConnectionsGetInput = z.infer<typeof ConnectionsGetInputSchema>;
export type ConnectionsGetResponse = z.infer<
	typeof ConnectionsGetResponseSchema
>;
export type ConnectionsUpdateInput = z.infer<
	typeof ConnectionsUpdateInputSchema
>;
export type ConnectionsUpdateResponse = z.infer<
	typeof ConnectionsUpdateResponseSchema
>;
export type ConnectionsDeleteInput = z.infer<
	typeof ConnectionsDeleteInputSchema
>;
export type ConnectionsDeleteResponse = z.infer<
	typeof ConnectionsDeleteResponseSchema
>;

export type HookdeckEndpointInputs = {
	connectionsList: ConnectionsListInput;
	connectionsCreate: ConnectionsCreateInput;
	connectionsGet: ConnectionsGetInput;
	connectionsUpdate: ConnectionsUpdateInput;
	connectionsDelete: ConnectionsDeleteInput;
};

export type HookdeckEndpointOutputs = {
	connectionsList: ConnectionsListResponse;
	connectionsCreate: ConnectionsCreateResponse;
	connectionsGet: ConnectionsGetResponse;
	connectionsUpdate: ConnectionsUpdateResponse;
	connectionsDelete: ConnectionsDeleteResponse;
};

export const HookdeckEndpointInputSchemas = {
	connectionsList: ConnectionsListInputSchema,
	connectionsCreate: ConnectionsCreateInputSchema,
	connectionsGet: ConnectionsGetInputSchema,
	connectionsUpdate: ConnectionsUpdateInputSchema,
	connectionsDelete: ConnectionsDeleteInputSchema,
} as const;

export const HookdeckEndpointOutputSchemas = {
	connectionsList: ConnectionsListResponseSchema,
	connectionsCreate: ConnectionsCreateResponseSchema,
	connectionsGet: ConnectionsGetResponseSchema,
	connectionsUpdate: ConnectionsUpdateResponseSchema,
	connectionsDelete: ConnectionsDeleteResponseSchema,
} as const;
