import { z } from 'zod';

/**
 * A committed table change observed on the database change stream.
 *
 * API: GET https://{database}-{org}.turso.io/beta/listen?table=&action=
 * Docs: https://docs.turso.tech/sdk/http/reference
 *
 * Only streamed events are persisted. When /beta/listen is unavailable the
 * endpoint falls back to a health check, which produces no events to mirror.
 */
export const TursoChangeEvent = z.object({
	databaseUrl: z.string().url(),
	table: z.string(),
	action: z.enum(['insert', 'update', 'delete']),
	receivedAt: z.string(),
	/**
	 * Event payload as sent by Turso, passed through as-is. `z.unknown()`
	 * because the row shape is defined by the user's own table, not by Turso.
	 */
	data: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type TursoChangeEvent = z.infer<typeof TursoChangeEvent>;
