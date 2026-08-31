import { z } from 'zod';

const CATEGORY_VALUES = [
	'business',
	'entertainment',
	'general',
	'health',
	'science',
	'sports',
	'technology',
] as const;

const StringOrArray = z.union([z.string(), z.array(z.string())]);

// At least one of q, sources, language, or domains must be set or News API
// returns a `parametersMissing` error — enforced client-side so callers get
// a clear message instead of a round trip to the provider.
const ArticlesGetEverythingInputSchema = z
	.object({
		q: z.string().optional(),
		qInTitle: z.string().optional(),
		searchIn: z.string().optional(),
		sources: StringOrArray.optional(),
		domains: StringOrArray.optional(),
		excludeDomains: StringOrArray.optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		language: z.string().optional(),
		sortBy: z.enum(['relevancy', 'popularity', 'publishedAt']).optional(),
		pageSize: z.number().int().min(1).max(100).optional(),
		page: z.number().int().min(1).optional(),
	})
	.refine(
		(input) =>
			Boolean(
				input.q ||
					input.language ||
					(Array.isArray(input.sources)
						? input.sources.length
						: input.sources) ||
					(Array.isArray(input.domains) ? input.domains.length : input.domains),
			),
		{ message: 'At least one of q, sources, language, or domains is required' },
	);

// News API rejects `sources` combined with `country` or `category` on
// top-headlines — enforced client-side for the same reason as above.
const ArticlesGetTopHeadlinesInputSchema = z
	.object({
		country: z.string().length(2).optional(),
		category: z.enum(CATEGORY_VALUES).optional(),
		sources: StringOrArray.optional(),
		q: z.string().optional(),
		pageSize: z.number().int().min(1).max(100).optional(),
		page: z.number().int().min(1).optional(),
	})
	.refine((input) => !(input.sources && (input.country || input.category)), {
		message: 'sources cannot be combined with country or category',
	});

const ArticlesGetV1InputSchema = z.object({
	source: z.string(),
	sortBy: z.enum(['top', 'latest', 'popular']).optional(),
});

const SourcesListInputSchema = z
	.object({
		category: z.enum(CATEGORY_VALUES).optional(),
		language: z.string().optional(),
		country: z.string().length(2).optional(),
	})
	.optional();

export type ArticlesGetEverythingInput = z.infer<
	typeof ArticlesGetEverythingInputSchema
>;
export type ArticlesGetTopHeadlinesInput = z.infer<
	typeof ArticlesGetTopHeadlinesInputSchema
>;
export type ArticlesGetV1Input = z.infer<typeof ArticlesGetV1InputSchema>;
export type SourcesListInput = z.infer<typeof SourcesListInputSchema>;

export const NewsApiEndpointInputSchemas = {
	articlesGetEverything: ArticlesGetEverythingInputSchema,
	articlesGetTopHeadlines: ArticlesGetTopHeadlinesInputSchema,
	articlesGetV1: ArticlesGetV1InputSchema,
	sourcesList: SourcesListInputSchema,
} as const;

export type NewsApiEndpointInputs = {
	articlesGetEverything: ArticlesGetEverythingInput;
	articlesGetTopHeadlines: ArticlesGetTopHeadlinesInput;
	articlesGetV1: ArticlesGetV1Input;
	sourcesList: SourcesListInput;
};

const ArticleSchema = z
	.object({
		source: z
			.object({
				id: z.string().nullable().optional(),
				name: z.string().optional(),
			})
			.optional(),
		author: z.string().nullable().optional(),
		title: z.string().optional(),
		description: z.string().nullable().optional(),
		url: z.string(),
		urlToImage: z.string().nullable().optional(),
		publishedAt: z.string().optional(),
		content: z.string().nullable().optional(),
	})
	.loose();

const ArticlesResponseSchema = z
	.object({
		status: z.string(),
		totalResults: z.number(),
		articles: z.array(ArticleSchema),
	})
	.loose();

const V1ArticleSchema = z
	.object({
		author: z.string().nullable().optional(),
		title: z.string().optional(),
		description: z.string().nullable().optional(),
		url: z.string().optional(),
		urlToImage: z.string().nullable().optional(),
		publishedAt: z.string().optional(),
	})
	.loose();

const V1ArticlesResponseSchema = z
	.object({
		status: z.string(),
		source: z.string().optional(),
		sortBy: z.string().optional(),
		articles: z.array(V1ArticleSchema),
	})
	.loose();

const SourceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		url: z.string().optional(),
		category: z.string().optional(),
		language: z.string().optional(),
		country: z.string().optional(),
	})
	.loose();

const SourcesResponseSchema = z
	.object({
		status: z.string(),
		sources: z.array(SourceSchema),
	})
	.loose();

export const NewsApiEndpointOutputSchemas = {
	articlesGetEverything: ArticlesResponseSchema,
	articlesGetTopHeadlines: ArticlesResponseSchema,
	articlesGetV1: V1ArticlesResponseSchema,
	sourcesList: SourcesResponseSchema,
} as const;

export type NewsApiEndpointOutputs = {
	[K in keyof typeof NewsApiEndpointOutputSchemas]: z.infer<
		(typeof NewsApiEndpointOutputSchemas)[K]
	>;
};

export type Article = z.infer<typeof ArticleSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type GetEverythingResponse = z.infer<
	typeof NewsApiEndpointOutputSchemas.articlesGetEverything
>;
export type GetTopHeadlinesResponse = z.infer<
	typeof NewsApiEndpointOutputSchemas.articlesGetTopHeadlines
>;
export type GetV1ArticlesResponse = z.infer<
	typeof NewsApiEndpointOutputSchemas.articlesGetV1
>;
export type SourcesListResponse = z.infer<
	typeof NewsApiEndpointOutputSchemas.sourcesList
>;
