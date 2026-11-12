// Response bodies shaped like the Cloud API's, with made-up ids and names.
// They were not captured from the live API.

const definition = {
	_id: 'product_catalogue',
	startUrl: ['https://acme.example/products'],
	selectors: [
		{
			id: 'name',
			parentSelectors: ['_root'],
			type: 'SelectorText',
			selector: 'h1.title',
			multiple: false,
		},
	],
};

/** One sitemap as `GET /sitemap/{id}` returns it: the definition is a string. */
export const sitemap = {
	id: 42,
	name: 'product_catalogue',
	sitemap: JSON.stringify(definition),
};

export const sitemapResponse = { success: true, data: sitemap };

/** `POST /sitemap` answers with the new id only. */
export const sitemapCreatedResponse = { success: true, data: { id: 42 } };

/** A list answer: `{ id, name }` items, with the page fields at the root. */
export const sitemapsListResponse = {
	success: true,
	data: [{ id: 42, name: 'product_catalogue' }],
	current_page: 1,
	last_page: 3,
	total: 201,
	per_page: 100,
};

export const account = {
	email: 'ops@acme.example',
	firstname: 'Ada',
	lastname: 'Example',
	page_credits: 4_850,
};

export const accountResponse = { success: true, data: account };

/** A bad token: the handled shape, with a 401 (as the live API answers). */
export const invalidToken = {
	success: false,
	error: 'Unauthorized, invalid Bearer token.',
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
