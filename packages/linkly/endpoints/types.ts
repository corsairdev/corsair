import { z } from 'zod';

// Field reference: the OpenAPI 3.0 spec at https://api.linklyhq.com/api/openapi
// (info.version 1.4). Inputs use Linkly's own parameter names. Outputs are
// `.loose()` and their optional fields nullish, so a field Linkly adds or
// omits cannot fail a call that has already happened.

const WorkspaceIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		'The workspace that owns the links. Find IDs with workspaces.listWorkspaces.',
	);

// ── shared link shapes ──────────────────────────────────────────────────────

const RuleSchema = z
	.object({
		matches: z.string().nullish(),
		percentage: z.number().int().nullish(),
		url: z.string().nullish(),
		what: z.string().nullish(),
	})
	.loose();

// Request-side rules carry `percentage` as a string in the spec, and add
// `rule_url`; the response schema above is what Linkly sends back.
const RuleInputSchema = z.object({
	url: z.string().min(1).describe('Destination for clicks the rule matches.'),
	matches: z.string().optional().describe('Pattern the click must match.'),
	what: z.string().optional().describe('What the rule matches, e.g. country.'),
	percentage: z.string().optional().describe('Split percentage for rotator rules.'),
	rule_url: z.string().optional(),
});

export const LinklyLinkSchema = z
	.object({
		id: z.number().int(),
		url: z.string(),
		full_url: z.string().describe('The public short URL, e.g. https://l.linklyhq.com/l/2TQ.'),
		workspace_id: z.number().int(),
		name: z.string().nullish(),
		note: z.string().nullish(),
		domain: z.string().nullish(),
		slug: z.string().nullish(),
		enabled: z.boolean().nullish(),
		deleted: z.boolean().nullish(),
		password: z.string().nullish(),
		cloaking: z.boolean().nullish(),
		forward_params: z.boolean().nullish(),
		hide_referrer: z.boolean().nullish(),
		block_bots: z.boolean().nullish(),
		skip_social_crawler_tracking: z.boolean().nullish(),
		public_analytics: z.boolean().nullish(),
		privacy_mode: z.boolean().nullish(),
		sticky_rotator: z.boolean().nullish(),
		head_tags: z.string().nullish(),
		body_tags: z.string().nullish(),
		linkify_words: z.string().nullish(),
		replacements: z.string().nullish(),
		utm_source: z.string().nullish(),
		utm_medium: z.string().nullish(),
		utm_campaign: z.string().nullish(),
		utm_term: z.string().nullish(),
		utm_content: z.string().nullish(),
		og_title: z.string().nullish(),
		og_description: z.string().nullish(),
		og_image: z.string().nullish(),
		fb_pixel_id: z.string().nullish(),
		tiktok_pixel_id: z.string().nullish(),
		ga4_tag_id: z.string().nullish(),
		gtm_id: z.string().nullish(),
		expiry_datetime: z.string().nullish(),
		expiry_destination: z.string().nullish(),
		expiry_clicks: z.number().int().nullish(),
		rules: z.array(RuleSchema).nullish(),
		webhooks: z.array(z.string()).nullish(),
		notify_user_ids: z.array(z.number().int()).nullish(),
		notify_slack: z.boolean().nullish(),
		// unknown: QR style settings, passed through as Linkly sends them.
		qr_styles: z.record(z.string(), z.unknown()).nullish(),
		metadata: z.record(z.string(), z.string()).nullish(),
		created_by_user_id: z.number().int().nullish(),
	})
	.loose();

export type LinklyLink = z.infer<typeof LinklyLinkSchema>;

