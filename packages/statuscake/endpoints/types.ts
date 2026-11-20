import { z } from 'zod';

/**
 * The field set with the create-only required fields made required, so the
 * TypeScript type and the generated reference show what the API needs on
 * create. Updates keep every field optional.
 */
function requireOnCreate<
	S extends Record<string, z.ZodType>,
	K extends keyof S & string,
>(fields: S, keys: readonly K[]) {
	const out: Record<string, z.ZodType> = { ...fields };
	for (const key of keys) {
		const field = fields[key];
		if (field instanceof z.ZodOptional) {
			const inner = field.unwrap() as z.ZodType;
			out[key] = field.description ? inner.describe(field.description) : inner;
		}
	}
	return out as Omit<S, K> & {
		[P in K]: S[P] extends z.ZodOptional<infer I> ? I : S[P];
	};
}

// Mirrors the official OpenAPI spec (developers.statuscake.com, Redocly
// YAML): inputs keep StatusCake's parameter names, outputs keep the
// documented response shapes with the `{ data, metadata, links }` envelope.
// Outputs are `.loose()` and documented-optional fields nullish, so a field
// StatusCake adds or omits cannot fail a call that has already happened.

const str = z.string().nullish();
const num = z.number().nullish();

/**
 * A check rate: the documented seconds between checks. The spec types these
 * as integer enums, and callers may pass either the number or the string the
 * form encoding ends up with; both are pinned to the feature's documented
 * set (the API rejects others, naming the parameter in `errors`).
 */
function checkRateField(rates: readonly number[], note: string) {
	// Optional: updates send only changed fields, and the create schemas
	// require check_rate via superRefine where the API does.
	return z
		.union([z.number().int(), z.string().min(1)])
		.describe(`Seconds between checks, one of ${rates.join(', ')}. ${note}`)
		.refine((value) => rates.includes(Number(value)), {
			message: `check_rate must be one of ${rates.join(', ')}`,
		})
		.optional();
}

// IDs are strings in every documented model (UptimeTest.id, ContactGroup.id).
const idField = (label: string) =>
	z.string().min(1).describe(`The ${label} ID.`);

const positiveInt = z.number().int().positive();

// Contact group IDs and uptime check IDs are sent as string lists.
const idList = (label: string) =>
	z.array(z.string().min(1)).describe(`List of ${label} IDs.`);

/** Pages `page` (from 1) and `limit`; the guide documents no maximum. */
const PagedInputSchema = z.object({
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The page to return, starting at 1.'),
	limit: positiveInt.optional().describe('The number of results per page.'),
});

const PaginationSchema = z
	.object({
		page: num.describe('The current page of results.'),
		per_page: num.describe('The number of results per page.'),
		page_count: num.describe('The total number of pages.'),
		total_count: num.describe('The total number of results.'),
	})
	.loose();

const LinksSchema = z
	.object({
		self: str.describe('The URL that created the current response document.'),
		next: str.describe(
			'URL of the next window of results; absent on the last page. Its `before` parameter is the point to continue from.',
		),
	})
	.loose();

const UptimeStatusSchema = z.enum(['up', 'down']);

/** The tags filters shared by GET /uptime and GET /heartbeat. */
const TagFilterFields = {
	tags: z
		.array(z.string().min(1))
		.optional()
		.describe('Only checks carrying these tags.'),
	matchany: z
		.boolean()
		.optional()
		.describe(
			'True matches checks carrying any one of the tags rather than all of them.',
		),
};

// ── Shared check fields ───────────────────────────────────────────────────

const TagsField = () =>
	z
		.array(z.string().min(1))
		.optional()
		.describe(
			'List of tags. Sending an empty array clears every tag on an update.',
		);

const ContactGroupsField = () =>
	idList('contact group')
		.optional()
		.describe('Contact groups alerted by this check.');

const HostField = () =>
	z.string().optional().describe('Name of the hosting provider.');

const PausedField = (note: string) =>
	z.boolean().optional().describe(`Whether the check should be run. ${note}`);

// ── Shared response pieces ────────────────────────────────────────────────

export const MonitoringLocationSchema = z
	.object({
		description: str.describe('Server description.'),
		ipv4: str,
		ipv6: str,
		region: str,
		region_code: str,
		status: UptimeStatusSchema.nullish(),
	})
	.loose();

export type StatusCakeMonitoringLocation = z.infer<
	typeof MonitoringLocationSchema
>;

/** The `{ data }` wrapper every single-resource answer uses. */
function singleData<T extends z.ZodType>(schema: T) {
	return z.object({ data: schema });
}

/** A paged list answer: `{ data, metadata }`. */
function pagedList<T extends z.ZodType>(schema: T) {
	return z.object({ data: z.array(schema), metadata: PaginationSchema });
}

/**
 * A record-list answer: `{ data, links }`. `links.next` carries the
 * continuation; `metadata` is documented empty and not exposed.
 */
function recordList<T extends z.ZodType>(schema: T) {
	return z.object({ data: z.array(schema), links: LinksSchema });
}

// ── contact groups ────────────────────────────────────────────────────────

