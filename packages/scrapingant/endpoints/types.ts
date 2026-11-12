import { z } from 'zod';

/**
 * Request and response shapes for the ScrapingAnt v2 API.
 *
 * Every path here was confirmed against a live response: the published OpenAPI
 * document at https://api.scrapingant.com/openapi.json lists `/v2/general` and
 * `/v2/usage`, and `/v2/markdown`, `/v2/extended` and `/v2/extract` are the
 * three extra routes the docs describe and the official Python and JavaScript
 * clients call. Each of the five answers a JSON `detail` at 403 for a bad key,
 * which is how a missing route (404 `{"detail":"Not Found"}`) is told apart
 * from a real one.
 *
 * Parameters are sent as URL-encoded query values; request bodies are not used
 * by any operation here. Field reference:
 * https://docs.scrapingant.com/request-response-format
 */

// Zod runs this refinement even after `z.url()` has failed, so a malformed
// value reaches `new URL()` here and has to fail as an issue, not a TypeError.
const HttpUrl = z.url().refine((value) => {
	try {
		const protocol = new URL(value).protocol;
		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
}, 'The URL scheme must be http:// or https://');

/** Documented blockable resource types (https://docs.scrapingant.com/headless-browser). */
export const SCRAPINGANT_BLOCKABLE_RESOURCES = [
	'document',
	'stylesheet',
	'image',
	'media',
	'font',
	'script',
	'texttrack',
	'xhr',
	'fetch',
	'eventsource',
	'websocket',
	'manifest',
	'other',
] as const;

const BlockResourceSchema = z.enum(SCRAPINGANT_BLOCKABLE_RESOURCES);

/**
 * `js_snippet` must be base64 of the JavaScript to run; the API answers
 * `422 Invalid js_snippet string` for raw source. Checking the encoding here
 * catches the mistake before a request is spent, and the round-trip test
 * rejects text that merely looks like base64.
 */
function isBase64(value: string): boolean {
	const compact = value.replace(/\s+/g, '');
	if (compact.length === 0 || compact.length % 4 !== 0) return false;
	if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) return false;
	try {
		return Buffer.from(compact, 'base64').toString('base64') === compact;
	} catch {
		return false;
	}
}

const JsSnippetSchema = z
	.string()
	.refine(
		isBase64,
		'Must be the base64 encoding of the JavaScript to run, not the JavaScript itself. For `window.scrollTo(0,0)` send `d2luZG93LnNjcm9sbFRvKDAsMCk=`.',
	);

/**
 * Options shared by every scraping route. The provider's own defaults are
 * named in each description rather than applied with `.default()`, so the type
 * a caller sees matches what the generated API reference documents.
 */
const ScrapeOptions = {
	browser: z
		.boolean()
		.optional()
		.describe(
			'Use a headless browser. Defaults to true on the provider side, which costs 10 credits per request against 1 without it.',
		),
	return_page_source: z
		.boolean()
		.optional()
		.describe(
			'Return the server HTML unrendered by the browser, so no JavaScript runs. Defaults to false and needs `browser`.',
		),
	cookies: z
		.string()
		.optional()
		.describe(
			'Cookies to send to the target, as `name1=value1;name2=value2`. Chain requests with the `cookies` field of `scrape.extended` to keep a session.',
		),
	js_snippet: JsSnippetSchema.optional().describe(
		'Base64-encoded JavaScript to run once the page has loaded. Needs `browser`.',
	),
	proxy_type: z
		.enum(['datacenter', 'residential'])
		.optional()
		.describe(
			'Proxy pool. Defaults to datacenter; residential costs 25 credits without a browser and 125 with one, against 1 and 10 for datacenter.',
		),
	proxy_country: z
		.string()
		.regex(/^[A-Za-z]{2}$/, 'Use a two-letter country code such as US or GB')
		.optional()
		.describe(
			'Two-letter code of the proxy country, as the provider documents it in capitals: AE, BR, CA, CN, CZ, DE, ES, FR, GB, HK, ID, IL, IN, IT, JP, KR, NL, PL, RU, SA, SG, TR, US or VN. Sent unchanged. When omitted the provider picks a random country. It adds countries over time and answers `422` with the permitted list for an unsupported one, so new codes work without a plugin change.',
		),
	wait_for_selector: z
		.string()
		.min(1)
		.optional()
		.describe('CSS selector to wait for before answering. Needs `browser`.'),
	block_resource: z
		.array(BlockResourceSchema)
		.min(1)
		.optional()
		.describe(
			'Resource types the browser must not load, which speeds the request up. Needs `browser`.',
		),
	timeout: z
		.number()
		.int()
		.min(5)
		.max(60)
		.optional()
		.describe(
			'Seconds the provider may spend on the request, from 5 to 60. Defaults to 60. A lower value answers faster and fails more often; the bounds can differ by request type and the provider names them in its error.',
		),
};

