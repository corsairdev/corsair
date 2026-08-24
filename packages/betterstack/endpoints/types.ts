import { z } from 'zod';

// ── envelopes ───────────────────────────────────────────────────────────────
// Every Better Stack resource arrives as { data: { id, type, attributes } };
// lists add a pagination block whose cursors are full URLs, not tokens.

export const BetterstackResourceSchema = z.looseObject({
	id: z.string(),
	type: z.string().nullable().optional(),
	attributes: z.looseObject({}).nullable().optional(),
	relationships: z.looseObject({}).nullable().optional(),
});

export const BetterstackPaginationSchema = z.looseObject({
	first: z.string().nullable().optional(),
	last: z.string().nullable().optional(),
	prev: z.string().nullable().optional(),
	next: z.string().nullable().optional(),
});

export const BetterstackSingleSchema = z.looseObject({
	data: BetterstackResourceSchema,
});

export const BetterstackListSchema = z.looseObject({
	data: z.array(BetterstackResourceSchema),
	pagination: BetterstackPaginationSchema.nullable().optional(),
});

/** Deletes answer 204 with an empty body. */
export const BetterstackEmptySchema = z.looseObject({});

// ── entity attribute shapes ─────────────────────────────────────────────────
// Generated from responses captured live on 2026-08-15. Every field except the
// primary key is nullable and optional: Better Stack omits fields by plan tier
// and by monitor type.

export const BetterstackHeartbeatAttributes = z.looseObject({
	call: z.boolean().nullable().optional(),
	created_at: z.string().nullable().optional(),
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
	updated_at: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
});

export const BetterstackHeartbeatAvailabilityAttributes = z.looseObject({
	availability: z.number().nullable().optional(),
	average_incident: z.number().nullable().optional(),
	longest_incident: z.number().nullable().optional(),
	number_of_incidents: z.number().nullable().optional(),
	total_downtime: z.number().nullable().optional(),
});

