import { z } from 'zod';

// Inputs use Renderform's own parameter names. Outputs are `.loose()` and the
// documented optionals nullish, so a field Renderform adds or omits cannot fail a
// call that has already happened. Shapes come from the OpenAPI document at
// https://api.renderform.io/openapi/docs and the guides at
// https://renderform.io/docs/api/.
//
// Two things worth knowing before reading the models:
//
// - The API is on two versions at once: `/api/v2` for templates, renders and
//   results, and `/api/v1` for usage and fonts. The plugin keeps each path as it
//   is rather than pretending one version covers everything.
// - A render is usually synchronous, but a video render is asynchronous and
//   answers `202` with `status: "pending"`, so `href` is not usable yet. The
//   output model says which, and the operation describes the polling.

/** The output formats a render accepts. */
export const RENDERFORM_OUTPUT_FORMATS = [
	'jpeg',
	'png',
	'webp',
	'pdf',
	'mp4',
	'webm',
] as const;

/** The editors a template can be created in. */
export const RENDERFORM_EDITORS = [
	'html-editor',
	'canvas-editor',
	'canvas-html',
] as const;

/** Video frames per second. The spec types these as strings, and they are sent as such. */
export const RENDERFORM_FPS = ['24', '25', '30'] as const;

/** The PDF page formats. */
export const RENDERFORM_PDF_FORMATS = [
	'A5',
	'A4',
	'A3',
	'LETTER',
	'LEGAL',
] as const;

/**
 * A JSON value. Used where a field's shape belongs to the caller's template data
 * or sample values, so it is described as JSON rather than `unknown`, which would
 * reach the docs as `any`.
 */
export type RenderformJsonValue =
	| string
	| number
	| boolean
	| null
	| RenderformJsonValue[]
	| { [key: string]: RenderformJsonValue };

const JsonValueSchema: z.ZodType<RenderformJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

// ── render ────────────────────────────────────────────────────────────────

/**
 * The render payload.
 *
 * `data` is keyed by the template's merge fields, which look like
 * `my-text.text`: the component name, a dot, then the property. `version` is a
 * cache key rather than a revision, so the same `version` with the same data
 * returns the cached file and costs no credits.
 */
const RenderInputSchema = z.object({
	template: z
		.string()
		.min(1)
		.describe('The template identifier, such as template_1234.'),
	data: JsonObjectSchema.optional().describe(
		'Values keyed by the template\'s merge fields, such as {"my-text.text": "John"}. A component\'s own defaults fill anything omitted.',
	),
	fileName: z
		.string()
		.optional()
		.describe('The output file name, without an extension.'),
	webhookUrl: z
		.string()
		.optional()
		.describe('Called when the render finishes, which suits a video render.'),
	version: z
		.string()
		.optional()
		.describe(
			'The cache key. The same version with the same data returns the cached file and costs no credits.',
		),
	metadata: JsonObjectSchema.optional().describe(
		'Extra data passed through to the webhook.',
	),
	batchName: z
		.string()
		.optional()
		.describe(
			'Groups renders together, and can be filtered on in results.list.',
		),
	cache: z
		.boolean()
		.optional()
		.describe(
			'Defaults to true. False forces a fresh render and skips the cache, which costs credits.',
		),
	width: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'Output width in pixels. Renderform crops the image to it from the top left corner.',
		),
	height: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'Output height in pixels. Renderform crops the image to it from the top left corner.',
		),
	waitTime: z
		.number()
		.int()
		.min(0)
		.max(5000)
		.optional()
		.describe('Milliseconds to wait before rendering. At most 5000.'),
	outputFormat: z
		.enum(RENDERFORM_OUTPUT_FORMATS)
		.optional()
		.describe(
			"Overrides the template's format. A video format needs a template made in the Advanced Editor and always renders asynchronously.",
		),
	duration: z
		.number()
		.int()
		.min(1000)
		.max(30000)
		.optional()
		.describe(
			'Video renders only: length in milliseconds. Every started second costs 5 credits.',
		),
	fps: z
		.enum(RENDERFORM_FPS)
		.optional()
		.describe('Video renders only, and sent as a string: 24, 25 or 30.'),
});

export type RenderInput = z.infer<typeof RenderInputSchema>;

/**
 * A render answer.
 *
 * `status` is present only for an asynchronous video render: `pending` means
 * `href` is not available yet and `results.get` must be polled until it is `done`
 * or `failed`. `cached: true` means the file was already rendered, was returned
 * from the cache, and cost no credits.
 */
