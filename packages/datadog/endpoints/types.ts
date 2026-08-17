import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared shapes
// ─────────────────────────────────────────────────────────────────────────────

/** v2 list pagination metadata returned by Datadog. */
const V2PaginationMetaSchema = z.object({
	page: z
		.object({
			total_count: z.number().optional(),
			total_filtered_count: z.number().optional(),
			after: z.string().optional(),
		})
		.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Dashboards (v1)
// ─────────────────────────────────────────────────────────────────────────────

export const DashboardSummarySchema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	description: z.string().nullable().optional(),
	layout_type: z.string().optional(),
	url: z.string().optional(),
	author_handle: z.string().optional(),
	is_read_only: z.boolean().optional(),
	created_at: z.string().optional(),
	modified_at: z.string().optional(),
});
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

const DashboardWidgetSchema = z.object({
	id: z.number().optional(),
	definition: z.record(z.string(), z.unknown()),
	layout: z
		.object({
			x: z.number(),
			y: z.number(),
			width: z.number(),
			height: z.number(),
		})
		.optional(),
});

export const DashboardSchema = DashboardSummarySchema.extend({
	widgets: z.array(DashboardWidgetSchema).optional(),
	template_variables: z
		.array(z.record(z.string(), z.unknown()))
		.nullable()
		.optional(),
	notify_list: z.array(z.string()).nullable().optional(),
	tags: z.array(z.string()).nullable().optional(),
});
export type Dashboard = z.infer<typeof DashboardSchema>;

const DashboardsListInputSchema = z.object({
	/** Only include dashboards shared with anyone. */
	filterShared: z.boolean().optional(),
	/** Include dashboards deleted in the last 30 days. */
	filterDeleted: z.boolean().optional(),
	/** Maximum number of dashboards to return (pagination). */
	count: z.number().optional(),
	/** Pagination offset. */
	start: z.number().optional(),
});
const DashboardsListResponseSchema = z.object({
	dashboards: z.array(DashboardSummarySchema).optional(),
});

/** Datadog dashboard ids are dash-separated alphanumeric tokens, e.g. "2xf-p3g-8ke". */
const DashboardIdSchema = z.string().regex(/^[a-zA-Z0-9-]+$/);

const DashboardsGetInputSchema = z.object({ dashboardId: DashboardIdSchema });

const DashboardsCreateInputSchema = z.object({
	title: z.string(),
	/** Widget definitions as documented at docs.datadoghq.com/api/latest/dashboards. */
	widgets: z.array(DashboardWidgetSchema),
	layoutType: z.enum(['ordered', 'free']),
	description: z.string().optional(),
	notifyList: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
});

const DashboardsUpdateInputSchema = DashboardsCreateInputSchema.extend({
	dashboardId: DashboardIdSchema,
});

const DashboardsDeleteInputSchema = z.object({
	dashboardId: DashboardIdSchema,
});
const DashboardsDeleteResponseSchema = z.object({
	deleted_dashboard_id: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Monitors (v1)
// ─────────────────────────────────────────────────────────────────────────────

export const MonitorSchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	query: z.string().optional(),
	message: z.string().optional(),
	tags: z.array(z.string()).optional(),
	priority: z.number().nullable().optional(),
	overall_state: z.string().optional(),
	created: z.string().optional(),
	modified: z.string().optional(),
	creator: z
		.object({
			name: z.string().nullable().optional(),
			email: z.string().optional(),
			handle: z.string().optional(),
		})
		.optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});
export type Monitor = z.infer<typeof MonitorSchema>;

const MonitorsListInputSchema = z.object({
	/** Filter by monitor name. */
	name: z.string().optional(),
	/** Filter monitors by scope tags, e.g. "host:host0". */
	tags: z.string().optional(),
	/** Filter by monitor tags, e.g. "service:my-app". */
	monitorTags: z.string().optional(),
	/** Filter by group states, e.g. "alert,warn". */
	groupStates: z.string().optional(),
	/** Page number (0-indexed) — use with pageSize to paginate. */
	page: z.number().optional(),
	/** Monitors per page. */
	pageSize: z.number().optional(),
});
const MonitorsListResponseSchema = z.array(MonitorSchema);

