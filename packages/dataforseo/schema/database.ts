import { z } from 'zod';

// Source: KeywordsDataGoogleAdsSearchVolumeLiveResultInfo and KeywordInfo in
// https://github.com/dataforseo/OpenApiDocumentation (openapi_specification.yaml)
export const DataForSeoKeyword = z.object({
	id: z.string(),
	keyword: z.string(),
	locationCode: z.number().optional(),
	languageCode: z.string().optional(),
	searchVolume: z.number().optional(),
	cpc: z.number().optional(),
	competition: z.string().optional(),
	updatedAt: z.coerce.date(),
});

export type DataForSeoKeyword = z.infer<typeof DataForSeoKeyword>;

// Source: BacklinksSummaryLiveResultInfo in the same specification.
export const DataForSeoBacklinkTarget = z.object({
	target: z.string(),
	rank: z.number().optional(),
	backlinks: z.number().optional(),
	referringDomains: z.number().optional(),
	referringMainDomains: z.number().optional(),
	spamScore: z.number().optional(),
	firstSeen: z.string().optional(),
	updatedAt: z.coerce.date(),
});

export type DataForSeoBacklinkTarget = z.infer<typeof DataForSeoBacklinkTarget>;

// Source: AmazonProductInfo in the same specification.
export const DataForSeoAmazonProduct = z.object({
	asin: z.string(),
	title: z.string().optional(),
	priceFrom: z.number().optional(),
	currency: z.string().optional(),
	rating: z.number().optional(),
	ratingCount: z.number().optional(),
	isAvailable: z.boolean().optional(),
	updatedAt: z.coerce.date(),
});

export type DataForSeoAmazonProduct = z.infer<typeof DataForSeoAmazonProduct>;
