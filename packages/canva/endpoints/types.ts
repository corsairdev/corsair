import { FileInputSchema, FileOutputSchema } from 'corsair/http';
import { z } from 'zod';

// Shapes follow Canva's REST API spec (canva.dev/sources/connect/api/latest/api.yml,
// version 2024-06-18, fetched 2026-11-23). Output objects are loose so a field
// Canva adds later reaches the caller instead of being dropped.

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

const TeamUserSchema = z
	.object({
		user_id: z.string().optional(),
		team_id: z.string().optional(),
		display_name: z.string().optional(),
	})
	.passthrough();

export const DesignLinksSchema = z.object({
	edit_url: z.string(),
	view_url: z.string(),
});

const DesignTypeOutputNameSchema = z
	.string()
	.describe(
		'doc, email, presentation, sheet, whiteboard, custom or unknown (Canva may add more).',
	);

export const DesignSchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		owner: OwnerSchema,
		thumbnail: ThumbnailSchema.optional(),
		urls: DesignLinksSchema,
		created_at: z.number(),
		updated_at: z.number(),
		page_count: z.number().optional(),
		design_types: z.array(DesignTypeOutputNameSchema).optional(),
	})
	.passthrough();

export type Design = z.infer<typeof DesignSchema>;

/** The design a job returns: no owner, and both a `url` and `urls`. */
export const DesignSummarySchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		url: z.string().optional(),
		thumbnail: ThumbnailSchema.optional(),
		urls: DesignLinksSchema.optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
		page_count: z.number().optional(),
	})
	.passthrough();

export type DesignSummary = z.infer<typeof DesignSummarySchema>;

const AssetMetadataSchema = z.discriminatedUnion('type', [
	z
		.object({
			type: z.literal('image'),
			width: z.number().optional(),
			height: z.number().optional(),
			smart_tags: z.array(z.string()).optional(),
		})
		.passthrough(),
	z
		.object({
			type: z.literal('video'),
			width: z.number(),
			height: z.number(),
			duration: z.number().optional(),
		})
		.passthrough(),
]);

export const AssetSchema = z
	.object({
		type: z.enum(['image', 'video']),
		id: z.string(),
		name: z.string(),
		tags: z.array(z.string()),
		created_at: z.number(),
		updated_at: z.number(),
		owner: OwnerSchema.optional(),
		thumbnail: ThumbnailSchema.optional(),
		metadata: AssetMetadataSchema.optional(),
	})
	.passthrough();

export type Asset = z.infer<typeof AssetSchema>;

export const FolderSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		created_at: z.number(),
		updated_at: z.number(),
		thumbnail: ThumbnailSchema.optional(),
	})
	.passthrough();

export type Folder = z.infer<typeof FolderSchema>;

export const BrandTemplateSchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		view_url: z.string().optional(),
		create_url: z.string().optional(),
		// Canva documents null while it is still rendering the thumbnail.
		thumbnail: ThumbnailSchema.nullable().optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
	})
	.passthrough();

export type BrandTemplate = z.infer<typeof BrandTemplateSchema>;

const DesignPageSchema = z
	.object({
		id: z.string().optional(),
		index: z.number().optional().describe('Deprecated: use page_number.'),
		page_number: z.number().optional(),
		design_type: z.string().optional(),
		dimensions: z
			.object({
				width: z.number(),
				height: z.number(),
			})
			.optional(),
		thumbnail: ThumbnailSchema.optional(),
	})
	.passthrough();

export const PresetDesignTypeSchema = z.object({
	type: z.literal('preset'),
	name: z.enum(['doc', 'email', 'presentation', 'whiteboard']),
});

export const CustomDesignTypeSchema = z
	.object({
		type: z.literal('custom'),
		width: z.number().int().min(40).max(8000),
		height: z.number().int().min(40).max(8000),
	})
	.refine((size) => size.width * size.height <= 25_000_000, {
		message: 'Canva allows at most 25,000,000 pixels (e.g. 5000 x 5000)',
	});

export const DesignTypeInputSchema = z.discriminatedUnion('type', [
	PresetDesignTypeSchema,
	CustomDesignTypeSchema,
]);

const PageNumbersSchema = z
	.array(z.number().int().min(1))
	.describe('Page numbers, starting at 1. Leave out for every page.');

const ExportQualitySchema = z
	.enum(['regular', 'pro'])
	.describe(
		'pro uses premium elements and may need a paid Canva plan; regular is the default.',
	);

const ExportSideSchema = z.number().int().min(40).max(25000);

const ExportFormatSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('pdf'),
		export_quality: ExportQualitySchema.optional(),
		size: z
			.enum(['a4', 'a3', 'letter', 'legal'])
			.optional()
			.describe('Paper size; only for Canva docs.'),
		pages: PageNumbersSchema.optional(),
	}),
	z.object({
		type: z.literal('jpg'),
		export_quality: ExportQualitySchema.optional(),
		quality: z.number().int().min(1).max(100),
		width: ExportSideSchema.optional(),
		height: ExportSideSchema.optional(),
		pages: PageNumbersSchema.optional(),
	}),
	z.object({
		type: z.literal('png'),
		export_quality: ExportQualitySchema.optional(),
		width: ExportSideSchema.optional(),
		height: ExportSideSchema.optional(),
		lossless: z.boolean().optional(),
		transparent_background: z.boolean().optional(),
		as_single_image: z
			.boolean()
			.optional()
			.describe(
				'Merge every page into one image. Off by default: each page is its own PNG.',
			),
		pages: PageNumbersSchema.optional(),
	}),
	z.object({
		type: z.literal('gif'),
		export_quality: ExportQualitySchema.optional(),
		width: ExportSideSchema.optional(),
		height: ExportSideSchema.optional(),
		pages: PageNumbersSchema.optional(),
	}),
	z.object({
		type: z.literal('pptx'),
		pages: PageNumbersSchema.optional(),
	}),
	z.object({
		type: z.literal('mp4'),
		export_quality: ExportQualitySchema.optional(),
		quality: z.enum([
			'horizontal_480p',
			'horizontal_720p',
			'horizontal_1080p',
			'horizontal_4k',
			'vertical_480p',
			'vertical_720p',
			'vertical_1080p',
			'vertical_4k',
		]),
		pages: PageNumbersSchema.optional(),
	}),
	z.object({
		type: z.literal('html_bundle'),
		pages: z.array(z.number().int().min(1)).length(1).optional(),
	}),
	z.object({
		type: z.literal('html_standalone'),
		pages: z.array(z.number().int().min(1)).length(1).optional(),
	}),
	z.object({
		type: z.literal('csv'),
		pages: PageNumbersSchema.optional(),
	}),
]);

const ExportFormatOptionSchema = z
	.object({
		page_numbers: z.array(z.number()).optional(),
	})
	.passthrough();

