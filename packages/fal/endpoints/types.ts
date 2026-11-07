import { z } from 'zod';

// ── Shared ──────────────────────────────────────────────────────────────────

const EndpointIdSchema = z
	.string()
	.min(3)
	.describe(
		'fal model endpoint id, for example fal-ai/flux/schnell or fal-ai/kling-video/v2.1/master/text-to-video. Find ids with models.search.',
	);

const EndpointIdsSchema = z
	.array(z.string().min(3))
	.min(1)
	.max(50)
	.describe('1 to 50 fal endpoint ids, for example ["fal-ai/flux/dev"].');

// unknown: every fal model defines its own input fields (models.search with includeOpenApi lists them).
const ModelInputSchema = z
	.record(z.string(), z.unknown())
	.describe(
		"The model's input fields, for example { prompt: 'a lighthouse at dawn' }. Each model has its own; read them with models.search({ endpointIds: [id], includeOpenApi: true }).",
	);

// unknown: every fal model defines its own output fields.
const ModelOutputSchema = z
	.record(z.string(), z.unknown())
	.describe(
		'The model output. Its shape is model-specific: image models return images[].url, video models video.url, audio models audio.url. fal media URLs expire, so save files you want to keep.',
	);

const DateSchema = z
	.string()
	.describe('ISO 8601 date or date-time, for example 2026-11-01.');

const CursorSchema = z.string().describe('next_cursor from the previous page.');

const PageMetaSchema = {
	next_cursor: z.string().nullish(),
	has_more: z.boolean(),
};

const RequestRefShape = {
	endpointId: EndpointIdSchema.optional().describe(
		'The endpoint id the request was submitted to. Pass it with requestId.',
	),
	requestId: z
		.string()
		.min(1)
		.optional()
		.describe('The request_id queue.submit returned. Pass it with endpointId.'),
	responseUrl: z
		.string()
		.optional()
		.describe(
			'Instead of endpointId + requestId: the response_url queue.submit returned.',
		),
};

const requireRequestRef = (
	value: { endpointId?: string; requestId?: string; responseUrl?: string },
	ctx: z.RefinementCtx,
) => {
	if (!((value.endpointId && value.requestId) || value.responseUrl)) {
		ctx.addIssue({
			code: 'custom',
			message:
				'Pass endpointId and requestId, or the responseUrl queue.submit returned.',
		});
	}
};

