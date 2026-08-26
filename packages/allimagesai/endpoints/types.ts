import { z } from 'zod';

/**
 * Schemas transcribed from the live OpenAPI document that All-Images.ai serves
 * at https://api.all-images.ai/doc-json (referenced by every page under
 * https://developer.all-images.ai/all-images.ai-api/api-reference/).
 *
 * Where the published spec disagrees with the running API, the running API
 * wins and the difference is called out inline. Response objects are `.loose()`
 * and their optional fields stay optional so a provider-side addition cannot
 * turn into an outage.
 */

const NonEmptyString = z.string().trim().min(1);

/**
 * The spec types `filteredResults` as `{"type": "object"}` on both paginated
 * responses, but the running API returns a plain integer count (verified
 * against a live account: `{"filteredResults": 0, "images": []}`). Accept a
 * number, and tolerate the documented object rather than rejecting it.
 */
const FilteredResults = z.union([
	z.number(),
	z.record(z.string(), z.unknown()),
]);

/** `limit` / `offset` pagination, per https://developer.all-images.ai/all-images.ai-api/pagination */
const Limit = z.number().int().positive();
const Offset = z.number().int().nonnegative();

// ─────────────────────── Check API Key ───────────────────────
// GET /v1/api-keys/check

const ApiKeyCheckInputSchema = z.object({});

const ApiKeyCheckResponseSchema = z
	.object({
		email: z.string(),
		/** Absent on the accounts we exercised; the spec marks it optional. */
		name: z.string().nullable().optional(),
	})
	.loose();

// ───────────────────────── Get Credits ─────────────────────────
// GET /v1/credit  — singular, despite the operation being named "credits".

const CreditsGetInputSchema = z.object({});

/** Quota buckets enumerated by the spec's ApiCreditDto. */
const CreditTypeSchema = z.enum([
	'global',
	'f_images',
	'f_images_print',
	'f_images_packImage',
	'f_images_upscaleHD',
	'f_images_upscaleUHD',
	'f_websites',
	'f_queues',
]);

const CreditSchema = z
	.object({
		/** Optional: only `credit` is required by the spec. */
		type: CreditTypeSchema.nullable().optional(),
		credit: z.number(),
		/** Credits restored when the subscription period renews. */
		creditTotal: z.number().nullable().optional(),
		unlimited: z.boolean().nullable().optional(),
	})
	.loose();

const CreditsGetResponseSchema = z
	.object({
		credits: z.array(CreditSchema),
	})
	.loose();

// ────────────────── Create webhook endpoint ──────────────────
// POST /v1/api-keys/webhook/subscribe

/** Events a webhook may subscribe to, per WebhookSubscribeRequest. */
const WebhookEventSchema = z.enum([
	'test',
	'print.created',
	'print.active',
	'print.failed',
	'print.progress',
	'print.completed',
]);

const WebhookCreateInputSchema = z.object({
	url: z.url(),
	/**
	 * Omit to accept the provider default of
	 * `["print.failed", "print.completed"]`.
	 */
	events: z.array(WebhookEventSchema).min(1).optional(),
});

const WebhookCreateResponseSchema = z
	.object({
		webhookId: z.string(),
	})
	.loose();

// ───────────────────────── Get webhook ─────────────────────────
// GET /v1/api-keys/webhook/{apiKeyWebhookId}

const WebhookGetInputSchema = z.object({
	apiKeyWebhookId: NonEmptyString,
});

/**
 * The spec declares no response body for this path. Against the live API it
 * answers 200 with `{ id, apiKeyId, url }`.
 *
 * `apiKeyId` is **the API key itself** — verified by comparing it to the key
 * used to make the call. `redactApiKeyId` in `../client` strips it before the
 * value reaches a caller, a log or the entity store, so it is typed here only
 * to document that the provider sends it.
 *
 * Note the response carries no `events`, so the subscribed event list cannot be
 * read back from the provider.
 */
