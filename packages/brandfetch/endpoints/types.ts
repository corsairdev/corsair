import { z } from 'zod';

export const IdentifierTypeSchema = z.enum([
	'domain',
	'ticker',
	'isin',
	'crypto',
]);
export type IdentifierType = z.infer<typeof IdentifierTypeSchema>;

export function identifierPath(
	identifier: string,
	type?: IdentifierType,
): string {
	const encoded = encodeURIComponent(identifier);
	return type ? `${type}/${encoded}` : encoded;
}

const BrandIdentifierInput = {
	identifier: z
		.string()
		.min(1)
		.describe(
			'Domain (nike.com), Brand ID (id_0dwKPKT), ISIN, ticker (NKE), or crypto symbol (BTC)',
		),
	identifierType: IdentifierTypeSchema.optional().describe(
		'Explicit identifier type. Omit to use auto-detect (domain → ticker → ISIN → crypto).',
	),
};

// ─────────────────────────────────────────────────────────────────────────────
// Brand API — GET /v2/brands/{type}/{identifier}
// Official: https://docs.brandfetch.com/reference/brand-api
// ─────────────────────────────────────────────────────────────────────────────

export const GetBrandInfoInputSchema = z.object({
	...BrandIdentifierInput,
	allowNsfw: z
		.boolean()
		.optional()
		.describe(
			'When true, return NSFW brands. When false, NSFW brands 404. Unset uses Brandfetch default.',
		),
});
export type GetBrandInfoInput = z.infer<typeof GetBrandInfoInputSchema>;

const FormatSchema = z
	.object({
		src: z.string().optional(),
		format: z.enum(['svg', 'webp', 'png', 'jpeg']).optional(),
		height: z.number().nullable().optional(),
		width: z.number().nullable().optional(),
		size: z.number().optional(),
		background: z.enum(['transparent']).nullable().optional(),
	})
	.loose();

const LogoSchema = z
	.object({
		theme: z.enum(['dark', 'light']).nullable().optional(),
		formats: z.array(FormatSchema),
		tags: z.array(z.unknown()),
		type: z.enum(['icon', 'logo', 'symbol', 'other']),
	})
	.loose();

const ColorSchema = z
	.object({
		hex: z.string(),
		type: z.enum(['accent', 'dark', 'light', 'brand']),
		brightness: z.number(),
	})
	.loose();

const FontSchema = z
	.object({
		name: z.string().nullable().optional(),
		type: z.enum(['title', 'body']),
		origin: z.enum(['google', 'custom', 'system']).optional(),
		originId: z.string().nullable().optional(),
		weights: z.array(z.unknown()).optional(),
	})
	.loose();

const PictureMetadataSchema = z
	.object({
		score: z.number(),
		rank: z.number(),
		naturalWidth: z.number(),
		naturalHeight: z.number(),
		alt: z.string(),
		sourceUrl: z.string(),
		imageCategory: z.string().nullable().optional(),
		categoryConfidence: z.number().nullable().optional(),
	})
	.loose();

const ImageSchema = z
	.object({
		formats: z.array(FormatSchema),
		tags: z.array(z.unknown()),
		type: z.enum(['banner', 'other', 'picture']),
		pictureMetadata: PictureMetadataSchema.nullable().optional(),
	})
	.loose();

const LinkSchema = z
	.object({
		name: z.string(),
		url: z.string(),
	})
	.loose();

const IndustryParentSchema = z
	.object({
		id: z.string(),
		slug: z.string(),
		name: z.string(),
		emoji: z.string().optional(),
	})
	.loose();

const IndustrySchema = z
	.object({
		id: z.string(),
		score: z.number().optional(),
		slug: z.string(),
		name: z.string(),
		emoji: z.string().optional(),
		parent: z
			.union([IndustryParentSchema, z.array(IndustryParentSchema)])
			.nullable()
			.optional(),
	})
	.loose();

export const LocationSchema = z
	.object({
		city: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		countryCode: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		subregion: z.string().nullable().optional(),
	})
	.loose();

export const CompanySchema = z
	.object({
		employees: z.number().nullable().optional(),
		financialIdentifiers: z
			.object({
				isin: z.array(z.string()).optional(),
				ticker: z.array(z.string()).optional(),
			})
			.nullable()
			.optional(),
		foundedYear: z.number().nullable().optional(),
		industries: z.array(IndustrySchema).optional(),
		kind: z.string().nullable().optional(),
		location: LocationSchema.optional(),
	})
	.loose();
export type Company = z.infer<typeof CompanySchema>;

