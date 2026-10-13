import { z } from 'zod';

// BuiltWith returns dates as epoch seconds, epoch milliseconds or ISO strings depending on the API.
const Timestamp = z.union([z.string(), z.number()]);

/**
 * Domain API (v26) Meta object.
 * https://api.builtwith.com/domain-api
 */
export const DomainMeta = z.object({
	ARank: z.number().nullish(),
	QRank: z.number().nullish(),
	Majestic: z.number().nullish(),
	Umbrella: z.number().nullish(),
	CompanyName: z.string().nullish(),
	City: z.string().nullish(),
	Postcode: z.string().nullish(),
	State: z.string().nullish(),
	Country: z.string().nullish(),
	Vertical: z.string().nullish(),
	PrimaryBusiness: z.string().nullish(),
	Telephones: z.array(z.string()).nullish(),
	Emails: z.array(z.string()).nullish(),
	Social: z.array(z.string()).nullish(),
	company_reg: z
		.array(z.object({ type: z.string(), number: z.string() }))
		.nullish(),
});

/**
 * Domain API (v26) Attributes object (numeric counts and ranks).
 * https://api.builtwith.com/domain-api
 */
export const DomainAttributes = z.record(z.string(), z.number().nullable());

/**
 * One looked-up root domain from the Domain API `Results` array.
 * https://api.builtwith.com/domain-api
 */
export const BuiltWithDomain = z.object({
	id: z.string(),
	lookup: z.string(),
	isDb: z.string().nullish(),
	spend: z.number().nullish(),
	salesRevenue: z.number().nullish(),
	meta: DomainMeta.nullish(),
	attributes: DomainAttributes.nullish(),
	firstIndexed: Timestamp.nullish(),
	lastIndexed: Timestamp.nullish(),
});

/**
 * One technology detected on a domain path (`Result.Paths[].Technologies[]`).
 * https://api.builtwith.com/domain-api
 */
export const BuiltWithDomainTechnology = z.object({
	id: z.string(),
	domain: z.string(),
	subDomain: z.string().nullish(),
	name: z.string(),
	technologyId: z.number().nullish(),
	parent: z.string().nullish(),
	description: z.string().nullish(),
	link: z.string().nullish(),
	confidence: z.number().nullish(),
	isPremium: z.string().nullish(),
	tag: z.string().nullish(),
	categories: z.array(z.string()).nullish(),
	firstDetected: Timestamp.nullish(),
	lastDetected: Timestamp.nullish(),
});

/**
 * Technology trend metadata returned by the Trends API `Tech` object.
 * https://api.builtwith.com/trends-api
 */
export const BuiltWithTechnology = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullish(),
	link: z.string().nullish(),
	icon: z.string().nullish(),
	isPremium: z.string().nullish(),
	tag: z.string().nullish(),
	categories: z.array(z.string()).nullish(),
	trendsLink: z.string().nullish(),
	coverage: z
		.object({
			tenK: z.number().nullish(),
			hundredK: z.number().nullish(),
			million: z.number().nullish(),
			live: z.number().nullish(),
			expired: z.number().nullish(),
		})
		.nullish(),
});

/**
 * Per-domain technology group and category counts from the Free API.
 * https://api.builtwith.com/free-api
 */
export const BuiltWithDomainCoverage = z.object({
	id: z.string(),
	domain: z.string(),
	first: z.number().nullish(),
	last: z.number().nullish(),
	groups: z
		.array(
			z.object({
				name: z.string(),
				live: z.number().nullish(),
				dead: z.number().nullish(),
				latest: z.number().nullish(),
				oldest: z.number().nullish(),
				categories: z
					.array(
						z.object({
							name: z.string(),
							live: z.number().nullish(),
							dead: z.number().nullish(),
							latest: z.number().nullish(),
							oldest: z.number().nullish(),
						}),
					)
					.nullish(),
			}),
		)
		.nullish(),
});

