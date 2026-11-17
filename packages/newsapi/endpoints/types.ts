import { z } from 'zod';
import { NewsApiArticleEntity, NewsApiSourceEntity } from '../schema/database';

const page = z.number().int().min(1).optional();
const pageSize = z.number().int().min(1).max(100).optional();
/** ISO 8601 date or date-time, as NewsAPI documents for from/to. */
const isoDate = z
	.string()
	.regex(
		/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/,
	);
const searchIn = z
	.string()
	.regex(/^(title|description|content)(,(title|description|content))*$/);

export const EverythingInputSchema = z
	.object({
		q: z.string().min(1).optional(),
		sources: z.string().min(1).optional(),
		domains: z.string().min(1).optional(),
		excludeDomains: z.string().min(1).optional(),
		searchIn: searchIn.optional(),
		from: isoDate.optional(),
		to: isoDate.optional(),
		language: z.string().min(2).max(2).optional(),
		sortBy: z.string().min(1).optional(),
		page,
		pageSize,
	})
	.refine((value) => value.q || value.sources || value.domains, {
		message: 'q, sources, or domains is required',
	});

export const HeadlinesInputSchema = z
	.object({
		q: z.string().min(1).optional(),
		country: z.string().min(2).max(2).optional(),
		category: z.string().min(1).optional(),
		sources: z.string().min(1).optional(),
		page,
		pageSize,
	})
	.refine(
		(value) => value.q || value.country || value.category || value.sources,
		{
			message: 'q, country, category, or sources is required',
		},
	)
	.refine((value) => !(value.sources && (value.country || value.category)), {
		message: 'sources cannot be mixed with country or category',
	});

export const SourcesInputSchema = z.object({
	category: z.string().min(1).optional(),
	language: z.string().min(2).max(2).optional(),
	country: z.string().min(2).max(2).optional(),
});

export const LegacyInputSchema = z.object({
	source: z.string().min(1),
	sortBy: z.string().min(1).optional(),
});

export const ArticleListResponseSchema = z.object({
	articles: z.array(NewsApiArticleEntity),
	/** Total matches on NewsAPI's side, for paging with page/pageSize. Absent on the legacy v1 feed. */
	totalResults: z.number().optional(),
});

export const SourceListResponseSchema = z.object({
	sources: z.array(NewsApiSourceEntity),
});

export type EverythingInput = z.infer<typeof EverythingInputSchema>;
export type HeadlinesInput = z.infer<typeof HeadlinesInputSchema>;
export type SourcesInput = z.infer<typeof SourcesInputSchema>;
export type LegacyInput = z.infer<typeof LegacyInputSchema>;
export type ArticleListResponse = z.infer<typeof ArticleListResponseSchema>;
export type SourceListResponse = z.infer<typeof SourceListResponseSchema>;

export const NewsApiEndpointInputSchemas = {
	'articles.everything': EverythingInputSchema,
	'articles.headlines': HeadlinesInputSchema,
	'sources.list': SourcesInputSchema,
	'articles.legacy': LegacyInputSchema,
};

export const NewsApiEndpointOutputSchemas = {
	'articles.everything': ArticleListResponseSchema,
	'articles.headlines': ArticleListResponseSchema,
	'sources.list': SourceListResponseSchema,
	'articles.legacy': ArticleListResponseSchema,
};
