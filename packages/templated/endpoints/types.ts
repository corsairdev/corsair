import { z } from 'zod';

// Inputs use Templated's own field names, including the camelCase ones its
// render and template objects use (`templateId`, `externalId`) alongside the
// snake_case create fields (`image_url`, `webhook_url`). Outputs are `.loose()`
// and their optional fields nullish.
// Field reference: https://templated.io/docs

/**
 * The list routes page by number, starting at 0, with `page` and `limit`.
 * `limit` defaults to 15, so a caller who omits it sees 15 items, not all of
 * them.
 */
export const PageSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('Page of results, starting at 0.');
export const LimitSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Items per page. Templated defaults it to 15.');

/**
 * One layer's overrides. The render docs type most properties as strings, but
 * some as numbers (`x`, `padding_x`, `text_stroke_width`), booleans (`hide`,
 * `autofit`) or objects (`animation`), so values take any JSON type.
 */
export const LayerOverrideSchema = z.record(
	z.string(),
	// unknown: the docs list over 40 layer properties of mixed types.
	z.unknown(),
);

// An id goes into the path encoded, but `.` and `..` survive encoding and
// fetch resolves them as dot segments, which would change the route.
const PathId = z
	.string()
	.min(1)
	.refine((value) => value !== '.' && value !== '..', 'Not a valid id.');

export const RenderIdSchema = PathId.describe('The render ID.');
export const TemplateIdSchema = PathId.describe('The template ID.');
export const FolderIdSchema = PathId;

// ── render ────────────────────────────────────────────────────────────────

export const RenderSchema = z
	.object({
		id: z.string(),
		url: z.string().nullish(),
		// Present only when Bring Your Own Storage is connected.
		storage_url: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		// PENDING, COMPLETED or FAILED on an async render.
		status: z.string().nullish(),
		format: z.string().nullish(),
		templateId: z.string().nullish(),
		templateName: z.string().nullish(),
		name: z.string().nullish(),
		createdAt: z.string().nullish(),
		externalId: z.string().nullish(),
	})
	.loose();

export type TemplatedRender = z.infer<typeof RenderSchema>;

export const RendersListInputSchema = z
	.object({
		// The docs define no query parameters on this route, so it takes none.
		// Filtering by name or tag is only documented on the uploads list.
	})
	// Strict so a caller passing a filter this route does not define gets an
	// error instead of a silent full list. Zod's default is to strip it.
	.strict();

export type RendersListInput = z.infer<typeof RendersListInputSchema>;

/**
 * The list routes answer a bare array. The page counters, when Templated sends
 * them, arrive alongside it rather than inside a record.
 */
export const RendersListResponseSchema = z.array(RenderSchema);

export type RendersListResponse = z.infer<typeof RendersListResponseSchema>;

export const RendersGetInputSchema = z.object({ renderId: RenderIdSchema });

export type RendersGetInput = z.infer<typeof RendersGetInputSchema>;

export const RendersGetResponseSchema = RenderSchema;

export type RendersGetResponse = z.infer<typeof RendersGetResponseSchema>;