const DesignsGetExportFormatsResponseSchema = z
	.object({
		formats: z.record(z.string(), ExportFormatOptionSchema),
	})
	.passthrough();

export const JobStatusSchema = z.enum(['in_progress', 'success', 'failed']);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const JobErrorSchema = z
	.object({
		code: z.string(),
		message: z.string(),
	})
	.passthrough();
export type JobError = z.infer<typeof JobErrorSchema>;

const TrialInformationSchema = z
	.object({
		uses_remaining: z.number(),
		upgrade_url: z.string(),
	})
	.passthrough();

const ExportJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		urls: z
			.array(z.string())
			.optional()
			.describe(
				'Download URLs, valid for 24 hours. A multi-page PNG, JPG or GIF export has one per page, in page order.',
			),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

const SuccessResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();

const FolderItemSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('folder'),
		folder: FolderSchema,
	}),
	z.object({
		type: z.literal('design'),
		design: DesignSummarySchema.extend({ owner: OwnerSchema.optional() }),
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

const DataFieldSchema = z
	.object({
		type: z.enum(['image', 'text', 'chart', 'sheet']),
	})
	.passthrough();

const DatasetSchema = z
	.record(z.string(), DataFieldSchema)
	.describe(
		'Autofill field names and the kind of data each takes (image, text, chart or sheet). Absent when there are none.',
	);

// ── users ──────────────────────────────────────────────────────────────────

const UsersGetMeInputSchema = z.object({});

const UsersGetMeResponseSchema = z
	.object({
		team_user: OwnerSchema,
	})
	.passthrough();

const UsersGetProfileInputSchema = z.object({});

const UsersGetProfileResponseSchema = z
	.object({
		profile: z
			.object({
				display_name: z.string().optional(),
			})
			.passthrough(),
	})
	.passthrough();

const UsersGetCapabilitiesInputSchema = z.object({});

const UsersGetCapabilitiesResponseSchema = z
	.object({
		capabilities: z
			.array(z.string())
			.optional()
			.describe(
				"What the user's plan allows through the API, e.g. autofill, brand_template, resize, design_generation, image_generation, background_removal, analytics.",
			),
	})
	.passthrough();

// ── designs ────────────────────────────────────────────────────────────────

const DesignsListInputSchema = z.object({
	query: z.string().max(255).optional(),
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
	limit: z.number().int().min(1).max(100).optional(),
});

const DesignsListResponseSchema = z
	.object({
		items: z.array(DesignSchema),
		continuation: z.string().optional(),
	})
	.passthrough();

const DesignsGetInputSchema = z.object({
	designId: z.string(),
});

const DesignsGetResponseSchema = z
	.object({
		design: DesignSchema,
	})
	.passthrough();

const DesignsCreateInputSchema = z
	.object({
		type: z
			.enum(['type_and_asset', 'design', 'brand_template'])
			.optional()
			.describe(
				'type_and_asset (the default): a new design from design_type and/or asset_id. design: a copy of design_id. brand_template: a design from brand_template_id. The last two are Canva preview features.',
			),
		design_type: DesignTypeInputSchema.optional(),
		asset_id: z
			.string()
			.optional()
			.describe('An image asset to put in the new design.'),
		title: z.string().min(1).max(255).optional(),
		design_id: z.string().optional().describe('The design to copy.'),
		brand_template_id: z.string().optional(),
		page_numbers: z
			.array(z.number().int().min(1))
			.min(1)
			.optional()
			.describe('Copy only these pages (type design or brand_template).'),
	})
	.superRefine((value, issue) => {
		const type = value.type ?? 'type_and_asset';
		if (
			type === 'type_and_asset' &&
			value.design_type === undefined &&
			value.asset_id === undefined
		) {
			issue.addIssue({
				code: 'custom',
				message: 'Either design_type or asset_id is required',
			});
		}
		if (type === 'design' && value.design_id === undefined) {
			issue.addIssue({
				code: 'custom',
				message: 'design_id is required when type is design',
			});
		}
		if (type === 'brand_template' && value.brand_template_id === undefined) {
			issue.addIssue({
				code: 'custom',
				message: 'brand_template_id is required when type is brand_template',
			});
		}
	});

const DesignsCreateResponseSchema = z
	.object({
		design: DesignSchema,
	})
	.passthrough();

const DesignsGetPagesInputSchema = z.object({
	designId: z.string(),
	offset: z
		.number()
		.int()
		.min(1)
		.max(500)
		.optional()
		.describe('First page number to return, starting at 1.'),
	limit: z.number().int().min(1).max(200).optional(),
});

const DesignsGetPagesResponseSchema = z
	.object({
		items: z.array(DesignPageSchema),
	})
	.passthrough();

const DesignsGetExportFormatsInputSchema = z.object({
	designId: z.string(),
});

const DesignsGetDatasetInputSchema = z.object({
	designId: z.string(),
});

const DesignsGetDatasetResponseSchema = z
	.object({
		dataset: DatasetSchema.optional(),
	})
	.passthrough();

// ── analytics (preview, Canva Enterprise) ──────────────────────────────────

const AnalyticsGetInputSchema = z.object({
	designId: z.string(),
});

const AnalyticsGetResponseSchema = z
	.object({
		total_view_count: z.number(),
		unique_view_count: z.number(),
		total_view_duration_seconds: z.number().optional(),
		average_view_duration_seconds: z.number().optional(),
	})
	.passthrough();

const PageInputSchema = {
	limit: z.number().int().min(1).max(100).optional(),
	continuation: z.string().optional(),
};

const AnalyticsListViewersInputSchema = z.object({
	designId: z.string(),
	link_id: z
		.string()
		.optional()
		.describe('Only viewers who came through this trackable link.'),
	first_viewed_after: z
		.number()
		.int()
		.optional()
		.describe('Unix seconds; only viewers whose first view is after it.'),
	...PageInputSchema,
});

const AnalyticsViewerSchema = z
	.object({
		viewer_id: z.string(),
		user: TeamUserSchema.optional(),
		last_viewed_at: z.number(),
		viewer_type: z.string().describe('editor, commenter or viewer.'),
		visibility: z
			.string()
			.describe('shown, anonymous, opt_out, another_team or deleted.'),
		total_view_duration_seconds: z.number().optional(),
		first_viewed_at: z.number().optional(),
		pages_viewed: z.number().optional(),
		form_factor: z.string().optional(),
		device_operating_system: z.string().optional(),
		city_country: z.string().optional(),
		total_view_count: z.number().optional(),
	})
	.passthrough();

const AnalyticsListViewersResponseSchema = z
	.object({
		items: z.array(AnalyticsViewerSchema),
		continuation: z.string().optional(),
	})
	.passthrough();

const AnalyticsListViewsOverTimeInputSchema = z.object({
	designId: z.string(),
	start_time: z.number().int().optional().describe('Unix seconds.'),
	end_time: z.number().int().optional().describe('Unix seconds.'),
	timezone: z
		.string()
		.optional()
		.describe('IANA time zone for the buckets, e.g. Australia/Sydney.'),
	...PageInputSchema,
});

const AnalyticsListViewsOverTimeResponseSchema = z
	.object({
		items: z.array(
			z
				.object({
					count: z.number(),
					bucket_start_at: z.number(),
				})
				.passthrough(),
		),
		continuation: z.string().optional(),
	})
	.passthrough();

const PageViewFilterSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('by_viewer'),
		viewer_id: z.string(),
		link_id: z.string().optional(),
	}),
	z.object({ type: z.literal('for_editor') }),
	z.object({ type: z.literal('by_link'), link_id: z.string() }),
]);

