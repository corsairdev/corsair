// Read schemas for PostHog's private API (personal API key).
//
// PostHog adds fields to these objects often, so every object is .loose() and
// every field optional. Free-form nested structures use PostHogJson below.

import { z } from 'zod';

/**
 * PostHog's own nested JSON (query definitions, filters, insight results,
 * query rows, Hog function inputs). Its shape depends on the query kind,
 * flag type or the user's configuration, so a stricter schema would reject
 * valid data on the next PostHog release without making callers safer.
 */
export const PostHogJson = z.unknown();

export const Timestamp = z.string().nullable().optional();

/**
 * Every project-scoped action takes an optional `project_id`. It overrides the
 * connected project for that one call, so a key with access to several
 * projects can read any of them.
 */
export const ProjectScopeSchema = z.object({
	project_id: z
		.union([z.string().min(1), z.number().int().positive()])
		.optional(),
});

export const PaginationInputSchema = ProjectScopeSchema.extend({
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});

export function paginated<T extends z.ZodTypeAny>(item: T) {
	return z
		.object({
			count: z.number().int().nullable().optional(),
			next: z.string().nullable().optional(),
			previous: z.string().nullable().optional(),
			results: z.array(item),
		})
		.loose();
}

export const UserBasicSchema = z
	.object({
		id: z.number().int().optional(),
		uuid: z.string().optional(),
		distinct_id: z.string().nullable().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
	})
	.loose()
	.nullable()
	.optional();

// ── Query ────────────────────────────────────────────────────────────────────

export const QueryRunInputSchema = ProjectScopeSchema.extend({
	query: z.union([
		z.string().min(1),
		z
			.object({
				kind: z.string().min(1),
			})
			.loose(),
	]),
	name: z.string().optional(),
	refresh: z
		.enum([
			'blocking',
			'async',
			'lazy_async',
			'force_blocking',
			'force_async',
			'force_cache',
			'async_except_on_cache_miss',
		])
		.optional(),
});

export const QueryRunResponseSchema = z
	.object({
		columns: z.array(PostHogJson).nullable().optional(),
		types: z.array(PostHogJson).nullable().optional(),
		results: PostHogJson,
		hasMore: z.boolean().nullable().optional(),
		limit: z.number().nullable().optional(),
		offset: z.number().nullable().optional(),
		hogql: z.string().nullable().optional(),
		error: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		is_cached: z.boolean().optional(),
		last_refresh: Timestamp,
	})
	.loose();

// ── Insights ─────────────────────────────────────────────────────────────────

export const InsightSchema = z
	.object({
		id: z.number().int(),
		short_id: z.string().optional(),
		name: z.string().nullable().optional(),
		derived_name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		query: PostHogJson.optional(),
		result: PostHogJson.optional(),
		favorited: z.boolean().optional(),
		saved: z.boolean().optional(),
		deleted: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		dashboards: z.array(z.number().int()).optional(),
		created_at: Timestamp,
		created_by: UserBasicSchema,
		last_modified_at: Timestamp,
		last_refresh: Timestamp,
	})
	.loose();

export const InsightsListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
	short_id: z.string().optional(),
	saved: z.boolean().optional(),
	favorited: z.boolean().optional(),
});
export const InsightsListResponseSchema = paginated(InsightSchema);

export const InsightsGetInputSchema = ProjectScopeSchema.extend({
	id: z.number().int().positive(),
	refresh: QueryRunInputSchema.shape.refresh,
});

// ── Dashboards ───────────────────────────────────────────────────────────────

export const DashboardSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		pinned: z.boolean().optional(),
		deleted: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		created_at: Timestamp,
		created_by: UserBasicSchema,
		last_accessed_at: Timestamp,
		tiles: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						insight: InsightSchema.nullable().optional(),
						text: PostHogJson.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

export const DashboardsListInputSchema = PaginationInputSchema;
export const DashboardsListResponseSchema = paginated(DashboardSchema);
export const DashboardsGetInputSchema = ProjectScopeSchema.extend({
	id: z.number().int().positive(),
});

// ── Persons ──────────────────────────────────────────────────────────────────

export const PersonSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		uuid: z.string().optional(),
		name: z.string().nullable().optional(),
		distinct_ids: z.array(z.string()).optional(),
		properties: z.record(z.string(), PostHogJson).optional(),
		created_at: Timestamp,
		last_seen_at: Timestamp,
	})
	.loose();

export const PersonsListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
	distinct_id: z.string().optional(),
	email: z.string().optional(),
});
export const PersonsListResponseSchema = paginated(PersonSchema);
export const PersonsGetInputSchema = ProjectScopeSchema.extend({
	id: z.string().min(1),
});

