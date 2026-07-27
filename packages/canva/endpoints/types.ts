import { z } from 'zod';

// ============================================================================
// Shared Schemas
// ============================================================================

export const ThumbnailSchema = z.object({
	width: z.number(),
	height: z.number(),
	url: z.string(),
});

export type Thumbnail = z.infer<typeof ThumbnailSchema>;

export const OwnerSchema = z.object({
	user_id: z.string(),
	team_id: z.string(),
});

export type Owner = z.infer<typeof OwnerSchema>;

export const DesignLinksSchema = z.object({
	edit_url: z.string(),
	view_url: z.string(),
});

export const DesignSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	owner: OwnerSchema,
	thumbnail: ThumbnailSchema.optional(),
	urls: DesignLinksSchema,
	created_at: z.number(),
	updated_at: z.number(),
	page_count: z.number().optional(),
	design_types: z.array(z.string()).optional(),
});

export type Design = z.infer<typeof DesignSchema>;

export const AssetSchema = z.object({
	type: z.enum(['image', 'video']),
	id: z.string(),
	name: z.string(),
	tags: z.array(z.string()),
	created_at: z.number(),
	updated_at: z.number(),
	owner: OwnerSchema.optional(),
	thumbnail: ThumbnailSchema.optional(),
});

export type Asset = z.infer<typeof AssetSchema>;

export const FolderSchema = z.object({
	id: z.string(),
	name: z.string(),
	created_at: z.number(),
	updated_at: z.number(),
	thumbnail: ThumbnailSchema.optional(),
});

export type Folder = z.infer<typeof FolderSchema>;

export const BrandTemplateSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	view_url: z.string().optional(),
	create_url: z.string().optional(),
	thumbnail: ThumbnailSchema.optional(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
});

export type BrandTemplate = z.infer<typeof BrandTemplateSchema>;

const DesignPageSchema = z.object({
	index: z.number(),
	dimensions: z
		.object({
			width: z.number(),
			height: z.number(),
		})
		.optional(),
	thumbnail: ThumbnailSchema.optional(),
});

export const PresetDesignTypeSchema = z.object({
	type: z.literal('preset'),
	name: z.enum(['doc', 'email', 'presentation', 'whiteboard']),
});

export const CustomDesignTypeSchema = z.object({
	type: z.literal('custom'),
	width: z.number(),
	height: z.number(),
});

export const DesignTypeInputSchema = z.discriminatedUnion('type', [
	PresetDesignTypeSchema,
	CustomDesignTypeSchema,
]);

const ExportFormatSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('pdf'),
		size: z.enum(['a4', 'a3', 'letter', 'legal']).optional(),
		pages: z.array(z.number()).optional(),
		export_quality: z.enum(['regular', 'pro']).optional(),
	}),
	z.object({
		type: z.literal('jpg'),
		width: z.number().optional(),
		height: z.number().optional(),
		export_quality: z.enum(['regular', 'pro']).optional(),
	}),
	z.object({
		type: z.literal('png'),
		width: z.number().optional(),
		height: z.number().optional(),
		export_quality: z.enum(['regular', 'pro']).optional(),
	}),
	z.object({
		type: z.literal('gif'),
		width: z.number().optional(),
		height: z.number().optional(),
		export_quality: z.enum(['regular', 'pro']).optional(),
	}),
	z.object({
		type: z.literal('pptx'),
		pages: z.array(z.number()).optional(),
	}),
	z.object({
		type: z.literal('mp4'),
		quality: z
			.enum([
				'horizontal_480p',
				'horizontal_720p',
				'horizontal_1080p',
				'horizontal_4k',
				'vertical_480p',
				'vertical_720p',
				'vertical_1080p',
				'vertical_4k',
			])
			.optional(),
	}),
	z.object({
		type: z.literal('html_bundle'),
		pages: z.array(z.number()).optional(),
	}),
	z.object({
		type: z.literal('html_standalone'),
		pages: z.array(z.number()).optional(),
	}),
	z.object({
		type: z.literal('csv'),
		pages: z.array(z.number()).optional(),
	}),
]);

const ExportJobSchema = z.object({
	id: z.string(),
	status: z.enum(['failed', 'in_progress', 'success']),
	urls: z.array(z.string()).optional(),
	error: z
		.object({
			code: z.string(),
			message: z.string(),
		})
		.optional(),
});

const SuccessResponseSchema = z.object({
	success: z.boolean(),
});

const FolderItemSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('folder'),
		folder: FolderSchema,
	}),
	z.object({
		type: z.literal('design'),
		design: DesignSchema.omit({ owner: true }).extend({
			owner: OwnerSchema.optional(),
			url: z.string().optional(),
		}),
	}),
	z.object({
		type: z.literal('image'),
		image: AssetSchema,
	}),
	z.object({
		type: z.literal('brand_template'),
		brand_template: BrandTemplateSchema,
	}),
]);

// Shared job primitives — Canva async jobs all follow this `in_progress` ->
// `success` | `failed` lifecycle (asset uploads, imports, resizes, autofills).
export const JobStatusSchema = z.enum(['in_progress', 'success', 'failed']);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const JobErrorSchema = z.object({
	code: z.string(),
	message: z.string(),
});
export type JobError = z.infer<typeof JobErrorSchema>;

// ============================================================================
// Users
// ============================================================================

const UsersGetMeInputSchema = z.object({});

const UsersGetMeResponseSchema = z.object({
	team_user: OwnerSchema,
});

const UsersGetProfileInputSchema = z.object({});

const UsersGetProfileResponseSchema = z.object({
	profile: z
		.object({
			display_name: z.string().optional(),
		})
		.passthrough(),
});

const UsersGetCapabilitiesInputSchema = z.object({});

const UsersGetCapabilitiesResponseSchema = z.object({
	capabilities: z.array(z.string()),
});

// ============================================================================
// Designs
// ============================================================================

const DesignsListInputSchema = z.object({
	query: z.string().optional(),
	continuation: z.string().optional(),
	ownership: z.enum(['any', 'owned', 'shared']).optional(),
	sort_by: z
		.enum([
			'relevance',
			'modified_descending',
			'modified_ascending',
			'title_descending',
			'title_ascending',
		])
		.optional(),
	limit: z.number().optional(),
});

const DesignsListResponseSchema = z.object({
	items: z.array(DesignSchema),
	continuation: z.string().optional(),
});

const DesignsGetInputSchema = z.object({
	designId: z.string(),
});

const DesignsGetResponseSchema = z.object({
	design: DesignSchema,
});

const DesignsCreateInputSchema = z.object({
	type: z.literal('type_and_asset').optional(),
	design_type: DesignTypeInputSchema.optional(),
	asset_id: z.string().optional(),
	title: z.string().optional(),
});

const DesignsCreateResponseSchema = z.object({
	design: DesignSchema,
});

const DesignsGetPagesInputSchema = z.object({
	designId: z.string(),
	offset: z.number().optional(),
	limit: z.number().optional(),
});

const DesignsGetPagesResponseSchema = z.object({
	items: z.array(DesignPageSchema),
});

const DesignsGetExportFormatsInputSchema = z.object({
	designId: z.string(),
});

const DesignsGetExportFormatsResponseSchema = z.object({
	export_formats: z.record(
		z.string(),
		z.object({ supports_pages: z.boolean().optional() }).passthrough(),
	),
});

// ============================================================================
// Assets
// ============================================================================

const AssetsGetInputSchema = z.object({
	assetId: z.string(),
});

const AssetsGetResponseSchema = z.object({
	asset: AssetSchema,
});