export const BetterstackHeartbeatGroupAttributes = z.looseObject({
	created_at: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	paused: z.boolean().nullable().optional(),
	sort_index: z.number().nullable().optional(),
	team_name: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

export const BetterstackIncidentAttributes = z.looseObject({
	acknowledged_at: z.string().nullable().optional(),
	acknowledged_by: z.string().nullable().optional(),
	call: z.boolean().nullable().optional(),
	cause: z.string().nullable().optional(),
	critical_alert: z.boolean().nullable().optional(),
	email: z.boolean().nullable().optional(),
	escalation_policy_id: z.unknown().nullable().optional(),
	http_method: z.string().nullable().optional(),
	incident_group_id: z.unknown().nullable().optional(),
	metadata: z.looseObject({}).nullable().optional(),
	name: z.string().nullable().optional(),
	origin_url: z.unknown().nullable().optional(),
	push: z.boolean().nullable().optional(),
	regions: z.unknown().nullable().optional(),
	resolved_at: z.string().nullable().optional(),
	resolved_by: z.string().nullable().optional(),
	response_content: z.unknown().nullable().optional(),
	response_options: z.unknown().nullable().optional(),
	response_url: z.string().nullable().optional(),
	screenshot_url: z.string().nullable().optional(),
	slack_channels: z.array(z.unknown()).nullable().optional(),
	sms: z.boolean().nullable().optional(),
	started_at: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	team_name: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
});

export const BetterstackIncidentCommentAttributes = z.looseObject({
	content: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	id: z.string(),
	updated_at: z.string().nullable().optional(),
});

export const BetterstackMetadataAttributes = z.looseObject({
	key: z.string().nullable().optional(),
	owner_id: z.string().nullable().optional(),
	owner_type: z.string().nullable().optional(),
	team_name: z.string().nullable().optional(),
	values: z.array(z.looseObject({})).nullable().optional(),
});

export const BetterstackMonitorAttributes = z.looseObject({
	auth_password: z.unknown().nullable().optional(),
	auth_username: z.unknown().nullable().optional(),
	call: z.boolean().nullable().optional(),
	check_frequency: z.number().nullable().optional(),
	checks_version: z.string().nullable().optional(),
	confirmation_period: z.number().nullable().optional(),
	created_at: z.string().nullable().optional(),
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
	updated_at: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	verify_ssl: z.boolean().nullable().optional(),
});

export const BetterstackMonitorGroupAttributes = z.looseObject({
	created_at: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	paused: z.boolean().nullable().optional(),
	sort_index: z.number().nullable().optional(),
	team_name: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

export const BetterstackMonitorResponseTimesAttributes = z.looseObject({
	regions: z.array(z.unknown()).nullable().optional(),
});

export const BetterstackMonitorSlaAttributes = z.looseObject({
	availability: z.number().nullable().optional(),
	average_incident: z.number().nullable().optional(),
	longest_incident: z.number().nullable().optional(),
	number_of_incidents: z.number().nullable().optional(),
	total_downtime: z.number().nullable().optional(),
});

export const BetterstackOnCallCalendarAttributes = z.looseObject({
	default_calendar: z.boolean().nullable().optional(),
	name: z.string().nullable().optional(),
	team_name: z.string().nullable().optional(),
});

export const BetterstackOutgoingWebhookAttributes = z.looseObject({
	name: z.string().nullable().optional(),
	notify_alongside_primary_responder: z.boolean().nullable().optional(),
	on_incident_acknowledged: z.boolean().nullable().optional(),
	on_incident_comment: z.boolean().nullable().optional(),
	on_incident_reopened: z.boolean().nullable().optional(),
	on_incident_resolved: z.boolean().nullable().optional(),
	on_incident_started: z.boolean().nullable().optional(),
	team_name: z.string().nullable().optional(),
	trigger_type: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
});

export const BetterstackPolicyAttributes = z.looseObject({
	fallback_policy_id: z.unknown().nullable().optional(),
	incident_token: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	policy_group_id: z.unknown().nullable().optional(),
	repeat_count: z.number().nullable().optional(),
	repeat_delay: z.number().nullable().optional(),
	steps: z.array(z.looseObject({})).nullable().optional(),
	team_name: z.string().nullable().optional(),
});

export const BetterstackPolicyGroupAttributes = z.looseObject({
	created_at: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	sort_index: z.number().nullable().optional(),
	team_name: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

export const BetterstackSourceGroupAttributes = z.looseObject({
	created_at: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	sort_index: z.number().nullable().optional(),
	team_name: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

export const BetterstackStatusPageAttributes = z.looseObject({
	aggregate_state: z.string().nullable().optional(),
	announcement: z.unknown().nullable().optional(),
	announcement_embed_css: z.unknown().nullable().optional(),
	announcement_embed_link: z.unknown().nullable().optional(),
	announcement_embed_visible: z.boolean().nullable().optional(),
	automatic_reports: z.boolean().nullable().optional(),
	company_name: z.string().nullable().optional(),
	company_url: z.unknown().nullable().optional(),
	contact_url: z.unknown().nullable().optional(),
	created_at: z.string().nullable().optional(),
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
	updated_at: z.string().nullable().optional(),
	whitelabeled: z.boolean().nullable().optional(),
});

export const BetterstackStatusPageGroupAttributes = z.looseObject({
	created_at: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	sort_index: z.number().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

export const BetterstackStatusPageResourceAttributes = z.looseObject({
	availability: z.number().nullable().optional(),
	explanation: z.unknown().nullable().optional(),
	history: z.boolean().nullable().optional(),
	mark_as_degraded_for: z.string().nullable().optional(),
	mark_as_down_for: z.string().nullable().optional(),
	position: z.number().nullable().optional(),
	public_name: z.string().nullable().optional(),
	resource_id: z.number().nullable().optional(),
	resource_type: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	status_history: z.array(z.looseObject({})).nullable().optional(),
	status_page_section_id: z.number().nullable().optional(),
	widget_type: z.string().nullable().optional(),
});

export const BetterstackStatusPageSectionAttributes = z.looseObject({
	name: z.string().nullable().optional(),
	position: z.number().nullable().optional(),
	status_page_id: z.number().nullable().optional(),
});

export const BetterstackStatusReportAttributes = z.looseObject({
	affected_resources: z.array(z.unknown()).nullable().optional(),
	aggregate_state: z.string().nullable().optional(),
	ends_at: z.string().nullable().optional(),
	report_type: z.string().nullable().optional(),
	starts_at: z.string().nullable().optional(),
	status_page_id: z.number().nullable().optional(),
	title: z.string().nullable().optional(),
});

export const BetterstackStatusUpdateAttributes = z.looseObject({
	affected_resources: z.array(z.unknown()).nullable().optional(),
	message: z.string().nullable().optional(),
	notify_subscribers: z.boolean().nullable().optional(),
	published_at: z.string().nullable().optional(),
	published_at_timezone: z.unknown().nullable().optional(),
	status_report_id: z.number().nullable().optional(),
});

export const BetterstackTimelineItemAttributes = z.looseObject({
	at: z.string().nullable().optional(),
	data: z.looseObject({}).nullable().optional(),
	item_type: z.string().nullable().optional(),
});

export const BetterstackUrgencyAttributes = z.looseObject({
	call: z.boolean().nullable().optional(),
	critical_alert: z.boolean().nullable().optional(),
	email: z.boolean().nullable().optional(),
	name: z.string().nullable().optional(),
	push: z.boolean().nullable().optional(),
	sms: z.boolean().nullable().optional(),
	team_name: z.string().nullable().optional(),
	urgency_group_id: z.unknown().nullable().optional(),
});

export const BetterstackUrgencyGroupAttributes = z.looseObject({
	created_at: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	sort_index: z.number().nullable().optional(),
	team_name: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

// ── endpoint input schemas ──────────────────────────────────────────────────
// Derived from the documented request-parameter tables, never from responses.

/**
 * Every collection is paginated the same way, and every collection response
 * carries a `pagination` block whose cursors are full URLs rather than tokens.
 * Without these two controls on the request side a caller can read the first
 * page and nothing else, so each operation returning `BetterstackListSchema`
 * spreads them in.
 *
 * `per_page` above the provider's maximum is silently clamped and still answers
 * 200, so there is no ceiling to validate against here.
 */
const PAGINATION_INPUT = {
	page: z
		.number()
		.int()
		.positive()
		.describe('Page of results to return. Defaults to the first page.')
		.optional(),
	per_page: z
		.number()
		.int()
		.positive()
		.describe(
			'Records per page. Values above the provider maximum are silently clamped.',
		)
		.optional(),
} as const;

export const BetterstackEndpointInputSchemas = {
	monitorsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		monitor_type: z.string().optional(),
		url: z
			.string()
			.describe(
				'The URL of your website or the host you want to ping. See monitor_type below.',
			)
			.optional(),
		pronounceable_name: z
			.string()
			.describe('The name of the monitor.')
			.optional(),
		email: z.boolean().describe('Send e-mail alerts.').optional(),
		sms: z.boolean().describe('Send SMS alerts.').optional(),
		call: z.boolean().describe('Phone call alerts.').optional(),
		push: z
			.boolean()
			.describe('Should we send a push notification to the on-call person?')
			.optional(),
		critical_alert: z
			.boolean()
			.describe('Should we send a critical alert to the on-call person?')
			.optional(),
		check_frequency: z
			.number()
			.describe(
				'Check frequency (in seconds). Check frequency must be at least the timeout value.',
			)
			.optional(),
		request_headers: z
			.array(z.looseObject({}))
			.describe('The request headers that will be send with the check.')
			.optional(),
		expected_status_codes: z
			.array(z.number())
			.describe(
				'An array of status codes you expect to receive from your website. These status codes are considered only if the monitor_type is expected_status_code.',
			)
			.optional(),
		domain_expiration: z
			.number()
			.describe(
				'How many days before the domain expires do you want to be alerted? Valid values are 1, 2, 3, 7, 14, 30, and 60.',
			)
			.optional(),
		ssl_expiration: z
			.number()
			.describe(
				'How many days before the SSL certificate expires do you want to be alerted? Valid values are 1, 2, 3, 7, 14, 30, and 60.',
			)
			.optional(),
		policy_id: z
			.string()
			.describe('Set the escalation policy for the monitor.')
			.optional(),
		expiration_policy_id: z
			.number()
			.describe(
				'Set the expiration escalation policy for the monitor. It is used for SSL certificate and domain expiration checks. When set to null, an e-mail is sent to the entire team.',
			)
			.optional(),
		follow_redirects: z
			.boolean()
			.describe(
				'Should we automatically follow redirects when sending the HTTP request?',
			)
			.optional(),
		required_keyword: z
			.string()
			.describe(
				'Required if monitor_type is set to keyword or udp. We will create a new incident if this keyword is missing on your page.',
			)
			.optional(),
		team_wait: z
			.number()
			.describe(
				'How long to wait before escalating the incident alert to the team. Leave blank to disable escalating to the entire team. In seconds.',
			)
			.optional(),
		paused: z
			.boolean()
			.describe(
				"Set to true to pause monitoring — we won't notify you about downtime. Set to false to resume monitoring.",
			)
			.optional(),
		port: z
			.string()
			.describe(
				'Required if monitor_type is set to tcp, udp, smtp, pop, or imap. tcp and udp monitors accept any ports, while smtp, pop, and imap accept only the specified ports corresponding with',
			)
			.optional(),
		ip_version: z
			.string()
			.describe(
				'Which Internet Protocol Version should we use for our requests. Valid options are: ipv4 - use IPv4 only, ipv6 - use IPv6 only. When not set or set to null, we use both IPv4 and IPv',
			)
			.optional(),
		regions: z
			.array(z.string())
			.describe(
				"An array of regions to set. Allowed values are ['us', 'eu', 'as', 'au'] or any subset of these regions.",
			)
			.optional(),
		monitor_group_id: z
			.string()
			.describe(
				'Set this attribute if you want to add this monitor to a monitor group.',
			)
			.optional(),
		recovery_period: z
			.number()
			.describe(
				'How long the monitor must be up to automatically mark an incident as resolved after being down. In seconds.',
			)
			.optional(),
		verify_ssl: z
			.boolean()
			.describe('Should we verify SSL certificate validity?')
			.optional(),
		confirmation_period: z
			.number()
			.describe(
				'How long should we wait after observing a failure before we start a new incident? In seconds. The maximum value is 86400.',
			)
			.optional(),
		http_method: z
			.string()
			.describe(
				'HTTP Method used to make a request. Valid options: GET, HEAD, POST, PUT, PATCH',
			)
			.optional(),
		request_timeout: z.number().optional(),
		request_body: z
			.string()
			.describe(
				'Request body for POST, PUT, PATCH requests. Required if monitor_type is set to dns (domain to query the DNS server with).',
			)
			.optional(),
		auth_username: z
			.string()
			.describe(
				'Basic HTTP authentication username to include with the request.',
			)
			.optional(),
		auth_password: z
			.string()
			.describe(
				'Basic HTTP authentication password to include with the request.',
			)
			.optional(),
		maintenance_days: z
			.array(z.string())
			.describe(
				"An array of maintenance days to set. If a maintenance window is overnight both affected days should be set. Allowed values are ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] or ",
			)
			.optional(),
		maintenance_from: z
			.string()
			.describe(
				"Start of the maintenance window each day. We won't check your website during this window. Example: '01:00:00'",
			)
			.optional(),
		maintenance_to: z
			.string()
			.describe("End of the maintenance window each day. Example: '03:00:00'")
			.optional(),
		maintenance_timezone: z
			.string()
			.describe(
				'The timezone to use for the maintenance window each day. Defaults to UTC. The accepted values can be found in the Rails TimeZone documentation. https://api.rubyonrails.org/classes/',
			)
			.optional(),
		remember_cookies: z
			.boolean()
			.describe('Do you want to keep cookies when redirecting?')
			.optional(),
		playwright_script: z
			.string()
			.describe(
				'For Playwright monitors, the JavaScript source code of the scenario.',
			)
			.optional(),
		scenario_name: z
			.string()
			.describe(
				'For Playwright monitors, the scenario name identifying the monitor in the UI.',
			)
			.optional(),
		environment_variables: z
			.looseObject({})
			.describe(
				'For Playwright monitors, the environment variables that can be used in the scenario. Example: { \\"PASSWORD\\": \\"passw0rd\\" }.',
			)
			.optional(),
		proxy_host: z
			.string()
			.describe(
				'The host of the proxy server to use for the monitor. Can include authentication credentials (e.g., user:pass@proxy.example.com).',
			)
			.optional(),
		proxy_port: z
			.string()
			.describe('The port of the proxy server to use for the monitor.')
			.optional(),
	}),
	monitorsGet: z.object({
		monitor_id: z
			.union([z.string(), z.number()])
			.describe('monitor_id (path parameter)'),
	}),
	monitorsList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter monitors belonging to a specified team when using global API token.',
			)
			.optional(),
		url: z
			.string()
			.describe('Filter monitors by their URL property.')
			.optional(),
		pronounceable_name: z
			.string()
			.describe('Filter monitors by their pronounceable name property.')
			.optional(),
	}),
	monitorsUpdate: z.object({
		monitor_id: z
			.union([z.string(), z.number()])
			.describe('monitor_id (path parameter)'),
		monitor_type: z.string().optional(),
		url: z
			.string()
			.describe(
				'The URL of your website or the host you want to ping. See monitor_type below.',
			)
			.optional(),
		pronounceable_name: z
			.string()
			.describe('The name of the monitor.')
			.optional(),
		email: z.boolean().describe('Send email alerts.').optional(),
		sms: z.boolean().describe('Send SMS alerts.').optional(),
		call: z.boolean().describe('Phone call alerts.').optional(),
		push: z
			.boolean()
			.describe('Should we send a push notification to the on-call person?')
			.optional(),
		critical_alert: z
			.boolean()
			.describe(
				'Should we send a critical push notification that ignores the mute switch and Do not Disturb mode?',
			)
			.optional(),
		check_frequency: z
			.number()
			.describe(
				'Check frequency (in seconds). Check frequency must be at least the timeout value.',
			)
			.optional(),
		request_headers: z
			.array(z.looseObject({}))
			.describe('The request headers that will be send with the check.')
			.optional(),
		expected_status_codes: z
			.array(z.number())
			.describe(
				'An array of status codes you expect to receive from your website. These status codes are considered only if the monitor_type is expected_status_code.',
			)
			.optional(),
		domain_expiration: z
			.number()
			.describe(
				'How many days before the domain expires do you want to be alerted? Valid values are 1, 2, 3, 7, 14, 30, and 60.',
			)
			.optional(),
		ssl_expiration: z
			.number()
			.describe(
				'How many days before the SSL certificate expires do you want to be alerted? Valid values are 1, 2, 3, 7, 14, 30, and 60.',
			)
			.optional(),
		policy_id: z
			.string()
			.describe('Set the escalation policy for the monitor.')
			.optional(),
		expiration_policy_id: z
			.number()
			.describe(
				'Set the expiration escalation policy for the monitor. It is used for SSL certificate and domain expiration checks. When set to null, an e-mail is sent to the entire team.',
			)
			.optional(),
		follow_redirects: z
			.boolean()
			.describe(
				'Should we automatically follow redirects when sending the HTTP request?',
			)
			.optional(),
		required_keyword: z
			.string()
			.describe(
				'Required if monitor_type is set to keyword or udp. We will create a new incident if this keyword is missing on your page.',
			)
			.optional(),
		team_wait: z
			.number()
			.describe(
				'How long to wait before escalating the incident alert to the team. Leave blank to disable escalating to the entire team. In seconds.',
			)
			.optional(),
		paused: z
			.boolean()
			.describe(
				"Set to true to pause monitoring — we won't notify you about downtime. Set to false to resume monitoring.",
			)
			.optional(),
		port: z
			.string()
			.describe(
				'Required if monitor_type is set to tcp, udp, smtp, pop, or imap. tcp and udp monitors accept any ports, while smtp, pop, and imap accept only the specified ports corresponding with',
			)
			.optional(),
		ip_version: z
			.string()
			.describe(
				'Which Internet Protocol Version should we use for our requests. Valid options are: ipv4 - use IPv4 only, ipv6 - use IPv6 only. When not set or set to null, we use both IPv4 and IPv',
			)
			.optional(),
		regions: z
			.array(z.string())
			.describe(
				"An array of regions to set. Allowed values are ['us', 'eu', 'as', 'au'] or any subset of these regions.",
			)
			.optional(),
		monitor_group_id: z
			.string()
			.describe(
				'Set this attribute if you want to add this monitor to a monitor group.',
			)
			.optional(),
		recovery_period: z
			.number()
			.describe(
				'How long the monitor must be up to automatically mark an incident as resolved after being down. In seconds.',
			)
			.optional(),
		verify_ssl: z
			.boolean()
			.describe('Should we verify SSL certificate validity?')
			.optional(),
		confirmation_period: z
			.number()
			.describe(
				'How long should we wait after observing a failure before we start a new incident? In seconds. The maximum value is 86400.',
			)
			.optional(),
		http_method: z
			.string()
			.describe(
				'HTTP Method used to make a request. Valid options: GET, HEAD, POST, PUT, PATCH',
			)
			.optional(),
		request_timeout: z.number().optional(),
		request_body: z
			.string()
			.describe(
				'Request body for POST, PUT, PATCH requests. Required if monitor_type is set to dns (domain to query the DNS server with).',
			)
			.optional(),
		auth_username: z
			.string()
			.describe(
				'Basic HTTP authentication username to include with the request.',
			)
			.optional(),
		auth_password: z
			.string()
			.describe(
				'Basic HTTP authentication password to include with the request.',
			)
			.optional(),
		maintenance_days: z
			.array(z.string())
			.describe(
				"An array of maintenance days to set. If a maintenance window is overnight both affected days should be set. Allowed values are ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] or ",
			)
			.optional(),
		maintenance_from: z
			.string()
			.describe(
				"Start of the maintenance window each day. We won't check your website during this window. Example: '01:00:00'",
			)
			.optional(),
		maintenance_to: z
			.string()
			.describe("End of the maintenance window each day. Example: '03:00:00'")
			.optional(),
		maintenance_timezone: z
			.string()
			.describe(
				'The timezone to use for the maintenance window each day. Defaults to UTC. The accepted values can be found in the Rails TimeZone documentation. https://api.rubyonrails.org/classes/',
			)
			.optional(),
		remember_cookies: z
			.boolean()
			.describe('Do you want to keep cookies when redirecting?')
			.optional(),
		playwright_script: z
			.string()
			.describe(
				'For Playwright monitors, the JavaScript source code of the scenario.',
			)
			.optional(),
		scenario_name: z
			.string()
			.describe(
				'For Playwright monitors, the scenario name identifying the monitor in the UI.',
			)
			.optional(),
		environment_variables: z
			.looseObject({})
			.describe(
				'For Playwright monitors, the environment variables that can be used in the scenario. Example: { \\"PASSWORD\\": \\"passw0rd\\" }.',
			)
			.optional(),
		proxy_host: z
			.string()
			.describe(
				'The host of the proxy server to use for the monitor. Can include authentication credentials (e.g., user:pass@proxy.example.com).',
			)
			.optional(),
		proxy_port: z
			.string()
			.describe('The port of the proxy server to use for the monitor.')
			.optional(),
	}),
	monitorsRemove: z.object({
		monitor_id: z
			.union([z.string(), z.number()])
			.describe('monitor_id (path parameter)'),
	}),
	monitorsAvailability: z.object({
		monitor_id: z
			.union([z.string(), z.number()])
			.describe('monitor_id (path parameter)'),
		from: z.string().describe('Start date (e.g., 2021-01-26)').optional(),
		to: z.string().describe('End date (e.g., 2021-01-27)').optional(),
	}),
	monitorsResponseTimes: z.object({
		monitor_id: z
			.union([z.string(), z.number()])
			.describe('monitor_id (path parameter)'),
	}),
	monitorGroupsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		paused: z
			.boolean()
			.describe(
				"Set to true to pause monitoring for any existing monitors in the group — we won't notify you about downtime. Set to false to resume monitoring for any existing monitors in the grou",
			)
			.optional(),
		name: z
			.string()
			.describe('The name of the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your monitor groups.')
			.optional(),
	}),
	monitorGroupsGet: z.object({
		monitor_group_id: z
			.union([z.string(), z.number()])
			.describe('monitor_group_id (path parameter)'),
	}),
	monitorGroupsList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter monitor groups belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	monitorGroupsUpdate: z.object({
		monitor_group_id: z
			.union([z.string(), z.number()])
			.describe('monitor_group_id (path parameter)'),
		paused: z
			.boolean()
			.describe(
				"Set to true to pause monitoring for any existing monitors in the group — we won't notify you about downtime. Set to false to resume monitoring for any existing monitors in the grou",
			)
			.optional(),
		name: z
			.string()
			.describe('The name of the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your monitor groups.')
			.optional(),
	}),
	monitorGroupsRemove: z.object({
		monitor_group_id: z
			.union([z.string(), z.number()])
			.describe('monitor_group_id (path parameter)'),
	}),
	monitorGroupsMonitors: z.object({
		...PAGINATION_INPUT,
		monitor_group_id: z
			.union([z.string(), z.number()])
			.describe('monitor_group_id (path parameter)'),
	}),
	heartbeatsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		name: z
			.string()
			.describe('The name of the service for this heartbeat.')
			.optional(),
		period: z
			.number()
			.describe(
				'How often should we expect this heartbeat? In seconds Minimum value: 30 seconds',
			)
			.optional(),
		grace: z
			.number()
			.describe(
				'Heartbeats can fluctuate; specify this value to control what is still acceptable Minimum value: 0 seconds We recommend setting this to approx. 20% of period',
			)
			.optional(),
		call: z.boolean().describe('Should we call the on-call person?').optional(),
		sms: z
			.boolean()
			.describe('Should we send an SMS to the on-call person?')
			.optional(),
		email: z
			.boolean()
			.describe('Should we send an email to the on-call person?')
			.optional(),
		push: z
			.boolean()
			.describe('Should we send a push notification to the on-call person?')
			.optional(),
		critical_alert: z
			.boolean()
			.describe(
				'Should we send a critical push notification that ignores the mute switch and Do not Disturb mode?',
			)
			.optional(),
		team_wait: z
			.number()
			.describe(
				'How long should we wait before escalating the incident alert to the team? Leave blank to disable escalating to the entire team.',
			)
			.optional(),
		heartbeat_group_id: z
			.number()
			.describe(
				'Set this attribute if you want to add this heartbeat to a heartbeat group',
			)
			.optional(),
		sort_index: z
			.number()
			.describe(
				'An index controlling the position of a heartbeat in the heartbeat group.',
			)
			.optional(),
		paused: z
			.boolean()
			.describe(
				"Set to true to pause monitoring — we won't notify you about downtime. Set to false to resume monitoring",
			)
			.optional(),
		server_timezone: z
			.string()
			.describe(
				'Optional IANA timezone (e.g. Europe/Berlin) used for DST-aware missed-beat detection. Requires period >= 3600 (1 hour)',
			)
			.optional(),
		maintenance_days: z
			.array(z.string())
			.describe(
				"An array of maintenance days to set. If a maintenance window is overnight both affected days should be set. Allowed values are ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] or ",
			)
			.optional(),
		maintenance_from: z
			.string()
			.describe(
				"Start of the maintenance window each day. We won't check your website during this window. Example: '01:00:00'",
			)
			.optional(),
		maintenance_to: z
			.string()
			.describe("End of the maintenance window each day. Example: '03:00:00'")
			.optional(),
		maintenance_timezone: z
			.string()
			.describe(
				'The timezone to use for the maintenance window each day. Defaults to UTC. The accepted values can be found in the Rails TimeZone documentation. https://api.rubyonrails.org/classes/',
			)
			.optional(),
		policy_id: z
			.number()
			.describe('Set the escalation policy for the monitor.')
			.optional(),
	}),
	heartbeatsGet: z.object({
		heartbeat_id: z
			.union([z.string(), z.number()])
			.describe('heartbeat_id (path parameter)'),
	}),
	heartbeatsList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter heartbeats belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	heartbeatsUpdate: z.object({
		heartbeat_id: z
			.union([z.string(), z.number()])
			.describe('heartbeat_id (path parameter)'),
		name: z
			.string()
			.describe('The name of the service for this heartbeat.')
			.optional(),
		period: z
			.number()
			.describe(
				'How often should we expect this heartbeat? In seconds Minimum value: 30 seconds',
			)
			.optional(),
		grace: z
			.number()
			.describe(
				'Heartbeats can fluctuate; specify this value to control what is still acceptable Minimum value: 0 seconds We recommend setting this to approx. 20% of period',
			)
			.optional(),
		call: z.boolean().describe('Should we call the on-call person?').optional(),
		sms: z
			.boolean()
			.describe('Should we send an SMS to the on-call person?')
			.optional(),
		email: z
			.boolean()
			.describe('Should we send an email to the on-call person?')
			.optional(),
		push: z
			.boolean()
			.describe('Should we send a push notification to the on-call person?')
			.optional(),
		critical_alert: z
			.boolean()
			.describe(
				'Should we send a critical push notification that ignores the mute switch and Do not Disturb mode?',
			)
			.optional(),
		team_wait: z
			.number()
			.describe(
				'How long should we wait before escalating the incident alert to the team? Leave blank to disable escalating to the entire team.',
			)
			.optional(),
		heartbeat_group_id: z
			.number()
			.describe(
				'Set this attribute if you want to add this heartbeat to a heartbeat group',
			)
			.optional(),
		sort_index: z
			.number()
			.describe(
				'An index controlling the position of a heartbeat in the heartbeat group.',
			)
			.optional(),
		maintenance_days: z
			.array(z.string())
			.describe(
				"An array of maintenance days to set. If a maintenance window is overnight both affected days should be set. Allowed values are ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] or ",
			)
			.optional(),
		maintenance_from: z
			.string()
			.describe(
				"Start of the maintenance window each day. We won't check your website during this window. Example: '01:00:00'",
			)
			.optional(),
		maintenance_to: z
			.string()
			.describe("End of the maintenance window each day. Example: '03:00:00'")
			.optional(),
		maintenance_timezone: z
			.string()
			.describe(
				'The timezone to use for the maintenance window each day. Defaults to UTC. The accepted values can be found in the Rails TimeZone documentation. https://api.rubyonrails.org/classes/',
			)
			.optional(),
		paused: z
			.boolean()
			.describe(
				"Set to true to pause monitoring — we won't notify you about downtime. Set to false to resume monitoring",
			)
			.optional(),
		server_timezone: z
			.string()
			.describe(
				'Optional IANA timezone (e.g. Europe/Berlin) used for DST-aware missed-beat detection. Requires period >= 3600 (1 hour). Pass an empty string or null to clear',
			)
			.optional(),
		policy_id: z
			.number()
			.describe('Set the escalation policy for the monitor.')
			.optional(),
	}),
	heartbeatsRemove: z.object({
		heartbeat_id: z
			.union([z.string(), z.number()])
			.describe('heartbeat_id (path parameter)'),
	}),
	heartbeatsAvailability: z.object({
		heartbeat_id: z
			.union([z.string(), z.number()])
			.describe('heartbeat_id (path parameter)'),
		from: z.string().describe('Start date (e.g., 2021-01-26)').optional(),
		to: z.string().describe('End date (e.g., 2021-01-27)').optional(),
	}),
	heartbeatGroupsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		paused: z
			.boolean()
			.describe(
				"Set to true to pause monitoring for any existing heartbeats in the group — we won't notify you about downtime. Set to false to resume monitoring for any existing heartbeats in the ",
			)
			.optional(),
		name: z
			.string()
			.describe('A name of the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your heartbeat groups.')
			.optional(),
	}),
	heartbeatGroupsGet: z.object({
		heartbeat_group_id: z
			.union([z.string(), z.number()])
			.describe('heartbeat_group_id (path parameter)'),
	}),
	heartbeatGroupsList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter heartbeat groups belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	heartbeatGroupsUpdate: z.object({
		heartbeat_group_id: z
			.union([z.string(), z.number()])
			.describe('heartbeat_group_id (path parameter)'),
		period: z
			.number()
			.describe(
				'How often should we expect this heartbeat? In seconds Minimum value: 30 seconds',
			)
			.optional(),
		paused: z
			.boolean()
			.describe(
				"Set to true to pause monitoring for any existing heartbeats in the group — we won't notify you about downtime. Set to false to resume monitoring for any existing heartbeats in the ",
			)
			.optional(),
		name: z
			.string()
			.describe('A name of the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your heartbeat groups.')
			.optional(),
	}),
	heartbeatGroupsRemove: z.object({
		heartbeat_group_id: z
			.union([z.string(), z.number()])
			.describe('heartbeat_group_id (path parameter)'),
	}),
	incidentsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		requester_email: z
			.string()
			.describe(
				'E-mail of the user who requested the incident. Not required when authenticating with an OAuth token',
			),
		name: z.string().describe('Short name of the incident').optional(),
		summary: z.string().describe('Brief summary of the incident'),
		description: z
			.string()
			.describe('Full description of the incident')
			.optional(),
		call: z.boolean().describe('Should we call the on-call person?').optional(),
		sms: z
			.boolean()
			.describe('Should we send an SMS to the on-call person?')
			.optional(),
		email: z
			.boolean()
			.describe('Should we send an e-mail to the on-call person?')
			.optional(),
		push: z
			.boolean()
			.describe(
				'Should we send a push notification to the on-call person? Defaults to false.',
			)
			.optional(),
		critical_alert: z
			.boolean()
			.describe(
				'Should we send a critical push notification that ignores the mute switch and Do not Disturb mode?',
			)
			.optional(),
		team_wait: z
			.number()
			.describe(
				'How long to wait before escalating the incident alert to the team. Leave blank to disable escalating to the entire team. In seconds.',
			)
			.optional(),
		policy_id: z
			.string()
			.describe(
				"The ID of the escalation policy with which you'd like to escalate this incident",
			)
			.optional(),
		metadata: z
			.looseObject({})
			.describe(
				'An object with metadata keys as the object keys and arrays of metadata values as object values. See the metadata API response params page for details about metadata value attribute',
			)
			.optional(),
	}),
	incidentsGet: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
	}),
	incidentsList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter incidents belonging to a specified team when using global API token.',
			)
			.optional(),
		from: z
			.string()
			.describe(
				'Return only incidents from a certain date (format YYYY-MM-DD).',
			)
			.optional(),
		to: z
			.string()
			.describe('Return incidents until a certain date (format YYYY-MM-DD).')
			.optional(),
		monitor_id: z
			.number()
			.describe('Filter incidents belonging to a specified monitor.')
			.optional(),
		heartbeat_id: z
			.number()
			.describe('Filter incidents belonging to a specified heartbeat.')
			.optional(),
		resolved: z
			.boolean()
			.describe(
				'List only resolved or unresolved incidents. When omitted both resolved and unresolved incidents are listed. Example: Use ?resolved=false to list active incidents.',
			)
			.optional(),
		acknowledged: z
			.boolean()
			.describe(
				'List only acknowledged or unacknowledged incidents. When omitted both acknowledged or unacknowledged incidents are listed.',
			)
			.optional(),
		metadata: z
			.string()
			.describe(
				'List incidents with matching metadata. Pass the metadata as nested query parameter. Example: Use ?metadata[key][][value]=value or ?metadata[key][][type]=User&metadata[key][][email]',
			)
			.optional(),
	}),
	incidentsRemove: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
	}),
	incidentsAcknowledge: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
		acknowledged_by: z
			.string()
			.describe(
				'User e-mail or a custom identifier of the entity that acknowledged the incident',
			)
			.optional(),
	}),
	incidentsResolve: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
		resolved_by: z
			.string()
			.describe(
				'User e-mail or a custom identifier of the entity that resolved the incident',
			)
			.optional(),
	}),
	incidentsEscalate: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
		escalation_type: z
			.string()
			.describe(
				'Who should we escalate this incident to? \\nPossible values: User, Team, Schedule, Policy, and Organization',
			),
		user_email: z
			.string()
			.describe(
				'Define which team member to escalate to. \\nEither user_email or user_id required when escalating to User.',
			)
			.optional(),
		user_id: z
			.number()
			.describe(
				'Define which team member to escalate to. \\nEither user_email or user_id required when escalating to User.',
			)
			.optional(),
		team_name: z
			.string()
			.describe(
				'Define which team to escalate to. \\nEither team_name or team_id required when escalating to Team.',
			)
			.optional(),
		team_id: z
			.number()
			.describe(
				'Define which team to escalate to. \\nEither team_name or team_id required when escalating to Team.',
			)
			.optional(),
		schedule_id: z
			.number()
			.describe(
				'Define which on-call calendar to escalate to. Required when escalating to Schedule.',
			)
			.optional(),
		policy_id: z
			.number()
			.describe(
				'Define which escalation policy to escalate to. Required when escalating to Policy.',
			)
			.optional(),
		call: z
			.boolean()
			.describe(
				'Should we call? \\nCan be used when escalating to User, Team, Schedule, or Organization.',
			)
			.optional(),
		sms: z
			.boolean()
			.describe(
				'Should we send an SMS? \\nCan be used when escalating to User, Team, Schedule, or Organization.',
			)
			.optional(),
		email: z
			.boolean()
			.describe(
				'Should we send an email? \\nCan be used when escalating to User, Team, Schedule, or Organization.',
			)
			.optional(),
		push: z
			.boolean()
			.describe(
				'Should we send a push notification? \\nCan be used when escalating to User, Team, Schedule, or Organization.',
			)
			.optional(),
		critical_alert: z
			.boolean()
			.describe(
				'Should we send a critical push notification that ignores the mute switch and Do not Disturb mode? \\nCan be used when escalating to User, Team, Schedule, or Organization.',
			)
			.optional(),
		metadata: z
			.looseObject({})
			.describe(
				'An object with metadata keys as the object keys and arrays of metadata values as object values. See the metadata API response params page for details about metadata value attribute',
			)
			.optional(),
	}),
	incidentsTimeline: z.object({
		...PAGINATION_INPUT,
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
	}),
	incidentCommentsCreate: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
		content: z
			.string()
			.describe(
				'The content of the comment. Markdown is supported for formatting.',
			),
		user_email: z
			.string()
			.describe('Email of a team member to tag in the comment.')
			.optional(),
	}),
	incidentCommentsGet: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
		comment_id: z
			.union([z.string(), z.number()])
			.describe('comment_id (path parameter)'),
	}),
	incidentCommentsList: z.object({
		...PAGINATION_INPUT,
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
	}),
	incidentCommentsUpdate: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
		comment_id: z
			.union([z.string(), z.number()])
			.describe('comment_id (path parameter)'),
		content: z
			.string()
			.describe(
				'The content of the comment. Markdown is supported for formatting.',
			)
			.optional(),
	}),
	incidentCommentsRemove: z.object({
		incident_id: z
			.union([z.string(), z.number()])
			.describe('incident_id (path parameter)'),
		comment_id: z
			.union([z.string(), z.number()])
			.describe('comment_id (path parameter)'),
	}),
	policiesCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		name: z.string().describe('The name of this Policy.'),
		repeat_count: z
			.number()
			.describe(
				'How many times should the entire policy be repeated if no one acknowledges the incident.',
			)
			.optional(),
		repeat_delay: z
			.number()
			.describe('How long in seconds to wait before each repetition.')
			.optional(),
		steps: z
			.array(z.looseObject({}))
			.describe(
				'An array of escalation policy steps. See the list of escalation policy API parameters for details.',
			)
			.optional(),
		fallback_policy_id: z
			.number()
			.describe(
				'The ID of an escalation policy to escalate to once this policy has run all its steps and repeats without being acknowledged. Must belong to the same organization. Defaults to null ',
			)
			.optional(),
	}),
	policiesGet: z.object({
		policy_id: z
			.union([z.string(), z.number()])
			.describe('policy_id (path parameter)'),
	}),
	policiesList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter policies belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	policiesUpdate: z.object({
		policy_id: z
			.union([z.string(), z.number()])
			.describe('policy_id (path parameter)'),
		name: z.string().describe('The name of this Policy.').optional(),
		repeat_count: z
			.number()
			.describe(
				'How many times should the entire policy be repeated if no one acknowledges the incident.',
			)
			.optional(),
		repeat_delay: z
			.number()
			.describe('How long in seconds to wait before each repetition.')
			.optional(),
		steps: z
			.array(z.looseObject({}))
			.describe(
				'An array of escalation policy steps. See the list of escalation policy API parameters for details.',
			)
			.optional(),
		fallback_policy_id: z
			.number()
			.describe(
				'The ID of an escalation policy to escalate to once this policy has run all its steps and repeats without being acknowledged. Must belong to the same organization. Defaults to null ',
			)
			.optional(),
	}),
	policiesRemove: z.object({
		policy_id: z
			.union([z.string(), z.number()])
			.describe('policy_id (path parameter)'),
	}),
	policyGroupsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		name: z
			.string()
			.describe('The name of the group that you can see in the dashboard.'),
		sort_index: z
			.number()
			.describe(
				'Set sort_index to specify how to sort your escalation policy groups.',
			)
			.optional(),
	}),
	policyGroupsGet: z.object({
		policy_group_id: z
			.union([z.string(), z.number()])
			.describe('policy_group_id (path parameter)'),
	}),
	policyGroupsList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter policy groups belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	policyGroupsUpdate: z.object({
		policy_group_id: z
			.union([z.string(), z.number()])
			.describe('policy_group_id (path parameter)'),
		name: z
			.string()
			.describe('The name of the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your escalation policy.')
			.optional(),
	}),
	policyGroupsRemove: z.object({
		policy_group_id: z
			.union([z.string(), z.number()])
			.describe('policy_group_id (path parameter)'),
	}),
	onCallsCreate: z.object({
		name: z.string().describe('The name of the schedule'),
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
	}),
	onCallsGet: z.object({
		schedule_id: z
			.union([z.string(), z.number()])
			.describe('schedule_id (path parameter)'),
		date: z
			.string()
			.describe(
				'Include an ISO-8601-formatted date or date-time if you want to look-up on-call at a specific date or time.',
			)
			.optional(),
	}),
	onCallsList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter on-call schedules belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	onCallsUpdate: z.object({
		schedule_id: z
			.union([z.string(), z.number()])
			.describe('schedule_id (path parameter)'),
		name: z.string().describe('The name of the schedule').optional(),
	}),
	onCallsRemove: z.object({
		schedule_id: z
			.union([z.string(), z.number()])
			.describe('schedule_id (path parameter)'),
	}),
	onCallsEvents: z.object({
		...PAGINATION_INPUT,
		schedule_id: z
			.union([z.string(), z.number()])
			.describe('schedule_id (path parameter)'),
	}),
	urgenciesCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		name: z.string().describe('The name of this severity.'),
		sms: z
			.boolean()
			.describe('Whether to send SMS when a new incident is created.'),
		call: z
			.boolean()
			.describe('Whether to call when a new incident is created.'),
		email: z
			.boolean()
			.describe('Whether to send email when a new incident is created.'),
		push: z
			.boolean()
			.describe(
				'Whether to send push notification when a new incident is created.',
			),
		critical_alert: z
			.boolean()
			.describe(
				'Should we send a critical push notification that ignores the mute switch and Do not Disturb mode?',
			)
			.optional(),
	}),
	urgenciesGet: z.object({
		urgency_id: z
			.union([z.string(), z.number()])
			.describe('urgency_id (path parameter)'),
	}),
	urgenciesList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter severities belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	urgenciesUpdate: z.object({
		urgency_id: z
			.union([z.string(), z.number()])
			.describe('urgency_id (path parameter)'),
		name: z.string().describe('The name of this severity.').optional(),
		sms: z
			.boolean()
			.describe('Whether to send SMS when a new incident is created.')
			.optional(),
		call: z
			.boolean()
			.describe('Whether to call when a new incident is created.')
			.optional(),
		email: z
			.boolean()
			.describe('Whether to send email when a new incident is created.')
			.optional(),
		push: z
			.boolean()
			.describe(
				'Whether to send push notification when a new incident is created.',
			)
			.optional(),
		critical_alert: z
			.boolean()
			.describe(
				'Should we send a critical push notification that ignores the mute switch and Do not Disturb mode?',
			)
			.optional(),
	}),
	urgenciesRemove: z.object({
		urgency_id: z
			.union([z.string(), z.number()])
			.describe('urgency_id (path parameter)'),
	}),
	urgencyGroupsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		name: z
			.string()
			.describe('The name of the group that you can see in the dashboard.'),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your severity groups.')
			.optional(),
	}),
	urgencyGroupsGet: z.object({
		urgency_group_id: z
			.union([z.string(), z.number()])
			.describe('urgency_group_id (path parameter)'),
	}),
	urgencyGroupsList: z.object({
		...PAGINATION_INPUT,
	}),
	urgencyGroupsUpdate: z.object({
		urgency_group_id: z
			.union([z.string(), z.number()])
			.describe('urgency_group_id (path parameter)'),
		name: z
			.string()
			.describe('The name of the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your severity.')
			.optional(),
	}),
	urgencyGroupsRemove: z.object({
		urgency_group_id: z
			.union([z.string(), z.number()])
			.describe('urgency_group_id (path parameter)'),
	}),
	statusPagesGet: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
	}),
	statusPagesList: z.object({
		...PAGINATION_INPUT,
	}),
	statusPagesUpdate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		history: z
			.number()
			.describe(
				'Number of days to display on the status page. Between 7 and 365 days.',
			)
			.optional(),
		company_name: z.string().describe('Name of your company').optional(),
		company_url: z
			.string()
			.describe("URL of your company's website")
			.optional(),
		contact_url: z
			.string()
			.describe(
				'URL that should be used for contacting you in case of an emergency',
			)
			.optional(),
		logo_url: z
			.string()
			.describe(
				"A direct link to your company's logo. The image should be under 20MB in size",
			)
			.optional(),
		dark_logo_url: z
			.string()
			.describe(
				"A direct link to a dark version of your company's logo. The image should be under 20MB in size",
			)
			.optional(),
		whitelabeled: z.boolean().optional(),
		timezone: z
			.string()
			.describe(
				'What timezone should we display your status page in? The accepted values can be found in the Rails TimeZone documentation. https://api.rubyonrails.org/classes/ActiveSupport/TimeZon',
			)
			.optional(),
		subdomain: z
			.string()
			.describe(
				'What subdomain should we use for your status page? This needs to be unique across our entire application, so choose carefully',
			)
			.optional(),
		custom_domain: z
			.string()
			.describe(
				'Do you want a custom domain on your status page? Add a CNAME record that points your domain to status.betteruptime.com Example: CNAME status.walmine.com statuspage.betteruptime.com',
			)
			.optional(),
		min_incident_length: z
			.number()
			.describe(
				"If you don't want to display short incidents on your status page, this attribute is for you. In seconds.",
			)
			.optional(),
		subscribable: z
			.boolean()
			.describe(
				'Do you want to allow users to subscribe to your status page changes?',
			)
			.optional(),
		hide_from_search_engines: z
			.boolean()
			.describe('Hide your status page from search engines')
			.optional(),
		custom_css: z
			.string()
			.describe(
				'Unleash your inner designer and tweak our status page design to fit your branding',
			)
			.optional(),
		custom_javascript: z
			.string()
			.describe(
				'Level up your status page by adding analytics, interactive features, or any other functionality you need',
			)
			.optional(),
		design: z
			.string()
			.describe(
				'Choose between classic and modern status page design. Possible values: v1, v2.',
			)
			.optional(),
		navigation_links: z.array(z.looseObject({})).optional(),
		theme: z
			.string()
			.describe(
				'Select a color theme of your status page. Possible values: light, dark, system. This only applies when the design is set to v2.',
			)
			.optional(),
		layout: z
			.string()
			.describe(
				'Pick your status page header layout. Possible values: vertical, horizontal. This only applies when the design is set to v2.',
			)
			.optional(),
		google_analytics_id: z
			.string()
			.describe(
				'Specify your own Google Analytics ID if you want to receive hits on your status page',
			)
			.optional(),
		announcement: z
			.string()
			.describe('Add an announcement to your status page')
			.optional(),
		announcement_embed_visible: z
			.boolean()
			.describe(
				'Toggle this field if you want to show an announcement in your embed You can embed the announcement using this snippet: !SNIPPET MISSING (quotes in the snippet break markdown/toml s',
			)
			.optional(),
		announcement_embed_link: z
			.string()
			.describe('Point your embedded announcement to a specified URL')
			.optional(),
		announcement_embed_custom_css: z
			.string()
			.describe('Modify the design of the announcement embed')
			.optional(),
		automatic_reports: z
			.boolean()
			.describe('Automatically create status page updates for new incidents?')
			.optional(),
		published: z
			.boolean()
			.describe('Publish or unpublish your status page')
			.optional(),
		password_enabled: z
			.boolean()
			.describe(
				'Do you want to enable password protection on your status page?',
			)
			.optional(),
		password: z
			.string()
			.describe(
				"Set a password of your status page (we won't store it as plaintext, promise) Required when password_enabled: true. We will set password_enabled: false automatically when you send u",
			)
			.optional(),
		require_sso: z
			.boolean()
			.describe(
				'Require SSO sign-in to access your status page. Requires SSO to be configured for your organization and is mutually exclusive with password protection.',
			)
			.optional(),
		ip_allowlist: z.array(z.string()).optional(),
		status_page_group_id: z
			.number()
			.describe(
				'The ID of the status page group to which this status page will belong. Can be null.',
			)
			.optional(),
	}),
	statusPageSectionsCreate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		name: z
			.string()
			.describe(
				'The name of the section. Leave blank to hide the section header.',
			)
			.optional(),
		position: z
			.number()
			.describe(
				"The position of this resource on your status page, indexed from zero. If you don't specify a position, we add the resource to the end of the status page. When you specify a positio",
			)
			.optional(),
	}),
	statusPageSectionsGet: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		section_id: z
			.union([z.string(), z.number()])
			.describe('section_id (path parameter)'),
	}),
	statusPageSectionsList: z.object({
		...PAGINATION_INPUT,
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
	}),
	statusPageSectionsUpdate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		section_id: z
			.union([z.string(), z.number()])
			.describe('section_id (path parameter)'),
		name: z
			.string()
			.describe(
				'The name of the section. Leave blank to hide the section header.',
			)
			.optional(),
		position: z
			.number()
			.describe(
				"The position of this resource on your status page, indexed from zero. If you don't specify a position, we add the resource to the end of the status page. When you specify a positio",
			)
			.optional(),
	}),
	statusPageSectionsRemove: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		section_id: z
			.union([z.string(), z.number()])
			.describe('section_id (path parameter)'),
	}),
	statusPageResourcesCreate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_page_section_id: z
			.number()
			.describe(
				'The ID of the section which should contain this resource. When omitted, defaults to the first section on the status page.',
			)
			.optional(),
		widget_type: z
			.string()
			.describe(
				'What widget to display for this resource. Available values:\\n\\n- plain - Only display status.\\n- history - Display historical status.\\n- intraday_history - Display detailed histori',
			)
			.optional(),
		resource_id: z
			.string()
			.describe(
				'The ID of the resource you are adding. Omit or set to null when resource_type is ManuallyTrackedItem.',
			)
			.optional(),
		resource_type: z
			.string()
			.describe(
				'The type of the resource you are adding. Available values: ManuallyTrackedItem, Monitor, MonitorGroup, Heartbeat, HeartbeatGroup, WebhookIntegration, EmailIntegration, IncomingWebh',
			)
			.optional(),
		public_name: z
			.string()
			.describe('The resource name displayed publicly on your status page.')
			.optional(),
		explanation: z
			.string()
			.describe('A detailed text displayed as a help icon.')
			.optional(),
		position: z
			.number()
			.describe(
				"The position of this resource on your status page, indexed from zero. If you don't specify a position, we add the resource to the end of the status page. When you specify a positio",
			)
			.optional(),
		mark_as_down_for: z
			.string()
			.describe(
				'How the resource status is affected when an incident occurs. Possible values: any_incident, no_incident, incident_matching_metadata. Defaults to any_incident.',
			)
			.optional(),
		mark_as_down_metadata_rule: z
			.looseObject({})
			.describe(
				'A rule to match incident metadata. Required when mark_as_down_for is incident_matching_metadata. The rule is a JSON object with key and values fields. See the metadata API response',
			)
			.optional(),
		mark_as_degraded_for: z
			.string()
			.describe(
				'How the resource status is affected when an incident occurs. Possible values: any_incident, no_incident, incident_matching_metadata. Defaults to no_incident.',
			)
			.optional(),
		mark_as_degraded_metadata_rule: z
			.looseObject({})
			.describe(
				'A rule to match incident metadata. Required when mark_as_degraded_for is incident_matching_metadata. The rule is a JSON object with key and values fields. See the metadata API resp',
			)
			.optional(),
		fixed_position: z
			.boolean()
			.describe('If set to true, position reorders will be prevented.')
			.optional(),
	}),
	statusPageResourcesGet: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		resource_id: z
			.union([z.string(), z.number()])
			.describe('resource_id (path parameter)'),
	}),
	statusPageResourcesList: z.object({
		...PAGINATION_INPUT,
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
	}),
	statusPageResourcesUpdate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		resource_id: z
			.union([z.string(), z.number()])
			.describe('resource_id (path parameter)'),
		status_page_section_id: z
			.number()
			.describe(
				'The ID of the section which should contain this resource. When omitted, defaults to the first section on the status page.',
			)
			.optional(),
		widget_type: z
			.string()
			.describe(
				'What widget to display for this resource. Available values:\\n\\n- plain - Only display status.\\n- history - Display historical status.\\n- intraday_history - Display detailed histori',
			)
			.optional(),
		resource_type: z
			.string()
			.describe(
				'The type of the resource you are adding. Available values: ManuallyTrackedItem, Monitor, MonitorGroup, Heartbeat, HeartbeatGroup, WebhookIntegration, EmailIntegration, IncomingWebh',
			)
			.optional(),
		public_name: z
			.string()
			.describe('The resource name displayed publicly on your status page.')
			.optional(),
		explanation: z
			.string()
			.describe('A detailed text displayed as a help icon.')
			.optional(),
		position: z
			.number()
			.describe(
				"The position of this resource on your status page, indexed from zero. If you don't specify a position, we add the resource to the end of the status page. When you specify a positio",
			)
			.optional(),
		mark_as_down_for: z
			.string()
			.describe(
				'How the resource status is affected when an incident occurs. Possible values: any_incident, no_incident, incident_matching_metadata. Defaults to any_incident.',
			)
			.optional(),
		mark_as_down_metadata_rule: z
			.looseObject({})
			.describe(
				'A rule to match incident metadata. Required when mark_as_down_for is incident_matching_metadata. The rule is a JSON object with key and values fields. See the metadata API response',
			)
			.optional(),
		mark_as_degraded_for: z
			.string()
			.describe(
				'How the resource status is affected when an incident occurs. Possible values: any_incident, no_incident, incident_matching_metadata. Defaults to no_incident.',
			)
			.optional(),
		mark_as_degraded_metadata_rule: z
			.looseObject({})
			.describe(
				'A rule to match incident metadata. Required when mark_as_degraded_for is incident_matching_metadata. The rule is a JSON object with key and values fields. See the metadata API resp',
			)
			.optional(),
		fixed_position: z
			.boolean()
			.describe('If set to true, position reorders will be prevented.')
			.optional(),
	}),
	statusPageResourcesRemove: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		resource_id: z
			.union([z.string(), z.number()])
			.describe('resource_id (path parameter)'),
	}),
	statusPageReportsCreate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		title: z
			.string()
			.describe('The title of your new status page report.')
			.optional(),
		message: z
			.string()
			.describe('The first status update message for this report.')
			.optional(),
		report_type: z
			.string()
			.describe(
				'The type of the report to be created. Expects either manual or maintenance. Default: manual',
			)
			.optional(),
		notify_subscribers: z
			.boolean()
			.describe(
				'Whether or not to send a notification email to subscribers of the status page. Default: false',
			)
			.optional(),
		affected_resources: z
			.array(z.looseObject({}))
			.describe(
				'An array of objects, where each object contains status_page_resource_id and status attributes. status_page_resource_id - The ID of the status page resource which you want to affect',
			)
			.optional(),
		published_at: z
			.string()
			.describe(
				'The time that will show as the time that the first status update was published at (formatted in ISO-8601). Default: current time',
			)
			.optional(),
		starts_at: z
			.string()
			.describe(
				'The time when the report comes into effect (formatted in ISO-8601). Default: current time',
			)
			.optional(),
		ends_at: z
			.string()
			.describe(
				'The time when the report ends (formatted in ISO-8601). Only required when report_type is set to maintenance.',
			)
			.optional(),
	}),
	statusPageReportsGet: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_report_id: z
			.union([z.string(), z.number()])
			.describe('status_report_id (path parameter)'),
	}),
	statusPageReportsList: z.object({
		...PAGINATION_INPUT,
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
	}),
	statusPageReportsUpdate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_report_id: z
			.union([z.string(), z.number()])
			.describe('status_report_id (path parameter)'),
		title: z
			.string()
			.describe('The title of your new status page report.')
			.optional(),
		starts_at: z
			.string()
			.describe(
				'The time when the report comes into effect (formatted in ISO-8601). Default: current time',
			)
			.optional(),
		ends_at: z
			.string()
			.describe(
				'The time when the report ends (formatted in ISO-8601). Only required when report_type is set to maintenance.',
			)
			.optional(),
		affected_resources: z
			.array(z.looseObject({}))
			.describe(
				'An array of objects, where each object contains status_page_resource_id and status attributes, only possible to change if report_type is set to maintenance. status_page_resource_id',
			)
			.optional(),
	}),
	statusPageReportsRemove: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_report_id: z
			.union([z.string(), z.number()])
			.describe('status_report_id (path parameter)'),
	}),
	statusUpdatesCreate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_report_id: z
			.union([z.string(), z.number()])
			.describe('status_report_id (path parameter)'),
		message: z
			.string()
			.describe('A message associated with the status update')
			.optional(),
		notify_subscribers: z
			.boolean()
			.describe(
				'Whether or not to send a notification email to subscribers of the status page. Default: false',
			)
			.optional(),
		affected_resources: z
			.array(z.looseObject({}))
			.describe(
				'An array of objects, where each object contains status_page_resource_id and status attributes. status_page_resource_id - The ID of the status page resource which you want to affect',
			),
		published_at: z
			.string()
			.describe(
				'The time that will show as the time that the status update was published at (formatted in ISO-8601). Default: current time',
			)
			.optional(),
	}),
	statusUpdatesGet: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_report_id: z
			.union([z.string(), z.number()])
			.describe('status_report_id (path parameter)'),
		status_update_id: z
			.union([z.string(), z.number()])
			.describe('status_update_id (path parameter)'),
	}),
	statusUpdatesList: z.object({
		...PAGINATION_INPUT,
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_report_id: z
			.union([z.string(), z.number()])
			.describe('status_report_id (path parameter)'),
	}),
	statusUpdatesUpdate: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_report_id: z
			.union([z.string(), z.number()])
			.describe('status_report_id (path parameter)'),
		status_update_id: z
			.union([z.string(), z.number()])
			.describe('status_update_id (path parameter)'),
		message: z
			.string()
			.describe('A message associated with the status update')
			.optional(),
		notify_subscribers: z
			.boolean()
			.describe(
				'Whether or not to send a notification email to subscribers of the status page. Default: false',
			)
			.optional(),
		affected_resources: z
			.array(z.looseObject({}))
			.describe(
				'An array of objects, where each object contains status_page_resource_id and status attributes. status_page_resource_id - The ID of the status page resource which you want to affect',
			)
			.optional(),
		published_at: z
			.string()
			.describe(
				'The time that will show as the time that the status update was published at (formatted in ISO-8601). Default: current time',
			)
			.optional(),
	}),
	statusUpdatesRemove: z.object({
		status_page_id: z
			.union([z.string(), z.number()])
			.describe('status_page_id (path parameter)'),
		status_report_id: z
			.union([z.string(), z.number()])
			.describe('status_report_id (path parameter)'),
		status_update_id: z
			.union([z.string(), z.number()])
			.describe('status_update_id (path parameter)'),
	}),
	statusPageGroupsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using a global API token to specify the team which should own the resource.',
			)
			.optional(),
		name: z
			.string()
			.describe('A name for the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe(
				'Set sort_index to specify how to sort your status page groups.',
			)
			.optional(),
	}),
	statusPageGroupsGet: z.object({
		status_page_group_id: z
			.union([z.string(), z.number()])
			.describe('status_page_group_id (path parameter)'),
	}),
	statusPageGroupsList: z.object({
		...PAGINATION_INPUT,
	}),
	statusPageGroupsUpdate: z.object({
		status_page_group_id: z
			.union([z.string(), z.number()])
			.describe('status_page_group_id (path parameter)'),
		name: z
			.string()
			.describe('A name for the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe(
				'Set sort_index to specify how to sort your status page groups.',
			)
			.optional(),
	}),
	statusPageGroupsRemove: z.object({
		status_page_group_id: z
			.union([z.string(), z.number()])
			.describe('status_page_group_id (path parameter)'),
	}),
	statusPageGroupsStatusPages: z.object({
		...PAGINATION_INPUT,
		status_page_group_id: z
			.union([z.string(), z.number()])
			.describe('status_page_group_id (path parameter)'),
	}),
	metadataCreate: z.object({
		owner_id: z.string().describe('Resource to update metadata for'),
		owner_type: z
			.string()
			.describe(
				'Type of resource to update metadata for. Accepted values: Monitor, Heartbeat, Incident, WebhookIntegration, EmailIntegration, IncomingWebhook, or CallRouting',
			),
		key: z.string().describe('Metadata key'),
		values: z
			.array(z.looseObject({}))
			.describe(
				'Array of metadata values. Existing values for the given key will be replaced. See the list of metadata API parameters for details.',
			),
		mode: z
			.string()
			.describe(
				'How to apply the provided values. Accepted values: replace (default) replaces all existing values for the given key, merge adds the provided values to the existing ones.',
			)
			.optional(),
	}),
	metadataList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter metadata belonging to a specified team when using global API token.',
			)
			.optional(),
		owner_id: z
			.string()
			.describe(
				'Resource to return metadata for. Metadata for all resources will be returned if omitted.',
			)
			.optional(),
		owner_type: z
			.string()
			.describe(
				'Type of resource to return metadata for. Accepted values: Monitor, Heartbeat, Incident, WebhookIntegration, EmailIntegration, IncomingWebhook, or CallRouting.',
			)
			.optional(),
	}),
	outgoingWebhooksCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource.',
			)
			.optional(),
		name: z
			.string()
			.describe(
				'The name of the Outgoing Webhook integration that you can see in the dashboard.',
			)
			.optional(),
		url: z.string().describe('The URL of the Outgoing Webhook integration.'),
		trigger_type: z
			.string()
			.describe(
				'The type of trigger for the Outgoing Webhook integration. Possible values are on_call_change, incident_change and monitor_change.',
			),
		notify_alongside_primary_responder: z
			.boolean()
			.describe(
				'Whether to notify this integration alongside the primary responder when no escalation policy is configured. Only applicable if trigger_type is incident_change. Defaults to true.',
			)
			.optional(),
		on_incident_started: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when an incident starts. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		on_incident_acknowledged: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when an incident is acknowledged. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		on_incident_resolved: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when an incident is resolved. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		on_incident_reopened: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when an incident is reopened. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		on_incident_comment: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when a new comment is added to an incident. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		custom_webhook_template_attributes: z
			.looseObject({})
			.describe(
				'Use this to specify the custom webhook template attributes. See below.',
			)
			.optional(),
	}),
	outgoingWebhooksGet: z.object({
		outgoing_webhook_id: z
			.union([z.string(), z.number()])
			.describe('outgoing_webhook_id (path parameter)'),
	}),
	outgoingWebhooksList: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter outgoing webhooks belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	outgoingWebhooksUpdate: z.object({
		outgoing_webhook_id: z
			.union([z.string(), z.number()])
			.describe('outgoing_webhook_id (path parameter)'),
		name: z
			.string()
			.describe(
				'The name of the Outgoing Webhook integration that you can see in the dashboard.',
			)
			.optional(),
		url: z
			.string()
			.describe('The URL of the Outgoing Webhook integration.')
			.optional(),
		notify_alongside_primary_responder: z
			.boolean()
			.describe(
				'Whether to notify this integration alongside the primary responder when no escalation policy is configured. Only applicable if trigger_type is incident_change. Defaults to true.',
			)
			.optional(),
		on_incident_started: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when an incident starts. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		on_incident_acknowledged: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when an incident is acknowledged. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		on_incident_resolved: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when an incident is resolved. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		on_incident_reopened: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when an incident is reopened. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		on_incident_comment: z
			.boolean()
			.describe(
				'Whether to trigger the Outgoing Webhook integration when a new comment is added to an incident. Only applicable if trigger_type is incident_change.',
			)
			.optional(),
		custom_webhook_template_attributes: z
			.looseObject({})
			.describe(
				'Use this to specify the custom webhook template attributes. See below.',
			)
			.optional(),
	}),
	outgoingWebhooksRemove: z.object({
		outgoing_webhook_id: z
			.union([z.string(), z.number()])
			.describe('outgoing_webhook_id (path parameter)'),
	}),
	sourceGroupsCreate: z.object({
		team_name: z
			.string()
			.describe(
				'Required if using global API token to specify the team which should own the resource',
			)
			.optional(),
		name: z
			.string()
			.describe('The name of the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your source groups.')
			.optional(),
	}),
	sourceGroupsUpdate: z.object({
		source_group_id: z
			.union([z.string(), z.number()])
			.describe('source_group_id (path parameter)'),
		name: z
			.string()
			.describe('The name of the group that you can see in the dashboard.')
			.optional(),
		sort_index: z
			.number()
			.describe('Set sort_index to specify how to sort your source groups.')
			.optional(),
	}),
	sourceGroupsRemove: z.object({
		source_group_id: z
			.union([z.string(), z.number()])
			.describe('source_group_id (path parameter)'),
	}),
	integrationsAwsCloudWatch: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsAzure: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter Azure integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsDatadog: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter Datadog integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsElastic: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter Elastic integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsEmail: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter email integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsGoogleMonitoring: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsGrafana: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsJira: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter Jira integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsNewRelic: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsPagerDuty: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsPrometheus: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsSlack: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter Slack integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	integrationsSplunkOnCall: z.object({
		...PAGINATION_INPUT,
		team_name: z
			.string()
			.describe(
				'Filter integrations belonging to a specified team when using global API token.',
			)
			.optional(),
	}),
	catalogRelations: z.object({
		...PAGINATION_INPUT,
	}),
	tokenDescribe: z.object({}),
} as const;