const LogEntrySchema = z
	.object({
		message: z.string(),
		timestamp: z.string(),
		level: z.string().optional(),
		// unknown: free-form labels the runner attaches.
		labels: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const QueueStatusFields = {
	status: z
		.string()
		.describe(
			"fal's raw queue status: IN_QUEUE, IN_PROGRESS or COMPLETED. A failed or cancelled request is COMPLETED too, so read `state` for the outcome.",
		),
	request_id: z.string(),
	response_url: z.string().nullish(),
	status_url: z.string().nullish(),
	cancel_url: z.string().nullish(),
	queue_position: z.number().int().nullish(),
	logs: z.array(LogEntrySchema).nullish(),
	metrics: z.object({ inference_time: z.number().nullish() }).loose().nullish(),
	error: z.string().nullish(),
	error_type: z.string().nullish(),
};

// ── queue.submit ────────────────────────────────────────────────────────────

const QueueSubmitInputSchema = z.object({
	endpointId: EndpointIdSchema,
	input: ModelInputSchema,
	webhookUrl: z
		.url()
		.optional()
		.describe(
			'An https URL fal POSTs the result to when the request completes (signed; see the requests.completed webhook).',
		),
	priority: z
		.enum(['normal', 'low'])
		.optional()
		.describe('low puts it behind your other requests to this endpoint.'),
	startTimeout: z
		.number()
		.positive()
		.optional()
		.describe(
			'Seconds fal may wait for a runner before giving up (504). Does not limit run time.',
		),
	hint: z
		.string()
		.optional()
		.describe(
			'Routing hint: requests with the same hint go to the same runner.',
		),
	noRetry: z
		.boolean()
		.optional()
		.describe('true turns off fal’s automatic retries for this request.'),
	maxQueueLength: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Reject with 429 if this many requests are already queued.'),
});

export type QueueSubmitInput = z.infer<typeof QueueSubmitInputSchema>;

const QueueSubmitResponseSchema = z
	.object({
		...QueueStatusFields,
		response_url: z
			.string()
			.describe('Pass to queue.status as responseUrl to follow the request.'),
		user_queue_position: z.number().int().nullish(),
		user_queued_count: z.number().int().nullish(),
	})
	.loose();

export type QueueSubmitResponse = z.infer<typeof QueueSubmitResponseSchema>;

// ── queue.status ────────────────────────────────────────────────────────────

/** Where a request stands, failures told apart from successes. */
export const QUEUE_STATES = [
	'IN_QUEUE',
	'IN_PROGRESS',
	'SUCCEEDED',
	'FAILED',
] as const;

const QueueStatusInputSchema = z
	.object({
		...RequestRefShape,
		logs: z
			.boolean()
			.optional()
			.describe('Include runner logs (only the app owner receives them).'),
	})
	.superRefine(requireRequestRef);

export type QueueStatusInput = z.infer<typeof QueueStatusInputSchema>;

const QueueStatusResponseSchema = z
	.object({
		...QueueStatusFields,
		state: z
			.enum(QUEUE_STATES)
			.describe(
				'IN_QUEUE or IN_PROGRESS while it runs; SUCCEEDED with output, or FAILED with error, once it is done.',
			),
		output: ModelOutputSchema.optional(),
	})
	.loose();

export type QueueStatusResponse = z.infer<typeof QueueStatusResponseSchema>;

// ── queue.result ────────────────────────────────────────────────────────────

const QueueResultInputSchema = z
	.object({ ...RequestRefShape })
	.superRefine(requireRequestRef);

export type QueueResultInput = z.infer<typeof QueueResultInputSchema>;

const QueueResultResponseSchema = ModelOutputSchema;

export type QueueResultResponse = z.infer<typeof QueueResultResponseSchema>;

// ── queue.cancel ────────────────────────────────────────────────────────────

const QueueCancelInputSchema = z
	.object({ ...RequestRefShape })
	.superRefine(requireRequestRef);

export type QueueCancelInput = z.infer<typeof QueueCancelInputSchema>;

export const QUEUE_CANCEL_STATUSES = [
	'OK',
	'CANCELLATION_REQUESTED',
	'ALREADY_COMPLETED',
	'NOT_FOUND',
] as const;

const QueueCancelResponseSchema = z.object({
	status: z
		.enum(QUEUE_CANCEL_STATUSES)
		.describe(
			'OK: removed from the queue, never runs. CANCELLATION_REQUESTED: running, fal asked the runner to stop (it may still finish). ALREADY_COMPLETED or NOT_FOUND: nothing to cancel.',
		),
});

export type QueueCancelResponse = z.infer<typeof QueueCancelResponseSchema>;

// ── models.run ──────────────────────────────────────────────────────────────

/**
 * Default and longest wait in models.run. A Corsair script has about 22 s,
 * and the runtime keeps a few of them to wait on the job itself.
 */
export const MODELS_RUN_DEFAULT_WAIT_S = 10;
export const MODELS_RUN_MAX_WAIT_S = 15;

const ModelsRunInputSchema = QueueSubmitInputSchema.extend({
	waitSeconds: z
		.number()
		.min(0)
		.max(MODELS_RUN_MAX_WAIT_S)
		.optional()
		.describe(
			'How long models.run waits after submitting, default 10 and at most 15 seconds.',
		),
});

export type ModelsRunInput = z.infer<typeof ModelsRunInputSchema>;

const ModelsRunResponseSchema = QueueStatusResponseSchema.extend({
	response_url: z
		.string()
		.describe(
			'Pass to queue.status as responseUrl to follow a run still going.',
		),
});

export type ModelsRunResponse = z.infer<typeof ModelsRunResponseSchema>;

// ── models.search ───────────────────────────────────────────────────────────

const ModelsSearchInputSchema = z.object({
	query: z
		.string()
		.optional()
		.describe('Free text, for example "text to video" or "upscale".'),
	category: z
		.string()
		.optional()
		.describe(
			'For example text-to-image, image-to-image, image-to-video, text-to-video, text-to-speech, speech-to-text, training.',
		),
	status: z.enum(['active', 'deprecated']).optional(),
	endpointIds: EndpointIdsSchema.optional().describe(
		'Look up these endpoints instead of searching.',
	),
	sort: z.enum(['relevant', 'recent']).optional(),
	includeOpenApi: z
		.boolean()
		.optional()
		.describe(
			"Include each model's OpenAPI document (its input and output fields). Large: use with endpointIds.",
		),
	limit: z.number().int().min(1).max(100).optional(),
	cursor: CursorSchema.optional(),
});

export type ModelsSearchInput = z.infer<typeof ModelsSearchInputSchema>;

const ModelSchema = z
	.object({
		endpoint_id: z.string(),
		metadata: z
			.object({
				display_name: z.string().optional(),
				category: z.string().optional(),
				description: z.string().optional(),
				status: z.string().optional(),
				tags: z.array(z.string()).optional(),
				updated_at: z.string().optional(),
				thumbnail_url: z.string().optional(),
				model_url: z.string().optional(),
				license_type: z.string().optional(),
				kind: z.string().optional(),
				duration_estimate: z.number().nullish(),
			})
			.loose()
			.optional(),
		retires_at: z.string().nullish(),
		replacement: z.string().nullish(),
		// unknown: a whole OpenAPI document for the model.
		openapi: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ModelsSearchResponseSchema = z
	.object({
		models: z.array(ModelSchema),
		...PageMetaSchema,
	})
	.loose();

export type ModelsSearchResponse = z.infer<typeof ModelsSearchResponseSchema>;

// ── models.pricing ──────────────────────────────────────────────────────────

const ModelsPricingInputSchema = z.object({
	endpointIds: EndpointIdsSchema,
});

export type ModelsPricingInput = z.infer<typeof ModelsPricingInputSchema>;

const ModelsPricingResponseSchema = z
	.object({
		prices: z.array(
			z
				.object({
					endpoint_id: z.string(),
					unit_price: z.number(),
					unit: z
						.string()
						.describe(
							'What one unit is, for example megapixels, images or seconds.',
						),
					currency: z.string(),
				})
				.loose(),
		),
		...PageMetaSchema,
	})
	.loose();

export type ModelsPricingResponse = z.infer<typeof ModelsPricingResponseSchema>;

// ── models.estimateCost ─────────────────────────────────────────────────────

const ModelsEstimateCostInputSchema = z.object({
	estimateType: z
		.enum(['historical_api_price', 'unit_price'])
		.describe(
			'historical_api_price: quantity = number of calls, priced from past calls. unit_price: quantity = billing units (images, seconds, megapixels).',
		),
	endpoints: z
		.record(z.string().min(3), z.object({ quantity: z.number().positive() }))
		.describe(
			'Endpoint id to quantity, for example { "fal-ai/flux/dev": { quantity: 100 } }.',
		),
});

export type ModelsEstimateCostInput = z.infer<
	typeof ModelsEstimateCostInputSchema
>;

const ModelsEstimateCostResponseSchema = z
	.object({
		estimate_type: z.string(),
		total_cost: z.number(),
		currency: z.string(),
	})
	.loose();

export type ModelsEstimateCostResponse = z.infer<
	typeof ModelsEstimateCostResponseSchema
>;

// ── requests.list ─────────────────────────────────────────

const RequestRecordSchema = z
	.object({
		request_id: z.string(),
		endpoint_id: z.string(),
		started_at: z.string().nullish(),
		sent_at: z.string().nullish(),
		ended_at: z.string().nullish(),
		status_code: z.number().int().nullish(),
		duration: z.number().nullish(),
		// unknown: the request's model-specific input and output.
		json_input: z.unknown().optional(),
		json_output: z.unknown().optional(),
	})
	.loose();

const RequestsListInputSchema = z.object({
	endpointIds: EndpointIdsSchema,
	start: DateSchema.optional(),
	end: DateSchema.optional().describe('Exclusive end date.'),
	status: z.enum(['success', 'error', 'user_error']).optional(),
	requestId: z.string().optional(),
	includePayloads: z
		.boolean()
		.optional()
		.describe('Include each request’s input and output.'),
	sortBy: z.enum(['ended_at', 'duration']).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	cursor: CursorSchema.optional(),
});

export type RequestsListInput = z.infer<typeof RequestsListInputSchema>;

const RequestsListResponseSchema = z
	.object({
		items: z.array(RequestRecordSchema),
		...PageMetaSchema,
	})
	.loose();

export type RequestsListResponse = z.infer<typeof RequestsListResponseSchema>;

// ── requests.deletePayloads ─────────────────────────────────────────────────

const RequestsDeletePayloadsInputSchema = z.object({
	requestId: z.string().min(1),
});

export type RequestsDeletePayloadsInput = z.infer<
	typeof RequestsDeletePayloadsInputSchema
>;

const RequestsDeletePayloadsResponseSchema = z
	.object({
		cdn_delete_results: z.array(
			z
				.object({
					link: z.string(),
					exception: z
						.string()
						.nullish()
						.describe(
							'Set when fal could not delete this file; it is still there.',
						),
				})
				.loose(),
		),
	})
	.loose();

export type RequestsDeletePayloadsResponse = z.infer<
	typeof RequestsDeletePayloadsResponseSchema
>;

// ── usage.get / usage.billingEvents ─────────────────────────────────────────

const UsageLineSchema = z
	.object({
		endpoint_id: z.string(),
		unit: z.string(),
		quantity: z.number(),
		unit_price: z.number(),
		percent_discount: z.number().nullish(),
		cost_subtotal: z.number().optional(),
		cost_discount: z.number().optional(),
		cost_total: z.number().optional(),
		cost: z.number().optional(),
		currency: z.string(),
		auth_method: z.string().optional(),
	})
	.loose();

const UsageGetInputSchema = z.object({
	start: DateSchema.optional(),
	end: DateSchema.optional().describe('Exclusive end date.'),
	endpointIds: EndpointIdsSchema.optional(),
	timeframe: z.enum(['minute', 'hour', 'day', 'week', 'month']).optional(),
	timezone: z.string().optional().describe('IANA time zone, default UTC.'),
	expand: z
		.array(z.enum(['time_series', 'summary', 'auth_method']))
		.optional()
		.describe('Default time_series. summary adds totals per endpoint.'),
	limit: z.number().int().min(1).optional(),
	cursor: CursorSchema.optional(),
});

export type UsageGetInput = z.infer<typeof UsageGetInputSchema>;

const UsageGetResponseSchema = z
	.object({
		time_series: z
			.array(
				z
					.object({ bucket: z.string(), results: z.array(UsageLineSchema) })
					.loose(),
			)
			.optional(),
		summary: z.array(UsageLineSchema).optional(),
		...PageMetaSchema,
	})
	.loose();

export type UsageGetResponse = z.infer<typeof UsageGetResponseSchema>;

const UsageBillingEventsInputSchema = z.object({
	start: DateSchema.optional(),
	end: DateSchema.optional().describe('Exclusive end date.'),
	endpointIds: EndpointIdsSchema.optional(),
	requestIds: z.array(z.string()).min(1).max(50).optional(),
	limit: z.number().int().min(1).optional(),
	cursor: CursorSchema.optional(),
});

export type UsageBillingEventsInput = z.infer<
	typeof UsageBillingEventsInputSchema
>;

const UsageBillingEventsResponseSchema = z
	.object({
		billing_events: z.array(
			z
				.object({
					request_id: z.string(),
					endpoint_id: z.string(),
					timestamp: z.string(),
					quantity: z.number().nullish(),
					unit: z.string().nullish(),
					unit_price: z.number().nullish(),
					cost_total: z.number(),
					cost_estimate_nano_usd: z.number().optional(),
				})
				.loose(),
		),
		...PageMetaSchema,
	})
	.loose();

export type UsageBillingEventsResponse = z.infer<
	typeof UsageBillingEventsResponseSchema
>;

// ── account.billing ─────────────────────────────────────────────────────────

const AccountBillingInputSchema = z.object({});

export type AccountBillingInput = z.infer<typeof AccountBillingInputSchema>;

const AccountBillingResponseSchema = z
	.object({
		username: z.string(),
		credits: z
			.object({
				current_balance: z.number(),
				currency: z.string(),
			})
			.loose()
			.optional(),
	})
	.loose();

export type AccountBillingResponse = z.infer<
	typeof AccountBillingResponseSchema
>;

// ── files.upload ────────────────────────────────────────────────────────────

const FilesUploadInputSchema = z.object({
	contentBase64: z
		.string()
		.min(1)
		.describe('The file’s bytes, base64 encoded (a data: URL prefix is fine).'),
	contentType: z
		.string()
		.min(3)
		.describe('MIME type, for example image/png or audio/wav.'),
	fileName: z.string().min(1).optional(),
});

export type FilesUploadInput = z.infer<typeof FilesUploadInputSchema>;

const FilesUploadResponseSchema = z.object({
	file_url: z
		.string()
		.describe(
			'Public fal CDN URL to pass as a model input (image_url, audio_url...).',
		),
	file_name: z.string(),
	content_type: z.string(),
	size: z.number().int(),
});

export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;

export const FilesUploadInitiateResponseSchema = z
	.object({
		upload_url: z.string(),
		file_url: z.string(),
	})
	.loose();

// ── Maps ────────────────────────────────────────────────────────────────────

export type FalEndpointInputs = {
	queueSubmit: QueueSubmitInput;
	queueStatus: QueueStatusInput;
	queueResult: QueueResultInput;
	queueCancel: QueueCancelInput;
	modelsRun: ModelsRunInput;
	modelsSearch: ModelsSearchInput;
	modelsPricing: ModelsPricingInput;
	modelsEstimateCost: ModelsEstimateCostInput;
	requestsList: RequestsListInput;
	requestsDeletePayloads: RequestsDeletePayloadsInput;
	usageGet: UsageGetInput;
	usageBillingEvents: UsageBillingEventsInput;
	accountBilling: AccountBillingInput;
	filesUpload: FilesUploadInput;
};

export type FalEndpointOutputs = {
	queueSubmit: QueueSubmitResponse;
	queueStatus: QueueStatusResponse;
	queueResult: QueueResultResponse;
	queueCancel: QueueCancelResponse;
	modelsRun: ModelsRunResponse;
	modelsSearch: ModelsSearchResponse;
	modelsPricing: ModelsPricingResponse;
	modelsEstimateCost: ModelsEstimateCostResponse;
	requestsList: RequestsListResponse;
	requestsDeletePayloads: RequestsDeletePayloadsResponse;
	usageGet: UsageGetResponse;
	usageBillingEvents: UsageBillingEventsResponse;
	accountBilling: AccountBillingResponse;
	filesUpload: FilesUploadResponse;
};

export const FalEndpointInputSchemas = {
	queueSubmit: QueueSubmitInputSchema,
	queueStatus: QueueStatusInputSchema,
	queueResult: QueueResultInputSchema,
	queueCancel: QueueCancelInputSchema,
	modelsRun: ModelsRunInputSchema,
	modelsSearch: ModelsSearchInputSchema,
	modelsPricing: ModelsPricingInputSchema,
	modelsEstimateCost: ModelsEstimateCostInputSchema,
	requestsList: RequestsListInputSchema,
	requestsDeletePayloads: RequestsDeletePayloadsInputSchema,
	usageGet: UsageGetInputSchema,
	usageBillingEvents: UsageBillingEventsInputSchema,
	accountBilling: AccountBillingInputSchema,
	filesUpload: FilesUploadInputSchema,
} as const;

export const FalEndpointOutputSchemas = {
	queueSubmit: QueueSubmitResponseSchema,
	queueStatus: QueueStatusResponseSchema,
	queueResult: QueueResultResponseSchema,
	queueCancel: QueueCancelResponseSchema,
	modelsRun: ModelsRunResponseSchema,
	modelsSearch: ModelsSearchResponseSchema,
	modelsPricing: ModelsPricingResponseSchema,
	modelsEstimateCost: ModelsEstimateCostResponseSchema,
	requestsList: RequestsListResponseSchema,
	requestsDeletePayloads: RequestsDeletePayloadsResponseSchema,
	usageGet: UsageGetResponseSchema,
	usageBillingEvents: UsageBillingEventsResponseSchema,
	accountBilling: AccountBillingResponseSchema,
	filesUpload: FilesUploadResponseSchema,
} as const;
