/**
 * Request and response contracts for the Bouncer API.
 *
 * Every schema below mirrors the published OpenAPI documents linked from
 * https://docs.usebouncer.com/llms.txt. Each section cites the page it was
 * derived from, and each shape was additionally confirmed against live
 * responses from api.usebouncer.com.
 *
 * Where the documentation declares an `enum`, the schema uses `z.enum`.
 * Where it only shows example values (the job `status` fields), the schema
 * uses `z.string()` so that a newly introduced status cannot break parsing.
 */
import { z } from 'zod';

// ── Shared primitives ───────────────────────────────────────────────────────

/** Documented tri-state flag used by every domain/account attribute. */
export const BouncerFlagSchema = z.enum(['yes', 'no', 'unknown']);
export type BouncerFlag = z.infer<typeof BouncerFlagSchema>;

/** `EmailRecord.status` — declared as an enum in the OpenAPI components. */
export const EmailStatusSchema = z.enum([
	'deliverable',
	'risky',
	'undeliverable',
	'unknown',
]);
export type EmailStatus = z.infer<typeof EmailStatusSchema>;

/** `EmailRecord.reason` — declared as an enum in the OpenAPI components. */
export const EmailReasonSchema = z.enum([
	'accepted_email',
	'low_deliverability',
	'low_quality',
	'invalid_email',
	'invalid_domain',
	'rejected_email',
	'dns_error',
	'unavailable_smtp',
	'unsupported',
	'timeout',
	'unknown',
]);
export type EmailReason = z.infer<typeof EmailReasonSchema>;

export const DomainInfoSchema = z
	.object({
		name: z.string(),
		acceptAll: BouncerFlagSchema,
		disposable: BouncerFlagSchema,
		free: BouncerFlagSchema,
	})
	.passthrough();
export type DomainInfo = z.infer<typeof DomainInfoSchema>;

export const AccountInfoSchema = z
	.object({
		role: BouncerFlagSchema,
		disabled: BouncerFlagSchema,
		fullMailbox: BouncerFlagSchema,
	})
	.passthrough();
export type AccountInfo = z.infer<typeof AccountInfoSchema>;

export const DnsInfoSchema = z
	.object({
		type: z.string(),
		record: z.string().optional(),
	})
	.passthrough();
export type DnsInfo = z.infer<typeof DnsInfoSchema>;

/**
 * The `EmailRecord` component shared by the real-time verify response and
 * every entry of a batch result download.
 *
 * https://docs.usebouncer.com/api-reference/real-time/verify-email
 */
export const EmailRecordSchema = z
	.object({
		email: z.string(),
		status: EmailStatusSchema,
		reason: EmailReasonSchema,
		domain: DomainInfoSchema.optional(),
		account: AccountInfoSchema.optional(),
		dns: DnsInfoSchema.optional(),
		provider: z.string().optional(),
		score: z.number().int().min(0).max(100).optional(),
		toxic: z.string().optional(),
		toxicity: z.number().int().min(0).max(5).optional(),
		/** Present when a result was deferred by greylisting. */
		retryAfter: z.string().optional(),
		/** Present when Bouncer detects a likely typo in the address. */
		didYouMean: z.string().optional(),
	})
	.passthrough();
export type EmailRecord = z.infer<typeof EmailRecordSchema>;

// ── 1. Verify email ─────────────────────────────────────────────────────────
// GET /v1.1/email/verify
// https://docs.usebouncer.com/api-reference/real-time/verify-email

