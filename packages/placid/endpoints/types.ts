import { z } from 'zod';

// Inputs use Placid's own field names. Outputs are `.loose()` and their
// documented fields nullish, so a field Placid adds or omits cannot fail a call
// that has already happened.
// Reference: https://placid.app/docs/2.0/rest/images

// ── Shared building blocks ────────────────────────────────────────────────

/**
 * Layer overrides, keyed by layer name. Every layer type shares `hide`,
 * `opacity`, `rotation`, the position and size fields, and `link_target`; text,
 * picture, shape, browserframe, barcode, rating and subtitle layers add their
 * own. A single object covers all of them, so a caller can fill any layer
 * without the schema rejecting a property that belongs to another type.
 * Reference: https://placid.app/docs/2.0/rest/layers
 */
const LayerSchema = z
	.object({
		// General properties, valid on every layer type.
		hide: z.boolean().optional(),
		opacity: z.number().min(0).max(100).optional(),
		rotation: z.number().min(0).max(359).optional(),
		position_x_absolute: z.string().optional(),
		position_y_absolute: z.string().optional(),
		position_x_relative: z.string().optional(),
		position_y_relative: z.string().optional(),
		width: z.string().optional(),
		height: z.string().optional(),
		link_target: z.string().optional(),
		// Text.
		text: z
			.union([z.string(), z.array(z.string())])
			.optional()
			.describe(
				'Text content. An array of values is only accepted for video text layers.',
			),
		text_color: z.string().optional(),
		font: z
			.string()
			.optional()
			.describe(
				'A font family name, or the `uuid` returned by `fonts.create`. That uuid is the value Placid resolves as the font for this layer.',
			),
		alt_text_color: z.string().optional(),
		alt_font: z.string().optional(),
		direction: z.enum(['auto', 'ltr', 'rtl']).optional(),
		// Picture and browserframe.
		image: z
			.union([z.string(), z.array(z.string())])
			.optional()
			.describe(
				'Image URL, or the URL of a page to screenshot. An array of URLs is only accepted for video picture layers.',
			),
		image_viewport: z.string().optional(),
		video: z.string().optional(),
		url: z.string().optional().describe("Fills a browserframe's address bar."),
		// Shape.
		background_color: z.string().optional(),
		border_color: z.string().optional(),
		border_radius: z.string().optional(),
		border_width: z.string().optional(),
		svg: z.string().optional(),
		// Barcode.
		value: z
			.union([z.string(), z.number()])
			.optional()
			.describe('A barcode value, or a rating from 0 to 10.'),
		color: z.string().optional(),
		// Subtitle.
		srt: z.string().optional(),
	})
	.describe(
		'Overrides for one template layer, keyed by the layer name set in the template editor. Omitted properties keep the template default.',
	);

const LayersSchema = z.record(z.string(), LayerSchema);

const ModificationsSchema = z
	.object({
		width: z.union([z.string(), z.number()]).optional(),
		height: z.union([z.string(), z.number()]).optional(),
		filename: z.string().optional(),
		image_format: z.enum(['auto', 'jpg', 'png', 'webp']).optional(),
		dpi: z.union([z.number(), z.string()]).optional(),
		color_mode: z.enum(['rgb', 'cmyk']).optional(),
		image_quality: z.enum(['high', 'medium', 'low']).optional(),
	})
	.describe('Output sizing and format. Placid overrides the template default.');

const TransferSchema = z
	.object({
		to: z.literal('s3'),
		key: z.string(),
		secret: z.string(),
		region: z.string().optional(),
		bucket: z.string(),
		visibility: z.enum(['public', 'private']).optional(),
		path: z
			.string()
			.describe(
				'Full object path from the bucket root, including filename and extension. Placid overwrites an existing file.',
			),
		endpoint: z.string().optional(),
		token: z.string().optional().describe('An AWS STS token.'),
	})
	.describe(
		'Copies the finished file to your own S3 bucket. Placid does not store the credentials.',
	);

/**
 * Free-form JSON the caller owns.
 *
 * Placid stores `passthrough` and `custom_data` verbatim and hands them back
 * unchanged, so their contents are decided by the caller, not by Placid. A
 * stricter shape would reject values the API accepts and could only be a
 * guess; `unknown` here means "not inspected", and the plugin never reads
 * inside. Reference: https://placid.app/docs/2.0/rest/images
 */
