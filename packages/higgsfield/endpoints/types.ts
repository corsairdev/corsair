import { z } from 'zod';
import { isValidRequestId, normalizeModelPath } from '../client';

// ── Shared ──────────────────────────────────────────────────────────────────

const ModelPathSchema = z
	.string()
	.min(1)
	.max(200)
	.refine((value) => normalizeModelPath(value) !== null, {
		message:
			'Must be a relative model path such as higgsfield-ai/soul/v2/standard, with no scheme, query or "..".',
	})
	.describe(
		'The model path, for example higgsfield-ai/soul/v2/standard or kling-video/v2.5-turbo/pro/text-to-video. Find paths with models.list.',
	);

// unknown: every Higgsfield model defines its own input fields (models.get lists them).
const ModelInputSchema = z
	.record(z.string(), z.unknown())
	.describe(
		"The model's input fields, for example { prompt: 'a quiet alpine lake at sunrise' }. Each model has its own; read them with models.get({ modelPath }).",
	);

const RequestIdSchema = z
	.string()
	.refine(isValidRequestId, {
		message: 'Must be the request_id a submit returned.',
	})
	.describe('The request_id generations.submit or generations.run returned.');

const HttpsUrlSchema = z.string().refine((value) => {
	if (!URL.canParse(value)) return false;
	const url = new URL(value);
	return url.protocol === 'https:' && !url.username && !url.password;
}, 'Must be an https URL without credentials.');

/** Every status the API documents for a request. */
export const REQUEST_STATUSES = [
	'queued',
	'in_progress',
	'completed',
	'failed',
	'nsfw',
	'canceled',
] as const;

/** The statuses a request never leaves. */
export const TERMINAL_STATUSES: readonly string[] = [
	'completed',
	'failed',
	'nsfw',
	'canceled',
];

// A status Higgsfield adds later still parses, so reading a request never breaks.
const RequestStatusSchema = z
	.enum(REQUEST_STATUSES)
	.or(z.string())
	.describe(
		'queued and in_progress: still running (a queued request can still be canceled). completed: the outputs are in images, video or audio. failed: see error, not charged. nsfw: moderation rejected the input or output, not charged. canceled: canceled while queued, refunded.',
	);

const MediaSchema = z
	.object({
		url: z.string().nullish(),
		content_type: z.string().nullish(),
	})
	.loose();

const ExpiresAtSchema = z
	.string()
	.nullish()
	.describe(
		'When the output files are deleted and their URLs stop working: 7 days after the request finished by default. Copy anything you want to keep before then.',
	);

const RequestFields = {
	status: RequestStatusSchema,
	request_id: z.string(),
	status_url: z.string().nullish(),
	cancel_url: z.string().nullish(),
	// unknown: documented as text; an object form must not break a status read.
	error: z.union([z.string(), z.record(z.string(), z.unknown())]).nullish(),
	expires_at: ExpiresAtSchema,
	images: z.array(MediaSchema).nullish(),
	video: MediaSchema.nullish(),
	audio: MediaSchema.nullish(),
	audios: z.array(MediaSchema).nullish(),
};

const RequestStatusResponseSchema = z
	.object(RequestFields)
	.loose()
	.describe(
		'Some video and 3D operations add artifacts such as zip, mov, jsx, fbx or ply, which come through as extra fields.',
	);

const IdempotencyKeySchema = z
	.string()
	.regex(
		/^[\x21-\x7E]{1,255}$/,
		'Must be 1 to 255 visible ASCII characters without whitespace.',
	);

// ── generations.submit ──────────────────────────────────────────────────────

const GenerationsSubmitInputSchema = z.object({
	modelPath: ModelPathSchema,
	input: ModelInputSchema,
	webhookUrl: HttpsUrlSchema.optional().describe(
		'An https URL Higgsfield POSTs the result to when the request finishes (see the requests.completed webhook).',
	),
	idempotencyKey: IdempotencyKeySchema.optional().describe(
		'Identifies this one generation. Repeating the same call with the same key returns the original request with no second charge; the same key with a different modelPath, input, webhookUrl or expiresAfter is a 422. Left out, one is generated for this call and its retries and returned as idempotency_key. A caller that replays a step or starts a new script gets a new key each time, so it must pass its own to be safe across attempts.',
	),
	expiresAfter: z
		.number()
		.int()
		.min(3600)
		.max(604800)
		.optional()
		.describe(
			'Seconds to keep the outputs after the request finishes, at least 3600. Default and most accounts’ maximum: 604800 (7 days).',
		),
});

