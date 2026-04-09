import { z } from 'zod';

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const BoxUserMiniSchema = z
	.object({
		type: z.string().optional(),
		id: z.string().optional(),
		name: z.string().optional(),
		login: z.string().optional(),
	})
	.passthrough();

const BoxItemMiniSchema = z
	.object({
		type: z.string().optional(),
		id: z.string().optional(),
		sequence_id: z.string().nullable().optional(),
		etag: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.passthrough();

const BoxSharedLinkSchema = z
	.object({
		url: z.string().optional(),
		download_url: z.string().nullable().optional(),
		vanity_url: z.string().nullable().optional(),
		access: z.string().optional(),
		effective_access: z.string().optional(),
		effective_permission: z.string().optional(),
		unshared_at: z.string().nullable().optional(),
		is_password_enabled: z.boolean().optional(),
		permissions: z
			.object({
				can_download: z.boolean().optional(),
				can_preview: z.boolean().optional(),
				can_edit: z.boolean().optional(),
			})
			.optional(),
		download_count: z.number().optional(),
		preview_count: z.number().optional(),
	})
	.passthrough();

const BoxPathCollectionSchema = z
	.object({
		total_count: z.number().optional(),
		entries: z.array(BoxItemMiniSchema).optional(),
	})
	.passthrough();

const BoxFileSchema = z
	.object({
		type: z.literal('file').optional(),
		id: z.string(),
		sequence_id: z.string().optional(),
		etag: z.string().optional(),
		sha1: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		size: z.number().optional(),
		path_collection: BoxPathCollectionSchema.optional(),
		created_at: z.string().optional(),
		modified_at: z.string().optional(),
		trashed_at: z.string().nullable().optional(),
		purged_at: z.string().nullable().optional(),
		content_created_at: z.string().optional(),
		content_modified_at: z.string().optional(),
		created_by: BoxUserMiniSchema.optional(),
		modified_by: BoxUserMiniSchema.optional(),
		owned_by: BoxUserMiniSchema.optional(),
		shared_link: BoxSharedLinkSchema.nullable().optional(),
		parent: BoxItemMiniSchema.nullable().optional(),
		item_status: z.string().optional(),
		extension: z.string().optional(),
		is_package: z.boolean().optional(),
	})
	.passthrough();

const BoxFolderSchema = z
	.object({
		type: z.literal('folder').optional(),
		id: z.string(),
		sequence_id: z.string().nullable().optional(),
		etag: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		path_collection: BoxPathCollectionSchema.optional(),
		created_at: z.string().optional(),
		modified_at: z.string().optional(),
		trashed_at: z.string().nullable().optional(),
		purged_at: z.string().nullable().optional(),
		content_created_at: z.string().optional(),
		content_modified_at: z.string().optional(),
		created_by: BoxUserMiniSchema.optional(),
		modified_by: BoxUserMiniSchema.optional(),
		owned_by: BoxUserMiniSchema.optional(),
		shared_link: BoxSharedLinkSchema.nullable().optional(),
		parent: BoxItemMiniSchema.nullable().optional(),
		item_status: z.string().optional(),
		is_externally_owned: z.boolean().optional(),
		has_collaborations: z.boolean().optional(),
		item_collection: z
			.object({
				total_count: z.number().optional(),
				// unknown: item_collection.entries contains mixed file/folder/web_link objects with no fixed schema
				entries: z.array(z.record(z.unknown())).optional(),
			})
			.optional(),
	})
	.passthrough();

const BoxSearchResultEntrySchema = z
	.object({
		type: z.string().optional(),
		id: z.string(),
		name: z.string().optional(),
	})
	.passthrough();

// ── Input Schemas ─────────────────────────────────────────────────────────────

const FilesGetInputSchema = z.object({
	file_id: z.string(),
	fields: z.string().optional(),
});

const FilesCopyInputSchema = z.object({
	file_id: z.string(),
	parent: z.object({ id: z.string() }),
	name: z.string().optional(),
	version: z.string().optional(),
});

const FilesDeleteInputSchema = z.object({
	file_id: z.string(),
	if_match: z.string().optional(),
});

const FilesDownloadInputSchema = z.object({
	file_id: z.string(),
	version: z.string().optional(),
});

const FilesSearchInputSchema = z.object({
	query: z.string(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	ancestor_folder_ids: z.string().optional(),
	content_types: z.string().optional(),
	created_at_range: z.string().optional(),
	file_extensions: z.string().optional(),
	owner_user_ids: z.string().optional(),
	size_range: z.string().optional(),
	sort: z.enum(['modified_at', 'name']).optional(),
	direction: z.enum(['ASC', 'DESC']).optional(),
});

const FilesShareInputSchema = z.object({
	file_id: z.string(),
	shared_link: z.object({
		access: z.enum(['open', 'company', 'collaborators']).optional(),
		password: z.string().optional(),
		unshared_at: z.string().optional(),
		permissions: z
			.object({
				can_download: z.boolean().optional(),
				can_preview: z.boolean().optional(),
				can_edit: z.boolean().optional(),
			})
			.optional(),
	}),
});

const FilesUploadInputSchema = z.object({
	name: z.string(),
	parent_id: z.string(),
	content: z.string(),
	content_created_at: z.string().optional(),
	content_modified_at: z.string().optional(),
	description: z.string().optional(),
});

const FoldersGetInputSchema = z.object({
	folder_id: z.string(),
	fields: z.string().optional(),
});

const FoldersCreateInputSchema = z.object({
	name: z.string(),
	parent_id: z.string(),
	folder_upload_email_access: z.string().optional(),
	sync_state: z.string().optional(),
});

const FoldersDeleteInputSchema = z.object({
	folder_id: z.string(),
	recursive: z.boolean().optional(),
});

const FoldersSearchInputSchema = z.object({
	query: z.string(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	ancestor_folder_ids: z.string().optional(),
	owner_user_ids: z.string().optional(),
	sort: z.enum(['modified_at', 'name']).optional(),
	direction: z.enum(['ASC', 'DESC']).optional(),
});

const FoldersShareInputSchema = z.object({
	folder_id: z.string(),
	shared_link: z.object({
		access: z.enum(['open', 'company', 'collaborators']).optional(),
		password: z.string().optional(),
		unshared_at: z.string().optional(),
		permissions: z
			.object({
				can_download: z.boolean().optional(),
				can_preview: z.boolean().optional(),
			})
			.optional(),
	}),
});

const FoldersUpdateInputSchema = z.object({
	folder_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	parent_id: z.string().optional(),
	tags: z.array(z.string()).optional(),
	is_collaboration_restricted_to_enterprise: z.boolean().optional(),
	can_non_owners_invite: z.boolean().optional(),
	can_non_owners_view_collaborators: z.boolean().optional(),
	fields: z.string().optional(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const FilesGetResponseSchema = BoxFileSchema;

const FilesCopyResponseSchema = BoxFileSchema;

const FilesDeleteResponseSchema = z.object({
	success: z.boolean(),
});

const FilesDownloadResponseSchema = z.string();

const FilesSearchResponseSchema = z.object({
	total_count: z.number().optional(),
	offset: z.number().optional(),
	limit: z.number().optional(),
	entries: z.array(BoxSearchResultEntrySchema).optional(),
});

const FilesShareResponseSchema = BoxFileSchema;

const FilesUploadResponseSchema = z.object({
	total_count: z.number().optional(),
	entries: z.array(BoxFileSchema).optional(),
});

const FoldersGetResponseSchema = BoxFolderSchema;

const FoldersCreateResponseSchema = BoxFolderSchema;

const FoldersDeleteResponseSchema = z.object({
	success: z.boolean(),
});

const FoldersSearchResponseSchema = z.object({
	total_count: z.number().optional(),
	offset: z.number().optional(),
	limit: z.number().optional(),
	entries: z.array(BoxSearchResultEntrySchema).optional(),
});

const FoldersShareResponseSchema = BoxFolderSchema;

const FoldersUpdateResponseSchema = BoxFolderSchema;

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export const BoxEndpointInputSchemas = {
	filesGet: FilesGetInputSchema,
	filesCopy: FilesCopyInputSchema,
	filesDelete: FilesDeleteInputSchema,
	filesDownload: FilesDownloadInputSchema,
	filesSearch: FilesSearchInputSchema,
	filesShare: FilesShareInputSchema,
	filesUpload: FilesUploadInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	foldersSearch: FoldersSearchInputSchema,
	foldersShare: FoldersShareInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
} as const;

export const BoxEndpointOutputSchemas = {
	filesGet: FilesGetResponseSchema,
	filesCopy: FilesCopyResponseSchema,
	filesDelete: FilesDeleteResponseSchema,
	filesDownload: FilesDownloadResponseSchema,
	filesSearch: FilesSearchResponseSchema,
	filesShare: FilesShareResponseSchema,
	filesUpload: FilesUploadResponseSchema,
	foldersGet: FoldersGetResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
	foldersDelete: FoldersDeleteResponseSchema,
	foldersSearch: FoldersSearchResponseSchema,
	foldersShare: FoldersShareResponseSchema,
	foldersUpdate: FoldersUpdateResponseSchema,
} as const;

export type BoxEndpointInputs = {
	[K in keyof typeof BoxEndpointInputSchemas]: z.infer<
		(typeof BoxEndpointInputSchemas)[K]
	>;
};

export type BoxEndpointOutputs = {
	[K in keyof typeof BoxEndpointOutputSchemas]: z.infer<
		(typeof BoxEndpointOutputSchemas)[K]
	>;
};

export type FilesGetInput = BoxEndpointInputs['filesGet'];
export type FilesGetResponse = BoxEndpointOutputs['filesGet'];
export type FilesCopyInput = BoxEndpointInputs['filesCopy'];
export type FilesCopyResponse = BoxEndpointOutputs['filesCopy'];
export type FilesDeleteInput = BoxEndpointInputs['filesDelete'];
export type FilesDeleteResponse = BoxEndpointOutputs['filesDelete'];
export type FilesDownloadInput = BoxEndpointInputs['filesDownload'];
export type FilesDownloadResponse = BoxEndpointOutputs['filesDownload'];
export type FilesSearchInput = BoxEndpointInputs['filesSearch'];
export type FilesSearchResponse = BoxEndpointOutputs['filesSearch'];
export type FilesShareInput = BoxEndpointInputs['filesShare'];
export type FilesShareResponse = BoxEndpointOutputs['filesShare'];
export type FilesUploadInput = BoxEndpointInputs['filesUpload'];
export type FilesUploadResponse = BoxEndpointOutputs['filesUpload'];
export type FoldersGetInput = BoxEndpointInputs['foldersGet'];
export type FoldersGetResponse = BoxEndpointOutputs['foldersGet'];
export type FoldersCreateInput = BoxEndpointInputs['foldersCreate'];
export type FoldersCreateResponse = BoxEndpointOutputs['foldersCreate'];
export type FoldersDeleteInput = BoxEndpointInputs['foldersDelete'];
export type FoldersDeleteResponse = BoxEndpointOutputs['foldersDelete'];
export type FoldersSearchInput = BoxEndpointInputs['foldersSearch'];
export type FoldersSearchResponse = BoxEndpointOutputs['foldersSearch'];
export type FoldersShareInput = BoxEndpointInputs['foldersShare'];
export type FoldersShareResponse = BoxEndpointOutputs['foldersShare'];
export type FoldersUpdateInput = BoxEndpointInputs['foldersUpdate'];
export type FoldersUpdateResponse = BoxEndpointOutputs['foldersUpdate'];
