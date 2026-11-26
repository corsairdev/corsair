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

// The verification verdict. Inputs (filters) take only the documented values;
// outputs also accept any other string, so a verdict Listclean adds later
// cannot fail a call whose credit is already spent.
export const LISTCLEAN_VERIFICATION_STATUSES = [
	'clean',
	'dirty',
	'unknown',
	'error',
] as const;

const VerificationStatusSchema = z.enum(LISTCLEAN_VERIFICATION_STATUSES);

const VerificationStatusOutputSchema = z.union([
	VerificationStatusSchema,
	z.string(),
]);

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

// Output only, so an undocumented status (a failed state, say) reads as data.
const ListStatusSchema = z.union([z.enum(LISTCLEAN_LIST_STATUSES), z.string()]);

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
		status: VerificationStatusOutputSchema,
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
		status: VerificationStatusOutputSchema.nullish(),
		remarks: z.string().nullish(),
		credits_deducted: z.number().int().nullish(),
		// A string here, unlike the integer error_code on the envelope.
		error_code: z.string().nullish(),
		// Sent by the live API (2026-11-26), absent from the spec.
		instance_name: z.string().nullish(),
		source: z.string().nullish(),
		reason_code: z.string().nullish(),
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
		// Sent by the live API (2026-11-26): "54 bytes", and 1 once the
		// results can be downloaded.
		size_for_human: z.string().nullish(),
		allow_download: z.number().int().nullish(),
		analytics: ListAnalyticsSchema,
		cost: ListCostSchema,
	})
	.loose();

export type ListcleanList = z.infer<typeof ListSchema>;

/** YYYY-MM-DD, the format the logs and analytics ranges are written in. */
const DateStringSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the YYYY-MM-DD date format.')
	.refine(isCalendarDate, 'Not a real calendar date.')
	.describe('A date in YYYY-MM-DD format.');

/** True for a YYYY-MM-DD string that names a real day (2024-02-29 yes, 2026-02-30 no). */
export function isCalendarDate(value: string): boolean {
	const [year, month, day] = value.split('-').map(Number);
	if (!year || !month || !day) return false;
	const date = new Date(Date.UTC(year, month - 1, day));
	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day
	);
}

// The earliest UTC offset is UTC+14, so "today" somewhere can be this far
// ahead of UTC midnight; an end_date that is today in the caller's zone
// passes, and Listclean (which answers in IST) has the final word.
const TODAY_ANYWHERE_MS = 14 * 3_600_000;

type RangeInput = { start_date: string; end_date: string };

// The range rules are checked here rather than left to the provider, so a bad
// range fails before the call. The future rule is documented on both routes'
// end_date; the 30-day cap only on the logs route. Impossible dates are left
// to the calendar check above.
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
		if (end > Date.now() + TODAY_ANYWHERE_MS) {
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

// The spec types the data as a bare array; the live API answers
// { logs, total_count } (2026-11-26).
const GetVerificationLogsResponseSchema = z
	.object({
		logs: z.array(LogSchema),
		total_count: CountValueSchema.nullish(),
	})
	.loose();

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
		// The spec leaves all three shapes bare; these are what the live API
		// answered (2026-11-26). total_summary maps a status (total, clean,
		// dirty, unknown, error) to { count, perc }.
		total_summary: z.record(z.string(), CountPercentSchema).nullish(),
		// One total_summary per day, keyed YYYYMMDD.
		datewise_summary: z
			.record(z.string(), z.record(z.string(), CountPercentSchema))
			.nullish(),
		// Parallel arrays: dates, then <status>_counts and <status>_percs.
		graph_summary: z
			.record(z.string(), z.array(z.union([z.string(), z.number()])))
			.nullish(),
	})
	.loose();

export type GetAnalyticsResponse = z.infer<typeof GetAnalyticsResponseSchema>;

// ── lists.listLists ───────────────────────────────────────────────────────

const ListListsInputSchema = z.object({});

export type ListListsInput = z.infer<typeof ListListsInputSchema>;

const ListListsResponseSchema = z
	.object({
		// The live API sends total as a string ("0"); the spec says integer.
		total: CountValueSchema.nullish(),
		// Opaque page token; Listclean documents no way to send it back, so it
		// is surfaced for callers that want to watch it.
		cursor: CountValueSchema.nullish(),
		lists: z.array(ListSchema),
	})
	.loose();