export type GenerationsSubmitInput = z.infer<
	typeof GenerationsSubmitInputSchema
>;

const GenerationsSubmitResponseSchema = z
	.object({
		status: z
			.string()
			.describe(
				'An acceptance receipt, not the current status: a repeat with the same key can say queued for a request that has since finished. Read requests.status.',
			),
		request_id: z.string().describe('Pass to requests.status as requestId.'),
		status_url: z.string().nullish(),
		cancel_url: z.string().nullish(),
		expires_after: z
			.number()
			.nullish()
			.describe('Seconds the outputs are kept after the request finishes.'),
		idempotency_key: z
			.string()
			.describe('Repeat the call with this key and no second charge is made.'),
	})
	.loose();

export type GenerationsSubmitResponse = z.infer<
	typeof GenerationsSubmitResponseSchema
>;

// ── generations.run ─────────────────────────────────────────────────────────

/**
 * Default and longest wait in generations.run. A Corsair script has 25 s, and
 * the runtime keeps some of them to wait on the job itself.
 */
export const RUN_DEFAULT_WAIT_S = 10;
export const RUN_MAX_WAIT_S = 15;

const GenerationsRunInputSchema = GenerationsSubmitInputSchema.extend({
	waitSeconds: z
		.number()
		.min(0)
		.max(RUN_MAX_WAIT_S)
		.optional()
		.describe(
			'How long the call waits, counted from the start of the submit: default 10 and at most 15 seconds. A request still going then comes back as it stands.',
		),
});

export type GenerationsRunInput = z.infer<typeof GenerationsRunInputSchema>;

const GenerationsRunResponseSchema = RequestStatusResponseSchema.extend({
	expires_after: z
		.number()
		.nullish()
		.describe('Seconds the outputs are kept after the request finishes.'),
	idempotency_key: z
		.string()
		.describe('Repeat the call with this key and no second charge is made.'),
});

export type GenerationsRunResponse = z.infer<
	typeof GenerationsRunResponseSchema
>;

// ── generations.estimate ────────────────────────────────────────────────────

const GenerationsEstimateInputSchema = z.object({
	modelPath: ModelPathSchema,
	input: ModelInputSchema,
});

export type GenerationsEstimateInput = z.infer<
	typeof GenerationsEstimateInputSchema
>;

const GenerationsEstimateResponseSchema = z
	.object({
		type: z.string().nullish(),
		credits: z.string().nullish(),
		usd: z
			.string()
			.nullish()
			.describe('The estimated price in US dollars, as a decimal string.'),
		// unknown: the docs don't describe a discount's shape.
		discount: z.unknown().optional(),
	})
	.loose();

export type GenerationsEstimateResponse = z.infer<
	typeof GenerationsEstimateResponseSchema
>;

// ── requests.status / cancel / delete ───────────────────────────────────────

const RequestRefInputSchema = z.object({ requestId: RequestIdSchema });

export type RequestsStatusInput = z.infer<typeof RequestRefInputSchema>;
export type RequestsStatusResponse = z.infer<
	typeof RequestStatusResponseSchema
>;

export type RequestsCancelInput = z.infer<typeof RequestRefInputSchema>;

const RequestsCancelResponseSchema = z.object({
	request_id: z.string(),
	status: z
		.literal('canceled')
		.describe('The request was still queued. It will not run and is refunded.'),
});

export type RequestsCancelResponse = z.infer<
	typeof RequestsCancelResponseSchema
>;

export type RequestsDeleteInput = z.infer<typeof RequestRefInputSchema>;

const RequestsDeleteResponseSchema = z
	.object({
		request_id: z.string(),
		status: z
			.string()
			.describe('deleted, also when the request was already deleted.'),
	})
	.loose();

export type RequestsDeleteResponse = z.infer<
	typeof RequestsDeleteResponseSchema
>;

// ── files.createUploadUrl / files.upload ────────────────────────────────────

/**
 * What files/generate-upload-url accepted when checked on 2026-11-08. It is
 * wider than the docs' list (the docs leave out mp3, m4a, aac, ogg, flac and
 * webm audio).
 */