const AnalyticsListPageViewsInputSchema = z.object({
	designId: z.string(),
	page_ids: z
		.array(z.string())
		.min(1)
		.max(100)
		.describe('Page ids, from designs.getPages.'),
	filter: PageViewFilterSchema.optional(),
	...PageInputSchema,
});

const AnalyticsListPageViewsResponseSchema = z
	.object({
		items: z.array(
			z
				.object({
					page_id: z.string().optional(),
					total_view_duration_seconds: z.number(),
					average_duration_seconds: z.number().optional(),
					unique_view_count: z.number().optional(),
				})
				.passthrough(),
		),
		continuation: z.string().optional(),
	})
	.passthrough();

const AnalyticsListLinksInputSchema = z.object({
	designId: z.string(),
	...PageInputSchema,
});

const AnalyticsListLinksResponseSchema = z
	.object({
		items: z.array(
			z
				.object({
					link_id: z.string(),
					name: z.string().optional(),
					total_view_count: z.number().optional(),
					unique_view_count: z.number().optional(),
					total_view_duration_seconds: z.number().optional(),
					average_view_duration_seconds: z.number().optional(),
					last_viewed_at: z.number().optional(),
				})
				.passthrough(),
		),
		continuation: z.string().optional(),
	})
	.passthrough();

// ── assets ─────────────────────────────────────────────────────────────────

const AssetsGetInputSchema = z.object({
	assetId: z.string(),
});

const AssetsGetResponseSchema = z
	.object({
		asset: AssetSchema,
	})
	.passthrough();

const AssetsUpdateInputSchema = z.object({
	assetId: z.string(),
	name: z.string().max(50).optional(),
	tags: z
		.array(z.string().max(50))
		.max(50)
		.optional()
		.describe('Replaces every existing tag.'),
});

const AssetsUpdateResponseSchema = z
	.object({
		asset: AssetSchema,
	})
	.passthrough();

const AssetsDeleteInputSchema = z.object({
	assetId: z.string(),
});

const AssetsDeleteResponseSchema = SuccessResponseSchema;

// ── folders ────────────────────────────────────────────────────────────────

const FoldersCreateInputSchema = z.object({
	name: z.string().min(1).max(255),
	parent_folder_id: z
		.string()
		.min(1)
		.max(50)
		.describe(
			'root for the top level of projects, uploads for the Uploads folder, or a folder id.',
		),
});

const FoldersCreateResponseSchema = z
	.object({
		folder: FolderSchema,
	})
	.passthrough();

const FoldersGetInputSchema = z.object({
	folderId: z.string(),
});

const FoldersGetResponseSchema = z
	.object({
		folder: FolderSchema,
	})
	.passthrough();

const FoldersUpdateInputSchema = z.object({
	folderId: z.string(),
	name: z.string().min(1).max(255),
});

const FoldersUpdateResponseSchema = z
	.object({
		folder: FolderSchema,
	})
	.passthrough();

const FoldersDeleteInputSchema = z.object({
	folderId: z.string(),
});

const FoldersDeleteResponseSchema = SuccessResponseSchema;

