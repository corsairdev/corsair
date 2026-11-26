import { z } from 'zod';
import type { MixpanelCredentials, MixpanelRequest } from '../client';
import { op } from './call';
import {
	checkDateRange,
	DateSchema,
	FORM,
	form,
	IdSchema,
	jsonList,
	LooseObject,
	PropertiesSchema,
	WorkspaceIdSchema,
	wrapArray,
} from './common';

// The Query API (/api/query) answers 402 `query_api.request.plan_restricted`
// on Mixpanel's free plan for every report route here, and for
// /stream/query; /engage (profiles.query) works on free (live, 11-24). Rate limit: 60
// queries an hour and 5 at once per project.

function get(
	path: string,
	c: MixpanelCredentials,
	query: Record<string, string | number | boolean | undefined>,
): MixpanelRequest {
	return {
		service: 'query',
		method: 'GET',
		path,
		query: { project_id: c.projectId, ...query },
	};
}

const EventType = z
	.enum(['general', 'unique', 'average'])
	.describe(
		'general counts every event, unique counts users, average is per user.',
	);

// unknown: report payloads nest series by date and segment; they pass
// through as Mixpanel sends them.
const SeriesOutput = z
	.object({
		data: z
			.object({
				series: z.array(z.string()).nullish(),
				values: PropertiesSchema.nullish(),
			})
			.loose()
			.nullish(),
		legend_size: z.number().nullish(),
	})
	.loose();

// ── insights ──────────────────────────────────────────────────────────────

export const insightsQuery = op({
	name: 'insights.query',
	input: z.object({
		bookmark_id: IdSchema.describe('The id of the saved Insights report.'),
		workspace_id: WorkspaceIdSchema,
	}),
	output: z
		.object({
			computed_at: z.string().nullish(),
			date_range: z
				.object({
					from_date: z.string().nullish(),
					to_date: z.string().nullish(),
				})
				.loose()
				.nullish(),
			headers: z.array(z.string()).nullish(),
			// unknown: a report with a breakdown nests more than {date: count}.
			series: PropertiesSchema.nullish(),
		})
		.loose(),
	meta: {
		riskLevel: 'read',
		description:
			'Read the data behind one saved Insights report by its bookmark id',
	},
	toRequest: (input, c) =>
		get('/insights', c, {
			bookmark_id: input.bookmark_id,
			workspace_id: input.workspace_id,
		}),
});

// unknown: metric, filter and breakdown objects follow Mixpanel's Insights
// query schema (40+ variants keyed by `type`); they are sent as given.
const TypedObject = z.object({ type: z.string().min(1) }).loose();

export const insightsRun = op({
	name: 'insights.run',
	input: z.object({
		metrics: z
			.array(TypedObject)
			.min(1)
			.max(40)
			.describe(
				'What to measure; each has `type`: event, funnel, retention, cohort or formula (see Mixpanel Insights query reference).',
			),
		time: z
			.object({
				start: z.union([z.string(), LooseObject]),
				end: z.union([z.string(), LooseObject]).optional(),
				unit: z.string().optional(),
			})
			.loose()
			.describe(
				'start/end as YYYY-MM-DD, YYYY-MM-DDTHH:mm or a relative date object; unit such as day or week.',
			),
		filters: z.array(TypedObject).max(10).optional(),
		breakdowns: z.array(TypedObject).max(3).optional(),
		time_comparison: LooseObject.optional(),
		lift_comparison: LooseObject.optional(),
		workspace_id: WorkspaceIdSchema,
	}),
	output: LooseObject,
	meta: {
		riskLevel: 'read',
		description:
			'Run an ad hoc Insights query (events, funnels, retention, cohorts, formulas) without a saved report',
	},
	toRequest: (input, c) => {
		const { workspace_id, ...body } = input;
		return {
			service: 'query',
			method: 'POST',
			path: '/insights/query',
			query: { project_id: c.projectId, workspace_id },
			body,
			mediaType: 'application/json',
		};
	},
});

// ── funnels ───────────────────────────────────────────────────────────────

