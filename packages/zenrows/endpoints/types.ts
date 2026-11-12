import { z } from 'zod';

// Shapes here come from Zenrows' OpenAPI 3.1 spec
// (https://www.zenrows.com/openapi.json), checked against live responses on
// 2026-11-10. Response fields keep Zenrows' own names exactly (`crawl_id`,
// `stop_reason`, `next_cursor`); inputs are camelCase and are mapped to the
// wire names in each endpoint.
//
// A Fetch answer is only JSON when the request asked for JSON. The text modes
// return a string, and the JSON modes each parse their own envelope, so the
// output schemas describe the envelope rather than guessing at page content.

// ── Shared building blocks ────────────────────────────────────────────────

/** The RFC 9457 problem body Zenrows sends with every error status. */
export const ZenrowsProblemSchema = z
	.object({
		code: z.string().nullish(),
		status: z.number().nullish(),
		title: z.string().nullish(),
		detail: z.string().nullish(),
		type: z.string().nullish(),
		instance: z.string().nullish(),
		/** Extract preparation errors only, such as `invalid_domain`. */
		reason: z.string().nullish(),
	})
	.loose();

export type ZenrowsProblem = z.infer<typeof ZenrowsProblemSchema>;

/** Zenrows takes `url` as a public http or https URL of at most 2,048 bytes. */
export const TargetUrlSchema = z
	.string()
	.min(1)
	.max(2048)
	.refine(
		(value) => {
			try {
				const parsed = new URL(value);
				return parsed.protocol === 'http:' || parsed.protocol === 'https:';
			} catch {
				return false;
			}
		},
		{ message: 'must be a public http or https URL' },
	)
	.describe('An absolute http or https URL of at most 2048 characters.');

export const PositiveInt = z.number().int().positive();

/**
 * How the client decoded a response body. The provider's own Content-Type
 * header is not available: corsair/http returns the body alone. Zenrows labels
 * HTML, Markdown and its JSON modes all `text/plain`, so `text` does not mean
 * the body is not JSON; a JSON-mode operation parses it either way.
 */
export const BodyFormatSchema = z.enum(['json', 'text']);

export type BodyFormat = z.infer<typeof BodyFormatSchema>;

/**
 * The values `block_resources` accepts. `document` answers 400 and the rest
 * answer 200 (probed against the live API); images and stylesheets are already
 * blocked by default.
 */
export const ZENROWS_BLOCKABLE_RESOURCES = [
	'image',
	'media',
	'font',
	'stylesheet',
	'script',
	'xhr',
	'fetch',
	'other',
	'eventsource',
	'manifest',
	'websocket',
	'texttrack',
] as const;

const BlockableResourceSchema = z.enum(ZENROWS_BLOCKABLE_RESOURCES);

/** The data types the `outputs` filter accepts. */
export const ZENROWS_OUTPUT_FILTERS = [
	'emails',
	'phone_numbers',
	'headings',
	'images',
	'audios',
	'videos',
	'links',
	'menus',
	'hashtags',
	'metadata',
	'tables',
	'favicon',
] as const;

const OutputFilterSchema = z.enum(ZENROWS_OUTPUT_FILTERS);

/** `auto` and `native` return the site's own field names; `standard` is Real Estate only. */
export const ZENROWS_EXTRACT_MODES = ['auto', 'native', 'standard'] as const;

const ExtractModeSchema = z.enum(ZENROWS_EXTRACT_MODES);

/**
 * The browser actions Zenrows documents
 * (https://docs.zenrows.com/fetch/features/js-instructions). A malformed key
 * would be ignored by the browser rather than rejected, so the key set is
 * closed here and each instruction carries exactly one action.
 */
const InstructionSchema = z
	.object({
		click: z.string().min(1).optional(),
		wait_for: z.string().min(1).optional(),
		wait: z.number().int().nonnegative().optional(),
		fill: z.tuple([z.string().min(1), z.string()]).optional(),
		check: z.string().min(1).optional(),
		uncheck: z.string().min(1).optional(),
		select_option: z.tuple([z.string().min(1), z.string()]).optional(),
		scroll_y: z.number().int().optional(),
		scroll_x: z.number().int().optional(),
		evaluate: z.string().min(1).optional(),
	})
	.strict()
	.superRefine((value, ctx) => {
		if (Object.keys(value).length !== 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'an instruction carries exactly one action key',
			});
		}
	});

/**
 * Header names the client owns. `X-API-Key` and `apikey` carry the credential,
 * and `Content-Type` frames the forwarded body; a caller-supplied value for any
 * of them would either break auth or corrupt the request.
 */
export const RESERVED_HEADER_NAMES = ['x-api-key', 'apikey', 'content-type'];

