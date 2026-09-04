import { z } from 'zod';
import {
	DynapicturesMediaAsset,
	DynapicturesTemplate,
	DynapicturesWorkspace,
} from '../schema/database';

export const ListWorkspacesInputSchema = z.object({}).loose();
export type ListWorkspacesInput = z.infer<typeof ListWorkspacesInputSchema>;
export const ListWorkspacesResponseSchema = z.array(DynapicturesWorkspace);
export type ListWorkspacesResponse = z.infer<
	typeof ListWorkspacesResponseSchema
>;

export const CreateWorkspaceInputSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.describe('Name of a new workspace. Required field.'),
	})
	.loose();
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceInputSchema>;
export const CreateWorkspaceResponseSchema = DynapicturesWorkspace;
export type CreateWorkspaceResponse = z.infer<
	typeof CreateWorkspaceResponseSchema
>;

export const UpdateWorkspaceInputSchema = z
	.object({
		id: z.string().min(1).describe('The ID of a workspace to be updated.'),
		name: z
			.string()
			.min(1)
			.describe('New name of a workspace. Required field.'),
	})
	.loose();
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceInputSchema>;
export const UpdateWorkspaceResponseSchema = DynapicturesWorkspace;
export type UpdateWorkspaceResponse = z.infer<
	typeof UpdateWorkspaceResponseSchema
>;

export const DeleteWorkspaceInputSchema = z
	.object({
		id: z.string().min(1).describe('The ID of a workspace to be deleted.'),
	})
	.loose();
export type DeleteWorkspaceInput = z.infer<typeof DeleteWorkspaceInputSchema>;
export const DeleteWorkspaceResponseSchema = DynapicturesWorkspace;
export type DeleteWorkspaceResponse = z.infer<
	typeof DeleteWorkspaceResponseSchema
>;

export const ListTemplatesInputSchema = z.object({}).loose();
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
export const ListTemplatesResponseSchema = z.array(DynapicturesTemplate);
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export const UnsubscribeWebhookInputSchema = z
	.object({
		targetUrl: z
			.string()
			.url()
			.describe('The URL of the REST endpoint receiving notifications.'),
		eventType: z
			.literal('NEW_IMAGE')
			.describe('Event type passed when subscribing this webhook.'),
		templateId: z
			.string()
			.min(1)
			.describe('The UID of the image template used when subscribing.'),
	})
	.loose();
export type UnsubscribeWebhookInput = z.infer<
	typeof UnsubscribeWebhookInputSchema
>;
export const UnsubscribeWebhookResponseSchema = z
	.object({
		error: z.boolean(),
		message: z.string(),
	})
	.loose();
export type UnsubscribeWebhookResponse = z.infer<
	typeof UnsubscribeWebhookResponseSchema
>;

export const UploadMediaAssetInputSchema = z
	.object({
		workspaceId: z
			.string()
			.min(1)
			.describe('The ID of a workspace to upload an image to.'),
		fileUrl: z
			.string()
			.url()
			.describe('Public URL of the image uploaded as the official file field.'),
		filename: z
			.string()
			.min(1)
			.optional()
			.describe('Filename of uploaded image.'),
	})
	.loose();
export type UploadMediaAssetInput = z.infer<typeof UploadMediaAssetInputSchema>;
export const UploadMediaAssetResponseSchema = DynapicturesMediaAsset;
export type UploadMediaAssetResponse = z.infer<
	typeof UploadMediaAssetResponseSchema
>;

export type DynapicturesEndpointInputs = {
	listWorkspaces: ListWorkspacesInput;
	createWorkspace: CreateWorkspaceInput;
	updateWorkspace: UpdateWorkspaceInput;
	deleteWorkspace: DeleteWorkspaceInput;
	listTemplates: ListTemplatesInput;
	unsubscribeWebhook: UnsubscribeWebhookInput;
	uploadMediaAsset: UploadMediaAssetInput;
};

export type DynapicturesEndpointOutputs = {
	listWorkspaces: ListWorkspacesResponse;
	createWorkspace: CreateWorkspaceResponse;
	updateWorkspace: UpdateWorkspaceResponse;
	deleteWorkspace: DeleteWorkspaceResponse;
	listTemplates: ListTemplatesResponse;
	unsubscribeWebhook: UnsubscribeWebhookResponse;
	uploadMediaAsset: UploadMediaAssetResponse;
};

export const DynapicturesEndpointInputSchemas = {
	listWorkspaces: ListWorkspacesInputSchema,
	createWorkspace: CreateWorkspaceInputSchema,
	updateWorkspace: UpdateWorkspaceInputSchema,
	deleteWorkspace: DeleteWorkspaceInputSchema,
	listTemplates: ListTemplatesInputSchema,
	unsubscribeWebhook: UnsubscribeWebhookInputSchema,
	uploadMediaAsset: UploadMediaAssetInputSchema,
} as const;

export const DynapicturesEndpointOutputSchemas = {
	listWorkspaces: ListWorkspacesResponseSchema,
	createWorkspace: CreateWorkspaceResponseSchema,
	updateWorkspace: UpdateWorkspaceResponseSchema,
	deleteWorkspace: DeleteWorkspaceResponseSchema,
	listTemplates: ListTemplatesResponseSchema,
	unsubscribeWebhook: UnsubscribeWebhookResponseSchema,
	uploadMediaAsset: UploadMediaAssetResponseSchema,
} as const;
