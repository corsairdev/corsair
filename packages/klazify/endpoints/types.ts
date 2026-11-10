import { z } from 'zod';

// Klazify takes one target per call: a `url` or an `email`, plus an optional
// `refresh` that forces a live crawl instead of the cached copy. Outputs are
// `.loose()` and their nullable fields `.nullish()`, because Klazify's own docs
// mark logo, city, state, revenue and funding as possibly null.

/**
 * The shared request body. Klazify documents `url` or `email` as the required
 * target, so the pair is checked here rather than left to a round trip.
 */
export const KlazifyTargetSchema = z
	.object({
		url: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The URL to classify, e.g. `https://apple.com`. Give this or `email`.',
			),
		email: z
			.string()
			.min(1)
			.optional()
			.describe(
				'An email address to classify by its domain. Give this or `url`.',
			),
		refresh: z
			.boolean()
			.optional()
			.describe(
				'Force a live crawl instead of returning the cached result. Slower, and the docs offer it on every paid plan including Starter. Omit it to reuse the cached classification.',
			),
	})
	.superRefine((input, ctx) => {
		if (input.url === undefined && input.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message: 'Give either `url` or `email` as the target to classify.',
			});
		}
	});

export type KlazifyTarget = z.input<typeof KlazifyTargetSchema>;

// ── shared response pieces ────────────────────────────────────────────────

/**
 * A category with its confidence. Klazify returns 0 to 1 where 1 is an exact
 * match, and the IAB endpoint adds dynamic `IAB*` keys beside `name`, so the
 * object is loose rather than fixed.
 */
export const KlazifyCategorySchema = z
	.object({
		name: z.string().describe('The Klazify category path, e.g. `/News/Other`.'),
		confidence: z
			.number()
			.nullish()
			.describe('Decimal 0 to 1. 1 is an exact match.'),
	})
	.loose();

export type KlazifyCategory = z.infer<typeof KlazifyCategorySchema>;

const KlazifySocialMediaSchema = z
	.object({
		facebook_url: z.string().nullish(),
		twitter_url: z.string().nullish(),
		instagram_url: z.string().nullish(),
		youtube_url: z.string().nullish(),
		linkedin_url: z.string().nullish(),
		github_url: z.string().nullish(),
		pinterest_url: z.string().nullish(),
	})
	.loose();

const KlazifyCompanySchema = z
	.object({
		name: z.string().nullish(),
		city: z.string().nullish(),
		stateCode: z.string().nullish(),
		countryCode: z
			.string()
			.nullish()
			.describe('ISO 3166-1 alpha-2, e.g. `US`.'),
		employeesRange: z
			.string()
			.nullish()
			.describe('e.g. `1K-5K`. Klazify documents `1-10` through `100K+`.'),
		revenue: z
			.string()
			.nullish()
			.describe('Annual revenue range, e.g. `$1M-$10M`.'),
		raised: z.string().nullish().describe('Total funding, e.g. `$50M`.'),
		tags: z.array(z.string()).nullish(),
		tech: z
			.array(z.string())
			.nullish()
			.describe(
				'Lowercase snake_case technology identifiers, e.g. `wordpress`.',
			),
	})
	.loose();

export type KlazifyCompany = z.infer<typeof KlazifyCompanySchema>;

/**
 * Every endpoint answers with `success`, and a failure can arrive with a 2xx in
 * some Klazify responses, so the flag is required rather than assumed.
 */
const successSchema = {
	success: z.boolean().describe('False when the classification failed.'),
};

// ── categorize.all ────────────────────────────────────────────────────────

export const KlazifyCategorizeInputSchema = KlazifyTargetSchema;

export type KlazifyCategorizeInput = KlazifyTarget;