const FoldersListItemsInputSchema = z.object({
	folderId: z.string(),
	continuation: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
	item_types: z
		.array(z.enum(['design', 'folder', 'image', 'brand_template']))
		.optional()
		.describe('brand_template items are returned only when listed here.'),
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

const FoldersListItemsResponseSchema = z
	.object({
		items: z.array(FolderItemSchema),
		continuation: z.string().optional(),
	})
	.passthrough();

const FoldersMoveItemInputSchema = z.object({
	to_folder_id: z.string().min(1).max(50),
	item_id: z.string().min(1).max(50),
});

const FoldersMoveItemResponseSchema = SuccessResponseSchema;

// ── exports ────────────────────────────────────────────────────────────────

const ExportsCreateInputSchema = z.object({
	design_id: z.string(),
	format: ExportFormatSchema,
});

const ExportsCreateResponseSchema = z
	.object({
		job: ExportJobSchema,
	})
	.passthrough();

const ExportsGetInputSchema = z.object({
	exportId: z.string(),
});

const ExportsGetResponseSchema = z
	.object({
		job: ExportJobSchema,
	})
	.passthrough();

const ExportsDownloadInputSchema = z.object({
	exportId: z.string().describe('The id of a finished export job.'),
	index: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			"Which of the job's download URLs to fetch, from 0 (the default). A multi-page PNG or JPG export has one per page, so index 4 is the fifth exported page.",
		),
});

const ExportsDownloadResponseSchema = FileOutputSchema.extend({
	exportId: z.string(),
	index: z.number(),
	count: z
		.number()
		.describe(
			'How many files the export has; call again with index up to count - 1.',
		),
	url: z
		.string()
		.describe(
			'The download URL (valid for 24 hours after the export finished).',
		),
});

// ── brand templates ────────────────────────────────────────────────────────

const BrandTemplatesListInputSchema = z.object({
	query: z.string().optional(),
	continuation: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
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
	dataset: z
		.enum(['any', 'non_empty'])
		.optional()
		.describe('non_empty lists only templates with autofill fields.'),
});

const BrandTemplatesListResponseSchema = z
	.object({
		items: z.array(BrandTemplateSchema),
		continuation: z.string().optional(),
	})
	.passthrough();

const BrandTemplatesGetInputSchema = z.object({
	brandTemplateId: z.string(),
});

const BrandTemplatesGetResponseSchema = z
	.object({
		brand_template: BrandTemplateSchema,
	})
	.passthrough();

const BrandTemplatesGetDatasetInputSchema = z.object({
	brandTemplateId: z.string(),
});

const BrandTemplatesGetDatasetResponseSchema = z
	.object({
		dataset: DatasetSchema.optional(),
	})
	.passthrough();

const BrandTemplatesPublishInputSchema = z.object({
	design_id: z.string().describe('The design to publish as a brand template.'),
});

const BrandTemplatesPublishResponseSchema = z
	.object({
		brand_template: BrandTemplateSchema,
	})
	.passthrough();

// ── asset uploads ──────────────────────────────────────────────────────────

export const AssetUploadJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		asset: AssetSchema.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

export type AssetUploadJob = z.infer<typeof AssetUploadJobSchema>;

const AssetUploadsCreateInputSchema = z
	.object({
		name: z.string().min(1).max(50).describe('The asset name in Canva.'),
		file: FileInputSchema.optional(),
		contentBase64: z
			.string()
			.optional()
			.describe(
				'The file as base64. Prefer file for anything but a small file.',
			),
	})
	.refine(
		(value) =>
			(value.file === undefined) !== (value.contentBase64 === undefined),
		{ message: 'Pass exactly one of file or contentBase64' },
	);

const AssetUploadsCreateResponseSchema = z
	.object({
		job: AssetUploadJobSchema,
	})
	.passthrough();

const AssetUploadsGetInputSchema = z.object({
	jobId: z.string(),
});

const AssetUploadsGetResponseSchema = z
	.object({
		job: AssetUploadJobSchema,
	})
	.passthrough();

const AssetUploadsCreateFromUrlInputSchema = z.object({
	name: z.string().min(1).max(255),
	url: z
		.string()
		.min(8)
		.max(2048)
		.describe(
			'A public URL Canva fetches. Videos from a URL are capped at 100 MB.',
		),
});

const AssetUploadsCreateFromUrlResponseSchema = z
	.object({
		job: AssetUploadJobSchema,
	})
	.passthrough();

const AssetUploadsGetFromUrlInputSchema = z.object({
	jobId: z.string(),
});

const AssetUploadsGetFromUrlResponseSchema = z
	.object({
		job: AssetUploadJobSchema,
	})
	.passthrough();

// ── design imports ─────────────────────────────────────────────────────────

export const ImportJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		result: z
			.object({
				designs: z.array(DesignSummarySchema),
			})
			.passthrough()
			.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

export type ImportJob = z.infer<typeof ImportJobSchema>;

const ImportsCreateInputSchema = z
	.object({
		title: z.string().min(1).max(255),
		file: FileInputSchema.optional().describe(
			'The file to import: PDF, PowerPoint, Keynote, Word, Excel, Illustrator, Photoshop and more (see Canva design imports).',
		),
		contentBase64: z
			.string()
			.optional()
			.describe(
				'The file as base64. Prefer file for anything but a small file.',
			),
		mime_type: z
			.string()
			.max(100)
			.optional()
			.describe('The file type; Canva detects it when left out.'),
	})
	.refine(
		(value) =>
			(value.file === undefined) !== (value.contentBase64 === undefined),
		{ message: 'Pass exactly one of file or contentBase64' },
	);

const ImportsCreateResponseSchema = z
	.object({
		job: ImportJobSchema,
	})
	.passthrough();

const ImportsGetInputSchema = z.object({
	jobId: z.string(),
});

const ImportsGetResponseSchema = z
	.object({
		job: ImportJobSchema,
	})
	.passthrough();

const ImportsCreateFromUrlInputSchema = z.object({
	title: z.string().min(1).max(255),
	url: z.string().min(1).max(2048).describe('A public URL Canva fetches.'),
	mime_type: z.string().max(100).optional(),
});

const ImportsCreateFromUrlResponseSchema = z
	.object({
		job: ImportJobSchema,
	})
	.passthrough();

const ImportsGetFromUrlInputSchema = z.object({
	jobId: z.string(),
});

const ImportsGetFromUrlResponseSchema = z
	.object({
		job: ImportJobSchema,
	})
	.passthrough();

const ImageToDesignJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		result: z
			.object({
				design: DesignSummarySchema,
			})
			.passthrough()
			.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

const ImportsCreateFromImageInputSchema = z.object({
	asset_id: z
		.string()
		.describe(
			"An image asset in the user's library (upload it with assetUploads first).",
		),
	title: z.string().min(1).max(255).optional(),
});

const ImportsCreateFromImageResponseSchema = z
	.object({
		job: ImageToDesignJobSchema,
	})
	.passthrough();

const ImportsGetFromImageInputSchema = z.object({
	jobId: z.string(),
});

const ImportsGetFromImageResponseSchema = z
	.object({
		job: ImageToDesignJobSchema,
	})
	.passthrough();

// ── resizes ────────────────────────────────────────────────────────────────

export const ResizeJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		result: z
			.object({
				design: DesignSummarySchema,
				trial_information: TrialInformationSchema.optional(),
			})
			.passthrough()
			.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

export type ResizeJob = z.infer<typeof ResizeJobSchema>;

const ResizesCreateInputSchema = z.object({
	design_id: z.string(),
	design_type: DesignTypeInputSchema,
});

const ResizesCreateResponseSchema = z
	.object({
		job: ResizeJobSchema,
	})
	.passthrough();

const ResizesGetInputSchema = z.object({
	jobId: z.string(),
});

const ResizesGetResponseSchema = z
	.object({
		job: ResizeJobSchema,
	})
	.passthrough();

// ── autofills ──────────────────────────────────────────────────────────────

// Cells Canva accepts in an autofill table. Number formatting metadata is
// refused by autofill, so it is refused here rather than sent and rejected.
const ScalarCellSchemas = [
	z.object({
		type: z.literal('string'),
		value: z.string().max(10000).optional(),
	}),
	z.object({
		type: z.literal('number'),
		value: z.number().optional(),
		metadata: z
			.never({ message: 'Canva autofill refuses number formatting metadata' })
			.optional(),
	}),
	z.object({ type: z.literal('boolean'), value: z.boolean().optional() }),
	z.object({
		type: z.literal('date'),
		value: z.number().int().optional().describe('Unix seconds.'),
	}),
] as const;

// A media cell's value is a list of image or video uploads Canva defines.
const MediaCellSchema = z.object({ type: z.literal('media') }).passthrough();

const SCALAR_COLUMNS = [
	'string',
	'number',
	'boolean',
	'date',
	'variant',
] as const;

/**
 * A data table as autofill takes it: every row the same width, and
 * column_configs (when given) one per column. `variant` is a column whose
 * cells mix types.
 */
function dataTable<Cell extends z.ZodTypeAny>(
	cell: Cell,
	columnTypes: readonly [string, ...string[]],
	limits?: { rows: number; columns: number },
) {
	return z
		.object({
			column_configs: z
				.array(
					z.object({
						name: z.string().optional(),
						type: z.enum(columnTypes),
					}),
				)
				.optional(),
			rows: z.array(z.object({ cells: z.array(cell) })),
		})
		.superRefine((table, issue) => {
			const widths = new Set(table.rows.map((row) => row.cells.length));
			if (widths.size > 1) {
				issue.addIssue({
					code: 'custom',
					message: 'Every row needs the same number of cells',
				});
			}
			const width = table.rows[0]?.cells.length;
			if (
				table.column_configs &&
				width !== undefined &&
				table.column_configs.length !== width
			) {
				issue.addIssue({
					code: 'custom',
					message: 'column_configs needs one entry per column',
				});
			}
			if (limits && table.rows.length > limits.rows) {
				issue.addIssue({
					code: 'custom',
					message: `A chart takes at most ${limits.rows} rows`,
				});
			}
			if (limits && (width ?? 0) > limits.columns) {
				issue.addIssue({
					code: 'custom',
					message: `A chart takes at most ${limits.columns} columns`,
				});
			}
		})
		.describe(
			'{ rows: [{ cells: [{ type, value }] }], column_configs? }; every row has the same number of cells.',
		);
}

// Chart autofill: at most 100 rows and 20 columns, and no media cells.
const ChartDataTableSchema = dataTable(
	z.discriminatedUnion('type', [...ScalarCellSchemas]),
	SCALAR_COLUMNS,
	{ rows: 100, columns: 20 },
);

const SheetDataTableSchema = dataTable(
	z.discriminatedUnion('type', [...ScalarCellSchemas, MediaCellSchema]),
	[...SCALAR_COLUMNS, 'media'],
);

export const AutofillDataFieldSchema = z.discriminatedUnion('type', [
	z.object({ type: z.literal('text'), text: z.string() }),
	z.object({ type: z.literal('image'), asset_id: z.string() }),
	z.object({ type: z.literal('video'), asset_id: z.string() }),
	z.object({ type: z.literal('chart'), chart_data: ChartDataTableSchema }),
	z.object({ type: z.literal('sheet'), sheet_data: SheetDataTableSchema }),
]);

export type AutofillDataField = z.infer<typeof AutofillDataFieldSchema>;

export const AutofillDataSchema = z.record(z.string(), AutofillDataFieldSchema);
export type AutofillData = z.infer<typeof AutofillDataSchema>;

export const AutofillJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		result: z
			.object({
				type: z.string().optional().describe('create_design or update_design.'),
				design: DesignSummarySchema.optional(),
				trial_information: TrialInformationSchema.optional(),
			})
			.passthrough()
			.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

export type AutofillJob = z.infer<typeof AutofillJobSchema>;

const AutofillsCreateInputSchema = z
	.object({
		type: z
			.enum([
				'create_from_brand_template',
				'create_from_design',
				'update_design',
			])
			.optional()
			.describe(
				'create_from_brand_template (the default): a new design from brand_template_id. create_from_design: a new design from design_id. update_design: fill design_id in place.',
			),
		brand_template_id: z.string().optional(),
		design_id: z.string().optional(),
		data: AutofillDataSchema.describe(
			'Field name to value; get the field names from brandTemplates.getDataset or designs.getDataset.',
		),
		title: z
			.string()
			.min(1)
			.max(255)
			.optional()
			.describe('Title of the new design; not used by update_design.'),
	})
	.superRefine((value, issue) => {
		const type = value.type ?? 'create_from_brand_template';
		if (
			type === 'create_from_brand_template' &&
			value.brand_template_id === undefined
		) {
			issue.addIssue({
				code: 'custom',
				message: 'brand_template_id is required for create_from_brand_template',
			});
		}
		if (
			type !== 'create_from_brand_template' &&
			value.design_id === undefined
		) {
			issue.addIssue({
				code: 'custom',
				message: `design_id is required for ${type}`,
			});
		}
	});

const AutofillsCreateResponseSchema = z
	.object({
		job: AutofillJobSchema,
	})
	.passthrough();

const AutofillsGetInputSchema = z.object({
	jobId: z.string(),
});

const AutofillsGetResponseSchema = z
	.object({
		job: AutofillJobSchema,
	})
	.passthrough();

// ── design generation (preview) ────────────────────────────────────────────

const GenerationJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		result: z
			.object({
				design: DesignSummarySchema,
			})
			.passthrough()
			.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

const GenerationsCreateInputSchema = z.object({
	brief: z
		.string()
		.min(1)
		.max(5000)
		.describe('What the design should be about, in plain text.'),
	design_type: z.enum(['doc', 'presentation']),
	outline: z
		.array(
			z.object({
				title: z.string().min(1).max(255),
				description: z.string().min(1).max(2000).optional(),
				points: z.array(z.string().min(1).max(1000)).max(50).optional(),
			}),
		)
		.min(1)
		.max(100)
		.optional()
		.describe('Sections in order, e.g. one per slide.'),
});

const GenerationsCreateResponseSchema = z
	.object({
		job: GenerationJobSchema,
	})
	.passthrough();

const GenerationsGetInputSchema = z.object({
	jobId: z.string(),
});

const GenerationsGetResponseSchema = z
	.object({
		job: GenerationJobSchema,
	})
	.passthrough();

// ── image generation (preview) ─────────────────────────────────────────────

const AssetSummarySchema = z
	.object({
		type: z.enum(['image', 'video']),
		id: z.string(),
		name: z.string(),
		tags: z.array(z.string()),
		created_at: z.number(),
		updated_at: z.number(),
		thumbnail: ThumbnailSchema.optional(),
	})
	.passthrough();

const ImageGenerationJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		result: z
			.object({
				image: z
					.object({
						url: z
							.string()
							.describe('Download URL for the image, valid for 24 hours.'),
						asset: AssetSummarySchema.optional(),
						width: z.number(),
						height: z.number(),
					})
					.passthrough(),
			})
			.passthrough()
			.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

const ImageGenerationsCreateInputSchema = z.object({
	prompt: z.string().min(1).max(10000),
	aspect_ratio: z
		.enum([
			'square',
			'landscape',
			'portrait',
			'landscape_3_2',
			'portrait_2_3',
			'portrait_4_5',
			'landscape_4_3',
			'portrait_3_4',
			'landscape_5_4',
			'landscape_2_1',
			'portrait_1_2',
		])
		.optional(),
	model: z.enum(['craft_v1_2k', 'lucid_origin', 'z_image_turbo']).optional(),
	idempotency_key: z
		.string()
		.uuid()
		.optional()
		.describe(
			'A UUID; a retry with the same key returns the same job. One is made when left out.',
		),
	save_to_uploads: z
		.boolean()
		.optional()
		.describe("Also save the image to the user's Canva uploads as an asset."),
	asset_name: z
		.string()
		.min(1)
		.max(255)
		.optional()
		.describe('Name of the saved asset, with save_to_uploads.'),
});

const ImageGenerationsCreateResponseSchema = z
	.object({
		job: ImageGenerationJobSchema,
		model_expiry: z
			.object({ model: z.string(), expires_at: z.number() })
			.passthrough()
			.optional()
			.describe('Set when the chosen model is being retired.'),
	})
	.passthrough();

const ImageGenerationsGetInputSchema = z.object({
	jobId: z.string(),
});

const ImageGenerationsGetResponseSchema = z
	.object({
		job: ImageGenerationJobSchema,
	})
	.passthrough();

// ── image transformations (preview) ────────────────────────────────────────

const ImageTransformationJobSchema = z
	.object({
		id: z.string().optional(),
		status: JobStatusSchema,
		result: z
			.object({
				asset: AssetSchema,
				url: z.string().optional(),
			})
			.passthrough()
			.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

const ImageTransformationsCreateInputSchema = z.object({
	asset_id: z
		.string()
		.describe('The image asset to transform; it is not changed.'),
	name: z
		.string()
		.min(1)
		.max(255)
		.optional()
		.describe('Name of the new asset.'),
	transformations: z
		.array(z.object({ type: z.literal('background_removal') }))
		.min(1)
		.max(20)
		.describe('Applied in order. Canva offers background_removal today.'),
	idempotency_key: z.string().uuid().optional(),
});

const ImageTransformationsCreateResponseSchema = z
	.object({
		job: ImageTransformationJobSchema,
	})
	.passthrough();

const ImageTransformationsGetInputSchema = z.object({
	jobId: z.string(),
});

const ImageTransformationsGetResponseSchema = z
	.object({
		job: ImageTransformationJobSchema,
	})
	.passthrough();

// ── merges (preview) ───────────────────────────────────────────────────────

const MergeOperationSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('insert_pages'),
		source: z.object({
			type: z.literal('design'),
			design_id: z.string(),
			page_numbers: z.array(z.number().int().min(1)).min(1).optional(),
		}),
		after_page_number: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('0 inserts at the start; left out, at the end.'),
	}),
	z.object({
		type: z.literal('move_pages'),
		from_page_numbers: z.array(z.number().int().min(1)).min(1),
		to_after_page_number: z.number().int().min(0),
	}),
	z.object({
		type: z.literal('delete_pages'),
		page_numbers: z.array(z.number().int().min(1)).min(1),
	}),
]);

const MergeJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusSchema,
		result: z
			.object({
				design: DesignSummarySchema,
			})
			.passthrough()
			.optional(),
		error: JobErrorSchema.optional(),
	})
	.passthrough();

const MergesCreateInputSchema = z
	.object({
		type: z
			.enum(['create_new_design', 'modify_existing_design'])
			.describe(
				'create_new_design builds a new design from the operations; modify_existing_design changes design_id in place.',
			),
		design_id: z
			.string()
			.optional()
			.describe('The design to change, for modify_existing_design.'),
		title: z
			.string()
			.min(1)
			.max(255)
			.optional()
			.describe('Required for create_new_design.'),
		operations: z.array(MergeOperationSchema).min(1).max(500),
	})
	.superRefine((value, issue) => {
		if (value.type === 'create_new_design' && value.title === undefined) {
			issue.addIssue({
				code: 'custom',
				message: 'title is required for create_new_design',
			});
		}
		if (
			value.type === 'modify_existing_design' &&
			value.design_id === undefined
		) {
			issue.addIssue({
				code: 'custom',
				message: 'design_id is required for modify_existing_design',
			});
		}
	});

const MergesCreateResponseSchema = z
	.object({
		job: MergeJobSchema,
	})
	.passthrough();

const MergesGetInputSchema = z.object({
	jobId: z.string(),
});

