import { z } from 'zod';
import { B, Id, N, S, StrArray } from './primitives';

/**
 * Field names match live Data Access API JSON keys.
 * https://docs.bugsnag.com/api/data-access/
 */

export const BugsnagCreatorRef = z
	.object({
		id: S,
		name: S,
		email: S,
	})
	.loose();
export type BugsnagCreatorRef = z.infer<typeof BugsnagCreatorRef>;

export const BugsnagStabilityTarget = z
	.object({
		value: N,
		updated_at: S,
		updated_by_id: S,
	})
	.loose();
export type BugsnagStabilityTarget = z.infer<typeof BugsnagStabilityTarget>;

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
		billing_emails: StrArray,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type BugsnagOrganizationEntity = z.infer<
	typeof BugsnagOrganizationEntity
>;

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
		release_stages: StrArray,
		language: S,
		errors_url: S,
		events_url: S,
		url: S,
		html_url: S,
		open_error_count: N,
		for_review_error_count: N,
		collaborators_count: N,
		teams_count: N,
		global_grouping: StrArray,
		location_grouping: StrArray,
		discarded_app_versions: StrArray,
		discarded_errors: StrArray,
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
		project_ids: StrArray,
		team_ids: StrArray,
		project_roles: z.record(z.string(), z.unknown()).nullable().optional(),
		managed_by_smartbear_id: B,
		created_at: S,
	})
	.loose();
export type BugsnagCollaboratorEntity = z.infer<
	typeof BugsnagCollaboratorEntity
>;

export const BugsnagTeamEntity = z
	.object({
		id: Id,
		name: S,
		collaborator_count: N,
		project_count: N,
	})
	.loose();
export type BugsnagTeamEntity = z.infer<typeof BugsnagTeamEntity>;