const WorkspaceLinkSchema = z
	.object({
		id: z.number().int().nullish(),
		url: z.string(),
		full_url: z.string().describe('The public short URL.'),
		workspace_id: z.number().int().nullish(),
		name: z.string().nullish(),
		note: z.string().nullish(),
		domain: z.string().nullish(),
		slug: z.string().nullish(),
		enabled: z.boolean().nullish(),
		deleted: z.boolean().nullish(),
		cloaking: z.boolean().nullish(),
		forward_params: z.boolean().nullish(),
		hide_referrer: z.boolean().nullish(),
		block_bots: z.boolean().nullish(),
		public_analytics: z.boolean().nullish(),
		head_tags: z.string().nullish(),
		body_tags: z.string().nullish(),
		linkify_words: z.string().nullish(),
		replacements: z.string().nullish(),
		utm_source: z.string().nullish(),
		utm_medium: z.string().nullish(),
		utm_campaign: z.string().nullish(),
		utm_term: z.string().nullish(),
		utm_content: z.string().nullish(),
		og_title: z.string().nullish(),
		og_description: z.string().nullish(),
		og_image: z.string().nullish(),
		fb_pixel_id: z.string().nullish(),
		tiktok_pixel_id: z.string().nullish(),
		ga4_tag_id: z.string().nullish(),
		gtm_id: z.string().nullish(),
		rules: z.array(RuleSchema).nullish(),
		metadata: z.record(z.string(), z.string()).nullish(),
		clicks_total: z.number().int().nullish(),
		clicks_today: z.number().int().nullish(),
		clicks_thirty_days: z.number().int().nullish(),
		human_clicks_total: z.number().int().nullish(),
		human_clicks_today: z.number().int().nullish(),
		human_clicks_thirty_days: z.number().int().nullish(),
		human_clicks_previous_day: z.number().int().nullish(),
		sparkline: z.array(z.number().int()).nullish(),
	})
	.loose();

export type LinklyWorkspaceLink = z.infer<typeof WorkspaceLinkSchema>;

// ── workspaces.listWorkspaces ───────────────────────────────────────────────

const WorkspacesListWorkspacesInputSchema = z.object({});

export type WorkspacesListWorkspacesInput = z.infer<
	typeof WorkspacesListWorkspacesInputSchema
>;

const WorkspaceSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
	})
	.loose();

const WorkspacesListWorkspacesResponseSchema = z.array(WorkspaceSchema);

export type WorkspacesListWorkspacesResponse = z.infer<
	typeof WorkspacesListWorkspacesResponseSchema
>;

// ── links.list ──────────────────────────────────────────────────────────────
// The spec also documents a `filter` query object; it is not exposed here
// because no doc or example shows how an object serialises into this query,
// and a guessed encoding would silently return unfiltered pages.

const LinksListInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	search: z
		.string()
		.optional()
		.describe('Match link names, URLs, slugs and notes.'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('1-based page. Defaults to 1.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Rows per page. Defaults to 1000.'),
	sort_by: z
		.string()
		.optional()
		.describe("Column to sort, e.g. 'clicks_total' or 'created_at'."),
	sort_dir: z
		.enum(['desc', 'asc'])
		.optional()
		.describe("Sort direction. Defaults to 'desc'."),
	deleted: z
		.boolean()
		.optional()
		.describe('Set true to page through the trash instead of live links.'),
});

export type LinksListInput = z.infer<typeof LinksListInputSchema>;

const LinksListResponseSchema = z
	.object({
		links: z.array(WorkspaceLinkSchema),
		page_number: z.number().int(),
		page_size: z.number().int(),
		total_entries: z.number().int(),
		total_pages: z.number().int(),
		total_rows: z.number().int().nullish(),
		workspace_link_count: z.number().int(),
	})
	.loose();

export type LinksListResponse = z.infer<typeof LinksListResponseSchema>;

// ── links.get ───────────────────────────────────────────────────────────────

const LinksGetInputSchema = z.object({
	// The spec types this path segment as a string; every response carries a
	// numeric `id`, so both spellings are accepted.
	id: z.union([z.string().min(1), z.number().int().positive()]),
	workspace_id: WorkspaceIdSchema.optional().describe(
		'Optional. The workspace the link belongs to.',
	),
});

export type LinksGetInput = z.infer<typeof LinksGetInputSchema>;

