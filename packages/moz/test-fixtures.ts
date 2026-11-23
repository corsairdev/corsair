// Response bodies modelled on the examples embedded in the Moz API method
// pages (https://moz.com/api/docs/methods/*), with made-up domains.

export const quota = {
	path: 'api.limits.data.rows',
	account_id: 123456789,
	allotted: 750,
	used: 250,
	report: 'day',
	reset: 'month',
	overage: false,
	period_start: 1714546800,
	period_reset: 1717225200,
};

export const locales = {
	engine: 'google',
	locales: ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE'],
};

export const siteMetrics = {
	page: 'moz.com',
	subdomain: 'moz.com',
	root_domain: 'moz.com',
	title: 'The Moz Blog',
	last_crawled: '2023-06-01',
	http_code: 200,
	pages_to_page: 123,
	nofollow_pages_to_page: 5,
	redirect_pages_to_page: 10,
	external_pages_to_page: 100,
	external_nofollow_pages_to_page: 3,
	external_redirect_pages_to_page: 8,
	deleted_pages_to_page: 2,
	root_domains_to_page: 50,
	indirect_root_domains_to_page: 15,
	deleted_root_domains_to_page: 1,
	nofollow_root_domains_to_page: 2,
	pages_to_subdomain: 500,
	nofollow_pages_to_subdomain: 20,
	redirect_pages_to_subdomain: 40,
	external_pages_to_subdomain: 400,
	external_nofollow_pages_to_subdomain: 15,
	external_redirect_pages_to_subdomain: 30,
	deleted_pages_to_subdomain: 10,
	root_domains_to_subdomain: 100,
	deleted_root_domains_to_subdomain: 5,
	nofollow_root_domains_to_subdomain: 10,
	pages_to_root_domain: 5000,
	nofollow_pages_to_root_domain: 200,
	redirect_pages_to_root_domain: 400,
	external_pages_to_root_domain: 4000,
	external_indirect_pages_to_root_domain: 1000,
	external_nofollow_pages_to_root_domain: 150,
	external_redirect_pages_to_root_domain: 300,
	deleted_pages_to_root_domain: 100,
	root_domains_to_root_domain: 500,
	indirect_root_domains_to_root_domain: 200,
	deleted_root_domains_to_root_domain: 50,
	nofollow_root_domains_to_root_domain: 100,
	page_authority: 45,
	domain_authority: 91,
	link_propensity: 0.8,
	spam_score: 2,
	root_domains_from_page: 10,
	nofollow_root_domains_from_page: 1,
	pages_from_page: 50,
	nofollow_pages_from_page: 5,
	root_domains_from_root_domain: 1000,
	nofollow_root_domains_from_root_domain: 100,
	pages_from_root_domain: 5000,
	nofollow_pages_from_root_domain: 500,
	pages_crawled_from_root_domain: 10000,
};

export const siteQuery = {
	query: 'https://moz.com',
	scope: 'domain',
	original_site_query: { query: 'moz.com', scope: 'domain' },
	site_query_suggestion: null,
};

export const siteQueryUrl = {
	query: 'https://moz.com/blog',
	scope: 'url',
	original_site_query: { query: 'moz.com/blog', scope: 'url' },
	site_query_suggestion: null,
};

export const offsetResult = {
	provided_token: null,
	token: 'AWrG9eXz5oaz',
	limit: 1,
};

export const link = {
	source_site_metrics: {
		...siteMetrics,
		page: 'zhanhao.online/domain.php',
		subdomain: 'zhanhao.online',
		root_domain: 'zhanhao.online',
		title: 'A guide',
		domain_authority: 9,
		page_authority: 17,
	},
	target_site_metrics: siteMetrics,
	anchor_text: 'seo guide',
	date_first_seen: '2025-06-21',
	date_last_seen: '2025-06-25',
	date_disappeared: '',
	nofollow: true,
	redirect: false,
	rel_canonical: false,
	via_redirect: false,
	via_rel_canonical: true,
};

export const linksListResponse = {
	site_query: siteQueryUrl,
	offset: offsetResult,
	links: [link],
	options: {
		sort: 'source_link_propensity',
		filters: ['external', 'nofollow'],
	},
};

export const linkingDomainsResponse = {
	site_query: siteQuery,
	offset: { provided_token: null, token: null, limit: 25 },
	linking_domains: [
		{
			site_metrics: siteMetrics,
			link_propensity: 0.5,
			targeted_pages: 12,
			targeted_nofollow_pages: 1,
		},
	],
	options: { sort: 'source_domain_authority' },
};

export const anchorTextResponse = {
	site_query: siteQuery,
	offset: { provided_token: null, token: null, limit: 5 },
	anchor_texts: [
		{ text: 'seo guide', external_root_domains: 30, external_pages: 41 },
	],
};

export const topPagesResponse = {
	site_query: siteQuery,
	offset: { provided_token: null, token: null, limit: 10 },
	options: { filter: 'status_200', sort: 'page_authority' },
	top_pages: [siteMetrics],
};