// unknown: caller-owned JSON, deliberately not inspected or constrained.
const CallerJsonValueSchema = z.unknown();

// unknown: caller-owned JSON array, one element per entry, contents unread.
const CallerJsonArraySchema = z.array(z.unknown());

const PassthroughSchema = z
	.union([z.string().max(1024), CallerJsonArraySchema])
	.describe(
		'Saved with the file and returned in the webhook and polling replies. At most 1024 characters.',
	);

/**
 * The async envelope every generated file starts in. Placid queues the render
 * and the first reply is usually `queued`; poll the matching `get` with `id`
 * or set `webhook_success` to learn when it is `finished`.
 */
const GenerateResultSchema = z
	.object({
		id: z.number(),
		// A status Placid adds later must not fail a render that already ran.
		status: z
			.enum(['queued', 'finished', 'error'])
			.or(z.string())
			.describe(
				'`queued` in the queue, `finished` ready, `error` failed. Poll the matching `get` with `id` until it is not `queued`.',
			),
		polling_url: z
			.string()
			.nullish()
			.describe('GET this until `status` settles.'),
		error_code: z
			.string()
			.nullish()
			.describe(
				'A render error code such as `INVALID_INPUT` or `MEDIA_DOWNLOAD_FAILED`. Null unless `status` is `error`.',
			),
		error_message: z
			.string()
			.nullish()
			.describe(
				'One sentence about the failure. Wording can change, so branch on `error_code`.',
			),
	})
	.loose();