/** The parameters every Fetch call shares. */
const FetchCommonShape = {
	url: TargetUrlSchema.describe('The page to fetch.'),
	mode: z
		.literal('auto')
		.optional()
		.describe(
			'Adaptive Stealth Mode: starts from the cheapest configuration and escalates to rendering or residential proxies only when the target needs it. Rejects `jsRender` and `premiumProxy`.',
		),
	jsRender: z
		.boolean()
		.optional()
		.describe(
			'Render the page in a headless browser first. Defaults to false.',
		),
	headers: z
		.record(z.string().min(1), z.string())
		.refine(
			(value) => Object.keys(value).length > 0,
			'needs at least one header',
		)
		.superRefine((value, ctx) => {
			// The API key and the body's framing are the client's own; letting a
			// caller set them would either weaken auth or corrupt the request.
			for (const name of Object.keys(value)) {
				if (RESERVED_HEADER_NAMES.includes(name.toLowerCase())) {
					ctx.addIssue({
						code: 'custom',
						path: [name],
						message: `${name} is set by Corsair and cannot be forwarded`,
					});
				}
			}
		})
		.optional()
		.describe(
			'Headers to send to the target page, such as { "Referer": "https://www.google.com", "Cookie": "session=..." }. ZenRows forwards every request header when `customHeaders` is on, so the API key moves to the query string for this call. The target sees these exactly as given.',
		),
	customHeaders: z
		.boolean()
		.optional()
		.describe(
			"Forward the caller's own request headers to the page. Implied by `headers`, which turn it on even when this is false, and the API key moves to the query string because ZenRows copies every request header onto the target request.",
		),
	premiumProxy: z
		.boolean()
		.optional()
		.describe('Route through residential IPs. Most protected sites need it.'),
	proxyCountry: z
		.string()
		.regex(/^[A-Za-z]{2}$/, 'must be a two-letter country code')
		.optional()
		.describe(
			'Two-letter exit country, such as "us". Needs `premiumProxy` or `mode: "auto"`.',
		),
	sessionId: PositiveInt.optional().describe(
		'Any integer; requests sharing it leave through the same IP for 10 minutes. It pins the IP, not cookies.',
	),
	originalStatus: z
		.boolean()
		.optional()
		.describe(
			"Answer with the target's own status code instead of Zenrows' one. A 4xx or 5xx from the target then arrives as an error, and the request is still charged.",
		),
	allowedStatusCodes: z
		.array(z.number().int().min(100).max(599))
		.min(1)
		.optional()
		.describe(
			'Status codes whose page body is returned instead of raising an error, such as [404]. The answer is then a 200 carrying that page.',
		),
	waitFor: z
		.string()
		.min(1)
		.optional()
		.describe(
			'CSS selector to wait for before capture. Needs `jsRender`; Zenrows gives up with a 422 after 3 minutes.',
		),
	wait: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe(
			'Milliseconds to wait after load before capture. Needs `jsRender` or `mode: "auto"`. Defaults to 0.',
		),
	blockResources: z
		.array(BlockableResourceSchema)
		.min(1)
		.optional()
		.describe(
			'Resource types to block, such as ["image","font"]. Images and stylesheets are already blocked by default, so this customises that rather than adding to nothing.',
		),
} as const;

type FetchCommonInput = {
	mode?: 'auto';
	jsRender?: boolean;
	headers?: Record<string, string>;
	premiumProxy?: boolean;
	proxyCountry?: string;
	waitFor?: string;
	wait?: number;
};

/**
 * The combinations Zenrows rejects live, checked before the call:
 *
 * - `mode=auto` refuses `js_render` and `premium_proxy`.
 * - `proxy_country` needs `premium_proxy=true` or `mode=auto`.
 * - `js_instructions`, `wait_for` and `json_response` need `js_render=true` or
 *   `mode=auto`. `wait` and `extract_fields` without their companion are
 *   accepted and silently ignored, so both are gated here too.
 */
export function refineFetchCommon(
	value: FetchCommonInput,
	ctx: z.RefinementCtx,
	options: { jsonResponse?: boolean; requiresBrowser?: boolean } = {},
): void {
	if (value.mode === 'auto') {
		if (value.jsRender !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['jsRender'],
				message: 'mode "auto" picks rendering itself; leave jsRender unset',
			});
		}
		if (value.premiumProxy !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['premiumProxy'],
				message: 'mode "auto" picks proxies itself; leave premiumProxy unset',
			});
		}
	}
	const browser = value.jsRender === true || value.mode === 'auto';
	// The spec says proxy_country "Requires premium_proxy"; rendering alone
	// does not unlock it, so only premiumProxy or mode "auto" satisfies it.
	if (
		value.proxyCountry !== undefined &&
		value.mode !== 'auto' &&
		value.premiumProxy !== true
	) {
		ctx.addIssue({
			code: 'custom',
			path: ['proxyCountry'],
			message: 'proxyCountry needs premiumProxy true or mode "auto"',
		});
	}
	if (value.waitFor !== undefined && !browser) {
		ctx.addIssue({
			code: 'custom',
			path: ['waitFor'],
			message: 'waitFor needs jsRender true or mode "auto"',
		});
	}
	if (value.wait !== undefined && !browser) {
		ctx.addIssue({
			code: 'custom',
			path: ['wait'],
			message: 'wait needs jsRender true or mode "auto"',
		});
	}
	if (options.jsonResponse !== undefined && !browser) {
		ctx.addIssue({
			code: 'custom',
			path: [options.jsonResponse ? 'jsonResponse' : 'jsRender'],
			message: 'json_response needs jsRender true or mode "auto"',
		});
	}
	if (options.requiresBrowser && !browser) {
		ctx.addIssue({
			code: 'custom',
			path: ['jsRender'],
			message: 'this mode needs jsRender true or mode "auto"',
		});
	}
}

