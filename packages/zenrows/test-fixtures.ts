// Responses in this file are copied from live Zenrows answers on 2026-11-10,
// not from the docs' examples: the docs show a crawl's `depth` as always
// present (it is absent when unset) and do not show the bare `{ status: 404 }`
// a route that does not exist returns.

export const textPage = {
	html: '<!doctype html><html lang=en><head><title>Example Domain</title></head><body><h1>Example Domain</h1></body></html>',
	markdown:
		'This domain is for use in documentation examples without needing permission.\n',
	plaintext:
		'Example Domain\nThis domain is for use in documentation examples.\n',
};

/** `GET /v1/?extract=native` on a prepared domain. */
export const productsExtract = {
	html: '<!doctype html><html lang="en-US"><head><title>Abominable Hoodie</title></head></html>',
	parsed: {
		breadcrumbs: [
			{
				name: 'Home',
				position: 1,
				url: 'https://www.scrapingcourse.com/ecommerce',
			},
		],
		product: {
			name: 'Abominable Hoodie',
			sku: 'MH01',
			price: 69,
			availability: 'out_of_stock',
		},
	},
};

/** `GET /v1/?css_extractor={"title":"h1"}`. */
export const selectorsResult = { title: 'Example Domain' };

/** `GET /v1/?json_response=true&js_render=true`. */
export const jsonResponseEnvelope = {
	html: '<!doctype html><html></html>',
	xhr: [],
	js_instructions_report: null,
};

/** `POST /v1/crawls` answered 202. */
export const crawlStarted = {
	crawl_id: 'c_01M72F709NDF8XFBYKBXRZ3QFA',
	status: 'running',
	url: 'https://www.scrapingcourse.com/ecommerce/',
	max_items: 100,
	max_pages: 10,
	include_patterns: [],
	exclude_patterns: [],
	discovery: ['links'],
	coverage: { pages_fetched: 0, pages_failed: 0, items_found: 0 },
	duplicates_removed: 0,
	created_at: '2026-11-10T10:14:15.510559295Z',
	results: [],
};

/** One row of `GET /v1/crawls`. */
export const crawlSummary = {
	crawl_id: 'c_01M72F709NDF8XFBYKBXRZ3QFA',
	status: 'completed',
	stop_reason: 'max_pages',
	url: 'https://www.scrapingcourse.com/ecommerce/',
	max_items: 3,
	max_pages: 2,
	include_patterns: [],
	exclude_patterns: [],
	output_format: 'html',
	discovery: ['links'],
	coverage: { pages_fetched: 2, pages_failed: 0, items_found: 1 },
	duplicates_removed: 1,
	created_at: '2026-11-10T10:14:15.510559295Z',
	finished_at: '2026-11-10T10:14:20.445560976Z',
};

/** `GET /v1/crawls/{id}` on a finished crawl with `output_format: html`. */
export const crawlPage = {
	...crawlSummary,
	results: [
		{
			url: 'https://www.scrapingcourse.com/ecommerce/cart/',
			content_status: 'fetched',
			content_url:
				'/v1/crawls/c_01M72F709NDF8XFBYKBXRZ3QFA/contents/ct_43c2cdbac1508bc68fe4d9788c11caf3',
		},
	],
	next_cursor: null,
};

/** One row of `GET /v1/extract/domains`. */
export const extractServedDomain = {
	domain: 'scrapingcourse.com',
	verticals: ['Shopping'],
	warm: true,
};

/** `GET /v1/extract/prepared-domains/{domain}` on a ready domain. */
export const extractPreparation = {
	domain: 'scrapingcourse.com',
	status: 'preparing',
	state: 'received',
	roles: [{ role: 'detail', status: 'ready' }],
	submitted_at: '2026-11-10T10:00:00.000519Z',
	updated_at: '2026-11-10T10:00:01.172241Z',
};

/** `GET /v1/extract/prepared-domains/allowance`. */
export const extractAllowance = {
	used: 0,
	limit: 10,
	remaining: 10,
	month: '2026-11',
};

/** `GET /v1/subscriptions/self/details` on a fresh trial key. */
export const subscriptionDetails = {
	status: 'TRIALING',
	period_starts_at: '2026-11-10T08:11:20Z',
	period_ends_at: '2026-12-10T08:11:20Z',
	usage: 0.01,
	usage_credits: 10,
	credit_limit: 5000,
	usage_percent: 0,
	plan: {
		name: 'Free',
		price: 5,
		unit_cost: 0.001,
		recurrence: 'MONTHLY',
		products: {
			api: {
				name: 'WebScraping API',
				usage: 0.01,
				usage_credits: 10,
				concurrency: { limit: 5, usage: 0 },
			},
			extract: { name: 'Extract', usage: 0, usage_credits: 0 },
			scraping_browser: {
				name: 'Scraping Browser',
				usage: 0,
				usage_credits: 0,
			},
			proxy_residential: {
				name: 'Residential Proxies',
				usage: 0,
				usage_credits: 0,
			},
			data_apis: { name: 'Data APIs', usage: 0, usage_credits: 0 },
		},
	},
	top_ups: [],
	api_key: { caps: [] },
};

/** `{"code":"AUTH004",...}` from a 402. */
export const usageExceeded = {
	code: 'AUTH004',
	detail: 'This account has used all its credits for the period.',
	instance: '/v1',
	status: 402,
	title: 'Usage exceeded (AUTH004)',
	type: 'https://docs.zenrows.com/api-error-codes#AUTH004',
};

/** `{"code":"AUTH006",...}` from a concurrency 429, with no Retry-After. */
export const concurrencyLimited = {
	code: 'AUTH006',
	detail:
		'Every concurrency slot on the plan is in use. Retry when a request in flight finishes.',
	instance: '/v1',
	status: 429,
	title: 'Concurrency limit reached (AUTH006)',
	type: 'https://docs.zenrows.com/api-error-codes#AUTH006',
};

/** A 422 from a target Zenrows could not get content from. */
export const couldNotGetContent = {
	code: 'RESP001',
	detail:
		'The target could not be returned under this configuration. Try js_render=true and premium_proxy=true, or mode=auto.',
	instance: '/v1',
	status: 422,
	title: 'Could not get content (RESP001)',
	type: 'https://docs.zenrows.com/api-error-codes#RESP001',
};

// A route that does not exist answers a bare status object.
export const bareNotFound = { status: 404 };

/**
 * Resolves a rejected promise to its error, for tests that assert on a thrown
 * value. The rejection reason is `unknown` by the language's own definition:
 * a promise can reject with any value, so a narrower type here would be a claim
 * no caller can make. One annotated helper replaces the same cast at every call
 * site.
 */
// unknown: see the doc comment above; the rejection reason has no static type.
export async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}