export const funnelsQuery = op({
	name: 'funnels.query',
	input: z
		.object({
			funnel_id: IdSchema.describe('The saved funnel id (funnels.list).'),
			from_date: DateSchema,
			to_date: DateSchema,
			length: z
				.number()
				.int()
				.positive()
				.optional()
				.describe('Conversion window length, in length_unit.'),
			length_unit: z.enum(['day', 'hour', 'minute', 'second']).optional(),
			interval: z.number().int().positive().optional(),
			unit: z.enum(['day', 'week', 'month']).optional(),
			on: z
				.string()
				.optional()
				.describe('A property expression to segment on.'),
			where: z.string().optional(),
			limit: z.number().int().positive().optional(),
			workspace_id: WorkspaceIdSchema,
		})
		.superRefine(checkDateRange),
	output: z
		.object({
			meta: z
				.object({ dates: z.array(z.string()).nullish() })
				.loose()
				.nullish(),
			data: PropertiesSchema.nullish(),
		})
		.loose(),
	meta: {
		riskLevel: 'read',
		description:
			'Query a saved funnel for a date range, with optional segmentation and conversion window',
	},
	toRequest: (input, c) => get('/funnels', c, input),
});

export const funnelsList = op({
	name: 'funnels.list',
	input: z.object({ workspace_id: WorkspaceIdSchema }),
	output: z.object({
		funnels: z.array(
			z
				.object({ funnel_id: z.number().nullish(), name: z.string().nullish() })
				.loose(),
		),
	}),
	meta: {
		riskLevel: 'read',
		description: 'List the saved funnels with their ids and names',
	},
	toRequest: (input, c) =>
		get('/funnels/list', c, { workspace_id: input.workspace_id }),
	shape: wrapArray('funnels'),
});

// ── retention ─────────────────────────────────────────────────────────────

export const MIXPANEL_MAX_RETENTION_INTERVAL_DAYS = 90;

export const retentionQuery = op({
	name: 'retention.query',
	input: z
		.object({
			from_date: DateSchema,
			to_date: DateSchema,
			retention_type: z
				.enum(['birth', 'compounded'])
				.optional()
				.describe(
					"Defaults to 'birth' (first time). 'compounded' is recurring retention.",
				),
			born_event: z
				.string()
				.optional()
				.describe("The first event, required when retention_type is 'birth'."),
			event: z
				.string()
				.optional()
				.describe('The returning event. Omit to look across all events.'),
			born_where: z.string().optional(),
			where: z.string().optional(),
			interval: z
				.number()
				.int()
				.positive()
				.optional()
				.describe('Defaults to 1. At most 90 when unit is day.'),
			interval_count: z.number().int().positive().optional(),
			unit: z.enum(['day', 'week', 'month']).optional(),
			unbounded_retention: z.boolean().optional(),
			on: z.string().optional(),
			limit: z.number().int().positive().optional(),
			workspace_id: WorkspaceIdSchema,
		})
		.superRefine((value, ctx) => {
			checkDateRange(value, ctx);
			if (
				(value.unit ?? 'day') === 'day' &&
				(value.interval ?? 1) > MIXPANEL_MAX_RETENTION_INTERVAL_DAYS
			) {
				ctx.addIssue({
					code: 'custom',
					message: `interval cannot be greater than ${MIXPANEL_MAX_RETENTION_INTERVAL_DAYS} when unit is day`,
				});
			}
			if ((value.retention_type ?? 'birth') === 'birth' && !value.born_event) {
				ctx.addIssue({
					code: 'custom',
					message:
						"born_event is required when retention_type is 'birth' (the default)",
				});
			}
		}),
	// One `{date: {counts, first}}` row per cohort day, or nested by segment.
	output: PropertiesSchema,
	meta: {
		riskLevel: 'read',
		description:
			'Run a birth or compounded retention query for a date range, per day, week or month',
	},
	toRequest: (input, c) => get('/retention', c, input),
});

export const retentionFrequency = op({
	name: 'retention.frequency',
	input: z
		.object({
			from_date: DateSchema,
			to_date: DateSchema,
			unit: z
				.enum(['day', 'week', 'month'])
				.describe('The overall time period to bucket users by.'),
			addiction_unit: z
				.enum(['hour', 'day'])
				.describe('The granularity to count how often users did the event.'),
			event: z.string().optional(),
			where: z.string().optional(),
			on: z.string().optional(),
			limit: z.number().int().positive().optional(),
			workspace_id: WorkspaceIdSchema,
		})
		.superRefine(checkDateRange),
	output: z.object({ data: PropertiesSchema.nullish() }).loose(),
	meta: {
		riskLevel: 'read',
		description:
			'Frequency (addiction) report: how many users did an event on how many hours or days of each period',
	},
	toRequest: (input, c) => get('/retention/addiction', c, input),
});