const AssetsUpdateInputSchema = z.object({
	assetId: z.string(),
	name: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

const AssetsUpdateResponseSchema = z.object({
	asset: AssetSchema,
});

const AssetsDeleteInputSchema = z.object({
	assetId: z.string(),
});

const AssetsDeleteResponseSchema = SuccessResponseSchema;

// ============================================================================
// Folders
// ============================================================================

const FoldersCreateInputSchema = z.object({
	name: z.string(),
	parent_folder_id: z.string(),
});

const FoldersCreateResponseSchema = z.object({
	folder: FolderSchema,
});

const FoldersGetInputSchema = z.object({
	folderId: z.string(),
});

const FoldersGetResponseSchema = z.object({
	folder: FolderSchema,
});

const FoldersUpdateInputSchema = z.object({
	folderId: z.string(),
	name: z.string(),
});

const FoldersUpdateResponseSchema = z.object({
	folder: FolderSchema,
});

const FoldersDeleteInputSchema = z.object({
	folderId: z.string(),
});

const FoldersDeleteResponseSchema = SuccessResponseSchema;

const FoldersListItemsInputSchema = z.object({
	folderId: z.string(),
	continuation: z.string().optional(),
	limit: z.number().optional(),
	item_types: z
		.array(z.enum(['design', 'folder', 'image', 'brand_template']))
		.optional(),
	sort_by: z
		.enum([
			'created_ascending',
			'created_descending',
			'modified_ascending',
			'modified_descending',
			'title_ascending',
			'title_descending',
		])
		.optional(),
	pin_status: z.enum(['any', 'pinned']).optional(),
});

const FoldersListItemsResponseSchema = z.object({
	items: z.array(FolderItemSchema),
	continuation: z.string().optional(),
});

const FoldersMoveItemInputSchema = z.object({
	to_folder_id: z.string(),
	item_id: z.string(),
});

const FoldersMoveItemResponseSchema = SuccessResponseSchema;

// ============================================================================
// Exports
// ============================================================================

const ExportsCreateInputSchema = z.object({
	design_id: z.string(),
	format: ExportFormatSchema,
});

const ExportsCreateResponseSchema = z.object({
	job: ExportJobSchema,
});

const ExportsGetInputSchema = z.object({
	exportId: z.string(),
});

const ExportsGetResponseSchema = z.object({
	job: ExportJobSchema,
});

// ============================================================================
// Brand Templates
// ============================================================================

export const BrandTemplateDatasetFieldSchema = z
	.object({
		type: z.enum(['text', 'image', 'chart']),
	})
	.passthrough();

export const BrandTemplateDatasetSchema = z.record(
	z.string(),
	BrandTemplateDatasetFieldSchema,
);

export type BrandTemplateDataset = z.infer<typeof BrandTemplateDatasetSchema>;

const BrandTemplatesListInputSchema = z.object({
	query: z.string().optional(),
	continuation: z.string().optional(),
	limit: z.number().optional(),
	ownership: z.enum(['any', 'owned', 'shared']).optional(),
	sort_by: z
		.enum([
			'relevance',
			'modified_descending',
			'modified_ascending',
			'title_descending',
			'title_ascending',
		])
		.optional(),
	dataset: z.enum(['any', 'non_empty']).optional(),
});

const BrandTemplatesListResponseSchema = z.object({
	items: z.array(BrandTemplateSchema),
	continuation: z.string().optional(),
});

const BrandTemplatesGetInputSchema = z.object({
	brandTemplateId: z.string(),
});

const BrandTemplatesGetResponseSchema = z.object({
	brand_template: BrandTemplateSchema,
});

const BrandTemplatesGetDatasetInputSchema = z.object({
	brandTemplateId: z.string(),
});

const BrandTemplatesGetDatasetResponseSchema = z.object({
	dataset: BrandTemplateDatasetSchema,
});

// ============================================================================
// Asset Uploads
// ============================================================================

export const AssetUploadJobSchema = z.object({
	id: z.string(),
	status: JobStatusSchema,
	asset: AssetSchema.optional(),
	error: JobErrorSchema.optional(),
});

export type AssetUploadJob = z.infer<typeof AssetUploadJobSchema>;

const AssetUploadsCreateInputSchema = z.object({
	name: z.string(),
	contentBase64: z.string(),
});

const AssetUploadsCreateResponseSchema = z.object({
	job: AssetUploadJobSchema,
});

const AssetUploadsGetInputSchema = z.object({
	jobId: z.string(),
});

const AssetUploadsGetResponseSchema = z.object({
	job: AssetUploadJobSchema,
});

const AssetUploadsCreateFromUrlInputSchema = z.object({
	name: z.string(),
	url: z.string(),
});

const AssetUploadsCreateFromUrlResponseSchema = z.object({
	job: AssetUploadJobSchema,
});

const AssetUploadsGetFromUrlInputSchema = z.object({
	jobId: z.string(),
});

const AssetUploadsGetFromUrlResponseSchema = z.object({
	job: AssetUploadJobSchema,
});

// ============================================================================
// Imports
// ============================================================================

const ImportDesignSummarySchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	url: z.string().optional(),
	thumbnail: ThumbnailSchema.optional(),
});

export type ImportDesignSummary = z.infer<typeof ImportDesignSummarySchema>;

export const ImportJobSchema = z.object({
	id: z.string(),
	status: JobStatusSchema,
	result: z
		.object({
			designs: z.array(ImportDesignSummarySchema),
		})
		.optional(),
	error: JobErrorSchema.optional(),
});

export type ImportJob = z.infer<typeof ImportJobSchema>;

const ImportsCreateInputSchema = z.object({
	title: z.string(),
	contentBase64: z.string(),
	mime_type: z.string().optional(),
});

const ImportsCreateResponseSchema = z.object({
	job: ImportJobSchema,
});

