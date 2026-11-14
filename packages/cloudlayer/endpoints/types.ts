import { z } from 'zod';

// Shapes mirror documented generation and resource operations under
// https://cloudlayer.io/docs/. Binary generation responses are represented as
// base64 artifacts because corsair/http decodes non-JSON responses as text.

// ── Shared primitives ───────────────────────────────────────────────────────

/**
 * A value inside a caller-owned map or an additional provider response field.
 *
 * These values are open JSON rather than a fixed provider model. The recursive
 * union keeps them type-safe instead of accepting arbitrary runtime values.
 */
type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

/** An open JSON object, typed as one value per key. */
const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

/** `waitUntil` strategies (https://cloudlayer.io/docs/html-to-pdf/#waituntil). */
export const WaitUntilSchema = z.enum([
	'load',
	'domcontentloaded',
	'networkidle0',
	'networkidle2',
]);

/** Paper sizes (https://cloudlayer.io/docs/html-to-pdf/#format-options). */
export const PdfFormatSchema = z.enum([
	'letter',
	'legal',
	'tabloid',
	'ledger',
	'a0',
	'a1',
	'a2',
	'a3',
	'a4',
	'a5',
	'a6',
]);

/** Output image formats (https://cloudlayer.io/docs/html-to-image/). */
export const ImageTypeSchema = z.enum(['png', 'jpg', 'jpeg', 'webp', 'svg']);

/**
 * Browser viewport configuration
 * (https://cloudlayer.io/docs/html-to-pdf/#viewport-object). Every field is
 * optional with a documented default (1440x900, DPR 1).
 */
export const ViewPortSchema = z.object({
	width: z.number().optional(),
	height: z.number().optional(),
	deviceScaleFactor: z.number().optional(),
	isMobile: z.boolean().optional(),
	hasTouch: z.boolean().optional(),
	isLandscape: z.boolean().optional(),
});

/** Element to wait for before rendering (waitForSelector object). */
export const WaitForSelectorSchema = z.object({
	selector: z.string().min(1),
	options: z
		.object({
			visible: z.boolean().optional(),
			hidden: z.boolean().optional(),
			timeout: z.number().optional(),
		})
		.optional(),
});

/** Page margins in `px`, `in`, `cm` or `mm` (margin object). */
export const MarginSchema = z.object({
	top: z.string().optional(),
	bottom: z.string().optional(),
	left: z.string().optional(),
	right: z.string().optional(),
});

/** Per-page header/footer taken from an element of the document. */
export const HeaderFooterTemplateSchema = z.object({
	selector: z.string().min(1),
	method: z.enum(['template', 'extract']).optional(),
	margin: MarginSchema.optional(),
	style: z.string().optional(),
	imageStyle: z.string().optional(),
});

/** Optional thumbnail rendered alongside a PDF (generatePreview object). */
export const GeneratePreviewSchema = z.object({
	width: z.number().optional(),
	height: z.number().optional(),
	type: z.enum(['png', 'jpg', 'webp']).optional(),
	quality: z.number().min(1).max(100).optional(),
	maintainAspectRatio: z.boolean().optional(),
});

/** HTTP Basic Authentication for a captured URL (url-to-pdf authentication). */
export const BasicAuthenticationSchema = z.object({
	username: z.string().min(1),
	password: z.string(),
});

/** A cookie injected before navigating to a URL (url-to-pdf cookies array). */
export const CookieSchema = z.object({
	name: z.string().min(1),
	value: z.string(),
	domain: z.string().optional(),
	path: z.string().optional(),
	/** Unix timestamp in seconds; omit for a session cookie. */
	expires: z.number().optional(),
	httpOnly: z.boolean().optional(),
	secure: z.boolean().optional(),
	sameSite: z.enum(['Strict', 'Lax', 'None']).optional(),
});

/** Multiple URLs merged into one multi-page document (url-to-pdf batch). */
export const UrlBatchSchema = z.object({
	urls: z.array(z.string().url()).min(1),
});

