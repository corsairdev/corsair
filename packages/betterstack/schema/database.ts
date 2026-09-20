import { z } from 'zod';

/**
 * Mirrored entities are Better Stack's *reference* data - the configuration a
 * caller reads repeatedly: monitors, heartbeats, their groups, escalation
 * policies, severities, status pages and on-call schedules.
 *
 * Incidents, incident comments and timeline items are deliberately **not**
 * mirrored: they are transactional records whose state changes outside this
 * plugin, and a stale local copy of an incident is worse than no copy.
 *
 * Only the primary key is required. Every other field is nullable and optional
 * because Better Stack omits fields by plan tier and by monitor type.
 * Shapes captured live on 2026-08-15.
 */

export const BetterstackMonitors = z.object({
	id: z.string(),
	auth_password: z.unknown().nullable().optional(),
	auth_username: z.unknown().nullable().optional(),
	call: z.boolean().nullable().optional(),
	check_frequency: z.number().nullable().optional(),
	checks_version: z.string().nullable().optional(),
	confirmation_period: z.number().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	critical_alert: z.boolean().nullable().optional(),
	domain_expiration: z.unknown().nullable().optional(),
	effective_check_frequency: z.number().nullable().optional(),
	effective_check_frequency_reason: z.unknown().nullable().optional(),
	email: z.boolean().nullable().optional(),
	environment_variables: z.looseObject({}).nullable().optional(),
	expected_status_codes: z.array(z.unknown()).nullable().optional(),
	expiration_policy_id: z.unknown().nullable().optional(),
	follow_redirects: z.boolean().nullable().optional(),
	http_method: z.string().nullable().optional(),
	ip_version: z.unknown().nullable().optional(),
	last_checked_at: z.string().nullable().optional(),
	maintenance_days: z.array(z.string()).nullable().optional(),
	maintenance_from: z.unknown().nullable().optional(),
	maintenance_timezone: z.unknown().nullable().optional(),
	maintenance_to: z.unknown().nullable().optional(),
	monitor_group_id: z.number().nullable().optional(),
	monitor_type: z.string().nullable().optional(),
	paused: z.boolean().nullable().optional(),
	paused_at: z.string().nullable().optional(),
	playwright_script: z.unknown().nullable().optional(),
	policy_id: z.unknown().nullable().optional(),
	port: z.unknown().nullable().optional(),
	pronounceable_name: z.string().nullable().optional(),
	proxy_host: z.unknown().nullable().optional(),
	proxy_port: z.unknown().nullable().optional(),
	push: z.boolean().nullable().optional(),
	recovery_period: z.number().nullable().optional(),
	regions: z.array(z.string()).nullable().optional(),
	remember_cookies: z.boolean().nullable().optional(),
	request_body: z.unknown().nullable().optional(),
	request_headers: z.array(z.unknown()).nullable().optional(),
	request_timeout: z.number().nullable().optional(),
	required_keyword: z.unknown().nullable().optional(),
	sms: z.boolean().nullable().optional(),
	ssl_expiration: z.unknown().nullable().optional(),
	status: z.string().nullable().optional(),
	team_name: z.string().nullable().optional(),
	team_wait: z.unknown().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	url: z.string().nullable().optional(),
	verify_ssl: z.boolean().nullable().optional(),
});

export type BetterstackMonitors = z.infer<typeof BetterstackMonitors>;

