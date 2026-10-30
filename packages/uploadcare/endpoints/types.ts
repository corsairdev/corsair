import { z } from 'zod';

/** Official REST v0.7 file object. Extra provider fields allowed. */
export const UploadcareFileSchema = z
	.object({
		uuid: z.string(),
		datetime_removed: z.string().nullable().optional(),
		datetime_stored: z.string().nullable().optional(),
		datetime_uploaded: z.string().optional(),
		is_image: z.boolean().optional(),
		is_ready: z.boolean().optional(),
		mime_type: z.string().optional(),
		original_file_url: z.string().nullable().optional(),
		original_filename: z.string().optional(),
		size: z.number().optional(),
		url: z.string().optional(),
		variations: z.record(z.string(), z.string()).nullable().optional(),
		content_info: z.record(z.string(), z.json()).optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		appdata: z.record(z.string(), z.json()).optional(),
		tags: z.array(z.string()).optional(),
	})
	.loose();
export type UploadcareFile = z.infer<typeof UploadcareFileSchema>;

export const UploadcareGroupSchema = z
	.object({
		id: z.string(),
		datetime_created: z.string().nullable().optional(),
		files_count: z.number().optional(),
		cdn_url: z.string().optional(),
		url: z.string().optional(),
		files: z.array(z.json()).nullable().optional(),
	})
	.loose();
export type UploadcareGroup = z.infer<typeof UploadcareGroupSchema>;

