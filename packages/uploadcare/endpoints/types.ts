import { z } from 'zod';

export const UploadcareFileSchema = z.object({
	uuid: z.string(),
	filename: z.string().optional().nullable(),
	original_filename: z.string().optional().nullable(),
	size: z.number().optional().nullable(),
	is_stored: z.boolean().optional().nullable(),
	is_image: z.boolean().optional().nullable(),
	is_ready: z.boolean().optional().nullable(),
	mime_type: z.string().optional().nullable(),
	created_at: z.string().optional().nullable(),
	removed_at: z.string().optional().nullable(),
});
export type UploadcareFile = z.infer<typeof UploadcareFileSchema>;

export const UploadcareGroupSchema = z.object({
	id: z.string(),
	created_at: z.string().optional().nullable(),
	files_count: z.number().optional().nullable(),
	url: z.string().optional().nullable(),
	files: z.array(UploadcareFileSchema).optional().nullable(),
});
export type UploadcareGroup = z.infer<typeof UploadcareGroupSchema>;

export const UploadcareProjectSchema = z.object({
	name: z.string().optional().nullable(),
	pub_key: z.string().optional().nullable(),
	collaborator_emails: z.array(z.string()).optional().nullable(),
});
export type UploadcareProject = z.infer<typeof UploadcareProjectSchema>;

export const UploadcareWebhookSchema = z.object({
	id: z.number().or(z.string()),
	created_at: z.string().optional().nullable(),
	updated_at: z.string().optional().nullable(),
	event: z.string().optional().nullable(),
	target_url: z.string().optional().nullable(),
	is_active: z.boolean().optional().nullable(),
	project: z.number().or(z.string()).optional().nullable(),
});
export type UploadcareWebhook = z.infer<typeof UploadcareWebhookSchema>;

// Files Input & Output Schemas
export const FilesListInputSchema = z.object({
	from: z.string().optional(),
	limit: z.number().min(1).max(1000).optional(),
	ordering: z.string().optional(),
	stored: z.boolean().optional(),
	removed: z.boolean().optional(),
});
export type FilesListInput = z.infer<typeof FilesListInputSchema>;

export const FilesListResponseSchema = z.object({
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	total: z.number().optional(),
	per_page: z.number().optional(),
	results: z.array(UploadcareFileSchema),
});
export type FilesListResponse = z.infer<typeof FilesListResponseSchema>;

export const FileGetInputSchema = z.object({
	file_id: z.string(),
});
export type FileGetInput = z.infer<typeof FileGetInputSchema>;

export const FileStoreInputSchema = z.object({
	file_id: z.string(),
});
export type FileStoreInput = z.infer<typeof FileStoreInputSchema>;

export const FileDeleteInputSchema = z.object({
	file_id: z.string(),
});
export type FileDeleteInput = z.infer<typeof FileDeleteInputSchema>;

export const BatchStoreFilesInputSchema = z.object({
	file_ids: z.array(z.string()),
});
export type BatchStoreFilesInput = z.infer<typeof BatchStoreFilesInputSchema>;

export const BatchDeleteFilesInputSchema = z.object({
	file_ids: z.array(z.string()),
});
export type BatchDeleteFilesInput = z.infer<typeof BatchDeleteFilesInputSchema>;

export const BatchResponseSchema = z.object({
	status: z.string().optional(),
	result: z.array(UploadcareFileSchema).optional(),
});
export type BatchResponse = z.infer<typeof BatchResponseSchema>;

// Groups Input & Output Schemas
export const GroupsListInputSchema = z.object({
	from: z.string().optional(),
	limit: z.number().min(1).max(1000).optional(),
	ordering: z.string().optional(),
});
export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;

export const GroupsListResponseSchema = z.object({
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	total: z.number().optional(),
	per_page: z.number().optional(),
	results: z.array(UploadcareGroupSchema),
});
export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;

export const GroupGetInputSchema = z.object({
	group_id: z.string(),
});
export type GroupGetInput = z.infer<typeof GroupGetInputSchema>;