const WebhookGetResponseSchema = z
	.object({
		id: z.string(),
		apiKeyId: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

// ─────────────── List automated images (prints) ───────────────
// GET /v1/image-generations

const ImageGenerationsListInputSchema = z.object({
	limit: Limit.optional(),
	offset: Offset.optional(),
	sort: z.string().optional(),
	name: z.string().optional(),
	tag: z.string().optional(),
});

/** Parameter names accepted on a print, per ApiPrintParam. */
const PrintParamNameSchema = z.enum([
	'sujetMode',
	'templatePrompt',
	'angle',
	'photographe',
	'time',
	'weather',
	'format',
	'camera',
	'interdiction',
	'version',
	'chaos',
	'stylize',
	'fromImageUrl',
]);

const PrintParamSchema = z
	.object({
		name: PrintParamNameSchema,
		value: z.string(),
	})
	.loose();

/**
 * Spec comment: `0 = Create, 1 = Pending, 2 = Processing, 3 = Done, 4 = Error`.
 * The enum also permits 5, which the comment does not name, so the numeric
 * range is accepted rather than the five documented values.
 */
const PrintStatusSchema = z.number().int();

const PrintImageSchema = z
	.object({
		id: z.string().optional(),
		url: z.string().optional(),
	})
	.loose();

const PrintSchema = z
	.object({
		/** Not marked required by the spec, but present on every live record. */
		id: z.string().optional(),
		name: z.string(),
		prompt: z.string(),
		status: PrintStatusSchema,
		params: z.array(PrintParamSchema),
		processMode: z.enum(['relax', 'fast']).nullable().optional(),
		images: z.array(PrintImageSchema).optional(),
		nbImages: z.number().nullable().optional(),
		tags: z.array(z.string()).optional(),
		metaData: z.record(z.string(), z.unknown()).nullable().optional(),
		createdAt: z.string().nullable().optional(),
	})
	.loose();

const ImageGenerationsListResponseSchema = z
	.object({
		filteredResults: FilteredResults.optional(),
		prints: z.array(PrintSchema),
	})
	.loose();

// ───────────────── Delete image generations ─────────────────
// DELETE /v1/image-generations

const ImageGenerationsDeleteInputSchema = z.object({
	/**
	 * The provider answers 200 for unknown ids and for an empty array, so an
	 * empty request would silently look like success. Require at least one id.
	 */
	printIds: z.array(NonEmptyString).min(1),
});

/**
 * The provider returns 200 with an entirely empty body. There is nothing to
 * parse, so the endpoint reports what it asked for instead of echoing silence.
 */
const ImageGenerationsDeleteResponseSchema = z.object({
	deleted: z.boolean(),
	printIds: z.array(z.string()),
});

// ───────────────── List downloaded images ─────────────────
// POST /v1/images/downladed  — the provider's own spelling; see ../client.

const DownloadedImagesListInputSchema = z
	.object({
		limit: Limit.optional(),
		offset: Offset.optional(),
		sort: z.string().optional(),
		/** ISO-8601 date-time filters on the download timestamp. */
		afterCreatedAt: z.union([z.string(), z.date()]).optional(),
		beforeCreatedAt: z.union([z.string(), z.date()]).optional(),
	})
	.refine(
		(value) =>
			!(value.afterCreatedAt && value.beforeCreatedAt) ||
			new Date(value.afterCreatedAt as string | Date).getTime() <=
				new Date(value.beforeCreatedAt as string | Date).getTime(),
		{ message: 'afterCreatedAt must not be later than beforeCreatedAt' },
	);

const DownloadedImageSchema = z
	.object({
		id: z.string(),
		/** Preview-resolution download link. */
		url: z.string(),
		urlFull: z.string(),
		/** Marked optional by the spec, unlike urlUpscaleUHD. */
		urlUpscale: z.string().nullable().optional(),
		urlUpscaleUHD: z.string(),
		downloadedAt: z.string(),
	})
	.loose();

const DownloadedImagesListResponseSchema = z
	.object({
		filteredResults: FilteredResults.optional(),
		images: z.array(DownloadedImageSchema),
	})
	.loose();

// ─────────────────────────── Exports ───────────────────────────

export type ApiKeyCheckInput = z.infer<typeof ApiKeyCheckInputSchema>;
export type ApiKeyCheckResponse = z.infer<typeof ApiKeyCheckResponseSchema>;
export type CreditsGetInput = z.infer<typeof CreditsGetInputSchema>;
export type CreditsGetResponse = z.infer<typeof CreditsGetResponseSchema>;
export type WebhookCreateInput = z.infer<typeof WebhookCreateInputSchema>;
export type WebhookCreateResponse = z.infer<typeof WebhookCreateResponseSchema>;
export type WebhookGetInput = z.infer<typeof WebhookGetInputSchema>;
export type WebhookGetResponse = z.infer<typeof WebhookGetResponseSchema>;
export type ImageGenerationsListInput = z.infer<
	typeof ImageGenerationsListInputSchema
>;
export type ImageGenerationsListResponse = z.infer<
	typeof ImageGenerationsListResponseSchema
>;
export type ImageGenerationsDeleteInput = z.infer<
	typeof ImageGenerationsDeleteInputSchema
>;
export type ImageGenerationsDeleteResponse = z.infer<
	typeof ImageGenerationsDeleteResponseSchema
>;
export type DownloadedImagesListInput = z.infer<
	typeof DownloadedImagesListInputSchema
>;
export type DownloadedImagesListResponse = z.infer<
	typeof DownloadedImagesListResponseSchema
>;
export type AllImagesAiPrint = z.infer<typeof PrintSchema>;
export type AllImagesAiDownloadedImage = z.infer<typeof DownloadedImageSchema>;
export type AllImagesAiCredit = z.infer<typeof CreditSchema>;
export type AllImagesAiWebhookEvent = z.infer<typeof WebhookEventSchema>;

export type AllimagesaiEndpointInputs = {
	apiKeysCheck: ApiKeyCheckInput;
	creditsGet: CreditsGetInput;
	webhooksCreate: WebhookCreateInput;
	webhooksGet: WebhookGetInput;
	imageGenerationsList: ImageGenerationsListInput;
	imageGenerationsDelete: ImageGenerationsDeleteInput;
	imagesListDownloaded: DownloadedImagesListInput;
};

export type AllimagesaiEndpointOutputs = {
	apiKeysCheck: ApiKeyCheckResponse;
	creditsGet: CreditsGetResponse;
	webhooksCreate: WebhookCreateResponse;
	webhooksGet: WebhookGetResponse;
	imageGenerationsList: ImageGenerationsListResponse;
	imageGenerationsDelete: ImageGenerationsDeleteResponse;
	imagesListDownloaded: DownloadedImagesListResponse;
};

export const AllimagesaiEndpointInputSchemas = {
	apiKeysCheck: ApiKeyCheckInputSchema,
	creditsGet: CreditsGetInputSchema,
	webhooksCreate: WebhookCreateInputSchema,
	webhooksGet: WebhookGetInputSchema,
	imageGenerationsList: ImageGenerationsListInputSchema,
	imageGenerationsDelete: ImageGenerationsDeleteInputSchema,
	imagesListDownloaded: DownloadedImagesListInputSchema,
} as const;

export const AllimagesaiEndpointOutputSchemas = {
	apiKeysCheck: ApiKeyCheckResponseSchema,
	creditsGet: CreditsGetResponseSchema,
	webhooksCreate: WebhookCreateResponseSchema,
	webhooksGet: WebhookGetResponseSchema,
	imageGenerationsList: ImageGenerationsListResponseSchema,
	imageGenerationsDelete: ImageGenerationsDeleteResponseSchema,
	imagesListDownloaded: DownloadedImagesListResponseSchema,
} as const;