export const RendersCreateInputSchema = z
	.object({
		template: z
			.string()
			.optional()
			.describe('The template to render. Required unless `templates` is sent.'),
		templates: z
			.array(z.string())
			.min(1)
			.optional()
			.describe(
				'Batch render several templates. When present, `template` is ignored and not required.',
			),
		layers: z
			.record(z.string(), LayerOverrideSchema)
			.optional()
			.describe(
				'Layer overrides keyed by layer name, each a map of property to value, e.g. `{ "text-1": { "text": "Hello" } }`.',
			),
		format: z
			.enum(['jpg', 'png', 'webp', 'pdf', 'mp4', 'html'])
			.optional()
			.describe('The output format. The API defaults it to jpg.'),
		// The numeric bounds are the ones the create page documents.
		width: z
			.number()
			.int()
			.min(100)
			.max(5000)
			.optional()
			.describe('Custom width in pixels, 100 to 5000.'),
		height: z
			.number()
			.int()
			.min(100)
			.max(5000)
			.optional()
			.describe('Custom height in pixels, 100 to 5000.'),
		scale: z
			.number()
			.min(0.1)
			.max(2)
			.optional()
			.describe(
				'Scale factor for the final render, 0.1 to 2.0. Defaults to 1.',
			),
		transparent: z
			.boolean()
			.optional()
			.describe('A transparent background, for png only.'),
		duration: z
			.number()
			.min(1)
			.max(90_000)
			.optional()
			.describe('Video duration in milliseconds, for mp4, up to 90000.'),
		fps: z
			.number()
			.int()
			.min(1)
			.max(60)
			.optional()
			.describe('Frames per second, for mp4, 1 to 60.'),
		flatten: z.boolean().optional().describe('Flatten the PDF, for print.'),
		cmyk: z.boolean().optional().describe('Use CMYK colour, for print.'),
		name: z.string().optional().describe('A name for the render.'),
		background: z.string().optional().describe('A hex background colour.'),
		external_id: z
			.string()
			.optional()
			.describe('Your own identifier for this render.'),
		async: z
			.boolean()
			.optional()
			.describe(
				'Render asynchronously and return while it is still PENDING. Defaults to false.',
			),
		webhook_url: z
			.string()
			.optional()
			.describe('A URL Templated posts the finished render to.'),
	})
	// A render needs a template or a list of them, and the docs say the API
	// ignores `template` when `templates` is present.
	.superRefine((value, ctx) => {
		if (
			value.template === undefined &&
			(value.templates === undefined || value.templates.length === 0)
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide template, or templates for a batch render.',
				path: ['template'],
			});
		}
	});

export type RendersCreateInput = z.input<typeof RendersCreateInputSchema>;

export /**
 * A single render answers one object; a batch render (`templates`) answers an
 * array of them, so the response schema accepts either.
 */
const RendersCreateResponseSchema = z.union([
	RenderSchema,
	z.array(RenderSchema),
]);

export type RendersCreateResponse = z.infer<typeof RendersCreateResponseSchema>;

export const RendersDuplicateInputSchema = z.object({
	renderId: RenderIdSchema,
});

export type RendersDuplicateInput = z.infer<typeof RendersDuplicateInputSchema>;

export const RendersRemoveInputSchema = z.object({ renderId: RenderIdSchema });

export type RendersRemoveInput = z.infer<typeof RendersRemoveInputSchema>;

export const RendersMergeInputSchema = z.object({
	ids: z.array(z.string().min(1)).min(1).describe('The renders to merge.'),
	urls: z
		.array(z.string())
		.optional()
		.describe('External PDF URLs to merge after the renders, in order.'),
	name: z.string().optional().describe('A name for the merged PDF.'),
	// Only the hosted form is modelled: without it the API answers the file
	// bytes, so `host: false` is refused rather than silently overridden.
	host: z
		.literal(true)
		.optional()
		.describe('Host the merged PDF and return its URL. Always on.'),
});

export type RendersMergeInput = z.infer<typeof RendersMergeInputSchema>;

/**
 * A merge with `host: true` answers `{ url }` for the hosted PDF, not a render
 * object. The direct-download form returns the file bytes, which this plugin
 * does not model.
 */
export const RendersMergeResponseSchema = z.object({ url: z.string() }).loose();

export type RendersMergeResponse = z.infer<typeof RendersMergeResponseSchema>;

// ── templates ─────────────────────────────────────────────────────────────

export const TemplateLayerSchema = z
	.object({
		layer: z.string().nullish(),
		type: z.string().nullish(),
		text: z.string().nullish(),
		x: z.number().nullish(),
		y: z.number().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		rotation: z.number().nullish(),
		// A text layer can carry an open style map; the documented keys are here.
		color: z.string().nullish(),
		background: z.string().nullish(),
		// The documented layer keys are snake_case; font_size is a CSS string
		// such as "24px" on a write, and the layers route can answer a number.
		font_family: z.string().nullish(),
		font_size: z.union([z.string(), z.number()]).nullish(),
		font_weight: z.union([z.string(), z.number()]).nullish(),
		text_align: z.string().nullish(),
		// An image layer points at a URL or an upload ID.
		image_url: z.string().nullish(),
		locked: z.boolean().nullish(),
	})
	.loose();

export type TemplatedTemplateLayer = z.infer<typeof TemplateLayerSchema>;

export const TemplateSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		thumbnail: z.string().nullish(),
		layersCount: z.number().nullish(),
		folderId: z.string().nullish(),
		createdAt: z.string().nullish(),
		modifiedAt: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		// Present when templates.get is asked for them.
		layers: z.array(TemplateLayerSchema).nullish(),
		// unknown: each page carries its own layer map, per template.
		pages: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type TemplatedTemplate = z.infer<typeof TemplateSchema>;

