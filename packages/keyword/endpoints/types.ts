import { z } from 'zod';

// Inputs use Keyword's own names, which are its JSON:API attribute names.
// Outputs are `.loose()` with their documented fields nullish, so a field
// Keyword adds or omits cannot fail a call that has already happened.
// Reference: https://keyword.com/docs/serp-api/

const ProjectNameSchema = z
	.string()
	.min(1)
	// URL parsing drops a `.` or `..` path segment, which would send the call
	// to a different route.
	.refine((name) => name !== '.' && name !== '..', {
		message: 'A project name cannot be `.` or `..`.',
	})
	.describe(
		'The project (group) name, such as `Disney`. A subproject is written `Parent[sub]Child`.',
	);

const ProjectIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The numeric project ID, from `projects.list`.');

// Keyword IDs are numbers. Only digits are accepted as text, so an ID such as
// `..` cannot turn `/keywords/{id}` into the project route.
const NumericIdTextSchema = z
	.string()
	.regex(/^\d+$/, 'A keyword ID is a number.');

const KeywordIdSchema = z
	.union([NumericIdTextSchema, z.number().int().positive()])
	.describe('The keyword ID, as a string or a number.');

const KeywordIdsSchema = z
	.array(z.union([NumericIdTextSchema, z.number().int().positive()]))
	.min(1);

const PaginationSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(1000).optional(),
});

// ── projects ──────────────────────────────────────────────────────────────

const TagSchema = z
	.object({
		id: z.number().nullish(),
		project_id: z.number().nullish(),
		name: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		keywords_count: z.number().nullish(),
	})
	.loose();

export type KeywordTag = z.infer<typeof TagSchema>;

const ProjectsListInputSchema = z.object({});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

// `auth` is the project's own API key. Keyword returns it in every group, and
// the client strips it before a caller sees the result, so it is not declared
// here: a field that never arrives must not be required by the schema.
export const KeywordProjectSchema = z
	.object({
		type: z.string().nullish(),
		id: z.string(),
		attributes: z
			.object({
				project_id: z.number().nullish(),
				name: z.string().nullish(),
				shortkey: z.string().nullish(),
				// A count, a count per status, or `[]` on a project created just now.
				keywords_count: z
					.union([z.number(), z.record(z.string(), z.number()), z.tuple([])])
					.nullish(),
				tags_count: z.number().nullish(),
				tags: z.array(TagSchema).nullish(),
				keywords_last_updated_at: z.string().nullish(),
				notes_count: z.number().nullish(),
				updated_at: z.string().nullish(),
				// Keyword sends a Unix timestamp in seconds.
				crawled_at: z.union([z.number(), z.string()]).nullish(),
				url: z.string().nullish(),
				currency_code: z.string().nullish(),
				company_name: z.string().nullish(),
				company_desc: z.string().nullish(),
				company_link: z.string().nullish(),
				company_logo: z.string().nullish(),
				sov_view_key: z.boolean().nullish(),
			})
			.loose(),
	})
	.loose();

export type KeywordProject = z.infer<typeof KeywordProjectSchema>;

const ProjectsListResponseSchema = z
	.object({ data: z.array(KeywordProjectSchema) })
	.loose();

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

const ProjectGetInputSchema = z.object({ projectName: ProjectNameSchema });

export type ProjectGetInput = z.input<typeof ProjectGetInputSchema>;

const ProjectResponseSchema = z.object({ data: KeywordProjectSchema }).loose();

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;

const ProjectCreateInputSchema = z.object({
	category: z
		.string()
		.min(1)
		.describe(
			'The project name. A `Parent[sub]Child` name creates a subproject, which needs the parent to exist first.',
		),
	currency_code: z
		.string()
		.min(1)
		.optional()
		.describe('Three-letter currency for cost figures, such as `USD`.'),
	url: z
		.string()
		.optional()
		.describe('The domain the project tracks, such as `disney.com`.'),
});

export type ProjectCreateInput = z.input<typeof ProjectCreateInputSchema>;

