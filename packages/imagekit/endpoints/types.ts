import { z } from 'zod';

// Inputs use ImageKit's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field ImageKit adds or omits cannot fail a
// call that has already happened. Field reference:
// https://imagekit.io/docs/api-reference

const FileIdSchema = z
	.string()
	.min(1)
	.describe('Unique identifier of the asset.');

const FilePathSchema = z
	.string()
	.min(1)
	.describe(
		'Full path of the asset, starting and ending with `/`, e.g. `/images/photo.jpg`.',
	);

// Bulk tag endpoints cap fileIds at 50 per call; their 400 error text names it.
const BulkFileIdsSchema = z
	.array(FileIdSchema)
	.min(1)
	.max(50)
	.describe('Up to 50 file IDs to update in one call.');

const TagsSchema = z
	.array(z.string().min(1))
	.min(1)
	.describe('Tag names, e.g. ["summer", "sale"].');

// unknown: values are typed per custom metadata field definition, which
// this plugin does not read, so they pass through as sent.
const CustomMetadataSchema = z
	.record(z.string(), z.unknown())
	.describe(
		'Custom metadata to set, keyed by field label, identifier or UUID.',
	);

// ── shared output shapes ──────────────────────────────────────────────────

const AITagSchema = z
	.object({
		name: z.string(),
		source: z.string().nullish(),
		confidence: z.number().nullish(),
	})
	.loose();

const VersionInfoSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
	})
	.loose();