const LinksGetResponseSchema = LinklyLinkSchema;

export type LinksGetResponse = z.infer<typeof LinksGetResponseSchema>;

// ── links.create / links.update ─────────────────────────────────────────────
// One endpoint, POST /api/v1/link: creating inserts, and sending `id`
// updates that link in place, so both operations share the field set.

const linkWriteFields = {
	name: z.string().optional().describe('Display name, shown in the dashboard.'),
	note: z.string().optional(),
	domain: z
		.string()
		.optional()
		.describe(
			'A custom domain attached to the workspace, e.g. go.yourcompany.com. List them with domains.list.',
		),
	slug: z
		.string()
		.optional()
		.describe('The back-half of the short URL. Auto-generated when omitted.'),
	enabled: z.boolean().optional().describe('Defaults to true.'),
	deleted: z.boolean().optional(),
	cloaking: z.boolean().optional(),
	forward_params: z.boolean().optional(),
	hide_referrer: z.boolean().optional(),
	block_bots: z.boolean().optional(),
	head_tags: z.string().optional().describe('HTML injected into <head> on the cloaking page.'),
	body_tags: z.string().optional().describe('HTML injected into <body> on the cloaking page.'),
	linkify_words: z.string().optional(),
	replacements: z.string().optional(),
	utm_source: z.string().optional(),
	utm_medium: z.string().optional(),
	utm_campaign: z.string().optional(),
	utm_term: z.string().optional(),
	utm_content: z.string().optional(),
	og_title: z.string().optional(),
	og_description: z.string().optional(),
	og_image: z.string().optional(),
	fb_pixel_id: z.string().optional(),
	tiktok_pixel_id: z.string().optional(),
	ga4_tag_id: z.string().optional(),
	gtm_id: z.string().optional(),
	expiry_datetime: z
		.string()
		.optional()
		.describe(
			'ISO 8601 instant, e.g. 2026-12-31T23:59:59Z. After this time visitors go to expiry_destination. The year must be between 2000 and 2100.',
		),
	expiry_destination: z
		.string()
		.startsWith('http')
		.optional()
		.describe('Where visitors go once the link has expired. Must start with http.'),
	expiry_clicks: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Expire the link after this many clicks.'),
	rules: z
		.array(RuleInputSchema)
		.optional()
		.describe(
			"Click routing rules, e.g. send matches to another URL or split traffic. Only sent as JSON.",
		),
};

const LinksCreateInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	url: z
		.string()
		.min(1)
		.describe(
			'The destination URL. Required to create.',
		),
	...linkWriteFields,
});

export type LinksCreateInput = z.infer<typeof LinksCreateInputSchema>;

const LinksCreateResponseSchema = LinklyLinkSchema;

export type LinksCreateResponse = z.infer<typeof LinksCreateResponseSchema>;

const LinksUpdateInputSchema = z.object({
	id: z
		.number()
		.int()
		.positive()
		.describe('The link to update. POST /link with an id updates in place.'),
	workspace_id: WorkspaceIdSchema,
	url: z.string().min(1).optional().describe('A new destination URL.'),
	...linkWriteFields,
});

export type LinksUpdateInput = z.infer<typeof LinksUpdateInputSchema>;

const LinksUpdateResponseSchema = LinklyLinkSchema;

export type LinksUpdateResponse = z.infer<typeof LinksUpdateResponseSchema>;

// ── links.delete (soft) ─────────────────────────────────────────────────────

const LinksDeleteInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	id: z.number().int().positive().describe('The link to move to the trash.'),
});

export type LinksDeleteInput = z.infer<typeof LinksDeleteInputSchema>;

// The spec documents a bare string, e.g. "Link deleted.".
const LinksDeleteResponseSchema = z.string();

export type LinksDeleteResponse = z.infer<typeof LinksDeleteResponseSchema>;

// ── links.restore ───────────────────────────────────────────────────────────

const LinksRestoreInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	ids: z
		.array(z.number().int().positive())
		.describe('Link IDs to take out of the trash.'),
});