const ProjectRemoveInputSchema = z.object({ projectName: ProjectNameSchema });

export type ProjectRemoveInput = z.input<typeof ProjectRemoveInputSchema>;

// Keyword's only documented PUT on a group is the archive: it takes
// `{ status: 2 }` and answers with a `meta` title. There is no route that edits
// a project's domain, currency or company details.
const ProjectArchiveInputSchema = z.object({ projectName: ProjectNameSchema });

export type ProjectArchiveInput = z.input<typeof ProjectArchiveInputSchema>;

const ProjectRestoreInputSchema = z.object({ projectName: ProjectNameSchema });

export type ProjectRestoreInput = z.input<typeof ProjectRestoreInputSchema>;

/**
 * Projects and keywords answer their deletes, archives and restores with a
 * `meta` title.
 */
const MetaResponseSchema = z
	.object({
		meta: z.object({ title: z.string() }).loose().optional(),
		message: z.string().optional(),
	})
	.loose();

export type MetaResponse = z.infer<typeof MetaResponseSchema>;

// ── project sharing ───────────────────────────────────────────────────────

const SharingGetInputSchema = z.object({ projectId: ProjectIdSchema });

export type SharingGetInput = z.input<typeof SharingGetInputSchema>;

// Sharing settings are a plain object at the root, not a JSON:API resource.
// The column and chart sections are passed through as Keyword sends them.
const SharingVisibilitySchema = z
	.object({
		hide_overview: z.boolean().nullish(),
		hide_top_pages: z.boolean().nullish(),
		hide_share_options: z.boolean().nullish(),
		hide_keyword_actions: z.boolean().nullish(),
		show_rank_verification: z.boolean().nullish(),
	})
	.loose();

const SharingSettingsSchema = z
	.object({
		project_id: z.number().nullish(),
		share_hash: z
			.string()
			.nullish()
			.describe('The share link’s hash; null while sharing is off.'),
		is_active: z.boolean().nullish(),
		is_password_protected: z.boolean().nullish(),
		visibility: SharingVisibilitySchema.nullish(),
		keyword_columns: z.object({}).loose().nullish(),
		keyword_charts: z.object({}).loose().nullish(),
		overview_charts: z.object({}).loose().nullish(),
		branding: z.object({}).loose().nullish(),
	})
	.loose();

export type SharingSettings = z.infer<typeof SharingSettingsSchema>;

const SharingUpdateInputSchema = z
	.object({
		projectId: ProjectIdSchema,
		is_active: z
			.boolean()
			.optional()
			.describe('Turn the share link on or off.'),
		password: z
			.string()
			.max(255)
			.nullable()
			.optional()
			.describe(
				'Protect the share link with this password; null or an empty string removes it. Setting one needs the white-label plan.',
			),
		visibility: z
			.object({
				hide_overview: z.boolean().optional(),
				hide_top_pages: z.boolean().optional(),
				hide_share_options: z.boolean().optional(),
				hide_keyword_actions: z.boolean().optional(),
				show_rank_verification: z.boolean().optional(),
			})
			.optional()
			.describe('Toggles merged key by key; omitted ones keep their value.'),
	})
	.superRefine((value, ctx) => {
		const { projectId: _projectId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['projectId'],
				message: 'Send `is_active`, `password` or `visibility`.',
			});
		}
	});

export type SharingUpdateInput = z.input<typeof SharingUpdateInputSchema>;

// ── keywords ──────────────────────────────────────────────────────────────

export const KEYWORD_STATUSES = ['ACTIVE', 'INACTIVE', 'ARCHIVED'] as const;

/** The number Keyword's update routes take for each status (it refuses the names). */
export const KEYWORD_STATUS_CODES: Record<
	(typeof KEYWORD_STATUSES)[number],
	number
> = { INACTIVE: 0, ACTIVE: 1, ARCHIVED: 2 };

export const KEYWORD_TYPES = ['se', 'local', 'gmb'] as const;

export const KEYWORD_URL_TRACKING_METHODS = ['broad', 'exact'] as const;

