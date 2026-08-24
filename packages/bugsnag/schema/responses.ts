import { z } from 'zod';
import { B, Id, N, S, StrArray, U, UnknownArray } from './primitives';

/**
 * Response shapes that are returned but **not** mirrored locally.
 *
 * The split is the same judgement made in `schema/database.ts`: structure is
 * mirrored, everything else stays remote. Stated per family, because "we only cache
 * some of it" is the kind of decision a reviewer is entitled to see reasoned rather
 * than asserted:
 *
 * - **Errors and events** arrive continuously and are only meaningful against a time
 *   range and a filter. A local copy would mirror a firehose, and would go stale
 *   between the write and the next read.
 * - **Trends and pivot values** are aggregates computed over a window, not records.
 *   Caching one produces a number that was true once.
 * - **Releases and release groups** are an append-only deployment history whose
 *   counters (`sessions_count_in_last_24h`, and so on) move continuously.
 * - **Saved searches** are account-authored configuration, and their `filters` can
 *   contain end-user identifiers - searching for one customer's email address is an
 *   ordinary support workflow. Mirroring them would copy personal data into durable
 *   storage for no lookup benefit.
 * - **Configured integrations** carry third-party credentials in `config`. Mirroring
 *   one would put someone else's secret in the database.
 * - **Event fields** are filter metadata rather than data.
 *
 * Provenance is recorded per shape. Most were enumerated from live responses on
 * 2026-08-14; the few that could not be (an empty collection on the recon account, or
 * an operation too destructive to run) say so, and are `.loose()` with only the
 * primary key required so an unmodelled field survives rather than failing the parse.
 *
 * Docs: https://docs.bugsnag.com/api/data-access/
 */

/* -------------------------------------------------------------------------- */
/*                                   Errors                                   */
/* -------------------------------------------------------------------------- */

/**
 * An error group. 32 live keys.
 *
 * `message` and `context` routinely contain application input, and
 * `assigned_collaborator_id` identifies a person, so no field of this shape is
 * written to the event log - a read is logged as a count. See `endpoints/logging.ts`.
 */
export const BugsnagError = z
	.object({
		id: Id,
		project_id: S,
		error_class: S,
		message: S,
		context: S,
		severity: S,
		original_severity: S,
		overridden_severity: S,
		events: N,
		events_url: S,
		unthrottled_occurrence_count: N,
		users: N,
		first_seen: S,
		last_seen: S,
		first_seen_unfiltered: S,
		last_seen_unfiltered: S,
		status: S,
		created_issue: U,
		linked_issues: UnknownArray,
		reopen_rules: U,
		assigned_collaborator_id: S,
		assigned_team_id: S,
		comment_count: N,
		missing_dsyms: StrArray,
		release_stages: StrArray,
		grouping_reason: S,
		grouping_fields: U,
		url: S,
		project_url: S,
		discarded: B,
		trend: U,
		introduced_in_releases: UnknownArray,
	})
	.loose();
export type BugsnagError = z.infer<typeof BugsnagError>;

/**
 * The result of a bulk error update.
 *
 * The catalog records that the live API returns only the operation name, not the
 * per-error results its specification documents, and a live call confirms the
 * response is not a per-error array. So this is deliberately minimal and `.loose()`
 * rather than modelling results that do not arrive - a caller that needs per-error
 * outcomes has to re-read the errors.
 */
export const BugsnagBulkUpdateResult = z
	.object({
		operation: S,
	})
	.loose();
export type BugsnagBulkUpdateResult = z.infer<typeof BugsnagBulkUpdateResult>;

/* -------------------------------------------------------------------------- */
/*                                   Events                                   */
/* -------------------------------------------------------------------------- */

