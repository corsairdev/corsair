import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

const DiffbotImageSchema = z
	.object({
		url: z.string().optional(),
		title: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		naturalWidth: z.number().optional(),
		naturalHeight: z.number().optional(),
		primary: z.boolean().optional(),
		xpath: z.string().optional(),
	})
	.passthrough();

const DiffbotTagSchema = z
	.object({
		id: z.number().optional(),
		label: z.string(),
		uri: z.string().optional(),
		types: z.array(z.string()).optional(),
		score: z.number().optional(),
		count: z.number().optional(),
		prevalence: z.number().optional(),
		rdfTypes: z.array(z.string()).optional(),
	})
	.passthrough();

const DiffbotRequestMetaSchema = z
	.object({
		pageUrl: z.string().optional(),
		api: z.string().optional(),
		version: z.number().optional(),
	})
	.passthrough()
	.optional();

// ---------------------------------------------------------------------------
// Extract Article
// ---------------------------------------------------------------------------

export const ExtractArticleInputSchema = z.object({
	url: z.string().describe('The URL of the article to extract'),
	fields: z
		.string()
		.optional()
		.describe('Comma-separated list of optional fields (e.g. "links,meta")'),
	timeout: z
		.number()
		.optional()
		.describe('Timeout in milliseconds (default 30000)'),
	paging: z
		.enum(['false'])
		.optional()
		.describe('Set to "false" to disable pagination following'),
	maxTags: z.number().optional().describe('Maximum number of tags to return'),
	naturalLanguage: z.string().optional().describe('Language hint for NLP'),
});

export type ExtractArticleInput = z.infer<typeof ExtractArticleInputSchema>;

const ArticleObjectSchema = z
	.object({
		type: z.literal('article'),
		title: z.string().optional(),
		text: z.string().optional(),
		html: z.string().optional(),
		date: z.string().optional(),
		estimatedDate: z.string().optional(),
		author: z.string().optional(),
		authorUrl: z.string().optional(),
		siteName: z.string().optional(),
		pageUrl: z.string().optional(),
		resolvedPageUrl: z.string().optional(),
		humanLanguage: z.string().optional(),
		numPages: z.number().optional(),
		nextPage: z.string().optional(),
		nextPages: z.array(z.string()).optional(),
		images: z.array(DiffbotImageSchema).optional(),
		videos: z
			.array(z.object({ url: z.string().optional() }).passthrough())
			.optional(),
		tags: z.array(DiffbotTagSchema).optional(),
		links: z.array(z.string()).optional(),
		breadcrumb: z
			.array(
				z.object({ link: z.string().optional(), name: z.string().optional() }),
			)
			.optional(),
		publisherRegion: z.string().optional(),
		publisherCountry: z.string().optional(),
		sentiment: z.number().optional(),
	})
	.passthrough();

export const ExtractArticleResponseSchema = z.object({
	request: DiffbotRequestMetaSchema,
	objects: z.array(ArticleObjectSchema),
});

export type ExtractArticleResponse = z.infer<
	typeof ExtractArticleResponseSchema
>;

// ---------------------------------------------------------------------------
// Extract Product
// ---------------------------------------------------------------------------

export const ExtractProductInputSchema = z.object({
	url: z.string().describe('The URL of the product page to extract'),
	fields: z
		.string()
		.optional()
		.describe('Comma-separated list of optional fields'),
	timeout: z
		.number()
		.optional()
		.describe('Timeout in milliseconds (default 30000)'),
});

export type ExtractProductInput = z.infer<typeof ExtractProductInputSchema>;

const ProductOfferSchema = z
	.object({
		price: z.string().optional(),
		priceCurrency: z.string().optional(),
		availability: z.boolean().optional(),
		condition: z.string().optional(),
		seller: z.string().optional(),
		shippingAmount: z.string().optional(),
	})
	.passthrough();

const ProductObjectSchema = z
	.object({
		type: z.literal('product'),
		title: z.string().optional(),
		text: z.string().optional(),
		brand: z.string().optional(),
		offerPrice: z.string().optional(),
		offerPriceDetails: z
			.object({
				amount: z.number().optional(),
				symbol: z.string().optional(),
				text: z.string().optional(),
			})
			.passthrough()
			.optional(),
		regularPrice: z.string().optional(),
		saveAmount: z.string().optional(),
		shippingAmount: z.string().optional(),
		availability: z.boolean().optional(),
		sku: z.string().optional(),
		mpn: z.string().optional(),
		upc: z.string().optional(),
		isbn: z.string().optional(),
		images: z.array(DiffbotImageSchema).optional(),
		offers: z.array(ProductOfferSchema).optional(),
		colors: z.array(z.string()).optional(),
		pageUrl: z.string().optional(),
		humanLanguage: z.string().optional(),
		tags: z.array(DiffbotTagSchema).optional(),
	})
	.passthrough();