// ── Feature flags ────────────────────────────────────────────────────────────

export const FeatureFlagSchema = z
	.object({
		id: z.number().int(),
		key: z.string(),
		name: z.string().nullable().optional(),
		active: z.boolean().optional(),
		deleted: z.boolean().optional(),
		filters: z.record(z.string(), PostHogJson).optional(),
		rollout_percentage: z.number().nullable().optional(),
		ensure_experience_continuity: z.boolean().nullable().optional(),
		status: z.string().optional(),
		tags: z.array(z.string()).optional(),
		created_at: Timestamp,
		updated_at: Timestamp,
		created_by: UserBasicSchema,
		last_called_at: Timestamp,
	})
	.loose();

export const FeatureFlagsListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
	active: z.union([z.boolean(), z.literal('STALE')]).optional(),
});
export const FeatureFlagsListResponseSchema = paginated(FeatureFlagSchema);
export const FeatureFlagsGetInputSchema = ProjectScopeSchema.extend({
	id: z.number().int().positive(),
});
export const FeatureFlagsUpdateInputSchema = ProjectScopeSchema.extend({
	id: z.number().int().positive(),
	name: z.string().optional(),
	active: z.boolean().optional(),
	/** Full release conditions; replaces the flag's existing `filters`. */
	filters: z.record(z.string(), PostHogJson).optional(),
	tags: z.array(z.string()).optional(),
	ensure_experience_continuity: z.boolean().optional(),
}).refine(
	(value) =>
		value.name !== undefined ||
		value.active !== undefined ||
		value.filters !== undefined ||
		value.tags !== undefined ||
		value.ensure_experience_continuity !== undefined,
	{ message: 'Provide at least one field to update' },
);

// ── Session recordings ───────────────────────────────────────────────────────

export const SessionRecordingSchema = z
	.object({
		id: z.string(),
		distinct_id: z.string().nullable().optional(),
		start_time: Timestamp,
		end_time: Timestamp,
		recording_duration: z.number().nullable().optional(),
		active_seconds: z.number().nullable().optional(),
		inactive_seconds: z.number().nullable().optional(),
		click_count: z.number().nullable().optional(),
		keypress_count: z.number().nullable().optional(),
		console_error_count: z.number().nullable().optional(),
		start_url: z.string().nullable().optional(),
		viewed: z.boolean().optional(),
		ongoing: z.boolean().nullable().optional(),
		person: PostHogJson.optional(),
	})
	.loose();

export const SessionRecordingsListInputSchema = PaginationInputSchema.extend({
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	person_uuid: z.string().optional(),
});
export const SessionRecordingsListResponseSchema = z
	.object({
		results: z.array(SessionRecordingSchema),
		has_next: z.boolean().optional(),
		next: z.string().nullable().optional(),
	})
	.loose();
export const SessionRecordingsGetInputSchema = ProjectScopeSchema.extend({
	id: z.string().min(1),
});

// ── Error tracking ───────────────────────────────────────────────────────────

export const ErrorTrackingIssueSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		severity: z.string().nullable().optional(),
		library: z.string().nullable().optional(),
		first_seen: Timestamp,
		last_seen: Timestamp,
		assignee: PostHogJson.optional(),
		aggregations: z
			.object({
				occurrences: z.number().nullable().optional(),
				sessions: z.number().nullable().optional(),
				users: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();

export const ErrorTrackingIssuesListInputSchema = PaginationInputSchema.extend({
	status: z
		.enum([
			'active',
			'resolved',
			'suppressed',
			'pending_release',
			'archived',
			'all',
		])
		.optional(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	search: z.string().optional(),
	order_by: z
		.enum(['last_seen', 'first_seen', 'occurrences', 'users', 'sessions'])
		.optional(),
	order_direction: z.enum(['ASC', 'DESC']).optional(),
	filter_test_accounts: z.boolean().optional(),
});
export const ErrorTrackingIssuesListResponseSchema = z
	.object({
		results: z.array(ErrorTrackingIssueSchema),
		hasMore: z.boolean().nullable().optional(),
		limit: z.number().nullable().optional(),
		offset: z.number().nullable().optional(),
	})
	.loose();

// ── Experiments, surveys, cohorts, actions ───────────────────────────────────

export const ExperimentSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		feature_flag_key: z.string().nullable().optional(),
		start_date: Timestamp,
		end_date: Timestamp,
		archived: z.boolean().optional(),
		parameters: PostHogJson.optional(),
		metrics: PostHogJson.optional(),
		created_at: Timestamp,
		created_by: UserBasicSchema,
	})
	.loose();

export const ExperimentsListInputSchema = PaginationInputSchema;
export const ExperimentsListResponseSchema = paginated(ExperimentSchema);
export const ExperimentsGetInputSchema = ProjectScopeSchema.extend({
	id: z.number().int().positive(),
});

export const SurveySchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		questions: z.array(PostHogJson).nullable().optional(),
		start_date: Timestamp,
		end_date: Timestamp,
		archived: z.boolean().optional(),
		created_at: Timestamp,
		created_by: UserBasicSchema,
	})
	.loose();