/**
 * An individual event occurrence.
 *
 * **A list and a single read return different widths.** In a list an event carries 11
 * fields; requested with full reports it carries 20, adding `threads`, `metaData`,
 * `request`, `device`, `user`, `breadcrumbs`, `feature_flags`, `correlation` and
 * `session`. Both are declared here with everything past the id optional, so one
 * schema covers both rather than a caller having to pick.
 *
 * This is the single most sensitive shape in the API. `user` carries a name and email
 * address, `request` carries URLs, headers and IP addresses, and `metaData` is
 * whatever the application chose to attach. Confirmed live on a seeded event. None of
 * it is logged, and none of it is mirrored.
 */
export const BugsnagEvent = z
	.object({
		id: Id,
		url: S,
		project_url: S,
		is_full_report: B,
		error_id: S,
		received_at: S,
		exceptions: UnknownArray,
		severity: S,
		context: S,
		unhandled: B,
		app: U,
		// Present only on a full report.
		threads: UnknownArray,
		metaData: U,
		request: U,
		device: U,
		user: U,
		breadcrumbs: UnknownArray,
		feature_flags: UnknownArray,
		correlation: U,
		session: U,
	})
	.loose();
export type BugsnagEvent = z.infer<typeof BugsnagEvent>;

/* -------------------------------------------------------------------------- */
/*                                Event fields                                */
/* -------------------------------------------------------------------------- */

/**
 * A filterable event field. 39 built-in fields on the recon project.
 *
 * A built-in field carries `{display_id, custom, pivot_options}`; a custom one adds
 * `path`, `filter_options`, `reindex_in_progress` and `reindex_percentage`. Both
 * observed live.
 *
 * One behaviour worth pinning, because it will bite anyone who assumes otherwise:
 * **the API assigns `display_id` from `path` and ignores the `display_id` sent on
 * create.** A create asking for `display_id: 'ignored-by-the-api'` with
 * `path: 'metaData.corsair.shape'` returned `display_id: 'metaData.corsair.shape'`.
 * A caller that later deletes the field using the id it *requested* gets a 404, so
 * the delete must use the id from the response. Verified twice.
 */
export const BugsnagEventField = z
	.object({
		display_id: Id,
		custom: B,
		pivot_options: U,
		path: S,
		filter_options: U,
		reindex_in_progress: B,
		reindex_percentage: N,
	})
	.loose();
export type BugsnagEventField = z.infer<typeof BugsnagEventField>;

/* -------------------------------------------------------------------------- */
/*                             Pivots and trends                              */
/* -------------------------------------------------------------------------- */

/**
 * A pivot definition.
 *
 * Keyed by `event_field_display_id`, **not** by `id` - there is no `id` field. Getting
 * that wrong is how the pivot-values path was mis-mapped during recon: passing the
 * human-readable `name` returned a resource-missing 404.
 */
export const BugsnagPivot = z
	.object({
		event_field_display_id: Id,
		name: S,
		cardinality: N,
	})
	.loose();
export type BugsnagPivot = z.infer<typeof BugsnagPivot>;

/**
 * One value of a pivot, with its share of events.
 *
 * `event_field_value` is the value being counted, so for a pivot on `user.id` or
 * `user.email` it **is** an end-user identifier. Logged as a count only.
 *
 * Not every pivot has values: `pivots/event/values` answered resource-missing while
 * `pivots/error/values` and `pivots/user.id/values` returned rows.
 */
export const BugsnagPivotValue = z
	.object({
		event_field_value: S,
		events: N,
		proportion: N,
		first_seen: S,
		last_seen: S,
		fields: U,
		aggregates: U,
	})
	.loose();
export type BugsnagPivotValue = z.infer<typeof BugsnagPivotValue>;

/**
 * One time bucket of a trend.
 *
 * `buckets_count` is required on the request - the endpoint answers 400 rather than
 * applying a default.
 */
export const BugsnagTrendBucket = z
	.object({
		from: S,
		to: S,
		events_count: N,
	})
	.loose();
export type BugsnagTrendBucket = z.infer<typeof BugsnagTrendBucket>;

/* -------------------------------------------------------------------------- */
/*                                  Releases                                  */
/* -------------------------------------------------------------------------- */

