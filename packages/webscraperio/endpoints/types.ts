import { z } from 'zod';

// Inputs use the Cloud API's own parameter names. Outputs are `.loose()` and
// their documented fields nullish.
//
// The Cloud API's public v1 surface is deliberately small: list sitemaps, read
// one, create one, and read the account. The scraping jobs and their data live
// behind the web app rather than these routes, so the plugin wraps what the API
// actually serves instead of inventing endpoints.

/**
 * A sitemap, which is the Cloud product's scraping configuration: it holds the
 * selectors and the URL list, and its `status` says whether it is running.
 */
const SitemapSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		url: z
			.string()
			.nullish()
			.describe('The starting page the scrape begins from.'),
		status: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		// The selector tree, which is what defines what gets scraped.
		selectors: z.array(z.record(z.string(), z.unknown())).nullish(),
		// The URL list a scrape will visit.
		start_urls: z.array(z.record(z.string(), z.unknown())).nullish(),
		jobs: z.array(z.record(z.string(), z.unknown())).nullish(),
		jobs_count: z.number().nullish(),
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

const SitemapsListInputSchema = z.object({});

export type SitemapsListInput = z.infer<typeof SitemapsListInputSchema>;

/**
 * A list answer. The API may return `data` as an array or paginate it under a
 * `data.data` shape, so both are accepted.
 */
const SitemapsListResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		data: z
			.union([
				z.array(SitemapSchema),
				z
					.object({
						data: z.array(SitemapSchema).nullish(),
						total: z.number().nullish(),
						current_page: z.number().nullish(),
						last_page: z.number().nullish(),
					})
					.loose()
					.nullish(),
			])
			.nullish(),
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
			'The sitemap definition: `_id`, name, startUrl, selectors and startUrls, in the form the browser extension exports.',
		),
});

export type SitemapsCreateInput = z.infer<typeof SitemapsCreateInputSchema>;

/**
 * The account behind the token: its plan and how much of the allowance is used.
 * This is also the cheapest way to check that a token works.
 */
const AccountSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		plan: z.string().nullish(),
		// The monthly page allowance, which is what a scrape spends.
		pages_allowed: z.number().nullish(),
		pages_used: z.number().nullish(),
		scraping_jobs_allowed: z.number().nullish(),
		scraping_jobs_used: z.number().nullish(),
		created_at: z.string().nullish(),
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