export const SurveysListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
});
export const SurveysListResponseSchema = paginated(SurveySchema);
export const SurveysGetInputSchema = ProjectScopeSchema.extend({
	id: z.string().min(1),
});

export const CohortSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		count: z.number().int().nullable().optional(),
		is_static: z.boolean().optional(),
		is_calculating: z.boolean().optional(),
		deleted: z.boolean().optional(),
		filters: PostHogJson.optional(),
		created_at: Timestamp,
		created_by: UserBasicSchema,
	})
	.loose();

export const CohortsListInputSchema = PaginationInputSchema;
export const CohortsListResponseSchema = paginated(CohortSchema);

export const ActionSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		steps: z.array(PostHogJson).optional(),
		tags: z.array(z.string()).optional(),
		deleted: z.boolean().optional(),
		created_at: Timestamp,
		created_by: UserBasicSchema,
	})
	.loose();

export const ActionsListInputSchema = PaginationInputSchema;
export const ActionsListResponseSchema = paginated(ActionSchema);

// ── Annotations ──────────────────────────────────────────────────────────────

export const AnnotationSchema = z
	.object({
		id: z.number().int(),
		content: z.string().nullable().optional(),
		date_marker: Timestamp,
		scope: z.string().optional(),
		dashboard_item: z.number().int().nullable().optional(),
		deleted: z.boolean().optional(),
		created_at: Timestamp,
		updated_at: Timestamp,
		created_by: UserBasicSchema,
	})
	.loose();

export const AnnotationsListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
});
export const AnnotationsListResponseSchema = paginated(AnnotationSchema);
export const AnnotationsCreateInputSchema = ProjectScopeSchema.extend({
	content: z.string().min(1),
	/** ISO 8601 timestamp the annotation marks; defaults to now. */
	date_marker: z.string().optional(),
	scope: z.enum(['project', 'organization', 'dashboard_item']).optional(),
	/** Insight id, for scope `dashboard_item`. */
	dashboard_item: z.number().int().positive().optional(),
});

// ── Data definitions ─────────────────────────────────────────────────────────

export const EventDefinitionSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		tags: z.array(z.string()).optional(),
		volume_30_day: z.number().nullable().optional(),
		query_usage_30_day: z.number().nullable().optional(),
		created_at: Timestamp,
		last_seen_at: Timestamp,
	})
	.loose();

export const EventDefinitionsListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
});
export const EventDefinitionsListResponseSchema = paginated(
	EventDefinitionSchema,
);

export const PropertyDefinitionSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		property_type: z.string().nullable().optional(),
		is_numerical: z.boolean().optional(),
		is_seen_on_filtered_events: z.boolean().nullable().optional(),
		tags: z.array(z.string()).optional(),
	})
	.loose();

export const PropertyDefinitionsListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
	type: z.enum(['event', 'person', 'group', 'session']).optional(),
	/** Only properties seen on these events (event properties). */
	event_names: z.array(z.string().min(1)).optional(),
	group_type_index: z.number().int().min(0).optional(),
});
export const PropertyDefinitionsListResponseSchema = paginated(
	PropertyDefinitionSchema,
);

// ── Project ──────────────────────────────────────────────────────────────────

export const ProjectsGetInputSchema = ProjectScopeSchema;
export const ProjectSchema = z
	.object({
		id: z.number().int(),
		name: z.string().optional(),
		organization: z.string().optional(),
		timezone: z.string().optional(),
		/** The project token (phc_...) used for capture. */
		api_token: z.string().optional(),
		created_at: Timestamp,
	})
	.loose();

// ── Organizations and projects ───────────────────────────────────────────────

export const OrganizationSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		slug: z.string().nullable().optional(),
		membership_level: z.number().nullable().optional(),
		created_at: Timestamp,
		teams: z.array(PostHogJson).optional(),
		projects: z.array(PostHogJson).optional(),
	})
	.loose();

