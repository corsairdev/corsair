import { z } from 'zod';

// Inputs use Listclean's own parameter names. Outputs are `.loose()` and their
// optional fields nullish, so a field Listclean adds or omits cannot fail a
// call that has already happened. Field reference: https://api.listclean.xyz/
// (the OpenAPI spec at /v1/spec.json).

const EmailAddressSchema = z
	.string()
	.min(1)
	.describe(
		'An email address. Sent unchanged: an undecodable one comes back as `status: "error"` rather than being rejected here.',
	);

// The verification verdict. Kept as an enum: it is the product's fixed
// vocabulary, and a value outside it should fail loudly, not read as data.
export const LISTCLEAN_VERIFICATION_STATUSES = [
	'clean',
	'dirty',
	'unknown',
	'error',
] as const;

const VerificationStatusSchema = z.enum(LISTCLEAN_VERIFICATION_STATUSES);

/** Where a verification came from, as the logs and analytics filters spell it. */
export const LISTCLEAN_SOURCES = [
	'api',
	'file_upload',
	'single_email',
] as const;

const SourceSchema = z.enum(LISTCLEAN_SOURCES);

/** The result types a list can be downloaded as. */
export const LISTCLEAN_RESULT_TYPES = ['clean', 'dirty', 'unknown'] as const;

const ResultTypeSchema = z.enum(LISTCLEAN_RESULT_TYPES);

/** The list lifecycle, uppercase in this flow (the upload flow is lowercase). */
export const LISTCLEAN_LIST_STATUSES = [
	'SUBMITTED',
	'INPROCESS',
	'COMPLETED',
] as const;

const ListStatusSchema = z.enum(LISTCLEAN_LIST_STATUSES);

// The spec types these as integers but its own examples send both spellings
// (`"count": {"example": "8"}` in one summary, `8` in another), so either is
// accepted rather than betting on one.
// unknown: the provider's own spec and examples disagree on the type.
const CountValueSchema = z.union([z.number(), z.string()]);

const CountPercentSchema = z
	.object({
		count: CountValueSchema.nullish(),
		perc: CountValueSchema.nullish(),
	})
	.loose();

/** One address's verification result, as verify and the JSON download send it. */
export const VerificationSchema = z
	.object({
		datetime: z.string().nullish(),
		email: z.string(),
		status: VerificationStatusSchema,
		remarks: z.string().nullish(),
		disposable: z.boolean().nullish(),
		role_based: z.boolean().nullish(),
		mx_found: z.boolean().nullish(),
		mx_records: z.string().nullish(),
		msp: z.string().nullish(),
		email_user: z.string().nullish(),
		email_domain: z.string().nullish(),
		free_email: z.boolean().nullish(),
	})
	.loose();

export type ListcleanVerification = z.infer<typeof VerificationSchema>;

const LogSchema = z
	.object({
		id: z.number().int().nullish(),
		entered: z.string().nullish(),
		email: z.string().nullish(),
		status: VerificationStatusSchema.nullish(),
		remarks: z.string().nullish(),
		credits_deducted: z.number().int().nullish(),
		// A string here, unlike the integer error_code on the envelope.
		error_code: z.string().nullish(),
	})
	.loose();