/** Parameters shared by the documented v2 generation endpoints. */
const baseGenerationFields = {
	autoScroll: z.boolean().optional(),
	delay: z.number().optional(),
	filename: z.string().optional(),
	height: z.string().optional(),
	width: z.string().optional(),
	inline: z.boolean().optional(),
	landscape: z.boolean().optional(),
	preferCSSPageSize: z.boolean().optional(),
	projectId: z.string().optional(),
	/** Documented range is 0.1 to 2. */
	scale: z.number().min(0.1).max(2).optional(),
	/** Milliseconds; the ceiling depends on the plan. */
	timeout: z.number().optional(),
	timeZone: z.string().optional(),
	viewPort: ViewPortSchema.optional(),
	waitForSelector: WaitForSelectorSchema.optional(),
	waitUntil: WaitUntilSchema.optional(),
};

/** v2 job controls; disabling storage requires synchronous (`async: false`) mode. */
const jobControlFields = {
	async: z.boolean().optional(),
	storage: z.boolean().optional(),
};

/** PDF output parameters (https://cloudlayer.io/docs/html-to-pdf/#pdf-parameters). */
const pdfFields = {
	pageRanges: z.string().optional(),
	format: PdfFormatSchema.optional(),
	margin: MarginSchema.optional(),
	printBackground: z.boolean().optional(),
	headerTemplate: HeaderFooterTemplateSchema.optional(),
	footerTemplate: HeaderFooterTemplateSchema.optional(),
};

/** Image output parameters (https://cloudlayer.io/docs/html-to-image/#image-parameters). */
const imageFields = {
	imageType: ImageTypeSchema.optional(),
	/** 1–100; applies to `jpg`, `jpeg` and `webp` only. */
	quality: z.number().int().min(1).max(100).optional(),
	transparent: z.boolean().optional(),
	trim: z.boolean().optional(),
};

/** Job statuses (https://cloudlayer.io/docs/jobs/#job-statuses). */
export const JobStatusSchema = z.enum(['pending', 'success', 'error']);

/** Output status: the documented values, or a status the provider adds later. */
const JobStatusOutputSchema = z.union([JobStatusSchema, z.string()]);

/** v2 generation routes return a job object as documented by each route. */
export const GenerationJobSchema = z
	.object({
		id: z.string(),
		status: JobStatusOutputSchema,
		// Jobs can be created through other documented generation routes on the account.
		type: z.string().optional(),
		assetUrl: z.string().optional(),
		previewUrl: z.string().optional(),
		error: z.string().optional(),
		processTime: z.number().optional(),
		size: z.number().optional(),
		timestamp: z.number().optional(),
	})
	.catchall(JsonValueSchema);

export type GenerationJob = z.infer<typeof GenerationJobSchema>;

/** JSON-safe representation of a synchronous provider file response. */
export const BinaryArtifactSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.string().min(1),
		base64: z.base64().min(1),
	})
	.strict();

export type BinaryArtifact = z.infer<typeof BinaryArtifactSchema>;

export const GenerationOutputSchema = z.union([
	GenerationJobSchema,
	BinaryArtifactSchema,
]);

export type GenerationOutput = z.infer<typeof GenerationOutputSchema>;

// ── HTML → PDF / image ──────────────────────────────────────────────────────

export const HtmlToPdfInputSchema = z
	.object({
		/** Base64-encoded HTML (https://cloudlayer.io/docs/html-to-pdf/). */
		html: z.base64().min(1),
		...baseGenerationFields,
		...pdfFields,
		generatePreview: GeneratePreviewSchema.optional(),
		...jobControlFields,
	})
	.strict()
	.refine((value) => value.storage !== false || value.async === false, {
		message: 'storage: false requires async: false',
		path: ['storage'],
	});

export type HtmlToPdfInput = z.infer<typeof HtmlToPdfInputSchema>;

export const HtmlToPdfOutputSchema = GenerationOutputSchema;

export type HtmlToPdfOutput = z.infer<typeof HtmlToPdfOutputSchema>;