export const TemplatesListInputSchema = z.object({
	page: PageSchema,
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Items per page. Templated defaults it to 25 here.'),
	query: z.string().optional().describe('Filter templates by name.'),
	width: z.number().int().optional().describe('Only templates this wide.'),
	height: z.number().int().optional().describe('Only templates this tall.'),
});

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

export const TemplatesListResponseSchema = z.array(TemplateSchema);

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

export const TemplatesGetInputSchema = z.object({
	templateId: TemplateIdSchema,
	includeLayers: z
		.boolean()
		.optional()
		.describe('Include the template layers in the answer.'),
	includePages: z
		.boolean()
		.optional()
		.describe('Include the pages and their layers.'),
});

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

export const TemplatesGetResponseSchema = TemplateSchema;

export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

export const TemplatesLayersInputSchema = z.object({
	templateId: TemplateIdSchema,
	includeLockedLayers: z
		.boolean()
		.optional()
		.describe('Include layers marked locked. Defaults to false.'),
});

export type TemplatesLayersInput = z.infer<typeof TemplatesLayersInputSchema>;

export const TemplatesLayersResponseSchema = z.array(TemplateLayerSchema);

export type TemplatesLayersResponse = z.infer<
	typeof TemplatesLayersResponseSchema
>;

export const TemplatesCreateInputSchema = z.object({
	name: z.string().min(1).describe('The template name.'),
	width: z
		.number()
		.int()
		.min(1)
		.max(5000)
		.describe('Width in pixels, up to 5000.'),
	height: z
		.number()
		.int()
		.min(1)
		.max(5000)
		.describe('Height in pixels, up to 5000.'),
	layers: z
		.array(TemplateLayerSchema)
		.min(1)
		.describe(
			'The layers that make up a single-page template, each with `layer` and `type`.',
		),
	// The create route documents no description, folder or tags, and a live
	// create with `tags` came back with none; use templates.addTags after.
});

export type TemplatesCreateInput = z.input<typeof TemplatesCreateInputSchema>;

export const TemplatesCreateResponseSchema = TemplateSchema;

export type TemplatesCreateResponse = z.infer<
	typeof TemplatesCreateResponseSchema
>;

export const TemplatesRemoveInputSchema = z.object({
	templateId: TemplateIdSchema,
});

export type TemplatesRemoveInput = z.infer<typeof TemplatesRemoveInputSchema>;

// Both tag routes take a bare JSON array of strings as the body, not an object.
export const TemplatesAddTagsInputSchema = z.object({
	templateId: TemplateIdSchema,
	tags: z.array(z.string().min(1)).min(1).describe('Tags to add.'),
});

export type TemplatesAddTagsInput = z.infer<typeof TemplatesAddTagsInputSchema>;

export const TemplatesRemoveTagsInputSchema = z.object({
	templateId: TemplateIdSchema,
	tags: z.array(z.string().min(1)).min(1).describe('Tags to remove.'),
});

export type TemplatesRemoveTagsInput = z.infer<
	typeof TemplatesRemoveTagsInputSchema
>;