/** The text modes: the answer is the page itself, not JSON. */
export const ZENROWS_TEXT_RESPONSE_TYPES = [
	'html',
	'markdown',
	'plaintext',
] as const;

// ── fetch.page ────────────────────────────────────────────────────────────

const FetchPageInputSchema = z
	.object({
		...FetchCommonShape,
		responseType: z
			.enum(['markdown', 'plaintext'])
			.optional()
			.describe(
				'Convert the page before returning it. `markdown` and `plaintext` are text; omit it for the HTML as fetched. The PDF conversion is not offered because this client cannot return binary bodies.',
			),
	})
	.superRefine((value, ctx) => {
		refineFetchCommon(value, ctx);
	});

export type FetchPageInput = z.input<typeof FetchPageInputSchema>;

/**
 * A text answer. Zenrows labels HTML, Markdown and plaintext all as
 * `text/plain`, so `responseType` records what was asked for.
 */
const TextResponseSchema = z.object({
	body: z.string(),
	bodyFormat: BodyFormatSchema,
	responseType: z.enum(ZENROWS_TEXT_RESPONSE_TYPES),
});

export type ZenrowsTextResponse = z.infer<typeof TextResponseSchema>;

// ── fetch.browse ──────────────────────────────────────────────────────────

/**
 * Browser actions are a write, not a read. Filling a field, clicking submit,
 * checking a box or running `evaluate` changes the target site, so they are
 * kept out of every read operation's input and given their own operation whose
 * risk level says so. A read-only caller then cannot mutate a site through a
 * read, and a `strict` caller is asked to approve the action.
 */
const FetchBrowseInputSchema = z
	.object({
		...FetchCommonShape,
		jsInstructions: z
			.array(InstructionSchema)
			.min(1)
			.describe(
				'Browser actions run in order before the page is captured, such as {"fill":["#q","x"]} then {"click":"#submit"}. Each instruction carries one action key, and the sequence has 40 seconds.',
			),
		responseType: z
			.enum(['markdown', 'plaintext'])
			.optional()
			.describe(
				'Convert the captured page before returning it. `markdown` and `plaintext` are text; omit it for the HTML as it stands after the actions.',
			),
	})
	.superRefine((value, ctx) => {
		// Browser actions only run inside a rendered page, so this operation
		// always needs `jsRender` or `mode: "auto"`.
		refineFetchCommon(value, ctx, { requiresBrowser: true });
	});

export type FetchBrowseInput = z.input<typeof FetchBrowseInputSchema>;

const BrowseResponseSchema = z.object({
	body: z.string(),
	bodyFormat: BodyFormatSchema,
	responseType: z.enum(ZENROWS_TEXT_RESPONSE_TYPES),
});

export type ZenrowsBrowseResponse = z.infer<typeof BrowseResponseSchema>;

// ── fetch.extract ─────────────────────────────────────────────────────────

const FetchExtractInputSchema = z
	.object({
		...FetchCommonShape,
		extract: ExtractModeSchema.optional().describe(
			"Return structured JSON extracted from the page. `auto` and `native` return the site's own field names; `standard` returns a canonical Real Estate schema. Defaults to `auto`.",
		),
		extractFields: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe(
				'Fields to keep, dot-notated inside a group, such as ["products.name","products.price"]. Omit it for every field.',
			),
	})
	.superRefine((value, ctx) => {
		refineFetchCommon(value, ctx);
		if (value.extractFields !== undefined && value.extract === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['extractFields'],
				message:
					'extractFields only narrows an Extract call; set extract as well',
			});
		}
	});

export type FetchExtractInput = z.input<typeof FetchExtractInputSchema>;

/**
 * `parsed` holds whatever the site or the selector map produced, so it stays an
 * open object. Zenrows answers `{ html, parsed }` for both modes.
 */
const ExtractResponseSchema = z
	.object({
		html: z.string().nullish(),
		parsed: z.record(z.string(), z.json()).nullish(),
	})
	.loose();

export type ZenrowsExtractResponse = z.infer<typeof ExtractResponseSchema>;

// ── fetch.cssExtract ──────────────────────────────────────────────────────

/**
 * A separate operation from `fetch.extract` because the answer is a different
 * shape: Extract answers `{ html, parsed }`, while a selector map answers the
 * extracted keys at the top level with no envelope (both checked live).
 */