export const HtmlToPdfV1InputSchema = z
	.object({
		html: z.base64().min(1),
		...baseGenerationFields,
		...pdfFields,
		generatePreview: GeneratePreviewSchema.optional(),
	})
	.strict();

export type HtmlToPdfV1Input = z.infer<typeof HtmlToPdfV1InputSchema>;

export const HtmlToPdfV1OutputSchema = BinaryArtifactSchema;

export type HtmlToPdfV1Output = z.infer<typeof HtmlToPdfV1OutputSchema>;

export const HtmlToImageInputSchema = z
	.object({
		/** Base64-encoded HTML (https://cloudlayer.io/docs/html-to-image/). */
		html: z.base64().min(1),
		...baseGenerationFields,
		...imageFields,
		...jobControlFields,
	})
	.strict()
	.refine((value) => value.storage !== false || value.async === false, {
		message: 'storage: false requires async: false',
		path: ['storage'],
	});

export type HtmlToImageInput = z.infer<typeof HtmlToImageInputSchema>;

export const HtmlToImageOutputSchema = GenerationOutputSchema;

export type HtmlToImageOutput = z.infer<typeof HtmlToImageOutputSchema>;

export const HtmlToImageV1InputSchema = z
	.object({
		html: z.base64().min(1),
		...baseGenerationFields,
		...imageFields,
	})
	.strict();

export type HtmlToImageV1Input = z.infer<typeof HtmlToImageV1InputSchema>;

export const HtmlToImageV1OutputSchema = BinaryArtifactSchema;

export type HtmlToImageV1Output = z.infer<typeof HtmlToImageV1OutputSchema>;

// ── URL → PDF / image ───────────────────────────────────────────────────────

/**
 * POST body for https://cloudlayer.io/docs/url-to-pdf/. `url` is required
 * unless `batch.urls` supplies the pages, so at least one of the two must be
 * present (the docs say `url` is ignored when `batch` is set).
 */
export const UrlToPdfInputSchema = z
	.object({
		url: z.string().url().optional(),
		authentication: BasicAuthenticationSchema.optional(),
		cookies: z.array(CookieSchema).optional(),
		batch: UrlBatchSchema.optional(),
		...baseGenerationFields,
		...pdfFields,
		generatePreview: GeneratePreviewSchema.optional(),
		...jobControlFields,
	})
	.strict()
	.refine((value) => value.url !== undefined || value.batch !== undefined, {
		message: 'Provide either url or batch.urls',
		path: ['url'],
	})
	.refine((value) => value.storage !== false || value.async === false, {
		message: 'storage: false requires async: false',
		path: ['storage'],
	});

export type UrlToPdfInput = z.infer<typeof UrlToPdfInputSchema>;

export const UrlToPdfOutputSchema = GenerationOutputSchema;

export type UrlToPdfOutput = z.infer<typeof UrlToPdfOutputSchema>;

export const UrlToPdfV1InputSchema = z
	.object({
		url: z.string().url().optional(),
		authentication: BasicAuthenticationSchema.optional(),
		cookies: z.array(CookieSchema).optional(),
		batch: UrlBatchSchema.optional(),
		...baseGenerationFields,
		...pdfFields,
		generatePreview: GeneratePreviewSchema.optional(),
	})
	.strict()
	.refine((value) => value.url !== undefined || value.batch !== undefined, {
		message: 'Provide either url or batch.urls',
		path: ['url'],
	});

export type UrlToPdfV1Input = z.infer<typeof UrlToPdfV1InputSchema>;

export const UrlToPdfV1OutputSchema = BinaryArtifactSchema;

export type UrlToPdfV1Output = z.infer<typeof UrlToPdfV1OutputSchema>;

/** Query parameters of the GET convenience route for URL → PDF. */
export const UrlToPdfQuickInputSchema = z
	.object({
		url: z.string().url(),
		timeout: z.number().optional(),
	})
	.strict();

export type UrlToPdfQuickInput = z.infer<typeof UrlToPdfQuickInputSchema>;

