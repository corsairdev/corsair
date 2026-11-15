// Shapes taken from Keyword's SERP Tracker API reference
// (https://keyword.com/docs/serp-api/) and its live 401 envelope.

/**
 * The media type Keyword sends on every answer, errors included (live run,
 * 11-14). It is not `application/json`, so mocks use it to keep the client's
 * parsing honest.
 */
export const KEYWORD_CONTENT_TYPE = 'application/vnd.api+json';

const tag = {
	id: 27727,
	project_id: 3057417,
	name: 'Disney',
	created_at: '2026-09-30 05:11:38',
	updated_at: '2026-09-30 05:11:38',
	keywords_count: 6,
};

export const project = {
	type: 'group',
	id: 'Disney',
	attributes: {
		project_id: 3057417,
		auth: 'PROJECT-AUTH-KEY',
		name: 'Disney',
		keywords_count: { ACTIVE: 11 },
		tags_count: 2,
		tags: [tag, { ...tag, id: 27728, name: 'Walt Disney' }],
		keywords_last_updated_at: '2026-04-14T07:17:52-04:00',
		notes_count: 0,
		updated_at: '2026-05-11T09:49:33-04:00',
		shortkey: 'RfVyHsg',
		crawled_at: null,
		password: null,
		company_name: null,
		company_link: null,
		company_logo: null,
		sov_view_key: false,
		url: 'disney.com',
		currency_code: 'USD',
	},
};

export const projects = { data: [project, { ...project, id: 'Pixar' }] };

export const keyword = {
	type: 'keyword',
	id: '187181871',
	attributes: {
		project_id: 3057417,
		category: 'Disney',
		url: 'disney.com',
		auth: 'PROJECT-AUTH-KEY',
		kw: 'disneyland',
		source: 3,
		start: 76,
		notes: null,
		tags_count: 0,
		tags: [],
		tag: null,
		region: 'google.com',
		language: 'en',
		in_featured: false,
		has_featured: false,
		has_featured_url: '',
		ignore_local: true,
		ignore_featured: true,
		url_tracking_method: 'broad',
		type: 'se',
		gmb: null,
		near: null,
		isfav: true,
		status: 'ACTIVE',
		clicks: 22,
		impressions: -1,
		ctr: 1.34,
		ms: 1500000,
		competition: 0.073667314,
		cpc: 0.83,
		gpage: 1,
		serp_features: {},
		grank: 10,
		grank_int: 5,
		rank_check: null,
		best: 5,
		seocomp: 193000000,
		in_local_pack: false,
		rankingurl: 'https://www.disney.com/',
		grankhistory: [10, 14, 13, 14, 10, 10, 12],
		trends: { day: 4, week: 2, month: -2, life: 66 },
		updated_at: '2026-05-11T09:49:48-04:00',
		crawled_at: 1681575247,
	},
};

export const keywords = {
	data: [keyword, { ...keyword, id: '196465030' }],
	meta: { total: 2, per_page: 250, page: 1 },
};

export const deleted = { meta: { title: 'Keywords have been deleted' } };

export const refreshed = { message: 'You have 3934 keyword refreshes left.' };

export const sharing = {
	project_id: 3057417,
	share_hash: 'HUPjoqIyYIoYwlaf',
	is_active: true,
	is_password_protected: false,
	visibility: {
		hide_overview: false,
		hide_top_pages: false,
		hide_share_options: false,
		hide_keyword_actions: false,
		show_rank_verification: false,
	},
	keyword_columns: {
		inherit_account: true,
		columns: [{ name: 'rank', visible: true, order: 0 }],
	},
	keyword_charts: { enabled: true, mode: 'match_overview', charts: [] },
	overview_charts: { mode: 'match_overview', charts: [] },
	branding: { override_account_branding: false, company_name: null },
};

export const metrics = {
	data: {
		type: 'metrics',
		id: '00-Keyword.com',
		attributes: {
			ranges: [
				{
					daily: { count: 5, change: 0, status: 'tie' },
					weekly: { count: 5, change: 0, status: 'tie' },
					monthly: { count: 5, change: 0, status: 'tie' },
					semester: { count: 5, change: 0, status: 'tie' },
					yearly: { count: 5, change: 0, status: 'tie' },
					life: { count: 7, change: -2, status: 'down' },
					count: 5,
					title: 'Top 3',
				},
				{
					daily: { count: 7, change: 0, status: 'tie' },
					weekly: { count: 7, change: 0, status: 'tie' },
					monthly: { count: 7, change: 0, status: 'tie' },
					semester: { count: 7, change: 0, status: 'tie' },
					yearly: { count: 7, change: 0, status: 'tie' },
					life: { count: 7, change: 0, status: 'tie' },
					count: 7,
					title: 'Top 5',
				},
			],
		},
	},
};

export const rankChart = {
	data: [
		{
			kwid: 196465030,
			data: [
				[
					{
						name: 'disney.com',
						data: [
							['2026-04-10', 5],
							['2026-04-11', 7],
							['2026-04-12', null],
						],
					},
				],
			],
		},
	],
};

export const competitors = {
	data: [
		{
			rank: 7,
			results: [
				{
					resultType: 'organic',
					url: 'https://www.disney.com/',
					title: 'Disney',
					domain: 'disney.com',
				},
			],
		},
	],
};