/** A single release. 20 live keys. */
export const BugsnagRelease = z
	.object({
		id: Id,
		project_id: S,
		release_group_id: S,
		release_time: S,
		release_source: S,
		app_version: S,
		app_version_code: S,
		app_bundle_version: S,
		build_label: S,
		builder_name: S,
		build_tool: S,
		errors_introduced_count: N,
		errors_seen_count: N,
		sessions_count_in_last_24h: N,
		total_sessions_count: N,
		unhandled_sessions_count: N,
		accumulative_daily_users_seen: N,
		accumulative_daily_users_with_unhandled: N,
		metadata: U,
		release_stage: U,
	})
	.loose();
export type BugsnagRelease = z.infer<typeof BugsnagRelease>;

/**
 * A release group - releases sharing an app version within a release stage. 18 live
 * keys.
 *
 * `release_stage_name` is a **required query parameter** on the list, which answers
 * `{"errors":["release_stage_name can't be blank"]}` without it.
 */
export const BugsnagReleaseGroup = z
	.object({
		id: Id,
		project_id: S,
		release_stage_name: S,
		app_version: S,
		first_released_at: S,
		first_release_id: S,
		releases_count: N,
		has_secondary_versions: B,
		build_tool: S,
		builder_name: S,
		source_control: U,
		top_release_group: B,
		visible: B,
		total_sessions_count: N,
		unhandled_sessions_count: N,
		sessions_count_in_last_24h: N,
		accumulative_daily_users_seen: N,
		accumulative_daily_users_with_unhandled: N,
	})
	.loose();
export type BugsnagReleaseGroup = z.infer<typeof BugsnagReleaseGroup>;

/* -------------------------------------------------------------------------- */
/*                               Saved searches                               */
/* -------------------------------------------------------------------------- */

/**
 * A saved search, called a "filterset" internally. 24 live keys, captured from a
 * create/read/delete round trip on the recon account.
 *
 * `filters` is the reason this is not mirrored: a filter value can be an end-user's
 * email address, so a local copy would be a copy of personal data.
 *
 * The write operations are **top-level** (`/saved_searches`), not nested under the
 * project - only the list is per-project. `project_id` therefore travels in the body
 * on create rather than in the path.
 */