export const UrlToPdfQuickOutputSchema = GenerationJobSchema;

export type UrlToPdfQuickOutput = z.infer<typeof UrlToPdfQuickOutputSchema>;

export const UrlToPdfQuickV1InputSchema = UrlToPdfQuickInputSchema;

export type UrlToPdfQuickV1Input = z.infer<typeof UrlToPdfQuickV1InputSchema>;

export const UrlToPdfQuickV1OutputSchema = BinaryArtifactSchema;

export type UrlToPdfQuickV1Output = z.infer<typeof UrlToPdfQuickV1OutputSchema>;

/** POST body for https://cloudlayer.io/docs/url-to-image/. */
export const UrlToImageInputSchema = z
	.object({
		url: z.string().url(),
		authentication: BasicAuthenticationSchema.optional(),
		cookies: z.array(CookieSchema).optional(),
		...baseGenerationFields,
		...imageFields,
		...jobControlFields,
	})
	.strict()
	.refine((value) => value.storage !== false || value.async === false, {
		message: 'storage: false requires async: false',
		path: ['storage'],
	});

export type UrlToImageInput = z.infer<typeof UrlToImageInputSchema>;

export const UrlToImageOutputSchema = GenerationOutputSchema;

export type UrlToImageOutput = z.infer<typeof UrlToImageOutputSchema>;

export const UrlToImageV1InputSchema = z
	.object({
		url: z.string().url(),
		authentication: BasicAuthenticationSchema.optional(),
		cookies: z.array(CookieSchema).optional(),
		...baseGenerationFields,
		...imageFields,
	})
	.strict();

export type UrlToImageV1Input = z.infer<typeof UrlToImageV1InputSchema>;

export const UrlToImageV1OutputSchema = BinaryArtifactSchema;

export type UrlToImageV1Output = z.infer<typeof UrlToImageV1OutputSchema>;

/** Query parameters of the JSON-job GET convenience route for URL → image. */
export const UrlToImageQuickInputSchema = z
	.object({
		url: z.string().url(),
		timeout: z.number().optional(),
	})
	.strict();

export type UrlToImageQuickInput = z.infer<typeof UrlToImageQuickInputSchema>;

export const UrlToImageQuickOutputSchema = GenerationJobSchema;

export type UrlToImageQuickOutput = z.infer<typeof UrlToImageQuickOutputSchema>;

export const UrlToImageQuickV1InputSchema = UrlToImageQuickInputSchema;

export type UrlToImageQuickV1Input = z.infer<
	typeof UrlToImageQuickV1InputSchema
>;

export const UrlToImageQuickV1OutputSchema = BinaryArtifactSchema;

export type UrlToImageQuickV1Output = z.infer<
	typeof UrlToImageQuickV1OutputSchema
>;

// ── Template → PDF ──────────────────────────────────────────────────────────

/**
 * Nunjucks render data. One of `templateId` (gallery template) or `template`
 * (base64 HTML) is required and the docs forbid sending both
 * (https://cloudlayer.io/docs/template-to-pdf/#template-parameters).
 */
const TemplateMultipartInputSchema = z
	.object({
		template: z.instanceof(Blob),
		data: JsonObjectSchema,
	})
	.strict();

export const TemplateToPdfJsonInputSchema = z
	.object({
		templateId: z.string().min(1).optional(),
		template: z.base64().min(1).optional(),
		// Caller-defined render data, so each key carries a JSON value.
		data: JsonObjectSchema.optional(),
		...baseGenerationFields,
		...pdfFields,
		generatePreview: GeneratePreviewSchema.optional(),
		...jobControlFields,
	})
	.strict()
	.refine(
		(value) =>
			(value.templateId === undefined) !== (value.template === undefined),
		{
			message: 'Provide exactly one of templateId or template',
			path: ['templateId'],
		},
	)
	.refine((value) => value.storage !== false || value.async === false, {
		message: 'storage: false requires async: false',
		path: ['storage'],
	});

export const TemplateToPdfInputSchema = z.union([
	TemplateToPdfJsonInputSchema,
	TemplateMultipartInputSchema,
]);

