import { z } from 'zod';

/**
 * Simple Analytics' own names are used throughout. Outputs are `.loose()` and
 * their optional fields `.nullish()` so a field the API adds or omits cannot
 * fail a read that already succeeded.
 *
 * Docs: https://docs.simpleanalytics.com/api/stats and /api/export-data-points
 */

// ── Shared input pieces ───────────────────────────────────────────────────

const Hostname = z
	.string()
	.min(1)
	.describe('The website hostname as registered, such as example.com.');

/**
 * Stats takes `YYYY-MM-DD` or a placeholder such as `today-30d`; the Export API
 * additionally takes `YYYY-MM-DDTHH` for an hourly window. Both forms are
 * accepted here and the API rejects anything else.
 */
const DateValue = z
	.string()
	.min(1)
	.describe(
		'A date as YYYY-MM-DD, an hourly stamp as YYYY-MM-DDTHH (export only), or a placeholder such as today-30d.',
	);

const Timezone = z
	.string()
	.min(1)
	.optional()
	.describe('An IANA name with capitals, such as Europe/Amsterdam.');

const Limit = z
	.number()
	.int()
	.min(1)
	.max(1000)
	.optional()
	.describe('How many rows each field returns, 1 to 1000. Defaults to 50.');

/** The Stats API fields, in the order the docs list them. */
const StatsFieldSchema = z.enum([
	'pageviews',
	'visitors',
	'histogram',
	'pages',
	'countries',
	'referrers',
	'utm_sources',
	'utm_mediums',
	'utm_campaigns',
	'utm_contents',
	'utm_terms',
	'browser_names',
	'os_names',
	'device_types',
	'seconds_on_page',
]);

const Interval = z.enum(['hour', 'day', 'week', 'month', 'year']);

/** The filters the Stats API applies to the selected fields and events. */
const statsFilters = {
	page: z.string().optional().describe('One exact page path.'),
	pages: z
		.string()
		.optional()
		.describe(
			'A comma separated list of paths. A trailing * matches by prefix, such as /product/*.',
		),
	country: z.string().optional().describe('A two-letter country code.'),
	referrer: z.string().optional(),
	utm_source: z.string().optional(),
	utm_medium: z.string().optional(),
	utm_campaign: z.string().optional(),
	utm_content: z.string().optional(),
	utm_term: z.string().optional(),
	browser_name: z.string().optional(),
	os_name: z.string().optional(),
	device_type: z.enum(['mobile', 'tablet', 'desktop', 'tv']).optional(),
	metadata: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Exact metadata matches, sent as metadata.<key>. Keys use letters, digits and underscores only, without the storage suffix.',
		),
};

// ── stats.get ─────────────────────────────────────────────────────────────

const StatsGetInputSchema = z.object({
	hostname: Hostname,
	/** Shows only one page's numbers, via the path form of the Stats URL. */
	path: z
		.string()
		.optional()
		.describe(
			'Only this page path, such as /contact. The path goes into the URL, before .json.',
		),
	start: DateValue.optional().describe('Defaults to one month ago.'),
	end: DateValue.optional().describe('Defaults to today.'),
	timezone: Timezone,
	fields: z
		.array(StatsFieldSchema)
		.min(1)
		.describe(
			'The fields to return. Always send at least one: an empty fields list returns the version 1 format.',
		),
	limit: Limit,
	interval: Interval.optional().describe(
		'The bucket size for histogram. Defaults to day.',
	),
	events: z
		.array(z.string())
		.optional()
		.describe(
			'Event names to count. Use ["*"] for every event, capped at 1000.',
		),
	...statsFilters,
});

export type StatsGetInput = z.infer<typeof StatsGetInputSchema>;

/**
 * A Stats answer is a flat object, so every field is optional and nullish: a
 * caller asks for a subset and gets only those keys. `__`-prefixed keys are
 * documentation the API adds when `info=true`, which this plugin turns off.
 */
const StatsValueSchema = z
	.object({
		value: z.string().nullish(),
		pageviews: z.number().nullish(),
		visitors: z.number().nullish(),
		seconds_on_page: z.number().nullish(),
	})
	.loose();

const HistogramPointSchema = z
	.object({
		date: z.string().nullish(),
		pageviews: z.number().nullish(),
		visitors: z.number().nullish(),
	})
	.loose();