/** Options that do nothing without the headless browser. */
const BROWSER_ONLY_OPTIONS = [
	'return_page_source',
	'js_snippet',
	'wait_for_selector',
	'block_resource',
] as const;

type BrowserOnlyOptions = {
	browser?: boolean;
	return_page_source?: boolean;
	js_snippet?: string;
	wait_for_selector?: string;
	block_resource?: readonly string[];
};

/**
 * The provider accepts these fields with `browser: false` and silently ignores
 * them, which reads as a success while the setting never applied. Every
 * operation that takes the shared options runs this so the request fails here
 * instead.
 */
function checkBrowserOnlyOptions(
	input: BrowserOnlyOptions,
	ctx: z.RefinementCtx,
): void {
	if (input.browser !== false) return;
	for (const key of BROWSER_ONLY_OPTIONS) {
		if (input[key] !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: [key],
				message: `Only applies with the headless browser; set \`browser: true\` or remove \`${key}\`.`,
			});
		}
	}
}

// ── scrape.html ───────────────────────────────────────────────────────────

const ScrapeHtmlInputSchema = z
	.object({
		url: HttpUrl.describe('The page to scrape.'),
		...ScrapeOptions,
	})
	.superRefine(checkBrowserOnlyOptions);

export type ScrapeHtmlInput = z.input<typeof ScrapeHtmlInputSchema>;

const ScrapeHtmlResponseSchema = z
	.object({
		html: z
			.string()
			.min(1)
			.describe(
				'The page as returned: rendered HTML, or the raw source with `return_page_source`.',
			),
		page_status: z
			.number()
			.int()
			.nullish()
			.describe(
				"The target page's own HTTP status, from the `Ant-page-status-code` header. The API answers 200 even when the page was a 404, so read this before trusting the content.",
			),
		credits_cost: z
			.number()
			.int()
			.nullish()
			.describe(
				'Credits spent on the request, from the `Ant-credits-cost` header.',
			),
	})
	.loose();

export type ScrapeHtmlResponse = z.infer<typeof ScrapeHtmlResponseSchema>;

// ── scrape.markdown ───────────────────────────────────────────────────────

const ScrapeMarkdownInputSchema = z
	.object({
		url: HttpUrl.describe('The page to scrape and convert.'),
		...ScrapeOptions,
	})
	.superRefine(checkBrowserOnlyOptions);

export type ScrapeMarkdownInput = z.input<typeof ScrapeMarkdownInputSchema>;

const ScrapeMarkdownResponseSchema = z
	.object({
		url: z.string().describe('The URL that was scraped.'),
		markdown: z
			.string()
			.describe(
				'The whole page as Markdown, with `script` and `noscript` removed and no other element filtered: navigation, footers, cookie banners and ads all stay in.',
			),
		credits_cost: z
			.number()
			.int()
			.nullish()
			.describe(
				'Credits spent on the request, from the `Ant-credits-cost` header.',
			),
	})
	.loose();

export type ScrapeMarkdownResponse = z.infer<
	typeof ScrapeMarkdownResponseSchema
>;

// ── scrape.extended ───────────────────────────────────────────────────────

const ScrapeExtendedInputSchema = z
	.object({
		url: HttpUrl.describe('The page to scrape.'),
		...ScrapeOptions,
	})
	.superRefine(checkBrowserOnlyOptions);

export type ScrapeExtendedInput = z.input<typeof ScrapeExtendedInputSchema>;

/** A header as a name/value pair, which is how the endpoint sends them. */
export const HeaderPairSchema = z
	.object({
		name: z.string(),
		value: z.string(),
	})
	.loose();

export const ExtendedXhrSchema = z
	.object({
		url: z.string().nullish(),
		status: z.number().nullish(),
		method: z.string().nullish(),
		headers: z.array(HeaderPairSchema).nullish(),
		request_body: z.string().nullish(),
		body: z.string().nullish(),
	})
	.loose();

export const ExtendedIframeSchema = z
	.object({
		src: z.string().nullish(),
		html: z.string().nullish(),
	})
	.loose();

