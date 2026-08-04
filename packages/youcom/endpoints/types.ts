import { z } from 'zod';

export const YOUCOM_FRESHNESS = ['day', 'week', 'month', 'year'] as const;

export type YoucomFreshness = (typeof YOUCOM_FRESHNESS)[number];

export const YOUCOM_COUNTRY = [
	'AR',
	'AU',
	'AT',
	'BE',
	'BR',
	'CA',
	'CL',
	'DK',
	'FI',
	'FR',
	'DE',
	'HK',
	'IN',
	'ID',
	'IT',
	'JP',
	'KR',
	'MY',
	'MX',
	'NL',
	'NZ',
	'NO',
	'CN',
	'PL',
	'PT',
	'PH',
	'RU',
	'SA',
	'ZA',
	'ES',
	'SE',
	'CH',
	'TW',
	'TR',
	'GB',
	'US',
] as const;

export type YoucomCountry = (typeof YOUCOM_COUNTRY)[number];

export const YOUCOM_LANGUAGE = [
	'AR',
	'EU',
	'BN',
	'BG',
	'CA',
	'ZH-HANS',
	'ZH-HANT',
	'HR',
	'CS',
	'DA',
	'NL',
	'EN',
	'EN-GB',
	'ET',
	'FI',
	'FR',
	'GL',
	'DE',
	'EL',
	'GU',
	'HE',
	'HI',
	'HU',
	'IS',
	'IT',
	'JA',
	'KN',
	'KO',
	'LV',
	'LT',
	'MS',
	'ML',
	'MR',
	'NB',
	'PL',
	'PT-BR',
	'PT-PT',
	'PA',
	'RO',
	'RU',
	'SR',
	'SK',
	'SL',
	'ES',
	'SV',
	'TA',
	'TE',
	'TH',
	'TR',
	'UK',
	'VI',
] as const;

export type YoucomLanguage = (typeof YOUCOM_LANGUAGE)[number];

export const YOUCOM_SAFESEARCH = ['off', 'moderate', 'strict'] as const;

export type YoucomSafeSearch = (typeof YOUCOM_SAFESEARCH)[number];

export const YOUCOM_LIVECRAWL = ['web', 'news', 'all'] as const;

export type YoucomLiveCrawl = (typeof YOUCOM_LIVECRAWL)[number];

export const YOUCOM_LIVECRAWL_FORMATS = ['html', 'markdown'] as const;

export type YoucomLiveCrawlFormat = (typeof YOUCOM_LIVECRAWL_FORMATS)[number];

const freshnessDateRange = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}to\d{4}-\d{2}-\d{2}$/);

export const YouSearchRequestSchema = z.object({
	query: z.string().min(1),
	count: z.number().int().min(1).max(100).default(10).optional(),
	freshness: z.union([z.enum(YOUCOM_FRESHNESS), freshnessDateRange]).optional(),
	offset: z.number().int().min(0).max(9).default(0).optional(),
	country: z.enum(YOUCOM_COUNTRY).optional(),
	language: z.enum(YOUCOM_LANGUAGE).default('EN').optional(),
	safesearch: z.enum(YOUCOM_SAFESEARCH).default('moderate').optional(),
	livecrawl: z.enum(YOUCOM_LIVECRAWL).optional(),
	livecrawl_formats: z
		.array(z.enum(YOUCOM_LIVECRAWL_FORMATS))
		.default(['html'])
		.optional(),
	include_domains: z.array(z.string()).max(500).optional(),
	exclude_domains: z.array(z.string()).max(500).optional(),
	boost_domains: z.array(z.string()).max(500).optional(),
	crawl_timeout: z.number().int().min(1).max(60).default(10).optional(),
});

export type YouSearchRequest = z.infer<typeof YouSearchRequestSchema>;

export const YoucomContentsSchema = z.object({
	html: z.string().optional(),
	markdown: z.string().optional(),
});

export type YoucomContents = z.infer<typeof YoucomContentsSchema>;

export const YoucomWebResultSchema = z.object({
	url: z.string(),
	title: z.string(),
	description: z.string().optional(),
	snippets: z.array(z.string()).optional(),
	thumbnail_url: z.string().optional(),
	page_age: z.string().optional(),
	contents: YoucomContentsSchema.optional(),
	favicon_url: z.string().optional(),
});

export type YoucomWebResult = z.infer<typeof YoucomWebResultSchema>;

export const YoucomNewsResultSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	page_age: z.string().optional(),
	thumbnail_url: z.string().optional(),
	url: z.string(),
	contents: YoucomContentsSchema.optional(),
});

export type YoucomNewsResult = z.infer<typeof YoucomNewsResultSchema>;

export const YoucomSearchResultsSchema = z.object({
	web: z.array(YoucomWebResultSchema).optional(),
	news: z.array(YoucomNewsResultSchema).optional(),
});

export type YoucomSearchResults = z.infer<typeof YoucomSearchResultsSchema>;

export const YoucomSearchMetadataSchema = z.object({
	search_uuid: z.string(),
	query: z.string(),
	latency: z.number(),
});

export type YoucomSearchMetadata = z.infer<typeof YoucomSearchMetadataSchema>;

export const YouSearchResponseSchema = z.object({
	results: YoucomSearchResultsSchema,
	metadata: YoucomSearchMetadataSchema,
});

export type YouSearchResponse = z.infer<typeof YouSearchResponseSchema>;

export type YoucomEndpointInputs = {
	youSearch: YouSearchRequest;
};

export type YoucomEndpointOutputs = {
	youSearch: YouSearchResponse;
};

export const YoucomEndpointInputSchemas = {
	youSearch: YouSearchRequestSchema,
} as const;

export const YoucomEndpointOutputSchemas = {
	youSearch: YouSearchResponseSchema,
} as const;