const KeywordAttributesSchema = z
	.object({
		project_id: z.number().nullish(),
		category: z.string().nullish(),
		url: z.string().nullish(),
		kw: z.string().nullish(),
		source: z.number().nullish(),
		start: z.number().nullish(),
		// Text, or an object such as `{ manual_start: true }` once a baseline is set.
		notes: z.union([z.string(), z.record(z.string(), z.unknown())]).nullish(),
		tags_count: z.number().nullish(),
		tags: z.array(TagSchema).nullish(),
		tag: z.string().nullish(),
		region: z.string().nullish(),
		language: z.string().nullish(),
		in_featured: z.boolean().nullish(),
		has_featured: z.boolean().nullish(),
		has_featured_url: z.string().nullish(),
		ignore_local: z.boolean().nullish(),
		ignore_featured: z.boolean().nullish(),
		url_tracking_method: z.string().nullish(),
		type: z.string().nullish(),
		gmb: z.string().nullish(),
		near: z.string().nullish(),
		isfav: z.boolean().nullish(),
		status: z.string().nullish(),
		clicks: z.number().nullish(),
		impressions: z.number().nullish(),
		ctr: z.number().nullish(),
		ms: z.number().nullish(),
		// A 0-1 score once ranked, a label such as `Low` right after an add.
		competition: z.union([z.number(), z.string()]).nullish(),
		cpc: z.number().nullish(),
		gpage: z.number().nullish(),
		grank: z.number().nullish(),
		grank_int: z.number().nullish(),
		best: z.number().nullish(),
		seocomp: z.number().nullish(),
		in_local_pack: z.boolean().nullish(),
		rankingurl: z.string().nullish(),
		grankhistory: z.array(z.number().nullable()).nullish(),
		// Positions moved; `N/A` until Keyword has a second check to compare.
		trends: z
			.object({
				day: z.union([z.number(), z.string()]).nullish(),
				week: z.union([z.number(), z.string()]).nullish(),
				month: z.union([z.number(), z.string()]).nullish(),
				life: z.union([z.number(), z.string()]).nullish(),
			})
			.loose()
			.nullish(),
		updated_at: z.string().nullish(),
		crawled_at: z.number().nullish(),
	})
	.loose();

export type KeywordAttributes = z.infer<typeof KeywordAttributesSchema>;

export const KeywordSchema = z
	.object({
		type: z.string().nullish(),
		id: z.string(),
		attributes: KeywordAttributesSchema,
	})
	.loose();

export type Keyword = z.infer<typeof KeywordSchema>;

const KeywordsListInputSchema = z.object({
	projectName: ProjectNameSchema,
	page: PaginationSchema.shape.page,
	per_page: PaginationSchema.shape.per_page,
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Use `YYYY-MM-DD`.')
		.optional()
		.describe(
			'Read the keyword data as it stood on this day. Defaults to today.',
		),
});

export type KeywordsListInput = z.input<typeof KeywordsListInputSchema>;