export const metricsMultipleResponse = {
	results_by_site: [{ site_query: siteQuery, site_metrics: siteMetrics }],
	errors_by_site: [
		{
			site_query: siteQueryUrl,
			error: {
				message: 'No data found for that query.',
				name: 'MozApiError',
				data: { key: 'site_query', value: 'moz.com/blog' },
				httpStatus: 404,
				jsonrpcCode: -32655,
			},
		},
	],
};

export const linkIntersectResponse = {
	is_linking_to: [siteQuery],
	not_linking_to: [
		{
			query: 'https://ahrefs.com',
			scope: 'domain',
			original_site_query: { query: 'ahrefs.com', scope: 'domain' },
			site_query_suggestion: null,
		},
	],
	options: {
		minimum_matching_targets: null,
		scope: 'domain',
		sort: 'matching_target_count',
	},
	offset: { provided_token: null, token: null, limit: 25 },
	link_intersects: [
		{
			page: 'semrush.com/blog',
			title: 'SEO blog',
			domain_authority: 86,
			spam_score: 1,
			matching_target_indexes: [0],
			matching_source_pages: [
				{ page: 'semrush.com/blog/post', page_authority: 33 },
			],
		},
	],
};

export const pendingAsyncCall = {
	id: 'c3397e5a-ce31-42fb-8607-ed40487aea18',
	action: 'data.site.competitor.fetch',
	status: 'pending',
	ttl: 120,
	result: null,
	error: null,
};

export const completeCompetitorCall = {
	id: '3d446f53-aaba-4bdb-9d47-b1d0754bfe90',
	action: 'data.site.competitor.fetch',
	status: 'complete',
	ttl: 20,
	result: {
		target_query: {
			query: 'moz.com',
			scope: 'domain',
			locale: 'en-US',
			original_target_query: {
				query: 'moz.com',
				scope: 'domain',
				locale: 'en-US',
			},
			suggestion: null,
		},
		competitors: [
			{
				domain: 'ahrefs.com',
				domain_authority: 91,
				proximity: 87,
				overlap: 42,
				relevance: 50,
				rivalry: 60,
				keywords: ['seo', 'backlink checker'],
			},
		],
	},
	error: null,
};

export const failedCompetitorCall = {
	id: '18e5de71-af54-490d-8eb1-0596a4f68121',
	action: 'data.site.competitor.fetch',
	status: 'complete',
	ttl: 20,
	result: null,
	error: {
		code: -32653,
		status: 400,
		data: {},
		message: "We've thrown an error!",
	},
};

/**
 * The JSON-RPC error envelope, probed live without a token and documented in
 * the error handling guide. Both status spellings occur depending on layer.
 */
export const authErrorEnvelope = {
	id: 'b9a9ddc8-ea2a-47df-8aba-6dbeb6917292',
	jsonrpc: '2.0',
	error: {
		code: -32651,
		httpStatus: 401,
		data: {},
		message: 'Missing or invalid authentication',
	},
};

export const quotaErrorEnvelope = {
	id: '26b5b403-8b3c-431e-900b-3d9686aa8c28',
	jsonrpc: '2.0',
	error: {
		code: -32670,
		status: 403,
		data: {
			explanation: 'account does not have sufficient quota',
			issue: 'insufficient-quota',
		},
		message:
			'The account does not have enough quota remaining for current period.',
	},
};

export const validationErrorEnvelope = {
	id: '52b531fd-6614-4aa0-b075-1e289359bcdf',
	jsonrpc: '2.0',
	error: {
		code: -32652,
		status: 400,
		data: {
			explanation: 'query is a required field and was not included.',
			issue: 'param-is-missing',
			key: 'query',
		},
		message: 'Please include a query',
	},
};

export const methodRateLimitEnvelope = {
	id: '3bb5f7f6-cb63-4d46-9cd8-9ceabbe067ac',
	jsonrpc: '2.0',
	error: {
		code: -32658,
		status: 429,
		data: {
			explanation: 'Rate limit for the given action has been exceeded.',
			issue: 'rate_limited',
			value: 60,
		},
		message:
			'You have exceeded the request rate limit. Please slow down and try again.',
	},
};

export const edgeRateLimitEnvelope = {
	// unknown: Moz answers edge refusals with this literal id, because the
	// request is refused before it is read.
	id: 'unknown',
	jsonrpc: '2.0',
	error: {
		code: -32650,
		status: 429,
		data: {
			explanation: 'ip address is blocked',
			issue: 'request-is-blocked',
			key: null,
		},
		message: 'Your IP has been temporarily blocked due to bad requests.',
	},
};

export const serverErrorEnvelope = {
	id: null,
	jsonrpc: '2.0',
	error: {
		code: -32603,
		httpStatus: 500,
		data: {},
		message: 'Internal error',
	},
};