export const VerifyEmailInputSchema = z.object({
	email: z.string().min(1),
	/** Seconds to wait for a result. Documented default 10, maximum 30. */
	timeout: z.number().int().min(1).max(30).optional(),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

export const VerifyEmailResponseSchema = EmailRecordSchema;
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// ── 2. Verify domain ────────────────────────────────────────────────────────
// GET /v1.1/domain
// https://docs.usebouncer.com/api-reference/domain/verify-domain

export const VerifyDomainInputSchema = z.object({
	domain: z.string().min(1),
});
export type VerifyDomainInput = z.infer<typeof VerifyDomainInputSchema>;

export const VerifyDomainResponseSchema = z
	.object({
		domain: DomainInfoSchema.optional(),
		dns: DnsInfoSchema.optional(),
		provider: z.string().optional(),
		toxic: z.string().optional(),
	})
	.passthrough();
export type VerifyDomainResponse = z.infer<typeof VerifyDomainResponseSchema>;

// ── 3. Create batch request ─────────────────────────────────────────────────
// POST /v1.1/email/verify/batch
// https://docs.usebouncer.com/api-reference/batch/batch-create

/**
 * A batch entry. Bouncer requires objects here (a bare string is rejected with
 * a deserialization error) and preserves any extra properties, so custom
 * per-recipient metadata is carried through to the results.
 */
export const BatchRecipientSchema = z
	.object({
		email: z.string().min(1),
	})
	.passthrough();
export type BatchRecipient = z.infer<typeof BatchRecipientSchema>;

export const CreateBatchRequestInputSchema = z.object({
	/** Plain strings are accepted as a shorthand and sent as `{ email }`. */
	recipients: z
		.array(z.union([BatchRecipientSchema, z.string().min(1)]))
		.min(1),
	/** Optional URL notified once the batch completes. Sent as a query param. */
	callback: z.string().url().optional(),
});
export type CreateBatchRequestInput = z.infer<
	typeof CreateBatchRequestInputSchema
>;

export const CreateBatchRequestResponseSchema = z
	.object({
		batchId: z.string(),
		created: z.string().optional(),
		status: z.string().optional(),
		quantity: z.number().optional(),
		duplicates: z.number().optional(),
	})
	.passthrough();
export type CreateBatchRequestResponse = z.infer<
	typeof CreateBatchRequestResponseSchema
>;

// ── 4. Check batch status ───────────────────────────────────────────────────
// GET /v1.1/email/verify/batch/{batchId}
// https://docs.usebouncer.com/api-reference/batch/batch-status

export const GetBatchStatusInputSchema = z.object({
	batchId: z.string().min(1),
	/** Adds the per-status `stats` breakdown to the response. */
	withStats: z.boolean().optional(),
});
export type GetBatchStatusInput = z.infer<typeof GetBatchStatusInputSchema>;

export const BatchStatsSchema = z
	.object({
		deliverable: z.number(),
		risky: z.number(),
		undeliverable: z.number(),
		unknown: z.number(),
	})
	.passthrough();
export type BatchStats = z.infer<typeof BatchStatsSchema>;

export const GetBatchStatusResponseSchema = z
	.object({
		batchId: z.string(),
		created: z.string().optional(),
		started: z.string().optional(),
		completed: z.string().optional(),
		/** Documented values: `queued`, `processing`, `completed`. */
		status: z.string(),
		quantity: z.number().optional(),
		duplicates: z.number().optional(),
		credits: z.number().optional(),
		processed: z.number().optional(),
		stats: BatchStatsSchema.optional(),
	})
	.passthrough();
export type GetBatchStatusResponse = z.infer<
	typeof GetBatchStatusResponseSchema
>;

// ── 5. Get batch results ────────────────────────────────────────────────────
// GET /v1.1/email/verify/batch/{batchId}/download
// https://docs.usebouncer.com/api-reference/batch/batch-results

export const GetBatchResultsInputSchema = z.object({
	batchId: z.string().min(1),
	download: z
		.enum(['all', 'deliverable', 'risky', 'undeliverable', 'unknown'])
		.optional(),
});
export type GetBatchResultsInput = z.infer<typeof GetBatchResultsInputSchema>;

/** The download endpoint returns a bare JSON array of `EmailRecord`. */
export const GetBatchResultsResponseSchema = z.array(EmailRecordSchema);
export type GetBatchResultsResponse = z.infer<
	typeof GetBatchResultsResponseSchema
>;

// ── 6. Finish batch ─────────────────────────────────────────────────────────
// POST /v1.1/email/verify/batch/{batchId}/finish
// https://docs.usebouncer.com/api-reference/batch/batch-finish

export const FinishBatchInputSchema = z.object({
	batchId: z.string().min(1),
});
export type FinishBatchInput = z.infer<typeof FinishBatchInputSchema>;

/** Returns `202 Accepted` with an empty body. */
export const FinishBatchResponseSchema = z.object({}).passthrough();
export type FinishBatchResponse = z.infer<typeof FinishBatchResponseSchema>;

// ── 7. Delete batch request ─────────────────────────────────────────────────
// DELETE /v1.1/email/verify/batch/{batchId}
// https://docs.usebouncer.com/api-reference/batch/batch-delete

export const DeleteBatchRequestInputSchema = z.object({
	batchId: z.string().min(1),
});
export type DeleteBatchRequestInput = z.infer<
	typeof DeleteBatchRequestInputSchema
>;

/** Returns `200 OK` with an empty body. */
export const DeleteBatchRequestResponseSchema = z.object({}).passthrough();
export type DeleteBatchRequestResponse = z.infer<
	typeof DeleteBatchRequestResponseSchema
>;

// ── 8. Create toxicity list job ─────────────────────────────────────────────
// POST /v1/toxicity/list
// https://docs.usebouncer.com/api-reference/toxicity/toxicity-create

export const CreateToxicityListJobInputSchema = z.object({
	/** Sent as a bare JSON array of strings; objects are rejected. */
	emails: z.array(z.string().min(1)).min(1),
});
export type CreateToxicityListJobInput = z.infer<
	typeof CreateToxicityListJobInputSchema
>;

export const ToxicityListJobSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().optional(),
		/** Documented values: `processing`, `completed`, `error`. */
		status: z.string(),
	})
	.passthrough();
export type ToxicityListJob = z.infer<typeof ToxicityListJobSchema>;

