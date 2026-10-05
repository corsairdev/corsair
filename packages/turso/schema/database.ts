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
	databaseUrl: z
		.string()
		.url()
		.describe(
			'Database-specific URL where the change event occurred (e.g. https://mydb-myorg.turso.io)',
		),
	table: z
		.string()
		.describe('Name of the database table where the committed change occurred'),
	action: z
		.enum(['insert', 'update', 'delete'])
		.describe('Committed table action: insert, update, or delete'),
	receivedAt: z
		.string()
		.describe('ISO 8601 timestamp when the event was received by the client'),
	/**
	 * Event payload as sent by Turso, passed through as-is.
	 * Using unknown for record values because the row shape is defined by the user's own database table, not fixed by Turso.
	 */
	data: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe(
			'Decoded change event payload containing committed row data as sent by Turso',
		),
});

export type TursoChangeEvent = z.infer<typeof TursoChangeEvent>;