// Project Input & Output Schemas
export const ProjectGetInputSchema = z.object({});
export type ProjectGetInput = z.infer<typeof ProjectGetInputSchema>;

// Webhooks Input & Output Schemas
export const WebhooksListInputSchema = z.object({});
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

export const WebhooksListResponseSchema = z.array(UploadcareWebhookSchema);
export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

export const WebhookCreateInputSchema = z.object({
	target_url: z.string().url(),
	event: z.string(),
	is_active: z.boolean().optional(),
});
export type WebhookCreateInput = z.infer<typeof WebhookCreateInputSchema>;

export const WebhookUpdateInputSchema = z.object({
	webhook_id: z.number().or(z.string()),
	target_url: z.string().url().optional(),
	event: z.string().optional(),
	is_active: z.boolean().optional(),
});
export type WebhookUpdateInput = z.infer<typeof WebhookUpdateInputSchema>;

export const WebhookDeleteInputSchema = z.object({
	webhook_id: z.number().or(z.string()),
});
export type WebhookDeleteInput = z.infer<typeof WebhookDeleteInputSchema>;

export const WebhookDeleteResponseSchema = z.object({
	success: z.boolean(),
});
export type WebhookDeleteResponse = z.infer<typeof WebhookDeleteResponseSchema>;

export type UploadcareEndpointInputs = {
	filesList: FilesListInput;
	fileGet: FileGetInput;
	fileStore: FileStoreInput;
	fileDelete: FileDeleteInput;
	batchStoreFiles: BatchStoreFilesInput;
	batchDeleteFiles: BatchDeleteFilesInput;
	groupsList: GroupsListInput;
	groupGet: GroupGetInput;
	projectGet: ProjectGetInput;
	webhooksList: WebhooksListInput;
	webhookCreate: WebhookCreateInput;
	webhookUpdate: WebhookUpdateInput;
	webhookDelete: WebhookDeleteInput;
};

export type UploadcareEndpointOutputs = {
	filesList: FilesListResponse;
	fileGet: UploadcareFile;
	fileStore: UploadcareFile;
	fileDelete: UploadcareFile;
	batchStoreFiles: BatchResponse;
	batchDeleteFiles: BatchResponse;
	groupsList: GroupsListResponse;
	groupGet: UploadcareGroup;
	projectGet: UploadcareProject;
	webhooksList: WebhooksListResponse;
	webhookCreate: UploadcareWebhook;
	webhookUpdate: UploadcareWebhook;
	webhookDelete: WebhookDeleteResponse;
};

export const UploadcareEndpointInputSchemas = {
	filesList: FilesListInputSchema,
	fileGet: FileGetInputSchema,
	fileStore: FileStoreInputSchema,
	fileDelete: FileDeleteInputSchema,
	batchStoreFiles: BatchStoreFilesInputSchema,
	batchDeleteFiles: BatchDeleteFilesInputSchema,
	groupsList: GroupsListInputSchema,
	groupGet: GroupGetInputSchema,
	projectGet: ProjectGetInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhookCreate: WebhookCreateInputSchema,
	webhookUpdate: WebhookUpdateInputSchema,
	webhookDelete: WebhookDeleteInputSchema,
} as const;

export const UploadcareEndpointOutputSchemas = {
	filesList: FilesListResponseSchema,
	fileGet: UploadcareFileSchema,
	fileStore: UploadcareFileSchema,
	fileDelete: UploadcareFileSchema,
	batchStoreFiles: BatchResponseSchema,
	batchDeleteFiles: BatchResponseSchema,
	groupsList: GroupsListResponseSchema,
	groupGet: UploadcareGroupSchema,
	projectGet: UploadcareProjectSchema,
	webhooksList: WebhooksListResponseSchema,
	webhookCreate: UploadcareWebhookSchema,
	webhookUpdate: UploadcareWebhookSchema,
	webhookDelete: WebhookDeleteResponseSchema,
} as const;