const MonitorsSearchInputSchema = z.object({
	/** Search query, e.g. "type:metric status:alert". */
	query: z.string().optional(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	sort: z.string().optional(),
});
const MonitorsSearchResponseSchema = z.object({
	monitors: z.array(MonitorSchema).optional(),
	metadata: z
		.object({
			total_count: z.number().optional(),
			page: z.number().optional(),
			page_count: z.number().optional(),
			per_page: z.number().optional(),
		})
		.optional(),
});

const MonitorsGetInputSchema = z.object({
	monitorId: z.number(),
	/** Include group states in the response, e.g. "all". */
	groupStates: z.string().optional(),
});

const MonitorsCreateInputSchema = z.object({
	/** Monitor type, e.g. "metric alert", "log alert", "query alert". */
	type: z.string(),
	/** Monitor query, e.g. "avg(last_5m):avg:system.cpu.user{*} > 90". */
	query: z.string(),
	name: z.string(),
	/** Notification message; supports @-notifications. */
	message: z.string().optional(),
	tags: z.array(z.string()).optional(),
	priority: z.number().optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});

const MonitorsUpdateInputSchema = z.object({
	monitorId: z.number(),
	name: z.string().optional(),
	query: z.string().optional(),
	message: z.string().optional(),
	tags: z.array(z.string()).optional(),
	priority: z.number().nullable().optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});

const MonitorsDeleteInputSchema = z.object({ monitorId: z.number() });
const MonitorsDeleteResponseSchema = z.object({
	deleted_monitor_id: z.number().optional(),
});

const MonitorsMuteInputSchema = z.object({
	monitorId: z.number(),
	/** Only mute this scope, e.g. "host:app1". */
	scope: z.string().optional(),
	/** POSIX timestamp for when the mute should end. */
	end: z.number().optional(),
});
const MonitorsUnmuteInputSchema = z.object({
	monitorId: z.number(),
	scope: z.string().optional(),
	allScopes: z.boolean().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// SLOs (v1)
// ─────────────────────────────────────────────────────────────────────────────

export const SloThresholdSchema = z.object({
	timeframe: z.string(),
	target: z.number(),
	warning: z.number().optional(),
});

export const SloSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	description: z.string().nullable().optional(),
	tags: z.array(z.string()).optional(),
	thresholds: z.array(SloThresholdSchema).optional(),
	monitor_ids: z.array(z.number()).optional(),
	query: z
		.object({
			numerator: z.string().optional(),
			denominator: z.string().optional(),
		})
		.optional(),
	created_at: z.number().optional(),
	modified_at: z.number().optional(),
});
export type Slo = z.infer<typeof SloSchema>;

const SlosListInputSchema = z.object({
	/** Comma-separated SLO ids. */
	ids: z.string().optional(),
	/** Filter by name/tags query string. */
	query: z.string().optional(),
	tagsQuery: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});
const SlosListResponseSchema = z.object({
	data: z.array(SloSchema).optional(),
	metadata: z
		.object({
			page: z
				.object({
					total_count: z.number().optional(),
					total_filtered_count: z.number().optional(),
				})
				.optional(),
		})
		.optional(),
});

const SlosCreateInputSchema = z.object({
	name: z.string(),
	/** "metric" or "monitor". */
	type: z.enum(['metric', 'monitor']),
	thresholds: z.array(SloThresholdSchema),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	/** Required for type "monitor". */
	monitorIds: z.array(z.number()).optional(),
	/** Required for type "metric": numerator/denominator queries. */
	query: z
		.object({ numerator: z.string(), denominator: z.string() })
		.optional(),
});
const SlosCreateResponseSchema = z.object({
	data: z.array(SloSchema).optional(),
	error: z.string().nullable().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Synthetics (v1)
// ─────────────────────────────────────────────────────────────────────────────

export const SyntheticsTestSchema = z.object({
	public_id: z.string().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	subtype: z.string().optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	locations: z.array(z.string()).optional(),
	config: z.record(z.string(), z.unknown()).optional(),
	options: z.record(z.string(), z.unknown()).optional(),
	message: z.string().optional(),
});
export type SyntheticsTest = z.infer<typeof SyntheticsTestSchema>;

const SyntheticsListTestsInputSchema = z.object({
	pageSize: z.number().optional(),
	pageNumber: z.number().optional(),
});
const SyntheticsListTestsResponseSchema = z.object({
	tests: z.array(SyntheticsTestSchema).optional(),
});

/** Synthetics public ids are dash-separated alphanumeric tokens, e.g. "abc-def-ghi". */
const SyntheticsGetApiTestInputSchema = z.object({
	publicId: z.string().regex(/^[a-zA-Z0-9-]+$/),
});

const SyntheticsCreateApiTestInputSchema = z.object({
	name: z.string(),
	/** Test configuration (request + assertions) per Datadog synthetics docs. */
	config: z.record(z.string(), z.unknown()),
	locations: z.array(z.string()),
	options: z.record(z.string(), z.unknown()),
	message: z.string().optional(),
	tags: z.array(z.string()).optional(),
	subtype: z.string().optional(),
});

const SyntheticsListLocationsResponseSchema = z.object({
	locations: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				display_name: z.string().optional(),
				region: z.string().optional(),
			}),
		)
		.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Events (v1)
// ─────────────────────────────────────────────────────────────────────────────

export const EventSchema = z.object({
	id: z.number().optional(),
	title: z.string().optional(),
	text: z.string().optional(),
	date_happened: z.number().optional(),
	priority: z.string().nullable().optional(),
	tags: z.array(z.string()).nullable().optional(),
	alert_type: z.string().optional(),
	source: z.string().optional(),
	host: z.string().nullable().optional(),
	url: z.string().optional(),
});
export type DatadogEvent = z.infer<typeof EventSchema>;

const EventsListInputSchema = z.object({
	/** POSIX timestamp — start of the query window. */
	start: z.number(),
	/** POSIX timestamp — end of the query window. */
	end: z.number(),
	priority: z.enum(['normal', 'low']).optional(),
	/** Comma-separated list of sources. */
	sources: z.string().optional(),
	/** Comma-separated list of tags. */
	tags: z.string().optional(),
	page: z.number().optional(),
});
const EventsListResponseSchema = z.object({
	events: z.array(EventSchema).optional(),
});

const EventsCreateInputSchema = z.object({
	title: z.string(),
	text: z.string(),
	tags: z.array(z.string()).optional(),
	alertType: z
		.enum([
			'error',
			'warning',
			'info',
			'success',
			'user_update',
			'recommendation',
			'snapshot',
		])
		.optional(),
	priority: z.enum(['normal', 'low']).optional(),
	host: z.string().optional(),
	aggregationKey: z.string().optional(),
	sourceTypeName: z.string().optional(),
});
const EventsCreateResponseSchema = z.object({
	status: z.string().optional(),
	event: EventSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Downtimes (v2)
// ─────────────────────────────────────────────────────────────────────────────

export const DowntimeSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	attributes: z
		.object({
			scope: z.string().optional(),
			status: z.string().optional(),
			message: z.string().nullable().optional(),
			created: z.string().optional(),
			modified: z.string().optional(),
			monitor_identifier: z.record(z.string(), z.unknown()).optional(),
			schedule: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
});
export type Downtime = z.infer<typeof DowntimeSchema>;

const DowntimesListInputSchema = z.object({
	/** Include only downtimes currently active. */
	currentOnly: z.boolean().optional(),
	pageOffset: z.number().optional(),
	pageLimit: z.number().optional(),
});
const DowntimesListResponseSchema = z
	.object({
		data: z.array(DowntimeSchema).optional(),
	})
	.and(V2PaginationMetaSchema.partial());

const DowntimesCreateInputSchema = z.object({
	/** The scope to mute, e.g. "env:prod" or "*". */
	scope: z.string(),
	message: z.string().optional(),
	/** Mute a specific monitor id; omit to mute by scope across monitors. */
	monitorId: z.number().optional(),
	/** ISO-8601 start; defaults to now. */
	start: z.string().optional(),
	/** ISO-8601 end; omit for an open-ended downtime. */
	end: z.string().optional(),
	/** IANA timezone for the schedule, e.g. "UTC". */
	timezone: z.string().optional(),
});
const DowntimesCreateResponseSchema = z.object({
	data: DowntimeSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Webhooks integration (v1)
// ─────────────────────────────────────────────────────────────────────────────

export const WebhookConfigSchema = z.object({
	name: z.string().optional(),
	url: z.string().optional(),
	payload: z.string().nullable().optional(),
	custom_headers: z.string().nullable().optional(),
	encode_as: z.string().optional(),
});
export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;

const WebhooksGetInputSchema = z.object({ webhookName: z.string() });

const WebhooksCreateInputSchema = z.object({
	name: z.string(),
	url: z.string(),
	/** Custom JSON payload template; uses Datadog $VARIABLES. */
	payload: z.string().optional(),
	customHeaders: z.string().optional(),
	encodeAs: z.enum(['json', 'form']).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Hosts & tags (v1)
// ─────────────────────────────────────────────────────────────────────────────

export const HostSchema = z.object({
	name: z.string().optional(),
	host_name: z.string().optional(),
	id: z.number().optional(),
	aliases: z.array(z.string()).optional(),
	apps: z.array(z.string()).optional(),
	is_muted: z.boolean().optional(),
	last_reported_time: z.number().optional(),
	up: z.boolean().optional(),
	sources: z.array(z.string()).optional(),
	tags_by_source: z.record(z.string(), z.array(z.string())).optional(),
});
export type Host = z.infer<typeof HostSchema>;

const HostsListInputSchema = z.object({
	/** Query string to filter hosts, e.g. "env:prod". */
	filter: z.string().optional(),
	sortField: z.string().optional(),
	sortDir: z.enum(['asc', 'desc']).optional(),
	/** Pagination offset. */
	start: z.number().optional(),
	/** Max hosts to return (default 100, max 1000). */
	count: z.number().optional(),
});
const HostsListResponseSchema = z.object({
	host_list: z.array(HostSchema).optional(),
	total_matching: z.number().optional(),
	total_returned: z.number().optional(),
});

const HostsTotalsResponseSchema = z.object({
	total_active: z.number().optional(),
	total_up: z.number().optional(),
});

const TagsListInputSchema = z.object({
	/** Only return tags from this source, e.g. "chef", "users". */
	source: z.string().optional(),
});
const TagsListResponseSchema = z.object({
	tags: z.record(z.string(), z.array(z.string())).optional(),
});

const TagsGetHostInputSchema = z.object({
	hostName: z.string(),
	source: z.string().optional(),
});
const TagsHostResponseSchema = z.object({
	host: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

const TagsUpdateHostInputSchema = z.object({
	hostName: z.string(),
	tags: z.array(z.string()),
	source: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Service definitions (v2)
// ─────────────────────────────────────────────────────────────────────────────

const ServicesListDefinitionsInputSchema = z.object({
	pageSize: z.number().optional(),
	pageNumber: z.number().optional(),
	/** Filter by schema version, e.g. "v2.2". */
	schemaVersion: z.string().optional(),
});
const ServicesListDefinitionsResponseSchema = z.object({
	data: z
		.array(
			z.object({
				type: z.string().optional(),
				id: z.string().optional(),
				attributes: z.record(z.string(), z.unknown()).optional(),
			}),
		)
		.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Spans (v2)
// ─────────────────────────────────────────────────────────────────────────────

const SpansSearchInputSchema = z.object({
	/** Spans search query, e.g. "service:web-store @http.status_code:500". */
	query: z.string(),
	/** ISO-8601 or relative time, e.g. "now-15m". */
	from: z.string(),
	/** ISO-8601 or relative time, e.g. "now". */
	to: z.string(),
	/** "timestamp" or "-timestamp". */
	sort: z.string().optional(),
	pageLimit: z.number().optional(),
	/** Cursor from meta.page.after for the next page. */
	pageCursor: z.string().optional(),
});
const SpansSearchResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					id: z.string().optional(),
					type: z.string().optional(),
					attributes: z.record(z.string(), z.unknown()).optional(),
				}),
			)
			.optional(),
		meta: V2PaginationMetaSchema.optional(),
	})
	.and(z.object({ links: z.record(z.string(), z.unknown()).optional() }));

const SpansAggregateInputSchema = z.object({
	query: z.string(),
	from: z.string(),
	to: z.string(),
	/** Aggregation, e.g. "count", "avg". */
	aggregation: z.string(),
	/** Metric to aggregate for non-count aggregations, e.g. "@duration". */
	metric: z.string().optional(),
	/** Facet to group by, e.g. "service". */
	groupBy: z.string().optional(),
});
const SpansAggregateResponseSchema = z.object({
	data: z
		.object({
			type: z.string().optional(),
			attributes: z.record(z.string(), z.unknown()).optional(),
		})
		.or(z.array(z.record(z.string(), z.unknown())))
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Logs (v1 config + v2 search)
// ─────────────────────────────────────────────────────────────────────────────

const LogsSearchInputSchema = z.object({
	/** Logs search query, e.g. "service:web status:error". */
	query: z.string(),
	from: z.string(),
	to: z.string(),
	/** Comma-separated index names; defaults to all indexes. */
	indexes: z.array(z.string()).optional(),
	sort: z.enum(['timestamp', '-timestamp']).optional(),
	pageLimit: z.number().optional(),
	pageCursor: z.string().optional(),
});
const LogsSearchResponseSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.string().optional(),
				type: z.string().optional(),
				attributes: z.record(z.string(), z.unknown()).optional(),
			}),
		)
		.optional(),
	meta: V2PaginationMetaSchema.optional(),
});

const LogsAggregateInputSchema = z.object({
	query: z.string(),
	from: z.string(),
	to: z.string(),
	/** Compute aggregation, e.g. "count". */
	aggregation: z.string(),
	metric: z.string().optional(),
	groupBy: z.string().optional(),
});
const LogsAggregateResponseSchema = z.object({
	data: z.record(z.string(), z.unknown()).optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

const LogsListIndexesResponseSchema = z.object({
	indexes: z
		.array(
			z.object({
				name: z.string().optional(),
				filter: z.record(z.string(), z.unknown()).optional(),
				is_rate_limited: z.boolean().optional(),
				daily_limit: z.number().nullable().optional(),
				num_retention_days: z.number().optional(),
			}),
		)
		.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Metrics (v1)
// ─────────────────────────────────────────────────────────────────────────────

const MetricsListActiveInputSchema = z.object({
	/** POSIX timestamp — list metrics active since this time. */
	from: z.number(),
	/** Filter by host. */
	host: z.string().optional(),
	/** Filter by tags, e.g. "env:prod". */
	tagFilter: z.string().optional(),
});
const MetricsListActiveResponseSchema = z.object({
	metrics: z.array(z.string()).optional(),
	from: z.string().optional(),
});

const MetricsQueryInputSchema = z.object({
	/** Metrics query, e.g. "avg:system.cpu.user{*}by{host}". */
	query: z.string(),
	/** POSIX timestamp — query window start. */
	from: z.number(),
	/** POSIX timestamp — query window end. */
	to: z.number(),
});
const MetricsQueryResponseSchema = z.object({
	status: z.string().optional(),
	query: z.string().optional(),
	from_date: z.number().optional(),
	to_date: z.number().optional(),
	series: z
		.array(
			z.object({
				metric: z.string().optional(),
				display_name: z.string().optional(),
				pointlist: z.array(z.array(z.number().nullable())).optional(),
				scope: z.string().optional(),
				unit: z
					.array(z.record(z.string(), z.unknown()).nullable())
					.nullable()
					.optional(),
			}),
		)
		.optional(),
});

const MetricsSubmitInputSchema = z.object({
	series: z.array(
		z.object({
			/** Metric name, e.g. "custom.deploys.count". */
			metric: z.string(),
			/** Array of [POSIX timestamp, value] points. */
			points: z.array(z.tuple([z.number(), z.number()])),
			type: z.enum(['gauge', 'count', 'rate']).optional(),
			host: z.string().optional(),
			tags: z.array(z.string()).optional(),
		}),
	),
});
const MetricsSubmitResponseSchema = z.object({
	status: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Users, roles, API keys, incidents, AWS, usage
// ─────────────────────────────────────────────────────────────────────────────

const V2ListInputSchema = z.object({
	pageSize: z.number().optional(),
	pageNumber: z.number().optional(),
	/** Filter string applied server-side where supported. */
	filter: z.string().optional(),
});

const V2ResourceSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	attributes: z.record(z.string(), z.unknown()).optional(),
	relationships: z.record(z.string(), z.unknown()).optional(),
});

const V2ListResponseSchema = z.object({
	data: z.array(V2ResourceSchema).optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

const IncidentsListInputSchema = z.object({
	pageSize: z.number().optional(),
	pageOffset: z.number().optional(),
});

const AwsListResponseSchema = z.object({
	accounts: z
		.array(
			z.object({
				account_id: z.string().nullable().optional(),
				role_name: z.string().nullable().optional(),
				filter_tags: z.array(z.string()).optional(),
				host_tags: z.array(z.string()).optional(),
				metrics_collection_enabled: z.boolean().optional(),
			}),
		)
		.optional(),
});

const UsageSummaryInputSchema = z.object({
	/** Start month for usage, ISO-8601 date e.g. "2026-06". */
	startMonth: z.string(),
	/** End month for usage; defaults to current month. */
	endMonth: z.string().optional(),
	includeOrgDetails: z.boolean().optional(),
});
const UsageSummaryResponseSchema = z.object({
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	usage: z.array(z.record(z.string(), z.unknown())).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Aggregated endpoint maps
// ─────────────────────────────────────────────────────────────────────────────

export const DatadogEndpointInputSchemas = {
	dashboardsList: DashboardsListInputSchema,
	dashboardsGet: DashboardsGetInputSchema,
	dashboardsCreate: DashboardsCreateInputSchema,
	dashboardsUpdate: DashboardsUpdateInputSchema,
	dashboardsDelete: DashboardsDeleteInputSchema,
	monitorsList: MonitorsListInputSchema,
	monitorsSearch: MonitorsSearchInputSchema,
	monitorsGet: MonitorsGetInputSchema,
	monitorsCreate: MonitorsCreateInputSchema,
	monitorsUpdate: MonitorsUpdateInputSchema,
	monitorsDelete: MonitorsDeleteInputSchema,
	monitorsMute: MonitorsMuteInputSchema,
	monitorsUnmute: MonitorsUnmuteInputSchema,
	slosList: SlosListInputSchema,
	slosCreate: SlosCreateInputSchema,
	syntheticsListTests: SyntheticsListTestsInputSchema,
	syntheticsGetApiTest: SyntheticsGetApiTestInputSchema,
	syntheticsCreateApiTest: SyntheticsCreateApiTestInputSchema,
	syntheticsListLocations: z.object({}),
	eventsList: EventsListInputSchema,
	eventsCreate: EventsCreateInputSchema,
	downtimesList: DowntimesListInputSchema,
	downtimesCreate: DowntimesCreateInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	hostsList: HostsListInputSchema,
	hostsTotals: z.object({}),
	tagsList: TagsListInputSchema,
	tagsGetHost: TagsGetHostInputSchema,
	tagsUpdateHost: TagsUpdateHostInputSchema,
	servicesListDefinitions: ServicesListDefinitionsInputSchema,
	spansSearch: SpansSearchInputSchema,
	spansAggregate: SpansAggregateInputSchema,
	logsSearch: LogsSearchInputSchema,
	logsAggregate: LogsAggregateInputSchema,
	logsListIndexes: z.object({}),
	metricsListActive: MetricsListActiveInputSchema,
	metricsQuery: MetricsQueryInputSchema,
	metricsSubmit: MetricsSubmitInputSchema,
	usersList: V2ListInputSchema,
	rolesList: V2ListInputSchema,
	apiKeysList: V2ListInputSchema,
	incidentsList: IncidentsListInputSchema,
	awsList: z.object({}),
	usageGetSummary: UsageSummaryInputSchema,
} as const;

export const DatadogEndpointOutputSchemas = {
	dashboardsList: DashboardsListResponseSchema,
	dashboardsGet: DashboardSchema,
	dashboardsCreate: DashboardSchema,
	dashboardsUpdate: DashboardSchema,
	dashboardsDelete: DashboardsDeleteResponseSchema,
	monitorsList: MonitorsListResponseSchema,
	monitorsSearch: MonitorsSearchResponseSchema,
	monitorsGet: MonitorSchema,
	monitorsCreate: MonitorSchema,
	monitorsUpdate: MonitorSchema,
	monitorsDelete: MonitorsDeleteResponseSchema,
	monitorsMute: MonitorSchema,
	monitorsUnmute: MonitorSchema,
	slosList: SlosListResponseSchema,
	slosCreate: SlosCreateResponseSchema,
	syntheticsListTests: SyntheticsListTestsResponseSchema,
	syntheticsGetApiTest: SyntheticsTestSchema,
	syntheticsCreateApiTest: SyntheticsTestSchema,
	syntheticsListLocations: SyntheticsListLocationsResponseSchema,
	eventsList: EventsListResponseSchema,
	eventsCreate: EventsCreateResponseSchema,
	downtimesList: DowntimesListResponseSchema,
	downtimesCreate: DowntimesCreateResponseSchema,
	webhooksGet: WebhookConfigSchema,
	webhooksCreate: WebhookConfigSchema,
	hostsList: HostsListResponseSchema,
	hostsTotals: HostsTotalsResponseSchema,
	tagsList: TagsListResponseSchema,
	tagsGetHost: TagsHostResponseSchema,
	tagsUpdateHost: TagsHostResponseSchema,
	servicesListDefinitions: ServicesListDefinitionsResponseSchema,
	spansSearch: SpansSearchResponseSchema,
	spansAggregate: SpansAggregateResponseSchema,
	logsSearch: LogsSearchResponseSchema,
	logsAggregate: LogsAggregateResponseSchema,
	logsListIndexes: LogsListIndexesResponseSchema,
	metricsListActive: MetricsListActiveResponseSchema,
	metricsQuery: MetricsQueryResponseSchema,
	metricsSubmit: MetricsSubmitResponseSchema,
	usersList: V2ListResponseSchema,
	rolesList: V2ListResponseSchema,
	apiKeysList: V2ListResponseSchema,
	incidentsList: V2ListResponseSchema,
	awsList: AwsListResponseSchema,
	usageGetSummary: UsageSummaryResponseSchema,
} as const;

type InputSchemas = typeof DatadogEndpointInputSchemas;
type OutputSchemas = typeof DatadogEndpointOutputSchemas;

export type DatadogEndpointInputs = {
	[K in keyof InputSchemas]: z.infer<InputSchemas[K]>;
};

export type DatadogEndpointOutputs = {
	[K in keyof OutputSchemas]: z.infer<OutputSchemas[K]>;
};