const EventCountSchema = z
	.object({
		name: z.string(),
		total: z.number().nullish(),
	})
	.loose();

const StatsGetResponseSchema = z
	.object({
		ok: z.literal(true),
		hostname: z.string().nullish(),
		path: z.string().nullish(),
		start: z.string().nullish(),
		end: z.string().nullish(),
		version: z.number().nullish(),
		timezone: z.string().nullish(),
		pageviews: z.number().nullish(),
		visitors: z.number().nullish(),
		seconds_on_page: z.number().nullish(),
		histogram: z.array(HistogramPointSchema).nullish(),
		pages: z.array(StatsValueSchema).nullish(),
		countries: z.array(StatsValueSchema).nullish(),
		referrers: z.array(StatsValueSchema).nullish(),
		utm_sources: z.array(StatsValueSchema).nullish(),
		utm_mediums: z.array(StatsValueSchema).nullish(),
		utm_campaigns: z.array(StatsValueSchema).nullish(),
		utm_contents: z.array(StatsValueSchema).nullish(),
		utm_terms: z.array(StatsValueSchema).nullish(),
		browser_names: z.array(StatsValueSchema).nullish(),
		os_names: z.array(StatsValueSchema).nullish(),
		device_types: z.array(StatsValueSchema).nullish(),
		events: z.array(EventCountSchema).nullish(),
	})
	.loose();

export type StatsGetResponse = z.infer<typeof StatsGetResponseSchema>;

// ── export.datapoints ─────────────────────────────────────────────────────

/** Every non-metadata field the Export API documents. */
const ExportFieldSchema = z.enum([
	'added_unix',
	'added_iso',
	'added_date',
	'hostname',
	'hostname_original',
	'path',
	'query',
	'path_and_query',
	'is_unique',
	'is_robot',
	'document_referrer',
	'referrer_hostname',
	'referrer_path',
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_content',
	'utm_term',
	'scrolled_percentage',
	'duration_seconds',
	'viewport_width',
	'viewport_height',
	'screen_width',
	'screen_height',
	'user_agent',
	'device_type',
	'country_code',
	'browser_name',
	'browser_version',
	'os_name',
	'os_version',
	'lang_region',
	'lang_language',
	'uuid',
	'datapoint',
	'session_id',
]);

const ExportDatapointsInputSchema = z
	.object({
		hostname: Hostname,
		start: DateValue.optional().describe('Defaults to 30 days ago.'),
		end: DateValue.optional().describe('Defaults to today.'),
		timezone: Timezone,
		fields: z
			.array(ExportFieldSchema)
			.min(1)
			.describe(
				'Always send this: without it the legacy field set comes back, and type=all fails.',
			),
		type: z
			.enum(['pageviews', 'events', 'all'])
			.optional()
			.describe('Page views, events, or both. Defaults to pageviews.'),
		robots: z
			.boolean()
			.optional()
			.describe('Include robots and crawlers. Defaults to false.'),
		metadata_fields: z
			.array(z.string())
			.optional()
			.describe(
				'Metadata keys to export with their storage suffix, such as project_text (sent as metadata.project_text). The suffix is required here, unlike in Stats filters.',
			),
	})
	.superRefine((value, ctx) => {
		// `type=all` with no fields is rejected by the API, and it is the one
		// combination a caller reaches for without reading the note.
		if (value.type === 'all' && value.fields.length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['fields'],
				message: 'type=all needs an explicit fields list.',
			});
		}
	});

export type ExportDatapointsInput = z.infer<typeof ExportDatapointsInputSchema>;

/**
 * `format=json` answers `{ datapoints, meta }`. A datapoint carries whichever
 * fields were requested, so it stays loose with every field nullish.
 */
