// Shapes taken from Keyword's SERP Tracker API reference
// (https://keyword.com/docs/serp-api/) and its live 401 envelope.

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
	data: {
		type: 'sharing-setting',
		id: '3057417',
		attributes: {
			project_id: 3057417,
			is_public: true,
			password: null,
			sov_view_key: false,
		},
	},
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

export const mindshareLatest = {
	data: [
		{
			title: 'Tinker Bell',
			url: 'en.wikipedia.org',
			clicks: 2750049.638000001,
			percentage: 28.85809668022449,
			changes: { month: 4.182040388013718 },
		},
	],
};

export const mindshareHistory = {
	data: [
		{
			date: '2026-11-01',
			title: 'Tinker Bell',
			url: 'en.wikipedia.org',
			percentage: 28.85,
			clicks: 2750049.64,
		},
	],
};

export const alerts = {
	data: [
		{
			type: 'alert',
			id: '552700104',
			attributes: {
				category: 'Disney',
				keyword_id: 187765907,
				url: 'disney.com/',
				kw: 'Donald Duck',
				ms: 30,
				region: 'google.com',
				language: 'en',
				prevrank: 5,
				result: 1,
				time: '2026-11-01T00:00:00Z',
			},
		},
	],
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