/** Lists API META object (provider-supplied when META=yes). */
export const BuiltWithListSiteMeta = z.object({
	CompanyName: z.string().nullish(),
	City: z.string().nullish(),
	Postcode: z.string().nullish(),
	State: z.string().nullish(),
	Country: z.string().nullish(),
	Vertical: z.string().nullish(),
	PrimaryBusiness: z.string().nullish(),
	Telephones: z.array(z.string()).nullish(),
	Emails: z.array(z.string()).nullish(),
	Social: z.array(z.string()).nullish(),
	Titles: z.array(z.string()).nullish(),
});

/**
 * One website using a technology (Lists API `Results[]`; D, LOS, FD, LD, S, SKU, R, F, E, A, Q, M, U, META).
 * https://api.builtwith.com/lists-api
 */
export const BuiltWithListSite = z.object({
	id: z.string(),
	tech: z.string(),
	domain: z.string(),
	locations: z.array(z.string()).nullish(),
	firstDetected: z.number().nullish(),
	lastDetected: z.number().nullish(),
	monthlySpend: z.number().nullish(),
	skuCount: z.number().nullish(),
	salesRevenue: z.number().nullish(),
	socialFollowers: z.number().nullish(),
	employees: z.number().nullish(),
	pageRank: z.number().nullish(),
	trancoRank: z.number().nullish(),
	majesticRank: z.number().nullish(),
	umbrellaRank: z.number().nullish(),
	meta: BuiltWithListSiteMeta.nullish(),
});

/**
 * One recommended technology for a domain (Recommendations API `tech` object).
 * https://api.builtwith.com/recommendations-api
 */
export const BuiltWithRecommendation = z.object({
	id: z.string(),
	domain: z.string(),
	compiled: z.string().nullish(),
	name: z.string(),
	link: z.string().nullish(),
	tag: z.string().nullish(),
	categories: z.array(z.string()).nullish(),
	stars: z.number().nullish(),
	match: z.number().nullish(),
});

/**
 * One inbound or outbound redirect for a domain (Redirects API).
 * https://api.builtwith.com/redirects-api
 */
export const BuiltWithRedirect = z.object({
	id: z.string(),
	lookup: z.string(),
	direction: z.enum(['inbound', 'outbound']),
	domain: z.string(),
	firstDetected: z.string().nullish(),
	lastDetected: z.string().nullish(),
});

/**
 * Company financial summary for a domain (Financial API top-level fields).
 * https://api.builtwith.com/financial-api
 */
export const BuiltWithCompanyFinancial = z.object({
	id: z.string(),
	domain: z.string(),
	companyName: z.string().nullish(),
	employees: z.number().nullish(),
	followers: z.number().nullish(),
	products: z.number().nullish(),
	spend: z.number().nullish(),
});

/**
 * A root domain linked to a social profile URL (Social API `Results[].Domains[]`).
 * https://api.builtwith.com/social-api
 */
export const BuiltWithSocialLink = z.object({
	id: z.string(),
	socialUrl: z.string(),
	root: z.string(),
	builtWithRank: z.number().nullish(),
});

/**
 * One product listed by an eCommerce shop (Product API `shops[].Products[]`).
 * https://api.builtwith.com/product-api
 */
export const BuiltWithProduct = z.object({
	id: z.string(),
	shop: z.string(),
	title: z.string(),
	url: z.string().nullish(),
	indexed: z.string().nullish(),
	firstIndexed: z.string().nullish(),
	price: z.number().nullish(),
});

/**
 * One remote MCP server from the BuiltWith MCP registry.
 * https://api.builtwith.com/mcp-api
 */
export const BuiltWithMcpServer = z.object({
	id: z.string(),
	domain: z.string(),
	category: z.string().nullish(),
	description: z.string().nullish(),
	endpoints: z
		.array(
			z.object({
				Endpoint: z.string(),
				AuthRequired: z.boolean().nullish(),
				Tools: z
					.array(
						z.object({
							Name: z.string(),
							Description: z.string().nullish(),
						}),
					)
					.nullish(),
			}),
		)
		.nullish(),
});