export const TemplateTagsResponseSchema = z
	.object({
		id: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

export type TemplateTagsResponse = z.infer<typeof TemplateTagsResponseSchema>;

// ── uploads ───────────────────────────────────────────────────────────────

export const UploadSchema = z
	.object({
		id: z.string(),
		url: z.string().nullish(),
		name: z.string().nullish(),
		mimeType: z.string().nullish(),
		size: z.number().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		tags: z.array(z.string()).nullish(),
		externalId: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

export type TemplatedUpload = z.infer<typeof UploadSchema>;

export const UploadsListInputSchema = z.object({
	page: PageSchema,
	limit: LimitSchema,
	query: z.string().optional().describe('Search uploads by name or tag.'),
	tags: z
		.array(z.string())
		.optional()
		.describe('Only uploads with these tags.'),
});

export type UploadsListInput = z.infer<typeof UploadsListInputSchema>;

export const UploadsListResponseSchema = z.array(UploadSchema);

export type UploadsListResponse = z.infer<typeof UploadsListResponseSchema>;

export const UploadsCreateInputSchema = z.object({
	// The route takes multipart form-data with a real file, up to 2 MB.
	// corsair/http cannot build a file part from bytes the caller holds, so the
	// plugin asks for the file's contents as base64 and sends it as a Blob.
	fileName: z
		.string()
		.min(1)
		.describe('The file name, with its extension: jpg, png, webp or svg.'),
	fileBase64: z
		.string()
		.min(1)
		.describe('The image bytes, base64 encoded. Maximum 2 MB.'),
	contentType: z
		.string()
		.optional()
		.describe(
			'The image media type, e.g. "image/png". Inferred from the name when omitted.',
		),
	tags: z.array(z.string()).optional().describe('Tags to organise the upload.'),
	externalId: z
		.string()
		.optional()
		.describe('Your own reference for the upload.'),
});

export type UploadsCreateInput = z.infer<typeof UploadsCreateInputSchema>;

export const UploadsCreateResponseSchema = UploadSchema;

export type UploadsCreateResponse = z.infer<typeof UploadsCreateResponseSchema>;

export const UploadsRemoveInputSchema = z.object({
	uploadIds: z
		.array(z.string().min(1))
		.min(1)
		.describe('The uploads to delete, sent as repeated `ids` query values.'),
});

export type UploadsRemoveInput = z.infer<typeof UploadsRemoveInputSchema>;

// ── folders ───────────────────────────────────────────────────────────────

export const FolderSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		// The create route answers createdAt and updatedAt; the list route adds
		// templateCount, so both are typed nullish.
		templateCount: z.number().nullish(),
		renderCount: z.number().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type TemplatedFolder = z.infer<typeof FolderSchema>;

export const FoldersListInputSchema = z.object({
	page: PageSchema,
	limit: LimitSchema,
	query: z.string().optional().describe('Filter folders by name.'),
});

export type FoldersListInput = z.infer<typeof FoldersListInputSchema>;

export const FoldersListResponseSchema = z.array(FolderSchema);

export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

export const FoldersCreateInputSchema = z.object({
	name: z.string().min(1).describe('The folder name.'),
});

export type FoldersCreateInput = z.infer<typeof FoldersCreateInputSchema>;

export const FoldersUpdateInputSchema = z.object({
	folderId: FolderIdSchema.describe('The folder to rename.'),
	name: z.string().min(1).describe('The new folder name.'),
});

export type FoldersUpdateInput = z.infer<typeof FoldersUpdateInputSchema>;

export const FoldersRemoveInputSchema = z.object({
	folderId: FolderIdSchema.describe('The folder to delete.'),
});

export type FoldersRemoveInput = z.infer<typeof FoldersRemoveInputSchema>;

export const FolderResponseSchema = FolderSchema;

export type FolderResponse = z.infer<typeof FolderResponseSchema>;

// ── fonts ─────────────────────────────────────────────────────────────────

export const FontSchema = z
	.object({
		name: z.string().nullish(),
		// The docs mark which kinds a font is rather than giving a single source.
		isGoogleFont: z.boolean().nullish(),
		isUploadedFont: z.boolean().nullish(),
		category: z.string().nullish(),
		variants: z.array(z.string()).nullish(),
	})
	.loose();

export type TemplatedFont = z.infer<typeof FontSchema>;

export const FontsListInputSchema = z.object({});

export type FontsListInput = z.infer<typeof FontsListInputSchema>;

export const FontsListResponseSchema = z.array(FontSchema);

export type FontsListResponse = z.infer<typeof FontsListResponseSchema>;

export const GalleryFontsListInputSchema = z.object({});

export type GalleryFontsListInput = z.infer<typeof GalleryFontsListInputSchema>;

export const GalleryFontsListResponseSchema = z.array(FontSchema);

export type GalleryFontsListResponse = z.infer<
	typeof GalleryFontsListResponseSchema
>;

// ── account ───────────────────────────────────────────────────────────────

export const AccountInputSchema = z.object({});

export type AccountInput = z.infer<typeof AccountInputSchema>;

export const AccountSchema = z
	.object({
		email: z.string().nullish(),
		name: z.string().nullish(),
		apiUsage: z.number().nullish(),
		apiQuota: z.number().nullish(),
		usagePercentage: z.number().nullish(),
		plan: z.string().nullish(),
	})
	.loose();

export type TemplatedAccount = z.infer<typeof AccountSchema>;

export const AccountResponseSchema = AccountSchema;

export type AccountResponse = z.infer<typeof AccountResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type TemplatedEndpointInputs = {
	rendersList: RendersListInput;
	rendersGet: RendersGetInput;
	rendersCreate: RendersCreateInput;
	rendersDuplicate: RendersDuplicateInput;
	rendersRemove: RendersRemoveInput;
	rendersMerge: RendersMergeInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	templatesLayers: TemplatesLayersInput;
	templatesCreate: TemplatesCreateInput;
	templatesRemove: TemplatesRemoveInput;
	templatesAddTags: TemplatesAddTagsInput;
	templatesRemoveTags: TemplatesRemoveTagsInput;
	uploadsList: UploadsListInput;
	uploadsCreate: UploadsCreateInput;
	uploadsRemove: UploadsRemoveInput;
	foldersList: FoldersListInput;
	foldersCreate: FoldersCreateInput;
	foldersUpdate: FoldersUpdateInput;
	foldersRemove: FoldersRemoveInput;
	fontsList: FontsListInput;
	galleryFontsList: GalleryFontsListInput;
	accountGet: AccountInput;
};

export type TemplatedEndpointOutputs = {
	rendersList: RendersListResponse;
	rendersGet: RendersGetResponse;
	rendersCreate: RendersCreateResponse;
	rendersDuplicate: RendersCreateResponse;
	rendersRemove: { success: true };
	rendersMerge: RendersMergeResponse;
	templatesList: TemplatesListResponse;
	templatesGet: TemplatesGetResponse;
	templatesLayers: TemplatesLayersResponse;
	templatesCreate: TemplatesCreateResponse;
	templatesRemove: { success: true };
	templatesAddTags: TemplateTagsResponse;
	templatesRemoveTags: TemplateTagsResponse;
	uploadsList: UploadsListResponse;
	uploadsCreate: UploadsCreateResponse;
	uploadsRemove: { success: true };
	foldersList: FoldersListResponse;
	foldersCreate: FolderResponse;
	foldersUpdate: FolderResponse;
	foldersRemove: { success: true };
	fontsList: FontsListResponse;
	galleryFontsList: GalleryFontsListResponse;
	accountGet: AccountResponse;
};

export const TemplatedEndpointInputSchemas = {
	rendersList: RendersListInputSchema,
	rendersGet: RendersGetInputSchema,
	rendersCreate: RendersCreateInputSchema,
	rendersDuplicate: RendersDuplicateInputSchema,
	rendersRemove: RendersRemoveInputSchema,
	rendersMerge: RendersMergeInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesLayers: TemplatesLayersInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesRemove: TemplatesRemoveInputSchema,
	templatesAddTags: TemplatesAddTagsInputSchema,
	templatesRemoveTags: TemplatesRemoveTagsInputSchema,
	uploadsList: UploadsListInputSchema,
	uploadsCreate: UploadsCreateInputSchema,
	uploadsRemove: UploadsRemoveInputSchema,
	foldersList: FoldersListInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
	foldersRemove: FoldersRemoveInputSchema,
	fontsList: FontsListInputSchema,
	galleryFontsList: GalleryFontsListInputSchema,
	accountGet: AccountInputSchema,
} as const;

export const DeleteResultSchema = z.object({ success: z.literal(true) });

export const TemplatedEndpointOutputSchemas = {
	rendersList: RendersListResponseSchema,
	rendersGet: RendersGetResponseSchema,
	rendersCreate: RendersCreateResponseSchema,
	rendersDuplicate: RendersCreateResponseSchema,
	rendersRemove: DeleteResultSchema,
	rendersMerge: RendersMergeResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesLayers: TemplatesLayersResponseSchema,
	templatesCreate: TemplatesCreateResponseSchema,
	templatesRemove: DeleteResultSchema,
	templatesAddTags: TemplateTagsResponseSchema,
	templatesRemoveTags: TemplateTagsResponseSchema,
	uploadsList: UploadsListResponseSchema,
	uploadsCreate: UploadsCreateResponseSchema,
	uploadsRemove: DeleteResultSchema,
	foldersList: FoldersListResponseSchema,
	foldersCreate: FolderResponseSchema,
	foldersUpdate: FolderResponseSchema,
	foldersRemove: DeleteResultSchema,
	fontsList: FontsListResponseSchema,
	galleryFontsList: GalleryFontsListResponseSchema,
	accountGet: AccountResponseSchema,
} as const;