const ImportsGetInputSchema = z.object({
	jobId: z.string(),
});

const ImportsGetResponseSchema = z.object({
	job: ImportJobSchema,
});

const ImportsCreateFromUrlInputSchema = z.object({
	title: z.string(),
	url: z.string(),
});

const ImportsCreateFromUrlResponseSchema = z.object({
	job: ImportJobSchema,
});

const ImportsGetFromUrlInputSchema = z.object({
	jobId: z.string(),
});

const ImportsGetFromUrlResponseSchema = z.object({
	job: ImportJobSchema,
});

// ============================================================================
// Resizes
// ============================================================================

export const ResizeJobSchema = z.object({
	id: z.string(),
	status: JobStatusSchema,
	result: z
		.object({
			design: DesignSchema,
		})
		.optional(),
	error: JobErrorSchema.optional(),
});

export type ResizeJob = z.infer<typeof ResizeJobSchema>;

const ResizesCreateInputSchema = z.object({
	design_id: z.string(),
	design_type: DesignTypeInputSchema,
});

const ResizesCreateResponseSchema = z.object({
	job: ResizeJobSchema,
});

const ResizesGetInputSchema = z.object({
	jobId: z.string(),
});

const ResizesGetResponseSchema = z.object({
	job: ResizeJobSchema,
});

// ============================================================================
// Autofills
// ============================================================================

export const AutofillDataFieldSchema = z.union([
	z.object({ type: z.literal('text'), text: z.string() }),
	z.object({ type: z.literal('image'), asset_id: z.string() }),
	z
		.object({
			type: z.literal('chart'),
			chart_data: z.record(z.string(), z.unknown()),
		})
		.passthrough(),
]);

export type AutofillDataField = z.infer<typeof AutofillDataFieldSchema>;

export const AutofillDataSchema = z.record(z.string(), AutofillDataFieldSchema);
export type AutofillData = z.infer<typeof AutofillDataSchema>;

const AutofillResultDesignSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	url: z.string().optional(),
	thumbnail: ThumbnailSchema.optional(),
	current_page_index: z.number().optional(),
});

export const AutofillJobSchema = z.object({
	id: z.string(),
	status: JobStatusSchema,
	result: z
		.object({
			type: z.string().optional(),
			design: AutofillResultDesignSchema.optional(),
		})
		.optional(),
	error: JobErrorSchema.optional(),
});

export type AutofillJob = z.infer<typeof AutofillJobSchema>;

const AutofillsCreateInputSchema = z.object({
	brand_template_id: z.string(),
	data: AutofillDataSchema,
	title: z.string().optional(),
});

const AutofillsCreateResponseSchema = z.object({
	job: AutofillJobSchema,
});

const AutofillsGetInputSchema = z.object({
	jobId: z.string(),
});

const AutofillsGetResponseSchema = z.object({
	job: AutofillJobSchema,
});

// ============================================================================
// Comments
// ============================================================================

const CommentUserSchema = z
	.object({
		id: z.string(),
		display_name: z.string().optional(),
	})
	.passthrough();

const CommentContentSchema = z.object({
	plaintext: z.string().optional(),
	markdown: z.string().optional(),
});

export const CommentThreadSchema = z
	.object({
		id: z.string(),
		design_id: z.string().optional(),
		thread_type: z
			.object({
				type: z.string().optional(),
				content: CommentContentSchema.optional(),
			})
			.passthrough()
			.optional(),
		author: CommentUserSchema.optional(),
		assignee: CommentUserSchema.optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
	})
	.passthrough();

export type CommentThread = z.infer<typeof CommentThreadSchema>;

export const CommentReplySchema = z
	.object({
		id: z.string(),
		design_id: z.string().optional(),
		thread_id: z.string().optional(),
		author: CommentUserSchema.optional(),
		content: CommentContentSchema.optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
	})
	.passthrough();

export type CommentReply = z.infer<typeof CommentReplySchema>;

const CommentsCreateThreadInputSchema = z.object({
	designId: z.string(),
	message_plaintext: z.string(),
	assignee_id: z.string().optional(),
});

const CommentsCreateThreadResponseSchema = z.object({
	thread: CommentThreadSchema,
});

const CommentsGetThreadInputSchema = z.object({
	designId: z.string(),
	threadId: z.string(),
});

const CommentsGetThreadResponseSchema = z.object({
	thread: CommentThreadSchema,
});

const CommentsCreateReplyInputSchema = z.object({
	designId: z.string(),
	threadId: z.string(),
	message_plaintext: z.string(),
});

