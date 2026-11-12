import { z } from 'zod';

// Read schemas for PostHog's private API (personal API key).
//
// PostHog adds fields to these objects often, so every object is .loose() and
// every field optional. Fields typed z.unknown() hold PostHog's own nested
// structures (query definitions, filters, insight results, query rows) whose
// shape depends on the query kind or flag type; typing them strictly would
// break on the next PostHog release without making callers any safer.

const Timestamp = z.string().nullable().optional();

const PaginationInputSchema = z.object({
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});

function paginated<T extends z.ZodTypeAny>(item: T) {
	return z
		.object({
			count: z.number().int().nullable().optional(),
			next: z.string().nullable().optional(),
			previous: z.string().nullable().optional(),
			results: z.array(item),
		})
		.loose();
}

const UserBasicSchema = z
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

export const QueryRunInputSchema = z.object({
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
		columns: z.array(z.unknown()).nullable().optional(),
		types: z.array(z.unknown()).nullable().optional(),
		results: z.unknown(),
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
		query: z.unknown().optional(),
		result: z.unknown().optional(),
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

export const InsightsGetInputSchema = z.object({
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
						text: z.unknown().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

export const DashboardsListInputSchema = PaginationInputSchema;
export const DashboardsListResponseSchema = paginated(DashboardSchema);
export const DashboardsGetInputSchema = z.object({
	id: z.number().int().positive(),
});

// ── Persons ──────────────────────────────────────────────────────────────────

export const PersonSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		uuid: z.string().optional(),
		name: z.string().nullable().optional(),
		distinct_ids: z.array(z.string()).optional(),
		properties: z.record(z.string(), z.unknown()).optional(),
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
export const PersonsGetInputSchema = z.object({
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
		filters: z.record(z.string(), z.unknown()).optional(),
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
export const FeatureFlagsGetInputSchema = z.object({
	id: z.number().int().positive(),
});
export const FeatureFlagsUpdateInputSchema = z
	.object({
		id: z.number().int().positive(),
		name: z.string().optional(),
		active: z.boolean().optional(),
		/** Full release conditions; replaces the flag's existing `filters`. */
		filters: z.record(z.string(), z.unknown()).optional(),
		tags: z.array(z.string()).optional(),
		ensure_experience_continuity: z.boolean().optional(),
	})
	.refine(
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
		person: z.unknown().optional(),
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
export const SessionRecordingsGetInputSchema = z.object({
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
		assignee: z.unknown().optional(),
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
		parameters: z.unknown().optional(),
		metrics: z.unknown().optional(),
		created_at: Timestamp,
		created_by: UserBasicSchema,
	})
	.loose();

export const ExperimentsListInputSchema = PaginationInputSchema;
export const ExperimentsListResponseSchema = paginated(ExperimentSchema);
export const ExperimentsGetInputSchema = z.object({
	id: z.number().int().positive(),
});

export const SurveySchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		questions: z.array(z.unknown()).nullable().optional(),
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
export const SurveysGetInputSchema = z.object({
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
		filters: z.unknown().optional(),
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
		steps: z.array(z.unknown()).optional(),
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
export const AnnotationsCreateInputSchema = z.object({
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

export const ProjectsGetInputSchema = z.object({});
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