// ── segmentation ──────────────────────────────────────────────────────────

const SegmentationBase = {
	event: z.string().min(1).describe('The event to segment.'),
	from_date: DateSchema,
	to_date: DateSchema,
	where: z.string().optional(),
	workspace_id: WorkspaceIdSchema,
};

export const segmentationQuery = op({
	name: 'segmentation.query',
	input: z
		.object({
			...SegmentationBase,
			on: z
				.string()
				.optional()
				.describe('A property expression to segment on.'),
			unit: z.enum(['minute', 'hour', 'day', 'month']).optional(),
			interval: z.number().int().positive().optional(),
			limit: z.number().int().positive().max(10000).optional(),
			type: EventType.optional(),
		})
		.superRefine(checkDateRange),
	output: SeriesOutput,
	meta: {
		riskLevel: 'read',
		description:
			'Count an event over time, optionally segmented by a property (Segmentation report)',
	},
	toRequest: (input, c) => get('/segmentation', c, input),
});

export const segmentationNumeric = op({
	name: 'segmentation.numeric',
	input: z
		.object({
			...SegmentationBase,
			on: z
				.string()
				.min(1)
				.describe('A numeric property expression to bucket.'),
			unit: z.enum(['hour', 'day']).optional(),
			type: EventType.optional(),
		})
		.superRefine(checkDateRange),
	output: SeriesOutput,
	meta: {
		riskLevel: 'read',
		description: 'Segment an event by numeric ranges of a property',
	},
	toRequest: (input, c) => get('/segmentation/numeric', c, input),
});

const SumOutput = z
	.object({
		status: z.string().nullish(),
		computed_at: z.string().nullish(),
		results: PropertiesSchema.nullish(),
	})
	.loose();

export const segmentationSum = op({
	name: 'segmentation.sum',
	input: z
		.object({
			...SegmentationBase,
			on: z.string().min(1).describe('A numeric property expression to sum.'),
			unit: z.enum(['hour', 'day']).optional(),
		})
		.superRefine(checkDateRange),
	output: SumOutput,
	meta: {
		riskLevel: 'read',
		description: 'Sum a numeric property of an event per time unit',
	},
	toRequest: (input, c) => get('/segmentation/sum', c, input),
});

export const segmentationAverage = op({
	name: 'segmentation.average',
	input: z
		.object({
			...SegmentationBase,
			on: z
				.string()
				.min(1)
				.describe('A numeric property expression to average.'),
			unit: z.enum(['hour', 'day']).optional(),
		})
		.superRefine(checkDateRange),
	output: SumOutput,
	meta: {
		riskLevel: 'read',
		description: 'Average a numeric property of an event per time unit',
	},
	toRequest: (input, c) => get('/segmentation/average', c, input),
});

// ── cohorts ───────────────────────────────────────────────────────────────

export const cohortsList = op({
	name: 'cohorts.list',
	input: z.object({ workspace_id: WorkspaceIdSchema }),
	output: z.object({
		cohorts: z.array(
			z
				.object({
					count: z.number().nullish(),
					is_visible: z.number().nullish(),
					description: z.string().nullish(),
					created: z.string().nullish(),
					project_id: z.number().nullish(),
					id: z.number().nullish(),
					name: z.string().nullish(),
				})
				.loose(),
		),
	}),
	meta: {
		riskLevel: 'read',
		description:
			'List every saved cohort with its id, member count, visibility and description',
	},
	toRequest: (input, c) => ({
		service: 'query',
		method: 'POST',
		path: '/cohorts/list',
		query: { project_id: c.projectId, workspace_id: input.workspace_id },
	}),
	shape: wrapArray('cohorts'),
	log: (_input, result) => ({ cohorts: result.cohorts.length }),
});

// ── events (aggregate counts) ─────────────────────────────────────────────

const TimeUnit = z.enum(['minute', 'hour', 'day', 'week', 'month']);

export const eventsCounts = op({
	name: 'events.counts',
	input: z
		.object({
			events: z.array(z.string().min(1)).min(1).describe('Event names.'),
			type: EventType,
			unit: TimeUnit,
			interval: z.number().int().positive().optional(),
			from_date: DateSchema,
			to_date: DateSchema,
			workspace_id: WorkspaceIdSchema,
		})
		.superRefine(checkDateRange),
	output: SeriesOutput,
	meta: {
		riskLevel: 'read',
		description: 'Aggregate counts of one or more events over time',
	},
	toRequest: (input, c) =>
		get('/events', c, {
			event: jsonList(input.events),
			type: input.type,
			unit: input.unit,
			interval: input.interval,
			from_date: input.from_date,
			to_date: input.to_date,
			workspace_id: input.workspace_id,
		}),
});