const FetchCssExtractInputSchema = z
	.object({
		...FetchCommonShape,
		cssExtractor: z
			.record(z.string().min(1), z.string().min(1))
			.refine(
				(value) => Object.keys(value).length > 0,
				'needs at least one selector',
			)
			.describe(
				'Extraction rules: a map from output key to CSS or XPath selector, such as {"product_name":"h1.title","links":"a @href"}. Append `@attribute` to read an attribute instead of the text. Works on any site, with no preparation.',
			),
	})
	.superRefine((value, ctx) => {
		refineFetchCommon(value, ctx);
	});

export type FetchCssExtractInput = z.input<typeof FetchCssExtractInputSchema>;

/**
 * The extracted keys at the top level, exactly as the map named them. A
 * selector that matched nothing answers `""` rather than omitting the key.
 */
const CssExtractResponseSchema = z.record(z.string(), z.json());

export type ZenrowsCssExtractResponse = z.infer<
	typeof CssExtractResponseSchema
>;

// ── fetch.outputs ─────────────────────────────────────────────────────────

const FetchOutputsInputSchema = z
	.object({
		...FetchCommonShape,
		outputs: z
			.array(OutputFilterSchema)
			.min(1)
			.describe(
				'Data types to pull out of the page. `phone_numbers` also matches `tel:` links; `tables` reads real <table> elements, not CSS grids.',
			),
	})
	.superRefine((value, ctx) => {
		refineFetchCommon(value, ctx);
	});

export type FetchOutputsInput = z.input<typeof FetchOutputsInputSchema>;

/**
 * Filter shapes differ: `emails` is a string array, `tables` an array of
 * objects, `favicon` a string, and a filter that found nothing may come back
 * `null`. Keyed by filter name, valued by whatever that filter produces.
 */
const FetchOutputsResponseSchema = z.record(z.string(), z.json());

export type ZenrowsOutputsResponse = z.infer<typeof FetchOutputsResponseSchema>;

// ── fetch.jsonResponse ────────────────────────────────────────────────────

const FetchJsonResponseInputSchema = z
	.object({
		...FetchCommonShape,
		cssExtractor: z
			.record(z.string().min(1), z.string().min(1))
			.refine(
				(value) => Object.keys(value).length > 0,
				'needs at least one selector',
			)
			.optional()
			.describe(
				'Selectors to apply to the captured page; the result arrives under `css_extractor.data`, keyed as the map named them. Cannot be combined with `outputs`.',
			),
		outputs: z
			.array(OutputFilterSchema)
			.min(1)
			.optional()
			.describe(
				'Data types to pull out of the captured page; the result arrives under `outputs`. Cannot be combined with `cssExtractor`.',
			),
	})
	.superRefine((value, ctx) => {
		refineFetchCommon(value, ctx, { jsonResponse: true });
		// Checked live (11-10): with both set, ZenRows answers the selector
		// results and silently drops `outputs` from the envelope.
		if (value.outputs !== undefined && value.cssExtractor !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['outputs'],
				message:
					'outputs and cssExtractor cannot be combined: ZenRows drops outputs when selectors are set, so send them in two calls',
			});
		}
	});

export type FetchJsonResponseInput = z.input<
	typeof FetchJsonResponseInputSchema
>;

/**
 * The envelope Zenrows builds when `json_response=true`: the captured HTML, the
 * XHR and fetch calls the page made, and one key per extra mode asked for.
 * Selector results sit one level down, in `css_extractor.data` (checked live).
 */
const JsonResponseSchema = z
	.object({
		html: z.string().nullish(),
		/** The XHR and fetch calls the page made. Field names are the browser's. */
		xhr: z.array(z.record(z.string(), z.json())).nullish(),
		outputs: z.record(z.string(), z.json()).nullish(),
		css_extractor: z.record(z.string(), z.json()).nullish(),
		js_instructions_report: z.json().nullish(),
	})
	.loose();

export type ZenrowsJsonResponse = z.infer<typeof JsonResponseSchema>;

// ── fetch.post and fetch.put ──────────────────────────────────────────────

/**
 * A body forwarded to the target. `json` relays an object or array, `form`
 * relays urlencoded fields, and `text` relays any other body verbatim with
 * `contentType` naming what it is.
 */
const ForwardedBodySchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('json'),
		value: z.union([z.record(z.string(), z.json()), z.array(z.json())]),
	}),
	z.object({
		type: z.literal('form'),
		value: z.record(z.string(), z.string()),
	}),
	z.object({
		type: z.literal('text'),
		value: z.string(),
		contentType: z
			.string()
			.min(1)
			// corsair/http re-serialises an object body when the media type is
			// JSON, so a raw string sent as JSON reaches the target
			// double-encoded. A JSON body belongs in the `json` mode above,
			// which sends it as an object.
			.refine(
				(value) => !value.toLowerCase().includes('json'),
				'use body type "json" for a JSON body; a raw string sent as JSON would be re-encoded',
			)
			.describe(
				"The body's own content type, such as text/xml. Not a JSON type.",
			),
	}),
]);