export const ContactGroupSchema = z
	.object({
		id: str.describe('Contact group ID.'),
		name: str,
		email_addresses: z.array(z.string()).nullish(),
		mobile_numbers: z
			.array(z.string())
			.nullish()
			.describe('International format mobile phone numbers.'),
		integrations: z
			.array(z.string())
			.nullish()
			.describe('Configured integration IDs.'),
		ping_url: str.describe('Endpoint pushed with uptime events (HTTP GET).'),
	})
	.loose();

export type StatusCakeContactGroup = z.infer<typeof ContactGroupSchema>;

const ContactGroupFields = {
	// Optional here so updates accept partial changes; the create schema
	// requires it via superRefine.
	name: z.string().min(1).optional().describe('Name of the contact group.'),
	email_addresses: z
		.array(z.string().min(1))
		.optional()
		.describe('List of email addresses. Sending an empty array clears them.'),
	mobile_numbers: z
		.array(z.string().min(1))
		.optional()
		.describe(
			'International format mobile numbers. Sending an empty array clears them.',
		),
	integrations: z
		.array(z.string().min(1))
		.optional()
		.describe('Integration IDs. Sending an empty array clears them.'),
	ping_url: z
		.string()
		.optional()
		.describe('HTTP GET endpoint pushed with uptime events.'),
};

const ContactGroupsListInputSchema = PagedInputSchema;

const ContactGroupCreateInputSchema = z.object(
	requireOnCreate(ContactGroupFields, ['name'] as const),
);

const ContactGroupUpdateInputSchema = z.object({
	group_id: idField('contact group'),
	...ContactGroupFields,
});

const ContactGroupGetInputSchema = z.object({
	group_id: idField('contact group'),
});

const ContactGroupDeleteInputSchema = z.object({
	group_id: idField('contact group'),
});

const ContactGroupsListResponseSchema = pagedList(ContactGroupSchema);
const ContactGroupGetResponseSchema = singleData(ContactGroupSchema);

const CreateResponseSchema = z.object({
	data: z.object({
		new_id: str.describe('The ID of the new resource.'),
	}),
});

/** PUT and DELETE answer 204 with no body; the endpoint shapes the result. */
const UpdatedResponseSchema = z.object({
	success: z.literal(true),
	id: z.string(),
});

// ── heartbeat ─────────────────────────────────────────────────────────────

const HeartbeatStatusValues = ['up', 'down'] as const;

export const HeartbeatTestOverviewSchema = z
	.object({
		id: str.describe('Heartbeat check ID.'),
		name: str,
		url: str.describe('URL of the check.'),
		period: num.describe(
			'Seconds since the last ping before the check is considered down.',
		),
		contact_groups: z.array(z.string()).nullish(),
		paused: z.boolean().nullish(),
		status: UptimeStatusSchema.nullish(),
		tags: z.array(z.string()).nullish(),
		uptime: num.describe('Uptime percentage for the check.'),
	})
	.loose();

export const HeartbeatTestSchema = z
	.object({
		id: str,
		name: str,
		url: str,
		period: num,
		contact_groups: z.array(z.string()).nullish(),
		host: str,
		last_tested_at: str.describe('When the check was last run (RFC3339).'),
		paused: z.boolean().nullish(),
		status: UptimeStatusSchema.nullish(),
		tags: z.array(z.string()).nullish(),
		uptime: num,
	})
	.loose();

export type StatusCakeHeartbeatTest = z.infer<typeof HeartbeatTestSchema>;

const HeartbeatListInputSchema = PagedInputSchema.extend({
	status: UptimeStatusSchema.optional().describe('Only checks in this state.'),
	...TagFilterFields,
	// The spec also lists `nouptime` here without a type or documented
	// effect; unknown keys are stripped, so a caller-passed value is never
	// sent rather than guessed at.
});

const HeartbeatFields = {
	// Optional here so updates accept partial changes; the create schema
	// requires name and period via superRefine.
	name: z.string().min(1).optional().describe('Name of the check.'),
	period: positiveInt
		.optional()
		.describe(
			'Seconds since the last ping before the check is considered down. Defaults to 1800.',
		),
	contact_groups: ContactGroupsField(),
	host: HostField(),
	paused: PausedField('Defaults to false.'),
	tags: TagsField(),
};

const HeartbeatCreateInputSchema = z.object(
	requireOnCreate(HeartbeatFields, ['name', 'period'] as const),
);

const HeartbeatUpdateInputSchema = z.object({
	test_id: idField('heartbeat check'),
	...HeartbeatFields,
});

const HeartbeatGetInputSchema = z.object({
	test_id: idField('heartbeat check'),
});

const HeartbeatDeleteInputSchema = z.object({
	test_id: idField('heartbeat check'),
});

const HeartbeatListResponseSchema = pagedList(HeartbeatTestOverviewSchema);
const HeartbeatGetResponseSchema = singleData(HeartbeatTestSchema);

// ── maintenance windows ───────────────────────────────────────────────────

const MAINTENANCE_STATES = ['active', 'paused', 'pending'] as const;
const REPEAT_INTERVALS = ['never', '1d', '1w', '2w', '1m'] as const;