const ErrorDetailSchema = z
	.object({
		layer: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

const ImageResultSchema = GenerateResultSchema.extend({
	image_url: z.string().nullish(),
	error_details: z.array(ErrorDetailSchema).nullish(),
	errors: z
		.array(z.string())
		.nullish()
		.describe(
			'Deprecated. Use `error_code`, `error_message` and `error_details`.',
		),
}).loose();

const PdfResultSchema = GenerateResultSchema.extend({
	pdf_url: z.string().nullish(),
	error_details: z.array(ErrorDetailSchema).nullish(),
}).loose();

const VideoResultSchema = GenerateResultSchema.extend({
	video_url: z.string().nullish(),
	error_details: z.array(ErrorDetailSchema).nullish(),
}).loose();

const PaginationLinksSchema = z
	.object({
		first: z.string().nullish(),
		last: z.string().nullish(),
		prev: z.string().nullish(),
		next: z
			.string()
			.nullish()
			.describe('A cursor-paged URL. Null on the last page.'),
	})
	.loose();

const PaginationMetaSchema = z
	.object({
		path: z.string().nullish(),
		// Placid sends 20 as a number by default, but echoes a `per_page` query
		// back as the string it received ("1"), so both are read as a number.
		per_page: z.coerce.number().nullish(),
	})
	.loose();

// ── images ────────────────────────────────────────────────────────────────

const ImagesCreateInputSchema = z.object({
	template_uuid: z
		.string()
		.min(1)
		.describe('The template to render, from the Templates tab of the project.'),
	layers: LayersSchema.optional(),
	modifications: ModificationsSchema.optional(),
	transfer: TransferSchema.optional(),
	webhook_success: z
		.string()
		.optional()
		.describe('Placid POSTs the finished image object to this URL.'),
	create_now: z
		.boolean()
		.optional()
		.describe(
			'render immediately instead of queueing. Placid allows 10 simultaneous calls this way; past that the call can fail.',
		),
	passthrough: PassthroughSchema.optional(),
});

export type ImagesCreateInput = z.input<typeof ImagesCreateInputSchema>;

const ImagesCreateResponseSchema = ImageResultSchema;
export type ImagesCreateResponse = z.infer<typeof ImagesCreateResponseSchema>;

const ImagesGetInputSchema = z.object({
	id: z.number().int().describe('The image id from the create reply.'),
});
export type ImagesGetInput = z.input<typeof ImagesGetInputSchema>;

const ImagesGetResponseSchema = ImageResultSchema;
export type ImagesGetResponse = z.infer<typeof ImagesGetResponseSchema>;

const ImagesDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type ImagesDeleteInput = z.input<typeof ImagesDeleteInputSchema>;

const ImagesDeleteResponseSchema = z.object({
	success: z.literal(true),
	id: z.number(),
});
export type ImagesDeleteResponse = z.infer<typeof ImagesDeleteResponseSchema>;

// ── pdfs ──────────────────────────────────────────────────────────────────

const PdfPageSchema = z.object({
	template_uuid: z.string().min(1),
	layers: LayersSchema.optional(),
});

const PdfsCreateInputSchema = z.object({
	pages: z
		.array(PdfPageSchema)
		.min(1)
		.describe('One template per page, merged in the order given.'),
	modifications: ModificationsSchema.optional(),
	transfer: TransferSchema.optional(),
	webhook_success: z.string().optional(),
	passthrough: PassthroughSchema.optional(),
});
export type PdfsCreateInput = z.input<typeof PdfsCreateInputSchema>;

const PdfsCreateResponseSchema = PdfResultSchema;
export type PdfsCreateResponse = z.infer<typeof PdfsCreateResponseSchema>;

const PdfsMergeInputSchema = z.object({
	urls: z
		.array(z.string())
		.min(2)
		.max(10)
		.describe('Publicly reachable PDF URLs to merge, in order.'),
	transfer: TransferSchema.optional(),
	webhook_success: z.string().optional(),
	passthrough: PassthroughSchema.optional(),
});
export type PdfsMergeInput = z.input<typeof PdfsMergeInputSchema>;

const PdfsMergeResponseSchema = PdfResultSchema;
export type PdfsMergeResponse = z.infer<typeof PdfsMergeResponseSchema>;

const PdfsGetInputSchema = z.object({ id: z.number().int() });
export type PdfsGetInput = z.input<typeof PdfsGetInputSchema>;

const PdfsGetResponseSchema = PdfResultSchema;
export type PdfsGetResponse = z.infer<typeof PdfsGetResponseSchema>;

const PdfsDeleteInputSchema = z.object({ id: z.number().int() });
export type PdfsDeleteInput = z.input<typeof PdfsDeleteInputSchema>;

const PdfsDeleteResponseSchema = z.object({
	success: z.literal(true),
	id: z.number(),
});
export type PdfsDeleteResponse = z.infer<typeof PdfsDeleteResponseSchema>;

// ── videos ────────────────────────────────────────────────────────────────

const VideoClipSchema = z.object({
	template_uuid: z.string().min(1),
	layers: LayersSchema.optional(),
	audio: z.string().optional().describe('An mp3 URL for this clip.'),
	audio_duration: z
		.enum(['auto', 'full'])
		.optional()
		.describe(
			'`auto` trims the audio to the clip length; `full` (the default) keeps it whole.',
		),
	audio_trim_start: z
		.string()
		.optional()
		.describe('Trim start, such as `00:00:45` or `00:00:45.25`.'),
	audio_trim_end: z
		.string()
		.optional()
		.describe('Trim end, such as `00:00:55` or `00:00:55.25`.'),
});

const VideoModificationsSchema = z
	.object({
		format: z.literal('mp4').optional(),
		width: z.union([z.string(), z.number()]).optional(),
		height: z.union([z.string(), z.number()]).optional(),
		canvas_background: z
			.string()
			.optional()
			.describe('A hex colour, or `blur` to blur the first clip behind clips.'),
		fps: z.number().int().min(1).max(30).optional().describe('Defaults to 25.'),
		filename: z.string().optional(),
	})
	.describe('Video output settings.');

const VideosCreateInputSchema = z.object({
	clips: z
		.array(VideoClipSchema)
		.min(1)
		.describe(
			'One template per clip, played in order. The whole video is capped at 3 minutes.',
		),
	modifications: VideoModificationsSchema.optional(),
	transfer: TransferSchema.optional(),
	webhook_success: z.string().optional(),
	passthrough: PassthroughSchema.optional(),
});
export type VideosCreateInput = z.input<typeof VideosCreateInputSchema>;

const VideosCreateResponseSchema = VideoResultSchema;
export type VideosCreateResponse = z.infer<typeof VideosCreateResponseSchema>;

const VideosGetInputSchema = z.object({ id: z.number().int() });
export type VideosGetInput = z.input<typeof VideosGetInputSchema>;

const VideosGetResponseSchema = VideoResultSchema;
export type VideosGetResponse = z.infer<typeof VideosGetResponseSchema>;

const VideosDeleteInputSchema = z.object({ id: z.number().int() });
export type VideosDeleteInput = z.input<typeof VideosDeleteInputSchema>;

const VideosDeleteResponseSchema = z.object({
	success: z.literal(true),
	id: z.number(),
});
export type VideosDeleteResponse = z.infer<typeof VideosDeleteResponseSchema>;

// ── templates ─────────────────────────────────────────────────────────────

// The layers Placid reports are `dynamic` ones: name plus type, which is what a
// caller needs to fill them in.
const TemplateLayerSchema = z
	.object({
		name: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const TemplateSchema = z
	.object({
		uuid: z.string(),
		title: z.string().nullish(),
		thumbnail: z
			.string()
			.nullish()
			.describe('Null while Placid regenerates the preview.'),
		tags: z.array(z.string()).nullish(),
		layers: z.array(TemplateLayerSchema).nullish(),
		custom_data: z
			.union([
				z.string(),
				z.record(z.string(), CallerJsonValueSchema),
				CallerJsonArraySchema,
			])
			.nullish()
			.describe('The reference value set on the template, if any.'),
		width: z.number().nullish(),
		height: z.number().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type PlacidTemplate = z.infer<typeof TemplateSchema>;

const TemplatesListInputSchema = z.object({
	collection_id: z
		.string()
		.optional()
		.describe('Only templates in this collection.'),
	title_filter: z
		.string()
		.optional()
		.describe('Only templates whose title matches.'),
	tag: z
		.string()
		.optional()
		.describe(
			'Only templates with this tag. Nested tags match too: `social` also returns `social/instagram`.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'`<field>-<direction>`, where field is `created_at`, `updated_at` or `title` and direction is `asc` or `desc`.',
		),
	// Placid pages by opaque cursor, not by page number, and its own reply
	// carries the next one. Verified live: the list is 20 per page with no
	// `per_page` parameter, and `links.next` holds a `?cursor=<token>` URL.
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Pass `links.next` from the previous page (the whole URL or just its `cursor` value) to read the next 20 templates. Null on the last page.',
		),
});
export type TemplatesListInput = z.input<typeof TemplatesListInputSchema>;

const TemplatesListResponseSchema = z
	.object({
		data: z.array(TemplateSchema),
		links: PaginationLinksSchema.nullish(),
		meta: PaginationMetaSchema.nullish(),
	})
	.loose();
export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

const TemplatesCreateInputSchema = z.object({
	title: z.string().min(1),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
	tags: z.array(z.string()).max(10).optional(),
	custom_data: z
		.union([z.string().max(255), z.record(z.string(), CallerJsonValueSchema)])
		.optional()
		.describe('A reference value, such as a serialized JSON object.'),
	from_template: z
		.string()
		.optional()
		.describe(
			'Duplicate this template UUID. Overrides `title`, `width` and `height` with the source values.',
		),
	add_to_collections: z.array(z.string()).optional(),
});
export type TemplatesCreateInput = z.input<typeof TemplatesCreateInputSchema>;

const TemplatesCreateResponseSchema = TemplateSchema;
export type TemplatesCreateResponse = z.infer<
	typeof TemplatesCreateResponseSchema
>;

const TemplatesGetInputSchema = z.object({ template_uuid: z.string().min(1) });
export type TemplatesGetInput = z.input<typeof TemplatesGetInputSchema>;

const TemplatesGetResponseSchema = TemplateSchema;
export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

const TemplatesUpdateInputSchema = z.object({
	template_uuid: z.string().min(1),
	title: z.string().optional(),
	tags: z.array(z.string()).max(10).optional(),
	custom_data: z
		.union([
			z.string().max(255),
			z.record(z.string(), CallerJsonValueSchema),
			z.null(),
		])
		.optional(),
});
export type TemplatesUpdateInput = z.input<typeof TemplatesUpdateInputSchema>;

const TemplatesUpdateResponseSchema = TemplateSchema;
export type TemplatesUpdateResponse = z.infer<
	typeof TemplatesUpdateResponseSchema
>;

const TemplatesDeleteInputSchema = z.object({
	template_uuid: z.string().min(1),
});
export type TemplatesDeleteInput = z.input<typeof TemplatesDeleteInputSchema>;

const TemplatesDeleteResponseSchema = z.object({
	success: z.literal(true),
	template_uuid: z.string(),
});
export type TemplatesDeleteResponse = z.infer<
	typeof TemplatesDeleteResponseSchema
>;

// ── collections ───────────────────────────────────────────────────────────

const CollectionSchema = z
	.object({
		id: z.string(),
		title: z.string().nullish(),
		custom_data: z
			.union([
				z.string(),
				z.record(z.string(), CallerJsonValueSchema),
				CallerJsonArraySchema,
			])
			.nullish(),
		// The docs call this `template_uuids`, but the API answers `templates`
		// with a plain array of UUID strings (checked against the live API).
		// Both are read so a future fix on either side cannot break a call.
		templates: z
			.array(z.string())
			.nullish()
			.describe('The UUIDs of the templates in this collection.'),
		template_uuids: z
			.array(z.string())
			.nullish()
			.describe('Deprecated alias. The API returns `templates`.'),
	})
	.loose();

export type PlacidCollection = z.infer<typeof CollectionSchema>;

const CollectionsListInputSchema = z.object({
	per_page: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Page size. Omitted returns every collection, unpaged.'),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Pass `links.next` from the previous page (the whole URL or just its `cursor` value). Omitted returns every collection, unpaged.',
		),
});
export type CollectionsListInput = z.input<typeof CollectionsListInputSchema>;

const CollectionsListResponseSchema = z
	.object({
		data: z.array(CollectionSchema),
		links: PaginationLinksSchema.nullish(),
		meta: PaginationMetaSchema.nullish(),
	})
	.loose();
export type CollectionsListResponse = z.infer<
	typeof CollectionsListResponseSchema
>;

const CollectionsCreateInputSchema = z.object({
	title: z.string().min(1).max(255),
	custom_data: z
		.union([z.string().max(1024), z.record(z.string(), CallerJsonValueSchema)])
		.optional(),
	template_uuids: z.array(z.string()).max(500).optional(),
});
export type CollectionsCreateInput = z.input<
	typeof CollectionsCreateInputSchema
>;

const CollectionsCreateResponseSchema = CollectionSchema;
export type CollectionsCreateResponse = z.infer<
	typeof CollectionsCreateResponseSchema
>;

const CollectionsGetInputSchema = z.object({
	collection_id: z.string().min(1),
});
export type CollectionsGetInput = z.input<typeof CollectionsGetInputSchema>;

const CollectionsGetResponseSchema = CollectionSchema;
export type CollectionsGetResponse = z.infer<
	typeof CollectionsGetResponseSchema
>;

const CollectionsUpdateInputSchema = z.object({
	collection_id: z.string().min(1),
	title: z.string().max(255).optional(),
	custom_data: z
		.union([
			z.string().max(1024),
			z.record(z.string(), CallerJsonValueSchema),
			z.null(),
		])
		.optional(),
	template_uuids: z
		.array(z.string())
		.max(500)
		.optional()
		.describe('Replaces the whole list of templates in the collection.'),
	add_template_uuids: z
		.array(z.string())
		.optional()
		.describe('Adds these templates, keeping the existing ones.'),
	remove_template_uuids: z
		.array(z.string())
		.optional()
		.describe('Removes these templates.'),
});
export type CollectionsUpdateInput = z.input<
	typeof CollectionsUpdateInputSchema
>;

const CollectionsUpdateResponseSchema = CollectionSchema;
export type CollectionsUpdateResponse = z.infer<
	typeof CollectionsUpdateResponseSchema
>;

const CollectionsDeleteInputSchema = z.object({
	collection_id: z.string().min(1),
});
export type CollectionsDeleteInput = z.input<
	typeof CollectionsDeleteInputSchema
>;

const CollectionsDeleteResponseSchema = z.object({
	success: z.literal(true),
	collection_id: z.string(),
});
export type CollectionsDeleteResponse = z.infer<
	typeof CollectionsDeleteResponseSchema
>;

// ── media ─────────────────────────────────────────────────────────────────

const MediaUploadInputSchema = z.object({
	file_url: z
		.string()
		.describe(
			'A publicly reachable HTTP(S) URL. The plugin downloads it and forwards the bytes as multipart. Private addresses are rejected, and the download is capped at 25 MB.',
		),
	filename: z.string().optional().describe('Overrides the name from the URL.'),
	file_key: z
		.string()
		.optional()
		.describe('The key the reply is filed under. Defaults to `file`.'),
});
export type MediaUploadInput = z.input<typeof MediaUploadInputSchema>;

const MediaUploadResponseSchema = z
	.object({
		media: z.array(
			z
				.object({
					file_key: z.string().nullish(),
					file_id: z
						.string()
						.nullish()
						.describe('The Placid URL to fill into a picture layer.'),
				})
				.loose(),
		),
	})
	.loose();
export type MediaUploadResponse = z.infer<typeof MediaUploadResponseSchema>;

// ── fonts ─────────────────────────────────────────────────────────────────

const FontSchema = z
	.object({
		uuid: z
			.string()
			.describe('The font code. Use it as the `font` value on a text layer.'),
		title: z.string().nullish(),
		filename: z.string().nullish(),
		is_legacy: z.boolean().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

export type PlacidFont = z.infer<typeof FontSchema>;

const FontsListInputSchema = z.object({
	include_legacy: z
		.boolean()
		.optional()
		.describe(
			'Also return account-wide fonts uploaded before per-project fonts.',
		),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Pass `links.next` from the previous page (the whole URL or just its `cursor` value) to read the next 20 fonts.',
		),
});
export type FontsListInput = z.input<typeof FontsListInputSchema>;

const FontsListResponseSchema = z
	.object({
		data: z.array(FontSchema),
		links: PaginationLinksSchema.nullish(),
		meta: PaginationMetaSchema.nullish(),
	})
	.loose();
export type FontsListResponse = z.infer<typeof FontsListResponseSchema>;

const FontsGetInputSchema = z.object({
	uuid: z.string().min(1),
	include_legacy: z.boolean().optional(),
});
export type FontsGetInput = z.input<typeof FontsGetInputSchema>;

const FontsGetResponseSchema = FontSchema;
export type FontsGetResponse = z.infer<typeof FontsGetResponseSchema>;

const FontsCreateInputSchema = z.object({
	file_url: z
		.string()
		.describe(
			'A publicly reachable ttf, otf, woff or woff2 file over HTTP(S). Private addresses are rejected, and the download is capped at 25 MB.',
		),
	title: z
		.string()
		.max(200)
		.optional()
		.describe('Display title. Defaults to the filename.'),
	terms_accepted: z
		.literal(true)
		.describe(
			'You must confirm you own the font or hold a licence to use it. Placid rejects the upload without it.',
		),
	filename: z.string().optional(),
});
export type FontsCreateInput = z.input<typeof FontsCreateInputSchema>;

const FontsCreateResponseSchema = FontSchema;
export type FontsCreateResponse = z.infer<typeof FontsCreateResponseSchema>;

const FontsUpdateInputSchema = z.object({
	uuid: z.string().min(1),
	title: z.string().min(1).max(200),
});
export type FontsUpdateInput = z.input<typeof FontsUpdateInputSchema>;

const FontsUpdateResponseSchema = FontSchema;
export type FontsUpdateResponse = z.infer<typeof FontsUpdateResponseSchema>;

const FontsDeleteInputSchema = z.object({
	uuid: z.string().min(1),
	force: z
		.boolean()
		.optional()
		.describe(
			'Delete even when templates still reference the font. Those templates fall back to the default font on their next render.',
		),
});
export type FontsDeleteInput = z.input<typeof FontsDeleteInputSchema>;

const FontsDeleteResponseSchema = z.object({
	success: z.literal(true),
	uuid: z.string(),
});
export type FontsDeleteResponse = z.infer<typeof FontsDeleteResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PlacidEndpointInputs = {
	imagesCreate: ImagesCreateInput;
	imagesGet: ImagesGetInput;
	imagesDelete: ImagesDeleteInput;
	pdfsCreate: PdfsCreateInput;
	pdfsMerge: PdfsMergeInput;
	pdfsGet: PdfsGetInput;
	pdfsDelete: PdfsDeleteInput;
	videosCreate: VideosCreateInput;
	videosGet: VideosGetInput;
	videosDelete: VideosDeleteInput;
	templatesList: TemplatesListInput;
	templatesCreate: TemplatesCreateInput;
	templatesGet: TemplatesGetInput;
	templatesUpdate: TemplatesUpdateInput;
	templatesDelete: TemplatesDeleteInput;
	collectionsList: CollectionsListInput;
	collectionsCreate: CollectionsCreateInput;
	collectionsGet: CollectionsGetInput;
	collectionsUpdate: CollectionsUpdateInput;
	collectionsDelete: CollectionsDeleteInput;
	mediaUpload: MediaUploadInput;
	fontsList: FontsListInput;
	fontsGet: FontsGetInput;
	fontsCreate: FontsCreateInput;
	fontsUpdate: FontsUpdateInput;
	fontsDelete: FontsDeleteInput;
};

export type PlacidEndpointOutputs = {
	imagesCreate: ImagesCreateResponse;
	imagesGet: ImagesGetResponse;
	imagesDelete: ImagesDeleteResponse;
	pdfsCreate: PdfsCreateResponse;
	pdfsMerge: PdfsMergeResponse;
	pdfsGet: PdfsGetResponse;
	pdfsDelete: PdfsDeleteResponse;
	videosCreate: VideosCreateResponse;
	videosGet: VideosGetResponse;
	videosDelete: VideosDeleteResponse;
	templatesList: TemplatesListResponse;
	templatesCreate: TemplatesCreateResponse;
	templatesGet: TemplatesGetResponse;
	templatesUpdate: TemplatesUpdateResponse;
	templatesDelete: TemplatesDeleteResponse;
	collectionsList: CollectionsListResponse;
	collectionsCreate: CollectionsCreateResponse;
	collectionsGet: CollectionsGetResponse;
	collectionsUpdate: CollectionsUpdateResponse;
	collectionsDelete: CollectionsDeleteResponse;
	mediaUpload: MediaUploadResponse;
	fontsList: FontsListResponse;
	fontsGet: FontsGetResponse;
	fontsCreate: FontsCreateResponse;
	fontsUpdate: FontsUpdateResponse;
	fontsDelete: FontsDeleteResponse;
};

export const PlacidEndpointInputSchemas = {
	imagesCreate: ImagesCreateInputSchema,
	imagesGet: ImagesGetInputSchema,
	imagesDelete: ImagesDeleteInputSchema,
	pdfsCreate: PdfsCreateInputSchema,
	pdfsMerge: PdfsMergeInputSchema,
	pdfsGet: PdfsGetInputSchema,
	pdfsDelete: PdfsDeleteInputSchema,
	videosCreate: VideosCreateInputSchema,
	videosGet: VideosGetInputSchema,
	videosDelete: VideosDeleteInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
	collectionsList: CollectionsListInputSchema,
	collectionsCreate: CollectionsCreateInputSchema,
	collectionsGet: CollectionsGetInputSchema,
	collectionsUpdate: CollectionsUpdateInputSchema,
	collectionsDelete: CollectionsDeleteInputSchema,
	mediaUpload: MediaUploadInputSchema,
	fontsList: FontsListInputSchema,
	fontsGet: FontsGetInputSchema,
	fontsCreate: FontsCreateInputSchema,
	fontsUpdate: FontsUpdateInputSchema,
	fontsDelete: FontsDeleteInputSchema,
} as const;

export const PlacidEndpointOutputSchemas = {
	imagesCreate: ImagesCreateResponseSchema,
	imagesGet: ImagesGetResponseSchema,
	imagesDelete: ImagesDeleteResponseSchema,
	pdfsCreate: PdfsCreateResponseSchema,
	pdfsMerge: PdfsMergeResponseSchema,
	pdfsGet: PdfsGetResponseSchema,
	pdfsDelete: PdfsDeleteResponseSchema,
	videosCreate: VideosCreateResponseSchema,
	videosGet: VideosGetResponseSchema,
	videosDelete: VideosDeleteResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesCreate: TemplatesCreateResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesUpdate: TemplatesUpdateResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
	collectionsList: CollectionsListResponseSchema,
	collectionsCreate: CollectionsCreateResponseSchema,
	collectionsGet: CollectionsGetResponseSchema,
	collectionsUpdate: CollectionsUpdateResponseSchema,
	collectionsDelete: CollectionsDeleteResponseSchema,
	mediaUpload: MediaUploadResponseSchema,
	fontsList: FontsListResponseSchema,
	fontsGet: FontsGetResponseSchema,
	fontsCreate: FontsCreateResponseSchema,
	fontsUpdate: FontsUpdateResponseSchema,
	fontsDelete: FontsDeleteResponseSchema,
} as const;