export const OrganizationsListInputSchema = z.object({
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
export const OrganizationsListResponseSchema = paginated(OrganizationSchema);
export const OrganizationsGetInputSchema = z.object({
	/** Organization id (UUID); defaults to the key's current organization. */
	id: z.string().min(1).optional(),
});

export const ProjectsListInputSchema = OrganizationsListInputSchema.extend({
	/** Organization id (UUID); defaults to the key's current organization. */
	organization_id: z.string().min(1).optional(),
});
export const ProjectsListResponseSchema = paginated(ProjectSchema);

// ── Notebooks ────────────────────────────────────────────────────────────────

export const NotebookSchema = z
	.object({
		id: z.string(),
		short_id: z.string(),
		title: z.string().nullable().optional(),
		content: PostHogJson.optional(),
		text_content: z.string().nullable().optional(),
		version: z.number().int().optional(),
		deleted: z.boolean().optional(),
		created_at: Timestamp,
		created_by: UserBasicSchema,
		last_modified_at: Timestamp,
	})
	.loose();

export const NotebooksListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
});
export const NotebooksListResponseSchema = paginated(NotebookSchema);
export const NotebooksGetInputSchema = ProjectScopeSchema.extend({
	short_id: z.string().min(1),
});

// ── Alerts, early access, pipelines, warehouse, playlists ────────────────────

export const AlertSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		enabled: z.boolean().optional(),
		state: z.string().nullable().optional(),
		condition: PostHogJson.optional(),
		threshold: PostHogJson.optional(),
		insight: PostHogJson.optional(),
		calculation_interval: z.string().nullable().optional(),
		last_checked_at: Timestamp,
		created_at: Timestamp,
	})
	.loose();

export const AlertsListInputSchema = PaginationInputSchema;
export const AlertsListResponseSchema = paginated(AlertSchema);
export const AlertsGetInputSchema = ProjectScopeSchema.extend({
	id: z.string().min(1),
});

export const EarlyAccessFeatureSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		stage: z.string().optional(),
		documentation_url: z.string().nullable().optional(),
		feature_flag: PostHogJson.optional(),
		created_at: Timestamp,
	})
	.loose();

export const EarlyAccessFeaturesListInputSchema = PaginationInputSchema;
export const EarlyAccessFeaturesListResponseSchema = paginated(
	EarlyAccessFeatureSchema,
);

export const BatchExportSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		model: z.string().nullable().optional(),
		destination: PostHogJson.optional(),
		interval: z.string().optional(),
		paused: z.boolean().optional(),
		created_at: Timestamp,
		last_updated_at: Timestamp,
		last_paused_at: Timestamp,
	})
	.loose();

export const BatchExportsListInputSchema = PaginationInputSchema;
export const BatchExportsListResponseSchema = paginated(BatchExportSchema);

export const HogFunctionSchema = z
	.object({
		id: z.string(),
		type: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		enabled: z.boolean().optional(),
		deleted: z.boolean().optional(),
		hog: z.string().optional(),
		inputs_schema: PostHogJson.optional(),
		inputs: PostHogJson.optional(),
		filters: PostHogJson.optional(),
		status: PostHogJson.optional(),
		template: PostHogJson.optional(),
		created_at: Timestamp,
		updated_at: Timestamp,
	})
	.loose();

export const HogFunctionsListInputSchema = PaginationInputSchema.extend({
	/** e.g. destination, transformation, site_app, source_webhook. */
	type: z.string().min(1).optional(),
	search: z.string().optional(),
	enabled: z.boolean().optional(),
});
export const HogFunctionsListResponseSchema = paginated(HogFunctionSchema);
export const HogFunctionsGetInputSchema = ProjectScopeSchema.extend({
	id: z.string().min(1),
});

export const WarehouseTableSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		format: z.string().nullable().optional(),
		url_pattern: z.string().nullable().optional(),
		row_count: z.number().nullable().optional(),
		columns: PostHogJson.optional(),
		external_data_source: PostHogJson.optional(),
		created_at: Timestamp,
	})
	.loose();

export const WarehouseTablesListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
});
export const WarehouseTablesListResponseSchema =
	paginated(WarehouseTableSchema);

export const SessionRecordingPlaylistSchema = z
	.object({
		id: z.number().int(),
		short_id: z.string().optional(),
		name: z.string().nullable().optional(),
		derived_name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		pinned: z.boolean().optional(),
		deleted: z.boolean().optional(),
		type: z.string().nullable().optional(),
		filters: PostHogJson.optional(),
		recordings_counts: PostHogJson.optional(),
		created_at: Timestamp,
		last_modified_at: Timestamp,
	})
	.loose();