export const MaintenanceWindowSchema = z
	.object({
		id: str.describe('Maintenance window ID.'),
		name: str,
		start_at: str.describe(
			'Start of the window (RFC3339). Only date and time components are used; the UTC offset is ignored.',
		),
		end_at: str.describe(
			'End of the window (RFC3339). Only date and time components are used; the UTC offset is ignored.',
		),
		timezone: str.describe(
			'Timezone of the window, from the tz database (such as Europe/London).',
		),
		repeat_interval: z.enum(REPEAT_INTERVALS).nullish(),
		state: z.enum(MAINTENANCE_STATES).nullish(),
		tags: z
			.array(z.string())
			.nullish()
			.describe('Tags selecting matching uptime checks.'),
		tests: z
			.array(z.string())
			.nullish()
			.describe('Uptime check IDs explicitly included in the window.'),
	})
	.loose();

export type StatusCakeMaintenanceWindow = z.infer<
	typeof MaintenanceWindowSchema
>;

const MaintenanceWindowsListInputSchema = PagedInputSchema.extend({
	state: z
		.enum(MAINTENANCE_STATES)
		.optional()
		.describe('Only windows in this state.'),
});

const MaintenanceWindowFields = {
	// Optional here so updates accept partial changes; the create schema
	// requires name, start_at, end_at and timezone via superRefine.
	name: z
		.string()
		.min(1)
		.optional()
		.describe('Name of the maintenance window.'),
	start_at: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Start of the window in RFC3339 format; the UTC offset is ignored.',
		),
	end_at: z
		.string()
		.min(1)
		.optional()
		.describe(
			'End of the window in RFC3339 format; the UTC offset is ignored.',
		),
	timezone: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Timezone of the window, from the tz database (such as Europe/London).',
		),
	repeat_interval: z
		.enum(REPEAT_INTERVALS)
		.optional()
		.describe('How often the window repeats. Defaults to never.'),
	tests: idList('uptime check')
		.optional()
		.describe(
			'Uptime checks the window covers. At least one of tests and tags is required on create.',
		),
	tags: TagsField(),
};

const MaintenanceWindowCreateInputSchema = z
	.object(
		requireOnCreate(MaintenanceWindowFields, [
			'name',
			'start_at',
			'end_at',
			'timezone',
		] as const),
	)
	.superRefine((value, ctx) => {
		if (!value.tests?.length && !value.tags?.length) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide tests or tags; a maintenance window must cover at least one of them.',
				path: ['tests'],
			});
		}
	});

const MaintenanceWindowUpdateInputSchema = z.object({
	window_id: idField('maintenance window'),
	...MaintenanceWindowFields,
});

const MaintenanceWindowGetInputSchema = z.object({
	window_id: idField('maintenance window'),
});

const MaintenanceWindowDeleteInputSchema = z.object({
	window_id: idField('maintenance window'),
});

const MaintenanceWindowsListResponseSchema = pagedList(MaintenanceWindowSchema);
const MaintenanceWindowGetResponseSchema = singleData(MaintenanceWindowSchema);

// ── pagespeed ─────────────────────────────────────────────────────────────

const PAGESPEED_CHECK_RATES = [60, 300, 600, 900, 1800, 3600, 86400] as const;
const PAGESPEED_REGIONS = [
	'AU',
	'CA',
	'DE',
	'FR',
	'IN',
	'JP',
	'NL',
	'SG',
	'UK',
	'US',
	'USW',
] as const;
const PAGESPEED_THROTTLING = [
	'NONE',
	'3G_FAST',
	'3G_SLOW',
	'4G',
	'EDGE',
	'GPRS',
] as const;

