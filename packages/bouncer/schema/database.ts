/**
 * Local persistence records for Bouncer results.
 *
 * Field names and value domains follow the published API contracts at
 * https://docs.usebouncer.com — see `endpoints/types.ts` for the per-endpoint
 * citations. Records are flattened for storage: the nested `domain`, `account`
 * and `dns` objects of an `EmailRecord` become prefixed columns.
 */
import { z } from 'zod';
import {
	BouncerFlagSchema,
	EmailReasonSchema,
	EmailStatusSchema,
} from '../endpoints/types';

/**
 * One real-time or batch verification result.
 * Source: `EmailRecord` (GET /v1.1/email/verify).
 */
export const BouncerEmailVerification = z.object({
	email: z.string(),
	status: EmailStatusSchema,
	reason: EmailReasonSchema,
	domainName: z.string().optional(),
	domainAcceptAll: BouncerFlagSchema.optional(),
	domainDisposable: BouncerFlagSchema.optional(),
	domainFree: BouncerFlagSchema.optional(),
	accountRole: BouncerFlagSchema.optional(),
	accountDisabled: BouncerFlagSchema.optional(),
	accountFullMailbox: BouncerFlagSchema.optional(),
	dnsType: z.string().optional(),
	dnsRecord: z.string().optional(),
	provider: z.string().optional(),
	/** Documented range 0–100. */
	score: z.number().int().min(0).max(100).optional(),
	toxic: z.string().optional(),
	/** Documented range 0–5. */
	toxicity: z.number().int().min(0).max(5).optional(),
	didYouMean: z.string().optional(),
	/** Set when the result was deferred by greylisting. */
	retryAfter: z.coerce.date().nullable().optional(),
	/** Batch this result came from, when it was not a real-time check. */
	batchId: z.string().nullable().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * One domain check.
 * Source: GET /v1.1/domain.
 */
export const BouncerDomainVerification = z.object({
	domain: z.string(),
	acceptAll: BouncerFlagSchema.optional(),
	disposable: BouncerFlagSchema.optional(),
	free: BouncerFlagSchema.optional(),
	dnsType: z.string().optional(),
	dnsRecord: z.string().optional(),
	provider: z.string().optional(),
	toxic: z.string().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * One batch verification job.
 * Source: GET /v1.1/email/verify/batch/{batchId}.
 */
export const BouncerBatchVerification = z.object({
	batchId: z.string(),
	/** Documented values: `queued`, `processing`, `completed`. */
	status: z.string().optional(),
	quantity: z.number().int().nonnegative().optional(),
	duplicates: z.number().int().nonnegative().optional(),
	processed: z.number().int().nonnegative().optional(),
	credits: z.number().int().nonnegative().optional(),
	statsDeliverable: z.number().int().nonnegative().optional(),
	statsRisky: z.number().int().nonnegative().optional(),
	statsUndeliverable: z.number().int().nonnegative().optional(),
	statsUnknown: z.number().int().nonnegative().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	startedAt: z.coerce.date().nullable().optional(),
	completedAt: z.coerce.date().nullable().optional(),
});

/**
 * One toxicity list job.
 * Source: GET /v1/toxicity/list/{id}.
 */
export const BouncerToxicityJob = z.object({
	jobId: z.string(),
	/** Documented values: `processing`, `completed`, `error`. */
	status: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

/**
 * One scored address from a completed toxicity job.
 * Source: GET /v1/toxicity/list/{id}/data.
 */
export const BouncerToxicityResult = z.object({
	jobId: z.string(),
	email: z.string(),
	/** Documented range 0–5. */
	toxicity: z.number().int().min(0).max(5),
});

export type BouncerEmailVerification = z.infer<typeof BouncerEmailVerification>;
export type BouncerDomainVerification = z.infer<
	typeof BouncerDomainVerification
>;
export type BouncerBatchVerification = z.infer<typeof BouncerBatchVerification>;
export type BouncerToxicityJob = z.infer<typeof BouncerToxicityJob>;
export type BouncerToxicityResult = z.infer<typeof BouncerToxicityResult>;
