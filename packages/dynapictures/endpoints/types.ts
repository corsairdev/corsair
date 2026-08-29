import { z } from 'zod';

// ── Workspace Schemas ────────────────────────────────────────────────────────

export const CreateWorkspaceInputSchema = z.object({
	name: z.string().describe('Name of the workspace'),
});
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceInputSchema>;

export const CreateWorkspaceResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();
export type CreateWorkspaceResponse = z.infer<
	typeof CreateWorkspaceResponseSchema
>;

export const DeleteWorkspaceInputSchema = z.object({
	workspaceId: z
		.string()
		.describe('Unique identifier of the workspace to delete'),
});
export type DeleteWorkspaceInput = z.infer<typeof DeleteWorkspaceInputSchema>;

export const DeleteWorkspaceResponseSchema = z
	.object({
		success: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type DeleteWorkspaceResponse = z.infer<
	typeof DeleteWorkspaceResponseSchema
>;

export const ListWorkspacesInputSchema = z.object({});
export type ListWorkspacesInput = z.infer<typeof ListWorkspacesInputSchema>;

export const ListWorkspacesResponseSchema = z.union([
	z.array(z.record(z.string(), z.unknown())),
	z
		.object({
			workspaces: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.passthrough(),
]);
export type ListWorkspacesResponse = z.infer<
	typeof ListWorkspacesResponseSchema
>;

export const UpdateWorkspaceInputSchema = z.object({
	workspaceId: z
		.string()
		.describe('Unique identifier of the workspace to update'),
	name: z.string().describe('New name for the workspace'),
});
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceInputSchema>;

export const UpdateWorkspaceResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();
export type UpdateWorkspaceResponse = z.infer<
	typeof UpdateWorkspaceResponseSchema
>;

// ── Template Schemas ─────────────────────────────────────────────────────────

export const ListTemplatesInputSchema = z.object({
	workspaceId: z
		.string()
		.optional()
		.describe('Optional workspace ID to filter templates by'),
});
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

export const ListTemplatesResponseSchema = z.union([
	z.array(z.record(z.string(), z.unknown())),
	z
		.object({
			templates: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.passthrough(),
]);
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

// ── Webhook Schemas ──────────────────────────────────────────────────────────

export const UnsubscribeWebhookInputSchema = z.object({
	targetUrl: z.string().url().describe('The webhook target URL to unsubscribe'),
	eventType: z.string().describe('Event type name to unsubscribe from'),
	templateId: z.string().describe('Template ID associated with the webhook'),
});
export type UnsubscribeWebhookInput = z.infer<
	typeof UnsubscribeWebhookInputSchema
>;

export const UnsubscribeWebhookResponseSchema = z
	.object({
		success: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type UnsubscribeWebhookResponse = z.infer<
	typeof UnsubscribeWebhookResponseSchema
>;

// ── Media Schemas ────────────────────────────────────────────────────────────

export const UploadMediaAssetInputSchema = z.object({
	imageUrl: z
		.string()
		.url()
		.describe('Publicly accessible URL of the image to upload'),
	name: z.string().optional().describe('Optional name for the media asset'),
});
export type UploadMediaAssetInput = z.infer<typeof UploadMediaAssetInputSchema>;

export const UploadMediaAssetResponseSchema = z
	.object({
		id: z.string().optional(),
		url: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();
export type UploadMediaAssetResponse = z.infer<
	typeof UploadMediaAssetResponseSchema
>;

// ── Endpoint Inputs and Outputs Maps ─────────────────────────────────────────

export const DynapicturesEndpointInputSchemas = {
	createWorkspace: CreateWorkspaceInputSchema,
	deleteWorkspace: DeleteWorkspaceInputSchema,
	listTemplates: ListTemplatesInputSchema,
	listWorkspaces: ListWorkspacesInputSchema,
	unsubscribeWebhook: UnsubscribeWebhookInputSchema,
	updateWorkspace: UpdateWorkspaceInputSchema,
	uploadMediaAsset: UploadMediaAssetInputSchema,
} as const;

export type DynapicturesEndpointInputs = {
	createWorkspace: CreateWorkspaceInput;
	deleteWorkspace: DeleteWorkspaceInput;
	listTemplates: ListTemplatesInput;
	listWorkspaces: ListWorkspacesInput;
	unsubscribeWebhook: UnsubscribeWebhookInput;
	updateWorkspace: UpdateWorkspaceInput;
	uploadMediaAsset: UploadMediaAssetInput;
};

export const DynapicturesEndpointOutputSchemas = {
	createWorkspace: CreateWorkspaceResponseSchema,
	deleteWorkspace: DeleteWorkspaceResponseSchema,
	listTemplates: ListTemplatesResponseSchema,
	listWorkspaces: ListWorkspacesResponseSchema,
	unsubscribeWebhook: UnsubscribeWebhookResponseSchema,
	updateWorkspace: UpdateWorkspaceResponseSchema,
	uploadMediaAsset: UploadMediaAssetResponseSchema,
} as const;

export type DynapicturesEndpointOutputs = {
	createWorkspace: CreateWorkspaceResponse;
	deleteWorkspace: DeleteWorkspaceResponse;
	listTemplates: ListTemplatesResponse;
	listWorkspaces: ListWorkspacesResponse;
	unsubscribeWebhook: UnsubscribeWebhookResponse;
	updateWorkspace: UpdateWorkspaceResponse;
	uploadMediaAsset: UploadMediaAssetResponse;
};
