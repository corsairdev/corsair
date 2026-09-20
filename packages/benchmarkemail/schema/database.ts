import { z } from 'zod';

/**
 * Reference entities mirrored into the local store: records that are
 * created once and updated in place, which an agent needs to resolve ids
 * and to segment on.
 *
 * Transactional data (campaign opens/clicks/bounces, survey answers,
 * audit history rows) is deliberately absent: it is append-only, only
 * meaningful against a date range, and always fresher via a live call.
 */
export const BenchmarkEmailContact = z.object({
	id: z.string(),
	listID: z.string().optional(),
	email: z.string().email().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type BenchmarkEmailContact = z.infer<typeof BenchmarkEmailContact>;

export const BenchmarkEmailContactList = z.object({
	id: z.string(),
	name: z.string().optional(),
	totalContacts: z.number().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type BenchmarkEmailContactList = z.infer<
	typeof BenchmarkEmailContactList
>;

export const BenchmarkEmailCampaign = z.object({
	id: z.string(),
	name: z.string().optional(),
	subject: z.string().optional(),
	status: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type BenchmarkEmailCampaign = z.infer<typeof BenchmarkEmailCampaign>;