const CommentsCreateReplyResponseSchema = z.object({
	reply: CommentReplySchema,
});

const CommentsListRepliesInputSchema = z.object({
	designId: z.string(),
	threadId: z.string(),
	continuation: z.string().optional(),
	limit: z.number().optional(),
});

const CommentsListRepliesResponseSchema = z.object({
	items: z.array(CommentReplySchema),
	continuation: z.string().optional(),
});

const CommentsGetReplyInputSchema = z.object({
	designId: z.string(),
	threadId: z.string(),
	replyId: z.string(),
});

const CommentsGetReplyResponseSchema = z.object({
	reply: CommentReplySchema,
});

// ============================================================================
// Type Exports
// ============================================================================

export type UsersGetMeInput = z.infer<typeof UsersGetMeInputSchema>;
export type UsersGetMeResponse = z.infer<typeof UsersGetMeResponseSchema>;
export type UsersGetProfileInput = z.infer<typeof UsersGetProfileInputSchema>;
export type UsersGetProfileResponse = z.infer<
	typeof UsersGetProfileResponseSchema
>;
export type UsersGetCapabilitiesInput = z.infer<
	typeof UsersGetCapabilitiesInputSchema
>;
export type UsersGetCapabilitiesResponse = z.infer<
	typeof UsersGetCapabilitiesResponseSchema
>;

export type DesignsListInput = z.infer<typeof DesignsListInputSchema>;
export type DesignsListResponse = z.infer<typeof DesignsListResponseSchema>;
export type DesignsGetInput = z.infer<typeof DesignsGetInputSchema>;
export type DesignsGetResponse = z.infer<typeof DesignsGetResponseSchema>;
export type DesignsCreateInput = z.infer<typeof DesignsCreateInputSchema>;
export type DesignsCreateResponse = z.infer<typeof DesignsCreateResponseSchema>;
export type DesignsGetPagesInput = z.infer<typeof DesignsGetPagesInputSchema>;
export type DesignsGetPagesResponse = z.infer<
	typeof DesignsGetPagesResponseSchema
>;
export type DesignsGetExportFormatsInput = z.infer<
	typeof DesignsGetExportFormatsInputSchema
>;
export type DesignsGetExportFormatsResponse = z.infer<
	typeof DesignsGetExportFormatsResponseSchema
>;

export type AssetsGetInput = z.infer<typeof AssetsGetInputSchema>;
export type AssetsGetResponse = z.infer<typeof AssetsGetResponseSchema>;
export type AssetsUpdateInput = z.infer<typeof AssetsUpdateInputSchema>;
export type AssetsUpdateResponse = z.infer<typeof AssetsUpdateResponseSchema>;
export type AssetsDeleteInput = z.infer<typeof AssetsDeleteInputSchema>;
export type AssetsDeleteResponse = z.infer<typeof AssetsDeleteResponseSchema>;

export type FoldersCreateInput = z.infer<typeof FoldersCreateInputSchema>;
export type FoldersCreateResponse = z.infer<typeof FoldersCreateResponseSchema>;
export type FoldersGetInput = z.infer<typeof FoldersGetInputSchema>;
export type FoldersGetResponse = z.infer<typeof FoldersGetResponseSchema>;
export type FoldersUpdateInput = z.infer<typeof FoldersUpdateInputSchema>;
export type FoldersUpdateResponse = z.infer<typeof FoldersUpdateResponseSchema>;
export type FoldersDeleteInput = z.infer<typeof FoldersDeleteInputSchema>;
export type FoldersDeleteResponse = z.infer<typeof FoldersDeleteResponseSchema>;
export type FoldersListItemsInput = z.infer<typeof FoldersListItemsInputSchema>;
export type FoldersListItemsResponse = z.infer<
	typeof FoldersListItemsResponseSchema
>;
export type FoldersMoveItemInput = z.infer<typeof FoldersMoveItemInputSchema>;
export type FoldersMoveItemResponse = z.infer<
	typeof FoldersMoveItemResponseSchema
>;

export type ExportsCreateInput = z.infer<typeof ExportsCreateInputSchema>;
export type ExportsCreateResponse = z.infer<typeof ExportsCreateResponseSchema>;
export type ExportsGetInput = z.infer<typeof ExportsGetInputSchema>;
export type ExportsGetResponse = z.infer<typeof ExportsGetResponseSchema>;

export type BrandTemplatesListInput = z.infer<
	typeof BrandTemplatesListInputSchema