export type LinksRestoreInput = z.infer<typeof LinksRestoreInputSchema>;

const LinksRestoreResponseSchema = z
	.object({
		restored: z.number().int().nullish(),
		conflicts: z
			.array(
				z
					.object({
						id: z.number().int().nullish(),
						domain: z.string().nullish(),
						slug: z.string().nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe(
				'Restored links whose back-half is already taken on the domain. The conflict lists what is in the way.',
			),
	})
	.loose();

export type LinksRestoreResponse = z.infer<typeof LinksRestoreResponseSchema>;

// ── links.export ────────────────────────────────────────────────────────────

const LinksExportInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	format: z
		.enum(['json', 'csv'])
		.optional()
		.describe("Defaults to 'json'. This plugin parses the json shape."),
	search: z.string().optional().describe('Only links matching this search.'),
});

export type LinksExportInput = z.infer<typeof LinksExportInputSchema>;

const LinksExportResponseSchema = z.array(WorkspaceLinkSchema);

export type LinksExportResponse = z.infer<typeof LinksExportResponseSchema>;

// ── clicks.getTimeSeries ────────────────────────────────────────────────────

const LinkIdQuerySchema = z
	.string()
	.min(1)
	.describe('A link ID, e.g. "30". One ID also works in link_ids.');

const LinkIdsQuerySchema = z
	.string()
	.min(1)
	.describe('Hyphen-separated link IDs, e.g. "24-25-26".');

const DateQuerySchema = z
	.string()
	.optional()
	.describe('YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ.');

const CountryQuerySchema = z
	.string()
	.length(2)
	.describe('ISO 3166-1 alpha-2 code, e.g. US.');

const ClicksGetTimeSeriesInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	link_id: LinkIdQuerySchema.optional(),
	link_ids: LinkIdsQuerySchema.optional(),
	start: DateQuerySchema,
	end: DateQuerySchema,
	country: CountryQuerySchema.optional(),
	browser: z.string().optional(),
	platform: z.string().optional(),
	referer: z.string().optional(),
	isp: z.string().optional(),
	bots: z
		.boolean()
		.optional()
		.describe('Include bot clicks. Defaults to false.'),
	unique: z.boolean().optional().describe('Count unique visitors only.'),
	format: z
		.enum(['json', 'csv', 'tsv'])
		.optional()
		.describe("Defaults to 'json'. This plugin parses the json shape."),
	pivot: z
		.enum(['link_id'])
		.optional()
		.describe(
			'Return a matrix instead of a time series: dates as rows, links as columns.',
		),
	timezone: z
		.string()
		.optional()
		.describe('IANA name for bucket boundaries, e.g. America/New_York. Data is stored in UTC.'),
	frequency: z
		.enum(['day', 'hour'])
		.optional()
		.describe("Bucket size. Defaults to 'day'."),
});

export type ClicksGetTimeSeriesInput = z.infer<
	typeof ClicksGetTimeSeriesInputSchema
>;

const ClickBucketSchema = z.object({
	t: z
		.string()
		.describe('Bucket start: YYYY-MM-DD for frequency=day, YYYY-MM-DDTHH:MM:SS for hour.'),
	y: z.number().int().nullish().describe('Clicks in the bucket.'),
});

const ClicksTimeSeriesResponseSchema = z
	.object({
		traffic: z.array(ClickBucketSchema),
	})
	.loose();

export type ClicksTimeSeriesResponse = z.infer<
	typeof ClicksTimeSeriesResponseSchema
>;

// The pivot shape is documented by example on
// linklyhq.com/support/analytics-api, not in the OpenAPI spec.
const ClicksPivotResponseSchema = z
	.object({
		links: z
			.array(
				z
					.object({
						id: z.number().int(),
						name: z.string().nullish(),
						full_url: z.string(),
					})
					.loose(),
			)
			.describe('One column per link, in column order.'),
		data: z.array(
			z.object({
				date: z.string(),
				clicks: z.record(z.string(), z.number().nullish()).describe(
					"Clicks keyed by link ID, e.g. { '30': 45 }. Absent means zero for that row.",
				),
			}),
		),
	})
	.loose();

