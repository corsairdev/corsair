// Response bodies shaped like the Cloud API's, with made-up ids and names.
// They were not captured from the live API.

export const sitemap = {
	id: 42,
	name: 'Product catalogue',
	url: 'https://acme.example/products',
	status: 'idle',
	created_at: '2024-01-01T00:00:00Z',
	updated_at: '2024-02-01T00:00:00Z',
	selectors: [
		{ id: 'name', selector: 'h1.title', type: 'text' },
		{ id: 'price', selector: '.price', type: 'text' },
	],
	start_urls: [{ url: 'https://acme.example/products?page=1' }],
	jobs_count: 3,
};

export const sitemapResponse = { success: true, data: sitemap };

/** A list answer, which the API returns as a flat array of sitemaps. */
export const sitemapsListResponse = {
	success: true,
	data: [sitemap],
};

/** The paginated variant, which nests the array one level deeper. */
export const sitemapsPaginatedResponse = {
	success: true,
	data: {
		data: [sitemap],
		total: 1,
		current_page: 1,
		last_page: 1,
	},
};

export const account = {
	id: 7,
	name: 'Acme',
	email: 'ops@acme.example',
	plan: 'professional',
	pages_allowed: 500_000,
	pages_used: 12_345,
	scraping_jobs_allowed: 100,
	scraping_jobs_used: 3,
	created_at: '2024-01-01T00:00:00Z',
};

export const accountResponse = { success: true, data: account };

/** A bad token: the handled shape, with a 401. */
export const invalidToken = {
	success: false,
	error: 'Unauthorized, invalid api_token.',
};

/** A mistyped path: Laravel's own answer, which is not a missing sitemap. */
export const routeNotFound = {
	message: 'The route api/v1/nope could not be found.',
};

/** A sitemap that genuinely does not exist. */
export const sitemapNotFound = {
	success: false,
	error: 'Sitemap not found.',
};

export const badRequest = {
	success: false,
	error: 'The sitemap field is required.',
};