const ListAnalyticsSchema = z
	.object({
		summary: z
			.object({
				total: z.number().int().nullish(),
				duplicate: z.number().int().nullish(),
				dirty: CountPercentSchema.nullish(),
				clean: CountPercentSchema.nullish(),
			})
			.loose()
			.nullish(),
		dirty_summary: z
			.array(
				z
					.object({
						count: CountValueSchema.nullish(),
						perc: CountValueSchema.nullish(),
						dirty_type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		clean_summary: z
			.array(
				z
					.object({
						count: CountValueSchema.nullish(),
						perc: CountValueSchema.nullish(),
						clean_type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose()
	.nullish();

const ListCostSchema = z
	.object({
		rate: z
			.object({
				INR: z.number().nullish(),
				USD: z.number().nullish(),
			})
			.loose()
			.nullish(),
		cost: z
			.object({
				INR: z.number().nullish(),
				USD: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose()
	.nullish();

/** One bulk list, as /lists/ and /lists/{list_id} send it. */
export const ListSchema = z
	.object({
		list_id: z.number().int(),
		filename: z.string().nullish(),
		size_in_bytes: z.number().int().nullish(),
		request_time: z.string().nullish(),
		status: ListStatusSchema.nullish(),
		// A string on this route, although the upload flow uses integer ids.
		upload_id: z.string().nullish(),
		analytics: ListAnalyticsSchema,
		cost: ListCostSchema,
	})
	.loose();

export type ListcleanList = z.infer<typeof ListSchema>;

/** YYYY-MM-DD, the format the logs and analytics ranges are written in. */
const DateStringSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the YYYY-MM-DD date format.')
	.describe('A date in YYYY-MM-DD format.');

type RangeInput = { start_date: string; end_date: string };

// The range rules are checked here rather than left to the provider, so a bad
// range fails before it can cost a call. The future rule is documented on both
// routes' end_date; the 30-day cap only on the logs route. Unparseable dates
// are left to the format check above.
function refineRange(maxDays?: number) {
	return (value: RangeInput, refine: z.RefinementCtx) => {
		const start = Date.parse(value.start_date);
		const end = Date.parse(value.end_date);
		if (Number.isNaN(start) || Number.isNaN(end)) return;
		if (end < start) {
			refine.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['end_date'],
				message: 'end_date must not be before start_date.',
			});
		}
		if (end > Date.now()) {
			refine.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['end_date'],
				message: 'end_date cannot be in the future.',
			});
		}
		if (maxDays !== undefined && end - start > maxDays * 86_400_000) {
			refine.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['end_date'],
				message: `The date range must be ${maxDays} days or less.`,
			});
		}
	};
}

const ListIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		'The list id, as `startBatchVerification` answered it or `listLists` reported it.',
	);

// ── verify.verifyEmail ────────────────────────────────────────────────────

const VerifyEmailInputSchema = z.object({
	email: EmailAddressSchema.describe('The address to verify.'),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

const VerifyEmailResponseSchema = VerificationSchema;

export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// ── verify.startBatchVerification ─────────────────────────────────────────

/** The largest batch the API accepts per request. */
export const LISTCLEAN_BATCH_MAX = 3000;

const StartBatchVerificationInputSchema = z.object({
	emails: z
		.array(EmailAddressSchema)
		.min(1)
		.max(LISTCLEAN_BATCH_MAX)
		.describe(
			`Up to ${LISTCLEAN_BATCH_MAX} addresses. Each one spends a credit when the job runs.`,
		),
	filename: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Name shown for the list. When omitted, Listclean generates batch_upload-DD-MM-YYYY-HHMMSS-utc.csv.',
		),
});

export type StartBatchVerificationInput = z.infer<
	typeof StartBatchVerificationInputSchema
>;

const StartBatchVerificationResponseSchema = z
	.object({
		list_id: z
			.number()
			.int()
			.describe('The async job id; poll it with `lists.getList`.'),
	})
	.loose();

export type StartBatchVerificationResponse = z.infer<
	typeof StartBatchVerificationResponseSchema
>;

// ── verify.getVerificationLogs ────────────────────────────────────────────

const GetVerificationLogsInputSchema = z
	.object({
		start_date: DateStringSchema.describe(
			'Range start. The maximum range is 30 days.',
		),
		end_date: DateStringSchema.describe(
			'Range end. It cannot be in the future.',
		),
		email: EmailAddressSchema.optional().describe('Only this address.'),
		source: SourceSchema.optional().describe('Only this verification source.'),
		status: VerificationStatusSchema.optional().describe('Only this verdict.'),
		start: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Zero-based page offset.'),
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Page size, at most 100. Defaults to 10.'),
	})
	.superRefine(refineRange(30));

export type GetVerificationLogsInput = z.infer<
	typeof GetVerificationLogsInputSchema
>;

const GetVerificationLogsResponseSchema = z.array(LogSchema);

export type GetVerificationLogsResponse = z.infer<
	typeof GetVerificationLogsResponseSchema
>;

// ── verify.getAnalytics ───────────────────────────────────────────────────

const GetAnalyticsInputSchema = z
	.object({
		start_date: DateStringSchema.describe('Range start.'),
		end_date: DateStringSchema.describe(
			'Range end. It cannot be in the future.',
		),
		source: SourceSchema.optional().describe('Only this verification source.'),
		status: VerificationStatusSchema.optional().describe('Only this verdict.'),
	})
	.superRefine(refineRange());

export type GetAnalyticsInput = z.infer<typeof GetAnalyticsInputSchema>;

const GetAnalyticsResponseSchema = z
	.object({
		// unknown: the spec leaves all three summary shapes bare ("Aggregate
		// counts and percentages by verification status"), and no public sample
		// shows their inner fields, so they pass through as Listclean sends
		// them rather than being invented here.
		total_summary: z.record(z.string(), z.unknown()).nullish(),
		datewise_summary: z.record(z.string(), z.unknown()).nullish(),
		graph_summary: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type GetAnalyticsResponse = z.infer<typeof GetAnalyticsResponseSchema>;

// ── lists.listLists ───────────────────────────────────────────────────────

const ListListsInputSchema = z.object({});

export type ListListsInput = z.infer<typeof ListListsInputSchema>;

const ListListsResponseSchema = z
	.object({
		total: z.number().int().nullish(),
		// Opaque page token; Listclean documents no way to send it back, so it
		// is surfaced for callers that want to watch it.
		cursor: z.number().int().nullish(),
		lists: z.array(ListSchema),
	})
	.loose();

export type ListListsResponse = z.infer<typeof ListListsResponseSchema>;

// ── lists.getList ─────────────────────────────────────────────────────────

const GetListInputSchema = z.object({ list_id: ListIdSchema });

export type GetListInput = z.infer<typeof GetListInputSchema>;

// Listclean answers with an array holding the one list, not an object. The
// endpoint unwraps that one element into `list`, so callers read the bulk
// job's status at `list.status` instead of an array index.
const GetListResponseSchema = z
	.object({
		list: ListSchema.describe('The one list with this id.'),
	})
	.loose()
	.describe(
		'The list Listclean answered for this id. Its status moves SUBMITTED, INPROCESS, COMPLETED as a batch job runs.',
	);

export type GetListResponse = z.infer<typeof GetListResponseSchema>;

// ── lists.getListResults ──────────────────────────────────────────────────

const GetListResultsInputSchema = z.object({
	list_id: ListIdSchema,
	type: ResultTypeSchema.describe(
		'Which verified rows to download: the clean, dirty or unknown ones.',
	),
});

export type GetListResultsInput = z.infer<typeof GetListResultsInputSchema>;

const GetListResultsResponseSchema = z
	.array(VerificationSchema)
	.describe(
		'The verified rows of that type, each shaped like a `verify.verifyEmail` result.',
	);

export type GetListResultsResponse = z.infer<
	typeof GetListResultsResponseSchema
>;

// ── lists.delete ──────────────────────────────────────────────────────────

const DeleteListInputSchema = z.object({ list_id: ListIdSchema });

export type DeleteListInput = z.infer<typeof DeleteListInputSchema>;

// The delete answer documents `message` in place of data ("Lists deleted
// successfully"), and the string must arrive for the call to count as a
// success.
const DeleteListResponseSchema = z.object({ message: z.string() }).loose();

export type DeleteListResponse = z.infer<typeof DeleteListResponseSchema>;

// ── account.getCredits ────────────────────────────────────────────────────

const GetCreditsInputSchema = z.object({});

export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

const GetCreditsResponseSchema = z
	.object({
		credits: z
			.number()
			.int()
			.describe(
				'The balance left. A verification spends one credit per address.',
			),
	})
	.loose();

export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ListcleanEndpointInputs = {
	verifyVerifyEmail: VerifyEmailInput;
	verifyStartBatchVerification: StartBatchVerificationInput;
	verifyGetVerificationLogs: GetVerificationLogsInput;
	verifyGetAnalytics: GetAnalyticsInput;
	listsListLists: ListListsInput;
	listsGetList: GetListInput;
	listsGetListResults: GetListResultsInput;
	listsDelete: DeleteListInput;
	accountGetCredits: GetCreditsInput;
};

export type ListcleanEndpointOutputs = {
	verifyVerifyEmail: VerifyEmailResponse;
	verifyStartBatchVerification: StartBatchVerificationResponse;
	verifyGetVerificationLogs: GetVerificationLogsResponse;
	verifyGetAnalytics: GetAnalyticsResponse;
	listsListLists: ListListsResponse;
	listsGetList: GetListResponse;
	listsGetListResults: GetListResultsResponse;
	listsDelete: DeleteListResponse;
	accountGetCredits: GetCreditsResponse;
};

export const ListcleanEndpointInputSchemas = {
	verifyVerifyEmail: VerifyEmailInputSchema,
	verifyStartBatchVerification: StartBatchVerificationInputSchema,
	verifyGetVerificationLogs: GetVerificationLogsInputSchema,
	verifyGetAnalytics: GetAnalyticsInputSchema,
	listsListLists: ListListsInputSchema,
	listsGetList: GetListInputSchema,
	listsGetListResults: GetListResultsInputSchema,
	listsDelete: DeleteListInputSchema,
	accountGetCredits: GetCreditsInputSchema,
} as const;

export const ListcleanEndpointOutputSchemas = {
	verifyVerifyEmail: VerifyEmailResponseSchema,
	verifyStartBatchVerification: StartBatchVerificationResponseSchema,
	verifyGetVerificationLogs: GetVerificationLogsResponseSchema,
	verifyGetAnalytics: GetAnalyticsResponseSchema,
	listsListLists: ListListsResponseSchema,
	listsGetList: GetListResponseSchema,
	listsGetListResults: GetListResultsResponseSchema,
	listsDelete: DeleteListResponseSchema,
	accountGetCredits: GetCreditsResponseSchema,
} as const;