export const CreateToxicityListJobResponseSchema = ToxicityListJobSchema;
export type CreateToxicityListJobResponse = z.infer<
	typeof CreateToxicityListJobResponseSchema
>;

// ── 9. Check toxicity list job status ───────────────────────────────────────
// GET /v1/toxicity/list/{id}
// https://docs.usebouncer.com/api-reference/toxicity/toxicity-status

export const CheckToxicityListJobStatusInputSchema = z.object({
	jobId: z.string().min(1),
});
export type CheckToxicityListJobStatusInput = z.infer<
	typeof CheckToxicityListJobStatusInputSchema
>;

export const CheckToxicityListJobStatusResponseSchema = ToxicityListJobSchema;
export type CheckToxicityListJobStatusResponse = z.infer<
	typeof CheckToxicityListJobStatusResponseSchema
>;

// ── 10. Download toxicity list results ──────────────────────────────────────
// GET /v1/toxicity/list/{id}/data
// https://docs.usebouncer.com/api-reference/toxicity/toxicity-results

export const GetToxicityListResultsInputSchema = z.object({
	jobId: z.string().min(1),
});
export type GetToxicityListResultsInput = z.infer<
	typeof GetToxicityListResultsInputSchema
>;

export const ToxicityRecordSchema = z
	.object({
		email: z.string(),
		/** Toxicity on the documented 0–5 scale. */
		toxicity: z.number().int().min(0).max(5),
	})
	.passthrough();
export type ToxicityRecord = z.infer<typeof ToxicityRecordSchema>;

/** Returns a bare JSON array of `{ email, toxicity }`. */
export const GetToxicityListResultsResponseSchema =
	z.array(ToxicityRecordSchema);
export type GetToxicityListResultsResponse = z.infer<
	typeof GetToxicityListResultsResponseSchema
>;

// ── 11. Delete toxicity list job ────────────────────────────────────────────
// DELETE /v1/toxicity/list/{id}
// https://docs.usebouncer.com/api-reference/toxicity/toxicity-delete

export const DeleteToxicityListJobInputSchema = z.object({
	jobId: z.string().min(1),
});
export type DeleteToxicityListJobInput = z.infer<
	typeof DeleteToxicityListJobInputSchema
>;

/** Returns `200 OK` with an empty body. */
export const DeleteToxicityListJobResponseSchema = z.object({}).passthrough();
export type DeleteToxicityListJobResponse = z.infer<
	typeof DeleteToxicityListJobResponseSchema
>;

// ── 12. Check available credits ─────────────────────────────────────────────
// GET /v1.1/credits
// https://docs.usebouncer.com/api-reference/credits/credits

export const GetCreditsInputSchema = z.object({});
export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

export const GetCreditsResponseSchema = z
	.object({
		credits: z.number(),
	})
	.passthrough();
export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

// ── Schema maps ─────────────────────────────────────────────────────────────

export const BouncerEndpointInputSchemas = {
	verifyEmail: VerifyEmailInputSchema,
	verifyDomain: VerifyDomainInputSchema,
	createBatchRequest: CreateBatchRequestInputSchema,
	getBatchStatus: GetBatchStatusInputSchema,
	getBatchResults: GetBatchResultsInputSchema,
	finishBatch: FinishBatchInputSchema,
	deleteBatchRequest: DeleteBatchRequestInputSchema,
	createToxicityListJob: CreateToxicityListJobInputSchema,
	checkToxicityListJobStatus: CheckToxicityListJobStatusInputSchema,
	getToxicityListResults: GetToxicityListResultsInputSchema,
	deleteToxicityListJob: DeleteToxicityListJobInputSchema,
	getCredits: GetCreditsInputSchema,
} as const;

export type BouncerEndpointInputs = {
	[K in keyof typeof BouncerEndpointInputSchemas]: z.infer<
		(typeof BouncerEndpointInputSchemas)[K]
	>;
};

export const BouncerEndpointOutputSchemas = {
	verifyEmail: VerifyEmailResponseSchema,
	verifyDomain: VerifyDomainResponseSchema,
	createBatchRequest: CreateBatchRequestResponseSchema,
	getBatchStatus: GetBatchStatusResponseSchema,
	getBatchResults: GetBatchResultsResponseSchema,
	finishBatch: FinishBatchResponseSchema,
	deleteBatchRequest: DeleteBatchRequestResponseSchema,
	createToxicityListJob: CreateToxicityListJobResponseSchema,
	checkToxicityListJobStatus: CheckToxicityListJobStatusResponseSchema,
	getToxicityListResults: GetToxicityListResultsResponseSchema,
	deleteToxicityListJob: DeleteToxicityListJobResponseSchema,
	getCredits: GetCreditsResponseSchema,
} as const;

export type BouncerEndpointOutputs = {
	[K in keyof typeof BouncerEndpointOutputSchemas]: z.infer<
		(typeof BouncerEndpointOutputSchemas)[K]
	>;
};