>;
export type BrandTemplatesListResponse = z.infer<
	typeof BrandTemplatesListResponseSchema
>;
export type BrandTemplatesGetInput = z.infer<
	typeof BrandTemplatesGetInputSchema
>;
export type BrandTemplatesGetResponse = z.infer<
	typeof BrandTemplatesGetResponseSchema
>;
export type BrandTemplatesGetDatasetInput = z.infer<
	typeof BrandTemplatesGetDatasetInputSchema
>;
export type BrandTemplatesGetDatasetResponse = z.infer<
	typeof BrandTemplatesGetDatasetResponseSchema
>;

export type AssetUploadsCreateInput = z.infer<
	typeof AssetUploadsCreateInputSchema
>;
export type AssetUploadsCreateResponse = z.infer<
	typeof AssetUploadsCreateResponseSchema
>;
export type AssetUploadsGetInput = z.infer<typeof AssetUploadsGetInputSchema>;
export type AssetUploadsGetResponse = z.infer<
	typeof AssetUploadsGetResponseSchema
>;
export type AssetUploadsCreateFromUrlInput = z.infer<
	typeof AssetUploadsCreateFromUrlInputSchema
>;
export type AssetUploadsCreateFromUrlResponse = z.infer<
	typeof AssetUploadsCreateFromUrlResponseSchema
>;
export type AssetUploadsGetFromUrlInput = z.infer<
	typeof AssetUploadsGetFromUrlInputSchema
>;
export type AssetUploadsGetFromUrlResponse = z.infer<
	typeof AssetUploadsGetFromUrlResponseSchema
>;

export type ImportsCreateInput = z.infer<typeof ImportsCreateInputSchema>;
export type ImportsCreateResponse = z.infer<typeof ImportsCreateResponseSchema>;
export type ImportsGetInput = z.infer<typeof ImportsGetInputSchema>;
export type ImportsGetResponse = z.infer<typeof ImportsGetResponseSchema>;
export type ImportsCreateFromUrlInput = z.infer<
	typeof ImportsCreateFromUrlInputSchema
>;
export type ImportsCreateFromUrlResponse = z.infer<
	typeof ImportsCreateFromUrlResponseSchema
>;
export type ImportsGetFromUrlInput = z.infer<
	typeof ImportsGetFromUrlInputSchema
>;
export type ImportsGetFromUrlResponse = z.infer<
	typeof ImportsGetFromUrlResponseSchema
>;

export type ResizesCreateInput = z.infer<typeof ResizesCreateInputSchema>;
export type ResizesCreateResponse = z.infer<typeof ResizesCreateResponseSchema>;
export type ResizesGetInput = z.infer<typeof ResizesGetInputSchema>;
export type ResizesGetResponse = z.infer<typeof ResizesGetResponseSchema>;

export type AutofillsCreateInput = z.infer<typeof AutofillsCreateInputSchema>;
export type AutofillsCreateResponse = z.infer<
	typeof AutofillsCreateResponseSchema
>;
export type AutofillsGetInput = z.infer<typeof AutofillsGetInputSchema>;
export type AutofillsGetResponse = z.infer<typeof AutofillsGetResponseSchema>;

export type CommentsCreateThreadInput = z.infer<
	typeof CommentsCreateThreadInputSchema
>;
export type CommentsCreateThreadResponse = z.infer<
	typeof CommentsCreateThreadResponseSchema
>;
export type CommentsGetThreadInput = z.infer<
	typeof CommentsGetThreadInputSchema
>;
export type CommentsGetThreadResponse = z.infer<
	typeof CommentsGetThreadResponseSchema
>;
export type CommentsCreateReplyInput = z.infer<
	typeof CommentsCreateReplyInputSchema
>;
export type CommentsCreateReplyResponse = z.infer<
	typeof CommentsCreateReplyResponseSchema
>;
export type CommentsListRepliesInput = z.infer<
	typeof CommentsListRepliesInputSchema
>;
export type CommentsListRepliesResponse = z.infer<
	typeof CommentsListRepliesResponseSchema
>;
export type CommentsGetReplyInput = z.infer<typeof CommentsGetReplyInputSchema>;
export type CommentsGetReplyResponse = z.infer<
	typeof CommentsGetReplyResponseSchema
>;

