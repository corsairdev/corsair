import { z } from 'zod';

// ── Shared Sub-Schemas ────────────────────────────────────────────────────────

const FileMetadataSchema = z
	.object({
		'.tag': z.literal('file'),
		id: z.string(),
		name: z.string(),
		path_lower: z.string().optional(),
		path_display: z.string().optional(),
		size: z.number().optional(),
		is_downloadable: z.boolean().optional(),
		server_modified: z.string().optional(),
		client_modified: z.string().optional(),
		rev: z.string().optional(),
		content_hash: z.string().optional(),
	})
	.passthrough();

const FolderMetadataSchema = z
	.object({
		'.tag': z.literal('folder'),
		id: z.string(),
		name: z.string(),
		path_lower: z.string().optional(),
		path_display: z.string().optional(),
	})
	.passthrough();

// Returned by list_folder when include_deleted: true; has no id field
const DeletedMetadataSchema = z
	.object({
		'.tag': z.literal('deleted'),
		name: z.string(),
		path_lower: z.string().optional(),
		path_display: z.string().optional(),
	})
	.passthrough();

const EntryMetadataSchema = z.discriminatedUnion('.tag', [
	FileMetadataSchema,
	FolderMetadataSchema,
	DeletedMetadataSchema,
]);

// ── Input Schemas ─────────────────────────────────────────────────────────────

const FilesCopyInputSchema = z.object({
	from_path: z.string(),
	to_path: z.string(),
	allow_shared_folder: z.boolean().optional(),
	autorename: z.boolean().optional(),
	allow_ownership_transfer: z.boolean().optional(),
});

const FilesDeleteInputSchema = z.object({
	path: z.string(),
});

const FilesDownloadInputSchema = z.object({
	path: z.string(),
});

const FilesMoveInputSchema = z.object({
	from_path: z.string(),
	to_path: z.string(),
	allow_shared_folder: z.boolean().optional(),
	autorename: z.boolean().optional(),
	allow_ownership_transfer: z.boolean().optional(),
});

const FilesUploadInputSchema = z.object({
	path: z.string(),
	content: z.string(),
	mode: z.enum(['add', 'overwrite', 'update']).optional(),
	autorename: z.boolean().optional(),
	mute: z.boolean().optional(),
	strict_conflict: z.boolean().optional(),
});

const FoldersCopyInputSchema = z.object({
	from_path: z.string(),
	to_path: z.string(),
	allow_shared_folder: z.boolean().optional(),
	autorename: z.boolean().optional(),
	allow_ownership_transfer: z.boolean().optional(),
});

const FoldersCreateInputSchema = z.object({
	path: z.string(),
	autorename: z.boolean().optional(),
});

const FoldersDeleteInputSchema = z.object({
	path: z.string(),
});

const FoldersListInputSchema = z.object({
	path: z.string(),
	recursive: z.boolean().optional(),
	include_deleted: z.boolean().optional(),
	include_mounted_folders: z.boolean().optional(),
	limit: z.number().optional(),
});

const FoldersMoveInputSchema = z.object({
	from_path: z.string(),
	to_path: z.string(),
	allow_shared_folder: z.boolean().optional(),
	autorename: z.boolean().optional(),
	allow_ownership_transfer: z.boolean().optional(),
});

const FoldersListContinueInputSchema = z.object({
	cursor: z.string(),
});

