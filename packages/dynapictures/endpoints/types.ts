import { z } from 'zod';

const CreateWorkspaceInputSchema = z.object({
	name: z.string().min(1),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceInputSchema>;

const CreateWorkspaceResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export type CreateWorkspaceResponse = z.infer<
	typeof CreateWorkspaceResponseSchema
>;

const DeleteWorkspaceInputSchema = z.object({
	id: z.string().min(1),
});

export type DeleteWorkspaceInput = z.infer<typeof DeleteWorkspaceInputSchema>;

const DeleteWorkspaceResponseSchema = z.object({
	success: z.boolean(),
});

export type DeleteWorkspaceResponse = z.infer<
	typeof DeleteWorkspaceResponseSchema
>;

const ListTemplatesInputSchema = z.object({});

export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

const ListTemplatesResponseSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
	}),
);

export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

const ListWorkspacesInputSchema = z.object({});

export type ListWorkspacesInput = z.infer<typeof ListWorkspacesInputSchema>;

const ListWorkspacesResponseSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
	}),
);

export type ListWorkspacesResponse = z.infer<
	typeof ListWorkspacesResponseSchema
>;

const UnsubscribeWebhookInputSchema = z.object({
	id: z.string().min(1),
});

export type UnsubscribeWebhookInput = z.infer<
	typeof UnsubscribeWebhookInputSchema
>;

const UnsubscribeWebhookResponseSchema = z.object({
	success: z.boolean(),
});

export type UnsubscribeWebhookResponse = z.infer<
	typeof UnsubscribeWebhookResponseSchema
>;

const UpdateWorkspaceInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
});

export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceInputSchema>;

const UpdateWorkspaceResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export type UpdateWorkspaceResponse = z.infer<
	typeof UpdateWorkspaceResponseSchema
>;

const UploadMediaAssetInputSchema = z.object({
	workspaceId: z.string().min(1),
	imageUrl: z.string().url(),
});

export type UploadMediaAssetInput = z.infer<typeof UploadMediaAssetInputSchema>;

const UploadMediaAssetResponseSchema = z.object({
	id: z.string(),
	url: z.string().url(),
});

export type UploadMediaAssetResponse = z.infer<
	typeof UploadMediaAssetResponseSchema
>;

export type DynapicturesEndpointInputs = {
	createWorkspace: CreateWorkspaceInput;
	deleteWorkspace: DeleteWorkspaceInput;
	listTemplates: ListTemplatesInput;
	listWorkspaces: ListWorkspacesInput;
	unsubscribeWebhook: UnsubscribeWebhookInput;
	updateWorkspace: UpdateWorkspaceInput;
	uploadMediaAsset: UploadMediaAssetInput;
};

export type DynapicturesEndpointOutputs = {
	createWorkspace: CreateWorkspaceResponse;
	deleteWorkspace: DeleteWorkspaceResponse;
	listTemplates: ListTemplatesResponse;
	listWorkspaces: ListWorkspacesResponse;
	unsubscribeWebhook: UnsubscribeWebhookResponse;
	updateWorkspace: UpdateWorkspaceResponse;
	uploadMediaAsset: UploadMediaAssetResponse;
};

export const DynapicturesEndpointInputSchemas = {
	createWorkspace: CreateWorkspaceInputSchema,
	deleteWorkspace: DeleteWorkspaceInputSchema,
	listTemplates: ListTemplatesInputSchema,
	listWorkspaces: ListWorkspacesInputSchema,
	unsubscribeWebhook: UnsubscribeWebhookInputSchema,
	updateWorkspace: UpdateWorkspaceInputSchema,
	uploadMediaAsset: UploadMediaAssetInputSchema,
} as const;

export const DynapicturesEndpointOutputSchemas = {
	createWorkspace: CreateWorkspaceResponseSchema,
	deleteWorkspace: DeleteWorkspaceResponseSchema,
	listTemplates: ListTemplatesResponseSchema,
	listWorkspaces: ListWorkspacesResponseSchema,
	unsubscribeWebhook: UnsubscribeWebhookResponseSchema,
	updateWorkspace: UpdateWorkspaceResponseSchema,
	uploadMediaAsset: UploadMediaAssetResponseSchema,
} as const;