export type CanvaEndpointInputs = {
	usersGetMe: UsersGetMeInput;
	usersGetProfile: UsersGetProfileInput;
	usersGetCapabilities: UsersGetCapabilitiesInput;
	designsList: DesignsListInput;
	designsGet: DesignsGetInput;
	designsCreate: DesignsCreateInput;
	designsGetPages: DesignsGetPagesInput;
	designsGetExportFormats: DesignsGetExportFormatsInput;
	assetsGet: AssetsGetInput;
	assetsUpdate: AssetsUpdateInput;
	assetsDelete: AssetsDeleteInput;
	foldersCreate: FoldersCreateInput;
	foldersGet: FoldersGetInput;
	foldersUpdate: FoldersUpdateInput;
	foldersDelete: FoldersDeleteInput;
	foldersListItems: FoldersListItemsInput;
	foldersMoveItem: FoldersMoveItemInput;
	exportsCreate: ExportsCreateInput;
	exportsGet: ExportsGetInput;
	brandTemplatesList: BrandTemplatesListInput;
	brandTemplatesGet: BrandTemplatesGetInput;
	brandTemplatesGetDataset: BrandTemplatesGetDatasetInput;
	assetUploadsCreate: AssetUploadsCreateInput;
	assetUploadsGet: AssetUploadsGetInput;
	assetUploadsCreateFromUrl: AssetUploadsCreateFromUrlInput;
	assetUploadsGetFromUrl: AssetUploadsGetFromUrlInput;
	importsCreate: ImportsCreateInput;
	importsGet: ImportsGetInput;
	importsCreateFromUrl: ImportsCreateFromUrlInput;
	importsGetFromUrl: ImportsGetFromUrlInput;
	resizesCreate: ResizesCreateInput;
	resizesGet: ResizesGetInput;
	autofillsCreate: AutofillsCreateInput;
	autofillsGet: AutofillsGetInput;
	commentsCreateThread: CommentsCreateThreadInput;
	commentsGetThread: CommentsGetThreadInput;
	commentsCreateReply: CommentsCreateReplyInput;
	commentsListReplies: CommentsListRepliesInput;
	commentsGetReply: CommentsGetReplyInput;
};

export type CanvaEndpointOutputs = {
	usersGetMe: UsersGetMeResponse;
	usersGetProfile: UsersGetProfileResponse;
	usersGetCapabilities: UsersGetCapabilitiesResponse;
	designsList: DesignsListResponse;
	designsGet: DesignsGetResponse;
	designsCreate: DesignsCreateResponse;
	designsGetPages: DesignsGetPagesResponse;
	designsGetExportFormats: DesignsGetExportFormatsResponse;
	assetsGet: AssetsGetResponse;
	assetsUpdate: AssetsUpdateResponse;
	assetsDelete: AssetsDeleteResponse;
	foldersCreate: FoldersCreateResponse;
	foldersGet: FoldersGetResponse;
	foldersUpdate: FoldersUpdateResponse;
	foldersDelete: FoldersDeleteResponse;
	foldersListItems: FoldersListItemsResponse;
	foldersMoveItem: FoldersMoveItemResponse;
	exportsCreate: ExportsCreateResponse;
	exportsGet: ExportsGetResponse;
	brandTemplatesList: BrandTemplatesListResponse;
	brandTemplatesGet: BrandTemplatesGetResponse;
	brandTemplatesGetDataset: BrandTemplatesGetDatasetResponse;
	assetUploadsCreate: AssetUploadsCreateResponse;
	assetUploadsGet: AssetUploadsGetResponse;
	assetUploadsCreateFromUrl: AssetUploadsCreateFromUrlResponse;
	assetUploadsGetFromUrl: AssetUploadsGetFromUrlResponse;
	importsCreate: ImportsCreateResponse;
	importsGet: ImportsGetResponse;
	importsCreateFromUrl: ImportsCreateFromUrlResponse;
	importsGetFromUrl: ImportsGetFromUrlResponse;
	resizesCreate: ResizesCreateResponse;
	resizesGet: ResizesGetResponse;
	autofillsCreate: AutofillsCreateResponse;
	autofillsGet: AutofillsGetResponse;
	commentsCreateThread: CommentsCreateThreadResponse;
	commentsGetThread: CommentsGetThreadResponse;
	commentsCreateReply: CommentsCreateReplyResponse;
	commentsListReplies: CommentsListRepliesResponse;
	commentsGetReply: CommentsGetReplyResponse;
};