export const ImageKitFileSchema = z
	.object({
		fileId: z.string(),
		// A string rather than the enum: an unknown type must not fail a read.
		type: z.string().nullish(),
		name: z.string().nullish(),
		filePath: z.string().nullish(),
		url: z.string().nullish(),
		thumbnail: z.string().nullish(),
		fileType: z.string().nullish(),
		size: z.number().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		tags: z.array(z.string()).nullish(),
		AITags: z.array(AITagSchema).nullish(),
		versionInfo: VersionInfoSchema.nullish(),
		isPrivateFile: z.boolean().nullish(),
		isPublished: z.boolean().nullish(),
		customCoordinates: z.string().nullish(),
		description: z.string().nullish(),
		customMetadata: CustomMetadataSchema.nullish(),
		// unknown: per-extension result objects keyed by extension name.
		extensionStatus: z.record(z.string(), z.unknown()).nullish(),
		// unknown: EXIF and similar blocks vary by file type.
		embeddedMetadata: z.record(z.string(), z.unknown()).nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type ImageKitFile = z.infer<typeof ImageKitFileSchema>;

export const ImageKitUploadSchema = z
	.object({
		fileId: z.string(),
		name: z.string().nullish(),
		filePath: z.string().nullish(),
		url: z.string().nullish(),
		thumbnailUrl: z.string().nullish(),
		fileType: z.string().nullish(),
		size: z.number().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		bitRate: z.number().nullish(),
		duration: z.number().nullish(),
		audioCodec: z.string().nullish(),
		videoCodec: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		AITags: z.array(AITagSchema).nullish(),
		versionInfo: VersionInfoSchema.nullish(),
		isPrivateFile: z.boolean().nullish(),
		isPublished: z.boolean().nullish(),
		customCoordinates: z.string().nullish(),
		description: z.string().nullish(),
		customMetadata: CustomMetadataSchema.nullish(),
		// unknown: metadata is only returned when responseFields asks for it.
		metadata: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type ImageKitUpload = z.infer<typeof ImageKitUploadSchema>;

export const ImageKitFolderSchema = z
	.object({
		type: z.string().nullish(),
		folderId: z.string(),
		name: z.string().nullish(),
		folderPath: z.string().nullish(),
		customMetadata: CustomMetadataSchema.nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type ImageKitFolder = z.infer<typeof ImageKitFolderSchema>;

export const ImageKitMetadataSchema = z
	.object({
		height: z.number().nullish(),
		width: z.number().nullish(),
		size: z.number().nullish(),
		format: z.string().nullish(),
		hasColorProfile: z.boolean().nullish(),
		quality: z.number().nullish(),
		density: z.number().nullish(),
		hasTransparency: z.boolean().nullish(),
		pHash: z.string().nullish(),
		bitRate: z.number().nullish(),
		duration: z.number().nullish(),
		audioCodec: z.string().nullish(),
		videoCodec: z.string().nullish(),
		// unknown: EXIF blocks vary by file.
		exif: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type ImageKitMetadata = z.infer<typeof ImageKitMetadataSchema>;

const BulkErrorsSchema = z
	.array(
		z.object({
			fileId: z.string(),
			error: z.string(),
		}),
	)
	.nullish();

export const ImageKitBulkUpdateSchema = z
	.object({
		successfullyUpdatedFileIds: z.array(z.string()),
		errors: BulkErrorsSchema,
	})
	.loose();

export type ImageKitBulkUpdate = z.infer<typeof ImageKitBulkUpdateSchema>;

export const ImageKitBulkDeleteSchema = z
	.object({
		successfullyDeletedFileIds: z.array(z.string()),
		errors: BulkErrorsSchema,
	})
	.loose();

export type ImageKitBulkDelete = z.infer<typeof ImageKitBulkDeleteSchema>;

export const ImageKitJobSchema = z
	.object({
		jobId: z.string(),
		// Strings rather than enums: COPY_FOLDER, MOVE_FOLDER, RENAME_FOLDER
		// must not fail a status read that ImageKit can extend.
		type: z.string().nullish(),
		status: z.string(),
		purgeRequestId: z.string().nullish(),
	})
	.loose();

export type ImageKitJob = z.infer<typeof ImageKitJobSchema>;

// copy, move and folder delete answer an empty-object 204; folder create an
// empty-object 201. The resource is addressed by path, so the payload adds
// nothing and `{}` parses it.
const EmptyObjectSchema = z.object({}).loose();

// ── files.upload ──────────────────────────────────────────────────────────

const FilesUploadInputSchema = z.object({
	file: z
		.string()
		.min(1)
		.describe(
			'The file to upload: an https URL ImageKit can fetch, or base64-encoded content.',
		),
	fileName: z
		.string()
		.min(1)
		.describe('Name the file gets in the media library, e.g. photo.jpg.'),
	folder: z
		.string()
		.min(1)
		.optional()
		.describe('Destination folder path, e.g. `/products/`.'),
	// Upload sends tags as one comma-joined multipart field, so a comma inside
	// a tag would split it in two.
	tags: TagsSchema.refine((tags) => tags.every((tag) => !tag.includes(',')), {
		message: 'Upload tags cannot contain a comma',
	})
		.optional()
		.describe('Tags to attach to the uploaded file; no commas inside a tag.'),
	isPrivateFile: z
		.boolean()
		.optional()
		.describe('Serve the file only through signed URLs.'),
	isPublished: z.boolean().optional().describe('Publish the file immediately.'),
	useUniqueFileName: z
		.boolean()
		.optional()
		.describe('Add a random suffix to fileName when true (the default).'),
	overwriteFile: z
		.boolean()
		.optional()
		.describe('Replace an existing file at the same path.'),
	overwriteTags: z
		.boolean()
		.optional()
		.describe('Replace existing tags instead of merging.'),
	overwriteAITags: z
		.boolean()
		.optional()
		.describe('Replace existing AI tags instead of merging.'),
	overwriteCustomMetadata: z
		.boolean()
		.optional()
		.describe('Replace existing custom metadata instead of merging.'),
	customMetadata: CustomMetadataSchema.optional(),
	description: z
		.string()
		.min(1)
		.optional()
		.describe('Short human-readable description stored with the file.'),
});

export type FilesUploadInput = z.input<typeof FilesUploadInputSchema>;

const FilesUploadResponseSchema = ImageKitUploadSchema;

// ── files.list ────────────────────────────────────────────────────────────

const FilesListInputSchema = z.object({
	type: z
		.enum(['file', 'file-version', 'folder', 'all'])
		.optional()
		.describe('Asset kind to list; the default `file` lists only files.'),
	path: z
		.string()
		.optional()
		.describe('Only assets inside this folder path, e.g. `/products/`.'),
	searchQuery: z
		.string()
		.optional()
		.describe(
			'Search filter expression over name, tags, type, size and createdAt, e.g. `name = "summer"`.',
		),
	fileType: z
		.enum(['all', 'image', 'non-image'])
		.optional()
		.describe('All files, images only, or non-image files (video and others).'),
	sort: z
		.enum([
			'ASC_NAME',
			'DESC_NAME',
			'ASC_CREATED',
			'DESC_CREATED',
			'ASC_UPDATED',
			'DESC_UPDATED',
			'ASC_HEIGHT',
			'DESC_HEIGHT',
			'ASC_WIDTH',
			'DESC_WIDTH',
			'ASC_SIZE',
			'DESC_SIZE',
			'ASC_RELEVANCE',
			'DESC_RELEVANCE',
		])
		.optional()
		.describe('Sort token, e.g. ASC_CREATED (the default) or DESC_SIZE.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Page size, 1-1000; the default is 1000.'),
	skip: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Assets to skip before this page; combine with limit to page.'),
});

export type FilesListInput = z.input<typeof FilesListInputSchema>;

const FilesListResponseSchema = z
	.array(z.union([ImageKitFileSchema, ImageKitFolderSchema]))
	.describe('One page of assets, files and folders mixed.');

// ── files.getDetails / files.updateDetails ────────────────────────────────

const FilesGetDetailsInputSchema = z.object({ fileId: FileIdSchema });

export type FilesGetDetailsInput = z.input<typeof FilesGetDetailsInputSchema>;

const FilesGetDetailsResponseSchema = ImageKitFileSchema;

const FilesUpdateDetailsInputSchema = z
	.object({
		fileId: FileIdSchema,
		tags: z
			.array(z.string().min(1))
			.optional()
			.describe('Full replacement tag list; an empty array clears every tag.'),
		customCoordinates: z
			.string()
			.optional()
			.describe('Custom coordinates string, e.g. `10,10,100,100`.'),
		customMetadata: CustomMetadataSchema.optional(),
		description: z
			.string()
			.optional()
			.describe('Short human-readable description stored with the file.'),
		removeAITags: z
			.union([TagsSchema, z.literal('all')])
			.optional()
			.describe(
				'AI tag names to remove, or the string `all` to remove every AI tag.',
			),
		isPublished: z
			.boolean()
			.optional()
			.describe(
				'Publish or unpublish the file. Send this alone: ImageKit rejects it mixed with the other fields.',
			),
	})
	// ImageKit's update body is a oneOf: a publish change cannot carry the
	// detail fields, so the mix fails here instead of at ImageKit.
	.refine(
		({ isPublished, fileId: _fileId, ...details }) =>
			isPublished === undefined ||
			Object.values(details).every((value) => value === undefined),
		{
			message:
				'Send isPublished alone; change tags, metadata, coordinates or description in a separate call.',
			path: ['isPublished'],
		},
	);

export type FilesUpdateDetailsInput = z.input<
	typeof FilesUpdateDetailsInputSchema
>;

const FilesUpdateDetailsResponseSchema = ImageKitFileSchema;

// ── files.delete ──────────────────────────────────────────────────────────

const FilesDeleteInputSchema = z.object({ fileId: FileIdSchema });

export type FilesDeleteInput = z.input<typeof FilesDeleteInputSchema>;

const FilesDeleteResponseSchema = EmptyObjectSchema;

// ── files.bulkDelete ──────────────────────────────────────────────────────

const FilesBulkDeleteInputSchema = z.object({
	fileIds: z
		.array(FileIdSchema)
		.min(1)
		// ImageKit deletes at most 100 files per call.
		.max(100)
		.describe(
			'Up to 100 file IDs to delete permanently; a 207 answer reports per-file failures.',
		),
});

export type FilesBulkDeleteInput = z.input<typeof FilesBulkDeleteInputSchema>;

const FilesBulkDeleteResponseSchema = ImageKitBulkDeleteSchema;

// ── files.copy / files.move ───────────────────────────────────────────────

const FilesCopyInputSchema = z.object({
	sourceFilePath: FilePathSchema.describe('Path of the file to copy.'),
	destinationPath: z
		.string()
		.min(1)
		.describe('Folder path to copy the file into, e.g. `/archive/`.'),
	includeFileVersions: z
		.boolean()
		.optional()
		.describe('Copy the file with all of its versions.'),
});

export type FilesCopyInput = z.input<typeof FilesCopyInputSchema>;

const FilesMoveInputSchema = z.object({
	sourceFilePath: FilePathSchema.describe('Path of the file to move.'),
	destinationPath: z
		.string()
		.min(1)
		.describe('Folder path to move the file into.'),
});

export type FilesMoveInput = z.input<typeof FilesMoveInputSchema>;

// ── files.rename ──────────────────────────────────────────────────────────

const FilesRenameInputSchema = z.object({
	filePath: FilePathSchema.describe('Path of the file to rename.'),
	newFileName: z.string().min(1).describe('New file name, without the folder.'),
	purgeCache: z
		.boolean()
		.optional()
		.describe(
			'Also purge the CDN cache for the file; adds purgeRequestId to the answer.',
		),
});

export type FilesRenameInput = z.input<typeof FilesRenameInputSchema>;

// 200 answers { purgeRequestId } (null without purgeCache); 207 answers
// { reason: PURGE_FAILED, message } when the rename worked but the purge did
// not. Both fields stay optional so either answer parses.
const FilesRenameResponseSchema = z
	.object({
		purgeRequestId: z.string().nullish(),
		reason: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

// ── files.addTags / files.removeTags / files.removeAITags ─────────────────

const FilesAddTagsInputSchema = z.object({
	fileIds: BulkFileIdsSchema,
	tags: TagsSchema.describe('Tags to add to every listed file.'),
});

export type FilesAddTagsInput = z.input<typeof FilesAddTagsInputSchema>;

const FilesRemoveTagsInputSchema = z.object({
	fileIds: BulkFileIdsSchema,
	tags: TagsSchema.describe('Tags to remove from every listed file.'),
});

export type FilesRemoveTagsInput = z.input<typeof FilesRemoveTagsInputSchema>;

const FilesRemoveAITagsInputSchema = z.object({
	fileIds: BulkFileIdsSchema,
	AITags: TagsSchema.describe('AI tag names to remove from every listed file.'),
});

export type FilesRemoveAITagsInput = z.input<
	typeof FilesRemoveAITagsInputSchema
>;

// ── fileVersions.* ────────────────────────────────────────────────────────

const FileVersionsListInputSchema = z.object({ fileId: FileIdSchema });

export type FileVersionsListInput = z.input<typeof FileVersionsListInputSchema>;

const FileVersionsListResponseSchema = z
	.array(ImageKitFileSchema)
	.describe('Every stored version of the file, newest first.');

const VersionIdSchema = z
	.string()
	.min(1)
	.describe('Version ID, the `versionInfo.id` of a version entry.');

const FileVersionsGetDetailsInputSchema = z.object({
	fileId: FileIdSchema,
	versionId: VersionIdSchema,
});

export type FileVersionsGetDetailsInput = z.input<
	typeof FileVersionsGetDetailsInputSchema
>;

const FileVersionsGetDetailsResponseSchema = ImageKitFileSchema;

const FileVersionsDeleteInputSchema = z.object({
	fileId: FileIdSchema,
	versionId: VersionIdSchema,
});

export type FileVersionsDeleteInput = z.input<
	typeof FileVersionsDeleteInputSchema
>;

const FileVersionsDeleteResponseSchema = EmptyObjectSchema;

const FileVersionsRestoreInputSchema = z.object({
	fileId: FileIdSchema,
	versionId: VersionIdSchema,
});

export type FileVersionsRestoreInput = z.input<
	typeof FileVersionsRestoreInputSchema
>;

const FileVersionsRestoreResponseSchema = ImageKitFileSchema;

// ── metadata.getByFileId / metadata.getByUrl ──────────────────────────────

const MetadataGetByFileIdInputSchema = z.object({ fileId: FileIdSchema });

export type MetadataGetByFileIdInput = z.input<
	typeof MetadataGetByFileIdInputSchema
>;

const MetadataGetByUrlInputSchema = z.object({
	url: z
		.string()
		.min(1)
		.describe(
			'Full https URL of the delivered file, transformation parameters allowed.',
		),
});

export type MetadataGetByUrlInput = z.input<typeof MetadataGetByUrlInputSchema>;

const MetadataResponseSchema = ImageKitMetadataSchema;

// ── folders.* ─────────────────────────────────────────────────────────────

const FoldersCreateInputSchema = z.object({
	folderName: z
		.string()
		.min(1)
		.describe(
			'Name of the new folder; characters outside letters and digits become underscores.',
		),
	parentFolderPath: z
		.string()
		.min(1)
		.describe(
			'Folder path to create the new folder in, e.g. `/` for the library root.',
		),
});

export type FoldersCreateInput = z.input<typeof FoldersCreateInputSchema>;

const FoldersCreateResponseSchema = EmptyObjectSchema;

const FoldersDeleteInputSchema = z.object({
	folderPath: FilePathSchema.describe(
		'Full path of the folder to delete, contents included.',
	),
});

export type FoldersDeleteInput = z.input<typeof FoldersDeleteInputSchema>;

const FoldersDeleteResponseSchema = EmptyObjectSchema;

const FoldersCopyInputSchema = z.object({
	sourceFolderPath: FilePathSchema.describe('Path of the folder to copy.'),
	destinationPath: z
		.string()
		.min(1)
		.describe('Folder path to copy the source folder into.'),
	includeVersions: z
		.boolean()
		.optional()
		.describe('Copy folder contents with all file versions.'),
});

export type FoldersCopyInput = z.input<typeof FoldersCopyInputSchema>;

const FoldersMoveInputSchema = z.object({
	sourceFolderPath: FilePathSchema.describe('Path of the folder to move.'),
	destinationPath: z
		.string()
		.min(1)
		.describe('Folder path to move the source folder into.'),
});

export type FoldersMoveInput = z.input<typeof FoldersMoveInputSchema>;

const FoldersRenameInputSchema = z.object({
	folderPath: FilePathSchema.describe('Path of the folder to rename.'),
	newFolderName: z
		.string()
		.min(1)
		.describe(
			'New folder name; characters outside letters, digits and `-` become underscores.',
		),
	purgeCache: z
		.boolean()
		.optional()
		.describe(
			'Also purge the CDN cache for the moved paths; adds purgeRequestId to the job status.',
		),
});

export type FoldersRenameInput = z.input<typeof FoldersRenameInputSchema>;

export const ImageKitBulkJobResponseSchema = z
	.object({
		jobId: z.string(),
	})
	.loose();

const FoldersGetJobStatusInputSchema = z.object({
	jobId: z
		.string()
		.min(1)
		.describe('Job ID from a folder copy, move or rename call.'),
});

export type FoldersGetJobStatusInput = z.input<
	typeof FoldersGetJobStatusInputSchema
>;

const FoldersGetJobStatusResponseSchema = ImageKitJobSchema;

// ── cache.purge / cache.getPurgeStatus ────────────────────────────────────

const CachePurgeInputSchema = z.object({
	url: z
		.string()
		.min(1)
		.describe('Full https URL of the delivered file whose CDN cache to purge.'),
});

export type CachePurgeInput = z.input<typeof CachePurgeInputSchema>;

export const ImageKitPurgeResponseSchema = z
	.object({
		requestId: z.string(),
	})
	.loose();

const CacheGetPurgeStatusInputSchema = z.object({
	requestId: z.string().min(1).describe('Request ID from a cache purge call.'),
});

export type CacheGetPurgeStatusInput = z.input<
	typeof CacheGetPurgeStatusInputSchema
>;

const CacheGetPurgeStatusResponseSchema = z
	.object({
		// A string rather than the enum: Pending | Completed must not fail a
		// status read that ImageKit can extend.
		status: z.string(),
	})
	.loose();

// ── registry ──────────────────────────────────────────────────────────────

export type ImageKitEndpointInputs = {
	filesUpload: FilesUploadInput;
	filesList: FilesListInput;
	filesGetDetails: FilesGetDetailsInput;
	filesUpdateDetails: FilesUpdateDetailsInput;
	filesDelete: FilesDeleteInput;
	filesBulkDelete: FilesBulkDeleteInput;
	filesCopy: FilesCopyInput;
	filesMove: FilesMoveInput;
	filesRename: FilesRenameInput;
	filesAddTags: FilesAddTagsInput;
	filesRemoveTags: FilesRemoveTagsInput;
	filesRemoveAITags: FilesRemoveAITagsInput;
	fileVersionsList: FileVersionsListInput;
	fileVersionsGetDetails: FileVersionsGetDetailsInput;
	fileVersionsDelete: FileVersionsDeleteInput;
	fileVersionsRestore: FileVersionsRestoreInput;
	metadataGetByFileId: MetadataGetByFileIdInput;
	metadataGetByUrl: MetadataGetByUrlInput;
	foldersCreate: FoldersCreateInput;
	foldersDelete: FoldersDeleteInput;
	foldersCopy: FoldersCopyInput;
	foldersMove: FoldersMoveInput;
	foldersRename: FoldersRenameInput;
	foldersGetJobStatus: FoldersGetJobStatusInput;
	cachePurge: CachePurgeInput;
	cacheGetPurgeStatus: CacheGetPurgeStatusInput;
};

export type ImageKitEndpointOutputs = {
	filesUpload: z.infer<typeof FilesUploadResponseSchema>;
	filesList: z.infer<typeof FilesListResponseSchema>;
	filesGetDetails: z.infer<typeof FilesGetDetailsResponseSchema>;
	filesUpdateDetails: z.infer<typeof FilesUpdateDetailsResponseSchema>;
	filesDelete: z.infer<typeof FilesDeleteResponseSchema>;
	filesBulkDelete: z.infer<typeof FilesBulkDeleteResponseSchema>;
	filesCopy: z.infer<typeof EmptyObjectSchema>;
	filesMove: z.infer<typeof EmptyObjectSchema>;
	filesRename: z.infer<typeof FilesRenameResponseSchema>;
	filesAddTags: z.infer<typeof ImageKitBulkUpdateSchema>;
	filesRemoveTags: z.infer<typeof ImageKitBulkUpdateSchema>;
	filesRemoveAITags: z.infer<typeof ImageKitBulkUpdateSchema>;
	fileVersionsList: z.infer<typeof FileVersionsListResponseSchema>;
	fileVersionsGetDetails: z.infer<typeof FileVersionsGetDetailsResponseSchema>;
	fileVersionsDelete: z.infer<typeof FileVersionsDeleteResponseSchema>;
	fileVersionsRestore: z.infer<typeof FileVersionsRestoreResponseSchema>;
	metadataGetByFileId: z.infer<typeof MetadataResponseSchema>;
	metadataGetByUrl: z.infer<typeof MetadataResponseSchema>;
	foldersCreate: z.infer<typeof FoldersCreateResponseSchema>;
	foldersDelete: z.infer<typeof FoldersDeleteResponseSchema>;
	foldersCopy: z.infer<typeof ImageKitBulkJobResponseSchema>;
	foldersMove: z.infer<typeof ImageKitBulkJobResponseSchema>;
	foldersRename: z.infer<typeof ImageKitBulkJobResponseSchema>;
	foldersGetJobStatus: z.infer<typeof FoldersGetJobStatusResponseSchema>;
	cachePurge: z.infer<typeof ImageKitPurgeResponseSchema>;
	cacheGetPurgeStatus: z.infer<typeof CacheGetPurgeStatusResponseSchema>;
};

export const ImageKitEndpointInputSchemas = {
	filesUpload: FilesUploadInputSchema,
	filesList: FilesListInputSchema,
	filesGetDetails: FilesGetDetailsInputSchema,
	filesUpdateDetails: FilesUpdateDetailsInputSchema,
	filesDelete: FilesDeleteInputSchema,
	filesBulkDelete: FilesBulkDeleteInputSchema,
	filesCopy: FilesCopyInputSchema,
	filesMove: FilesMoveInputSchema,
	filesRename: FilesRenameInputSchema,
	filesAddTags: FilesAddTagsInputSchema,
	filesRemoveTags: FilesRemoveTagsInputSchema,
	filesRemoveAITags: FilesRemoveAITagsInputSchema,
	fileVersionsList: FileVersionsListInputSchema,
	fileVersionsGetDetails: FileVersionsGetDetailsInputSchema,
	fileVersionsDelete: FileVersionsDeleteInputSchema,
	fileVersionsRestore: FileVersionsRestoreInputSchema,
	metadataGetByFileId: MetadataGetByFileIdInputSchema,
	metadataGetByUrl: MetadataGetByUrlInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	foldersCopy: FoldersCopyInputSchema,
	foldersMove: FoldersMoveInputSchema,
	foldersRename: FoldersRenameInputSchema,
	foldersGetJobStatus: FoldersGetJobStatusInputSchema,
	cachePurge: CachePurgeInputSchema,
	cacheGetPurgeStatus: CacheGetPurgeStatusInputSchema,
};

export const ImageKitEndpointOutputSchemas = {
	filesUpload: FilesUploadResponseSchema,
	filesList: FilesListResponseSchema,
	filesGetDetails: FilesGetDetailsResponseSchema,
	filesUpdateDetails: FilesUpdateDetailsResponseSchema,
	filesDelete: FilesDeleteResponseSchema,
	filesBulkDelete: FilesBulkDeleteResponseSchema,
	filesCopy: EmptyObjectSchema,
	filesMove: EmptyObjectSchema,
	filesRename: FilesRenameResponseSchema,
	filesAddTags: ImageKitBulkUpdateSchema,
	filesRemoveTags: ImageKitBulkUpdateSchema,
	filesRemoveAITags: ImageKitBulkUpdateSchema,
	fileVersionsList: FileVersionsListResponseSchema,
	fileVersionsGetDetails: FileVersionsGetDetailsResponseSchema,
	fileVersionsDelete: FileVersionsDeleteResponseSchema,
	fileVersionsRestore: FileVersionsRestoreResponseSchema,
	metadataGetByFileId: MetadataResponseSchema,
	metadataGetByUrl: MetadataResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
	foldersDelete: FoldersDeleteResponseSchema,
	foldersCopy: ImageKitBulkJobResponseSchema,
	foldersMove: ImageKitBulkJobResponseSchema,
	foldersRename: ImageKitBulkJobResponseSchema,
	foldersGetJobStatus: FoldersGetJobStatusResponseSchema,
	cachePurge: ImageKitPurgeResponseSchema,
	cacheGetPurgeStatus: CacheGetPurgeStatusResponseSchema,
};
