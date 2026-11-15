import { z } from 'zod';

export const CurrencyEnum = z.enum([
	'dollar',
	'pound',
	'euro',
	'yuan',
	'peso',
	'shekel',
	'yen',
	'won',
	'hryvnia',
	'franc',
	'rupee',
	'integer',
	'none',
]);
export type Currency = z.infer<typeof CurrencyEnum>;

export const DateGroupingEnum = z.enum(['hour', 'day', 'month', 'year']);
export type DateGrouping = z.infer<typeof DateGroupingEnum>;

// Response objects use passthrough: a field Fathom adds later must not fail a call that succeeded.
export const AccountSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		object: z.literal('account'),
		name: z.string(),
		email: z.string(),
	})
	.passthrough();
export type Account = z.infer<typeof AccountSchema>;

export const TokenSchema = z
	.object({
		name: z.string(),
		version: z.number(),
		abilities: z.array(z.string()),
		last_used_at: z.string().nullable(),
		expires_at: z.string().nullable(),
		created_at: z.string(),
		updated_at: z.string(),
	})
	.passthrough();
export type Token = z.infer<typeof TokenSchema>;

export const SiteSchema = z
	.object({
		id: z.string(),
		object: z.literal('site'),
		name: z.string(),
		// Documented values are none, private and public; a value Fathom adds later must not fail the call.
		sharing: z.string(),
		created_at: z.string(),
		timezone: z.string(),
	})
	.passthrough();
export type Site = z.infer<typeof SiteSchema>;

export const SiteListResponseSchema = z
	.object({
		object: z.literal('list'),
		url: z.string(),
		has_more: z.boolean(),
		data: z.array(SiteSchema),
	})
	.passthrough();
export type SiteListResponse = z.infer<typeof SiteListResponseSchema>;

export const SiteDeleteResponseSchema = z
	.object({
		id: z.string(),
		object: z.literal('site'),
		deleted: z.literal(true),
	})
	.passthrough();
export type SiteDeleteResponse = z.infer<typeof SiteDeleteResponseSchema>;

// `passthrough` because the retired endpoint returns 410 Gone with dynamic provider error payload.
export const SiteWipeResponseSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		deleted: z.boolean().optional(),
		message: z.string().optional(),
		error: z.string().optional(),
	})
	.passthrough();
export type SiteWipeResponse = z.infer<typeof SiteWipeResponseSchema>;

export const EventItemSchema = z
	.object({
		id: z.string(),
		object: z.literal('event'),
		name: z.string(),
		currency: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
	})
	.passthrough();
export type EventItem = z.infer<typeof EventItemSchema>;

export const EventListResponseSchema = z
	.object({
		object: z.literal('list'),
		url: z.string(),
		has_more: z.boolean(),
		data: z.array(EventItemSchema),
	})
	.passthrough();
export type EventListResponse = z.infer<typeof EventListResponseSchema>;

export const EventSetCurrencyResponseSchema = z
	.object({
		object: z.literal('event'),
		name: z.string(),
		currency: z.string(),
		updated: z.literal(true),
	})
	.passthrough();
export type EventSetCurrencyResponse = z.infer<
	typeof EventSetCurrencyResponseSchema
>;

export const EventDeleteResponseSchema = z
	.object({
		object: z.literal('event'),
		name: z.string(),
		deleted: z.literal(true),
	})
	.passthrough();
export type EventDeleteResponse = z.infer<typeof EventDeleteResponseSchema>;

// `passthrough` because retired event endpoints return 410 Gone with dynamic provider message.
export const DeprecatedEventResponseSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		name: z.string().optional(),
		currency: z.string().nullable().optional(),
		deleted: z.boolean().optional(),
		message: z.string().optional(),
		error: z.string().optional(),
	})
	.passthrough();
export type DeprecatedEventResponse = z.infer<
	typeof DeprecatedEventResponseSchema
>;

export const MilestoneSchema = z
	.object({
		id: z.string(),
		object: z.literal('milestone'),
		name: z.string(),
		milestone_date: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
	})
	.passthrough();
export type Milestone = z.infer<typeof MilestoneSchema>;