export const BetterstackMonitorGroups = z.object({
	id: z.string(),
	created_at: z.coerce.date().nullable().optional(),
	name: z.string().nullable().optional(),
	paused: z.boolean().nullable().optional(),
	sort_index: z.number().nullable().optional(),
	team_name: z.string().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type BetterstackMonitorGroups = z.infer<typeof BetterstackMonitorGroups>;

export const BetterstackHeartbeats = z.object({
	id: z.string(),
	call: z.boolean().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	critical_alert: z.boolean().nullable().optional(),
	email: z.boolean().nullable().optional(),
	grace: z.number().nullable().optional(),
	heartbeat_group_id: z.number().nullable().optional(),
	maintenance_days: z.array(z.string()).nullable().optional(),
	maintenance_from: z.unknown().nullable().optional(),
	maintenance_timezone: z.unknown().nullable().optional(),
	maintenance_to: z.unknown().nullable().optional(),
	name: z.string().nullable().optional(),
	paused: z.boolean().nullable().optional(),
	paused_at: z.string().nullable().optional(),
	period: z.number().nullable().optional(),
	policy_id: z.unknown().nullable().optional(),
	push: z.boolean().nullable().optional(),
	server_timezone: z.unknown().nullable().optional(),
	sms: z.boolean().nullable().optional(),
	sort_index: z.unknown().nullable().optional(),
	status: z.string().nullable().optional(),
	team_name: z.string().nullable().optional(),
	team_wait: z.unknown().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	url: z.string().nullable().optional(),
});

export type BetterstackHeartbeats = z.infer<typeof BetterstackHeartbeats>;

export const BetterstackHeartbeatGroups = z.object({
	id: z.string(),
	created_at: z.coerce.date().nullable().optional(),
	name: z.string().nullable().optional(),
	paused: z.boolean().nullable().optional(),
	sort_index: z.number().nullable().optional(),
	team_name: z.string().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type BetterstackHeartbeatGroups = z.infer<
	typeof BetterstackHeartbeatGroups
>;

export const BetterstackPolicies = z.object({
	id: z.string(),
	fallback_policy_id: z.unknown().nullable().optional(),
	incident_token: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	policy_group_id: z.unknown().nullable().optional(),
	repeat_count: z.number().nullable().optional(),
	repeat_delay: z.number().nullable().optional(),
	steps: z.array(z.looseObject({})).nullable().optional(),
	team_name: z.string().nullable().optional(),
});

export type BetterstackPolicies = z.infer<typeof BetterstackPolicies>;

export const BetterstackUrgencies = z.object({
	id: z.string(),
	call: z.boolean().nullable().optional(),
	critical_alert: z.boolean().nullable().optional(),
	email: z.boolean().nullable().optional(),
	name: z.string().nullable().optional(),
	push: z.boolean().nullable().optional(),
	sms: z.boolean().nullable().optional(),
	team_name: z.string().nullable().optional(),
	urgency_group_id: z.unknown().nullable().optional(),
});

export type BetterstackUrgencies = z.infer<typeof BetterstackUrgencies>;

export const BetterstackStatusPages = z.object({
	id: z.string(),
	aggregate_state: z.string().nullable().optional(),
	announcement: z.unknown().nullable().optional(),
	announcement_embed_css: z.unknown().nullable().optional(),
	announcement_embed_link: z.unknown().nullable().optional(),
	announcement_embed_visible: z.boolean().nullable().optional(),
	automatic_reports: z.boolean().nullable().optional(),
	company_name: z.string().nullable().optional(),
	company_url: z.unknown().nullable().optional(),
	contact_url: z.unknown().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	custom_css: z.unknown().nullable().optional(),
	custom_domain: z.unknown().nullable().optional(),
	custom_javascript: z.unknown().nullable().optional(),
	dark_logo_remote_url: z.unknown().nullable().optional(),
	dark_logo_url: z.unknown().nullable().optional(),
	design: z.string().nullable().optional(),
	google_analytics_id: z.unknown().nullable().optional(),
	hide_from_search_engines: z.boolean().nullable().optional(),
	history: z.number().nullable().optional(),
	include_all_incidents_in_rss_feed: z.boolean().nullable().optional(),
	ip_allowlist: z.array(z.unknown()).nullable().optional(),
	layout: z.string().nullable().optional(),
	logo_remote_url: z.unknown().nullable().optional(),
	logo_url: z.unknown().nullable().optional(),
	min_incident_length: z.number().nullable().optional(),
	navigation_links: z.array(z.unknown()).nullable().optional(),
	organization_id: z.number().nullable().optional(),
	password_enabled: z.boolean().nullable().optional(),
	published: z.boolean().nullable().optional(),
	require_sso: z.boolean().nullable().optional(),
	status_page_group_id: z.unknown().nullable().optional(),
	subdomain: z.string().nullable().optional(),
	subscribable: z.boolean().nullable().optional(),
	theme: z.string().nullable().optional(),
	timezone: z.string().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	whitelabeled: z.boolean().nullable().optional(),
});

export type BetterstackStatusPages = z.infer<typeof BetterstackStatusPages>;

export const BetterstackOnCallSchedules = z.object({
	id: z.string(),
	default_calendar: z.boolean().nullable().optional(),
	name: z.string().nullable().optional(),
	team_name: z.string().nullable().optional(),
});

export type BetterstackOnCallSchedules = z.infer<
	typeof BetterstackOnCallSchedules
>;
