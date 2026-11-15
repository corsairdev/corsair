import { z } from 'zod';

// Inputs and outputs follow Klaviyo's stable spec
// (github.com/klaviyo/openapi, openapi/stable.json, revision 2026-10-15).
//
// Klaviyo speaks JSON:API: every write is `{ data: { type, id?, attributes } }`
// and every read answers `{ data, links }`, where `data` is an array on a list
// route. The operations take the plain fields and build that envelope, so a
// caller never writes `attributes` by hand.
//
// Outputs are `.loose()` and their fields nullish, so a field Klaviyo adds
// cannot fail a call that has already happened.

// ── Shared pieces ────────────────────────────────────────────────────────────

/**
 * A value inside a caller-owned map, such as profile properties or an event's
 * payload.
 *
 * These are open maps whose keys the caller defines, so the leaves are typed as
 * JSON rather than by a provider model. Written as a recursive union rather than
 * `z.unknown()` because the docs generator renders `ZodUnknown` as `any`.
 */
type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

/** An open JSON object, typed as one value per key. */
const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

/**
 * A JSON:API resource, as one entry of `data`.
 *
 * `attributes` is left open on purpose: each resource has its own set and
 * `readOnly` marks most of them, so the typed reads below restate the fields
 * callers actually use.
 */
const ResourceSchema = z
	.object({
		type: z.string(),
		id: z.string(),
		attributes: JsonObjectSchema.nullish(), // unknown: each resource has its own attribute set.
		relationships: JsonObjectSchema.nullish(), // unknown: see the resource schema. // unknown: relationship payloads vary per resource.
		links: JsonObjectSchema.nullish(), // unknown: JSON:API links are an open map.
	})
	.loose();

/** `links.next` carries the cursor for the following page. */
const LinksSchema = z
	.object({
		self: z.string().nullish(),
		next: z.string().nullish(),
		prev: z.string().nullish(),
	})
	.loose();

/**
 * What a list route returns.
 *
 * `nextCursor` is derived in the endpoint from `links.next`, whose full URL
 * carries the cursor; without it a caller would have to parse the URL itself.
 * It is declared here rather than added by a `.transform()` so the docs
 * generator can see it.
 */
function listEnvelope<T extends z.ZodType>(item: T) {
	return z.object({
		data: z.array(item),
		// JSON:API puts the resources named in `include` here, beside `data`.
		included: z
			.array(ResourceSchema)
			.nullish()
			.describe('Related resources requested through `include`.'),
		nextCursor: z
			.string()
			.nullish()
			.describe(
				'Pass as `cursor` to read the next page; absent on the last one.',
			),
		links: LinksSchema.nullish(),
	});
}

/** What a single-resource route returns. */
function singleEnvelope<T extends z.ZodType>(item: T) {
	return z.object({
		data: item,
		// Present when `include` asked for related resources.
		included: z
			.array(ResourceSchema)
			.nullish()
			.describe('Related resources requested through `include`.'),
		links: LinksSchema.nullish(),
	});
}

/** The cursor query parameter every paged list route shares. */
const CursorSchema = z
	.string()
	.min(1)
	.optional()
	.describe(
		'The `page[cursor]` value, taken from the previous response `links.next`. Omit for the first page.',
	);

/**
 * The cursor and page-size parameters of a paged list route.
 *
 * The spec sets a different `page[size]` ceiling and default per route (10 for
 * lists and segments, 25 for tag groups, 50 for tags, 100 for profiles, 1000 for
 * events), and Klaviyo answers 400 above the ceiling, so each route passes its
 * own.
 */
function pageSchema(max: number, defaultSize: number) {
	return {
		cursor: CursorSchema,
		pageSize: z
			.number()
			.int()
			.min(1)
			.max(max)
			.optional()
			.describe(`Rows per page, 1 to ${max}. Defaults to ${defaultSize}.`),
	};
}

/**
 * Klaviyo filters with `filter=equals(email,"a@b.com")`, a string expression
 * rather than separate parameters. The syntax is passed through as written.
 */
const FilterSchema = z
	.string()
	.min(1)
	.optional()
	.describe(
		'A filter expression such as "equals(email,\\"a@b.com\\")", combined with and()/or(). Field names and operators differ per resource; see Klaviyo filter syntax.',
	);

/** The `fields[resource]` sparse fieldset parameter. */
const FieldsSchema = z
	.array(z.string().min(1))
	.min(1)
	.optional()
	.describe('Return only these fields, as a sparse fieldset.');