export type ListListsResponse = z.infer<typeof ListListsResponseSchema>;

// ── lists.getList ─────────────────────────────────────────────────────────

const GetListInputSchema = z.object({ list_id: ListIdSchema });

export type GetListInput = z.infer<typeof GetListInputSchema>;

// The spec shows an array holding the one list; the live API answers the
// object. The endpoint puts the list under `list` either way, so callers read
// the bulk job's status at `list.status`.
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

// The live download rows (2026-11-26) carry reason_code, reason, mx and the
// uploaded columns in attributes, beside the verify result's fields.
const ResultRowSchema = VerificationSchema.extend({
	reason_code: z.string().nullish(),
	reason: z.string().nullish(),
	mx: z.string().nullish(),
	// unknown: the columns of the caller's own uploaded file, by header name.
	attributes: z.record(z.string(), z.unknown()).nullish(),
});

const GetListResultsResponseSchema = z
	.array(ResultRowSchema)
	.describe(
		'The verified rows of that type: email, status, reason_code and reason, the MX and mail provider, and the uploaded columns in attributes.',
	);

export type GetListResultsResponse = z.infer<
	typeof GetListResultsResponseSchema
>;

// ── lists.getListResultsCsv ───────────────────────────────────────────────

const GetListResultsCsvInputSchema = GetListResultsInputSchema;

export type GetListResultsCsvInput = z.infer<
	typeof GetListResultsCsvInputSchema
>;

const GetListResultsCsvResponseSchema = z.object({
	csv: z
		.string()
		.describe(
			'The CSV file of that type, exactly as Listclean sent it, header row included.',
		),
});

export type GetListResultsCsvResponse = z.infer<
	typeof GetListResultsCsvResponseSchema
>;

// ── lists.delete ──────────────────────────────────────────────────────────

const DeleteListInputSchema = z.object({ list_id: ListIdSchema });

export type DeleteListInput = z.infer<typeof DeleteListInputSchema>;

// The delete answer documents `message` in place of data ("Lists deleted
// successfully"), and the string must arrive for the call to count as a
// success.
const DeleteListResponseSchema = z.object({ message: z.string() }).loose();

export type DeleteListResponse = z.infer<typeof DeleteListResponseSchema>;

// ── uploads ───────────────────────────────────────────────────────────────

const UploadIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The upload id `uploads.startUpload` answered.');

// The list route sends progress as "100%" and the status route as 21, so
// either spelling is read.
// unknown: the provider's two routes disagree on the type.
const ProgressSchema = z.union([z.number(), z.string()]);

const ListUploadsInputSchema = z.object({});

export type ListUploadsInput = z.infer<typeof ListUploadsInputSchema>;

// The spec's example rows carry upload_id and progress; the live API
// (2026-11-26) answers id, a lowercase status and the file's details, with
// no progress. Both spellings are read.
const ListUploadsResponseSchema = z.array(
	z
		.object({
			id: z.number().int().nullish(),
			upload_id: z.number().int().nullish(),
			// "COMPLETED" in the spec example, "success"/"error" live: free text.
			status: z.string().nullish(),
			progress: ProgressSchema.nullish(),
			entered: z.string().nullish(),
			client_filename: z.string().nullish(),
			filename: z.string().nullish(),
			count: z.number().int().nullish(),
			total_records: z.number().int().nullish(),
			stage: z.string().nullish(),
			remarks: z.string().nullish(),
			fast_process: z.number().int().nullish(),
		})
		.loose(),
);

export type ListUploadsResponse = z.infer<typeof ListUploadsResponseSchema>;

// A single-byte character: separator and enclosure take exactly one.
const SingleCharSchema = z.string().length(1);

const StartUploadInputSchema = z.object({
	filename: z
		.string()
		.min(1)
		.describe('Name of the file, shown on the list (e.g. `leads.csv`).'),
	file_type: z
		.string()
		.min(1)
		.describe('The file format. The spec documents `csv`.'),
	total_chunk_count: z
		.number()
		.int()
		.min(1)
		.describe('How many chunks `uploads.uploadChunk` will send.'),
	max_chunk_size: z
		.number()
		.int()
		.min(1)
		.describe('The largest chunk, in bytes before base64 encoding.'),
	// Not in the spec; the live API answers "email column index is required"
	// without it (2026-11-26).
	email_column_index: z
		.number()
		.int()
		.min(0)
		.describe(
			'Zero-based index of the CSV column holding the email address (0 is the first column). Required by the live API, though the spec omits it.',
		),
	separator_char: SingleCharSchema.optional().describe(
		'CSV field separator, e.g. `,`.',
	),
	enclosure_char: SingleCharSchema.optional().describe(
		'CSV field enclosure character, one single-byte character, e.g. `"`.',
	),
	escape_char: z
		.string()
		.max(1)
		.optional()
		.describe(
			'CSV escape character, at most one single-byte character; an empty string turns escaping off.',
		),
	fast_process: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe(
			'1 skips slow checks such as SMTP and uses only cache, DNS and format checks. Defaults to 0 (off).',
		),
});