export type ZenrowsForwardedBody = z.infer<typeof ForwardedBodySchema>;

const ForwardedRequestShape = {
	...FetchCommonShape,
	body: ForwardedBodySchema.optional().describe(
		'The body forwarded to the target. Omit it to send the request with no body.',
	),
} as const;

const FetchPostInputSchema = z
	.object(ForwardedRequestShape)
	.superRefine((value, ctx) => {
		refineFetchCommon(value, ctx);
	});

export type FetchPostInput = z.input<typeof FetchPostInputSchema>;

const FetchPutInputSchema = z
	.object(ForwardedRequestShape)
	.superRefine((value, ctx) => {
		refineFetchCommon(value, ctx);
	});

export type FetchPutInput = z.input<typeof FetchPutInputSchema>;

/**
 * A forwarded answer is the target's own page. Zenrows labels it `text/plain`
 * even when the target answered JSON (checked live), and this client reads that
 * as text, so the body is returned verbatim.
 */
const ForwardedResponseSchema = z.object({
	body: z.string(),
	bodyFormat: BodyFormatSchema,
});

export type ZenrowsForwardedResponse = z.infer<typeof ForwardedResponseSchema>;

// ── crawl.start ───────────────────────────────────────────────────────────

/** Zenrows' crawl statuses. `completed` and `failed` are terminal; `stopped` is too. */
export const ZENROWS_CRAWL_STATUSES = [
	'running',
	'completed',
	'stopped',
	'failed',
] as const;

export const ZENROWS_CRAWL_DONE_STATUSES = ['completed'] as const;
export const ZENROWS_CRAWL_FAILED_STATUSES = ['stopped', 'failed'] as const;

const CrawlErrorSchema = z
	.object({
		code: z.string().nullish(),
		detail: z.string().nullish(),
	})
	.loose();

const CrawlCoverageSchema = z
	.object({
		pages_fetched: z.number().nullish(),
		pages_failed: z.number().nullish(),
		items_found: z.number().nullish(),
	})
	.loose();

/** One URL the crawl kept. `content_url` and `content_status` need `outputFormat`. */
const CrawlResultSchema = z
	.object({
		url: z.string(),
		content_status: z.string().nullish(),
		content_url: z.string().nullish(),
	})
	.loose();

export type ZenrowsCrawlResult = z.infer<typeof CrawlResultSchema>;

/** A crawl without its results, as the list endpoint returns it. */
const CrawlSummarySchema = z
	.object({
		crawl_id: z.string(),
		status: z.string(),
		stop_reason: z.string().nullish(),
		error: CrawlErrorSchema.nullish(),
		url: z.string().nullish(),
		depth: z.number().nullish(),
		max_items: z.number().nullish(),
		max_pages: z.number().nullish(),
		include_patterns: z.array(z.string()).nullish(),
		exclude_patterns: z.array(z.string()).nullish(),
		output_format: z.string().nullish(),
		discovery: z.array(z.string()).nullish(),
		coverage: CrawlCoverageSchema.nullish(),
		duplicates_removed: z.number().nullish(),
		created_at: z.string().nullish(),
		finished_at: z.string().nullish(),
	})
	.loose();

export type ZenrowsCrawl = z.infer<typeof CrawlSummarySchema>;

/** A crawl plus one page of its results. */
const CrawlSchema = CrawlSummarySchema.extend({
	results: z.array(CrawlResultSchema).nullish(),
	next_cursor: z.string().nullish(),
}).loose();

export type ZenrowsCrawlWithResults = z.infer<typeof CrawlSchema>;

const StartCrawlInputSchema = z.object({
	url: TargetUrlSchema.describe(
		'The start URL. The crawl stays on its domain, subdomains included, and never opens a link that would change something, such as a checkout or unsubscribe.',
	),
	depth: z
		.number()
		.int()
		.min(1)
		.max(100000)
		.optional()
		.describe(
			'How many link steps to follow. At 1, the links on the start page. Omit it to follow links until `maxItems` or `maxPages` stops the crawl.',
		),
	maxItems: z
		.number()
		.int()
		.min(1)
		.max(100000)
		.optional()
		.describe('Stop after keeping this many URLs. Zenrows defaults to 100.'),
	maxPages: z
		.number()
		.int()
		.min(1)
		.max(100000)
		.optional()
		.describe(
			'Stop after fetching this many pages. Zenrows defaults to 100. This is the cost cap: each page is one billed Fetch request.',
		),
	includePatterns: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Keep and open only URLs containing at least one of these texts, such as "/product/". The start URL is never returned itself.',
		),
	excludePatterns: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Drop URLs containing any of these texts, even when they match an include pattern.',
		),
	outputFormat: z
		.enum(['html', 'markdown'])
		.optional()
		.describe(
			'Also return each kept page: `html` as fetched, `markdown` converted. Omit it to get URLs only.',
		),
	webhookUrl: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'must be https')
		.optional()
		.describe(
			'Send crawl events here. The host must resolve publicly, the account needs a webhook signing key, and the URL cannot change once the crawl starts.',
		),
	webhookEvents: z
		.array(
			z.enum([
				'crawl.started',
				'crawl.completed',
				'crawl.stopped',
				'crawl.failed',
			]),
		)
		.min(1)
		.optional()
		.describe('Events to send. Omit it for all four.'),
	webhookMetadata: z
		.record(z.string().min(1).max(64), z.json())
		.optional()
		.describe(
			'Up to 20 keys of your own, echoed back in every event so a delivery can be matched to your records.',
		),
	idempotencyKey: z
		.string()
		.min(1)
		.max(255)
		.optional()
		.describe(
			'The same key with the same body returns the original crawl instead of starting a second one.',
		),
});

