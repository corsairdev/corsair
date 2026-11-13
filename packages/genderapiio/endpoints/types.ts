import { z } from 'zod';

/**
 * GenderAPI.io splits a prediction into three parts: what was asked (`input`),
 * what the dataset or AI concluded (`gender`, `confidence`, `source`), and what
 * it cost (`meta.usage`). `gender` is null when nothing could be inferred, which
 * is a valid, billed result rather than an error.
 */
const InputSchema = z.object({
	type: z.enum(['name', 'email', 'username']),
	value: z.string(),
	country: z.string().nullable().optional(),
	forceToGenderize: z.boolean().optional(),
});

/** The dataset candidate that matched, or nulls when AI answered. */
const MatchSchema = z.object({
	name: z.string().nullable(),
	/** `normalized`, `token`, `substring`, or `model_inference` for AI. */
	method: z.string().nullable(),
	/** `country` or `global`. */
	scope: z.string().nullable(),
	country: z.string().nullable(),
});

const PredictionSchema = z.object({
	input: InputSchema,
	/** The name that was actually looked up. */
	name: z.string().nullable(),
	/** `male`, `female`, or null when nothing could be inferred. */
	gender: z.string().nullable(),
	country: z.string().nullable(),
	/** Between 0 and 1. Not a calibrated probability, per the docs. */
	confidence: z.number().nullable(),
	/** `observed_frequency` for the dataset, `model_reported` for AI. */
	confidence_kind: z.string().nullable(),
	/** Records behind a dataset answer; null for AI. */
	sample_count: z.number().nullable(),
	/** `dataset`, `ai` or `none`. */
	source: z.string(),
	/** `identified` or `unknown`. */
	result_status: z.string().nullable().optional(),
	/** Why an `unknown` came back. */
	reason: z.string().nullable().optional(),
	/** Whether the country came from the dataset or from AI. */
	country_source: z.string().nullable().optional(),
	match: MatchSchema.optional(),
});

/** What the call cost and where the allowance stands. */
const UsageSchema = z.object({
	/** Net charge of this operation; null when billing is unconfirmed. */
	charged_credits: z.number().nullable().optional(),
	remaining_credits: z.number().nullable().optional(),
	/** `confirmed`, `unconfirmed` or `not_charged`. */
	billing_status: z.string().optional(),
	/** When a trial allowance resets. */
	resets_at: z.string().nullable().optional(),
	limit: z.number().nullable().optional(),
	period_seconds: z.number().nullable().optional(),
});

const AccessSchema = z.object({
	/** `api_key`, `ip_trial` or `unauthenticated`. */
	mode: z.string(),
	reason: z.string().nullable().optional(),
});

const MetaSchema = z.object({
	request_id: z.string(),
	duration_ms: z.number().optional(),
	access: AccessSchema.optional(),
	usage: UsageSchema.optional(),
});

const SingleResponseSchema = z.object({
	data: PredictionSchema,
	meta: MetaSchema,
});

