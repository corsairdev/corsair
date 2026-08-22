import { z } from 'zod';

const WorkspaceSchema = z.object({
	type: z.literal('workspace'),
	id: z.string(),
	name: z.string(),
	created_at: z.string(),
	archived_at: z.string().nullable().optional(),
	display_color: z.string().optional(),
});

const ListWorkspacesInputSchema = z.object({
	limit: z.number().optional(),
	after_id: z.string().optional(),
	before_id: z.string().optional(),
});

export type ListWorkspacesInput = z.infer<typeof ListWorkspacesInputSchema>;

const ListWorkspacesResponseSchema = z.object({
	data: z.array(WorkspaceSchema),
	has_more: z.boolean(),
	first_id: z.string().nullable().optional(),
	last_id: z.string().nullable().optional(),
});

export type ListWorkspacesResponse = z.infer<typeof ListWorkspacesResponseSchema>;

export type AnthropicAdminEndpointInputs = {
	listWorkspaces: ListWorkspacesInput;
};

export type AnthropicAdminEndpointOutputs = {
	listWorkspaces: ListWorkspacesResponse;
};

export const AnthropicAdminEndpointInputSchemas = {
	listWorkspaces: ListWorkspacesInputSchema,
} as const;

export const AnthropicAdminEndpointOutputSchemas = {
	listWorkspaces: ListWorkspacesResponseSchema,
} as const;