export const UPLOAD_CONTENT_TYPES = [
	'image/png',
	'image/jpeg',
	'image/jpg',
	'image/gif',
	'image/webp',
	'audio/x-wav',
	'audio/wav',
	'audio/mpeg',
	'audio/mp3',
	'audio/mp4',
	'audio/x-m4a',
	'audio/aac',
	'audio/ogg',
	'audio/flac',
	'audio/x-flac',
	'audio/webm',
	'video/mp4',
] as const;

const UploadContentTypeSchema = z.enum(UPLOAD_CONTENT_TYPES);

const FilesCreateUploadUrlInputSchema = z.object({
	contentType: UploadContentTypeSchema.describe(
		'The type of the file you will upload; the PUT must use the same one.',
	),
});

export type FilesCreateUploadUrlInput = z.infer<
	typeof FilesCreateUploadUrlInputSchema
>;

const FilesCreateUploadUrlResponseSchema = z
	.object({
		public_url: z
			.string()
			.describe(
				'Pass this as a model input (image_url, video_url, audio_url) once the file is uploaded.',
			),
		upload_url: z
			.string()
			.describe(
				'A presigned storage URL, good for one hour. PUT the file here with every upload_headers entry and no Higgsfield credentials.',
			),
		content_type: z.string().nullish(),
		upload_headers: z.record(z.string(), z.string()).nullish(),
	})
	.loose();

export type FilesCreateUploadUrlResponse = z.infer<
	typeof FilesCreateUploadUrlResponseSchema
>;

const FilesUploadInputSchema = z.object({
	contentBase64: z
		.string()
		.min(1)
		.describe(
			'The file’s bytes, base64 encoded (a data: URL prefix is fine). Up to 100 MB.',
		),
	contentType: UploadContentTypeSchema.describe('The file’s type.'),
});

export type FilesUploadInput = z.infer<typeof FilesUploadInputSchema>;

const FilesUploadResponseSchema = z.object({
	public_url: z
		.string()
		.describe(
			'Pass this as a model input (image_url, video_url, audio_url). Uploaded files are deleted within seven days, so upload again rather than keeping the URL for later.',
		),
	content_type: z.string(),
	size: z.number().int(),
});

export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;

// ── models.list / models.get ────────────────────────────────────────────────

const ModelSchema = z
	.object({
		slug: z
			.string()
			.describe(
				'The model path to pass as modelPath, except where a model’s docs page names another endpoint.',
			),
		title: z.string().nullish(),
		description: z.string().nullish(),
		operation_type: z
			.array(z.string())
			.nullish()
			.describe('For example text2image, image2video, text2video.'),
		output_type: z.string().nullish().describe('For example image or video.'),
		base_credits: z
			.string()
			.nullish()
			.describe(
				'Not a price (most models say 0.0000). Use generations.estimate.',
			),
		is_workflow: z.boolean().nullish(),
		// unknown: a JSON Schema document, different for every model.
		input_schema: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe(
				'JSON Schema of the model’s input fields. It drives the Console’s playground, so its defaults can differ from what the API applies when a field is left out: pass the fields you care about.',
			),
	})
	.loose();

const ModelsListInputSchema = z.object({
	search: z
		.string()
		.min(1)
		.optional()
		.describe('Free text, for example soul or kling.'),
	outputType: z
		.string()
		.min(1)
		.optional()
		.describe('For example image or video.'),
	operationType: z
		.string()
		.min(1)
		.optional()
		.describe(
			'For example text2image, image_edit, text2video, image2video or video2video.',
		),
	includeSchema: z
		.boolean()
		.optional()
		.describe(
			"Include each model's input_schema (its input fields). All of them come to about 110 KB, so prefer models.get for one model.",
		),
});

export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;

const ModelsListResponseSchema = z
	.object({
		total: z.number().int().nullish(),
		items: z.array(ModelSchema),
	})
	.loose();

export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>;

const ModelsGetInputSchema = z.object({ modelPath: ModelPathSchema });

export type ModelsGetInput = z.infer<typeof ModelsGetInputSchema>;

const ModelsGetResponseSchema = ModelSchema;

export type ModelsGetResponse = z.infer<typeof ModelsGetResponseSchema>;

// ── usage.get ───────────────────────────────────────────────────────────────