const KeywordsListResponseSchema = z
	.object({
		data: z.array(KeywordSchema),
		meta: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type KeywordsListResponse = z.infer<typeof KeywordsListResponseSchema>;

const KeywordGetInputSchema = z.object({
	projectName: ProjectNameSchema,
	keywordId: KeywordIdSchema,
	date: z
		.string()
		.optional()
		.describe('Read the keyword as it stood on this day.'),
});

export type KeywordGetInput = z.input<typeof KeywordGetInputSchema>;

const KeywordResponseSchema = z.object({ data: KeywordSchema }).loose();

export type KeywordResponse = z.infer<typeof KeywordResponseSchema>;

const KeywordAddAttributesSchema = z.object({
	kw: z.string().min(1).describe('The keyword phrase to track.'),
	url: z.string().min(1).describe('The domain to rank, such as `disney.com`.'),
	type: z
		.enum(KEYWORD_TYPES)
		.optional()
		.describe(
			'`se` for organic search, `local` for local, `gmb` for a Google Business listing.',
		),
	region: z
		.string()
		.optional()
		.describe('The Google region, such as `google.com` or `google.co.uk`.'),
	language: z.string().optional().describe('The language code, such as `en`.'),
	ignore_local: z.boolean().optional(),
	ignore_featured: z.boolean().optional(),
	url_tracking_method: z
		.enum(KEYWORD_URL_TRACKING_METHODS)
		.optional()
		.describe('`broad` counts subdomains, `exact` matches the URL as given.'),
	notes: z.string().optional(),
	tags: z.array(z.string().min(1)).optional().describe('Tag names to apply.'),
	near: z.string().optional().describe('A place for local tracking.'),
	gmb: z.string().optional().describe('The Google Business listing to track.'),
});

const KeywordsAddInputSchema = z.object({
	projectName: ProjectNameSchema,
	keywords: z.array(KeywordAddAttributesSchema).min(1),
});

export type KeywordsAddInput = z.input<typeof KeywordsAddInputSchema>;

const KeywordsAddResponseSchema = z
	.object({ data: z.array(KeywordSchema) })
	.loose();

export type KeywordsAddResponse = z.infer<typeof KeywordsAddResponseSchema>;

const KeywordUpdateInputSchema = z
	.object({
		projectName: ProjectNameSchema,
		keywordId: KeywordIdSchema,
		url: z.string().optional(),
		region: z.string().optional(),
		language: z.string().optional(),
		type: z.enum(KEYWORD_TYPES).optional(),
		status: z.enum(KEYWORD_STATUSES).optional(),
		tags: z
			.array(z.string().min(1))
			.optional()
			.describe('Replace every tag on the keyword with this list.'),
		isfav: z.boolean().optional(),
		ignore_local: z.boolean().optional(),
		ignore_featured: z.boolean().optional(),
		url_tracking_method: z.enum(KEYWORD_URL_TRACKING_METHODS).optional(),
		start: z
			.number()
			.int()
			.min(0)
			.max(100)
			.optional()
			.describe(
				'The starting rank the keyword’s change is measured from (sent as Keyword’s `baseline`).',
			),
	})
	.superRefine((value, ctx) => {
		const {
			projectName: _projectName,
			keywordId: _keywordId,
			...changes
		} = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['keywordId'],
				message: 'Send at least one field to update.',
			});
		}
	});

export type KeywordUpdateInput = z.input<typeof KeywordUpdateInputSchema>;

const KeywordRemoveInputSchema = z.object({
	projectName: ProjectNameSchema,
	keywordId: KeywordIdSchema,
});

export type KeywordRemoveInput = z.input<typeof KeywordRemoveInputSchema>;

// The bulk routes are scoped by project ID rather than project name.
const KeywordsBulkRemoveInputSchema = z.object({
	projectId: ProjectIdSchema,
	keywordIds: KeywordIdsSchema,
});

export type KeywordsBulkRemoveInput = z.input<
	typeof KeywordsBulkRemoveInputSchema
>;

const KeywordsBulkUpdateAttributesSchema = z.object({
	url: z.string().optional(),
	region: z.string().optional(),
	language: z.string().optional(),
	type: z.enum(KEYWORD_TYPES).optional(),
	status: z.enum(KEYWORD_STATUSES).optional(),
	tags: z.array(z.string().min(1)).optional(),
	ignore_local: z.boolean().optional(),
	ignore_featured: z.boolean().optional(),
	url_tracking_method: z.enum(KEYWORD_URL_TRACKING_METHODS).optional(),
});

const KeywordsBulkUpdateInputSchema = z
	.object({
		projectId: ProjectIdSchema,
		keywordIds: KeywordIdsSchema,
		changes: KeywordsBulkUpdateAttributesSchema.describe(
			'Applied to every keyword in `keywordIds`.',
		),
	})
	.superRefine((value, ctx) => {
		if (Object.values(value.changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['changes'],
				message: 'Send at least one attribute to change.',
			});
		}
	});

export type KeywordsBulkUpdateInput = z.input<
	typeof KeywordsBulkUpdateInputSchema