export const ExtractProductResponseSchema = z.object({
	request: DiffbotRequestMetaSchema,
	objects: z.array(ProductObjectSchema),
});

export type ExtractProductResponse = z.infer<
	typeof ExtractProductResponseSchema
>;

// ---------------------------------------------------------------------------
// Analyze (auto-detect page type)
// ---------------------------------------------------------------------------

export const AnalyzeInputSchema = z.object({
	url: z
		.string()
		.describe('The URL to analyze — Diffbot auto-detects the page type'),
	fields: z
		.string()
		.optional()
		.describe('Comma-separated list of optional fields'),
	timeout: z.number().optional().describe('Timeout in milliseconds'),
	fallback: z
		.string()
		.optional()
		.describe(
			'API to fall back to if page type cannot be detected (e.g. "article")',
		),
	discussion: z
		.enum(['false'])
		.optional()
		.describe('Set to "false" to disable comment extraction'),
});

export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;

export const AnalyzeResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		type: z
			.string()
			.optional()
			.describe('Detected page type (article, product, discussion, etc.)'),
		humanLanguage: z.string().optional(),
		title: z.string().optional(),
		objects: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

// ---------------------------------------------------------------------------
// Web Search
// ---------------------------------------------------------------------------

export const WebSearchInputSchema = z.object({
	query: z.string().describe('Full-text search query'),
	col: z
		.string()
		.optional()
		.describe('Diffbot crawl collection to search within'),
	num: z
		.number()
		.min(1)
		.max(25)
		.optional()
		.describe('Number of results to return (max 25, default 20)'),
	start: z.number().optional().describe('Zero-indexed offset for pagination'),
});

export type WebSearchInput = z.infer<typeof WebSearchInputSchema>;

const WebSearchResultSchema = z
	.object({
		title: z.string().optional(),
		pageUrl: z.string().optional(),
		text: z.string().optional(),
		date: z.string().optional(),
		author: z.string().optional(),
		siteName: z.string().optional(),
		humanLanguage: z.string().optional(),
		tags: z.array(DiffbotTagSchema).optional(),
		images: z.array(DiffbotImageSchema).optional(),
	})
	.passthrough();

export const WebSearchResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		results: z.array(WebSearchResultSchema).optional(),
		numResults: z.number().optional(),
		hits: z.number().optional(),
	})
	.passthrough();

export type WebSearchResponse = z.infer<typeof WebSearchResponseSchema>;

// ---------------------------------------------------------------------------
// DQL (Knowledge Graph Search)
// ---------------------------------------------------------------------------

export const DqlSearchInputSchema = z.object({
	query: z
		.string()
		.describe('DQL query string (e.g. "type:Organization name:\"Google\"")'),
	type: z
		.string()
		.optional()
		.describe('Entity type filter (e.g. "Organization", "Person", "Article")'),
	size: z
		.number()
		.optional()
		.describe(
			'Number of results to return (default 5, max 100 or 1000 for articles)',
		),
	from: z.number().optional().describe('Zero-indexed offset for pagination'),
	col: z
		.string()
		.optional()
		.describe('Collection name for querying crawl/bulk data'),
});

export type DqlSearchInput = z.infer<typeof DqlSearchInputSchema>;

export const DqlSearchResponseSchema = z
	.object({
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		hits: z.number().optional(),
		cursor: z.string().optional(),
		facets: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type DqlSearchResponse = z.infer<typeof DqlSearchResponseSchema>;

// ---------------------------------------------------------------------------
// Aggregated type maps (keyed by camelCase endpoint name)
// ---------------------------------------------------------------------------

export type DiffbotEndpointInputs = {
	extractArticle: ExtractArticleInput;
	extractProduct: ExtractProductInput;
	extractAnalyze: AnalyzeInput;
	searchWeb: WebSearchInput;
	searchDql: DqlSearchInput;
};

export type DiffbotEndpointOutputs = {
	extractArticle: ExtractArticleResponse;
	extractProduct: ExtractProductResponse;
	extractAnalyze: AnalyzeResponse;
	searchWeb: WebSearchResponse;
	searchDql: DqlSearchResponse;
};

export const DiffbotEndpointInputSchemas = {
	extractArticle: ExtractArticleInputSchema,
	extractProduct: ExtractProductInputSchema,
	extractAnalyze: AnalyzeInputSchema,
	searchWeb: WebSearchInputSchema,
	searchDql: DqlSearchInputSchema,
} as const;

export const DiffbotEndpointOutputSchemas = {
	extractArticle: ExtractArticleResponseSchema,
	extractProduct: ExtractProductResponseSchema,
	extractAnalyze: AnalyzeResponseSchema,
	searchWeb: WebSearchResponseSchema,
	searchDql: DqlSearchResponseSchema,
} as const;
