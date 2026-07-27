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

const PresetDesignTypeSchema = z.object({
	type: z.literal('preset'),
	name: z.enum(['doc', 'email', 'presentation', 'whiteboard']),
});

const CustomDesignTypeSchema = z.object({
	type: z.literal('custom'),
	width: z.number(),
	height: z.number(),
});

const DesignTypeInputSchema = z.discriminatedUnion('type', [
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
	}),
	z.object({
		type: z.literal('pptx'),
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
]);

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
	item_types: z.array(z.enum(['design', 'folder', 'image'])).optional(),
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
// Type Exports
// ============================================================================

export type UsersGetMeInput = z.infer<typeof UsersGetMeInputSchema>;
export type UsersGetMeResponse = z.infer<typeof UsersGetMeResponseSchema>;
export type UsersGetProfileInput = z.infer<typeof UsersGetProfileInputSchema>;
export type UsersGetProfileResponse = z.infer<
	typeof UsersGetProfileResponseSchema
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

export type CanvaEndpointInputs = {
	usersGetMe: UsersGetMeInput;
	usersGetProfile: UsersGetProfileInput;
	designsList: DesignsListInput;
	designsGet: DesignsGetInput;
	designsCreate: DesignsCreateInput;
	designsGetPages: DesignsGetPagesInput;
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
};

export type CanvaEndpointOutputs = {
	usersGetMe: UsersGetMeResponse;
	usersGetProfile: UsersGetProfileResponse;
	designsList: DesignsListResponse;
	designsGet: DesignsGetResponse;
	designsCreate: DesignsCreateResponse;
	designsGetPages: DesignsGetPagesResponse;
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
};

export const CanvaEndpointInputSchemas = {
	usersGetMe: UsersGetMeInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
	designsList: DesignsListInputSchema,
	designsGet: DesignsGetInputSchema,
	designsCreate: DesignsCreateInputSchema,
	designsGetPages: DesignsGetPagesInputSchema,
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
} as const;

export const CanvaEndpointOutputSchemas = {
	usersGetMe: UsersGetMeResponseSchema,
	usersGetProfile: UsersGetProfileResponseSchema,
	designsList: DesignsListResponseSchema,
	designsGet: DesignsGetResponseSchema,
	designsCreate: DesignsCreateResponseSchema,
	designsGetPages: DesignsGetPagesResponseSchema,
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
} as const;