export const CanvaEndpointInputSchemas = {
	usersGetMe: UsersGetMeInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
	usersGetCapabilities: UsersGetCapabilitiesInputSchema,
	designsList: DesignsListInputSchema,
	designsGet: DesignsGetInputSchema,
	designsCreate: DesignsCreateInputSchema,
	designsGetPages: DesignsGetPagesInputSchema,
	designsGetExportFormats: DesignsGetExportFormatsInputSchema,
	assetsGet: AssetsGetInputSchema,
	assetsUpdate: AssetsUpdateInputSchema,
	assetsDelete: AssetsDeleteInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	foldersListItems: FoldersListItemsInputSchema,
	foldersMoveItem: FoldersMoveItemInputSchema,
	exportsCreate: ExportsCreateInputSchema,
	exportsGet: ExportsGetInputSchema,
	brandTemplatesList: BrandTemplatesListInputSchema,
	brandTemplatesGet: BrandTemplatesGetInputSchema,
	brandTemplatesGetDataset: BrandTemplatesGetDatasetInputSchema,
	assetUploadsCreate: AssetUploadsCreateInputSchema,
	assetUploadsGet: AssetUploadsGetInputSchema,
	assetUploadsCreateFromUrl: AssetUploadsCreateFromUrlInputSchema,
	assetUploadsGetFromUrl: AssetUploadsGetFromUrlInputSchema,
	importsCreate: ImportsCreateInputSchema,
	importsGet: ImportsGetInputSchema,
	importsCreateFromUrl: ImportsCreateFromUrlInputSchema,
	importsGetFromUrl: ImportsGetFromUrlInputSchema,
	resizesCreate: ResizesCreateInputSchema,
	resizesGet: ResizesGetInputSchema,
	autofillsCreate: AutofillsCreateInputSchema,
	autofillsGet: AutofillsGetInputSchema,
	commentsCreateThread: CommentsCreateThreadInputSchema,
	commentsGetThread: CommentsGetThreadInputSchema,
	commentsCreateReply: CommentsCreateReplyInputSchema,
	commentsListReplies: CommentsListRepliesInputSchema,
	commentsGetReply: CommentsGetReplyInputSchema,
} as const;

export const CanvaEndpointOutputSchemas = {
	usersGetMe: UsersGetMeResponseSchema,
	usersGetProfile: UsersGetProfileResponseSchema,
	usersGetCapabilities: UsersGetCapabilitiesResponseSchema,
	designsList: DesignsListResponseSchema,
	designsGet: DesignsGetResponseSchema,
	designsCreate: DesignsCreateResponseSchema,
	designsGetPages: DesignsGetPagesResponseSchema,
	designsGetExportFormats: DesignsGetExportFormatsResponseSchema,
	assetsGet: AssetsGetResponseSchema,
	assetsUpdate: AssetsUpdateResponseSchema,
	assetsDelete: AssetsDeleteResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
	foldersGet: FoldersGetResponseSchema,
	foldersUpdate: FoldersUpdateResponseSchema,
	foldersDelete: FoldersDeleteResponseSchema,
	foldersListItems: FoldersListItemsResponseSchema,
	foldersMoveItem: FoldersMoveItemResponseSchema,
	exportsCreate: ExportsCreateResponseSchema,
	exportsGet: ExportsGetResponseSchema,
	brandTemplatesList: BrandTemplatesListResponseSchema,
	brandTemplatesGet: BrandTemplatesGetResponseSchema,
	brandTemplatesGetDataset: BrandTemplatesGetDatasetResponseSchema,
	assetUploadsCreate: AssetUploadsCreateResponseSchema,
	assetUploadsGet: AssetUploadsGetResponseSchema,
	assetUploadsCreateFromUrl: AssetUploadsCreateFromUrlResponseSchema,
	assetUploadsGetFromUrl: AssetUploadsGetFromUrlResponseSchema,
	importsCreate: ImportsCreateResponseSchema,
	importsGet: ImportsGetResponseSchema,
	importsCreateFromUrl: ImportsCreateFromUrlResponseSchema,
	importsGetFromUrl: ImportsGetFromUrlResponseSchema,
	resizesCreate: ResizesCreateResponseSchema,
	resizesGet: ResizesGetResponseSchema,
	autofillsCreate: AutofillsCreateResponseSchema,
	autofillsGet: AutofillsGetResponseSchema,
	commentsCreateThread: CommentsCreateThreadResponseSchema,
	commentsGetThread: CommentsGetThreadResponseSchema,
	commentsCreateReply: CommentsCreateReplyResponseSchema,
	commentsListReplies: CommentsListRepliesResponseSchema,
	commentsGetReply: CommentsGetReplyResponseSchema,
} as const;
