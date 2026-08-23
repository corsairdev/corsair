import { z } from 'zod';

/**
 * Local storage record for a single email verification check.
 */
export const BouncerEmailVerification = z.object({
	email: z.string(),
	status: z.string(),
	reason: z.string().optional(),
	score: z.number().optional(),
	provider: z.string().optional(),
	toxic: z.string().optional(),
	toxicity: z.number().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local storage record for a domain verification check.
 */
export const BouncerDomainVerification = z.object({
	domain: z.string(),
	status: z.union([z.string(), z.number()]).optional(),
	acceptAll: z.string().optional(),
	disposable: z.string().optional(),
	free: z.string().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local storage record for a batch email verification job.
 */
export const BouncerBatchVerification = z.object({
	batchId: z.string(),
	status: z.string().optional(),
	total: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

/**
 * Local storage record for a toxicity analysis job.
 */
export const BouncerToxicityJob = z.object({
	jobId: z.string(),
	status: z.string().optional(),
	total: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type BouncerEmailVerification = z.infer<typeof BouncerEmailVerification>;
export type BouncerDomainVerification = z.infer<
	typeof BouncerDomainVerification
>;
export type BouncerBatchVerification = z.infer<typeof BouncerBatchVerification>;
export type BouncerToxicityJob = z.infer<typeof BouncerToxicityJob>;