const SortSchema = z
	.string()
	.min(1)
	.optional()
	.describe(
		'Sort field, prefixed with `-` for descending, such as `-created`.',
	);

// ── profiles ────────────────────────────────────────────────────────────────

/**
 * A coordinate, which the spec types as a string or a number on both the
 * request and the response.
 */
const CoordinateSchema = z.union([z.string(), z.number()]);

const ProfileLocationSchema = z
	.object({
		address1: z.string().nullish(),
		address2: z.string().nullish(),
		city: z.string().nullish(),
		country: z.string().nullish(),
		latitude: CoordinateSchema.nullish(),
		longitude: CoordinateSchema.nullish(),
		region: z.string().nullish(),
		zip: z.string().nullish(),
		timezone: z.string().nullish(),
	})
	.loose();

const ProfileSchema = z
	.object({
		type: z.literal('profile'),
		id: z.string(),
		attributes: z
			.object({
				email: z.string().nullish(),
				phone_number: z.string().nullish(),
				external_id: z.string().nullish(),
				first_name: z.string().nullish(),
				last_name: z.string().nullish(),
				organization: z.string().nullish(),
				locale: z.string().nullish(),
				title: z.string().nullish(),
				image: z.string().nullish(),
				location: ProfileLocationSchema.nullish(),
				// unknown: a free-form map Klaviyo echoes, whose keys the caller owns.
				properties: JsonObjectSchema.nullish(),
				created: z.string().nullish(),
				updated: z.string().nullish(),
				last_event_date: z.string().nullish(),
				subscriptions: JsonObjectSchema.nullish(), // unknown: per-channel consent tree.
				predictive_analytics: JsonObjectSchema.nullish(), // unknown: a computed map.
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoProfile = z.infer<typeof ProfileSchema>;

const ProfilesListInputSchema = z.object({
	filter: FilterSchema,
	sort: SortSchema,
	fields: FieldsSchema.describe('Return only these profile fields.'),
	additionalFields: z
		.array(
			z.enum([
				'subscriptions',
				'predictive_analytics',
				'hashed_email',
				'hashed_phone_number',
			]),
		)
		.min(1)
		.optional()
		.describe('Extra fields to include beyond the default set.'),
	include: z
		.array(z.enum(['conversations', 'push-tokens']))
		.min(1)
		.optional(),
	...pageSchema(100, 20),
});

export type ProfilesListInput = z.input<typeof ProfilesListInputSchema>;

const ProfilesListResponseSchema = listEnvelope(ProfileSchema);

export type ProfilesListResponse = z.infer<typeof ProfilesListResponseSchema>;

const ProfilesGetInputSchema = z.object({
	id: z.string().min(1).describe('The profile id.'),
	include: z
		.array(z.enum(['conversations', 'push-tokens']))
		.min(1)
		.optional(),
});

export type ProfilesGetInput = z.input<typeof ProfilesGetInputSchema>;

const ProfilesCreateInputSchema = z
	.object({
		email: z.email().optional(),
		phone_number: z.string().min(1).optional(),
		external_id: z.string().min(1).optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		organization: z.string().optional(),
		locale: z.string().optional(),
		title: z.string().optional(),
		image: z.url().optional(),
		location: ProfileLocationSchema.optional(),
		properties: z
			.record(z.string(), z.unknown()) // unknown: caller-owned keys.
			.optional()
			.describe('Custom properties, stored as sent.'),
	})
	.superRefine((value, ctx) => {
		// Klaviyo identifies a profile by at least one of these, and rejects a
		// create with none of them.
		if (
			value.email === undefined &&
			value.phone_number === undefined &&
			value.external_id === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['email'],
				message: 'Pass at least one of email, phone_number or external_id.',
			});
		}
	});

export type ProfilesCreateInput = z.input<typeof ProfilesCreateInputSchema>;

const ProfilesUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		email: z.email().optional(),
		phone_number: z.string().min(1).optional(),
		external_id: z.string().min(1).optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		organization: z.string().optional(),
		locale: z.string().optional(),
		title: z.string().optional(),
		image: z.url().optional(),
		location: ProfileLocationSchema.optional(),
		properties: JsonObjectSchema.optional(), // unknown: caller-owned keys.
	})
	.superRefine((value, ctx) => {
		const fields = [
			value.email,
			value.phone_number,
			value.external_id,
			value.first_name,
			value.last_name,
			value.organization,
			value.locale,
			value.title,
			value.image,
			value.location,
			value.properties,
		];
		if (fields.every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['first_name'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type ProfilesUpdateInput = z.input<typeof ProfilesUpdateInputSchema>;

const ProfilesSubscribeInputSchema = z
	.object({
		listId: z.string().min(1).describe('The list to subscribe the profile to.'),
		email: z.email().optional(),
		phone_number: z.string().min(1).optional(),
		channels: z
			.array(z.enum(['email', 'sms']))
			.min(1)
			.optional()
			.describe('Which channels to subscribe. Defaults to email.'),
	})
	.superRefine((value, ctx) => {
		// Each channel needs its own identifier: Klaviyo cannot subscribe a phone
		// number over email or an email over SMS, and a missing one is a job that
		// silently does nothing.
		const channels = value.channels ?? ['email'];
		if (channels.includes('email') && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['email'],
				message: 'The email channel needs `email`.',
			});
		}
		if (channels.includes('sms') && value.phone_number === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['phone_number'],
				message: 'The sms channel needs `phone_number`.',
			});
		}
	});