export type ClicksPivotResponse = z.infer<typeof ClicksPivotResponseSchema>;

const ClicksGetTimeSeriesResponseSchema = z.union([
	ClicksTimeSeriesResponseSchema,
	ClicksPivotResponseSchema,
]);

export type ClicksGetTimeSeriesResponse = z.infer<
	typeof ClicksGetTimeSeriesResponseSchema
>;

// ── clicks.getCounters ──────────────────────────────────────────────────────

export const LINKLY_COUNTERS = [
	'country',
	'city',
	'region',
	'platform',
	'destination',
	'referer',
	'bot_name',
	'isp',
	'link_id',
	'remote_ip',
	'top_params',
	'ad_network',
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_content',
	'utm_term',
] as const;

const ClicksGetCountersInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	counter: z
		.enum(LINKLY_COUNTERS)
		.describe('The dimension to group clicks by.'),
	link_id: LinkIdQuerySchema.optional(),
	link_ids: LinkIdsQuerySchema.optional(),
	start: DateQuerySchema,
	end: DateQuerySchema,
	country: CountryQuerySchema.optional(),
	bots: z.boolean().optional().describe('Include bot clicks. Defaults to false.'),
	unique: z.boolean().optional().describe('Count unique visitors only.'),
	format: z
		.enum(['json', 'csv', 'tsv'])
		.optional()
		.describe("Defaults to 'json'. This plugin parses the json shape."),
});

export type ClicksGetCountersInput = z.infer<
	typeof ClicksGetCountersInputSchema
>;

const CounterValueSchema = z
	.object({
		count: z.number().int(),
		// A full Link object for counter=link_id, a string otherwise, and null
		// when the dimension was not recorded for those clicks.
		value: z.union([z.string(), LinklyLinkSchema]).nullish(),
		key: z
			.string()
			.nullish()
			.describe('Only for counter=top_params: the query-parameter name.'),
	})
	.loose();

const ClicksGetCountersResponseSchema = z.object({
	total: z
		.number()
		.int()
		.describe('Clicks across all groups, including any beyond the top 10,000 returned.'),
	values: z.array(CounterValueSchema).describe('Ordered by count, highest first.'),
});

export type ClicksGetCountersResponse = z.infer<
	typeof ClicksGetCountersResponseSchema
>;

// ── domains.list ────────────────────────────────────────────────────────────

const DomainsListInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
});

export type DomainsListInput = z.infer<typeof DomainsListInputSchema>;

const DomainsListResponseSchema = z.object({
	domains: z.array(
		z
			.object({
				name: z.string().nullish().describe('e.g. go.yourcompany.com.'),
			})
			.loose(),
	),
});

export type DomainsListResponse = z.infer<typeof DomainsListResponseSchema>;

// ── webhooks.list / subscribe / unsubscribe ──────────────────────────────────
// These manage click-webhook registrations over the API. Linkly delivers the
// events to the registered URL; this plugin does not receive them.

const WebhooksListInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
});

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhookSubscriptionSchema = z
	.object({
		// The webhook URL doubles as its id.
		id: z.string(),
	})
	.loose();

const WebhooksListResponseSchema = z.array(WebhookSubscriptionSchema);

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksSubscribeInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	url: z
		.url()
		.describe(
			'Receives a POST for every click in the workspace. Respond 2xx quickly; delivery is fire-and-forget with no retries.',
		),
});

export type WebhooksSubscribeInput = z.infer<typeof WebhooksSubscribeInputSchema>;

const WebhooksSubscribeResponseSchema = z
	.object({
		id: z.string().describe('The webhook URL. Pass it to webhooks.unsubscribe.'),
	})
	.loose();

export type WebhooksSubscribeResponse = z.infer<
	typeof WebhooksSubscribeResponseSchema
