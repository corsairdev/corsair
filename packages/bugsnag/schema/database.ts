import { z } from 'zod';

/**
 * Locally persisted BugSnag entities.
 *
 * BugSnag splits cleanly into structure and stability data. The structural side -
 * which organizations exist, which projects belong to them, and who can see them -
 * changes rarely and is the lookup every other operation needs, so it is mirrored.
 *
 * Errors and events are deliberately **not** mirrored. The entire premise of the
 * product is that they arrive continuously and are only meaningful against a time
 * range and a filter, so a local copy would mirror a firehose. Trends are computed
 * aggregates over a window rather than records, and error comments are appended
 * discussion. See `endpoints/persist.ts`.
 *
 * Field names match the official JSON keys exactly.
 * Docs: https://docs.bugsnag.com/api/data-access/
 *
 * Every field below was observed on a live response (live account, 2026-08-14).
 * Only the primary key is required: BugSnag nulls or omits fields depending on
 * plan and on which features an organization has enabled, so a stricter schema
 * would reject valid rows, and a rejected row is a lost row.
 */

/** Nullable-optional helpers - BugSnag nulls unset fields rather than omitting them. */
const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/** Ids are 24-character hex strings throughout. */
const Id = z.string();

/**
 * The `creator` stub embedded on an organization.
 *
 * `.loose()` because BugSnag inlines a compact reference whose fields vary by
 * context rather than the full collaborator record.
 */
export const BugsnagCreatorRef = z
	.object({
		id: S,
		name: S,
		email: S,
	})
	.loose();
export type BugsnagCreatorRef = z.infer<typeof BugsnagCreatorRef>;

/**
 * A stability target threshold on a project.
 *
 * Both `target_stability` and `critical_stability` share this shape. The figure
 * lives under `value`, alongside an audit pair recording who last changed it -
 * confirmed against a live response.
 *
 * Worth stating explicitly: an earlier draft of this file guessed
 * `{ target, type }`. That guess parsed silently, because the object is `.loose()`
 * and a fixture written to match the guess confirmed it. Only reading a real
 * response caught it. Nested shapes are the easiest place for an invented field
 * name to survive both the type checker and the tests.
 */
export const BugsnagStabilityTarget = z
	.object({
		value: N,
		updated_at: S,
		updated_by_id: S,
	})
	.loose();
export type BugsnagStabilityTarget = z.infer<typeof BugsnagStabilityTarget>;

/**
 * Organizations. 16 live keys.
 *
 * Note `api_key` and `billing_emails`: an organization record carries a secret and
 * a list of email addresses, so nothing from this entity is written to the event
 * log. See `endpoints/logging.ts`.
 */
export const BugsnagOrganizationEntity = z
	.object({
		id: Id,
		name: S,
		slug: S,
		api_key: S,
		creator: BugsnagCreatorRef.nullable().optional(),
		collaborators_url: S,
		projects_url: S,
		auto_upgrade: B,
		upgrade_url: S,
		can_start_pro_trial: B,
		pro_trial_ends_at: S,
		pro_trial_feature: B,
		managed_by_platform_services: B,
		billing_emails: z.array(z.string()).nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();
export type BugsnagOrganizationEntity = z.infer<
	typeof BugsnagOrganizationEntity
>;

/**
 * Projects. 32 live keys - the widest entity in the API.
 *
 * `api_key` is the notifier key every deployed copy of the application uses, and
 * `upload_api_key` is its build-upload counterpart. Both are secrets, so neither
 * reaches the event log, and `REGENERATE_PROJECT_API_KEY` is marked destructive
 * because rotating it silently breaks every deployed notifier.
 */
export const BugsnagProjectEntity = z
	.object({
		id: Id,
		organization_id: S,
		slug: S,
		name: S,
		api_key: S,
		upload_api_key: S,
		must_use_upload_api_key: B,
		type: S,
		is_full_view: B,
		release_stages: z.array(z.string()).nullable().optional(),
		language: S,
		errors_url: S,
		events_url: S,
		url: S,
		html_url: S,
		open_error_count: N,
		for_review_error_count: N,
		collaborators_count: N,
		teams_count: N,
		global_grouping: z.array(z.string()).nullable().optional(),
		location_grouping: z.array(z.string()).nullable().optional(),
		discarded_app_versions: z.array(z.string()).nullable().optional(),
		discarded_errors: z.array(z.string()).nullable().optional(),
		custom_event_fields_used: N,
		resolve_on_deploy: B,
		performance_display_type: S,
		default_performance_percentile: S,
		target_stability: BugsnagStabilityTarget.nullable().optional(),
		critical_stability: BugsnagStabilityTarget.nullable().optional(),
		stability_target_type: S,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type BugsnagProjectEntity = z.infer<typeof BugsnagProjectEntity>;

/**
 * Collaborators. 18 live keys, and the entity that is mostly personal data:
 * a name, an email address, and a record of when they last made a request.
 *
 * Mirrored because errors, comments and audit trails reference a collaborator by
 * id, and resolving that id to a person is exactly the lookup a local copy is for.
 * Nothing from it is logged beyond the id.
 *
 * `project_roles` is an object keyed by project id, so its shape depends on the
 * account rather than being fixed - it is kept as a loose record.
 */
export const BugsnagCollaboratorEntity = z
	.object({
		id: Id,
		name: S,
		email: S,
		two_factor_enabled: B,
		two_factor_enabled_on: S,
		password_updated_on: S,
		show_time_in_utc: B,
		heroku: B,
		recovery_codes_remaining: N,
		is_admin: B,
		pending_invitation: B,
		last_request_at: S,
		paid_for: B,
		project_ids: z.array(z.string()).nullable().optional(),
		team_ids: z.array(z.string()).nullable().optional(),
		project_roles: z.record(z.string(), z.unknown()).nullable().optional(),
		managed_by_smartbear_id: B,
		created_at: S,
	})
	.loose();
export type BugsnagCollaboratorEntity = z.infer<
	typeof BugsnagCollaboratorEntity
>;

/**
 * Teams. Only 4 live keys - by far the narrowest entity here, and deliberately so:
 * a team is a name and two counts, with the membership held on the collaborator.
 *
 * Mirrored because it is structural in the same way an organization is - team ids
 * appear on collaborators (`team_ids`) and in the membership operations, and
 * resolving one to a name is the lookup a local copy exists for.
 *
 * Note what is **not** here. There is no `collaborators` array: the two counts are
 * the only membership information a team record carries, so the mirror cannot answer
 * "who is on this team" and must not appear to. That is what
 * `collaborators.list`'s `team_ids` is for.
 */
export const BugsnagTeamEntity = z
	.object({
		id: Id,
		name: S,
		collaborator_count: N,
		project_count: N,
	})
	.loose();
export type BugsnagTeamEntity = z.infer<typeof BugsnagTeamEntity>;
