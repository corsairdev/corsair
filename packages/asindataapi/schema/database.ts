import { z } from 'zod';

/**
 * Lightweight Collection record for local storage.
 * Tracks basic metadata so agents can query cached collection state.
 */
export const AsinDataApiCollection = z.object({
	/** The ASIN Data API collection id. */
	id: z.string(),
	/** Human-readable collection name. */
	name: z.string().optional(),
	/** Current operational status. */
	status: z.enum(['idle', 'queued', 'running']).optional(),
	/** Schedule type. */
	scheduleType: z
		.enum(['monthly', 'weekly', 'daily', 'minutes', 'manual'])
		.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type AsinDataApiCollection = z.infer<typeof AsinDataApiCollection>;

/**
 * Lightweight Result Set record for local storage.
 * Tracks download links and completion status for collection results.
 */
export const AsinDataApiResultSet = z.object({
	/** The ASIN Data API result set id. */
	id: z.number(),
	/** Parent collection id. */
	collectionId: z.string().optional(),
	/** When the collection started. */
	startedAt: z.string().optional(),
	/** When the collection finished. */
	endedAt: z.string().optional(),
	/** When the result set expires (14 days after creation). */
	expiresAt: z.string().optional(),
	/** Number of requests that completed successfully. */
	requestsCompleted: z.number().optional(),
	/** Number of requests that failed. */
	requestsFailed: z.number().optional(),
	/** Total number of requests. */
	requestsTotal: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type AsinDataApiResultSet = z.infer<typeof AsinDataApiResultSet>;