export const BetterstackEndpointOutputSchemas = {
	monitorsCreate: BetterstackSingleSchema,
	monitorsGet: BetterstackSingleSchema,
	monitorsList: BetterstackListSchema,
	monitorsUpdate: BetterstackSingleSchema,
	monitorsRemove: BetterstackEmptySchema,
	monitorsAvailability: BetterstackSingleSchema,
	monitorsResponseTimes: BetterstackSingleSchema,
	monitorGroupsCreate: BetterstackSingleSchema,
	monitorGroupsGet: BetterstackSingleSchema,
	monitorGroupsList: BetterstackListSchema,
	monitorGroupsUpdate: BetterstackSingleSchema,
	monitorGroupsRemove: BetterstackEmptySchema,
	monitorGroupsMonitors: BetterstackListSchema,
	heartbeatsCreate: BetterstackSingleSchema,
	heartbeatsGet: BetterstackSingleSchema,
	heartbeatsList: BetterstackListSchema,
	heartbeatsUpdate: BetterstackSingleSchema,
	heartbeatsRemove: BetterstackEmptySchema,
	heartbeatsAvailability: BetterstackSingleSchema,
	heartbeatGroupsCreate: BetterstackSingleSchema,
	heartbeatGroupsGet: BetterstackSingleSchema,
	heartbeatGroupsList: BetterstackListSchema,
	heartbeatGroupsUpdate: BetterstackSingleSchema,
	heartbeatGroupsRemove: BetterstackEmptySchema,
	incidentsCreate: BetterstackSingleSchema,
	incidentsGet: BetterstackSingleSchema,
	incidentsList: BetterstackListSchema,
	incidentsRemove: BetterstackEmptySchema,
	incidentsAcknowledge: BetterstackSingleSchema,
	incidentsResolve: BetterstackSingleSchema,
	incidentsEscalate: BetterstackSingleSchema,
	incidentsTimeline: BetterstackListSchema,
	incidentCommentsCreate: BetterstackSingleSchema,
	incidentCommentsGet: BetterstackSingleSchema,
	incidentCommentsList: BetterstackListSchema,
	incidentCommentsUpdate: BetterstackSingleSchema,
	incidentCommentsRemove: BetterstackEmptySchema,
	policiesCreate: BetterstackSingleSchema,
	policiesGet: BetterstackSingleSchema,
	policiesList: BetterstackListSchema,
	policiesUpdate: BetterstackSingleSchema,
	policiesRemove: BetterstackEmptySchema,
	policyGroupsCreate: BetterstackSingleSchema,
	policyGroupsGet: BetterstackSingleSchema,
	policyGroupsList: BetterstackListSchema,
	policyGroupsUpdate: BetterstackSingleSchema,
	policyGroupsRemove: BetterstackEmptySchema,
	onCallsCreate: BetterstackSingleSchema,
	onCallsGet: BetterstackSingleSchema,
	onCallsList: BetterstackListSchema,
	onCallsUpdate: BetterstackSingleSchema,
	onCallsRemove: BetterstackEmptySchema,
	onCallsEvents: BetterstackListSchema,
	urgenciesCreate: BetterstackSingleSchema,
	urgenciesGet: BetterstackSingleSchema,
	urgenciesList: BetterstackListSchema,
	urgenciesUpdate: BetterstackSingleSchema,
	urgenciesRemove: BetterstackEmptySchema,
	urgencyGroupsCreate: BetterstackSingleSchema,
	urgencyGroupsGet: BetterstackSingleSchema,
	urgencyGroupsList: BetterstackListSchema,
	urgencyGroupsUpdate: BetterstackSingleSchema,
	urgencyGroupsRemove: BetterstackEmptySchema,
	statusPagesGet: BetterstackSingleSchema,
	statusPagesList: BetterstackListSchema,
	statusPagesUpdate: BetterstackSingleSchema,
	statusPageSectionsCreate: BetterstackSingleSchema,
	statusPageSectionsGet: BetterstackSingleSchema,
	statusPageSectionsList: BetterstackListSchema,
	statusPageSectionsUpdate: BetterstackSingleSchema,
	statusPageSectionsRemove: BetterstackEmptySchema,
	statusPageResourcesCreate: BetterstackSingleSchema,
	statusPageResourcesGet: BetterstackSingleSchema,
	statusPageResourcesList: BetterstackListSchema,
	statusPageResourcesUpdate: BetterstackSingleSchema,
	statusPageResourcesRemove: BetterstackEmptySchema,
	statusPageReportsCreate: BetterstackSingleSchema,
	statusPageReportsGet: BetterstackSingleSchema,
	statusPageReportsList: BetterstackListSchema,
	statusPageReportsUpdate: BetterstackSingleSchema,
	statusPageReportsRemove: BetterstackEmptySchema,
	statusUpdatesCreate: BetterstackSingleSchema,
	statusUpdatesGet: BetterstackSingleSchema,
	statusUpdatesList: BetterstackListSchema,
	statusUpdatesUpdate: BetterstackSingleSchema,
	statusUpdatesRemove: BetterstackEmptySchema,
	statusPageGroupsCreate: BetterstackSingleSchema,
	statusPageGroupsGet: BetterstackSingleSchema,
	statusPageGroupsList: BetterstackListSchema,
	statusPageGroupsUpdate: BetterstackSingleSchema,
	statusPageGroupsRemove: BetterstackEmptySchema,
	statusPageGroupsStatusPages: BetterstackListSchema,
	metadataCreate: BetterstackSingleSchema,
	metadataList: BetterstackListSchema,
	outgoingWebhooksCreate: BetterstackSingleSchema,
	outgoingWebhooksGet: BetterstackSingleSchema,
	outgoingWebhooksList: BetterstackListSchema,
	outgoingWebhooksUpdate: BetterstackSingleSchema,
	outgoingWebhooksRemove: BetterstackEmptySchema,
	sourceGroupsCreate: BetterstackSingleSchema,
	sourceGroupsUpdate: BetterstackSingleSchema,
	sourceGroupsRemove: BetterstackEmptySchema,
	integrationsAwsCloudWatch: BetterstackListSchema,
	integrationsAzure: BetterstackListSchema,
	integrationsDatadog: BetterstackListSchema,
	integrationsElastic: BetterstackListSchema,
	integrationsEmail: BetterstackListSchema,
	integrationsGoogleMonitoring: BetterstackListSchema,
	integrationsGrafana: BetterstackListSchema,
	integrationsJira: BetterstackListSchema,
	integrationsNewRelic: BetterstackListSchema,
	integrationsPagerDuty: BetterstackListSchema,
	integrationsPrometheus: BetterstackListSchema,
	integrationsSlack: BetterstackListSchema,
	integrationsSplunkOnCall: BetterstackListSchema,
	catalogRelations: BetterstackListSchema,
	tokenDescribe: z.object({
		configured: z.boolean(),
		token_length: z.number(),
		token_suffix: z.string(),
		scope: z.string(),
	}),
} as const;

export type BetterstackEndpointInputs = {
	[K in keyof typeof BetterstackEndpointInputSchemas]: z.infer<
		(typeof BetterstackEndpointInputSchemas)[K]
	>;
};

export type BetterstackEndpointOutputs = {
	[K in keyof typeof BetterstackEndpointOutputSchemas]: z.infer<
		(typeof BetterstackEndpointOutputSchemas)[K]
	>;
};
