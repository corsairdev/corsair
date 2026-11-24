import { z } from 'zod';
import { requireProjectToken, segment } from '../client';
import { op } from './call';
import { FORM, form, IngestionResultSchema, PropertiesSchema } from './common';

// ── events.import ─────────────────────────────────────────────────────────

export const MIXPANEL_MAX_EVENTS_PER_IMPORT = 2000;

/**
 * distinct_id values Mixpanel disallows to prevent accidental implementation
 * mistakes (https://docs.mixpanel.com/reference/import-events). The empty
 * string stays valid: it marks an event with no user.
 */
export const MIXPANEL_DISALLOWED_DISTINCT_IDS = [
	'00000000-0000-0000-0000-000000000000',
	'anon',
	'anonymous',
	'nil',
	'none',
	'null',
	'n/a',
	'na',
	'undefined',
	'unknown',
	'<nil>',
	'0',
	'-1',
	'true',
	'false',
	'[]',
	'{}',
] as const;

const distinctIdCheck = (value: string, ctx: z.RefinementCtx) => {
	if (MIXPANEL_DISALLOWED_DISTINCT_IDS.includes(value as never)) {
		ctx.addIssue({
			code: 'custom',
			message: `Mixpanel disallows "${value}" as a distinct_id`,
		});
	}
};

const ImportedEventSchema = z.object({
	event: z.string().min(1).describe('The name of the event.'),
	properties: z
		.object({
			// Unix epoch seconds or milliseconds, or an RFC 3339 string; sent
			// unchanged and let Mixpanel detect the format.
			time: z.union([z.number(), z.string()]),
			distinct_id: z.string().superRefine(distinctIdCheck),
			// Alphanumeric or "-", at most 36 bytes: Mixpanel's deduplication key.
			$insert_id: z
				.string()
				.max(36)
				.regex(/^[A-Za-z0-9-]+$/, 'Only alphanumeric characters and "-"'),
		})
		.loose(),
});

const EventsImportInput = z.object({
	strict: z
		.enum(['0', '1'])
		.optional()
		.describe(
			"Defaults to '1': Mixpanel validates the batch and rejects it with per-event errors instead of ingesting silently.",
		),
	events: z
		.array(ImportedEventSchema)
		.min(1)
		.max(MIXPANEL_MAX_EVENTS_PER_IMPORT)
		.describe(
			`Up to ${MIXPANEL_MAX_EVENTS_PER_IMPORT} events and 10 MB uncompressed per request. Mixpanel deduplicates on (event, time, distinct_id, $insert_id).`,
		),
});

const EventsImportOutput = z
	.object({
		code: z.number().nullish(),
		num_records_imported: z.number().nullish(),
		status: z.union([z.string(), z.number()]).nullish(),
	})
	.loose();

export const importEvents = op({
	name: 'events.import',
	input: EventsImportInput,
	output: EventsImportOutput,
	meta: {
		riskLevel: 'write',
		description:
			'Import up to 2000 server-side events (service account auth, any age), validated per event unless strict is 0',
	},
	toRequest: (input, c) => ({
		service: 'ingestion',
		method: 'POST',
		path: '/import',
		query: { strict: input.strict ?? '1', project_id: c.projectId },
		body: input.events,
		mediaType: 'application/json',
	}),
	log: (input, result) => ({
		sent: input.events.length,
		imported: result.num_records_imported ?? undefined,
	}),
});

// ── events.track ──────────────────────────────────────────────────────────

const TrackedEventSchema = z.object({
	event: z.string().min(1),
	properties: z
		.object({
			distinct_id: z.string().optional(),
			time: z.number().optional().describe('Unix epoch seconds or ms.'),
			$insert_id: z.string().max(36).optional(),
		})
		.loose()
		.optional(),
});

export const trackEvents = op({
	name: 'events.track',
	input: z.object({
		events: z.array(TrackedEventSchema).min(1).max(2000),
		ip: z
			.boolean()
			.optional()
			.describe(
				'True to geolocate from the sender IP (the server running Corsair).',
			),
	}),
	output: IngestionResultSchema,
	meta: {
		riskLevel: 'write',
		description:
			'Track up to 2000 recent events (last 5 days) with the project token, the client-side ingestion route',
	},
	toRequest: (input, c) => {
		const token = requireProjectToken(c);
		return {
			service: 'ingestion',
			method: 'POST',
			path: '/track',
			auth: 'none',
			query: { verbose: 1, ip: input.ip === undefined ? 0 : Number(input.ip) },
			body: input.events.map((event) => ({
				event: event.event,
				properties: { ...event.properties, token },
			})),
			mediaType: 'application/json',
		};
	},
	log: (input) => ({ sent: input.events.length }),
});