export type StartCrawlInput = z.input<typeof StartCrawlInputSchema>;

/** `202` answers the running crawl. */
const StartCrawlResponseSchema = CrawlSchema;

export type StartCrawlResponse = z.infer<typeof StartCrawlResponseSchema>;

// ── crawl.list ────────────────────────────────────────────────────────────

const ListCrawlsInputSchema = z.object({
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe('The `next_cursor` from the previous page.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('How many crawls to return. Zenrows defaults to 20.'),
});

export type ListCrawlsInput = z.input<typeof ListCrawlsInputSchema>;

const ListCrawlsResponseSchema = z.object({
	crawls: z.array(CrawlSummarySchema),
	next_cursor: z
		.string()
		.nullish()
		.describe(
			'Send it as `cursor` for the next page. Absent on the last page.',
		),
});

export type ListCrawlsResponse = z.infer<typeof ListCrawlsResponseSchema>;

// ── crawl.get ─────────────────────────────────────────────────────────────

const GetCrawlInputSchema = z.object({
	crawlId: z
		.string()
		.min(1)
		.describe('The `crawl_id` that `crawl.start` returned.'),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The `next_cursor` from the previous read. Each URL is returned once, so poll with the same cursor to get only new ones. It is null once the crawl has ended and its last results were read.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(10000)
		.optional()
		.describe('How many results to return. Zenrows defaults to 1000.'),
});

export type GetCrawlInput = z.input<typeof GetCrawlInputSchema>;

const GetCrawlResponseSchema = CrawlSchema;

export type GetCrawlResponse = z.infer<typeof GetCrawlResponseSchema>;

// ── crawl.getContent ──────────────────────────────────────────────────────

const GetCrawlContentInputSchema = z.object({
	crawlId: z.string().min(1).describe('The crawl the page belongs to.'),
	contentId: z
		.string()
		.min(1)
		.describe(
			"The last path segment of a result's `content_url`, which `crawl.get` returns for a crawl started with `outputFormat`.",
		),
	download: z
		.boolean()
		.optional()
		.describe(
			'Ask Zenrows to label the answer as a file to save. The bytes are the same.',
		),
});

export type GetCrawlContentInput = z.input<typeof GetCrawlContentInputSchema>;

/** The page in the crawl's `output_format`: HTML as fetched, or Markdown. */
const GetCrawlContentResponseSchema = z.object({
	body: z.string(),
	bodyFormat: BodyFormatSchema,
});

export type GetCrawlContentResponse = z.infer<
	typeof GetCrawlContentResponseSchema
>;

// ── crawl.stop ────────────────────────────────────────────────────────────

const StopCrawlInputSchema = z.object({
	crawlId: z.string().min(1).describe('The crawl to stop.'),
});

export type StopCrawlInput = z.input<typeof StopCrawlInputSchema>;

/**
 * A stop answers four fields only. A crawl that had already ended returns its
 * final state instead of a new stop.
 */
const StopCrawlResponseSchema = z
	.object({
		crawl_id: z.string(),
		status: z.string(),
		stop_reason: z.string().nullish(),
		finished_at: z.string().nullish(),
	})
	.loose();

export type StopCrawlResponse = z.infer<typeof StopCrawlResponseSchema>;

// ── extract.domains ───────────────────────────────────────────────────────

const ListExtractDomainsInputSchema = z.object({});

export type ListExtractDomainsInput = z.infer<
	typeof ListExtractDomainsInputSchema
>;

const ExtractDomainSchema = z
	.object({
		domain: z.string(),
		verticals: z.array(z.string()).nullish(),
		warm: z.boolean().nullish(),
	})
	.loose();

export type ZenrowsExtractDomain = z.infer<typeof ExtractDomainSchema>;

const ListExtractDomainsResponseSchema = z.object({
	domains: z.array(ExtractDomainSchema),
});

export type ListExtractDomainsResponse = z.infer<
	typeof ListExtractDomainsResponseSchema
>;

// ── extract.prepareDomain ─────────────────────────────────────────────────

const PrepareExtractDomainInputSchema = z.object({
	domain: z
		.string()
		.min(1)
		.regex(/^[^\s/]+$/, 'must be a bare domain, without a scheme or path')
		.describe(
			'The domain to prepare, without scheme: "example.com". Zenrows drops a leading `www.`, and prepares each subdomain separately.',
		),
	exampleUrls: z
		.array(TargetUrlSchema)
		.min(1)
		.max(5)
		.optional()
		.describe(
			'1 to 5 URLs on that domain. Three or more of the same page type work best, because Extract compares them. Zenrows answers 400 without them for a domain that is not already ready. For a ready domain, the call returns its record.',
		),
	idempotencyKey: z
		.string()
		.min(1)
		.max(255)
		.optional()
		.describe(
			'The same key with the same body returns the original submission; a different body answers 409.',
		),
});

export type PrepareExtractDomainInput = z.input<
	typeof PrepareExtractDomainInputSchema
>;

const ExtractPreparationRoleSchema = z
	.object({
		role: z.string().nullish(),
		status: z.string().nullish(),
		url: z.string().nullish(),
		detail: z.string().nullish(),
	})
	.loose();

const ExtractPreparationFailureSchema = z
	.object({
		code: z.string().nullish(),
		detail: z.string().nullish(),
		slot_consumed: z.boolean().nullish(),
	})
	.loose();

/** Branch on `status` (`preparing`, `ready`, `failed`); `state` is the finer step. */
const ExtractPreparationSchema = z
	.object({
		domain: z.string(),
		status: z.string(),
		state: z.string().nullish(),
		roles: z.array(ExtractPreparationRoleSchema).nullish(),
		failure: ExtractPreparationFailureSchema.nullish(),
		submitted_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type ZenrowsExtractPreparation = z.infer<
	typeof ExtractPreparationSchema
>;

const PrepareExtractDomainResponseSchema = ExtractPreparationSchema;

export type PrepareExtractDomainResponse = z.infer<
	typeof PrepareExtractDomainResponseSchema
>;

// ── extract.getDomainStatus ───────────────────────────────────────────────

const GetExtractDomainStatusInputSchema = z.object({
	domain: z
		.string()
		.min(1)
		.describe('The domain to read the preparation of, without scheme.'),
});

export type GetExtractDomainStatusInput = z.input<
	typeof GetExtractDomainStatusInputSchema
>;

const GetExtractDomainStatusResponseSchema = ExtractPreparationSchema;

export type GetExtractDomainStatusResponse = z.infer<
	typeof GetExtractDomainStatusResponseSchema
>;

// ── extract.listPreparedDomains ───────────────────────────────────────────

const ListExtractPreparedDomainsInputSchema = z.object({});

export type ListExtractPreparedDomainsInput = z.infer<
	typeof ListExtractPreparedDomainsInputSchema
>;

/** Domains this account can still ask to have prepared this calendar month. */
const ExtractAllowanceSchema = z
	.object({
		used: z.number().nullish(),
		limit: z.number().nullish(),
		remaining: z.number().nullish(),
		month: z.string().nullish(),
	})
	.loose();

const ListExtractPreparedDomainsResponseSchema = z.object({
	domains: z.array(ExtractPreparationSchema),
	allowance: ExtractAllowanceSchema.nullish(),
});

export type ListExtractPreparedDomainsResponse = z.infer<
	typeof ListExtractPreparedDomainsResponseSchema
>;

// ── extract.allowance ─────────────────────────────────────────────────────

const GetExtractAllowanceInputSchema = z.object({});

export type GetExtractAllowanceInput = z.infer<
	typeof GetExtractAllowanceInputSchema
>;

const GetExtractAllowanceResponseSchema = ExtractAllowanceSchema;

export type GetExtractAllowanceResponse = z.infer<
	typeof GetExtractAllowanceResponseSchema
>;

// ── account.subscription ──────────────────────────────────────────────────

const GetSubscriptionInputSchema = z.object({});

export type GetSubscriptionInput = z.infer<typeof GetSubscriptionInputSchema>;

const ProductUsageSchema = z
	.object({
		name: z.string().nullish(),
		usage: z.number().nullish(),
		usage_credits: z.number().nullish(),
		concurrency: z
			.object({ limit: z.number().nullish(), usage: z.number().nullish() })
			.loose()
			.nullish(),
	})
	.loose();

const SubscriptionSchema = z
	.object({
		status: z.string().nullish(),
		period_starts_at: z.string().nullish(),
		period_ends_at: z.string().nullish(),
		/** Spend this period, in US dollars. */
		usage: z.number().nullish(),
		usage_credits: z.number().nullish(),
		credit_limit: z.number().nullish(),
		usage_percent: z.number().nullish(),
		plan: z
			.object({
				name: z.string().nullish(),
				price: z.number().nullish(),
				unit_cost: z.number().nullish(),
				recurrence: z.string().nullish(),
				/** Keyed by product id: api, extract, scraping_browser, proxy_residential, data_apis. */
				products: z.record(z.string(), ProductUsageSchema).nullish(),
			})
			.loose()
			.nullish(),
		/** Credit top-ups bought this period. Fields are Zenrows'. */
		top_ups: z.array(z.record(z.string(), z.json())).nullish(),
		api_key: z
			.object({
				caps: z.array(z.record(z.string(), z.json())).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type ZenrowsSubscription = z.infer<typeof SubscriptionSchema>;

const GetSubscriptionResponseSchema = SubscriptionSchema;

export type GetSubscriptionResponse = z.infer<
	typeof GetSubscriptionResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ZenRowsEndpointInputs = {
	fetchPage: FetchPageInput;
	fetchBrowse: FetchBrowseInput;
	fetchExtract: FetchExtractInput;
	fetchCssExtract: FetchCssExtractInput;
	fetchOutputs: FetchOutputsInput;
	fetchJsonResponse: FetchJsonResponseInput;
	fetchPost: FetchPostInput;
	fetchPut: FetchPutInput;
	crawlStart: StartCrawlInput;
	crawlList: ListCrawlsInput;
	crawlGet: GetCrawlInput;
	crawlGetContent: GetCrawlContentInput;
	crawlStop: StopCrawlInput;
	extractDomains: ListExtractDomainsInput;
	extractPrepareDomain: PrepareExtractDomainInput;
	extractGetDomainStatus: GetExtractDomainStatusInput;
	extractListPreparedDomains: ListExtractPreparedDomainsInput;
	extractAllowance: GetExtractAllowanceInput;
	accountSubscription: GetSubscriptionInput;
};

export type ZenRowsEndpointOutputs = {
	fetchPage: ZenrowsTextResponse;
	fetchBrowse: ZenrowsBrowseResponse;
	fetchExtract: ZenrowsExtractResponse;
	fetchCssExtract: ZenrowsCssExtractResponse;
	fetchOutputs: ZenrowsOutputsResponse;
	fetchJsonResponse: ZenrowsJsonResponse;
	fetchPost: ZenrowsForwardedResponse;
	fetchPut: ZenrowsForwardedResponse;
	crawlStart: StartCrawlResponse;
	crawlList: ListCrawlsResponse;
	crawlGet: GetCrawlResponse;
	crawlGetContent: GetCrawlContentResponse;
	crawlStop: StopCrawlResponse;
	extractDomains: ListExtractDomainsResponse;
	extractPrepareDomain: PrepareExtractDomainResponse;
	extractGetDomainStatus: GetExtractDomainStatusResponse;
	extractListPreparedDomains: ListExtractPreparedDomainsResponse;
	extractAllowance: GetExtractAllowanceResponse;
	accountSubscription: GetSubscriptionResponse;
};

export const ZenRowsEndpointInputSchemas = {
	fetchPage: FetchPageInputSchema,
	fetchBrowse: FetchBrowseInputSchema,
	fetchExtract: FetchExtractInputSchema,
	fetchCssExtract: FetchCssExtractInputSchema,
	fetchOutputs: FetchOutputsInputSchema,
	fetchJsonResponse: FetchJsonResponseInputSchema,
	fetchPost: FetchPostInputSchema,
	fetchPut: FetchPutInputSchema,
	crawlStart: StartCrawlInputSchema,
	crawlList: ListCrawlsInputSchema,
	crawlGet: GetCrawlInputSchema,
	crawlGetContent: GetCrawlContentInputSchema,
	crawlStop: StopCrawlInputSchema,
	extractDomains: ListExtractDomainsInputSchema,
	extractPrepareDomain: PrepareExtractDomainInputSchema,
	extractGetDomainStatus: GetExtractDomainStatusInputSchema,
	extractListPreparedDomains: ListExtractPreparedDomainsInputSchema,
	extractAllowance: GetExtractAllowanceInputSchema,
	accountSubscription: GetSubscriptionInputSchema,
} as const;

export const ZenRowsEndpointOutputSchemas = {
	fetchPage: TextResponseSchema,
	fetchBrowse: BrowseResponseSchema,
	fetchExtract: ExtractResponseSchema,
	fetchCssExtract: CssExtractResponseSchema,
	fetchOutputs: FetchOutputsResponseSchema,
	fetchJsonResponse: JsonResponseSchema,
	fetchPost: ForwardedResponseSchema,
	fetchPut: ForwardedResponseSchema,
	crawlStart: StartCrawlResponseSchema,
	crawlList: ListCrawlsResponseSchema,
	crawlGet: GetCrawlResponseSchema,
	crawlGetContent: GetCrawlContentResponseSchema,
	crawlStop: StopCrawlResponseSchema,
	extractDomains: ListExtractDomainsResponseSchema,
	extractPrepareDomain: PrepareExtractDomainResponseSchema,
	extractGetDomainStatus: GetExtractDomainStatusResponseSchema,
	extractListPreparedDomains: ListExtractPreparedDomainsResponseSchema,
	extractAllowance: GetExtractAllowanceResponseSchema,
	accountSubscription: GetSubscriptionResponseSchema,
} as const;