export const SessionRecordingPlaylistsListInputSchema =
	PaginationInputSchema.extend({
		search: z.string().optional(),
		pinned: z.boolean().optional(),
	});
export const SessionRecordingPlaylistsListResponseSchema = paginated(
	SessionRecordingPlaylistSchema,
);

// ── Query-backed reads (web analytics, LLM analytics, events, logs) ──────────

const DateRangeInput = {
	/** ISO timestamp or relative date such as -7d, -24h. */
	date_from: z.string().min(1).optional(),
	date_to: z.string().min(1).optional(),
};

export const WebAnalyticsOverviewInputSchema = ProjectScopeSchema.extend({
	...DateRangeInput,
	filter_test_accounts: z.boolean().optional(),
	/** Also return the previous period for each metric. */
	compare: z.boolean().optional(),
});
export const WebAnalyticsOverviewResponseSchema = QueryRunResponseSchema.extend(
	{
		results: z.array(
			z
				.object({
					key: z.string(),
					kind: z.string().optional(),
					value: z.number().nullable().optional(),
					previous: z.number().nullable().optional(),
					changeFromPreviousPct: z.number().nullable().optional(),
				})
				.loose(),
		),
	},
);

export const WEB_STATS_BREAKDOWNS = [
	'Page',
	'InitialPage',
	'ExitPage',
	'InitialReferringDomain',
	'InitialUTMSource',
	'InitialUTMCampaign',
	'InitialUTMMedium',
	'InitialUTMTerm',
	'InitialUTMContent',
	'Browser',
	'OS',
	'DeviceType',
	'Country',
	'Region',
	'City',
	'Language',
	'Timezone',
] as const;

export const WebAnalyticsStatsInputSchema = ProjectScopeSchema.extend({
	breakdown_by: z.enum(WEB_STATS_BREAKDOWNS),
	...DateRangeInput,
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	filter_test_accounts: z.boolean().optional(),
});

export const LlmAnalyticsTracesInputSchema = PaginationInputSchema.extend({
	...DateRangeInput,
	filter_test_accounts: z.boolean().optional(),
});

export const LlmAnalyticsCostsInputSchema = ProjectScopeSchema.extend({
	/** Look-back window in days. */
	days: z.number().int().min(1).max(365).optional(),
});

export const EventsListInputSchema = ProjectScopeSchema.extend({
	/** Only this event name, e.g. $pageview. */
	event: z.string().min(1).optional(),
	/** Only events of this person (UUID). */
	person_id: z.string().min(1).optional(),
	/** HogQL columns; defaults to uuid, event, timestamp, distinct_id, properties. */
	select: z.array(z.string().min(1)).min(1).optional(),
	/** HogQL conditions combined with AND, e.g. "properties.$browser = 'Chrome'". */
	where: z.array(z.string().min(1)).optional(),
	/** ISO timestamp or relative date; defaults to -24h. */
	after: z.string().min(1).optional(),
	before: z.string().min(1).optional(),
	order_by: z.array(z.string().min(1)).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});

export const LOG_SEVERITIES = [
	'trace',
	'debug',
	'info',
	'warn',
	'error',
	'fatal',
] as const;

export const LogsQueryInputSchema = ProjectScopeSchema.extend({
	...DateRangeInput,
	service_names: z.array(z.string().min(1)).optional(),
	severity_levels: z.array(z.enum(LOG_SEVERITIES)).optional(),
	/** Full-text search over log bodies. */
	search: z.string().min(1).optional(),
	/** Property filters ({ key, type, operator, value }), combined with AND. */
	filters: z
		.array(
			z
				.object({
					key: z.string().min(1),
					type: z.enum(['log', 'log_attribute', 'log_resource_attribute']),
					operator: z.string().min(1),
					value: PostHogJson.optional(),
				})
				.loose(),
		)
		.optional(),
	order_by: z.enum(['latest', 'earliest']).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	/** `nextCursor` from the previous page. */
	after: z.string().min(1).optional(),
	exclude_attributes: z.boolean().optional(),
});

export const LogsQueryResponseSchema = z
	.object({
		results: z.array(
			z
				.object({
					uuid: z.string().optional(),
					timestamp: Timestamp,
					body: z.string().nullable().optional(),
					severity_text: z.string().nullable().optional(),
					service_name: z.string().nullable().optional(),
					attributes: z.record(z.string(), PostHogJson).optional(),
					resource_attributes: z.record(z.string(), PostHogJson).optional(),
				})
				.loose(),
		),
		hasMore: z.boolean().nullable().optional(),
		nextCursor: z.string().nullable().optional(),
		columns: PostHogJson.optional(),
	})
	.loose();