const DatapointSchema = z
	.object({
		added_unix: z.number().nullish(),
		added_iso: z.string().nullish(),
		added_date: z.string().nullish(),
		hostname: z.string().nullish(),
		hostname_original: z.string().nullish(),
		path: z.string().nullish(),
		query: z.string().nullish(),
		path_and_query: z.string().nullish(),
		is_unique: z.boolean().nullish(),
		is_robot: z.boolean().nullish(),
		document_referrer: z.string().nullish(),
		referrer_hostname: z.string().nullish(),
		referrer_path: z.string().nullish(),
		utm_source: z.string().nullish(),
		utm_medium: z.string().nullish(),
		utm_campaign: z.string().nullish(),
		utm_content: z.string().nullish(),
		utm_term: z.string().nullish(),
		scrolled_percentage: z.number().nullish(),
		duration_seconds: z.number().nullish(),
		viewport_width: z.number().nullish(),
		viewport_height: z.number().nullish(),
		screen_width: z.number().nullish(),
		screen_height: z.number().nullish(),
		user_agent: z.string().nullish(),
		device_type: z.string().nullish(),
		country_code: z.string().nullish(),
		browser_name: z.string().nullish(),
		browser_version: z.string().nullish(),
		os_name: z.string().nullish(),
		os_version: z.string().nullish(),
		lang_region: z.string().nullish(),
		lang_language: z.string().nullish(),
		uuid: z.string().nullish(),
		datapoint: z.string().nullish(),
		session_id: z.string().nullish(),
	})
	.loose();

export type SimpleanalyticsDatapoint = z.infer<typeof DatapointSchema>;

const ExportDatapointsResponseSchema = z
	.object({
		datapoints: z.array(DatapointSchema),
		meta: z.record(z.string(), z.unknown()).nullish(), // unknown: export echo
	})
	.loose();

export type ExportDatapointsResponse = z.infer<
	typeof ExportDatapointsResponseSchema
>;

// ── websites.list ─────────────────────────────────────────────────────────

const WebsitesListInputSchema = z.object({});

export type WebsitesListInput = z.infer<typeof WebsitesListInputSchema>;

const WebsiteSchema = z
	.object({
		hostname: z.string(),
		is_public: z.boolean().nullish(),
		timezone: z.string().nullish(),
		has_ssl: z.boolean().nullish(),
		has_script: z.boolean().nullish(),
		own_hostname: z.string().nullish(),
		label: z.string().nullish(),
		pageviews: z.number().nullish(),
		events: z.number().nullish(),
	})
	.loose();

export type SimpleanalyticsWebsite = z.infer<typeof WebsiteSchema>;

const WebsitesListResponseSchema = z
	.object({
		success: z.literal(true),
		websites: z.array(WebsiteSchema),
	})
	.loose();

export type WebsitesListResponse = z.infer<typeof WebsitesListResponseSchema>;

// ── websites.add ──────────────────────────────────────────────────────────

const WebsitesAddInputSchema = z.object({
	hostname: Hostname,
	isPublic: z
		.boolean()
		.optional()
		.describe('Whether the stats are public without a key. Defaults to false.'),
	timezone: z
		.string()
		.optional()
		.describe(
			'An IANA name such as Europe/Amsterdam. An unrecognised value falls back to UTC.',
		),
	label: z
		.string()
		.optional()
		.describe('A note shown on the websites overview.'),
});

export type WebsitesAddInput = z.infer<typeof WebsitesAddInputSchema>;

const WebsitesAddResponseSchema = z
	.object({
		ok: z.boolean(),
		success: z.boolean(),
		hostname: z.string(),
		customDomain: z.string().nullish(),
		public: z.boolean().nullish(),
		timezone: z.string().nullish(),
		validDNS: z.boolean().nullish(),
	})
	.loose();

export type WebsitesAddResponse = z.infer<typeof WebsitesAddResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SimpleanalyticsEndpointInputs = {
	statsGet: StatsGetInput;
	exportDatapoints: ExportDatapointsInput;
	websitesList: WebsitesListInput;
	websitesAdd: WebsitesAddInput;
};

export type SimpleanalyticsEndpointOutputs = {
	statsGet: StatsGetResponse;
	exportDatapoints: ExportDatapointsResponse;
	websitesList: WebsitesListResponse;
	websitesAdd: WebsitesAddResponse;
};

export const SimpleanalyticsEndpointInputSchemas = {
	statsGet: StatsGetInputSchema,
	exportDatapoints: ExportDatapointsInputSchema,
	websitesList: WebsitesListInputSchema,
	websitesAdd: WebsitesAddInputSchema,
} as const;

export const SimpleanalyticsEndpointOutputSchemas = {
	statsGet: StatsGetResponseSchema,
	exportDatapoints: ExportDatapointsResponseSchema,
	websitesList: WebsitesListResponseSchema,
	websitesAdd: WebsitesAddResponseSchema,
} as const;