export const GetBrandInfoResponseSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable(),
		domain: z.string(),
		claimed: z.boolean(),
		description: z.string().nullable(),
		longDescription: z.string().nullable(),
		links: z.array(LinkSchema),
		logos: z.array(LogoSchema),
		colors: z.array(ColorSchema),
		fonts: z.array(FontSchema),
		images: z.array(ImageSchema),
		qualityScore: z.number(),
		company: CompanySchema.nullable(),
		isNsfw: z.boolean(),
		urn: z.string(),
	})
	.loose();
export type GetBrandInfoResponse = z.infer<typeof GetBrandInfoResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Brand Search API — GET /v2/search/{name}?c={clientId}
// Official: https://docs.brandfetch.com/reference/brand-search-api
// ─────────────────────────────────────────────────────────────────────────────

export const SearchBrandsInputSchema = z.object({
	name: z.string().min(1).describe('Brand name to search for'),
	clientId: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Brandfetch client ID. Falls back to plugin options / stored key.',
		),
});
export type SearchBrandsInput = z.infer<typeof SearchBrandsInputSchema>;

export const SearchBrandsResponseSchema = z.array(
	z.object({
		icon: z.string().nullable(),
		name: z.string().nullable(),
		domain: z.string(),
		claimed: z.boolean(),
		brandId: z.string(),
	}),
);
export type SearchBrandsResponse = z.infer<typeof SearchBrandsResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Logo CDN — https://cdn.brandfetch.io/{type}/{identifier}
// Official: https://docs.brandfetch.com/logo-api/parameters
// ─────────────────────────────────────────────────────────────────────────────

export const GetCdnLogoInputSchema = z.object({
	...BrandIdentifierInput,
	clientId: z.string().min(1).optional(),
	logoType: z
		.enum(['icon', 'logo', 'symbol'])
		.optional()
		.describe('CDN asset type. Defaults to icon.'),
	theme: z.enum(['light', 'dark']).optional(),
	fallback: z
		.enum(['brandfetch', 'transparent', 'lettermark', '404'])
		.optional(),
	w: z.number().int().positive().optional().describe('Width in pixels'),
	h: z.number().int().positive().optional().describe('Height in pixels'),
});
export type GetCdnLogoInput = z.infer<typeof GetCdnLogoInputSchema>;

export const GetCdnLogoResponseSchema = z.object({
	url: z.string(),
});
export type GetCdnLogoResponse = z.infer<typeof GetCdnLogoResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Get Company Information — company object from Brand API
// Official: BrandResponse.company
// ─────────────────────────────────────────────────────────────────────────────

export const GetCompanyInfoInputSchema = GetBrandInfoInputSchema;
export type GetCompanyInfoInput = GetBrandInfoInput;

export const GetCompanyInfoResponseSchema = CompanySchema.nullable();
export type GetCompanyInfoResponse = Company | null;

// ─────────────────────────────────────────────────────────────────────────────
// Transaction API — POST /v2/brands/transaction
// Official: https://docs.brandfetch.com/reference/transaction-api
// ─────────────────────────────────────────────────────────────────────────────

export const GetTransactionInfoInputSchema = z.object({
	transactionLabel: z
		.string()
		.min(1)
		.describe('Raw transaction text from a credit-card statement'),
	countryCode: z
		.string()
		.regex(/^[A-Z]{2}$/, 'Must be an ISO 3166-1 alpha-2 country code')
		.describe(
			'ISO 3166-1 alpha-2 country code where the transaction took place',
		),
});
export type GetTransactionInfoInput = z.infer<
	typeof GetTransactionInfoInputSchema
>;

export const GetTransactionInfoResponseSchema = GetBrandInfoResponseSchema;
export type GetTransactionInfoResponse = GetBrandInfoResponse;

// ─────────────────────────────────────────────────────────────────────────────
// GraphQL — https://graphql.brandfetch.io
// Official: https://docs.brandfetch.com/delivery-methods/graphql
// ─────────────────────────────────────────────────────────────────────────────

export const GetTaxonomyInputSchema = z.object({});
export type GetTaxonomyInput = z.infer<typeof GetTaxonomyInputSchema>;

const TaxonomyIndustryNodeSchema = z
	.object({
		id: z.string(),
		urn: z.string().optional(),
		name: z.string(),
		slug: z.string(),
		emoji: z.string().optional(),
		depth: z.number().optional(),
		banner: z.string().nullable().optional(),
	})
	.loose();

const TaxonomyIndustrySchema = TaxonomyIndustryNodeSchema.extend({
	parent: TaxonomyIndustryNodeSchema.nullable().optional(),
	children: z.array(TaxonomyIndustryNodeSchema).optional(),
});

const TaxonomyCountrySchema = z
	.object({
		code: z.string(),
		name: z.string(),
		slug: z.string(),
		emoji: z.string().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
	})
	.loose();