>;

const KeywordsRefreshInputSchema = z.object({
	keywordIds: KeywordIdsSchema.describe(
		'Queued for an on-demand check. The whole request is refused if it would exceed the plan’s daily refresh quota.',
	),
});

export type KeywordsRefreshInput = z.input<typeof KeywordsRefreshInputSchema>;

const KeywordsRefreshResponseSchema = z
	.object({
		message: z.string().describe('How many refreshes the plan has left.'),
	})
	.loose();

export type KeywordsRefreshResponse = z.infer<
	typeof KeywordsRefreshResponseSchema
>;

// ── ranking data ──────────────────────────────────────────────────────────

const MetricBucketSchema = z
	.object({
		count: z.number().nullish(),
		change: z.number().nullish(),
		status: z.string().nullish(),
	})
	.loose();

const MetricsInputSchema = z.object({
	projectName: ProjectNameSchema,
	tagId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only this tag’s keywords.'),
	timeframe: z
		.number()
		.int()
		.min(1)
		.describe('Days to compare over, such as 30. Keyword requires it.'),
});

export type MetricsInput = z.input<typeof MetricsInputSchema>;

const MetricsResponseSchema = z
	.object({
		data: z
			.object({
				type: z.string().nullish(),
				id: z.string().nullish(),
				attributes: z
					.object({
						ranges: z
							.array(
								MetricBucketSchema.extend({
									daily: MetricBucketSchema.nullish(),
									weekly: MetricBucketSchema.nullish(),
									monthly: MetricBucketSchema.nullish(),
									semester: MetricBucketSchema.nullish(),
									yearly: MetricBucketSchema.nullish(),
									life: MetricBucketSchema.nullish(),
									title: z.string().nullish(),
								}),
							)
							.nullish(),
					})
					.loose(),
			})
			.loose(),
	})
	.loose();

export type MetricsResponse = z.infer<typeof MetricsResponseSchema>;

// The chart route names the range `limit` and takes the keyword IDs as `kwid`.
const RankChartInputSchema = z.object({
	keywordIds: KeywordIdsSchema.describe(
		'Keyword refuses a call covering more than 400,000 keyword-days.',
	),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'Days of history before today. Each keyword counts `limit + 1` days toward the 400,000 keyword-day cap.',
		),
});

export type RankChartInput = z.input<typeof RankChartInputSchema>;

// Each keyword answers `{ kwid, data: [[{ name, data: [[date, rank]] }]] }`.
const RankChartSeriesSchema = z
	.object({
		name: z.string().nullish(),
		data: z
			.array(z.array(z.union([z.string(), z.number().nullable()])))
			.describe(
				'One `[date, rank]` pair per day. A null rank means it was not found.',
			),
	})
	.loose();

const RankChartKeywordSchema = z
	.object({
		kwid: z.union([z.number(), z.string()]),
		data: z
			.array(
				z.union([
					z.array(RankChartSeriesSchema),
					z.string(),
					z.record(z.string(), z.unknown()),
				]),
			)
			.nullish()
			.describe(
				'A tuple: series lists, then a label, the keyword ID and a ranking-URL summary.',
			),
	})
	.loose();

const RankChartResponseSchema = z
	.object({ data: z.array(RankChartKeywordSchema) })
	.loose();

export type RankChartResponse = z.infer<typeof RankChartResponseSchema>;

const CompetitorsInputSchema = z.object({
	projectName: ProjectNameSchema,
	keywordId: KeywordIdSchema,
	dateRange: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}\.\d{4}-\d{2}-\d{2}$/,
			'Use `YYYY-MM-DD.YYYY-MM-DD`.',
		)
		.describe(
			'The window, such as `2026-11-01.2026-11-12`. Keyword requires it.',
		),
});

export type CompetitorsInput = z.input<typeof CompetitorsInputSchema>;

