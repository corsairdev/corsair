import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** A news article, as the Articles API returns it. */
export const ArticleSchema = z
	.object({
		id: z.string().nullish().describe('Article id'),
		url: z.string().nullish().describe('Canonical article URL'),
		title: z.string().nullish().describe('Article title'),
		description: z
			.string()
			.nullish()
			.describe('Article description or summary'),
		content: z
			.string()
			.nullish()
			.describe('Article body; plan-gated truncation may shorten it'),
		imageUrl: z.string().nullish().describe('Lead image URL'),
		publishedAt: z.string().nullish().describe('Publication timestamp'),
		source: z.string().nullish().describe('Publisher name'),
		topic: z.string().nullish().describe('Topic classification'),
		sourceUrl: z.string().nullish().describe('Publisher home URL'),
		clusterId: z
			.string()
			.nullish()
			.describe('Story cluster this article belongs to'),
	})
	.loose()
	.describe('A news article from the Perigon index');
export type Article = z.infer<typeof ArticleSchema>;

/** A story cluster: one narrative across many articles. */
export const StorySchema = z
	.object({
		id: z.string().nullish().describe('Story id'),
		title: z.string().nullish().describe('Cluster title'),
		summary: z.string().nullish().describe('Cluster summary'),
		articleCount: z.number().nullish().describe('Articles in the cluster'),
		createdAt: z.string().nullish().describe('Cluster creation timestamp'),
		updatedAt: z.string().nullish().describe('Cluster last update timestamp'),
	})
	.loose()
	.describe('A Perigon story cluster');
export type Story = z.infer<typeof StorySchema>;

/** A journalist entry. */
export const JournalistSchema = z
	.object({
		id: z.string().nullish().describe('Journalist id'),
		name: z.string().nullish().describe('Journalist name'),
		source: z.string().nullish().describe('Primary publisher'),
	})
	.loose()
	.describe('A journalist in the Perigon directory');
export type Journalist = z.infer<typeof JournalistSchema>;

/** A resolved person entity. */
export const PersonSchema = z
	.object({
		id: z.string().nullish().describe('Person entity id'),
		name: z.string().nullish().describe('Person name'),
		mentions: z.number().nullish().describe('Mention count in the index'),
	})
	.loose()
	.describe('A resolved person entity');
export type Person = z.infer<typeof PersonSchema>;

/** A resolved company entity. */
export const CompanySchema = z
	.object({
		id: z.string().nullish().describe('Company entity id'),
		name: z.string().nullish().describe('Company name'),
		mentions: z.number().nullish().describe('Mention count in the index'),
	})
	.loose()
	.describe('A resolved company entity');
export type Company = z.infer<typeof CompanySchema>;

/** Pagination block the list endpoints carry. */
export const PaginationSchema = z
	.object({
		page: z.number().nullish().describe('Page returned'),
		size: z.number().nullish().describe('Page size'),
		totalElements: z.number().nullish().describe('Total matching records'),
		totalPages: z.number().nullish().describe('Total number of pages'),
	})
	.loose()
	.describe('Pagination metadata');

/** Each list endpoint answers its named array plus the pagination block. */
const ListArticlesOutputSchema = z
	.object({
		articles: z.array(ArticleSchema).describe('Articles on this page'),
		pagination: PaginationSchema,
	})
	.loose();
const ListStoriesOutputSchema = z
	.object({
		stories: z.array(StorySchema).describe('Stories on this page'),
		pagination: PaginationSchema,
	})
	.loose();
const ListJournalistsOutputSchema = z
	.object({
		journalists: z.array(JournalistSchema).describe('Journalists on this page'),
		pagination: PaginationSchema,
	})
	.loose();
const ListPeopleOutputSchema = z
	.object({
		people: z.array(PersonSchema).describe('People on this page'),
		pagination: PaginationSchema,
	})
	.loose();
const ListCompaniesOutputSchema = z
	.object({
		companies: z.array(CompanySchema).describe('Companies on this page'),
		pagination: PaginationSchema,
	})
	.loose();

/** The shared filter family the list endpoints document. */
const searchFilters = {
	q: z
		.string()
		.optional()
		.describe(
			'Keyword or boolean query across titles, URLs, descriptions and body',
		),
	title: z.string().optional().describe('Query scoped to titles'),
	from: z
		.string()
		.optional()
		.describe('Published from this date (YYYY-MM-DD or ISO)'),
	to: z.string().optional().describe('Published to this date'),
	topic: z.string().optional().describe('Topic filter, e.g. Tech, Business'),
	source: z.string().optional().describe('Publisher name filter'),
	sourceUrl: z.string().optional().describe('Publisher home URL filter'),
	country: z.string().optional().describe('Country filter (ISO code or name)'),
	language: z.string().optional().describe('Language filter (ISO code)'),
	sentiment: z
		.enum(['positive', 'negative', 'neutral'])
		.optional()
		.describe('Sentiment filter'),
	removeDuplicate: z
		.boolean()
		.optional()
		.describe('Collapse reprints and duplicates'),
};