export const BugsnagSavedSearch = z
	.object({
		id: Id,
		user_id: S,
		project_id: S,
		name: S,
		filters: U,
		sort: S,
		type: S,
		shared: B,
		updated_by_id: S,
		project_default: B,
		has_assigned_to_me: B,
		has_assigned_to: B,
		has_created_issue_filter: B,
		has_status_filter: B,
		new_error_inclusion: B,
		open_error_inclusion: B,
		for_review_error_inclusion: B,
		snoozed_error_inclusion: B,
		fixed_error_inclusion: B,
		ignored_error_inclusion: B,
		additional_filtersets: U,
		advanced_filters: U,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type BugsnagSavedSearch = z.infer<typeof BugsnagSavedSearch>;

/**
 * How widely a saved search is relied upon. 4 live keys.
 *
 * Useful before deleting one, which is what the catalog suggests it is for. Note
 * there is no id in this response - it describes the search identified by the path.
 */
export const BugsnagSavedSearchUsageSummary = z
	.object({
		project_notifications_count: N,
		current_user_using_for_email_notification: B,
		collaborator_email_notifications_count: N,
		performance_monitor_count: N,
	})
	.loose();
export type BugsnagSavedSearchUsageSummary = z.infer<
	typeof BugsnagSavedSearchUsageSummary
>;

/* -------------------------------------------------------------------------- */
/*                                Integrations                                */
/* -------------------------------------------------------------------------- */

/**
 * A supported integration - the catalogue of services that *can* be configured. 11
 * live keys, and public product information rather than account data.
 *
 * `fields` lists the configuration each service expects, which is how a caller knows
 * what to send to `integrations.configure`. Those field names include `password`,
 * `apiToken` and `secretAccessKey`: they are the **names** of inputs, not values, but
 * a caller filling them in is handling third-party credentials, which is why a
 * configured integration is never mirrored or logged.
 */
export const BugsnagSupportedIntegration = z
	.object({
		key: Id,
		name: S,
		url: S,
		type: S,
		description: S,
		actions: U,
		fields: U,
		icon_url: S,
		created_entity_name: S,
		two_way_sync: B,
		issue_automation_options: U,
	})
	.loose();
export type BugsnagSupportedIntegration = z.infer<
	typeof BugsnagSupportedIntegration
>;

/**
 * A configured integration on a project.
 *
 * **Shape not verified against a live response.** The recon account has no integration
 * configured, and configuring one requires real third-party credentials, so this is
 * declared from the documented shape with only `id` required. The routes themselves
 * *are* confirmed: `configured_integrations/{id}` answers with the resource-missing
 * envelope rather than the route-absent one, and `POST` on the project collection
 * answers `{"errors":["Integration key can't be blank"]}`.
 *
 * Never mirrored and never logged beyond its id: whatever a caller sent as
 * configuration includes the credential for the third-party service.
 */
export const BugsnagConfiguredIntegration = z
	.object({
		id: Id,
		integration_key: S,
		project_id: S,
		name: S,
		type: S,
		config: U,
		trigger_configs: U,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type BugsnagConfiguredIntegration = z.infer<
	typeof BugsnagConfiguredIntegration
>;

/**
 * The result of testing an integration configuration before creating it.
 *
 * Shape not verified live for the same reason as above; the route is confirmed by its
 * validation response, which names `key` and `configuration` as required. Note the
 * asymmetry, which is easy to get wrong: **`integrations.test` wants `key`, while
 * `integrations.configure` wants `integration_key`** for the same value.
 */
export const BugsnagIntegrationTestResult = z
	.object({
		success: B,
		message: S,
		errors: UnknownArray,
	})
	.loose();
export type BugsnagIntegrationTestResult = z.infer<
	typeof BugsnagIntegrationTestResult
>;

/* -------------------------------------------------------------------------- */
/*                               Feature flags                                */
/* -------------------------------------------------------------------------- */

/**
 * A feature flag seen on an error in a project.
 *
 * **Shape not verified against a live response**: the recon account has no feature
 * flags, so `feature_flags?release_stage_name=production` returned an empty array.
 * The route and its required parameter are confirmed - `release_stage_name` is
 * required, and the summaries collection answers
 * `{"errors":["Must supply valid feature flag ID"]}` without an id - but the field
 * names below are documented rather than observed, so only the key is required.
 */
export const BugsnagFeatureFlag = z
	.object({
		name: Id,
		active: B,
		first_seen: S,
		last_seen: S,
		variants: UnknownArray,
		variant_summary: U,
	})
	.loose();
export type BugsnagFeatureFlag = z.infer<typeof BugsnagFeatureFlag>;

/**
 * A feature flag summary.
 *
 * Same caveat as {@link BugsnagFeatureFlag}: route confirmed live, fields documented
 * rather than observed. It lives at `projects/{id}/feature_flag_summaries` - its own
 * collection, **not** `feature_flags/summaries`, where `summaries` is parsed as a
 * flag id.
 */
export const BugsnagFeatureFlagSummary = z
	.object({
		name: Id,
		variant_count: N,
		error_count: N,
	})
	.loose();
export type BugsnagFeatureFlagSummary = z.infer<
	typeof BugsnagFeatureFlagSummary
>;

/* -------------------------------------------------------------------------- */
/*                          Collaborator project access                       */
/* -------------------------------------------------------------------------- */

/** The compact project reference embedded in an access record. */
export const BugsnagProjectSummary = z
	.object({
		id: S,
		name: S,
		type: S,
		slug: S,
	})
	.loose();
export type BugsnagProjectSummary = z.infer<typeof BugsnagProjectSummary>;

/**
 * How one collaborator reaches one project. 6 live keys.
 *
 * The distinction the three role fields draw is the point of the operation:
 * `project_role` is the effective role, `individual_project_role` is what was granted
 * to the person directly, and `team_project_role` is what they inherit through a
 * team. An audit that only reads the effective role cannot tell why someone has
 * access, which is usually the question being asked.
 *
 * Lives at `collaborators/{id}/project_accesses`, not `access_details`.
 */
export const BugsnagProjectAccess = z
	.object({
		project_summary: BugsnagProjectSummary.nullable().optional(),
		team_count: N,
		is_admin: B,
		project_role: S,
		individual_project_role: S,
		team_project_role: S,
	})
	.loose();
export type BugsnagProjectAccess = z.infer<typeof BugsnagProjectAccess>;

/**
 * How many projects a collaborator can reach. 3 live keys.
 *
 * `collaborator_ids` is required **and must be sent as an array** -
 * `collaborator_ids=<id>` answers `{"errors":["Collaborator_ids must be an array"]}`
 * while `collaborator_ids[]=<id>` answers 200.
 */
export const BugsnagProjectAccessCount = z
	.object({
		collaborator_id: Id,
		project_count: N,
		is_admin: B,
	})
	.loose();
export type BugsnagProjectAccessCount = z.infer<
	typeof BugsnagProjectAccessCount
>;

/* -------------------------------------------------------------------------- */
/*                          Network endpoint grouping                         */
/* -------------------------------------------------------------------------- */

/**
 * A project's network grouping ruleset - the URL patterns used to group network spans
 * for performance monitoring. 2 live keys.
 *
 * Worth recording how this one was resolved. It was written off as enterprise-only
 * during recon after three candidate paths returned a 404, and that conclusion was
 * wrong: every path tried was simply the wrong path. The real one is
 * `projects/{id}/network_endpoint_grouping`, which answers 200 with
 * `{project_id, endpoints}` on a free account. A route-absent 404 means the path is
 * wrong, and only exhausting the plausible paths makes it evidence of anything else.
 */
export const BugsnagNetworkEndpointGrouping = z
	.object({
		project_id: S,
		endpoints: UnknownArray,
	})
	.loose();
export type BugsnagNetworkEndpointGrouping = z.infer<
	typeof BugsnagNetworkEndpointGrouping
>;

/* -------------------------------------------------------------------------- */
/*                        GDPR event data requests                            */
/* -------------------------------------------------------------------------- */

/**
 * An asynchronous export of event data, used to answer a data subject access request.
 *
 * **Shape declared from documentation, not observed.** The routes are confirmed live -
 * all four answer `{"errors":["filters must be provided"]}` to an empty body, which
 * proves the route and names the required field - but no request was actually created,
 * because doing so would export real event data and hand back a download URL for it.
 *
 * `url` is the completed export's download link, so it is a bearer of personal data;
 * it is never logged.
 */
export const BugsnagEventDataRequest = z
	.object({
		id: Id,
		status: S,
		filters: U,
		url: S,
		report_type: S,
		created_at: S,
		updated_at: S,
		expires_at: S,
	})
	.loose();
export type BugsnagEventDataRequest = z.infer<typeof BugsnagEventDataRequest>;

/**
 * An asynchronous deletion of event data, for erasure requests.
 *
 * Same provenance caveat as {@link BugsnagEventDataRequest}, and a stronger reason for
 * it: creating one destroys real event data irreversibly.
 *
 * `status` drives the workflow. A deletion is created in `AWAITING_CONFIRMATION` and
 * does nothing until confirmed, which is why confirmation is a separate operation and
 * is marked destructive.
 */
export const BugsnagEventDataDeletion = z
	.object({
		id: Id,
		status: S,
		filters: U,
		events_count: N,
		created_at: S,
		updated_at: S,
		confirmed_at: S,
		expires_at: S,
	})
	.loose();
export type BugsnagEventDataDeletion = z.infer<typeof BugsnagEventDataDeletion>;