export type TemplateToPdfInput = z.infer<typeof TemplateToPdfInputSchema>;

export const TemplateToPdfOutputSchema = GenerationOutputSchema;

export type TemplateToPdfOutput = z.infer<typeof TemplateToPdfOutputSchema>;

export const TemplateToPdfV1InputSchema = z
	.object({
		templateId: z.string().min(1).optional(),
		template: z.base64().min(1).optional(),
		data: JsonObjectSchema.optional(),
		...baseGenerationFields,
		...pdfFields,
		generatePreview: GeneratePreviewSchema.optional(),
	})
	.strict()
	.refine(
		(value) =>
			(value.templateId === undefined) !== (value.template === undefined),
		{
			message: 'Provide exactly one of templateId or template',
			path: ['templateId'],
		},
	);

export type TemplateToPdfV1Input = z.infer<typeof TemplateToPdfV1InputSchema>;

export const TemplateToPdfV1OutputSchema = BinaryArtifactSchema;

export type TemplateToPdfV1Output = z.infer<typeof TemplateToPdfV1OutputSchema>;

// ── Template → Image ─────────────────────────────────────────────────────────

export const TemplateToImageJsonInputSchema = z
	.object({
		templateId: z.string().min(1).optional(),
		template: z.base64().min(1).optional(),
		// Caller-defined render data, so each key carries a JSON value.
		data: JsonObjectSchema.optional(),
		...baseGenerationFields,
		...imageFields,
		...jobControlFields,
	})
	.strict()
	.refine(
		(value) =>
			(value.templateId === undefined) !== (value.template === undefined),
		{
			message: 'Provide exactly one of templateId or template',
			path: ['templateId'],
		},
	)
	.refine((value) => value.storage !== false || value.async === false, {
		message: 'storage: false requires async: false',
		path: ['storage'],
	});

export const TemplateToImageInputSchema = z.union([
	TemplateToImageJsonInputSchema,
	TemplateMultipartInputSchema,
]);

export type TemplateToImageInput = z.infer<typeof TemplateToImageInputSchema>;

export const TemplateToImageOutputSchema = GenerationOutputSchema;

export type TemplateToImageOutput = z.infer<typeof TemplateToImageOutputSchema>;

export const TemplateToImageV1InputSchema = z
	.object({
		templateId: z.string().min(1).optional(),
		template: z.base64().min(1).optional(),
		data: JsonObjectSchema.optional(),
		...baseGenerationFields,
		...imageFields,
	})
	.strict()
	.refine(
		(value) =>
			(value.templateId === undefined) !== (value.template === undefined),
		{
			message: 'Provide exactly one of templateId or template',
			path: ['templateId'],
		},
	);

export type TemplateToImageV1Input = z.infer<
	typeof TemplateToImageV1InputSchema
>;

export const TemplateToImageV1OutputSchema = BinaryArtifactSchema;

export type TemplateToImageV1Output = z.infer<
	typeof TemplateToImageV1OutputSchema
>;

// ── Account ─────────────────────────────────────────────────────────────────

export const AccountGetInputSchema = z.object({}).strict();

export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

/** Account usage and plan limits (https://cloudlayer.io/docs/account/). */
export const AccountGetOutputSchema = z
	.object({
		email: z.string(),
		uid: z.string(),
		subscription: z.string(),
		// Documented values, or a billing model the provider adds later.
		subType: z.union([z.enum(['limit', 'usage']), z.string()]),
		subActive: z.boolean(),
		calls: z.number(),
		callsLimit: z.number(),
		/** Only present on usage-based plans (`subType: "usage"`). */
		credit: z.number().optional(),
		bytesTotal: z.number(),
		/** Missing on the free plan. */
		bytesLimit: z.number().optional(),
		computeTimeTotal: z.number(),
		computeTimeLimit: z.number(),
		storageUsed: z.number(),
		storageLimit: z.number(),
		/** The job counters are missing until the account runs its first job. */
		totalJobs: z.number().optional(),
		successJobs: z.number().optional(),
		errorJobs: z.number().optional(),
	})
	.catchall(JsonValueSchema);