// ── identity ──────────────────────────────────────────────────────────────

export const createIdentity = op({
	name: 'identity.createIdentity',
	input: z.object({
		identified_id: z
			.string()
			.min(1)
			.describe('The id the user is known by after login ($identified_id).'),
		anon_id: z
			.string()
			.min(1)
			.describe('The anonymous id used before login ($anon_id).'),
	}),
	output: IngestionResultSchema,
	meta: {
		riskLevel: 'write',
		description:
			'Send an $identify event linking an anonymous id to an identified id (original ID merge API)',
	},
	toRequest: (input, c) => ({
		service: 'ingestion',
		method: 'POST',
		path: '/track',
		auth: 'none',
		query: { verbose: 1 },
		body: form({
			data: {
				event: '$identify',
				properties: {
					$identified_id: input.identified_id,
					$anon_id: input.anon_id,
					token: requireProjectToken(c),
				},
			},
		}),
		mediaType: FORM,
	}),
});

export const createAlias = op({
	name: 'identity.createAlias',
	input: z.object({
		distinct_id: z.string().min(1).describe('The existing distinct_id.'),
		alias: z
			.string()
			.min(1)
			.describe('The new id that should resolve to distinct_id.'),
	}),
	output: IngestionResultSchema,
	meta: {
		riskLevel: 'write',
		description:
			'Send a $create_alias event so a new id resolves to an existing distinct_id (legacy ID management)',
	},
	toRequest: (input, c) => ({
		service: 'ingestion',
		method: 'POST',
		path: '/track',
		auth: 'none',
		query: { verbose: 1 },
		body: form({
			data: {
				event: '$create_alias',
				properties: {
					distinct_id: input.distinct_id,
					alias: input.alias,
					token: requireProjectToken(c),
				},
			},
		}),
		mediaType: FORM,
	}),
});

export const mergeIdentities = op({
	name: 'identity.merge',
	input: z.object({
		distinct_ids: z
			.tuple([z.string().min(1), z.string().min(1)])
			.describe('The two distinct_ids to merge into one user.'),
	}),
	output: EventsImportOutput,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge two distinct_ids into one user with a $merge event (original ID merge API); cannot be undone',
	},
	toRequest: (input, c) => ({
		service: 'ingestion',
		method: 'POST',
		path: '/import',
		query: { strict: '1', project_id: c.projectId },
		body: [
			{
				event: '$merge',
				properties: {
					$distinct_ids: input.distinct_ids,
					...(c.projectToken ? { token: c.projectToken } : {}),
				},
			},
		],
		mediaType: 'application/json',
	}),
});

// ── lookupTables ──────────────────────────────────────────────────────────

const LookupTableSchema = z
	.object({ id: z.string().nullish(), name: z.string().nullish() })
	.loose();

export const listLookupTables = op({
	name: 'lookupTables.list',
	input: z.object({}),
	output: z
		.object({
			code: z.number().nullish(),
			status: z.string().nullish(),
			// Live: an empty project answers `results: null`, not [].
			results: z.array(LookupTableSchema).nullish(),
		})
		.loose(),
	meta: {
		riskLevel: 'read',
		description: 'List the lookup tables in the project with their ids',
	},
	toRequest: (_input, c) => ({
		service: 'ingestion',
		method: 'GET',
		path: '/lookup-tables',
		query: { project_id: c.projectId },
	}),
});

export const replaceLookupTable = op({
	name: 'lookupTables.replace',
	input: z.object({
		id: z
			.string()
			.min(1)
			.describe('The lookup table id from lookupTables.list.'),
		csv: z
			.string()
			.min(1)
			.describe(
				'The whole table as CSV, header row first; the first column is the join key. Replaces every row.',
			),
	}),
	output: z
		.object({ code: z.number().nullish(), status: z.string().nullish() })
		.loose(),
	meta: {
		riskLevel: 'destructive',
		description:
			'Replace every row of a lookup table with new CSV content (max 100 MB); the old rows are gone',
	},
	toRequest: (input, c) => ({
		service: 'ingestion',
		method: 'PUT',
		path: `/lookup-tables/${segment(input.id)}`,
		query: { project_id: c.projectId },
		body: input.csv,
		mediaType: 'text/csv',
	}),
});

export { PropertiesSchema };