const MergesGetResponseSchema = z
	.object({
		job: MergeJobSchema,
	})
	.passthrough();

// ── print partners (preview, Print Partner apps only) ──────────────────────

const PrintProofingInputSchema = {
	bleed: z
		.number()
		.int()
		.min(0)
		.max(150000)
		.optional()
		.describe('Bleed in micrometres.'),
	min_pages: z.number().int().min(1).max(500).optional(),
	max_pages: z.number().int().min(1).max(500).optional(),
};

const PrintPartnerCreateDesignInputSchema = z.object({
	design_source: z.discriminatedUnion('type', [
		z.object({
			type: z.literal('dimensions'),
			dimensions: z.object({
				width: z.number().min(1),
				height: z.number().min(1),
				units: z.enum(['in', 'cm', 'mm']),
			}),
			product_type: z.string().optional(),
		}),
		z.object({
			type: z.literal('partner_product_id'),
			partner_product_id: z.string(),
		}),
	]),
	title: z.string().min(1).max(255).optional(),
	...PrintProofingInputSchema,
});

const PrintPartnerDesignResponseSchema = z
	.object({
		design: DesignSchema,
	})
	.passthrough();

const PrintPartnerGetDesignInputSchema = z.object({
	designId: z.string(),
	...PrintProofingInputSchema,
});

const PrintPartnerCreateExportInputSchema = z.object({
	design_id: z.string(),
	format: z.discriminatedUnion('type', [
		z.object({
			type: z.literal('pdf'),
			bleed: z.number().int().min(0).max(150000).optional(),
			crop_marks: z.boolean().optional(),
			cmyk: z.boolean().optional(),
			pdfx: z.boolean().optional(),
		}),
		z.object({ type: z.literal('jpg') }),
		z.object({ type: z.literal('png') }),
	]),
	dimensions: z
		.object({
			width: z.number().min(1).optional(),
			height: z.number().min(1).optional(),
			units: z.enum(['px', 'in', 'cm', 'mm']).optional(),
		})
		.optional(),
	pages: z.array(z.number().int().min(1)).optional(),
});

const PrintPartnerCreateExportResponseSchema = z
	.object({
		job: ExportJobSchema,
	})
	.passthrough();

// ── comments (preview) ─────────────────────────────────────────────────────

const CommentUserSchema = z
	.object({
		id: z.string(),
		display_name: z.string().optional(),
	})
	.passthrough();

const CommentContentSchema = z
	.object({
		plaintext: z.string().optional(),
		markdown: z.string().optional(),
	})
	.passthrough();

export const CommentThreadSchema = z
	.object({
		id: z.string(),
		design_id: z.string().optional(),
		thread_type: z
			.object({
				type: z.string().optional().describe('comment or suggestion.'),
				content: CommentContentSchema.optional(),
				mentions: z.record(z.string(), z.unknown()).optional(),
				assignee: CommentUserSchema.optional(),
				resolver: CommentUserSchema.optional(),
				suggested_edits: z.array(z.record(z.string(), z.unknown())).optional(),
				status: z.string().optional(),
			})
			.passthrough()
			.optional(),
		author: CommentUserSchema.optional(),
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
		mentions: z.record(z.string(), z.unknown()).optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
	})
	.passthrough();

export type CommentReply = z.infer<typeof CommentReplySchema>;

const CommentsCreateThreadInputSchema = z.object({
	designId: z.string(),
	message_plaintext: z
		.string()
		.min(1)
		.max(2048)
		.describe('The comment. Mention a user as [user_id:team_id].'),
	assignee_id: z.string().optional(),
});