export const eventsTop = op({
	name: 'events.top',
	input: z.object({
		type: EventType,
		limit: z.number().int().positive().max(100).optional(),
		workspace_id: WorkspaceIdSchema,
	}),
	output: z
		.object({
			events: z
				.array(
					z
						.object({
							amount: z.number().nullish(),
							event: z.string().nullish(),
							percent_change: z.number().nullish(),
						})
						.loose(),
				)
				.nullish(),
			type: z.string().nullish(),
		})
		.loose(),
	meta: {
		riskLevel: 'read',
		description: "Today's top events with counts and change against yesterday",
	},
	toRequest: (input, c) => get('/events/top', c, input),
});

export const eventsNames = op({
	name: 'events.names',
	input: z.object({
		type: EventType,
		limit: z.number().int().positive().optional(),
		workspace_id: WorkspaceIdSchema,
	}),
	output: z.object({ names: z.array(z.string()) }),
	meta: {
		riskLevel: 'read',
		description: 'The most common event names over the last 31 days',
	},
	toRequest: (input, c) => get('/events/names', c, input),
	shape: wrapArray('names'),
});

export const eventsPropertyCounts = op({
	name: 'events.propertyCounts',
	input: z
		.object({
			event: z.string().min(1),
			name: z.string().min(1).describe('The property name.'),
			values: z
				.array(z.string())
				.optional()
				.describe('Only these property values.'),
			type: EventType,
			unit: TimeUnit,
			interval: z.number().int().positive().optional(),
			from_date: DateSchema,
			to_date: DateSchema,
			limit: z.number().int().positive().optional(),
			workspace_id: WorkspaceIdSchema,
		})
		.superRefine(checkDateRange),
	output: SeriesOutput,
	meta: {
		riskLevel: 'read',
		description:
			'Aggregate counts of an event broken down by the values of one property',
	},
	toRequest: (input, c) =>
		get('/events/properties', c, {
			...input,
			values: jsonList(input.values),
		}),
});

export const eventsTopProperties = op({
	name: 'events.topProperties',
	input: z.object({
		event: z.string().min(1),
		limit: z.number().int().positive().optional(),
		workspace_id: WorkspaceIdSchema,
	}),
	// `{ property: { count } }`
	output: PropertiesSchema,
	meta: {
		riskLevel: 'read',
		description: 'The top property names of an event with their counts',
	},
	toRequest: (input, c) => get('/events/properties/top', c, input),
});

export const eventsTopPropertyValues = op({
	name: 'events.topPropertyValues',
	input: z.object({
		event: z.string().min(1),
		name: z.string().min(1).describe('The property name.'),
		limit: z.number().int().positive().optional(),
		workspace_id: WorkspaceIdSchema,
	}),
	output: z.object({ values: z.array(z.string()) }),
	meta: {
		riskLevel: 'read',
		description: 'The top values of one event property',
	},
	toRequest: (input, c) => get('/events/properties/values', c, input),
	shape: wrapArray('values'),
});

// ── JQL ───────────────────────────────────────────────────────────────────

export const jqlRun = op({
	name: 'jql.run',
	input: z.object({
		script: z
			.string()
			.min(1)
			.describe('The JQL script, a JavaScript main() function.'),
		params: PropertiesSchema.optional().describe(
			'Values the script reads as `params`.',
		),
		workspace_id: WorkspaceIdSchema,
	}),
	// unknown: a JQL script returns whatever its pipeline emits.
	output: z.object({ results: z.array(z.unknown()) }),
	meta: {
		riskLevel: 'read',
		description:
			'Run a JQL script (custom JavaScript query) over events and profiles; JQL is in maintenance mode at Mixpanel',
	},
	toRequest: (input, c) => ({
		service: 'query',
		method: 'POST',
		path: '/jql',
		query: { project_id: c.projectId, workspace_id: input.workspace_id },
		body: form({ script: input.script, params: input.params }),
		mediaType: FORM,
		timeoutMs: 120_000,
	}),
	shape: wrapArray('results'),
});