const TaxonomyRegionSchema = z
	.object({
		name: z.string(),
		slug: z.string(),
		emoji: z.string().optional(),
		depth: z.number().optional(),
		parent: z
			.object({
				name: z.string(),
				slug: z.string(),
			})
			.nullable()
			.optional(),
	})
	.loose();

export const GetTaxonomyResponseSchema = z.object({
	industries: z.array(TaxonomyIndustrySchema),
	countries: z.array(TaxonomyCountrySchema),
	geographicRegions: z.array(TaxonomyRegionSchema),
});
export type GetTaxonomyResponse = z.infer<typeof GetTaxonomyResponseSchema>;

export const GetGraphqlVersionInputSchema = z.object({});
export type GetGraphqlVersionInput = z.infer<
	typeof GetGraphqlVersionInputSchema
>;

export const GetGraphqlVersionResponseSchema = z.object({
	version: z.string(),
});
export type GetGraphqlVersionResponse = z.infer<
	typeof GetGraphqlVersionResponseSchema
>;

export const ListSubscribableEventsInputSchema = z.object({});
export type ListSubscribableEventsInput = z.infer<
	typeof ListSubscribableEventsInputSchema
>;

export const SubscribableEventSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	description: z.string(),
	subscriptionScope: z.string(),
});

export const ListSubscribableEventsResponseSchema = z.object({
	subscribableEvents: z.array(SubscribableEventSchema),
});
export type ListSubscribableEventsResponse = z.infer<
	typeof ListSubscribableEventsResponseSchema
>;

export const ListWebhooksInputSchema = z.object({
	first: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Page size. GraphQL default is 10.'),
	after: z
		.string()
		.optional()
		.describe('Cursor from the previous pageInfo.endCursor'),
});
export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

export const WebhookNodeSchema = z
	.object({
		urn: z.string(),
		url: z.string(),
		description: z.string().nullable().optional(),
		enabled: z.boolean(),
		events: z.array(z.string()),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export const ListWebhooksResponseSchema = z.object({
	nodes: z.array(WebhookNodeSchema),
	pageInfo: z.object({
		hasNextPage: z.boolean(),
		endCursor: z.string().nullable().optional(),
	}),
});
export type ListWebhooksResponse = z.infer<typeof ListWebhooksResponseSchema>;

export type BrandfetchEndpointInputs = {
	getBrandInfo: GetBrandInfoInput;
	searchBrands: SearchBrandsInput;
	getCdnLogo: GetCdnLogoInput;
	getCompanyInfo: GetCompanyInfoInput;
	getTransactionInfo: GetTransactionInfoInput;
	getTaxonomy: GetTaxonomyInput;
	getGraphqlVersion: GetGraphqlVersionInput;
	listSubscribableEvents: ListSubscribableEventsInput;
	listWebhooks: ListWebhooksInput;
};

export type BrandfetchEndpointOutputs = {
	getBrandInfo: GetBrandInfoResponse;
	searchBrands: SearchBrandsResponse;
	getCdnLogo: GetCdnLogoResponse;
	getCompanyInfo: GetCompanyInfoResponse;
	getTransactionInfo: GetTransactionInfoResponse;
	getTaxonomy: GetTaxonomyResponse;
	getGraphqlVersion: GetGraphqlVersionResponse;
	listSubscribableEvents: ListSubscribableEventsResponse;
	listWebhooks: ListWebhooksResponse;
};

export const BrandfetchEndpointInputSchemas = {
	getBrandInfo: GetBrandInfoInputSchema,
	searchBrands: SearchBrandsInputSchema,
	getCdnLogo: GetCdnLogoInputSchema,
	getCompanyInfo: GetCompanyInfoInputSchema,
	getTransactionInfo: GetTransactionInfoInputSchema,
	getTaxonomy: GetTaxonomyInputSchema,
	getGraphqlVersion: GetGraphqlVersionInputSchema,
	listSubscribableEvents: ListSubscribableEventsInputSchema,
	listWebhooks: ListWebhooksInputSchema,
} as const;

export const BrandfetchEndpointOutputSchemas = {
	getBrandInfo: GetBrandInfoResponseSchema,
	searchBrands: SearchBrandsResponseSchema,
	getCdnLogo: GetCdnLogoResponseSchema,
	getCompanyInfo: GetCompanyInfoResponseSchema,
	getTransactionInfo: GetTransactionInfoResponseSchema,
	getTaxonomy: GetTaxonomyResponseSchema,
	getGraphqlVersion: GetGraphqlVersionResponseSchema,
	listSubscribableEvents: ListSubscribableEventsResponseSchema,
	listWebhooks: ListWebhooksResponseSchema,
} as const;