const RenderResponseSchema = z
	.object({
		requestId: z
			.string()
			.nullish()
			.describe('Identifies the render, and is what results.get takes.'),
		href: z
			.string()
			.nullish()
			.describe('The rendered file. Not usable yet when status is pending.'),
		status: z
			.string()
			.nullish()
			.describe(
				'pending, done or failed. Present only for an asynchronous video render.',
			),
		cached: z
			.boolean()
			.nullish()
			.describe(
				'True when the file came from the cache, which costs no credits.',
			),
	})
	.loose();

export type RenderResponse = z.infer<typeof RenderResponseSchema>;

// ── templates ─────────────────────────────────────────────────────────────

/** A template's metadata, as the list and get routes return it. */
export const TemplateSchema = z
	.object({
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		preview: z.string().nullish().describe('The last rendered preview image.'),
		scaleFactor: z.number().nullish(),
		outputFormat: z.string().nullish(),
		outputExtension: z.string().nullish(),
		quality: z.number().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		tags: z.array(z.string()).nullish(),
		editor: z
			.string()
			.nullish()
			.describe('html-editor, canvas-editor or canvas-html.'),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type RenderformTemplate = z.infer<typeof TemplateSchema>;

const TemplatesListInputSchema = z.object({
	name: z.string().optional().describe('Only templates whose name matches.'),
	tags: z
		.array(z.string())
		.min(1)
		.optional()
		.describe('Only templates with these tags.'),
	sourceTemplateId: z
		.string()
		.optional()
		.describe('Only templates created from this source template.'),
	page: z.number().int().min(0).optional().describe('0-based page number.'),
	size: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Page size, at most 50.'),
});

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

// The template list answers a bare array, not a page.
const TemplatesListResponseSchema = z.array(TemplateSchema);

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

const TemplateGetInputSchema = z.object({
	templateId: z.string().min(1),
});

export type TemplateGetInput = z.infer<typeof TemplateGetInputSchema>;

const TemplateGetResponseSchema = TemplateSchema;

export type TemplateGetResponse = z.infer<typeof TemplateGetResponseSchema>;

const TemplateCreateInputSchema = z.object({
	name: z.string().min(1),
	width: z.number().int().positive().describe('Pixels.'),
	height: z.number().int().positive().describe('Pixels.'),
	editor: z.enum(RENDERFORM_EDITORS),
	tags: z
		.array(z.string())
		.optional()
		.describe('Created automatically when a tag does not exist yet.'),
	outputFormat: z
		.enum(RENDERFORM_OUTPUT_FORMATS)
		.optional()
		.describe('Defaults to jpeg. A video format needs the canvas-html editor.'),
	recordDuration: z
		.number()
		.int()
		.min(1000)
		.max(30000)
		.optional()
		.describe(
			'Video templates only: timeline length in milliseconds. Defaults to 5000.',
		),
	fps: z
		.enum(RENDERFORM_FPS)
		.optional()
		.describe('Video templates only, sent as a string. Defaults to 30.'),
});

export type TemplateCreateInput = z.infer<typeof TemplateCreateInputSchema>;

const TemplateCreateResponseSchema = TemplateSchema;

export type TemplateCreateResponse = z.infer<
	typeof TemplateCreateResponseSchema
>;

const TemplateUpdateInputSchema = z.object({
	templateId: z.string().min(1),
	name: z.string().min(1).optional(),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
	tags: z
		.array(z.string())
		.optional()
		.describe('Replaces the whole set of tags, it does not merge into it.'),
	outputFormat: z.enum(RENDERFORM_OUTPUT_FORMATS).optional(),
});

export type TemplateUpdateInput = z.infer<typeof TemplateUpdateInputSchema>;

const TemplateUpdateResponseSchema = TemplateSchema;

export type TemplateUpdateResponse = z.infer<
	typeof TemplateUpdateResponseSchema
>;

const TemplateDeleteInputSchema = z.object({
	templateId: z.string().min(1),
});

export type TemplateDeleteInput = z.infer<typeof TemplateDeleteInputSchema>;

const EmptyResponseSchema = z.object({}).loose();

export type EmptyResponse = z.infer<typeof EmptyResponseSchema>;

// ── template content (html-editor only) ───────────────────────────────────

const TemplateContentInputSchema = z.object({
	templateId: z.string().min(1),
});

export type TemplateContentInput = z.infer<typeof TemplateContentInputSchema>;

/**
 * The raw content of an html-editor template. `sampleData` holds the values used
 * to preview the merge fields, so it is a useful reference for what `data` a
 * render should carry.
 */
const TemplateContentSchema = z
	.object({
		html: z.string().nullish(),
		css: z.string().nullish(),
		sampleData: JsonObjectSchema.nullish(),
	})
	.loose();

export type TemplateContent = z.infer<typeof TemplateContentSchema>;

const TemplateContentGetResponseSchema = TemplateContentSchema;

export type TemplateContentGetResponse = z.infer<
	typeof TemplateContentGetResponseSchema
>;

const TemplateContentUpdateInputSchema = z.object({
	templateId: z.string().min(1),
	html: z
		.string()
		.min(1)
		.describe('Only supported for a template using the html-editor.'),
	css: z.string().optional(),
	sampleData: JsonObjectSchema.optional(),
});

export type TemplateContentUpdateInput = z.infer<
	typeof TemplateContentUpdateInputSchema
>;

const TemplateContentUpdateResponseSchema = TemplateContentSchema;

export type TemplateContentUpdateResponse = z.infer<
	typeof TemplateContentUpdateResponseSchema
>;

// ── results ───────────────────────────────────────────────────────────────

/** One render result, as a list row. */
const RenderResultItemSchema = z
	.object({
		identifier: z.string().nullish(),
		href: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		templateName: z.string().nullish(),
		templateIdentifier: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

/** A Spring-style page: `content` holds the rows. */
const ResultsListResponseSchema = z
	.object({
		content: z.array(RenderResultItemSchema).nullish(),
		totalElements: z.number().nullish(),
		totalPages: z.number().nullish(),
		size: z.number().nullish(),
		number: z.number().nullish(),
		numberOfElements: z.number().nullish(),
		first: z.boolean().nullish(),
		last: z.boolean().nullish(),
		empty: z.boolean().nullish(),
	})
	.loose();

export type ResultsListResponse = z.infer<typeof ResultsListResponseSchema>;

const ResultsListInputSchema = z.object({
	template: z.string().optional().describe('Only renders of this template.'),
	batch: z.string().optional().describe('Only renders in this batch.'),
	page: z.number().int().min(0).optional(),
	size: z.number().int().min(1).max(50).optional().describe('At most 50.'),
});

export type ResultsListInput = z.infer<typeof ResultsListInputSchema>;

const ResultGetInputSchema = z.object({
	identifier: z
		.string()
		.min(1)
		.describe('The requestId a render answered with.'),
});

export type ResultGetInput = z.infer<typeof ResultGetInputSchema>;

/**
 * One render's detail. `status` is `pending` while a video renders, `done` when the
 * file is at `href`, and `failed` otherwise; `thumbnailHref` is a video's poster
 * frame.
 */
const ResultGetResponseSchema = z
	.object({
		identifier: z.string().nullish(),
		href: z.string().nullish(),
		status: z.string().nullish().describe('pending, done or failed.'),
		type: z.string().nullish().describe('image, video, screenshot or preview.'),
		thumbnailHref: z
			.string()
			.nullish()
			.describe("A video's JPEG poster frame, null otherwise."),
	})
	.loose();

export type ResultGetResponse = z.infer<typeof ResultGetResponseSchema>;

const ResultDeleteInputSchema = z.object({
	identifier: z.string().min(1),
});

export type ResultDeleteInput = z.infer<typeof ResultDeleteInputSchema>;

// ── screenshots and pdf ───────────────────────────────────────────────────

const ScreenshotInputSchema = z.object({
	url: z.string().min(1).describe('The page to capture.'),
	width: z.number().int().min(32).max(5000),
	height: z.number().int().min(32).max(5000),
	waitTime: z
		.number()
		.int()
		.min(0)
		.max(5000)
		.optional()
		.describe('Milliseconds to wait before capturing. At most 5000.'),
});

export type ScreenshotInput = z.infer<typeof ScreenshotInputSchema>;

const ScreenshotResponseSchema = z
	.object({
		requestId: z.string().nullish(),
		href: z.string().nullish(),
		request: z.record(z.string(), JsonValueSchema).nullish(),
	})
	.loose();

export type ScreenshotResponse = z.infer<typeof ScreenshotResponseSchema>;

const PdfInputSchema = z.object({
	url: z.string().min(1).describe('The page to capture.'),
	format: z.enum(RENDERFORM_PDF_FORMATS).optional().describe('Defaults to A4.'),
	expires: z
		.number()
		.int()
		.min(1)
		.max(604800)
		.optional()
		.describe(
			'Delete the PDF after this many seconds, at most 604800 (7 days).',
		),
	waitTime: z.number().int().min(0).max(5000).optional(),
});

export type PdfInput = z.infer<typeof PdfInputSchema>;

const PdfResponseSchema = z
	.object({
		requestId: z.string().nullish(),
		href: z.string().nullish(),
		request: z.record(z.string(), JsonValueSchema).nullish(),
	})
	.loose();

export type PdfResponse = z.infer<typeof PdfResponseSchema>;

// ── usage and fonts ───────────────────────────────────────────────────────

const UsageInputSchema = z.object({});

const CreditsSchema = z
	.object({
		used: z.number().nullish(),
		total: z.number().nullish(),
		nextRenewalAt: z.string().nullish(),
		renewalAmount: z.number().nullish(),
	})
	.loose();

const PlanSchema = z
	.object({
		name: z.string().nullish(),
		status: z.string().nullish(),
		nextBillingAt: z.string().nullish(),
	})
	.loose();

const UsageResponseSchema = z
	.object({
		identifier: z.string().nullish(),
		credits: CreditsSchema.nullish(),
		uploads: z
			.object({ used: z.number().nullish(), total: z.number().nullish() })
			.loose()
			.nullish(),
		plan: PlanSchema.nullish(),
	})
	.loose();

export type UsageResponse = z.infer<typeof UsageResponseSchema>;

const FontsInputSchema = z.object({});

const FontSchema = z
	.object({
		originalName: z.string().nullish(),
		family: z.string().nullish(),
		variants: z.array(z.string()).nullish(),
		defaultVariant: z.string().nullish(),
		subsets: z.array(z.string()).nullish(),
		category: z.string().nullish(),
		source: z.string().nullish().describe('GOOGLE or CUSTOM.'),
		size: z.number().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

const FontsResponseSchema = z.array(FontSchema);

export type FontsResponse = z.infer<typeof FontsResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RenderformEndpointInputs = {
	render: RenderInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplateGetInput;
	templatesCreate: TemplateCreateInput;
	templatesUpdate: TemplateUpdateInput;
	templatesDelete: TemplateDeleteInput;
	templateContentGet: TemplateContentInput;
	templateContentUpdate: TemplateContentUpdateInput;
	resultsList: ResultsListInput;
	resultsGet: ResultGetInput;
	resultsDelete: ResultDeleteInput;
	screenshot: ScreenshotInput;
	pdf: PdfInput;
	usage: z.infer<typeof UsageInputSchema>;
	fonts: z.infer<typeof FontsInputSchema>;
};

export type RenderformEndpointOutputs = {
	render: RenderResponse;
	templatesList: TemplatesListResponse;
	templatesGet: TemplateGetResponse;
	templatesCreate: TemplateCreateResponse;
	templatesUpdate: TemplateUpdateResponse;
	templatesDelete: EmptyResponse;
	templateContentGet: TemplateContentGetResponse;
	templateContentUpdate: TemplateContentUpdateResponse;
	resultsList: ResultsListResponse;
	resultsGet: ResultGetResponse;
	resultsDelete: EmptyResponse;
	screenshot: ScreenshotResponse;
	pdf: PdfResponse;
	usage: UsageResponse;
	fonts: FontsResponse;
};

export const RenderformEndpointInputSchemas = {
	render: RenderInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplateGetInputSchema,
	templatesCreate: TemplateCreateInputSchema,
	templatesUpdate: TemplateUpdateInputSchema,
	templatesDelete: TemplateDeleteInputSchema,
	templateContentGet: TemplateContentInputSchema,
	templateContentUpdate: TemplateContentUpdateInputSchema,
	resultsList: ResultsListInputSchema,
	resultsGet: ResultGetInputSchema,
	resultsDelete: ResultDeleteInputSchema,
	screenshot: ScreenshotInputSchema,
	pdf: PdfInputSchema,
	usage: UsageInputSchema,
	fonts: FontsInputSchema,
} as const;

export const RenderformEndpointOutputSchemas = {
	render: RenderResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplateGetResponseSchema,
	templatesCreate: TemplateCreateResponseSchema,
	templatesUpdate: TemplateUpdateResponseSchema,
	templatesDelete: EmptyResponseSchema,
	templateContentGet: TemplateContentGetResponseSchema,
	templateContentUpdate: TemplateContentUpdateResponseSchema,
	resultsList: ResultsListResponseSchema,
	resultsGet: ResultGetResponseSchema,
	resultsDelete: EmptyResponseSchema,
	screenshot: ScreenshotResponseSchema,
	pdf: PdfResponseSchema,
	usage: UsageResponseSchema,
	fonts: FontsResponseSchema,
} as const;
