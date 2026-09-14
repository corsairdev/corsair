import { z } from 'zod';
import { isTursoDatabaseUrl } from '../client';

/**
 * Location codes returned by the closest-region service.
 *
 * API: GET https://region.turso.io
 * Docs: https://docs.turso.tech/api-reference/locations/closest-region
 */
export const ClosestRegionInputSchema = z.object({});

export type ClosestRegionInput = z.infer<typeof ClosestRegionInputSchema>;

export const ClosestRegionResponseSchema = z
	.object({
		server: z
			.string()
			.describe('Location code for the server that answered the request'),
		client: z.string().describe('Location code for the requesting client'),
	})
	.loose();

export type ClosestRegionResponse = z.infer<typeof ClosestRegionResponseSchema>;

/**
 * API token validation.
 *
 * API: GET https://api.turso.tech/v1/auth/validate
 * Docs: https://docs.turso.tech/api-reference/tokens/validate
 */
export const ValidateApiTokenInputSchema = z.object({});

export type ValidateApiTokenInput = z.infer<typeof ValidateApiTokenInputSchema>;

export const ValidateApiTokenResponseSchema = z
	.object({
		exp: z
			.number()
			.int()
			.describe(
				'Token expiry in unix epoch seconds, or -1 when the token never expires',
			),
	})
	.loose();

export type ValidateApiTokenResponse = z.infer<
	typeof ValidateApiTokenResponseSchema
>;

/**
 * Table actions the change stream can be filtered to.
 *
 * Docs: https://docs.turso.tech/sdk/http/reference
 */
export const ChangeActionSchema = z.enum(['insert', 'update', 'delete']);

export type ChangeAction = z.infer<typeof ChangeActionSchema>;

/**
 * Input for the committed-change listener.
 *
 * API: GET https://{database}-{org}.turso.io/beta/listen
 * Docs: https://docs.turso.tech/sdk/http/reference
 */
export const ListenToChangesInputSchema = z.object({
	databaseUrl: z
		.string()
		.url()
		.refine(isTursoDatabaseUrl, {
			message:
				'databaseUrl must be an https Turso host (*.turso.io) — the tenant bearer token is sent to it',
		})
		.describe(
			'Database-specific URL, e.g. https://mydb-myorg.turso.io — NOT the platform API host',
		),
	table: z.string().min(1).describe('Table to watch for committed changes'),
	action: ChangeActionSchema.describe(
		'Which committed action to stream: insert, update or delete',
	),
	maxEvents: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.default(10)
		.describe('Stop after this many events have been received'),
	timeoutMs: z
		.number()
		.int()
		.min(1_000)
		.max(120_000)
		.optional()
		.default(15_000)
		.describe('Stop listening after this many milliseconds'),
});

export type ListenToChangesInput = z.input<typeof ListenToChangesInputSchema>;

/**
 * A single committed change decoded from the SSE stream.
 */
export const ChangeEventSchema = z
	.object({
		table: z.string().describe('Table the change was committed to'),
		action: ChangeActionSchema.describe('Committed action'),
		receivedAt: z
			.string()
			.describe('ISO timestamp of when this client received the event'),
		data: z
			// z.unknown(): Turso's event payload is caller-defined row data with no
			// fixed shape, so values are preserved without asserting a type.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Decoded event payload as sent by Turso'),
	})
	.loose();

export type ChangeEvent = z.infer<typeof ChangeEventSchema>;

/**
 * Result when the stream is reachable and events were collected.
 */
export const ListenStreamResultSchema = z.object({
	mode: z.literal('stream'),
	table: z.string(),
	action: ChangeActionSchema,
	events: z.array(ChangeEventSchema),
	stoppedBy: z
		.enum(['max_events', 'timeout', 'stream_closed'])
		.describe('Why listening stopped'),
});

export type ListenStreamResult = z.infer<typeof ListenStreamResultSchema>;

/**
 * Result when /beta/listen is unavailable — the documented case for AWS
 * regions on the Free, Developer and Scaler plans. Falls back to a
 * /v2/pipeline health check so the caller still learns whether the database
 * is reachable.
 */
export const ListenHealthCheckResultSchema = z.object({
	mode: z.literal('health_check'),
	table: z.string(),
	action: ChangeActionSchema,
	listenAvailable: z.literal(false),
	reason: z.string().describe('Why the change stream was unavailable'),
	databaseReachable: z
		.boolean()
		.describe('Whether POST /v2/pipeline answered successfully'),
});

export type ListenHealthCheckResult = z.infer<
	typeof ListenHealthCheckResultSchema
>;

export const ListenToChangesResponseSchema = z.discriminatedUnion('mode', [
	ListenStreamResultSchema,
	ListenHealthCheckResultSchema,
]);

export type ListenToChangesResponse = z.infer<
	typeof ListenToChangesResponseSchema
>;

/**
 * Map of endpoint operation names to their respective input types.
 */
export type TursoEndpointInputs = {
	closestRegion: ClosestRegionInput;
	validateApiToken: ValidateApiTokenInput;
	listenToChanges: ListenToChangesInput;
};

/**
 * Map of endpoint operation names to their respective output types.
 */
export type TursoEndpointOutputs = {
	closestRegion: ClosestRegionResponse;
	validateApiToken: ValidateApiTokenResponse;
	listenToChanges: ListenToChangesResponse;
};

/**
 * Map of endpoint input Zod schemas.
 */
export const TursoEndpointInputSchemas = {
	closestRegion: ClosestRegionInputSchema,
	validateApiToken: ValidateApiTokenInputSchema,
	listenToChanges: ListenToChangesInputSchema,
} as const;

/**
 * Map of endpoint output Zod schemas.
 */
export const TursoEndpointOutputSchemas = {
	closestRegion: ClosestRegionResponseSchema,
	validateApiToken: ValidateApiTokenResponseSchema,
	listenToChanges: ListenToChangesResponseSchema,
} as const;