/** A batch reports one entry per item, and an item can fail on its own. */
const BatchItemSchema = z.object({
	index: z.number(),
	id: z.string().optional(),
	charged_credits: z.number().optional(),
	data: PredictionSchema.optional(),
	/**
	 * Present instead of `data` when this one item failed: a problem document
	 * like a whole-request failure (`code`, `status`, `title`, `detail`,
	 * `action`, field `errors`), not a bare message.
	 */
	error: z
		.object({
			code: z.string().optional(),
			status: z.number().optional(),
			title: z.string().optional(),
			detail: z.string().optional(),
			action: z.string().optional(),
			errors: z
				.array(
					z.object({
						pointer: z.string().optional(),
						message: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
});

const BatchSummarySchema = z.object({
	total: z.number(),
	succeeded: z.number(),
	identified: z.number(),
	unknown: z.number(),
	failed: z.number(),
});

const BatchResponseSchema = z.object({
	data: z.array(BatchItemSchema),
	meta: MetaSchema.extend({ summary: BatchSummarySchema.optional() }),
});

const PhoneResponseSchema = z.object({
	data: z.object({
		valid: z.boolean(),
		possible: z.boolean(),
		/** The number in E.164 form, or null when it cannot be formatted. */
		e164: z.string().nullable(),
		country: z.string().nullable(),
		country_calling_code: z.number().nullable(),
	}),
	meta: MetaSchema,
});

const UsageResponseSchema = z.object({
	data: z.object({
		remaining_credits: z.number(),
		expires_at: z.string().nullable(),
		/** When a trial allowance resets; not a subscription expiry. */
		resets_at: z.string().nullable().optional(),
		limit: z.number().nullable().optional(),
		period_seconds: z.number().nullable().optional(),
	}),
	meta: MetaSchema,
});

const CapabilitiesResponseSchema = z.object({
	version: z.string(),
	documentation: z.string().optional(),
	capabilities: z
		.object({
			ai: z.boolean().optional(),
			forceToGenderize: z.boolean().optional(),
			max_batch_items: z.number().optional(),
			shared_v1_keys_and_credits: z.boolean().optional(),
			ip_trial: z
				.object({ credits: z.number(), period_hours: z.number() })
				.optional(),
			default_ai_mode: z
				.object({ single: z.string(), batch: z.string() })
				.optional(),
		})
		.optional(),
	billing_consistency: z.string().optional(),
});

const ErrorEntrySchema = z.object({
	code: z.string(),
	http_statuses: z.array(z.number()),
	/** What the catalog says a caller should do, such as `check_credentials`. */
	action: z.string(),
	description: z.string(),
});

const ErrorCatalogResponseSchema = z.object({
	errors: z.record(z.string(), ErrorEntrySchema),
});

const AiModeSchema = z
	.enum(['off', 'fallback', 'always'])
	.describe(
		'`fallback` lets AI answer when the dataset cannot (1 credit in total); `off` is dataset only; `always` forces AI (2 credits)',
	);

const CountrySchema = z
	.string()
	.length(2, 'Use a two-letter ISO 3166-1 alpha-2 country code, such as US')
	.describe(
		'Two-letter ISO 3166-1 alpha-2 country code, which scopes the lookup',
	);

const GenderInputSchema = z.object({
	/** `name`, `email` or `username`. A username is a nickname, so AI answers it. */
	type: z
		.enum(['name', 'email', 'username'])
		.describe(
			'What the value is: a first or full name, an email address, or a username or nickname',
		),
	value: z
		.string()
		.min(1, 'A value is required')
		.max(254, 'At most 254 characters')
		.describe('The name, email address or username to infer from'),
	country: CountrySchema.optional().describe(
		'Scopes the lookup to one country, which changes the answer for names such as Kim',
	),
	ai_mode: AiModeSchema.optional(),
	forceToGenderize: z
		.boolean()
		.optional()
		.describe(
			'Resolves more names by falling back to nickname-based AI. A dataset hit costs 1 credit, an AI one 2. Cannot be combined with `ai_mode` `off` or `always`',
		),
});

const GenderBatchInputSchema = z.object({
	items: z
		.array(
			z.object({
				id: z
					.string()
					.min(1)
					.max(64)
					.optional()
					.describe(
						'Your own ID for this item, echoed back so a response can be matched to a row',
					),
				type: z.enum(['name', 'email', 'username']),
				value: z.string().min(1).max(254),
				country: CountrySchema.optional(),
				forceToGenderize: z.boolean().optional(),
				ai_mode: AiModeSchema.optional().describe(
					'AI mode for this item only, overriding the batch-wide `ai_mode`',
				),
			}),
		)
		.min(1, 'Send at least one item')
		.max(50, 'GenderAPI.io accepts at most 50 items in a batch')
		.describe(
			'Items to infer, answered in the same order, each with its own charge. An item can fail without failing the batch',
		),
	ai_mode: AiModeSchema.optional().describe(
		'Applies to every item without its own `ai_mode`. A batch defaults to `off`, where a single request defaults to `fallback`',
	),
});

const PhoneInputSchema = z.object({
	number: z
		.string()
		.min(3)
		.max(32)
		.describe('The phone number, with or without a country calling code'),
	country: CountrySchema.optional().describe(
		'The country to parse the number in, when it has no calling code',
	),
});

export type GenderApiIoGenderInput = z.infer<typeof GenderInputSchema>;
export type GenderApiIoGenderResponse = z.infer<typeof SingleResponseSchema>;
export type GenderApiIoGenderBatchInput = z.infer<
	typeof GenderBatchInputSchema
>;
export type GenderApiIoGenderBatchResponse = z.infer<
	typeof BatchResponseSchema
>;
export type GenderApiIoPhoneInput = z.infer<typeof PhoneInputSchema>;
export type GenderApiIoPhoneResponse = z.infer<typeof PhoneResponseSchema>;
export type GenderApiIoUsageResponse = z.infer<typeof UsageResponseSchema>;
export type GenderApiIoCapabilitiesResponse = z.infer<
	typeof CapabilitiesResponseSchema
>;
export type GenderApiIoErrorCatalogResponse = z.infer<
	typeof ErrorCatalogResponseSchema
>;
export type GenderApiIoPrediction = z.infer<typeof PredictionSchema>;
export type GenderApiIoBatchItem = z.infer<typeof BatchItemSchema>;
export type GenderApiIoUsage = z.infer<typeof UsageSchema>;
export type GenderApiIoAccess = z.infer<typeof AccessSchema>;

export type GenderApiIoEndpointInputs = {
	gender: GenderApiIoGenderInput;
	genderBatch: GenderApiIoGenderBatchInput;
	phoneValidate: GenderApiIoPhoneInput;
	usage: Record<string, never>;
	capabilities: Record<string, never>;
	errorCatalog: Record<string, never>;
};

export type GenderApiIoEndpointOutputs = {
	gender: GenderApiIoGenderResponse;
	genderBatch: GenderApiIoGenderBatchResponse;
	phoneValidate: GenderApiIoPhoneResponse;
	usage: GenderApiIoUsageResponse;
	capabilities: GenderApiIoCapabilitiesResponse;
	errorCatalog: GenderApiIoErrorCatalogResponse;
};

const EmptyInputSchema = z.object({});

export const GenderApiIoEndpointInputSchemas = {
	gender: GenderInputSchema,
	genderBatch: GenderBatchInputSchema,
	phoneValidate: PhoneInputSchema,
	usage: EmptyInputSchema,
	capabilities: EmptyInputSchema,
	errorCatalog: EmptyInputSchema,
} as const;

export const GenderApiIoEndpointOutputSchemas = {
	gender: SingleResponseSchema,
	genderBatch: BatchResponseSchema,
	phoneValidate: PhoneResponseSchema,
	usage: UsageResponseSchema,
	capabilities: CapabilitiesResponseSchema,
	errorCatalog: ErrorCatalogResponseSchema,
} as const;