const pagingParams = {
	page: z.number().int().min(1).optional().describe('Page number'),
	size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page, within the plan maxPageSize'),
	sortBy: z
		.enum(['date', 'relevance', 'source', 'topic'])
		.optional()
		.describe('Result ordering'),
};

// ── articles ───────────────────────────────────────────────────────────────

export const ListArticlesInputSchema = z
	.object({
		...searchFilters,
		...pagingParams,
	})
	.describe(
		'Query parameters for the Articles API (one result per published URL)',
	);
export type ListArticlesInput = z.infer<typeof ListArticlesInputSchema>;

export type ListArticlesOutput = z.infer<typeof ListArticlesOutputSchema>;

// ── stories ────────────────────────────────────────────────────────────────

export const ListStoriesInputSchema = z
	.object({
		...searchFilters,
		...pagingParams,
	})
	.describe('Query parameters for the Stories API (clustered narratives)');
export type ListStoriesInput = z.infer<typeof ListStoriesInputSchema>;
export type ListStoriesOutput = z.infer<typeof ListStoriesOutputSchema>;

// ── journalists ────────────────────────────────────────────────────────────

export const ListJournalistsInputSchema = z
	.object({
		q: z.string().optional().describe('Journalist name query'),
		source: z.string().optional().describe('Publisher filter'),
		page: z.number().int().min(1).optional().describe('Page number'),
		size: z.number().int().min(1).optional().describe('Results per page'),
	})
	.describe('Query parameters for the Journalists API');
export type ListJournalistsInput = z.infer<typeof ListJournalistsInputSchema>;
export type ListJournalistsOutput = z.infer<typeof ListJournalistsOutputSchema>;

// ── people ─────────────────────────────────────────────────────────────────

export const ListPeopleInputSchema = z
	.object({
		q: z.string().optional().describe('Person name query'),
		page: z.number().int().min(1).optional().describe('Page number'),
		size: z.number().int().min(1).optional().describe('Results per page'),
	})
	.describe('Query parameters for the People API');
export type ListPeopleInput = z.infer<typeof ListPeopleInputSchema>;
export type ListPeopleOutput = z.infer<typeof ListPeopleOutputSchema>;

// ── companies ──────────────────────────────────────────────────────────────

export const ListCompaniesInputSchema = z
	.object({
		q: z.string().optional().describe('Company name query'),
		page: z.number().int().min(1).optional().describe('Page number'),
		size: z.number().int().min(1).optional().describe('Results per page'),
	})
	.describe('Query parameters for the Companies API');
export type ListCompaniesInput = z.infer<typeof ListCompaniesInputSchema>;
export type ListCompaniesOutput = z.infer<typeof ListCompaniesOutputSchema>;

// ── limits ─────────────────────────────────────────────────────────────────

export const GetLimitsInputSchema = z
	.object({})
	.describe('Input for reading the account usage and limits (none)');
export type GetLimitsInput = z.infer<typeof GetLimitsInputSchema>;

export const LimitsSchema = z
	.object({
		organizationName: z
			.string()
			.nullish()
			.describe('Account or organization name'),
		requestsUsed: z
			.number()
			.nullish()
			.describe('Billable requests used this period'),
		requestLimit: z
			.number()
			.nullish()
			.describe('Maximum billable requests; null means unlimited'),
		maxPageSize: z
			.number()
			.nullish()
			.describe('Largest page size the plan allows'),
		paginationLimit: z
			.number()
			.nullish()
			.describe('Maximum results you can page through'),
		articleContentTruncation: z
			.number()
			.nullish()
			.describe(
				'Character limit applied to article content; null means no truncation',
			),
		since: z.string().nullish().describe('Start of the current usage period'),
		lastMadeAt: z
			.string()
			.nullish()
			.describe('Timestamp of the most recent billable request'),
		resetAt: z.string().nullish().describe('When the request counter resets'),
	})
	.loose()
	.describe('Account usage and limits; free to poll and not rate-limited');
export type Limits = z.infer<typeof LimitsSchema>;

export const GetLimitsOutputSchema = LimitsSchema;
export type GetLimitsOutput = z.infer<typeof GetLimitsOutputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PerigonEndpointInputSchemas = {
	articlesList: ListArticlesInputSchema,
	storiesList: ListStoriesInputSchema,
	journalistsList: ListJournalistsInputSchema,
	peopleList: ListPeopleInputSchema,
	companiesList: ListCompaniesInputSchema,
	limitsGet: GetLimitsInputSchema,
};

export const PerigonEndpointOutputSchemas = {
	articlesList: ListArticlesOutputSchema,
	storiesList: ListStoriesOutputSchema,
	journalistsList: ListJournalistsOutputSchema,
	peopleList: ListPeopleOutputSchema,
	companiesList: ListCompaniesOutputSchema,
	limitsGet: GetLimitsOutputSchema,
};

export type PerigonEndpointInputs = {
	[K in keyof typeof PerigonEndpointInputSchemas]: z.input<
		(typeof PerigonEndpointInputSchemas)[K]
	>;
};

export type PerigonEndpointOutputs = {
	[K in keyof typeof PerigonEndpointOutputSchemas]: z.infer<
		(typeof PerigonEndpointOutputSchemas)[K]
	>;
};