>;

const WebhooksUnsubscribeInputSchema = z.object({
	workspace_id: WorkspaceIdSchema,
	hook_id: z
		.string()
		.min(1)
		.describe(
			'The webhook URL, exactly as webhooks.list or webhooks.subscribe returned it. Encoded into the path for you.',
		),
});

export type WebhooksUnsubscribeInput = z.infer<
	typeof WebhooksUnsubscribeInputSchema
>;

// The spec documents a bare string acknowledgement.
const WebhooksUnsubscribeResponseSchema = z.string();

export type WebhooksUnsubscribeResponse = z.infer<
	typeof WebhooksUnsubscribeResponseSchema
>;

// ── registries ──────────────────────────────────────────────────────────────

export type LinklyEndpointInputs = {
	workspacesListWorkspaces: WorkspacesListWorkspacesInput;
	linksList: LinksListInput;
	linksGet: LinksGetInput;
	linksCreate: LinksCreateInput;
	linksUpdate: LinksUpdateInput;
	linksDelete: LinksDeleteInput;
	linksRestore: LinksRestoreInput;
	linksExport: LinksExportInput;
	clicksGetTimeSeries: ClicksGetTimeSeriesInput;
	clicksGetCounters: ClicksGetCountersInput;
	domainsList: DomainsListInput;
	webhooksList: WebhooksListInput;
	webhooksSubscribe: WebhooksSubscribeInput;
	webhooksUnsubscribe: WebhooksUnsubscribeInput;
};

export type LinklyEndpointOutputs = {
	workspacesListWorkspaces: WorkspacesListWorkspacesResponse;
	linksList: LinksListResponse;
	linksGet: LinksGetResponse;
	linksCreate: LinksCreateResponse;
	linksUpdate: LinksUpdateResponse;
	linksDelete: LinksDeleteResponse;
	linksRestore: LinksRestoreResponse;
	linksExport: LinksExportResponse;
	clicksGetTimeSeries: ClicksGetTimeSeriesResponse;
	clicksGetCounters: ClicksGetCountersResponse;
	domainsList: DomainsListResponse;
	webhooksList: WebhooksListResponse;
	webhooksSubscribe: WebhooksSubscribeResponse;
	webhooksUnsubscribe: WebhooksUnsubscribeResponse;
};

export const LinklyEndpointInputSchemas = {
	workspacesListWorkspaces: WorkspacesListWorkspacesInputSchema,
	linksList: LinksListInputSchema,
	linksGet: LinksGetInputSchema,
	linksCreate: LinksCreateInputSchema,
	linksUpdate: LinksUpdateInputSchema,
	linksDelete: LinksDeleteInputSchema,
	linksRestore: LinksRestoreInputSchema,
	linksExport: LinksExportInputSchema,
	clicksGetTimeSeries: ClicksGetTimeSeriesInputSchema,
	clicksGetCounters: ClicksGetCountersInputSchema,
	domainsList: DomainsListInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksSubscribe: WebhooksSubscribeInputSchema,
	webhooksUnsubscribe: WebhooksUnsubscribeInputSchema,
} as const;

export const LinklyEndpointOutputSchemas = {
	workspacesListWorkspaces: WorkspacesListWorkspacesResponseSchema,
	linksList: LinksListResponseSchema,
	linksGet: LinksGetResponseSchema,
	linksCreate: LinksCreateResponseSchema,
	linksUpdate: LinksUpdateResponseSchema,
	linksDelete: LinksDeleteResponseSchema,
	linksRestore: LinksRestoreResponseSchema,
	linksExport: LinksExportResponseSchema,
	clicksGetTimeSeries: ClicksGetTimeSeriesResponseSchema,
	clicksGetCounters: ClicksGetCountersResponseSchema,
	domainsList: DomainsListResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksSubscribe: WebhooksSubscribeResponseSchema,
	webhooksUnsubscribe: WebhooksUnsubscribeResponseSchema,
} as const;
