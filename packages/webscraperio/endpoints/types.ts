import { z } from 'zod';

// Inputs use the Cloud API's own parameter names. Outputs are `.loose()` and
// their documented fields nullish. Field names follow the provider's OpenAPI
// spec (https://webscraper.io/openapi.yaml).
//
// This plugin wraps the sitemap list, read and import routes and the account
// route. The API also serves sitemap update and delete, schedulers, tags and
// the scraping-job routes; those are not wrapped here yet.

/**
 * A sitemap, which is the Cloud product's scraping configuration. The list
 * returns `id` and `name`; a single read adds `sitemap`, the definition itself
 * as a JSON string (start URLs and selectors).
 */
const SitemapSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		sitemap: z
			.string()
			.nullish()
			.describe(
				'The sitemap definition as a JSON string: `_id`, `startUrl` and `selectors`, in the form the browser extension exports.',
			),
	})
	.loose();

export type WebscraperioSitemap = z.infer<typeof SitemapSchema>;

/** The Cloud API wraps its answers in `{ success, data }`. */
const SitemapResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		data: SitemapSchema.nullish(),
	})
	.loose();

export type SitemapResponse = z.infer<typeof SitemapResponseSchema>;

/**
 * The list is paginated by a 1-based `page`; the response reports `current_page`
 * and `last_page`, so a caller pages until it reaches `last_page`.
 */
const SitemapsListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('The page to return, 1-based. Defaults to 1.'),
	tag: z
		.string()
		.min(1)
		.optional()
		.describe('Only return sitemaps carrying this tag.'),
});

export type SitemapsListInput = z.infer<typeof SitemapsListInputSchema>;

/**
 * A list answer: `data` is a flat array of `{ id, name }`, and the page fields
 * sit at the root beside it.
 */
const SitemapsListResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		data: z.array(SitemapSchema).nullish(),
		current_page: z.number().nullish(),
		last_page: z.number().nullish(),
		total: z.number().nullish(),
		per_page: z.number().nullish(),
	})
	.loose();

export type SitemapsListResponse = z.infer<typeof SitemapsListResponseSchema>;

const SitemapsGetInputSchema = z.object({
	id: z
		.number()
		.int()
		.positive()
		.describe('The sitemap id, from sitemaps.list.'),
});

export type SitemapsGetInput = z.infer<typeof SitemapsGetInputSchema>;

/**
 * Creates a sitemap from a selector configuration. `sitemap` is the JSON the
 * Web Scraper app exports, so its shape belongs to the builder and is passed
 * through unchanged rather than modelled here.
 */
const SitemapsCreateInputSchema = z.object({
	sitemap: z
		.record(z.string(), z.unknown())
		.describe(
			'The sitemap definition in the form the browser extension exports: `_id`, `startUrl` (an array of URLs) and `selectors`.',
		),
});

export type SitemapsCreateInput = z.infer<typeof SitemapsCreateInputSchema>;

/**
 * The user behind the token and the page credits left on the account. This is
 * also the cheapest way to check that a token works.
 */
const AccountSchema = z
	.object({
		email: z.string().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		// Page credits are what a scrape spends, one per page loaded.
		page_credits: z.number().nullish(),
	})
	.loose();

export type WebscraperioAccount = z.infer<typeof AccountSchema>;

const AccountGetInputSchema = z.object({});

export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

const AccountResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		data: AccountSchema.nullish(),
	})
	.loose();

export type AccountResponse = z.infer<typeof AccountResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type WebscraperioEndpointInputs = {
	sitemapsList: SitemapsListInput;
	sitemapsGet: SitemapsGetInput;
	sitemapsCreate: SitemapsCreateInput;
	accountGet: AccountGetInput;
};

export type WebscraperioEndpointOutputs = {
	sitemapsList: SitemapsListResponse;
	sitemapsGet: SitemapResponse;
	sitemapsCreate: SitemapResponse;
	accountGet: AccountResponse;
};

export const WebscraperioEndpointInputSchemas = {
	sitemapsList: SitemapsListInputSchema,
	sitemapsGet: SitemapsGetInputSchema,
	sitemapsCreate: SitemapsCreateInputSchema,
	accountGet: AccountGetInputSchema,
} as const;

export const WebscraperioEndpointOutputSchemas = {
	sitemapsList: SitemapsListResponseSchema,
	sitemapsGet: SitemapResponseSchema,
	sitemapsCreate: SitemapResponseSchema,
	accountGet: AccountResponseSchema,
} as const;