export type AccountGetOutput = z.infer<typeof AccountGetOutputSchema>;

// ── Assets ──────────────────────────────────────────────────────────────────

export const AssetsListInputSchema = z
	.object({
		/** Documented range is 1–100, default 10. */
		limit: z.number().int().min(1).max(100).optional(),
		/** Cursor: the asset ID to paginate after. */
		startAfterId: z.string().min(1).optional(),
	})
	.strict();

export type AssetsListInput = z.infer<typeof AssetsListInputSchema>;

export const AssetsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export type AssetsGetInput = z.infer<typeof AssetsGetInputSchema>;

/** A generated file (https://cloudlayer.io/docs/assets/#response-fields). */
export const AssetSchema = z
	.object({
		id: z.string(),
		/** ID of the job that produced the asset. */
		jobId: z.string().optional(),
		// Keep the extension open because image generation also accepts jpeg and svg.
		ext: z.string(),
		type: z.string(),
		size: z.number(),
		/** Pre-authenticated download URL: never log it. */
		url: z.string(),
		timestamp: z.number(),
	})
	.catchall(JsonValueSchema);

export type Asset = z.infer<typeof AssetSchema>;

/** The list route answers a bare array of the 10 most recent assets. */
export const AssetsListOutputSchema = z.array(AssetSchema);

export type AssetsListOutput = z.infer<typeof AssetsListOutputSchema>;

export const AssetsGetOutputSchema = AssetSchema;

export type AssetsGetOutput = z.infer<typeof AssetsGetOutputSchema>;

// ── Jobs ────────────────────────────────────────────────────────────────────

export const JobsListInputSchema = z
	.object({
		/** Documented range is 1–100, default 10. */
		limit: z.number().int().min(1).max(100).optional(),
		/** Cursor: the job ID to paginate after. */
		startAfterId: z.string().min(1).optional(),
	})
	.strict();

export type JobsListInput = z.infer<typeof JobsListInputSchema>;

export const JobsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export type JobsGetInput = z.infer<typeof JobsGetInputSchema>;

/** A generation job (https://cloudlayer.io/docs/jobs/#response-fields). */
export const JobSchema = z
	.object({
		id: z.string(),
		/** Owner of the job. */
		uid: z.string().optional(),
		/** Key used to create the job; never log it. */
		apiKeyUsed: z.string().optional(),
		// Same open set as GenerationJobSchema.type.
		type: z.string(),
		status: JobStatusOutputSchema,
		/** Request parameters minus the html/template body: caller-defined JSON. */
		params: JsonObjectSchema.optional(),
		size: z.number(),
		processTime: z.number(),
		apiCreditCost: z.number(),
		workerName: z.string().optional(),
		timestamp: z.number(),
	})
	.catchall(JsonValueSchema);

export type Job = z.infer<typeof JobSchema>;

/** The list route answers a bare array of the 10 most recent jobs. */
export const JobsListOutputSchema = z.array(JobSchema);

export type JobsListOutput = z.infer<typeof JobsListOutputSchema>;

export const JobsGetOutputSchema = JobSchema;

export type JobsGetOutput = z.infer<typeof JobsGetOutputSchema>;

// ── Storage ─────────────────────────────────────────────────────────────────

/** S3-compatible bucket configuration (https://cloudlayer.io/docs/storage/). */
export const StorageCreateInputSchema = z
	.object({
		title: z.string().min(1),
		bucket: z.string().min(1),
		region: z.string().min(1),
		accessKeyId: z.string().min(1),
		secretAccessKey: z.string().min(1),
		/** Omit for AWS S3; set for other S3-compatible services. */
		endpoint: z.string().min(1).optional(),
	})
	.strict();

export type StorageCreateInput = z.infer<typeof StorageCreateInputSchema>;

export const StorageCreateOutputSchema = z
	.object({
		title: z.string(),
		id: z.string(),
	})
	.catchall(JsonValueSchema);