export type StartUploadInput = z.infer<typeof StartUploadInputSchema>;

const StartUploadResponseSchema = z
	.object({
		upload_id: z
			.number()
			.int()
			.describe(
				'Send the chunks to this id, then poll it with `uploads.getUpload`.',
			),
	})
	.loose();

export type StartUploadResponse = z.infer<typeof StartUploadResponseSchema>;

const UploadChunkInputSchema = z.object({
	upload_id: UploadIdSchema,
	chunk_sequence_number: z
		.number()
		.int()
		.min(1)
		.describe(
			'Position of this chunk, counted from 1: the last chunk of a 24-chunk file is 24.',
		),
	content: z
		.string()
		.min(1)
		.regex(/^[A-Za-z0-9+/]+={0,2}$/, 'Send the chunk base64-encoded.')
		.describe('The chunk of the file, base64-encoded.'),
	md5_checksum: z
		.string()
		.regex(/^[a-f0-9]{32}$/i, 'An md5 hash is 32 hex characters.')
		.optional()
		.describe('md5 hash Listclean checks the file against, as hex.'),
});

export type UploadChunkInput = z.infer<typeof UploadChunkInputSchema>;

// The chunk counters arrive as strings, or `false` on an upload that never
// received its chunks (live, 2026-11-26).
const ChunkCountSchema = z.union([z.number(), z.string(), z.literal(false)]);

const ChunkDetailsSchema = z
	.object({
		total_chunk_count: ChunkCountSchema.nullish(),
		uploaded_chunk_count: ChunkCountSchema.nullish(),
	})
	.loose();

// The spec documents only `message` ("Chunk uploaded successfully"); the live
// answer also carries the chunk counters in data.
const UploadChunkResponseSchema = z
	.object({
		message: z.string(),
		chunk_details: ChunkDetailsSchema.nullish().describe(
			'How many chunks the upload expects and how many have arrived.',
		),
	})
	.loose();

export type UploadChunkResponse = z.infer<typeof UploadChunkResponseSchema>;

const GetUploadInputSchema = z.object({ upload_id: UploadIdSchema });

export type GetUploadInput = z.infer<typeof GetUploadInputSchema>;

const GetUploadResponseSchema = z
	.object({
		status: z
			.union([z.enum(['inprocess', 'success', 'error']), z.string()])
			.nullish()
			.describe(
				'Upload status: inprocess, success or error (lowercase, unlike the list statuses).',
			),
		progress: ProgressSchema.nullish().describe('Completion percentage.'),
		chunk_details: ChunkDetailsSchema.nullish(),
		request_id: z
			.number()
			.int()
			.nullish()
			.describe(
				'The list this upload became: pass it as list_id to `lists.getList`. 0 or null while no list exists.',
			),
	})
	.loose();

export type GetUploadResponse = z.infer<typeof GetUploadResponseSchema>;

// ── account.getProfile / account.updateProfile ────────────────────────────

const PROFILE_FIELDS = {
	name: 'First name of the user.',
	address: 'Street address.',
	city: 'City.',
	country: 'Country.',
	phone_number: 'Phone number.',
	skype_id: 'Skype id.',
	company_name: 'Company name.',
	website: 'Website.',
	twitter_handle: 'Twitter handle, e.g. `@example`.',
	linkedin: 'LinkedIn profile.',
	billing_name: 'Name on invoices.',
	billing_company_name: 'Company on invoices.',
	billing_address: 'Address on invoices.',
} as const;

type ProfileField = keyof typeof PROFILE_FIELDS;

const ProfileSchema = z
	.object(
		Object.fromEntries(
			Object.entries(PROFILE_FIELDS).map(([field, text]) => [
				field,
				z.string().nullish().describe(text),
			]),
		) as Record<ProfileField, z.ZodOptional<z.ZodNullable<z.ZodString>>>,
	)
	.loose();