const CompetitorsResponseSchema = z
	.object({
		data: z.array(
			z
				.object({
					rank: z.number().nullish(),
					results: z
						.array(
							z
								.object({
									resultType: z.string().nullish(),
									url: z.string().nullish(),
									title: z.string().nullish(),
									domain: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type CompetitorsResponse = z.infer<typeof CompetitorsResponseSchema>;

const RegionsInputSchema = z.object({ projectName: ProjectNameSchema });

export type RegionsInput = z.input<typeof RegionsInputSchema>;

const RegionsResponseSchema = z
	.object({
		data: z.array(
			z
				.object({
					region: z.string(),
					lang: z.string().nullish(),
					type: z.string().nullish(),
					total: z.number().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type RegionsResponse = z.infer<typeof RegionsResponseSchema>;

// Top pages come 10 to a page, with `meta.last_page` saying how many there are.
const RankingUrlsInputSchema = z.object({
	projectName: ProjectNameSchema,
	page: PaginationSchema.shape.page.describe('1-based page. Defaults to 1.'),
});

export type RankingUrlsInput = z.input<typeof RankingUrlsInputSchema>;

const RankingUrlsResponseSchema = z
	.object({
		data: z.array(
			z
				.object({
					current_ranking_url: z.string().nullish(),
					current_rank: z.number().nullish(),
					previous_rank: z.number().nullish(),
					total_keyword_count: z.number().nullish(),
					average_current_rank: z.number().nullish(),
					average_previous_rank: z.number().nullish(),
					total_search_volume: z.number().nullish(),
					average_cost_per_click: z.number().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type RankingUrlsResponse = z.infer<typeof RankingUrlsResponseSchema>;

// ── share of voice ────────────────────────────────────────────────────────

const MindshareHistoryInputSchema = z.object({
	projectId: ProjectIdSchema,
	start_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Use `YYYY-MM-DD`.')
		.optional(),
	end_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Use `YYYY-MM-DD`.')
		.optional(),
});

export type MindshareHistoryInput = z.input<typeof MindshareHistoryInputSchema>;

// `data` maps `latest` and one `YYYY-MM-DD` key per data point to that
// day's top domains.
const MindshareHistoryEntrySchema = z
	.object({
		url: z.string().nullish(),
		clicks: z.number().nullish(),
		percentage: z.number().nullish(),
		domain_exist_in_project: z.boolean().nullish(),
	})
	.loose();

const MindshareHistoryResponseSchema = z
	.object({
		// A project with no Share of Voice data yet answers `data: []`.
		data: z.preprocess(
			(value) => (Array.isArray(value) && value.length === 0 ? {} : value),
			z.record(z.string(), z.array(MindshareHistoryEntrySchema)),
		),
	})
	.loose();

export type MindshareHistoryResponse = z.infer<
	typeof MindshareHistoryResponseSchema
>;

// ── account ───────────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({
	include: z
		.array(z.enum(['subscriptions']))
		.min(1)
		.optional()
		.describe('Also return the subscription block.'),
});

export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

const AccountResponseSchema = z
	.object({
		data: z
			.object({
				type: z.string().nullish(),
				id: z.string(),
				attributes: z
					.object({
						user_id: z.number().nullish(),
						name: z.string().nullish(),
						email: z.string().nullish(),
						verified: z.number().nullish(),
						onboarding: z.boolean().nullish(),
					})
					.loose(),
			})
			.loose(),
	})
	.loose();

export type AccountResponse = z.infer<typeof AccountResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KeywordEndpointInputs = {
	projectsList: ProjectsListInput;
	projectsGet: ProjectGetInput;
	projectsCreate: ProjectCreateInput;
	projectsArchive: ProjectArchiveInput;
	projectsRemove: ProjectRemoveInput;
	projectsRestore: ProjectRestoreInput;
	sharingGet: SharingGetInput;
	sharingUpdate: SharingUpdateInput;
	keywordsList: KeywordsListInput;
	keywordsGet: KeywordGetInput;
	keywordsAdd: KeywordsAddInput;
	keywordsUpdate: KeywordUpdateInput;
	keywordsRemove: KeywordRemoveInput;
	keywordsBulkRemove: KeywordsBulkRemoveInput;
	keywordsBulkUpdate: KeywordsBulkUpdateInput;
	keywordsRefresh: KeywordsRefreshInput;
	metricsGet: MetricsInput;
	rankChart: RankChartInput;
	competitors: CompetitorsInput;
	regionsList: RegionsInput;
	rankingUrls: RankingUrlsInput;
	mindshareHistory: MindshareHistoryInput;
	accountGet: AccountGetInput;
};

export type KeywordEndpointOutputs = {
	projectsList: ProjectsListResponse;
	projectsGet: ProjectResponse;
	projectsCreate: ProjectResponse;
	projectsArchive: MetaResponse;
	projectsRemove: MetaResponse;
	projectsRestore: MetaResponse;
	sharingGet: SharingSettings;
	sharingUpdate: SharingSettings;
	keywordsList: KeywordsListResponse;
	keywordsGet: KeywordResponse;
	keywordsAdd: KeywordsAddResponse;
	keywordsUpdate: KeywordResponse;
	keywordsRemove: MetaResponse;
	keywordsBulkRemove: MetaResponse;
	keywordsBulkUpdate: MetaResponse;
	keywordsRefresh: KeywordsRefreshResponse;
	metricsGet: MetricsResponse;
	rankChart: RankChartResponse;
	competitors: CompetitorsResponse;
	regionsList: RegionsResponse;
	rankingUrls: RankingUrlsResponse;
	mindshareHistory: MindshareHistoryResponse;
	accountGet: AccountResponse;
};

export const KeywordEndpointInputSchemas = {
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectGetInputSchema,
	projectsCreate: ProjectCreateInputSchema,
	projectsArchive: ProjectArchiveInputSchema,
	projectsRemove: ProjectRemoveInputSchema,
	projectsRestore: ProjectRestoreInputSchema,
	sharingGet: SharingGetInputSchema,
	sharingUpdate: SharingUpdateInputSchema,
	keywordsList: KeywordsListInputSchema,
	keywordsGet: KeywordGetInputSchema,
	keywordsAdd: KeywordsAddInputSchema,
	keywordsUpdate: KeywordUpdateInputSchema,
	keywordsRemove: KeywordRemoveInputSchema,
	keywordsBulkRemove: KeywordsBulkRemoveInputSchema,
	keywordsBulkUpdate: KeywordsBulkUpdateInputSchema,
	keywordsRefresh: KeywordsRefreshInputSchema,
	metricsGet: MetricsInputSchema,
	rankChart: RankChartInputSchema,
	competitors: CompetitorsInputSchema,
	regionsList: RegionsInputSchema,
	rankingUrls: RankingUrlsInputSchema,
	mindshareHistory: MindshareHistoryInputSchema,
	accountGet: AccountGetInputSchema,
} as const;

export const KeywordEndpointOutputSchemas = {
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectResponseSchema,
	projectsCreate: ProjectResponseSchema,
	projectsArchive: MetaResponseSchema,
	projectsRemove: MetaResponseSchema,
	projectsRestore: MetaResponseSchema,
	sharingGet: SharingSettingsSchema,
	sharingUpdate: SharingSettingsSchema,
	keywordsList: KeywordsListResponseSchema,
	keywordsGet: KeywordResponseSchema,
	keywordsAdd: KeywordsAddResponseSchema,
	keywordsUpdate: KeywordResponseSchema,
	keywordsRemove: MetaResponseSchema,
	keywordsBulkRemove: MetaResponseSchema,
	keywordsBulkUpdate: MetaResponseSchema,
	keywordsRefresh: KeywordsRefreshResponseSchema,
	metricsGet: MetricsResponseSchema,
	rankChart: RankChartResponseSchema,
	competitors: CompetitorsResponseSchema,
	regionsList: RegionsResponseSchema,
	rankingUrls: RankingUrlsResponseSchema,
	mindshareHistory: MindshareHistoryResponseSchema,
	accountGet: AccountResponseSchema,
} as const;