export type ProfilesSubscribeInput = z.input<
	typeof ProfilesSubscribeInputSchema
>;

// ── lists ───────────────────────────────────────────────────────────────────

const ListSchema = z
	.object({
		type: z.literal('list'),
		id: z.string(),
		attributes: z
			.object({
				name: z.string().nullish(),
				created: z.string().nullish(),
				updated: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoList = z.infer<typeof ListSchema>;

const ListsListInputSchema = z.object({
	filter: FilterSchema,
	sort: SortSchema,
	fields: FieldsSchema,
	...pageSchema(10, 10),
});

export type ListsListInput = z.input<typeof ListsListInputSchema>;

const ListsListResponseSchema = listEnvelope(ListSchema);

export type ListsListResponse = z.infer<typeof ListsListResponseSchema>;

const ListsGetInputSchema = z.object({ id: z.string().min(1) });

export type ListsGetInput = z.input<typeof ListsGetInputSchema>;

const ListsCreateInputSchema = z.object({
	name: z.string().min(1).describe('The list name.'),
});

export type ListsCreateInput = z.input<typeof ListsCreateInputSchema>;

const ListsUpdateInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1).describe('The new list name.'),
});

export type ListsUpdateInput = z.input<typeof ListsUpdateInputSchema>;

const ListsRemoveInputSchema = z.object({
	id: z.string().min(1).describe('The list to delete.'),
});

export type ListsRemoveInput = z.input<typeof ListsRemoveInputSchema>;

const ListsProfilesInputSchema = z.object({
	id: z.string().min(1).describe('The list id.'),
	filter: FilterSchema,
	...pageSchema(100, 20),
});

export type ListsProfilesInput = z.input<typeof ListsProfilesInputSchema>;

const ListsAddProfilesInputSchema = z.object({
	id: z.string().min(1).describe('The list id.'),
	profileIds: z
		.array(z.string().min(1))
		.min(1)
		.max(1000)
		.describe('Profile ids to add, up to 1000.'),
});

export type ListsAddProfilesInput = z.input<typeof ListsAddProfilesInputSchema>;

const ListsRemoveProfilesInputSchema = z.object({
	id: z.string().min(1),
	profileIds: z.array(z.string().min(1)).min(1).max(1000),
});

export type ListsRemoveProfilesInput = z.input<
	typeof ListsRemoveProfilesInputSchema
>;

// ── segments ────────────────────────────────────────────────────────────────

const SegmentSchema = z
	.object({
		type: z.literal('segment'),
		id: z.string(),
		attributes: z
			.object({
				name: z.string().nullish(),
				created: z.string().nullish(),
				updated: z.string().nullish(),
				is_active: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoSegment = z.infer<typeof SegmentSchema>;

const SegmentsListInputSchema = z.object({
	filter: FilterSchema,
	sort: SortSchema,
	fields: FieldsSchema,
	...pageSchema(10, 10),
});

export type SegmentsListInput = z.input<typeof SegmentsListInputSchema>;

const SegmentsListResponseSchema = listEnvelope(SegmentSchema);

export type SegmentsListResponse = z.infer<typeof SegmentsListResponseSchema>;

const SegmentsGetInputSchema = z.object({ id: z.string().min(1) });

export type SegmentsGetInput = z.input<typeof SegmentsGetInputSchema>;

/**
 * A segment is defined by a definition expression, not a plain filter.
 * Klaviyo evaluates it asynchronously and the segment is not immediately
 * populated.
 */
const SegmentsCreateInputSchema = z.object({
	name: z.string().min(1).describe('The segment name.'),
	definition: z
		.record(z.string(), z.unknown()) // unknown: a condition group tree.
		.describe(
			'The segment definition, a JSON:API condition group such as { condition_groups: [...] }. Klaviyo evaluates it server-side.',
		),
});

export type SegmentsCreateInput = z.input<typeof SegmentsCreateInputSchema>;

const SegmentsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().min(1).optional(),
		definition: JsonObjectSchema.optional(), // unknown: a condition group tree.
	})
	.superRefine((value, ctx) => {
		if (value.name === undefined && value.definition === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['name'],
				message: 'Pass at least one of name or definition.',
			});
		}
	});

export type SegmentsUpdateInput = z.input<typeof SegmentsUpdateInputSchema>;

const SegmentsRemoveInputSchema = z.object({ id: z.string().min(1) });

export type SegmentsRemoveInput = z.input<typeof SegmentsRemoveInputSchema>;

const SegmentsProfilesInputSchema = z.object({
	id: z.string().min(1),
	filter: FilterSchema,
	...pageSchema(100, 20),
});

export type SegmentsProfilesInput = z.input<typeof SegmentsProfilesInputSchema>;

// ── events ──────────────────────────────────────────────────────────────────

const EventSchema = z
	.object({
		type: z.literal('event'),
		id: z.string(),
		attributes: z
			.object({
				timestamp: z.number().nullish(),
				event_properties: JsonObjectSchema.nullish(), // unknown: caller-owned keys.
				datetime: z.string().nullish(),
				uuid: z.string().nullish(),
			})
			.loose()
			.nullish(),
		relationships: JsonObjectSchema.nullish(), // unknown: see the resource schema.
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoEvent = z.infer<typeof EventSchema>;

const EventsListInputSchema = z.object({
	filter: FilterSchema,
	sort: SortSchema,
	fields: FieldsSchema,
	include: z
		.array(z.enum(['profile', 'metric']))
		.min(1)
		.optional(),
	...pageSchema(1000, 200),
});

export type EventsListInput = z.input<typeof EventsListInputSchema>;

const EventsListResponseSchema = listEnvelope(EventSchema);

export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

const EventsGetInputSchema = z.object({ id: z.string().min(1) });

export type EventsGetInput = z.input<typeof EventsGetInputSchema>;

/**
 * An event is identified by its metric name, not an id: Klaviyo creates the
 * metric on first use. The `time` is required and must be UTC.
 */
const EventsCreateInputSchema = z
	.object({
		metric: z
			.string()
			.min(1)
			.describe(
				'The metric name, such as "Placed Order". Klaviyo creates the metric if it is new.',
			),
		profileId: z
			.string()
			.min(1)
			.optional()
			.describe('The profile the event belongs to. Pass this or `email`.'),
		email: z
			.email()
			.optional()
			.describe('The profile email, when the id is not known.'),
		properties: z
			.record(z.string(), z.unknown()) // unknown: caller-owned keys.
			.describe(
				'Event properties, such as a cart total. Required by the spec.',
			),
		value: z.number().optional().describe('A monetary value for the event.'),
		valueCurrency: z.string().optional(),
		time: z
			.string()
			.optional()
			.describe(
				'ISO 8601 UTC timestamp. Defaults to now; Klaviyo rejects a time in the future or older than its retention window.',
			),
		uniqueId: z
			.string()
			.min(1)
			.optional()
			.describe('A caller idempotency id, deduplicating a repeated send.'),
		backfill: z
			.boolean()
			.optional()
			.describe('Mark the event as historical rather than live.'),
	})
	.superRefine((value, ctx) => {
		// The profile is required, by id or by email.
		if (value.profileId === undefined && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['profileId'],
				message: 'Pass profileId or email.',
			});
		}
	});

export type EventsCreateInput = z.input<typeof EventsCreateInputSchema>;

// ── metrics ─────────────────────────────────────────────────────────────────

const MetricSchema = z
	.object({
		type: z.literal('metric'),
		id: z.string(),
		attributes: z
			.object({
				name: z.string().nullish(),
				created: z.string().nullish(),
				updated: z.string().nullish(),
				integration: JsonObjectSchema.nullish(), // unknown: provider-specific.
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoMetric = z.infer<typeof MetricSchema>;

/**
 * Metrics take no `page[size]`: Klaviyo answers 400
 * `'page_size' is not a valid field for the resource 'metric'`, verified live.
 * Only `filter`, the sparse fieldset and a cursor are accepted.
 */
const MetricsListInputSchema = z.object({
	filter: FilterSchema,
	fields: FieldsSchema,
	cursor: CursorSchema,
});

export type MetricsListInput = z.input<typeof MetricsListInputSchema>;

const MetricsListResponseSchema = listEnvelope(MetricSchema);

export type MetricsListResponse = z.infer<typeof MetricsListResponseSchema>;

const MetricsGetInputSchema = z.object({ id: z.string().min(1) });

export type MetricsGetInput = z.input<typeof MetricsGetInputSchema>;

/**
 * The aggregate endpoint answers a small report rather than a resource:
 * `data.attributes.dates` lists the bucket start times, and each entry of
 * `data.attributes.data` is one series whose measurement arrays line up with
 * those dates.
 */
const MetricAggregateInputSchema = z.object({
	metricId: z.string().min(1).describe('The metric to aggregate.'),
	measurements: z
		.array(z.string().min(1))
		.min(1)
		.describe('What to compute, such as ["count"] or ["sum_value", "count"].'),
	interval: z
		.enum(['hour', 'day', 'week', 'month'])
		.describe('The bucket size.'),
	pageCursor: z.string().min(1).optional(),
	by: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Group by these dimensions, such as ["$attributed_message"].'),
	// Required by the spec: Klaviyo rejects an aggregate with no date range.
	filter: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			'Filter expressions in Klaviyo filter syntax. A date range is required, such as ["greater-or-equal(datetime,2026-01-01T00:00:00)", "less-than(datetime,2026-02-01T00:00:00)"].',
		),
	timezone: z.string().optional(),
});

export type MetricAggregateInput = z.input<typeof MetricAggregateInputSchema>;

const MetricAggregateResponseSchema = z
	.object({
		data: z
			.object({
				type: z.string().nullish(),
				id: z.string().nullish(),
				attributes: z
					.object({
						dates: z
							.array(z.string())
							.nullish()
							.describe('The start of each bucket, as ISO 8601 strings.'),
						data: z
							.array(
								z
									.object({
										dimensions: z.array(z.string()).nullish(),
										measurements: JsonObjectSchema.nullish(), // unknown: one array per requested measurement.
									})
									.loose(),
							)
							.nullish()
							.describe(
								'One row per `by` grouping; each measurement array lines up with `dates`.',
							),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type MetricAggregateResponse = z.infer<
	typeof MetricAggregateResponseSchema
>;

// ── webhooks ────────────────────────────────────────────────────────────────

const WebhookSchema = z
	.object({
		type: z.literal('webhook'),
		id: z.string(),
		attributes: z
			.object({
				name: z.string().nullish(),
				description: z.string().nullish(),
				endpoint_url: z.string().nullish(),
				enabled: z.boolean().nullish(),
				created_at: z.string().nullish(),
				updated_at: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoWebhook = z.infer<typeof WebhookSchema>;

/**
 * The spec gives the webhooks route no `page[size]`, like metrics, so only a
 * cursor is accepted: the response still carries `links.next`.
 */
const WebhooksListInputSchema = z.object({
	cursor: CursorSchema,
});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = listEnvelope(WebhookSchema);

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksGetInputSchema = z.object({ id: z.string().min(1) });

export type WebhooksGetInput = z.input<typeof WebhooksGetInputSchema>;

const WebhooksCreateInputSchema = z.object({
	name: z.string().min(1).describe('A name for the webhook.'),
	endpointUrl: z.url().describe('Where Klaviyo POSTs the events.'),
	secretKey: z
		.string()
		.min(1)
		.describe(
			'The shared secret Klaviyo signs deliveries with; the spec marks it required. Use a long random value and verify the signature on your side.',
		),
	topicIds: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			'The webhook topic ids to subscribe to, from webhookTopics.list.',
		),
	description: z.string().optional(),
});

export type WebhooksCreateInput = z.input<typeof WebhooksCreateInputSchema>;

const WebhooksUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		endpointUrl: z.url().optional(),
		enabled: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (
			!anySet(value.name, value.description, value.endpointUrl, value.enabled)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['name'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type WebhooksUpdateInput = z.input<typeof WebhooksUpdateInputSchema>;

const WebhooksRemoveInputSchema = z.object({ id: z.string().min(1) });

export type WebhooksRemoveInput = z.input<typeof WebhooksRemoveInputSchema>;

const WebhookTopicSchema = z
	.object({
		type: z.literal('webhook-topic'),
		id: z.string(),
		attributes: z
			.object({
				name: z.string().nullish(),
				description: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoWebhookTopic = z.infer<typeof WebhookTopicSchema>;

const WebhookTopicsListInputSchema = z.object({});

export type WebhookTopicsListInput = z.input<
	typeof WebhookTopicsListInputSchema
>;

const WebhookTopicsListResponseSchema = listEnvelope(WebhookTopicSchema);

export type WebhookTopicsListResponse = z.infer<
	typeof WebhookTopicsListResponseSchema
>;

// ── tags ────────────────────────────────────────────────────────────────────

const TagSchema = z
	.object({
		type: z.literal('tag'),
		id: z.string(),
		attributes: z
			.object({
				name: z.string().nullish(),
				created: z.string().nullish(),
				updated: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoTag = z.infer<typeof TagSchema>;

const TagsListInputSchema = z.object({
	filter: FilterSchema,
	...pageSchema(50, 50),
});

export type TagsListInput = z.input<typeof TagsListInputSchema>;

const TagsListResponseSchema = listEnvelope(TagSchema);

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

const TagsGetInputSchema = z.object({ id: z.string().min(1) });

export type TagsGetInput = z.input<typeof TagsGetInputSchema>;

const TagsCreateInputSchema = z.object({
	name: z.string().min(1).describe('The tag name, unique within its group.'),
});

export type TagsCreateInput = z.input<typeof TagsCreateInputSchema>;

const TagsUpdateInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
});

export type TagsUpdateInput = z.input<typeof TagsUpdateInputSchema>;

const TagsRemoveInputSchema = z.object({ id: z.string().min(1) });

export type TagsRemoveInput = z.input<typeof TagsRemoveInputSchema>;

// ── tag groups ──────────────────────────────────────────────────────────────

const TagGroupSchema = z
	.object({
		type: z.literal('tag-group'),
		id: z.string(),
		attributes: z
			.object({
				name: z.string().nullish(),
				exclusive: z.boolean().nullish(),
				default: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type KlaviyoTagGroup = z.infer<typeof TagGroupSchema>;

const TagGroupsListInputSchema = z.object({
	...pageSchema(25, 25),
});

export type TagGroupsListInput = z.input<typeof TagGroupsListInputSchema>;

const TagGroupsListResponseSchema = listEnvelope(TagGroupSchema);

export type TagGroupsListResponse = z.infer<typeof TagGroupsListResponseSchema>;

const TagGroupsCreateInputSchema = z.object({
	name: z.string().min(1).describe('The tag group name.'),
	exclusive: z
		.boolean()
		.optional()
		.describe('Only one tag from this group may apply to an object.'),
});

export type TagGroupsCreateInput = z.input<typeof TagGroupsCreateInputSchema>;

const TagGroupsRemoveInputSchema = z.object({ id: z.string().min(1) });

export type TagGroupsRemoveInput = z.input<typeof TagGroupsRemoveInputSchema>;

// ── helpers ─────────────────────────────────────────────────────────────────

/**
 * True when at least one value is set, so an update is not a no-op.
 *
 * `unknown` because the callers are zod refinements over several update shapes;
 * each passes its own fields and this only asks whether one is present.
 */
function anySet(...values: unknown[]): boolean {
	// unknown: see the note above.
	// unknown: see the note above.
	return values.some((value) => {
		if (value === undefined) return false;
		if (Array.isArray(value)) return true;
		if (typeof value === 'object' && value !== null) {
			return Object.keys(value).length > 0;
		}
		return true;
	});
}

// ── Registry ────────────────────────────────────────────────────────────────

export type KlaviyoEndpointInputs = {
	profilesList: z.input<typeof ProfilesListInputSchema>;
	profilesGet: z.input<typeof ProfilesGetInputSchema>;
	profilesCreate: z.input<typeof ProfilesCreateInputSchema>;
	profilesUpdate: z.input<typeof ProfilesUpdateInputSchema>;
	profilesSubscribe: z.input<typeof ProfilesSubscribeInputSchema>;
	listsList: z.input<typeof ListsListInputSchema>;
	listsGet: z.input<typeof ListsGetInputSchema>;
	listsCreate: z.input<typeof ListsCreateInputSchema>;
	listsUpdate: z.input<typeof ListsUpdateInputSchema>;
	listsRemove: z.input<typeof ListsRemoveInputSchema>;
	listsProfiles: z.input<typeof ListsProfilesInputSchema>;
	listsAddProfiles: z.input<typeof ListsAddProfilesInputSchema>;
	listsRemoveProfiles: z.input<typeof ListsRemoveProfilesInputSchema>;
	segmentsList: z.input<typeof SegmentsListInputSchema>;
	segmentsGet: z.input<typeof SegmentsGetInputSchema>;
	segmentsCreate: z.input<typeof SegmentsCreateInputSchema>;
	segmentsUpdate: z.input<typeof SegmentsUpdateInputSchema>;
	segmentsRemove: z.input<typeof SegmentsRemoveInputSchema>;
	segmentsProfiles: z.input<typeof SegmentsProfilesInputSchema>;
	eventsList: z.input<typeof EventsListInputSchema>;
	eventsGet: z.input<typeof EventsGetInputSchema>;
	eventsCreate: z.input<typeof EventsCreateInputSchema>;
	metricsList: z.input<typeof MetricsListInputSchema>;
	metricsGet: z.input<typeof MetricsGetInputSchema>;
	metricsAggregate: z.input<typeof MetricAggregateInputSchema>;
	webhooksList: z.input<typeof WebhooksListInputSchema>;
	webhooksGet: z.input<typeof WebhooksGetInputSchema>;
	webhooksCreate: z.input<typeof WebhooksCreateInputSchema>;
	webhooksUpdate: z.input<typeof WebhooksUpdateInputSchema>;
	webhooksRemove: z.input<typeof WebhooksRemoveInputSchema>;
	webhookTopicsList: z.input<typeof WebhookTopicsListInputSchema>;
	tagsList: z.input<typeof TagsListInputSchema>;
	tagsGet: z.input<typeof TagsGetInputSchema>;
	tagsCreate: z.input<typeof TagsCreateInputSchema>;
	tagsUpdate: z.input<typeof TagsUpdateInputSchema>;
	tagsRemove: z.input<typeof TagsRemoveInputSchema>;
	tagGroupsList: z.input<typeof TagGroupsListInputSchema>;
	tagGroupsCreate: z.input<typeof TagGroupsCreateInputSchema>;
	tagGroupsRemove: z.input<typeof TagGroupsRemoveInputSchema>;
};

export type KlaviyoEndpointOutputs = {
	profilesList: ProfilesListResponse;
	profilesGet: z.infer<typeof singleEnvelope<typeof ProfileSchema>>;
	profilesCreate: z.infer<typeof singleEnvelope<typeof ProfileSchema>>;
	profilesUpdate: z.infer<typeof singleEnvelope<typeof ProfileSchema>>;
	profilesSubscribe: { success: boolean };
	listsList: ListsListResponse;
	listsGet: z.infer<typeof singleEnvelope<typeof ListSchema>>;
	listsCreate: z.infer<typeof singleEnvelope<typeof ListSchema>>;
	listsUpdate: z.infer<typeof singleEnvelope<typeof ListSchema>>;
	listsRemove: { success: boolean };
	listsProfiles: ProfilesListResponse;
	listsAddProfiles: { success: boolean };
	listsRemoveProfiles: { success: boolean };
	segmentsList: SegmentsListResponse;
	segmentsGet: z.infer<typeof singleEnvelope<typeof SegmentSchema>>;
	segmentsCreate: z.infer<typeof singleEnvelope<typeof SegmentSchema>>;
	segmentsUpdate: z.infer<typeof singleEnvelope<typeof SegmentSchema>>;
	segmentsRemove: { success: boolean };
	segmentsProfiles: ProfilesListResponse;
	eventsList: EventsListResponse;
	eventsGet: z.infer<typeof singleEnvelope<typeof EventSchema>>;
	eventsCreate: { success: boolean };
	metricsList: MetricsListResponse;
	metricsGet: z.infer<typeof singleEnvelope<typeof MetricSchema>>;
	metricsAggregate: MetricAggregateResponse;
	webhooksList: WebhooksListResponse;
	webhooksGet: z.infer<typeof singleEnvelope<typeof WebhookSchema>>;
	webhooksCreate: z.infer<typeof singleEnvelope<typeof WebhookSchema>>;
	webhooksUpdate: z.infer<typeof singleEnvelope<typeof WebhookSchema>>;
	webhooksRemove: { success: boolean };
	webhookTopicsList: WebhookTopicsListResponse;
	tagsList: TagsListResponse;
	tagsGet: z.infer<typeof singleEnvelope<typeof TagSchema>>;
	tagsCreate: z.infer<typeof singleEnvelope<typeof TagSchema>>;
	tagsUpdate: { success: boolean };
	tagsRemove: { success: boolean };
	tagGroupsList: TagGroupsListResponse;
	tagGroupsCreate: z.infer<typeof singleEnvelope<typeof TagGroupSchema>>;
	tagGroupsRemove: { success: boolean };
};

const DeletedSchema = z.object({ success: z.boolean() });

export const KlaviyoEndpointInputSchemas = {
	profilesList: ProfilesListInputSchema,
	profilesGet: ProfilesGetInputSchema,
	profilesCreate: ProfilesCreateInputSchema,
	profilesUpdate: ProfilesUpdateInputSchema,
	profilesSubscribe: ProfilesSubscribeInputSchema,
	listsList: ListsListInputSchema,
	listsGet: ListsGetInputSchema,
	listsCreate: ListsCreateInputSchema,
	listsUpdate: ListsUpdateInputSchema,
	listsRemove: ListsRemoveInputSchema,
	listsProfiles: ListsProfilesInputSchema,
	listsAddProfiles: ListsAddProfilesInputSchema,
	listsRemoveProfiles: ListsRemoveProfilesInputSchema,
	segmentsList: SegmentsListInputSchema,
	segmentsGet: SegmentsGetInputSchema,
	segmentsCreate: SegmentsCreateInputSchema,
	segmentsUpdate: SegmentsUpdateInputSchema,
	segmentsRemove: SegmentsRemoveInputSchema,
	segmentsProfiles: SegmentsProfilesInputSchema,
	eventsList: EventsListInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsCreate: EventsCreateInputSchema,
	metricsList: MetricsListInputSchema,
	metricsGet: MetricsGetInputSchema,
	metricsAggregate: MetricAggregateInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksRemove: WebhooksRemoveInputSchema,
	webhookTopicsList: WebhookTopicsListInputSchema,
	tagsList: TagsListInputSchema,
	tagsGet: TagsGetInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsRemove: TagsRemoveInputSchema,
	tagGroupsList: TagGroupsListInputSchema,
	tagGroupsCreate: TagGroupsCreateInputSchema,
	tagGroupsRemove: TagGroupsRemoveInputSchema,
} as const;

export const KlaviyoEndpointOutputSchemas = {
	profilesList: ProfilesListResponseSchema,
	profilesGet: singleEnvelope(ProfileSchema),
	profilesCreate: singleEnvelope(ProfileSchema),
	profilesUpdate: singleEnvelope(ProfileSchema),
	profilesSubscribe: DeletedSchema,
	listsList: ListsListResponseSchema,
	listsGet: singleEnvelope(ListSchema),
	listsCreate: singleEnvelope(ListSchema),
	listsUpdate: singleEnvelope(ListSchema),
	listsRemove: DeletedSchema,
	listsProfiles: ProfilesListResponseSchema,
	listsAddProfiles: DeletedSchema,
	listsRemoveProfiles: DeletedSchema,
	segmentsList: SegmentsListResponseSchema,
	segmentsGet: singleEnvelope(SegmentSchema),
	segmentsCreate: singleEnvelope(SegmentSchema),
	segmentsUpdate: singleEnvelope(SegmentSchema),
	segmentsRemove: DeletedSchema,
	segmentsProfiles: ProfilesListResponseSchema,
	eventsList: EventsListResponseSchema,
	eventsGet: singleEnvelope(EventSchema),
	eventsCreate: DeletedSchema,
	metricsList: MetricsListResponseSchema,
	metricsGet: singleEnvelope(MetricSchema),
	metricsAggregate: MetricAggregateResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksGet: singleEnvelope(WebhookSchema),
	webhooksCreate: singleEnvelope(WebhookSchema),
	webhooksUpdate: singleEnvelope(WebhookSchema),
	webhooksRemove: DeletedSchema,
	webhookTopicsList: WebhookTopicsListResponseSchema,
	tagsList: TagsListResponseSchema,
	tagsGet: singleEnvelope(TagSchema),
	tagsCreate: singleEnvelope(TagSchema),
	tagsUpdate: DeletedSchema,
	tagsRemove: DeletedSchema,
	tagGroupsList: TagGroupsListResponseSchema,
	tagGroupsCreate: singleEnvelope(TagGroupSchema),
	tagGroupsRemove: DeletedSchema,
} as const;
