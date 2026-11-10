// No response in this file was recorded from the live API: the account's plan
// does not include API access, so every endpoint answers
// `401 {"error":"Plan free no available"}`. Each value below is built from the
// documented response properties on https://www.klazify.com/api-docs, using
// their own examples where they give one. That makes these fixtures a test of
// our parsing, not proof the service sends these shapes.

/** `POST /api/categorize`. */
export const categorize = {
	success: true,
	domain: {
		domain_url: 'https://cbsnews.com',
		categories: [
			{ confidence: 1, name: '/News' },
			{ confidence: 0.72, name: '/News/Other' },
		],
		// The docs state this may be null or empty when no logo is found.
		logo_url: 'https://klazify.s3.amazonaws.com/cbsnews-com-logo.png',
		social_media: {
			facebook_url: 'https://www.facebook.com/CBSNews',
			twitter_url: 'https://twitter.com/CBSNews',
			instagram_url: null,
			youtube_url: 'https://www.youtube.com/user/CBSNewsOnline',
			linkedin_url: 'https://www.linkedin.com/company/cbs-news',
			github_url: null,
			pinterest_url: null,
		},
	},
	objects: {
		company: {
			name: 'CBS News',
			city: 'New York',
			stateCode: 'NY',
			countryCode: 'US',
			employeesRange: '1K-5K',
			revenue: '$500M-$1B',
			raised: null,
			tags: ['Publishing', 'News'],
			tech: ['google_tag_manager', 'salesforce'],
		},
	},
};

/** A category with no logo and no company block, which the docs allow. */
export const categorizeSparse = {
	success: true,
	domain: {
		domain_url: 'https://example.com',
		categories: [{ confidence: 0.4, name: '/Technology & Computing' }],
		logo_url: null,
		social_media: {},
	},
	objects: {},
};

/** `POST /api/real_time_categorization`. */
export const realtime = {
	success: true,
	domain: {
		domain_url: 'https://cbsnews.com',
		categories: [{ confidence: 1, name: '/News' }],
		updated_at: '2026-11-10T18:00:00Z',
	},
};

/** `POST /api/domain_iab_categories`: IAB keys sit beside `name`. */
export const iabCategories = {
	success: true,
	domain: {
		domain_url: 'https://cbsnews.com',
		updated_at: '2026-11-10T18:00:00Z',
		categories: [
			{
				confidence: 1,
				name: '/News',
				IAB1: 'Arts & Entertainment',
				IAB12: 'News',
				'IAB-599': 'Technology & Computing',
			},
		],
	},
};

/** `POST /api/domain_company`. */
export const company = {
	success: true,
	objects: {
		company: {
			name: 'CBS News',
			city: 'New York',
			stateCode: 'NY',
			countryCode: 'US',
			employeesRange: '1K-5K',
			revenue: '$500M-$1B',
			raised: null,
			tags: ['Publishing'],
		},
	},
};

/** `POST /api/domain_tech`. */
export const tech = {
	success: true,
	domain: {
		domain_url: 'https://cbsnews.com',
		updated_at: '2026-11-10T18:00:00Z',
	},
	objects: { company: { tech: ['google_tag_manager', 'react', 'wordpress'] } },
};

/** `POST /api/domain_logo`. */
export const logo = {
	success: true,
	domain: {
		domain_url: 'https://cbsnews.com',
		logo_url: 'https://klazify.s3.amazonaws.com/cbsnews-com-logo.png',
		updated_at: '2026-11-10T18:00:00Z',
	},
};

/** A domain with no logo: the docs say null or an empty string. */
export const logoMissing = {
	success: true,
	domain: {
		domain_url: 'https://example.com',
		logo_url: '',
		updated_at: '2026-11-10T18:00:00Z',
	},
};

/** `POST /api/domain_expiration`. */
export const domainRegistration = {
	success: true,
	domain_registration_data: {
		domain_age_date: '1994-10-04',
		domain_age_days_ago: 11480,
		domain_expiration_date: '2027-10-03',
		domain_expiration_days_left: 572,
	},
};

/** `POST /api/similar_domain`. */
export const similarDomains = {
	success: true,
	domain: {
		domain_url: 'https://cbsnews.com',
		similar_domains: ['https://nbcnews.com', 'https://abcnews.go.com'],
		updated_at: '2026-11-10T18:00:00Z',
	},
};

/**
 * `POST /api/domain_traffic_intelligence`. The engagement figures are decimal
 * strings in the docs, not numbers.
 */
export const traffic = {
	success: true,
	traffic_intelligence: {
		global_rank: 765,
		country_rank: { country_code: 'US', rank: 196 },
		category_rank: { category: 'News_and_Media', rank: '18' },
		monthly_visits: { '2026-09': 78634549, '2026-10': 80123456 },
		engagement: {
			bounce_rate: '0.607',
			pages_per_visit: '1.66',
			time_on_site_seconds: '67.7',
		},
		traffic_sources: { direct: 0.42, search: 0.35, social: 0.23 },
		top_countries: [
			{ country_code: 'US', share: 0.61 },
			{ country_code: 'GB', share: 0.07 },
		],
	},
};

/** `GET /api/list-category/v2`. */
export const categoryListV2 = {
	success: true,
	version: 'v2',
	count: 1091,
	categories: [
		'/Arts & Entertainment/Movies/Action & Adventure Films',
		'/News',
		'/Technology & Computing',
	],
};

/** `GET /api/list-category/v1`. */
export const categoryListV1 = {
	success: true,
	version: 'v1',
	count: 620,
	categories: ['/News', '/Technology & Computing'],
};

/** `POST /api/discovery`. */
export const discovery = {
	total: 4210,
	total_pages: 43,
	results: [
		{
			domain: 'shopify.com',
			company_name: 'Shopify',
			company_country: 'CA',
			company_employees: '5K-10K',
			company_revenue: '$1B+',
			primary_category: 'Shopping',
			primary_iab: 'IAB-599',
			global_rank: 412,
			monthly_visits_latest: 120000000,
		},
	],
};

/** A `tld`-filtered search whose candidate scan ran out. */
export const discoveryLowerBound = {
	total: 37,
	total_pages: 1,
	total_is_lower_bound: true,
	results: [],
};

/** The 401 every endpoint returns while the account is on the free plan. */
export const planRequired = {
	success: false,
	error: 'Plan free no available',
	message:
		'You must subscribe to a paid plan to use the API. Please visit the Billing page to upgrade.',
};

/** The 401 for a missing or rejected token. */
export const unauthorized = {
	success: false,
	error: 'Unauthorized',
	message:
		'Your request has not been completed because it lacks valid authentication credentials for the requested resource.',
};

/** A classification failure reported inside a 200, per the docs. */
export const unreachable = {
	success: false,
	message: 'Error category: /Unreachable',
};