const GetProfileInputSchema = z.object({});

export type GetProfileInput = z.infer<typeof GetProfileInputSchema>;

const GetProfileResponseSchema = ProfileSchema;

export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;

const UpdateProfileInputSchema = z
	.object(
		Object.fromEntries(
			Object.entries(PROFILE_FIELDS).map(([field, text]) => [
				field,
				z.string().optional().describe(text),
			]),
		) as Record<ProfileField, z.ZodOptional<z.ZodString>>,
	)
	.refine((value) => Object.values(value).some((v) => v !== undefined), {
		message: 'Set at least one profile field.',
	});

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

// The answer is the bare ApiResponse: success, message, error_code.
const UpdateProfileResponseSchema = z.object({ message: z.string() }).loose();

export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

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
	listsGetListResultsCsv: GetListResultsCsvInput;
	listsDelete: DeleteListInput;
	uploadsListUploads: ListUploadsInput;
	uploadsStartUpload: StartUploadInput;
	uploadsUploadChunk: UploadChunkInput;
	uploadsGetUpload: GetUploadInput;
	accountGetCredits: GetCreditsInput;
	accountGetProfile: GetProfileInput;
	accountUpdateProfile: UpdateProfileInput;
};

export type ListcleanEndpointOutputs = {
	verifyVerifyEmail: VerifyEmailResponse;
	verifyStartBatchVerification: StartBatchVerificationResponse;
	verifyGetVerificationLogs: GetVerificationLogsResponse;
	verifyGetAnalytics: GetAnalyticsResponse;
	listsListLists: ListListsResponse;
	listsGetList: GetListResponse;
	listsGetListResults: GetListResultsResponse;
	listsGetListResultsCsv: GetListResultsCsvResponse;
	listsDelete: DeleteListResponse;
	uploadsListUploads: ListUploadsResponse;
	uploadsStartUpload: StartUploadResponse;
	uploadsUploadChunk: UploadChunkResponse;
	uploadsGetUpload: GetUploadResponse;
	accountGetCredits: GetCreditsResponse;
	accountGetProfile: GetProfileResponse;
	accountUpdateProfile: UpdateProfileResponse;
};

export const ListcleanEndpointInputSchemas = {
	verifyVerifyEmail: VerifyEmailInputSchema,
	verifyStartBatchVerification: StartBatchVerificationInputSchema,
	verifyGetVerificationLogs: GetVerificationLogsInputSchema,
	verifyGetAnalytics: GetAnalyticsInputSchema,
	listsListLists: ListListsInputSchema,
	listsGetList: GetListInputSchema,
	listsGetListResults: GetListResultsInputSchema,
	listsGetListResultsCsv: GetListResultsCsvInputSchema,
	listsDelete: DeleteListInputSchema,
	uploadsListUploads: ListUploadsInputSchema,
	uploadsStartUpload: StartUploadInputSchema,
	uploadsUploadChunk: UploadChunkInputSchema,
	uploadsGetUpload: GetUploadInputSchema,
	accountGetCredits: GetCreditsInputSchema,
	accountGetProfile: GetProfileInputSchema,
	accountUpdateProfile: UpdateProfileInputSchema,
} as const;

export const ListcleanEndpointOutputSchemas = {
	verifyVerifyEmail: VerifyEmailResponseSchema,
	verifyStartBatchVerification: StartBatchVerificationResponseSchema,
	verifyGetVerificationLogs: GetVerificationLogsResponseSchema,
	verifyGetAnalytics: GetAnalyticsResponseSchema,
	listsListLists: ListListsResponseSchema,
	listsGetList: GetListResponseSchema,
	listsGetListResults: GetListResultsResponseSchema,
	listsGetListResultsCsv: GetListResultsCsvResponseSchema,
	listsDelete: DeleteListResponseSchema,
	uploadsListUploads: ListUploadsResponseSchema,
	uploadsStartUpload: StartUploadResponseSchema,
	uploadsUploadChunk: UploadChunkResponseSchema,
	uploadsGetUpload: GetUploadResponseSchema,
	accountGetCredits: GetCreditsResponseSchema,
	accountGetProfile: GetProfileResponseSchema,
	accountUpdateProfile: UpdateProfileResponseSchema,
} as const;