export const regions = {
	data: [
		{ region: 'google.com', lang: 'en', type: 'se', total: 6 },
		{ region: 'google.com.au', lang: 'en-au', type: 'se', total: 1 },
		{ region: 'google.es', lang: 'es', type: 'se', total: 1 },
	],
};

export const rankingUrls = {
	data: [
		{
			current_ranking_url: 'https://movies.disney.com/a-z',
			current_rank: 81,
			previous_rank: 43,
			total_keyword_count: 1,
			average_current_rank: 81,
			average_previous_rank: 43,
			total_search_volume: 140,
			average_cost_per_click: 0,
		},
	],
};

export const mindshareHistory = {
	data: {
		latest: [
			{
				url: 'en.wikipedia.org',
				clicks: 1072333.488,
				percentage: 19.93,
				domain_exist_in_project: false,
			},
		],
		'2026-11-08': [
			{ url: 'en.wikipedia.org', clicks: 1321317.479, percentage: 24.55 },
		],
		'2026-11-01': [
			{ url: 'en.wikipedia.org', clicks: 1248335.619, percentage: 23.2 },
		],
	},
};

export const account = {
	data: {
		type: 'user',
		id: 'email@user.com',
		attributes: {
			onboarding: true,
			verified: 1,
			user_id: 252725,
			name: 'George',
			api_token: 'ACCOUNT-API-TOKEN',
			access_level: 'master',
		},
	},
};

/** The 401 body Keyword sends for a missing or bad token. */
export const unauthorized = {
	errors: [
		{
			code: '401',
			title: 'Your request is unauthorized',
			message: 'Unauthenticated.',
		},
	],
};

/** A token whose user cannot do this. */
export const forbidden = {
	errors: [
		{
			code: '403',
			title: 'Your request is forbidden',
			message:
				'A new project needs write access to every project in the account.',
		},
	],
};

/** A plan whose keyword allowance is full. */
export const quotaExceeded = {
	errors: [
		{
			code: '402',
			title: 'Your plan is full',
			message: 'The plan’s keyword allowance is reached.',
		},
	],
};

/** A refused field. */
export const unprocessable = {
	errors: [
		{
			code: '422',
			title: 'The request is invalid',
			message: 'The url field is required.',
		},
	],
};

/** An unknown project. */
export const notFound = {
	errors: [
		{
			code: '404',
			title: 'Not found',
			message: 'The requested resource was not found',
		},
	],
};

/** A project lookup by a name that does not exist, as Keyword answered it live. */
export const projectNotFound = {
	errors: [
		{
			code: '1001',
			title: 'The project not found',
			message: 'The project not found',
		},
	],
};

/**
 * A keyword the day after it was added, from the live API (11-14, trimmed).
 * Before a second check, `trends` holds `N/A` where a number will be.
 */
export const freshKeywords = {
	data: [
		{
			type: 'keyword',
			id: '297034045',
			attributes: {
				project_id: 3853510,
				category: 'corsair.dev',
				url: 'corsair.dev',
				auth: 'PROJECT-AUTH-KEY',
				kw: 'corsair mcp',
				source: 3,
				start: 1,
				status: 'ACTIVE',
				clicks: -1,
				impressions: -1,
				ctr: 0,
				competition: null,
				grank: 1,
				best: 1,
				trends: { day: 'N/A', week: 'N/A', month: 'N/A', life: 0 },
				crawled_at: 1794600580,
				updated_at: '2026-11-13T20:09:07+00:00',
				grankhistory: [],
			},
		},
	],
	meta: {
		pagination: {
			total: 1,
			count: 1,
			per_page: 10,
			current_page: 1,
			total_pages: 1,
		},
	},
};

/** Share of Voice history for a project with no data yet, from the live API. */
export const emptyMindshareHistory = { data: [], meta: [] };

/**
 * One keyword read by ID, from the live API (11-14, trimmed). Unlike the list,
 * it is the bare keyword with a numeric `id`, not a JSON:API resource.
 */
export const flatKeyword = {
	id: 297034045,
	project_id: 3853510,
	category: 'corsair.dev',
	url: 'corsair.dev',
	auth: 'KEYWORD-AUTH-KEY',
	kw: 'corsair mcp',
	status: 'ACTIVE',
	grank: 1,
	trends: { day: 'N/A', week: 'N/A', month: 'N/A', life: 0 },
	// Set by Keyword once a baseline is given.
	notes: { manual_start: true },
	start: 7,
	crawled_at: 1794600580,
	updated_at: '2026-11-13T20:09:07+00:00',
};

/**
 * A rank chart from the live API (11-14). Each keyword's `data` is a tuple:
 * the series, an empty list, a label, `<kwid>|<keyword auth key>` and a
 * ranking-URL summary. Dates come as Highcharts `Date.UTC` text with a
 * zero-based month.
 */
export const liveRankChart = {
	data: [
		{
			kwid: 297034045,
			data: [
				[
					{
						name: 'corsair.dev',
						data: [['Date.UTC(2026,10,13)', 1]],
						visible: true,
						pointInterval: 86400000,
					},
				],
				[],
				'corsair.dev|corsair mcp|corsair.dev|google.com|en',
				'297034045|KEYWORD-AUTH-KEY',
				{
					days: 0,
					rankingurls: [
						{
							date: '2026-11-13',
							rank: 1,
							rankingurl: 'https://corsair.dev/',
						},
					],
				},
			],
		},
	],
};
