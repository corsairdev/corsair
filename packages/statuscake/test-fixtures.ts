// Response bodies built from the official OpenAPI spec
// (developers.statuscake.com, plugin-redoc-0.yaml) and the guides' examples,
// with made-up hosts and values. Not captured from the live API: every
// unauthenticated probe is denied by the gateway before a body comes back.

export const pagination = {
	page: 1,
	per_page: 25,
	page_count: 4,
	total_count: 87,
};

export const contactGroup = {
	id: '123',
	name: 'DevOps',
	email_addresses: ['oncall@example.com'],
	mobile_numbers: ['+441234567890'],
	integrations: [],
	ping_url: '',
};

export const contactGroupsList = {
	data: [contactGroup],
	metadata: pagination,
};

export const newId = { data: { new_id: '987654' } };

export const heartbeatOverview = {
	id: '123456',
	name: 'nightly backup',
	url: 'https://statuscake.example/heartbeat/abc',
	period: 86400,
	contact_groups: ['123'],
	paused: false,
	status: 'up',
	tags: ['batch'],
	uptime: 99.95,
};

export const heartbeatList = {
	data: [heartbeatOverview],
	metadata: pagination,
};

export const heartbeat = {
	...heartbeatOverview,
	host: 'AWS',
	last_tested_at: '2026-11-01T03:04:05.060+00:00',
};

export const maintenanceWindow = {
	id: '42',
	name: 'deploy window',
	start_at: '2026-12-01T02:00:00.000+00:00',
	end_at: '2026-12-01T04:00:00.000+00:00',
	timezone: 'Europe/London',
	repeat_interval: 'never',
	state: 'pending',
	tags: [],
	tests: ['123456'],
};

export const maintenanceWindowsList = {
	data: [maintenanceWindow],
	metadata: pagination,
};

export const pagespeedTest = {
	id: '123456',
	name: 'marketing site',
	website_url: 'https://www.example.com',
	check_rate: 3600,
	alert_bigger: 0,
	alert_slower: 3000,
	alert_smaller: 0,
	contact_groups: ['123'],
	location: 'uk-london',
	paused: false,
	latest_stats: {
		filesize: 512.4,
		has_issue: false,
		loadtime: 743,
		requests: 42,
	},
};

export const pagespeedList = {
	data: [pagespeedTest],
	metadata: pagination,
};

export const pagespeedHistoryPage = {
	data: [
		{
			created_at: '2026-11-01T00:00:00.000+00:00',
			filesize: 512.4,
			har_location: 'https://har.example/abc.har',
			loadtime: 743,
			requests: 42,
			throttling: 'NONE',
		},
	],
	links: {
		self: 'https://api.statuscake.com/v1/pagespeed/123456/history?limit=100',
		next: 'https://api.statuscake.com/v1/pagespeed/123456/history?limit=100&before=1792000000',
	},
};

export const sslTest = {
	id: '123456',
	website_url: 'https://www.example.com',
	check_rate: 86400,
	alert_at: [30, 14, 7],
	alert_broken: false,
	alert_expiry: true,
	alert_mixed: false,
	alert_reminder: false,
	certificate_score: 90,
	certificate_status: 'Trusted',
	cipher: 'TLS_AES_128_GCM_SHA256',
	cipher_score: 90,
	contact_groups: ['123'],
	flags: {
		follow_redirects: false,
		has_mixed: false,
		has_pfs: true,
		is_broken: false,
		is_expired: false,
		is_extended: false,
		is_missing: false,
		is_revoked: false,
	},
	follow_redirects: false,
	hostname: 'www.example.com',
	last_reminder: 0,
	mixed_content: [],
	paused: false,
	updated_at: '2026-10-01T00:00:00.000+00:00',
	user_agent: '',
	valid_from: '2026-09-01T00:00:00.000+00:00',
	valid_until: '2027-09-01T00:00:00.000+00:00',
};

export const sslList = {
	data: [sslTest],
	metadata: pagination,
};

export const uptimeOverview = {
	id: '123456',
	name: 'statuscake.com',
	website_url: 'https://www.statuscake.com',
	test_type: 'HTTP',
	check_rate: 300,
	contact_groups: ['123'],
	paused: false,
	status: 'up',
	tags: ['production'],
	uptime: 99.98,
};

export const uptimeList = {
	data: [uptimeOverview],
	metadata: pagination,
};

export const uptime = {
	...uptimeOverview,
	confirmation: 2,
	custom_header: '',
	dns_ips: [],
	dns_server: '',
	do_not_find: false,
	enable_ssl_alert: false,
	final_endpoint: '',
	find_string: '',
	follow_redirects: false,
	host: '',
	include_header: false,
	last_tested_at: '2026-11-01T03:04:05.060+00:00',
	next_location: 'uk-london',
	port: 443,
	post_body: '',
	post_raw: '',
	processing: false,
	processing_on: '',
	processing_state: 'complete',
	servers: [
		{
			description: 'London',
			ipv4: '192.0.2.10',
			ipv6: '',
			region: 'uk-london',
			region_code: 'UK',
			status: 'up',
		},
	],
	status_codes: ['200'],
	timeout: 15,
	trigger_rate: 0,
	use_jar: false,
	user_agent: '',
};

export const uptimeAlertsPage = {
	data: [
		{
			id: '123456',
			status: 'down',
			status_code: 500,
			triggered_at: '2026-10-30T12:00:00.000+00:00',
		},
	],
	links: {
		self: 'https://api.statuscake.com/v1/uptime/123456/alerts?limit=100',
	},
};

export const uptimeHistoryPage = {
	data: [
		{
			created_at: '2026-10-30T12:00:00.000+00:00',
			location: 'uk-london',
			performance: 743,
			status_code: 200,
		},
	],
	links: {
		self: 'https://api.statuscake.com/v1/uptime/123456/history?limit=100',
		next: 'https://api.statuscake.com/v1/uptime/123456/history?limit=100&before=1792000000',
	},
};

export const uptimePeriodsPage = {
	data: [
		{
			created_at: '2026-10-30T12:00:00.000+00:00',
			duration: 120000,
			ended_at: '2026-10-30T12:02:00.000+00:00',
			status: 'down',
		},
	],
	links: {
		self: 'https://api.statuscake.com/v1/uptime/123456/periods?limit=100',
	},
};

export const locations = {
	data: [
		{
			description: 'London',
			ipv4: '192.0.2.10',
			ipv6: '',
			region: 'uk-london',
			region_code: 'UK',
			status: 'up',
		},
	],
};

// Error bodies.
export const validationError = {
	message: 'The request could not be processed',
	errors: {
		check_rate: ['must be one of 0, 30, 60, 300, 900, 1800, 3600, 86400'],
	},
};