export type StorageCreateOutput = z.infer<typeof StorageCreateOutputSchema>;

export const StorageGetCurrentInputSchema = z.object({}).strict();

export type StorageGetCurrentInput = z.infer<
	typeof StorageGetCurrentInputSchema
>;

export const StorageGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export type StorageGetInput = z.infer<typeof StorageGetInputSchema>;

/** Stored configuration with the secrets masked by the provider. */
export const StorageConfigSchema = z
	.object({
		id: z.string().optional(),
		title: z.string(),
		bucket: z.string(),
		region: z.string(),
		accessKeyId: z.string(),
		/** Masked by the API; never log it. */
		secretAccessKey: z.string(),
		endpoint: z.string().nullable().optional(),
	})
	.catchall(JsonValueSchema);

export type StorageConfig = z.infer<typeof StorageConfigSchema>;

/**
 * The docs show one object, but the live route answers a bare array of the
 * account's configurations (`[]` when none is set), so both are accepted.
 */
export const StorageGetCurrentOutputSchema = z.union([
	StorageConfigSchema,
	z.array(StorageConfigSchema),
]);

export type StorageGetCurrentOutput = z.infer<
	typeof StorageGetCurrentOutputSchema
>;

export const StorageGetOutputSchema = StorageConfigSchema;

export type StorageGetOutput = z.infer<typeof StorageGetOutputSchema>;

export const StorageRemoveInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export type StorageRemoveInput = z.infer<typeof StorageRemoveInputSchema>;

export const StorageRemoveOutputSchema = z
	.object({
		message: z.string(),
	})
	.catchall(JsonValueSchema);

export type StorageRemoveOutput = z.infer<typeof StorageRemoveOutputSchema>;

// ── Plugin endpoint input/output collections ────────────────────────────────

export type CloudlayerEndpointInputs = {
	'html.toPdf': HtmlToPdfInput;
	'html.toPdfV1': HtmlToPdfV1Input;
	'html.toImage': HtmlToImageInput;
	'html.toImageV1': HtmlToImageV1Input;
	'url.toPdf': UrlToPdfInput;
	'url.toPdfV1': UrlToPdfV1Input;
	'url.toPdfQuick': UrlToPdfQuickInput;
	'url.toPdfQuickV1': UrlToPdfQuickV1Input;
	'url.toImage': UrlToImageInput;
	'url.toImageV1': UrlToImageV1Input;
	'url.toImageQuick': UrlToImageQuickInput;
	'url.toImageQuickV1': UrlToImageQuickV1Input;
	'template.toPdf': TemplateToPdfInput;
	'template.toPdfV1': TemplateToPdfV1Input;
	'template.toImage': TemplateToImageInput;
	'template.toImageV1': TemplateToImageV1Input;
	'account.get': AccountGetInput;
	'assets.list': AssetsListInput;
	'assets.get': AssetsGetInput;
	'jobs.list': JobsListInput;
	'jobs.listV2': JobsListInput;
	'jobs.get': JobsGetInput;
	'storage.create': StorageCreateInput;
	'storage.getCurrent': StorageGetCurrentInput;
	'storage.get': StorageGetInput;
	'storage.remove': StorageRemoveInput;
};

export type CloudlayerEndpointOutputs = {
	'html.toPdf': HtmlToPdfOutput;
	'html.toPdfV1': HtmlToPdfV1Output;
	'html.toImage': HtmlToImageOutput;
	'html.toImageV1': HtmlToImageV1Output;
	'url.toPdf': UrlToPdfOutput;
	'url.toPdfV1': UrlToPdfV1Output;
	'url.toPdfQuick': UrlToPdfQuickOutput;
	'url.toPdfQuickV1': UrlToPdfQuickV1Output;
	'url.toImage': UrlToImageOutput;
	'url.toImageV1': UrlToImageV1Output;
	'url.toImageQuick': UrlToImageQuickOutput;
	'url.toImageQuickV1': UrlToImageQuickV1Output;
	'template.toPdf': TemplateToPdfOutput;
	'template.toPdfV1': TemplateToPdfV1Output;
	'template.toImage': TemplateToImageOutput;
	'template.toImageV1': TemplateToImageV1Output;
	'account.get': AccountGetOutput;
	'assets.list': AssetsListOutput;
	'assets.get': AssetsGetOutput;
	'jobs.list': JobsListOutput;
	'jobs.listV2': JobsListOutput;
	'jobs.get': JobsGetOutput;
	'storage.create': StorageCreateOutput;
	'storage.getCurrent': StorageGetCurrentOutput;
	'storage.get': StorageGetOutput;
	'storage.remove': StorageRemoveOutput;
};