const UsageGetInputSchema = z.object({
	start: z
		.string()
		.optional()
		.describe(
			'ISO 8601 time, for example 2026-11-01T00:00:00Z. Default: 24 hours ago. The range is at most 31 days.',
		),
	end: z.string().optional().describe('ISO 8601 time. Default: now.'),
	timeframe: z
		.enum(['hour', 'day', 'week', 'month'])
		.optional()
		.describe('Bucket size, default hour.'),
	boundToTimeframe: z
		.boolean()
		.optional()
		.describe('Align start and end to bucket boundaries. Default true.'),
	models: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only these model paths.'),
	byApiKey: z
		.boolean()
		.optional()
		.describe('Break the results down by API key id (auth_method).'),
	page: z.number().int().min(1).optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Buckets per page, default 50 and at most 100.'),
});

export type UsageGetInput = z.infer<typeof UsageGetInputSchema>;

const UsageLineSchema = z
	.object({
		model: z.string().nullish(),
		unit: z.string().nullish(),
		quantity: z.string().nullish(),
		unit_price: z.string().nullish(),
		cost: z.string().nullish().describe('Estimated, as a decimal string.'),
		currency: z.string().nullish(),
		auth_method: z.string().nullish(),
	})
	.loose();

const UsageGetResponseSchema = z
	.object({
		time_series: z
			.array(
				z
					.object({
						bucket: z.string(),
						results: z.array(UsageLineSchema),
					})
					.loose(),
			)
			.nullish(),
		total: z.number().int().nullish(),
		page: z.number().int().nullish(),
		limit: z.number().int().nullish(),
	})
	.loose();

export type UsageGetResponse = z.infer<typeof UsageGetResponseSchema>;

// ── Maps ────────────────────────────────────────────────────────────────────

export type HiggsfieldEndpointInputs = {
	generationsSubmit: GenerationsSubmitInput;
	generationsRun: GenerationsRunInput;
	generationsEstimate: GenerationsEstimateInput;
	requestsStatus: RequestsStatusInput;
	requestsCancel: RequestsCancelInput;
	requestsDelete: RequestsDeleteInput;
	filesCreateUploadUrl: FilesCreateUploadUrlInput;
	filesUpload: FilesUploadInput;
	modelsList: ModelsListInput;
	modelsGet: ModelsGetInput;
	usageGet: UsageGetInput;
};

export type HiggsfieldEndpointOutputs = {
	generationsSubmit: GenerationsSubmitResponse;
	generationsRun: GenerationsRunResponse;
	generationsEstimate: GenerationsEstimateResponse;
	requestsStatus: RequestsStatusResponse;
	requestsCancel: RequestsCancelResponse;
	requestsDelete: RequestsDeleteResponse;
	filesCreateUploadUrl: FilesCreateUploadUrlResponse;
	filesUpload: FilesUploadResponse;
	modelsList: ModelsListResponse;
	modelsGet: ModelsGetResponse;
	usageGet: UsageGetResponse;
};

export const HiggsfieldEndpointInputSchemas = {
	generationsSubmit: GenerationsSubmitInputSchema,
	generationsRun: GenerationsRunInputSchema,
	generationsEstimate: GenerationsEstimateInputSchema,
	requestsStatus: RequestRefInputSchema,
	requestsCancel: RequestRefInputSchema,
	requestsDelete: RequestRefInputSchema,
	filesCreateUploadUrl: FilesCreateUploadUrlInputSchema,
	filesUpload: FilesUploadInputSchema,
	modelsList: ModelsListInputSchema,
	modelsGet: ModelsGetInputSchema,
	usageGet: UsageGetInputSchema,
} as const;

export const HiggsfieldEndpointOutputSchemas = {
	generationsSubmit: GenerationsSubmitResponseSchema,
	generationsRun: GenerationsRunResponseSchema,
	generationsEstimate: GenerationsEstimateResponseSchema,
	requestsStatus: RequestStatusResponseSchema,
	requestsCancel: RequestsCancelResponseSchema,
	requestsDelete: RequestsDeleteResponseSchema,
	filesCreateUploadUrl: FilesCreateUploadUrlResponseSchema,
	filesUpload: FilesUploadResponseSchema,
	modelsList: ModelsListResponseSchema,
	modelsGet: ModelsGetResponseSchema,
	usageGet: UsageGetResponseSchema,
} as const;