export const MilestoneListResponseSchema = z
	.object({
		object: z.literal('list'),
		url: z.string(),
		has_more: z.boolean(),
		data: z.array(MilestoneSchema),
	})
	.passthrough();
export type MilestoneListResponse = z.infer<typeof MilestoneListResponseSchema>;

export const MilestoneDeleteResponseSchema = z
	.object({
		id: z.string(),
		object: z.literal('milestone'),
		deleted: z.literal(true),
	})
	.passthrough();
export type MilestoneDeleteResponse = z.infer<
	typeof MilestoneDeleteResponseSchema
>;

export const AggregationFilterSchema = z
	.object({
		property: z.string(),
		operator: z.enum([
			'is',
			'is not',
			'is like',
			'is not like',
			'matching',
			'not matching',
		]),
		value: z.string(),
	})
	.strict();
export type AggregationFilter = z.infer<typeof AggregationFilterSchema>;

// Untrusted dynamic aggregation record whose keys depend on field_grouping and aggregates.
export const AggregationRecordSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.null()]),
);
export const AggregationsResponseSchema = z.array(AggregationRecordSchema);
export type AggregationsResponse = z.infer<typeof AggregationsResponseSchema>;

export const CurrentVisitorsSimpleSchema = z
	.object({
		total: z.number(),
	})
	.passthrough();

