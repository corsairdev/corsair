// The search and account fixtures are captured from live responses using
// RedCircle's own `demo` key, so their field names and types are the API's, not
// the docs' examples. The rest follow the published parameter and result pages.

export const TCIN = '94907686';

/** A live 401, verbatim. */
export const INVALID_KEY = {
	request_info: { success: false, message: 'Supplied api_key is not valid' },
};

/** A live 400, which names the valid `type` values. */
export const INVALID_TYPE = {
	request_info: {
		success: false,
		message:
			"The 'type' parameter is required (valid values are 'reviews', 'product', 'search', 'category', 'store_stock').",
	},
};

/** The documented 503 body, whose `retry_after` is in seconds. */
export const INCIDENT = {
	message:
		'Request type redcircle-search is temporarily unavailable. You have not been charged for this request',
	retry_after: 3600,
};

export const QUOTA_EXCEEDED = {
	request_info: {
		success: false,
		message:
			'Your account has run out of credits. Please upgrade your plan or enable overage.',
	},
};

export const PRODUCT = {
	title: 'Sharpie Clear View Highlighters Chisel Tip Multicolored',
	link: 'https://www.target.com/p/sharpie-clear-view-highlighters-chisel-tip-multicolored/-/A-94907686',
	tcin: TCIN,
	dpci: '081-02-2450',
	class_id: 2,
	department_id: 81,
	sponsored: true,
	brand: 'Sharpie',
	brand_link: 'https://www.target.com/b/sharpie/-/N-56cak',
	rating: 4.7,
	ratings_total: 1155,
	main_image:
		'https://target.scene7.com/is/image/Target/GUEST_3bfe54aa-c956-4947-9cfe-b96d9aba5baf',
	images: [
		'https://target.scene7.com/is/image/Target/GUEST_3bfe54aa-c956-4947-9cfe-b96d9aba5baf',
	],
	videos: [],
	price: { value: 8.99, currency: 'USD', symbol: '$', raw: '$8.99' },
	description: 'Four highlighter pens',
	feature_bullets: ['Chisel tip', 'Multicolored'],
	specifications: [{ name: 'Count', value: '4' }],
	categories: [{ id: '5xt1a', name: 'School & Office Supplies' }],
	variants: [],
};

/** The live search response shape, trimmed to two rows. */
export const SEARCH_PAGE = {
	request_info: { success: true, demo: true },
	request_parameters: { type: 'search', search_term: 'highlighter pens' },
	request_metadata: {
		target_url:
			'https://www.target.com/s?searchTerm=highlighter+pens&sortBy=relevance&Nao=0',
	},
	search_results: [
		{
			position: 1,
			product: PRODUCT,
			offers: [],
			fulfillment: { in_store_pickup: true },
		},
	],
	categories: [],
	facets: [],
	pagination: {
		current: {
			page: 1,
			link: 'https://www.target.com/s?searchTerm=highlighter+pens&Nao=0',
		},
		next: {
			page: 2,
			link: 'https://www.target.com/s?searchTerm=highlighter+pens&Nao=24',
		},
		total_pages: 10,
		total_results: 217,
	},
};

export const SEARCH_LAST_PAGE = {
	request_info: { success: true },
	search_results: [{ position: 1, product: PRODUCT }],
	pagination: {
		current: { page: 10 },
		next: null,
		total_pages: 10,
		total_results: 217,
	},
};

export const PRODUCT_RESULT = {
	request_info: { success: true },
	request_metadata: { target_url: 'https://www.target.com/p/-/A-94907686' },
	product: PRODUCT,
};

export const REVIEWS_PAGE = {
	request_info: { success: true },
	reviews: [
		{
			id: 'rev-1',
			rating: 5,
			title: 'Great highlighters',
			body: 'They are slimmer and easy to hold.',
			date: '2026-02-01T00:00:00.000Z',
			nickname: 'Sam',
			verified_purchase: true,
			helpful_votes: 4,
			recommended: true,
		},
	],
	pagination: {
		current: { page: 1 },
		next: { page: 2 },
		total_pages: 3,
		total_results: 60,
	},
};

export const CATEGORIES_PAGE = {
	request_info: { success: true },
	categories: [
		{
			id: '5xt1a',
			name: 'School & Office Supplies',
			has_children: true,
			is_root: true,
			path: 'School & Office Supplies',
		},
	],
};

/** The live account shape, with the echoed api_key that must be stripped. */
export const ACCOUNT = {
	request_info: { success: true },
	account_info: {
		api_key: 'demo',
		name: 'John Smith',
		email: 'john.smith@example.com',
		plan: 'Plan Name',
		timezone: '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
		credits_used: 115,
		credits_remaining: 14885,
		credits_reset_at: '2020-01-01T00:00:00.000Z',
		credits_limit: 15000,
		overage_enabled: false,
		zipcodes_used: 2,
		zipcodes_limit: 10,
		zipcodes_available: 8,
		destinations_used: 0,
		destinations_limit: 50,
		destinations_available: 50,
		account_balance_usd: 88.5,
		account_balance_message: 'Your account is in good standing',
		usage_history: [],
	},
};