export const PagespeedTestSchema = z
	.object({
		id: str.describe('Pagespeed check ID.'),
		name: str,
		website_url: str,
		check_rate: num,
		alert_bigger: num.describe(
			'Alert when the page is larger than this many kb; 0 disables.',
		),
		alert_slower: num.describe(
			'Alert when the page loads slower than this many ms; 0 disables.',
		),
		alert_smaller: num.describe(
			'Alert when the page is smaller than this many kb; 0 disables.',
		),
		contact_groups: z.array(z.string()).nullish(),
		location: str.describe('Assigned monitoring location for the check.'),
		paused: z.boolean().nullish(),
		latest_stats: z
			.object({
				filesize: num.describe('Latest recorded filesize (kb).'),
				has_issue: z.boolean().nullish(),
				loadtime: num.describe('Latest recorded loadtime (ms).'),
				latest_issue: str,
				requests: num.describe('Latest recorded request count.'),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type StatusCakePagespeedTest = z.infer<typeof PagespeedTestSchema>;

export const PagespeedHistoryResultSchema = z
	.object({
		created_at: str.describe('Creation time of the result (RFC3339).'),
		filesize: num.describe('Recorded filesize (kb).'),
		har_location: str.describe('Location of the saved HAR file.'),
		loadtime: num.describe('Recorded loadtime (ms).'),
		requests: num.describe('Recorded request count.'),
		throttling: z.enum(PAGESPEED_THROTTLING).nullish(),
	})
	.loose();

export type StatusCakePagespeedHistoryResult = z.infer<
	typeof PagespeedHistoryResultSchema
>;

const PagespeedListInputSchema = PagedInputSchema;

const PagespeedFields = {
	// Optional here so updates accept partial changes; the create schema
	// requires name, website_url and check_rate via superRefine.
	name: z.string().min(1).optional().describe('Name of the check.'),
	website_url: z
		.string()
		.min(1)
		.optional()
		.describe('URL, FQDN, or IP address of the website under test.'),
	check_rate: checkRateField(
		PAGESPEED_CHECK_RATES,
		'Defaults to 300 (5 minutes).',
	),
	region: z
		.enum(PAGESPEED_REGIONS)
		.optional()
		.describe(
			'Region to run the check from, from the pagespeed locations list.',
		),
	alert_bigger: z
		.number()
		.int()
		.optional()
		.describe(
			'Alert when the page is larger than this many kb. Defaults to 0 (disabled).',
		),
	alert_slower: z
		.number()
		.int()
		.optional()
		.describe(
			'Alert when the page loads slower than this many ms. Defaults to 0 (disabled).',
		),
	alert_smaller: z
		.number()
		.int()
		.optional()
		.describe(
			'Alert when the page is smaller than this many kb. Defaults to 0 (disabled).',
		),
	contact_groups: ContactGroupsField(),
	paused: PausedField('Defaults to false.'),
};

const PagespeedCreateInputSchema = z.object(
	requireOnCreate(PagespeedFields, [
		'name',
		'website_url',
		'check_rate',
		'region',
	] as const),
);

const PagespeedUpdateInputSchema = z.object({
	test_id: idField('pagespeed check'),
	...PagespeedFields,
});

const PagespeedGetInputSchema = z.object({
	test_id: idField('pagespeed check'),
});

const PagespeedDeleteInputSchema = z.object({
	test_id: idField('pagespeed check'),
});

const PagespeedHistoryInputSchema = z.object({
	test_id: idField('pagespeed check'),
	limit: positiveInt
		.optional()
		.describe('Maximum number of results; newest first.'),
	before: z
		.number()
		.int()
		.optional()
		.describe('Only results before this Unix timestamp (seconds).'),
	after: z
		.number()
		.int()
		.optional()
		.describe('Only results after this Unix timestamp (seconds).'),
});

const PagespeedListResponseSchema = pagedList(PagespeedTestSchema);
const PagespeedGetResponseSchema = singleData(PagespeedTestSchema);
const PagespeedHistoryResponseSchema = recordList(PagespeedHistoryResultSchema);

// ── ssl ───────────────────────────────────────────────────────────────────

const SSL_CHECK_RATES = [300, 600, 1800, 3600, 86400, 2073600] as const;

export const SSLTestSchema = z
	.object({
		id: str.describe('SSL check ID.'),
		website_url: str,
		check_rate: num,
		alert_at: z
			.array(num)
			.nullish()
			.describe('Days before expiry when alerts are sent.'),
		alert_broken: z.boolean().nullish(),
		alert_expiry: z.boolean().nullish(),
		alert_mixed: z.boolean().nullish(),
		alert_reminder: z.boolean().nullish(),
		certificate_score: num.describe('SSL certificate score (%).'),
		certificate_status: str,
		cipher: str.describe('Cipher suite of the SSL certificate.'),
		cipher_score: num.describe('Cipher strength (%).'),
		contact_groups: z.array(z.string()).nullish(),
		flags: z
			.object({
				follow_redirects: z.boolean().nullish(),
				has_mixed: z.boolean().nullish(),
				has_pfs: z
					.boolean()
					.nullish()
					.describe('Perfect Forward Security enabled.'),
				is_broken: z.boolean().nullish(),
				is_expired: z.boolean().nullish(),
				is_extended: z
					.boolean()
					.nullish()
					.describe('Extended Validation (EV).'),
				is_missing: z.boolean().nullish(),
				is_revoked: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		follow_redirects: z.boolean().nullish(),
		hostname: str,
		last_reminder: num.describe('The last reminder sent (days before expiry).'),
		mixed_content: z
			.array(
				z
					.object({
						src: str.describe('Full path to the content resource.'),
						type: str,
					})
					.loose(),
			)
			.nullish(),
		paused: z.boolean().nullish(),
		updated_at: str.describe(
			'When the SSL certificate was last updated (RFC3339).',
		),
		user_agent: str,
		valid_from: str.describe('Certificate validity start (RFC3339).'),
		valid_until: str.describe('Certificate validity end (RFC3339).'),
	})
	.loose();

export type StatusCakeSSLTest = z.infer<typeof SSLTestSchema>;

const SSLListInputSchema = PagedInputSchema;

const SSLFields = {
	// Optional here so updates accept partial changes; the create schema
	// requires website_url, check_rate and alert_at via superRefine.
	website_url: z
		.string()
		.min(1)
		.optional()
		.describe('URL of the server under test. Must begin with https://.'),
	check_rate: checkRateField(SSL_CHECK_RATES, 'Defaults to 86400 (daily).'),
	alert_at: z
		.array(z.number().int())
		.min(3)
		.max(3)
		.optional()
		.describe(
			'Exactly 3 numbers: the days before expiry when alerts are sent, such as [30, 14, 7].',
		),
	alert_broken: z
		.boolean()
		.optional()
		.describe('Alert when certificate issues are found. Defaults to false.'),
	alert_expiry: z
		.boolean()
		.optional()
		.describe('Alert when the certificate is to expire. Defaults to false.'),
	alert_mixed: z
		.boolean()
		.optional()
		.describe('Alert when mixed content is found. Defaults to false.'),
	alert_reminder: z
		.boolean()
		.optional()
		.describe('Send alert reminders. Defaults to false.'),
	contact_groups: ContactGroupsField(),
	follow_redirects: z.boolean().optional().describe('Defaults to false.'),
	hostname: z
		.string()
		.optional()
		.describe('Hostname of the server under test.'),
	paused: PausedField('Defaults to false.'),
	user_agent: z
		.string()
		.optional()
		.describe('Custom user agent used when testing.'),
};

const SSLCreateInputSchema = z.object(
	requireOnCreate(SSLFields, [
		'website_url',
		'check_rate',
		'alert_at',
	] as const),
);

const SSLUpdateInputSchema = z.object({
	test_id: idField('SSL check'),
	...SSLFields,
});

const SSLGetInputSchema = z.object({
	test_id: idField('SSL check'),
});

const SSLDeleteInputSchema = z.object({
	test_id: idField('SSL check'),
});

const SSLListResponseSchema = pagedList(SSLTestSchema);
const SSLGetResponseSchema = singleData(SSLTestSchema);

// ── uptime ────────────────────────────────────────────────────────────────

const UPTIME_TEST_TYPES = [
	'DNS',
	'HEAD',
	'HTTP',
	'PING',
	'SMTP',
	'SSH',
	'TCP',
] as const;
const UPTIME_CHECK_RATES = [0, 30, 60, 300, 900, 1800, 3600, 86400] as const;

export const UptimeTestOverviewSchema = z
	.object({
		id: str.describe('Uptime check ID.'),
		name: str,
		website_url: str,
		test_type: z.enum(UPTIME_TEST_TYPES).nullish(),
		check_rate: num,
		contact_groups: z.array(z.string()).nullish(),
		paused: z.boolean().nullish(),
		status: UptimeStatusSchema.nullish(),
		tags: z.array(z.string()).nullish(),
		uptime: num.describe('Uptime percentage for the check.'),
	})
	.loose();

export const UptimeTestSchema = z
	.object({
		id: str,
		name: str,
		test_type: z.enum(UPTIME_TEST_TYPES).nullish(),
		website_url: str,
		check_rate: num,
		confirmation: num.describe(
			'Confirmation servers that must agree on downtime before an alert.',
		),
		contact_groups: z.array(z.string()).nullish(),
		custom_header: str.describe('JSON object of headers sent with requests.'),
		dns_ips: z.array(z.string()).nullish(),
		dns_server: str.describe('Nameserver queried for DNS checks.'),
		do_not_find: z.boolean().nullish(),
		enable_ssl_alert: z.boolean().nullish(),
		final_endpoint: str.describe('Where the redirect chain should end.'),
		find_string: str.describe('String looked for in the response.'),
		follow_redirects: z.boolean().nullish(),
		host: str,
		include_header: z.boolean().nullish(),
		last_tested_at: str.describe('When the check was last run (RFC3339).'),
		next_location: str.describe('Location the check will run on next.'),
		paused: z.boolean().nullish(),
		port: num.describe('Destination port for TCP checks.'),
		post_body: str.describe('JSON payload; switches the check to POST.'),
		post_raw: str.describe('Raw HTTP POST string.'),
		processing: z.boolean().nullish(),
		processing_on: str,
		processing_state: z
			.enum(['complete', 'pretest', 'retest', 'up_retest'])
			.nullish(),
		servers: z.array(MonitoringLocationSchema).nullish(),
		status: UptimeStatusSchema.nullish(),
		status_codes: z.array(z.string()).nullish(),
		tags: z.array(z.string()).nullish(),
		timeout: num.describe('Seconds to wait for the first byte.'),
		trigger_rate: num.describe('Minutes to wait before sending an alert.'),
		uptime: num,
		use_jar: z.boolean().nullish(),
		user_agent: str,
	})
	.loose();

export type StatusCakeUptimeTest = z.infer<typeof UptimeTestSchema>;

export const UptimeAlertSchema = z
	.object({
		id: str.describe('Uptime check ID.'),
		status: UptimeStatusSchema.nullish(),
		status_code: num.describe('Status code observed when the alert fired.'),
		triggered_at: str.describe('When the alert was triggered (RFC3339).'),
	})
	.loose();

export type StatusCakeUptimeAlert = z.infer<typeof UptimeAlertSchema>;

export const UptimeHistoryResultSchema = z
	.object({
		created_at: str.describe('Creation time of the result (RFC3339).'),
		location: str.describe('Location the check ran from.'),
		performance: num.describe('Recorded loadtime (ms).'),
		status_code: num,
	})
	.loose();

export type StatusCakeUptimeHistoryResult = z.infer<
	typeof UptimeHistoryResultSchema
>;

export const UptimePeriodSchema = z
	.object({
		created_at: str.describe('When the status period began (RFC3339).'),
		duration: num.describe('Duration of the period (ms).'),
		ended_at: str.describe('When the period ended (RFC3339).'),
		status: UptimeStatusSchema.nullish(),
	})
	.loose();

export type StatusCakeUptimePeriod = z.infer<typeof UptimePeriodSchema>;

const UptimeListInputSchema = PagedInputSchema.extend({
	status: UptimeStatusSchema.optional().describe('Only checks in this state.'),
	...TagFilterFields,
	// The spec also lists `nouptime` here without a type or documented
	// effect; unknown keys are stripped, so a caller-passed value is never
	// sent rather than guessed at.
});

const UptimeFields = {
	// Optional here so updates accept partial changes; the create schema
	// requires name, test_type, website_url and check_rate via superRefine.
	name: z.string().min(1).optional().describe('Name of the check.'),
	test_type: z
		.enum(UPTIME_TEST_TYPES)
		.optional()
		.describe('Kind of check. Required on create.'),
	website_url: z
		.string()
		.min(1)
		.optional()
		.describe('URL, FQDN, or IP address of the server under test.'),
	check_rate: checkRateField(
		UPTIME_CHECK_RATES,
		'0 runs the check only from the regions set in regions.',
	),
	basic_username: z
		.string()
		.optional()
		.describe('Basic authentication username.'),
	basic_password: z
		.string()
		.optional()
		.describe('Basic authentication password.'),
	confirmation: z
		.number()
		.int()
		.optional()
		.describe(
			'Confirmation servers that must agree on downtime. Defaults to 2.',
		),
	contact_groups: ContactGroupsField(),
	custom_header: z
		.string()
		.optional()
		.describe('JSON object of headers to send with requests.'),
	do_not_find: z
		.boolean()
		.optional()
		.describe(
			'Consider the check down when find_string IS present. Defaults to false.',
		),
	dns_ips: z
		.array(z.string().min(1))
		.optional()
		.describe('IP addresses compared against returned DNS records.'),
	dns_server: z
		.string()
		.optional()
		.describe('Nameserver to query for DNS checks.'),
	enable_ssl_alert: z
		.boolean()
		.optional()
		.describe(
			'Alert when the SSL certificate is soon to expire. Defaults to false.',
		),
	final_endpoint: z
		.string()
		.optional()
		.describe('Where the redirect chain should end.'),
	find_string: z
		.string()
		.optional()
		.describe(
			'String to look for in the response; the check is down when absent.',
		),
	follow_redirects: z.boolean().optional().describe('Defaults to false.'),
	host: HostField(),
	include_header: z
		.boolean()
		.optional()
		.describe('Include header content in the string match. Defaults to false.'),
	port: z
		.number()
		.int()
		.optional()
		.describe('Destination port for TCP checks.'),
	post_body: z
		.string()
		.optional()
		.describe('JSON payload; setting it switches the check to POST.'),
	post_raw: z.string().optional().describe('Raw HTTP POST string to send.'),
	regions: z
		.array(z.string().min(1))
		.optional()
		.describe(
			'Region codes to run the check from, from the uptime locations list.',
		),
	paused: PausedField('Defaults to false.'),
	status_codes_csv: z
		.string()
		.optional()
		.describe(
			'Comma separated status codes that trigger an alert, such as "200,301".',
		),
	tags: TagsField(),
	timeout: z
		.number()
		.int()
		.optional()
		.describe('Seconds to wait for the first byte. Defaults to 15.'),
	trigger_rate: z
		.number()
		.int()
		.optional()
		.describe('Minutes to wait before sending an alert. Defaults to 0.'),
	use_jar: z
		.boolean()
		.optional()
		.describe('Enable cookie storage. Defaults to false.'),
	user_agent: z
		.string()
		.optional()
		.describe('Custom user agent used when testing.'),
};

const UptimeCreateInputSchema = z.object(
	requireOnCreate(UptimeFields, [
		'name',
		'test_type',
		'website_url',
		'check_rate',
	] as const),
);

// The API can't change a check's type after create (the update endpoint has
// no test_type parameter), so updates don't offer it.
const { test_type: _createOnlyTestType, ...UptimeUpdateFields } = UptimeFields;

const UptimeUpdateInputSchema = z.object({
	test_id: idField('uptime check'),
	...UptimeUpdateFields,
});

const UptimeGetInputSchema = z.object({
	test_id: idField('uptime check'),
});

const UptimeDeleteInputSchema = z.object({
	test_id: idField('uptime check'),
});

const RecordWindowInputSchema = (label: string) =>
	z.object({
		test_id: idField(label),
		limit: positiveInt
			.optional()
			.describe('Maximum number of results; newest first.'),
		before: z
			.number()
			.int()
			.optional()
			.describe('Only results before this Unix timestamp (seconds).'),
		after: z
			.number()
			.int()
			.optional()
			.describe('Only results after this Unix timestamp (seconds).'),
	});

const UptimeAlertsInputSchema = RecordWindowInputSchema('uptime check');
const UptimeHistoryInputSchema = RecordWindowInputSchema('uptime check');
const UptimePeriodsInputSchema = RecordWindowInputSchema('uptime check');

const UptimeListResponseSchema = pagedList(UptimeTestOverviewSchema);
const UptimeGetResponseSchema = singleData(UptimeTestSchema);
const UptimeAlertsResponseSchema = recordList(UptimeAlertSchema);
const UptimeHistoryResponseSchema = recordList(UptimeHistoryResultSchema);
const UptimePeriodsResponseSchema = recordList(UptimePeriodSchema);

// ── locations ─────────────────────────────────────────────────────────────

const UptimeLocationsInputSchema = z.object({
	region_code: z
		.string()
		.optional()
		.describe('Only the location with this region code.'),
});

const PagespeedLocationsInputSchema = z.object({
	location: z
		.string()
		.optional()
		.describe('Only the location matching this value.'),
});

const LocationsListResponseSchema = z.object({
	data: z.array(MonitoringLocationSchema),
});

// ── Registry ──────────────────────────────────────────────────────────────

export type StatusCakeEndpointInputs = {
	contactGroupsList: z.input<typeof ContactGroupsListInputSchema>;
	contactGroupsCreate: z.input<typeof ContactGroupCreateInputSchema>;
	contactGroupsGet: z.input<typeof ContactGroupGetInputSchema>;
	contactGroupsUpdate: z.input<typeof ContactGroupUpdateInputSchema>;
	contactGroupsDelete: z.input<typeof ContactGroupDeleteInputSchema>;
	heartbeatList: z.input<typeof HeartbeatListInputSchema>;
	heartbeatCreate: z.input<typeof HeartbeatCreateInputSchema>;
	heartbeatGet: z.input<typeof HeartbeatGetInputSchema>;
	heartbeatUpdate: z.input<typeof HeartbeatUpdateInputSchema>;
	heartbeatDelete: z.input<typeof HeartbeatDeleteInputSchema>;
	maintenanceWindowsList: z.input<typeof MaintenanceWindowsListInputSchema>;
	maintenanceWindowsCreate: z.input<typeof MaintenanceWindowCreateInputSchema>;
	maintenanceWindowsGet: z.input<typeof MaintenanceWindowGetInputSchema>;
	maintenanceWindowsUpdate: z.input<typeof MaintenanceWindowUpdateInputSchema>;
	maintenanceWindowsDelete: z.input<typeof MaintenanceWindowDeleteInputSchema>;
	pagespeedList: z.input<typeof PagespeedListInputSchema>;
	pagespeedCreate: z.input<typeof PagespeedCreateInputSchema>;
	pagespeedGet: z.input<typeof PagespeedGetInputSchema>;
	pagespeedUpdate: z.input<typeof PagespeedUpdateInputSchema>;
	pagespeedDelete: z.input<typeof PagespeedDeleteInputSchema>;
	pagespeedHistory: z.input<typeof PagespeedHistoryInputSchema>;
	sslList: z.input<typeof SSLListInputSchema>;
	sslCreate: z.input<typeof SSLCreateInputSchema>;
	sslGet: z.input<typeof SSLGetInputSchema>;
	sslUpdate: z.input<typeof SSLUpdateInputSchema>;
	sslDelete: z.input<typeof SSLDeleteInputSchema>;
	uptimeList: z.input<typeof UptimeListInputSchema>;
	uptimeCreate: z.input<typeof UptimeCreateInputSchema>;
	uptimeGet: z.input<typeof UptimeGetInputSchema>;
	uptimeUpdate: z.input<typeof UptimeUpdateInputSchema>;
	uptimeDelete: z.input<typeof UptimeDeleteInputSchema>;
	uptimeAlerts: z.input<typeof UptimeAlertsInputSchema>;
	uptimeHistory: z.input<typeof UptimeHistoryInputSchema>;
	uptimePeriods: z.input<typeof UptimePeriodsInputSchema>;
	uptimeLocations: z.input<typeof UptimeLocationsInputSchema>;
	pagespeedLocations: z.input<typeof PagespeedLocationsInputSchema>;
};

export type StatusCakeEndpointOutputs = {
	contactGroupsList: z.infer<typeof ContactGroupsListResponseSchema>;
	contactGroupsCreate: z.infer<typeof CreateResponseSchema>;
	contactGroupsGet: z.infer<typeof ContactGroupGetResponseSchema>;
	contactGroupsUpdate: z.infer<typeof UpdatedResponseSchema>;
	contactGroupsDelete: z.infer<typeof UpdatedResponseSchema>;
	heartbeatList: z.infer<typeof HeartbeatListResponseSchema>;
	heartbeatCreate: z.infer<typeof CreateResponseSchema>;
	heartbeatGet: z.infer<typeof HeartbeatGetResponseSchema>;
	heartbeatUpdate: z.infer<typeof UpdatedResponseSchema>;
	heartbeatDelete: z.infer<typeof UpdatedResponseSchema>;
	maintenanceWindowsList: z.infer<typeof MaintenanceWindowsListResponseSchema>;
	maintenanceWindowsCreate: z.infer<typeof CreateResponseSchema>;
	maintenanceWindowsGet: z.infer<typeof MaintenanceWindowGetResponseSchema>;
	maintenanceWindowsUpdate: z.infer<typeof UpdatedResponseSchema>;
	maintenanceWindowsDelete: z.infer<typeof UpdatedResponseSchema>;
	pagespeedList: z.infer<typeof PagespeedListResponseSchema>;
	pagespeedCreate: z.infer<typeof CreateResponseSchema>;
	pagespeedGet: z.infer<typeof PagespeedGetResponseSchema>;
	pagespeedUpdate: z.infer<typeof UpdatedResponseSchema>;
	pagespeedDelete: z.infer<typeof UpdatedResponseSchema>;
	pagespeedHistory: z.infer<typeof PagespeedHistoryResponseSchema>;
	sslList: z.infer<typeof SSLListResponseSchema>;
	sslCreate: z.infer<typeof CreateResponseSchema>;
	sslGet: z.infer<typeof SSLGetResponseSchema>;
	sslUpdate: z.infer<typeof UpdatedResponseSchema>;
	sslDelete: z.infer<typeof UpdatedResponseSchema>;
	uptimeList: z.infer<typeof UptimeListResponseSchema>;
	uptimeCreate: z.infer<typeof CreateResponseSchema>;
	uptimeGet: z.infer<typeof UptimeGetResponseSchema>;
	uptimeUpdate: z.infer<typeof UpdatedResponseSchema>;
	uptimeDelete: z.infer<typeof UpdatedResponseSchema>;
	uptimeAlerts: z.infer<typeof UptimeAlertsResponseSchema>;
	uptimeHistory: z.infer<typeof UptimeHistoryResponseSchema>;
	uptimePeriods: z.infer<typeof UptimePeriodsResponseSchema>;
	uptimeLocations: z.infer<typeof LocationsListResponseSchema>;
	pagespeedLocations: z.infer<typeof LocationsListResponseSchema>;
};

export const StatusCakeEndpointInputSchemas = {
	contactGroupsList: ContactGroupsListInputSchema,
	contactGroupsCreate: ContactGroupCreateInputSchema,
	contactGroupsGet: ContactGroupGetInputSchema,
	contactGroupsUpdate: ContactGroupUpdateInputSchema,
	contactGroupsDelete: ContactGroupDeleteInputSchema,
	heartbeatList: HeartbeatListInputSchema,
	heartbeatCreate: HeartbeatCreateInputSchema,
	heartbeatGet: HeartbeatGetInputSchema,
	heartbeatUpdate: HeartbeatUpdateInputSchema,
	heartbeatDelete: HeartbeatDeleteInputSchema,
	maintenanceWindowsList: MaintenanceWindowsListInputSchema,
	maintenanceWindowsCreate: MaintenanceWindowCreateInputSchema,
	maintenanceWindowsGet: MaintenanceWindowGetInputSchema,
	maintenanceWindowsUpdate: MaintenanceWindowUpdateInputSchema,
	maintenanceWindowsDelete: MaintenanceWindowDeleteInputSchema,
	pagespeedList: PagespeedListInputSchema,
	pagespeedCreate: PagespeedCreateInputSchema,
	pagespeedGet: PagespeedGetInputSchema,
	pagespeedUpdate: PagespeedUpdateInputSchema,
	pagespeedDelete: PagespeedDeleteInputSchema,
	pagespeedHistory: PagespeedHistoryInputSchema,
	sslList: SSLListInputSchema,
	sslCreate: SSLCreateInputSchema,
	sslGet: SSLGetInputSchema,
	sslUpdate: SSLUpdateInputSchema,
	sslDelete: SSLDeleteInputSchema,
	uptimeList: UptimeListInputSchema,
	uptimeCreate: UptimeCreateInputSchema,
	uptimeGet: UptimeGetInputSchema,
	uptimeUpdate: UptimeUpdateInputSchema,
	uptimeDelete: UptimeDeleteInputSchema,
	uptimeAlerts: UptimeAlertsInputSchema,
	uptimeHistory: UptimeHistoryInputSchema,
	uptimePeriods: UptimePeriodsInputSchema,
	uptimeLocations: UptimeLocationsInputSchema,
	pagespeedLocations: PagespeedLocationsInputSchema,
} as const;

export const StatusCakeEndpointOutputSchemas = {
	contactGroupsList: ContactGroupsListResponseSchema,
	contactGroupsCreate: CreateResponseSchema,
	contactGroupsGet: ContactGroupGetResponseSchema,
	contactGroupsUpdate: UpdatedResponseSchema,
	contactGroupsDelete: UpdatedResponseSchema,
	heartbeatList: HeartbeatListResponseSchema,
	heartbeatCreate: CreateResponseSchema,
	heartbeatGet: HeartbeatGetResponseSchema,
	heartbeatUpdate: UpdatedResponseSchema,
	heartbeatDelete: UpdatedResponseSchema,
	maintenanceWindowsList: MaintenanceWindowsListResponseSchema,
	maintenanceWindowsCreate: CreateResponseSchema,
	maintenanceWindowsGet: MaintenanceWindowGetResponseSchema,
	maintenanceWindowsUpdate: UpdatedResponseSchema,
	maintenanceWindowsDelete: UpdatedResponseSchema,
	pagespeedList: PagespeedListResponseSchema,
	pagespeedCreate: CreateResponseSchema,
	pagespeedGet: PagespeedGetResponseSchema,
	pagespeedUpdate: UpdatedResponseSchema,
	pagespeedDelete: UpdatedResponseSchema,
	pagespeedHistory: PagespeedHistoryResponseSchema,
	sslList: SSLListResponseSchema,
	sslCreate: CreateResponseSchema,
	sslGet: SSLGetResponseSchema,
	sslUpdate: UpdatedResponseSchema,
	sslDelete: UpdatedResponseSchema,
	uptimeList: UptimeListResponseSchema,
	uptimeCreate: CreateResponseSchema,
	uptimeGet: UptimeGetResponseSchema,
	uptimeUpdate: UpdatedResponseSchema,
	uptimeDelete: UpdatedResponseSchema,
	uptimeAlerts: UptimeAlertsResponseSchema,
	uptimeHistory: UptimeHistoryResponseSchema,
	uptimePeriods: UptimePeriodsResponseSchema,
	uptimeLocations: LocationsListResponseSchema,
	pagespeedLocations: LocationsListResponseSchema,
} as const;