const CommentsCreateThreadResponseSchema = z
	.object({
		thread: CommentThreadSchema,
	})
	.passthrough();

const CommentsGetThreadInputSchema = z.object({
	designId: z.string(),
	threadId: z.string(),
});

const CommentsGetThreadResponseSchema = z
	.object({
		thread: CommentThreadSchema.optional(),
		comment: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('The older comment shape, when Canva sends it.'),
	})
	.passthrough();

const CommentsCreateReplyInputSchema = z.object({
	designId: z.string(),
	threadId: z.string(),
	message_plaintext: z.string().min(1).max(2048),
});

const CommentsCreateReplyResponseSchema = z
	.object({
		reply: CommentReplySchema,
	})
	.passthrough();

const CommentsListRepliesInputSchema = z.object({
	designId: z.string(),
	threadId: z.string(),
	continuation: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

const CommentsListRepliesResponseSchema = z
	.object({
		items: z.array(CommentReplySchema),
		continuation: z.string().optional(),
	})
	.passthrough();

const CommentsGetReplyInputSchema = z.object({
	designId: z.string(),
	threadId: z.string(),
	replyId: z.string(),
});

const CommentsGetReplyResponseSchema = z
	.object({
		reply: CommentReplySchema,
	})
	.passthrough();

// ── keys ───────────────────────────────────────────────────────────────────

const KeysListInputSchema = z.object({});

const KeysListResponseSchema = z
	.object({
		keys: z.array(
			z
				.object({
					kid: z.string(),
					kty: z.string(),
					crv: z.string(),
					x: z.string(),
				})
				.passthrough(),
		),
	})
	.passthrough();

const AppsGetJwksInputSchema = z.object({
	appId: z.string(),
});

const AppsGetJwksResponseSchema = z
	.object({
		keys: z.array(
			z
				.object({
					kid: z.string(),
					kty: z.string(),
					n: z.string(),
					e: z.string(),
					alg: z.string().optional(),
					use: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

// ── registry ───────────────────────────────────────────────────────────────

export const CanvaEndpointInputSchemas = {
	usersGetMe: UsersGetMeInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
	usersGetCapabilities: UsersGetCapabilitiesInputSchema,
	designsList: DesignsListInputSchema,
	designsGet: DesignsGetInputSchema,
	designsCreate: DesignsCreateInputSchema,
	designsGetPages: DesignsGetPagesInputSchema,
	designsGetExportFormats: DesignsGetExportFormatsInputSchema,
	designsGetDataset: DesignsGetDatasetInputSchema,
	analyticsGet: AnalyticsGetInputSchema,
	analyticsListViewers: AnalyticsListViewersInputSchema,
	analyticsListViewsOverTime: AnalyticsListViewsOverTimeInputSchema,
	analyticsListPageViews: AnalyticsListPageViewsInputSchema,
	analyticsListLinks: AnalyticsListLinksInputSchema,
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
	exportsDownload: ExportsDownloadInputSchema,
	brandTemplatesList: BrandTemplatesListInputSchema,
	brandTemplatesGet: BrandTemplatesGetInputSchema,
	brandTemplatesGetDataset: BrandTemplatesGetDatasetInputSchema,
	brandTemplatesPublish: BrandTemplatesPublishInputSchema,
	assetUploadsCreate: AssetUploadsCreateInputSchema,
	assetUploadsGet: AssetUploadsGetInputSchema,
	assetUploadsCreateFromUrl: AssetUploadsCreateFromUrlInputSchema,
	assetUploadsGetFromUrl: AssetUploadsGetFromUrlInputSchema,
	importsCreate: ImportsCreateInputSchema,
	importsGet: ImportsGetInputSchema,
	importsCreateFromUrl: ImportsCreateFromUrlInputSchema,
	importsGetFromUrl: ImportsGetFromUrlInputSchema,
	importsCreateFromImage: ImportsCreateFromImageInputSchema,
	importsGetFromImage: ImportsGetFromImageInputSchema,
	resizesCreate: ResizesCreateInputSchema,
	resizesGet: ResizesGetInputSchema,
	autofillsCreate: AutofillsCreateInputSchema,
	autofillsGet: AutofillsGetInputSchema,
	generationsCreate: GenerationsCreateInputSchema,
	generationsGet: GenerationsGetInputSchema,
	imageGenerationsCreate: ImageGenerationsCreateInputSchema,
	imageGenerationsGet: ImageGenerationsGetInputSchema,
	imageTransformationsCreate: ImageTransformationsCreateInputSchema,
	imageTransformationsGet: ImageTransformationsGetInputSchema,
	mergesCreate: MergesCreateInputSchema,
	mergesGet: MergesGetInputSchema,
	printPartnerCreateDesign: PrintPartnerCreateDesignInputSchema,
	printPartnerGetDesign: PrintPartnerGetDesignInputSchema,
	printPartnerCreateExport: PrintPartnerCreateExportInputSchema,
	commentsCreateThread: CommentsCreateThreadInputSchema,
	commentsGetThread: CommentsGetThreadInputSchema,
	commentsCreateReply: CommentsCreateReplyInputSchema,
	commentsListReplies: CommentsListRepliesInputSchema,
	commentsGetReply: CommentsGetReplyInputSchema,
	keysList: KeysListInputSchema,
	appsGetJwks: AppsGetJwksInputSchema,
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
	designsGetDataset: DesignsGetDatasetResponseSchema,
	analyticsGet: AnalyticsGetResponseSchema,
	analyticsListViewers: AnalyticsListViewersResponseSchema,
	analyticsListViewsOverTime: AnalyticsListViewsOverTimeResponseSchema,
	analyticsListPageViews: AnalyticsListPageViewsResponseSchema,
	analyticsListLinks: AnalyticsListLinksResponseSchema,
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
	exportsDownload: ExportsDownloadResponseSchema,
	brandTemplatesList: BrandTemplatesListResponseSchema,
	brandTemplatesGet: BrandTemplatesGetResponseSchema,
	brandTemplatesGetDataset: BrandTemplatesGetDatasetResponseSchema,
	brandTemplatesPublish: BrandTemplatesPublishResponseSchema,
	assetUploadsCreate: AssetUploadsCreateResponseSchema,
	assetUploadsGet: AssetUploadsGetResponseSchema,
	assetUploadsCreateFromUrl: AssetUploadsCreateFromUrlResponseSchema,
	assetUploadsGetFromUrl: AssetUploadsGetFromUrlResponseSchema,
	importsCreate: ImportsCreateResponseSchema,
	importsGet: ImportsGetResponseSchema,
	importsCreateFromUrl: ImportsCreateFromUrlResponseSchema,
	importsGetFromUrl: ImportsGetFromUrlResponseSchema,
	importsCreateFromImage: ImportsCreateFromImageResponseSchema,
	importsGetFromImage: ImportsGetFromImageResponseSchema,
	resizesCreate: ResizesCreateResponseSchema,
	resizesGet: ResizesGetResponseSchema,
	autofillsCreate: AutofillsCreateResponseSchema,
	autofillsGet: AutofillsGetResponseSchema,
	generationsCreate: GenerationsCreateResponseSchema,
	generationsGet: GenerationsGetResponseSchema,
	imageGenerationsCreate: ImageGenerationsCreateResponseSchema,
	imageGenerationsGet: ImageGenerationsGetResponseSchema,
	imageTransformationsCreate: ImageTransformationsCreateResponseSchema,
	imageTransformationsGet: ImageTransformationsGetResponseSchema,
	mergesCreate: MergesCreateResponseSchema,
	mergesGet: MergesGetResponseSchema,
	printPartnerCreateDesign: PrintPartnerDesignResponseSchema,
	printPartnerGetDesign: PrintPartnerDesignResponseSchema,
	printPartnerCreateExport: PrintPartnerCreateExportResponseSchema,
	commentsCreateThread: CommentsCreateThreadResponseSchema,
	commentsGetThread: CommentsGetThreadResponseSchema,
	commentsCreateReply: CommentsCreateReplyResponseSchema,
	commentsListReplies: CommentsListRepliesResponseSchema,
	commentsGetReply: CommentsGetReplyResponseSchema,
	keysList: KeysListResponseSchema,
	appsGetJwks: AppsGetJwksResponseSchema,
} as const;

export type CanvaEndpointInputs = {
	[K in keyof typeof CanvaEndpointInputSchemas]: z.input<
		(typeof CanvaEndpointInputSchemas)[K]
	>;
};

export type CanvaEndpointOutputs = {
	[K in keyof typeof CanvaEndpointOutputSchemas]: z.infer<
		(typeof CanvaEndpointOutputSchemas)[K]
	>;
};

type Outputs = CanvaEndpointOutputs;

export type UsersGetMeResponse = Outputs['usersGetMe'];
export type UsersGetProfileResponse = Outputs['usersGetProfile'];
export type UsersGetCapabilitiesResponse = Outputs['usersGetCapabilities'];
export type DesignsListResponse = Outputs['designsList'];
export type DesignsGetResponse = Outputs['designsGet'];
export type DesignsCreateResponse = Outputs['designsCreate'];
export type DesignsGetPagesResponse = Outputs['designsGetPages'];
export type DesignsGetExportFormatsResponse =
	Outputs['designsGetExportFormats'];
export type DesignsGetDatasetResponse = Outputs['designsGetDataset'];
export type AnalyticsGetResponse = Outputs['analyticsGet'];
export type AnalyticsListViewersResponse = Outputs['analyticsListViewers'];
export type AnalyticsListViewsOverTimeResponse =
	Outputs['analyticsListViewsOverTime'];
export type AnalyticsListPageViewsResponse = Outputs['analyticsListPageViews'];
export type AnalyticsListLinksResponse = Outputs['analyticsListLinks'];
export type AssetsGetResponse = Outputs['assetsGet'];
export type AssetsUpdateResponse = Outputs['assetsUpdate'];
export type AssetsDeleteResponse = Outputs['assetsDelete'];
export type FoldersCreateResponse = Outputs['foldersCreate'];
export type FoldersGetResponse = Outputs['foldersGet'];
export type FoldersUpdateResponse = Outputs['foldersUpdate'];
export type FoldersDeleteResponse = Outputs['foldersDelete'];
export type FoldersListItemsResponse = Outputs['foldersListItems'];
export type FoldersMoveItemResponse = Outputs['foldersMoveItem'];
export type ExportsCreateResponse = Outputs['exportsCreate'];
export type ExportsGetResponse = Outputs['exportsGet'];
export type ExportsDownloadResponse = Outputs['exportsDownload'];
export type BrandTemplatesListResponse = Outputs['brandTemplatesList'];
export type BrandTemplatesGetResponse = Outputs['brandTemplatesGet'];
export type BrandTemplatesGetDatasetResponse =
	Outputs['brandTemplatesGetDataset'];
export type BrandTemplatesPublishResponse = Outputs['brandTemplatesPublish'];
export type AssetUploadsCreateResponse = Outputs['assetUploadsCreate'];
export type AssetUploadsGetResponse = Outputs['assetUploadsGet'];
export type AssetUploadsCreateFromUrlResponse =
	Outputs['assetUploadsCreateFromUrl'];
export type AssetUploadsGetFromUrlResponse = Outputs['assetUploadsGetFromUrl'];
export type ImportsCreateResponse = Outputs['importsCreate'];
export type ImportsGetResponse = Outputs['importsGet'];
export type ImportsCreateFromUrlResponse = Outputs['importsCreateFromUrl'];
export type ImportsGetFromUrlResponse = Outputs['importsGetFromUrl'];
export type ImportsCreateFromImageResponse = Outputs['importsCreateFromImage'];
export type ImportsGetFromImageResponse = Outputs['importsGetFromImage'];
export type ResizesCreateResponse = Outputs['resizesCreate'];
export type ResizesGetResponse = Outputs['resizesGet'];
export type AutofillsCreateResponse = Outputs['autofillsCreate'];
export type AutofillsGetResponse = Outputs['autofillsGet'];
export type GenerationsCreateResponse = Outputs['generationsCreate'];
export type GenerationsGetResponse = Outputs['generationsGet'];
export type ImageGenerationsCreateResponse = Outputs['imageGenerationsCreate'];
export type ImageGenerationsGetResponse = Outputs['imageGenerationsGet'];
export type ImageTransformationsCreateResponse =
	Outputs['imageTransformationsCreate'];
export type ImageTransformationsGetResponse =
	Outputs['imageTransformationsGet'];
export type MergesCreateResponse = Outputs['mergesCreate'];
export type MergesGetResponse = Outputs['mergesGet'];
export type PrintPartnerCreateDesignResponse =
	Outputs['printPartnerCreateDesign'];
export type PrintPartnerGetDesignResponse = Outputs['printPartnerGetDesign'];
export type PrintPartnerCreateExportResponse =
	Outputs['printPartnerCreateExport'];
export type CommentsCreateThreadResponse = Outputs['commentsCreateThread'];
export type CommentsGetThreadResponse = Outputs['commentsGetThread'];
export type CommentsCreateReplyResponse = Outputs['commentsCreateReply'];
export type CommentsListRepliesResponse = Outputs['commentsListReplies'];
export type CommentsGetReplyResponse = Outputs['commentsGetReply'];
export type KeysListResponse = Outputs['keysList'];
export type AppsGetJwksResponse = Outputs['appsGetJwks'];