export const CurrentVisitorsDetailedSchema = z
	.object({
		total: z.number(),
		content: z
			.array(
				z
					.object({
						hostname: z.string(),
						pathname: z.string(),
						total: z.number(),
					})
					.passthrough(),
			)
			.optional(),
		referrers: z
			.array(
				z
					.object({
						referrer_hostname: z.string(),
						referrer_pathname: z.string(),
						total: z.number(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

export const CurrentVisitorsResponseSchema = z.union([
	CurrentVisitorsDetailedSchema,
	CurrentVisitorsSimpleSchema,
]);
export type CurrentVisitorsResponse = z.infer<
	typeof CurrentVisitorsResponseSchema
>;

// Ids go into the URL path. `.` and `..` survive encodeURIComponent and the URL parser
// resolves them, so `milestones/..` would address the site itself; reject both.
const PathIdSchema = z
	.string()
	.min(1)
	.refine((value) => value !== '.' && value !== '..', {
		message: 'Id cannot be "." or ".."',
	});

export const FathomEndpointInputSchemas = {
	'account.get': z.object({}).strict().optional(),
	'account.getToken': z.object({}).strict().optional(),
	'sites.list': z
		.object({
			limit: z.number().int().min(1).max(100).optional(),
			starting_after: z.string().optional(),
			ending_before: z.string().optional(),
		})
		.strict()
		.optional(),
	'sites.create': z
		.object({
			name: z.string().min(1).max(255),
			sharing: z.enum(['none', 'private', 'public']).optional(),
			share_password: z.string().max(255).optional(),
			timezone: z.string().optional(),
			multi_domain: z.boolean().optional(),
			multi_domain_option: z.enum(['combined', 'separate']).optional(),
		})
		.strict(),
	'sites.get': z
		.object({
			site_id: PathIdSchema,
		})
		.strict(),
	'sites.update': z
		.object({
			site_id: PathIdSchema,
			name: z.string().min(1).max(255).optional(),
			sharing: z.enum(['none', 'private', 'public']).optional(),
			share_password: z.string().max(255).optional(),
			timezone: z.string().optional(),
			multi_domain: z.boolean().optional(),
			multi_domain_option: z.enum(['combined', 'separate']).optional(),
		})
		.strict(),
	'sites.delete': z
		.object({
			site_id: PathIdSchema,
		})
		.strict(),
	'sites.wipe': z
		.object({
			site_id: PathIdSchema,
		})
		.strict(),
	'events.list': z
		.object({
			site_id: PathIdSchema,
			limit: z.number().int().min(1).max(100).optional(),
			starting_after: z.string().optional(),
			ending_before: z.string().optional(),
		})
		.strict(),
	'events.setCurrency': z
		.object({
			site_id: PathIdSchema,
			name: z.string().min(1).max(255),
			currency: CurrencyEnum,
		})
		.strict(),
	'events.deleteByName': z
		.object({
			site_id: PathIdSchema,
			name: z.string().min(1),
		})
		.strict(),
	'events.create': z
		.object({
			site_id: PathIdSchema,
			name: z.string().min(1).max(255),
			currency: CurrencyEnum.optional(),
		})
		.strict(),
	'events.get': z
		.object({
			site_id: PathIdSchema,
			event_id: PathIdSchema,
		})
		.strict(),
	'events.update': z
		.object({
			site_id: PathIdSchema,
			event_id: PathIdSchema,
			name: z.string().min(1).max(255).optional(),
			currency: CurrencyEnum.optional(),
		})
		.strict(),
	'events.delete': z
		.object({
			site_id: PathIdSchema,
			event_id: PathIdSchema,
		})
		.strict(),
	'events.wipe': z
		.object({
			site_id: PathIdSchema,
			event_id: PathIdSchema,
		})
		.strict(),
	'milestones.list': z
		.object({
			site_id: PathIdSchema,
			limit: z.number().int().min(1).max(100).optional(),
			starting_after: z.string().optional(),
			ending_before: z.string().optional(),
		})
		.strict(),
	'milestones.create': z
		.object({
			site_id: PathIdSchema,
			name: z.string().min(1).max(30),
			milestone_date: z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
		})
		.strict(),
	'milestones.get': z
		.object({
			site_id: PathIdSchema,
			milestone_id: PathIdSchema,
		})
		.strict(),
	'milestones.update': z
		.object({
			site_id: PathIdSchema,
			milestone_id: PathIdSchema,
			name: z.string().min(1).max(30),
			milestone_date: z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
		})
		.strict(),
	'milestones.delete': z
		.object({
			site_id: PathIdSchema,
			milestone_id: PathIdSchema,
		})
		.strict(),
	'reports.aggregation': z
		.object({
			entity: z.enum(['pageview', 'event']),
			entity_id: z.string().optional(),
			site_id: z.string().optional(),
			entity_name: z.string().optional(),
			aggregates: z.string().min(1),
			date_grouping: DateGroupingEnum.optional(),
			field_grouping: z.string().optional(),
			sort_by: z.string().optional(),
			date_from: z.string().optional(),
			date_to: z.string().optional(),
			timezone: z.string().optional(),
			limit: z.number().int().min(1).max(1000).optional(),
			filters: z
				.union([z.string(), z.array(AggregationFilterSchema)])
				.optional(),
		})
		.strict(),
	'reports.currentVisitors': z
		.object({
			site_id: z.string().min(1),
			detailed: z.boolean().optional(),
		})
		.strict(),
} as const;

export const FathomEndpointOutputSchemas = {
	'account.get': AccountSchema,
	'account.getToken': TokenSchema,
	'sites.list': SiteListResponseSchema,
	'sites.create': SiteSchema,
	'sites.get': SiteSchema,
	'sites.update': SiteSchema,
	'sites.delete': SiteDeleteResponseSchema,
	'sites.wipe': SiteWipeResponseSchema,
	'events.list': EventListResponseSchema,
	'events.setCurrency': EventSetCurrencyResponseSchema,
	'events.deleteByName': EventDeleteResponseSchema,
	'events.create': DeprecatedEventResponseSchema,
	'events.get': DeprecatedEventResponseSchema,
	'events.update': DeprecatedEventResponseSchema,
	'events.delete': DeprecatedEventResponseSchema,
	'events.wipe': DeprecatedEventResponseSchema,
	'milestones.list': MilestoneListResponseSchema,
	'milestones.create': MilestoneSchema,
	'milestones.get': MilestoneSchema,
	'milestones.update': MilestoneSchema,
	'milestones.delete': MilestoneDeleteResponseSchema,
	'reports.aggregation': AggregationsResponseSchema,
	'reports.currentVisitors': CurrentVisitorsResponseSchema,
} as const;

export type FathomEndpointInputs = {
	[K in keyof typeof FathomEndpointInputSchemas]: z.infer<
		(typeof FathomEndpointInputSchemas)[K]
	>;
};

export type FathomEndpointOutputs = {
	[K in keyof typeof FathomEndpointOutputSchemas]: z.infer<
		(typeof FathomEndpointOutputSchemas)[K]
	>;
};
