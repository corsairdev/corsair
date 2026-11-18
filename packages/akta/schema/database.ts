import { z } from 'zod';

// Source: https://docs.akta.pro/api-reference/supporting-apis/company-search
// and the firmographic section of https://docs.akta.pro/api-reference/company-data
export const AktaCompany = z.object({
	uuid: z.string(),
	name: z.string(),
	website: z.string().optional(),
	productCategory: z.string().optional(),
	companyStatus: z
		.enum(['public', 'private', 'acquired', 'delisted', 'unknown'])
		.optional(),
	parentCompanyUuid: z.string().optional(),
	foundedYear: z.number().optional(),
	headcountRange: z.string().optional(),
	descriptionShort: z.string().optional(),
});

export type AktaCompany = z.infer<typeof AktaCompany>;

// Source: https://docs.akta.pro/api-reference/news-signals
export const AktaNewsArticle = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string(),
	publisher: z.string().optional(),
	publishedDate: z.string().optional(),
	sentiment: z.string().optional(),
	aiSummary: z.string().optional(),
	companyUuids: z.array(z.string()),
});

export type AktaNewsArticle = z.infer<typeof AktaNewsArticle>;