const ScrapeExtendedResponseSchema = z
	.object({
		html: z.string().describe('Content from the scraped page.'),
		text: z.string().describe('Text content from the scraped page.'),
		cookies: z
			.string()
			.describe(
				'The page cookies, in `name=value;` form, ready to pass to another call as `cookies`.',
			),
		status_code: z
			.number()
			.int()
			.describe(
				"The target page's own HTTP status. The API answers 200 whatever the page did, so read this before trusting the content.",
			),
		headers: z
			.array(HeaderPairSchema)
			.nullish()
			.describe('Response headers from the scraped page.'),
		xhrs: z
			.array(ExtendedXhrSchema)
			.nullish()
			.describe(
				'The XHR and fetch requests the page made. Empty or absent without the headless browser.',
			),
		iframes: z
			.array(ExtendedIframeSchema)
			.nullish()
			.describe(
				'The page iframes with their own HTML. Empty or absent without the headless browser.',
			),
		credits_cost: z
			.number()
			.int()
			.nullish()
			.describe(
				'Credits spent on the request, from the `Ant-credits-cost` header.',
			),
	})
	.loose();

export type ScrapeExtendedResponse = z.infer<
	typeof ScrapeExtendedResponseSchema
>;

// ── extract.data ──────────────────────────────────────────────────────────

const ExtractDataInputSchema = z
	.object({
		url: HttpUrl.describe('The page to extract data from.'),
		extract_properties: z
			.string()
			.trim()
			.min(1)
			.describe(
				'What to extract, as a comma-separated list: `product title, price(number), full description`. Append a type in parentheses to steer the JSON value, and nest with `reviews(list: review title, review content)`. Property names in the answer come back camelCased from this text, and a property the model cannot find comes back null.',
			),
		...ScrapeOptions,
	})
	.superRefine(checkBrowserOnlyOptions);

export type ExtractDataInput = z.input<typeof ExtractDataInputSchema>;

/**
 * The endpoint answers with the extracted object itself, one key per requested
 * property, so the shape is the caller's own text and cannot be pinned here.
 * The provider documents that a property it cannot find arrives as null
 * (https://docs.scrapingant.com/ai-data-extraction/ai-extractor-best-practices).
 */
const ExtractDataResponseSchema = z.looseObject({});

export type ExtractDataResponse = z.infer<typeof ExtractDataResponseSchema>;

// ── account.usage ─────────────────────────────────────────────────────────

const AccountUsageInputSchema = z.object({});

export type AccountUsageInput = z.input<typeof AccountUsageInputSchema>;

const AccountUsageResponseSchema = z
	.object({
		plan_name: z.string().describe('Active subscription plan name.'),
		start_date: z
			.string()
			.describe(
				'Start of the active period. The provider sends `2022-01-11T00:00:00`, without a time zone, so this stays a string.',
			),
		end_date: z
			.string()
			.describe('End of the active period, in the same form.'),
		plan_total_credits: z
			.number()
			.int()
			.describe('Credits the active subscription holds.'),
		remained_credits: z
			.number()
			.int()
			.describe('Credits left in the active period.'),
	})
	.loose();

export type AccountUsageResponse = z.infer<typeof AccountUsageResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ScrapingAntEndpointInputs = {
	scrapeHtml: ScrapeHtmlInput;
	scrapeMarkdown: ScrapeMarkdownInput;
	scrapeExtended: ScrapeExtendedInput;
	extractData: ExtractDataInput;
	accountUsage: AccountUsageInput;
};

export type ScrapingAntEndpointOutputs = {
	scrapeHtml: ScrapeHtmlResponse;
	scrapeMarkdown: ScrapeMarkdownResponse;
	scrapeExtended: ScrapeExtendedResponse;
	extractData: ExtractDataResponse;
	accountUsage: AccountUsageResponse;
};

export const ScrapingAntEndpointInputSchemas = {
	scrapeHtml: ScrapeHtmlInputSchema,
	scrapeMarkdown: ScrapeMarkdownInputSchema,
	scrapeExtended: ScrapeExtendedInputSchema,
	extractData: ExtractDataInputSchema,
	accountUsage: AccountUsageInputSchema,
} as const;

export const ScrapingAntEndpointOutputSchemas = {
	scrapeHtml: ScrapeHtmlResponseSchema,
	scrapeMarkdown: ScrapeMarkdownResponseSchema,
	scrapeExtended: ScrapeExtendedResponseSchema,
	extractData: ExtractDataResponseSchema,
	accountUsage: AccountUsageResponseSchema,
} as const;