const SearchQueryInputSchema = z.object({
	query: z.string(),
	path: z.string().optional(),
	max_results: z.number().optional(),
	filename_only: z.boolean().optional(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const FilesCopyOutputSchema = z
	.object({
		metadata: EntryMetadataSchema,
	})
	.passthrough();

const FilesDeleteOutputSchema = z
	.object({
		metadata: EntryMetadataSchema,
	})
	.passthrough();

const FilesDownloadOutputSchema = z.object({
	content: z.string(),
	name: z.string().optional(),
	size: z.number().optional(),
	path_lower: z.string().optional(),
});

const FilesMoveOutputSchema = z
	.object({
		metadata: EntryMetadataSchema,
	})
	.passthrough();

const FilesUploadOutputSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		path_lower: z.string().optional(),
		path_display: z.string().optional(),
		size: z.number().optional(),
		is_downloadable: z.boolean().optional(),
		server_modified: z.string().optional(),
		client_modified: z.string().optional(),
		rev: z.string().optional(),
		content_hash: z.string().optional(),
	})
	.passthrough();

const FoldersCopyOutputSchema = z
	.object({
		metadata: EntryMetadataSchema,
	})
	.passthrough();

const FoldersCreateOutputSchema = z
	.object({
		metadata: FolderMetadataSchema,
	})
	.passthrough();

const FoldersDeleteOutputSchema = z
	.object({
		metadata: EntryMetadataSchema,
	})
	.passthrough();

const FoldersListOutputSchema = z
	.object({
		entries: z.array(EntryMetadataSchema),
		cursor: z.string(),
		has_more: z.boolean(),
	})
	.passthrough();

const FoldersMoveOutputSchema = z
	.object({
		metadata: EntryMetadataSchema,
	})
	.passthrough();

const FoldersListContinueOutputSchema = z
	.object({
		entries: z.array(EntryMetadataSchema),
		cursor: z.string(),
		has_more: z.boolean(),
	})
	.passthrough();

const SearchMatchSchema = z
	.object({
		metadata: z
			.object({
				metadata: EntryMetadataSchema,
			})
			.passthrough()
			.optional(),
		// unknown used because Dropbox's match_type object has an undocumented/variable structure
		match_type: z.record(z.unknown()).optional(),
	})
	.passthrough();

const SearchQueryOutputSchema = z
	.object({
		matches: z.array(SearchMatchSchema),
		has_more: z.boolean(),
		cursor: z.string().optional(),
	})
	.passthrough();

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type DropboxEndpointInputs = {
	filesCopy: z.infer<typeof FilesCopyInputSchema>;
	filesDelete: z.infer<typeof FilesDeleteInputSchema>;
	filesDownload: z.infer<typeof FilesDownloadInputSchema>;
	filesMove: z.infer<typeof FilesMoveInputSchema>;
	filesUpload: z.infer<typeof FilesUploadInputSchema>;
	foldersCopy: z.infer<typeof FoldersCopyInputSchema>;
	foldersCreate: z.infer<typeof FoldersCreateInputSchema>;
	foldersDelete: z.infer<typeof FoldersDeleteInputSchema>;
	foldersList: z.infer<typeof FoldersListInputSchema>;
	foldersListContinue: z.infer<typeof FoldersListContinueInputSchema>;
	foldersMove: z.infer<typeof FoldersMoveInputSchema>;
	searchQuery: z.infer<typeof SearchQueryInputSchema>;
};

export type DropboxEndpointOutputs = {
	filesCopy: z.infer<typeof FilesCopyOutputSchema>;
	filesDelete: z.infer<typeof FilesDeleteOutputSchema>;
	filesDownload: z.infer<typeof FilesDownloadOutputSchema>;
	filesMove: z.infer<typeof FilesMoveOutputSchema>;
	filesUpload: z.infer<typeof FilesUploadOutputSchema>;
	foldersCopy: z.infer<typeof FoldersCopyOutputSchema>;
	foldersCreate: z.infer<typeof FoldersCreateOutputSchema>;
	foldersDelete: z.infer<typeof FoldersDeleteOutputSchema>;
	foldersList: z.infer<typeof FoldersListOutputSchema>;
	foldersListContinue: z.infer<typeof FoldersListContinueOutputSchema>;
	foldersMove: z.infer<typeof FoldersMoveOutputSchema>;
	searchQuery: z.infer<typeof SearchQueryOutputSchema>;
};

export const DropboxEndpointInputSchemas = {
	filesCopy: FilesCopyInputSchema,
	filesDelete: FilesDeleteInputSchema,
	filesDownload: FilesDownloadInputSchema,
	filesMove: FilesMoveInputSchema,
	filesUpload: FilesUploadInputSchema,
	foldersCopy: FoldersCopyInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	foldersList: FoldersListInputSchema,
	foldersListContinue: FoldersListContinueInputSchema,
	foldersMove: FoldersMoveInputSchema,
	searchQuery: SearchQueryInputSchema,
} as const;

export const DropboxEndpointOutputSchemas = {
	filesCopy: FilesCopyOutputSchema,
	filesDelete: FilesDeleteOutputSchema,
	filesDownload: FilesDownloadOutputSchema,
	filesMove: FilesMoveOutputSchema,
	filesUpload: FilesUploadOutputSchema,
	foldersCopy: FoldersCopyOutputSchema,
	foldersCreate: FoldersCreateOutputSchema,
	foldersDelete: FoldersDeleteOutputSchema,
	foldersList: FoldersListOutputSchema,
	foldersListContinue: FoldersListContinueOutputSchema,
	foldersMove: FoldersMoveOutputSchema,
	searchQuery: SearchQueryOutputSchema,
} as const;

export type { FileMetadataSchema, FolderMetadataSchema, DeletedMetadataSchema };

export type FileMetadata = z.infer<typeof FileMetadataSchema>;
export type FolderMetadata = z.infer<typeof FolderMetadataSchema>;
export type DeletedMetadata = z.infer<typeof DeletedMetadataSchema>;
export type EntryMetadata = z.infer<typeof EntryMetadataSchema>;