export const CloudlayerEndpointInputSchemas = {
	'html.toPdf': HtmlToPdfInputSchema,
	'html.toPdfV1': HtmlToPdfV1InputSchema,
	'html.toImage': HtmlToImageInputSchema,
	'html.toImageV1': HtmlToImageV1InputSchema,
	'url.toPdf': UrlToPdfInputSchema,
	'url.toPdfV1': UrlToPdfV1InputSchema,
	'url.toPdfQuick': UrlToPdfQuickInputSchema,
	'url.toPdfQuickV1': UrlToPdfQuickV1InputSchema,
	'url.toImage': UrlToImageInputSchema,
	'url.toImageV1': UrlToImageV1InputSchema,
	'url.toImageQuick': UrlToImageQuickInputSchema,
	'url.toImageQuickV1': UrlToImageQuickV1InputSchema,
	'template.toPdf': TemplateToPdfInputSchema,
	'template.toPdfV1': TemplateToPdfV1InputSchema,
	'template.toImage': TemplateToImageInputSchema,
	'template.toImageV1': TemplateToImageV1InputSchema,
	'account.get': AccountGetInputSchema,
	'assets.list': AssetsListInputSchema,
	'assets.get': AssetsGetInputSchema,
	'jobs.list': JobsListInputSchema,
	'jobs.listV2': JobsListInputSchema,
	'jobs.get': JobsGetInputSchema,
	'storage.create': StorageCreateInputSchema,
	'storage.getCurrent': StorageGetCurrentInputSchema,
	'storage.get': StorageGetInputSchema,
	'storage.remove': StorageRemoveInputSchema,
} as const;

export const CloudlayerEndpointOutputSchemas = {
	'html.toPdf': HtmlToPdfOutputSchema,
	'html.toPdfV1': HtmlToPdfV1OutputSchema,
	'html.toImage': HtmlToImageOutputSchema,
	'html.toImageV1': HtmlToImageV1OutputSchema,
	'url.toPdf': UrlToPdfOutputSchema,
	'url.toPdfV1': UrlToPdfV1OutputSchema,
	'url.toPdfQuick': UrlToPdfQuickOutputSchema,
	'url.toPdfQuickV1': UrlToPdfQuickV1OutputSchema,
	'url.toImage': UrlToImageOutputSchema,
	'url.toImageV1': UrlToImageV1OutputSchema,
	'url.toImageQuick': UrlToImageQuickOutputSchema,
	'url.toImageQuickV1': UrlToImageQuickV1OutputSchema,
	'template.toPdf': TemplateToPdfOutputSchema,
	'template.toPdfV1': TemplateToPdfV1OutputSchema,
	'template.toImage': TemplateToImageOutputSchema,
	'template.toImageV1': TemplateToImageV1OutputSchema,
	'account.get': AccountGetOutputSchema,
	'assets.list': AssetsListOutputSchema,
	'assets.get': AssetsGetOutputSchema,
	'jobs.list': JobsListOutputSchema,
	'jobs.listV2': JobsListOutputSchema,
	'jobs.get': JobsGetOutputSchema,
	'storage.create': StorageCreateOutputSchema,
	'storage.getCurrent': StorageGetCurrentOutputSchema,
	'storage.get': StorageGetOutputSchema,
	'storage.remove': StorageRemoveOutputSchema,
} as const;