export const UploadcareProjectSchema = z
	.object({
		name: z.string().optional(),
		pub_key: z.string().optional(),
		collaborators: z
			.array(
				z
					.object({
						email: z.string().optional(),
						name: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();
export type UploadcareProject = z.infer<typeof UploadcareProjectSchema>;

export const UploadcareWebhookSchema = z
	.object({
		id: z.number(),
		created: z.string().optional(),
		updated: z.string().optional(),
		event: z.string().optional(),
		target_url: z.string().optional(),
		project: z.number().optional(),
		is_active: z.boolean().optional(),
		signing_secret: z.string().nullable().optional(),
	})
	.loose();
export type UploadcareWebhook = z.infer<typeof UploadcareWebhookSchema>;

export const FilesListInputSchema = z.object({
	removed: z.boolean().optional(),
	stored: z.boolean().optional(),
	limit: z.number().min(1).max(1000).optional(),
	ordering: z.enum(['datetime_uploaded', '-datetime_uploaded']).optional(),
	from: z.string().optional(),
	include: z.string().optional(),
});
export type FilesListInput = z.infer<typeof FilesListInputSchema>;

export const FilesListResponseSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		total: z.number().optional(),
		totals: z
			.object({
				removed: z.number().optional(),
				stored: z.number().optional(),
				unstored: z.number().optional(),
			})
			.optional(),
		per_page: z.number().optional(),
		results: z.array(UploadcareFileSchema),
	})
	.loose();
export type FilesListResponse = z.infer<typeof FilesListResponseSchema>;

export const FileIdInputSchema = z.object({
	uuid: z.string(),
	include: z.string().optional(),
});
export type FileIdInput = z.infer<typeof FileIdInputSchema>;

export const BatchFilesInputSchema = z.object({
	uuids: z.array(z.string()).min(1).max(100),
});
export type BatchFilesInput = z.infer<typeof BatchFilesInputSchema>;

export const BatchResponseSchema = z
	.object({
		status: z.string().optional(),
		problems: z.record(z.string(), z.string()).optional(),
		result: z.array(UploadcareFileSchema).optional(),
	})
	.loose();
export type BatchResponse = z.infer<typeof BatchResponseSchema>;

export const CopyLocalInputSchema = z.object({
	source: z.string(),
	store: z.boolean().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
});
export type CopyLocalInput = z.infer<typeof CopyLocalInputSchema>;

export const CopyLocalResponseSchema = z
	.object({
		type: z.string().optional(),
		result: UploadcareFileSchema.optional(),
	})
	.loose();
export type CopyLocalResponse = z.infer<typeof CopyLocalResponseSchema>;

export const FileMetadataInputSchema = z.object({
	uuid: z.string(),
});
export type FileMetadataInput = z.infer<typeof FileMetadataInputSchema>;

export const FileMetadataKeyInputSchema = z.object({
	uuid: z.string(),
	key: z.string(),
});
export type FileMetadataKeyInput = z.infer<typeof FileMetadataKeyInputSchema>;

export const FileMetadataUpdateInputSchema = z.object({
	uuid: z.string(),
	key: z.string(),
	value: z.string(),
});
export type FileMetadataUpdateInput = z.infer<
	typeof FileMetadataUpdateInputSchema
>;

export const FileMetadataSchema = z.record(z.string(), z.string());
export type FileMetadata = z.infer<typeof FileMetadataSchema>;

export const FileMetadataValueSchema = z.string();

export const GroupsListInputSchema = z.object({
	from: z.string().optional(),
	limit: z.number().min(1).max(1000).optional(),
	ordering: z.enum(['datetime_created', '-datetime_created']).optional(),
});
export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;

export const GroupsListResponseSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		total: z.number().optional(),
		per_page: z.number().optional(),
		results: z.array(UploadcareGroupSchema),
	})
	.loose();
export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;

export const GroupIdInputSchema = z.object({
	group_id: z.string(),
});
export type GroupIdInput = z.infer<typeof GroupIdInputSchema>;

export const ProjectGetInputSchema = z.object({});
export type ProjectGetInput = z.infer<typeof ProjectGetInputSchema>;

export const WebhooksListInputSchema = z.object({});
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

export const WebhooksListResponseSchema = z.array(UploadcareWebhookSchema);
export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

export const WebhookCreateInputSchema = z.object({
	target_url: z.string().url(),
	event: z.string(),
	is_active: z.boolean().optional(),
	signing_secret: z.string().optional(),
});
export type WebhookCreateInput = z.infer<typeof WebhookCreateInputSchema>;

export const WebhookUpdateInputSchema = z.object({
	webhook_id: z.number(),
	target_url: z.string().url().optional(),
	event: z.string().optional(),
	is_active: z.boolean().optional(),
	signing_secret: z.string().optional(),
});
export type WebhookUpdateInput = z.infer<typeof WebhookUpdateInputSchema>;

export const WebhookDeleteInputSchema = z.object({
	webhook_id: z.number(),
});
export type WebhookDeleteInput = z.infer<typeof WebhookDeleteInputSchema>;

export const WebhookDeleteByUrlInputSchema = z.object({
	target_url: z.string().url(),
});
export type WebhookDeleteByUrlInput = z.infer<
	typeof WebhookDeleteByUrlInputSchema
>;

export const OkSchema = z.object({ success: z.literal(true) });
export type OkResponse = z.infer<typeof OkSchema>;

export const UploadFromUrlInputSchema = z.object({
	source_url: z.string().url(),
	store: z.enum(['0', '1', 'auto']).optional(),
	filename: z.string().optional(),
	check_URL_duplicates: z.enum(['0', '1']).optional(),
	save_URL_duplicates: z.enum(['0', '1']).optional(),
});
export type UploadFromUrlInput = z.infer<typeof UploadFromUrlInputSchema>;

export const UploadFromUrlResponseSchema = z
	.object({
		type: z.string().optional(),
		token: z.string().optional(),
		uuid: z.string().optional(),
		file_id: z.string().optional(),
	})
	.loose();
export type UploadFromUrlResponse = z.infer<typeof UploadFromUrlResponseSchema>;

export const UploadFromUrlStatusInputSchema = z.object({
	token: z.string(),
});
export type UploadFromUrlStatusInput = z.infer<
	typeof UploadFromUrlStatusInputSchema
>;

export const UploadFromUrlStatusResponseSchema = z
	.object({
		status: z.string(),
		uuid: z.string().optional(),
		file_id: z.string().optional(),
		error: z.string().optional(),
	})
	.loose();
export type UploadFromUrlStatusResponse = z.infer<
	typeof UploadFromUrlStatusResponseSchema
>;

export const UploadedFileInfoInputSchema = z.object({
	file_id: z.string(),
});
export type UploadedFileInfoInput = z.infer<typeof UploadedFileInfoInputSchema>;

export const UploadedFileInfoSchema = z
	.object({
		uuid: z.string().optional(),
		file_id: z.string().optional(),
		size: z.number().optional(),
		original_filename: z.string().optional(),
		filename: z.string().optional(),
		mime_type: z.string().optional(),
		is_image: z.boolean().optional(),
		is_stored: z.boolean().optional(),
	})
	.loose();
export type UploadedFileInfo = z.infer<typeof UploadedFileInfoSchema>;

export const UploadCreateGroupInputSchema = z.object({
	files: z.array(z.string()).min(1),
});
export type UploadCreateGroupInput = z.infer<
	typeof UploadCreateGroupInputSchema
>;

export const UploadGroupInfoInputSchema = z.object({
	group_id: z.string(),
});
export type UploadGroupInfoInput = z.infer<typeof UploadGroupInfoInputSchema>;

export const MultipartStartInputSchema = z.object({
	filename: z.string(),
	size: z.number().min(1),
	content_type: z.string(),
	store: z.enum(['0', '1', 'auto']).optional(),
});
export type MultipartStartInput = z.infer<typeof MultipartStartInputSchema>;

export const MultipartStartResponseSchema = z
	.object({
		uuid: z.string(),
		parts: z.array(z.string()),
	})
	.loose();
export type MultipartStartResponse = z.infer<
	typeof MultipartStartResponseSchema
>;

export const AddonExecuteInputSchema = z.object({
	target: z.string(),
	params: z.record(z.string(), z.json()).optional(),
});
export type AddonExecuteInput = z.infer<typeof AddonExecuteInputSchema>;

export const AddonExecuteResponseSchema = z
	.object({
		request_id: z.string(),
	})
	.loose();
export type AddonExecuteResponse = z.infer<typeof AddonExecuteResponseSchema>;

export const AddonStatusInputSchema = z.object({
	request_id: z.string(),
});
export type AddonStatusInput = z.infer<typeof AddonStatusInputSchema>;

export const AddonStatusResponseSchema = z
	.object({
		status: z.enum(['in_progress', 'error', 'done', 'unknown']),
	})
	.loose();
export type AddonStatusResponse = z.infer<typeof AddonStatusResponseSchema>;

export const CdnMirrorInputSchema = z.object({
	uuid: z.string(),
});
export type CdnMirrorInput = z.infer<typeof CdnMirrorInputSchema>;

export const CdnRotateInputSchema = z.object({
	uuid: z.string(),
	degrees: z.union([z.literal(90), z.literal(180), z.literal(270)]),
});
export type CdnRotateInput = z.infer<typeof CdnRotateInputSchema>;

export const CdnUrlResponseSchema = z.object({
	url: z.string(),
});
export type CdnUrlResponse = z.infer<typeof CdnUrlResponseSchema>;

export type UploadcareEndpointInputs = {
	filesList: FilesListInput;
	fileGet: FileIdInput;
	fileStore: FileIdInput;
	fileDelete: FileIdInput;
	batchStoreFiles: BatchFilesInput;
	batchDeleteFiles: BatchFilesInput;
	copyLocal: CopyLocalInput;
	getFileMetadata: FileMetadataInput;
	getFileMetadataKey: FileMetadataKeyInput;
	updateFileMetadataKey: FileMetadataUpdateInput;
	deleteFileMetadataKey: FileMetadataKeyInput;
	groupsList: GroupsListInput;
	groupGet: GroupIdInput;
	groupDelete: GroupIdInput;
	projectGet: ProjectGetInput;
	webhooksList: WebhooksListInput;
	webhookCreate: WebhookCreateInput;
	webhookUpdate: WebhookUpdateInput;
	webhookDelete: WebhookDeleteInput;
	webhookDeleteByUrl: WebhookDeleteByUrlInput;
	uploadFromUrl: UploadFromUrlInput;
	getUrlUploadStatus: UploadFromUrlStatusInput;
	getUploadedFileInfo: UploadedFileInfoInput;
	createFileGroupUpload: UploadCreateGroupInput;
	getFileGroupInfoUpload: UploadGroupInfoInput;
	startMultipartUpload: MultipartStartInput;
	executeClamavScan: AddonExecuteInput;
	getClamavScanStatus: AddonStatusInput;
	getAwsRekognitionExecutionStatus: AddonStatusInput;
	checkAwsRekognitionModerationStatus: AddonStatusInput;
	checkRemoveBgStatus: AddonStatusInput;
	imageMirror: CdnMirrorInput;
	rotateImage: CdnRotateInput;
};

export type UploadcareEndpointOutputs = {
	filesList: FilesListResponse;
	fileGet: UploadcareFile;
	fileStore: UploadcareFile;
	fileDelete: UploadcareFile;
	batchStoreFiles: BatchResponse;
	batchDeleteFiles: BatchResponse;
	copyLocal: CopyLocalResponse;
	getFileMetadata: FileMetadata;
	getFileMetadataKey: string;
	updateFileMetadataKey: string;
	deleteFileMetadataKey: OkResponse;
	groupsList: GroupsListResponse;
	groupGet: UploadcareGroup;
	groupDelete: OkResponse;
	projectGet: UploadcareProject;
	webhooksList: WebhooksListResponse;
	webhookCreate: UploadcareWebhook;
	webhookUpdate: UploadcareWebhook;
	webhookDelete: OkResponse;
	webhookDeleteByUrl: OkResponse;
	uploadFromUrl: UploadFromUrlResponse;
	getUrlUploadStatus: UploadFromUrlStatusResponse;
	getUploadedFileInfo: UploadedFileInfo;
	createFileGroupUpload: UploadcareGroup;
	getFileGroupInfoUpload: UploadcareGroup;
	startMultipartUpload: MultipartStartResponse;
	executeClamavScan: AddonExecuteResponse;
	getClamavScanStatus: AddonStatusResponse;
	getAwsRekognitionExecutionStatus: AddonStatusResponse;
	checkAwsRekognitionModerationStatus: AddonStatusResponse;
	checkRemoveBgStatus: AddonStatusResponse;
	imageMirror: CdnUrlResponse;
	rotateImage: CdnUrlResponse;
};

export const UploadcareEndpointInputSchemas = {
	filesList: FilesListInputSchema,
	fileGet: FileIdInputSchema,
	fileStore: FileIdInputSchema,
	fileDelete: FileIdInputSchema,
	batchStoreFiles: BatchFilesInputSchema,
	batchDeleteFiles: BatchFilesInputSchema,
	copyLocal: CopyLocalInputSchema,
	getFileMetadata: FileMetadataInputSchema,
	getFileMetadataKey: FileMetadataKeyInputSchema,
	updateFileMetadataKey: FileMetadataUpdateInputSchema,
	deleteFileMetadataKey: FileMetadataKeyInputSchema,
	groupsList: GroupsListInputSchema,
	groupGet: GroupIdInputSchema,
	groupDelete: GroupIdInputSchema,
	projectGet: ProjectGetInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhookCreate: WebhookCreateInputSchema,
	webhookUpdate: WebhookUpdateInputSchema,
	webhookDelete: WebhookDeleteInputSchema,
	webhookDeleteByUrl: WebhookDeleteByUrlInputSchema,
	uploadFromUrl: UploadFromUrlInputSchema,
	getUrlUploadStatus: UploadFromUrlStatusInputSchema,
	getUploadedFileInfo: UploadedFileInfoInputSchema,
	createFileGroupUpload: UploadCreateGroupInputSchema,
	getFileGroupInfoUpload: UploadGroupInfoInputSchema,
	startMultipartUpload: MultipartStartInputSchema,
	executeClamavScan: AddonExecuteInputSchema,
	getClamavScanStatus: AddonStatusInputSchema,
	getAwsRekognitionExecutionStatus: AddonStatusInputSchema,
	checkAwsRekognitionModerationStatus: AddonStatusInputSchema,
	checkRemoveBgStatus: AddonStatusInputSchema,
	imageMirror: CdnMirrorInputSchema,
	rotateImage: CdnRotateInputSchema,
} as const;

export const UploadcareEndpointOutputSchemas = {
	filesList: FilesListResponseSchema,
	fileGet: UploadcareFileSchema,
	fileStore: UploadcareFileSchema,
	fileDelete: UploadcareFileSchema,
	batchStoreFiles: BatchResponseSchema,
	batchDeleteFiles: BatchResponseSchema,
	copyLocal: CopyLocalResponseSchema,
	getFileMetadata: FileMetadataSchema,
	getFileMetadataKey: FileMetadataValueSchema,
	updateFileMetadataKey: FileMetadataValueSchema,
	deleteFileMetadataKey: OkSchema,
	groupsList: GroupsListResponseSchema,
	groupGet: UploadcareGroupSchema,
	groupDelete: OkSchema,
	projectGet: UploadcareProjectSchema,
	webhooksList: WebhooksListResponseSchema,
	webhookCreate: UploadcareWebhookSchema,
	webhookUpdate: UploadcareWebhookSchema,
	webhookDelete: OkSchema,
	webhookDeleteByUrl: OkSchema,
	uploadFromUrl: UploadFromUrlResponseSchema,
	getUrlUploadStatus: UploadFromUrlStatusResponseSchema,
	getUploadedFileInfo: UploadedFileInfoSchema,
	createFileGroupUpload: UploadcareGroupSchema,
	getFileGroupInfoUpload: UploadcareGroupSchema,
	startMultipartUpload: MultipartStartResponseSchema,
	executeClamavScan: AddonExecuteResponseSchema,
	getClamavScanStatus: AddonStatusResponseSchema,
	getAwsRekognitionExecutionStatus: AddonStatusResponseSchema,
	checkAwsRekognitionModerationStatus: AddonStatusResponseSchema,
	checkRemoveBgStatus: AddonStatusResponseSchema,
	imageMirror: CdnUrlResponseSchema,
	rotateImage: CdnUrlResponseSchema,
} as const;