export const KlazifyCategorizeResponseSchema = z
	.object({
		...successSchema,
		domain: z
			.object({
				categories: z.array(KlazifyCategorySchema).nullish(),
				domain_url: z.string().nullish(),
				logo_url: z.string().nullish(),
				social_media: KlazifySocialMediaSchema.nullish(),
			})
			.loose(),
		objects: z
			.object({ company: KlazifyCompanySchema.nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export type KlazifyCategorizeResponse = z.infer<
	typeof KlazifyCategorizeResponseSchema
>;

// ── categorize.realtime ───────────────────────────────────────────────────

export const KlazifyRealtimeInputSchema = KlazifyTargetSchema;

export const KlazifyRealtimeResponseSchema = z
	.object({
		...successSchema,
		domain: z
			.object({
				categories: z.array(KlazifyCategorySchema).nullish(),
				domain_url: z.string().nullish(),
				updated_at: z.string().nullish(),
			})
			.loose(),
	})
	.loose();

export type KlazifyRealtimeResponse = z.infer<
	typeof KlazifyRealtimeResponseSchema
>;

// ── categories.iab ────────────────────────────────────────────────────────

export const KlazifyIabInputSchema = KlazifyTargetSchema;

export const KlazifyIabResponseSchema = KlazifyRealtimeResponseSchema;

export type KlazifyIabResponse = KlazifyRealtimeResponse;

// ── company.get / tech.get / logo.get ─────────────────────────────────────

export const KlazifyCompanyInputSchema = KlazifyTargetSchema;

export const KlazifyCompanyResponseSchema = z
	.object({
		...successSchema,
		objects: z.object({ company: KlazifyCompanySchema }).loose(),
	})
	.loose();

export type KlazifyCompanyResponse = z.infer<
	typeof KlazifyCompanyResponseSchema
>;

export const KlazifyTechInputSchema = KlazifyTargetSchema;

export const KlazifyTechResponseSchema = z
	.object({
		...successSchema,
		domain: z
			.object({
				domain_url: z.string().nullish(),
				updated_at: z.string().nullish(),
			})
			.loose(),
		objects: z
			.object({
				company: z.object({ tech: z.array(z.string()).nullish() }).loose(),
			})
			.loose(),
	})
	.loose();

export type KlazifyTechResponse = z.infer<typeof KlazifyTechResponseSchema>;

export const KlazifyLogoInputSchema = KlazifyTargetSchema;

export const KlazifyLogoResponseSchema = z
	.object({
		...successSchema,
		domain: z
			.object({
				domain_url: z.string().nullish(),
				// A logo Klazify could not find is null or an empty string.
				logo_url: z.string().nullish(),
				updated_at: z.string().nullish(),
			})
			.loose(),
	})
	.loose();

export type KlazifyLogoResponse = z.infer<typeof KlazifyLogoResponseSchema>;

// ── domain.get ────────────────────────────────────────────────────────────

export const KlazifyDomainInputSchema = KlazifyTargetSchema;

export const KlazifyDomainResponseSchema = z
	.object({
		...successSchema,
		domain_registration_data: z
			.object({
				domain_age_date: z
					.string()
					.nullish()
					.describe('Registration date, `YYYY-MM-DD`.'),
				domain_age_days_ago: z.number().nullish(),
				domain_expiration_date: z
					.string()
					.nullish()
					.describe('Expiry date, `YYYY-MM-DD`.'),
				domain_expiration_days_left: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type KlazifyDomainResponse = z.infer<typeof KlazifyDomainResponseSchema>;

// ── similarDomains.get ────────────────────────────────────────────────────

export const KlazifySimilarDomainsInputSchema = KlazifyTargetSchema;

export const KlazifySimilarDomainsResponseSchema = z
	.object({
		...successSchema,
		domain: z
			.object({
				domain_url: z.string().nullish(),
				// Klazify documents up to 10 related domain URLs.
				similar_domains: z.array(z.string()).nullish(),
				updated_at: z.string().nullish(),
			})
			.loose(),
	})
	.loose();

export type KlazifySimilarDomainsResponse = z.infer<
	typeof KlazifySimilarDomainsResponseSchema
>;

// ── traffic.get ───────────────────────────────────────────────────────────

export const KlazifyTrafficInputSchema = KlazifyTargetSchema;

export const KlazifyTrafficResponseSchema = z
	.object({
		...successSchema,
		traffic_intelligence: z
			.object({
				global_rank: z.number().nullish(),
				country_rank: z
					.object({
						country_code: z.string().nullish(),
						rank: z.number().nullish(),
					})
					.loose()
					.nullish(),
				category_rank: z
					.object({
						category: z.string().nullish(),
						// The docs call this a string, so it is declared as one.
						rank: z.string().nullish(),
					})
					.loose()
					.nullish(),
				// Keyed by `YYYY-MM`, with absolute visit counts.
				monthly_visits: z.record(z.string(), z.number()).nullish(),
				engagement: z
					.object({
						// Klazify sends these as decimal strings, not numbers.
						bounce_rate: z.string().nullish(),
						pages_per_visit: z.string().nullish(),
						time_on_site_seconds: z.string().nullish(),
					})
					.loose()
					.nullish(),
				traffic_sources: z
					.record(z.string(), z.union([z.number(), z.string()]))
					.nullish(),
				top_countries: z
					.array(
						z
							.object({
								country_code: z.string().nullish(),
								share: z.number().nullish(),
							})
							.loose(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type KlazifyTrafficResponse = z.infer<
	typeof KlazifyTrafficResponseSchema
>;

// ── categories.listV1 / listV2 ────────────────────────────────────────────

export const KlazifyCategoryListInputSchema = z.object({});

export const KlazifyCategoryListResponseSchema = z
	.object({
		...successSchema,
		version: z.string().describe('`v1` or `v2`, matching the taxonomy.'),
		count: z.number().describe('620 for v1, 1091 for v2.'),
		categories: z
			.array(z.string())
			.describe('Full category paths, each starting with `/`.'),
	})
	.loose();

export type KlazifyCategoryListResponse = z.infer<
	typeof KlazifyCategoryListResponseSchema
>;

// ── discovery.search ──────────────────────────────────────────────────────

/**
 * The employee buckets the discovery index stores. Legacy spellings are mapped
 * by Klazify, but only the stored values are offered so a caller cannot send a
 * spelling that resolves to nothing.
 */
export const KLAZIFY_EMPLOYEE_RANGES = [
	'1-10',
	'11-50',
	'51-250',
	'251-1K',
	'1K-5K',
	'5K-10K',
	'10K-50K',
	'50K-100K',
	'100K+',
] as const;

export const KLAZIFY_DISCOVERY_SORTS = [
	'global_rank',
	'domain',
	'company_name',
	'monthly_visits_latest',
] as const;

export const KlazifyDiscoveryInputSchema = z.object({
	top_n: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'Only domains with a global rank at or below this are searched. Unranked domains are excluded when it is set.',
		),
	filters: z
		.object({
			category: z.string().optional(),
			country: z
				.string()
				.optional()
				.describe(
					'Company HQ country, not traffic audience. ISO alpha-2 or a name.',
				),
			tech: z
				.string()
				.optional()
				.describe('A snake_case technology identifier.'),
			employees: z.enum(KLAZIFY_EMPLOYEE_RANGES).optional(),
			has_company: z.boolean().optional(),
			tld: z
				.string()
				.optional()
				.describe(
					'One suffix or a comma-separated list, e.g. `com.br` or `com, jp`.',
				),
		})
		.optional(),
	q: z
		.string()
		.optional()
		.describe('Free-text search across domain, company and category.'),
	sort: z.enum(KLAZIFY_DISCOVERY_SORTS).optional(),
	sort_dir: z.enum(['asc', 'desc']).optional(),
	page: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Page number. Each page holds 100 results.'),
});

export type KlazifyDiscoveryInput = z.input<typeof KlazifyDiscoveryInputSchema>;

const KlazifyDiscoveryResultSchema = z
	.object({
		domain: z.string().nullish(),
		company_name: z.string().nullish(),
		company_country: z.string().nullish(),
		company_employees: z.string().nullish(),
		company_revenue: z.string().nullish(),
		primary_category: z.string().nullish(),
		primary_iab: z.string().nullish(),
		global_rank: z.number().nullish(),
		monthly_visits_latest: z.number().nullish(),
	})
	.loose();

export const KlazifyDiscoveryResponseSchema = z
	.object({
		total: z.number(),
		total_pages: z.number(),
		// Present and true only when a `tld` filter exhausted its candidate scan.
		total_is_lower_bound: z.boolean().optional(),
		results: z.array(KlazifyDiscoveryResultSchema),
	})
	.loose();

export type KlazifyDiscoveryResponse = z.infer<
	typeof KlazifyDiscoveryResponseSchema
>;

// ── registry ──────────────────────────────────────────────────────────────

export const KlazifyEndpointInputSchemas = {
	categorizeAll: KlazifyCategorizeInputSchema,
	categorizeRealtime: KlazifyRealtimeInputSchema,
	categoriesIab: KlazifyIabInputSchema,
	companyGet: KlazifyCompanyInputSchema,
	techGet: KlazifyTechInputSchema,
	logoGet: KlazifyLogoInputSchema,
	domainGet: KlazifyDomainInputSchema,
	similarDomainsGet: KlazifySimilarDomainsInputSchema,
	trafficGet: KlazifyTrafficInputSchema,
	categoriesListV1: KlazifyCategoryListInputSchema,
	categoriesListV2: KlazifyCategoryListInputSchema,
	discoverySearch: KlazifyDiscoveryInputSchema,
} as const;

export const KlazifyEndpointOutputSchemas = {
	categorizeAll: KlazifyCategorizeResponseSchema,
	categorizeRealtime: KlazifyRealtimeResponseSchema,
	categoriesIab: KlazifyIabResponseSchema,
	companyGet: KlazifyCompanyResponseSchema,
	techGet: KlazifyTechResponseSchema,
	logoGet: KlazifyLogoResponseSchema,
	domainGet: KlazifyDomainResponseSchema,
	similarDomainsGet: KlazifySimilarDomainsResponseSchema,
	trafficGet: KlazifyTrafficResponseSchema,
	categoriesListV1: KlazifyCategoryListResponseSchema,
	categoriesListV2: KlazifyCategoryListResponseSchema,
	discoverySearch: KlazifyDiscoveryResponseSchema,
} as const;

export type KlazifyEndpointInputs = {
	categorizeAll: KlazifyCategorizeInput;
	categorizeRealtime: KlazifyTarget;
	categoriesIab: KlazifyTarget;
	companyGet: KlazifyTarget;
	techGet: KlazifyTarget;
	logoGet: KlazifyTarget;
	domainGet: KlazifyTarget;
	similarDomainsGet: KlazifyTarget;
	trafficGet: KlazifyTarget;
	categoriesListV1: Record<string, never>;
	categoriesListV2: Record<string, never>;
	discoverySearch: KlazifyDiscoveryInput;
};

export type KlazifyEndpointOutputs = {
	categorizeAll: KlazifyCategorizeResponse;
	categorizeRealtime: KlazifyRealtimeResponse;
	categoriesIab: KlazifyIabResponse;
	companyGet: KlazifyCompanyResponse;
	techGet: KlazifyTechResponse;
	logoGet: KlazifyLogoResponse;
	domainGet: KlazifyDomainResponse;
	similarDomainsGet: KlazifySimilarDomainsResponse;
	trafficGet: KlazifyTrafficResponse;
	categoriesListV1: KlazifyCategoryListResponse;
	categoriesListV2: KlazifyCategoryListResponse;
	discoverySearch: KlazifyDiscoveryResponse;
};
