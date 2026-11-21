import { z } from 'zod';

// Shapes follow Perigon's OpenAPI (https://docs.perigon.io/openapi.json) and
// live answers from a free account (11-21). Lists answer
// `{ status, numResults, <articles | results> }`: there is no pagination
// block, pages are numbered from 0, and numResults is the total match
// count. Responses stay loose and nullish so a field Perigon adds or drops
// does not break a read.

const text = (description: string) =>
	z.string().nullish().describe(description);
const count = (description: string) =>
	z.number().nullish().describe(description);
// unknown: Perigon's nested entity, label and location records vary by
// record and plan, so they stay open.
const records = (description: string) =>
	z.array(z.unknown()).nullish().describe(description);

/** A news article, as the Articles API returns it. */
export const ArticleSchema = z
	.object({
		articleId: text('Article id'),
		url: text('Canonical article URL'),
		title: text('Article title'),
		description: text('Article description'),
		content: text('Article body (may be truncated on some plans)'),
		summary: text('Generated summary'),
		imageUrl: text('Lead image URL'),
		pubDate: text('Publication timestamp'),
		addDate: text('When Perigon added the article'),
		refreshDate: text('When Perigon last refreshed the article'),
		authorsByline: text('Author byline'),
		clusterId: text('Story cluster the article belongs to'),
		country: text('Country code'),
		language: text('Language code'),
		medium: text('Medium, e.g. Article or Video'),
		score: count('Relevance score'),
		reprint: z.boolean().nullish().describe('Whether this is a reprint'),
		source: z
			.object({
				domain: text('Publisher domain'),
				location: z.unknown().nullish().describe('Publisher location'),
			})
			.loose()
			.nullish()
			.describe('Publisher'),
		sentiment: z
			.object({
				positive: count('Positive score'),
				negative: count('Negative score'),
				neutral: count('Neutral score'),
			})
			.loose()
			.nullish()
			.describe('Sentiment scores'),
		keywords: records('Keywords with weights'),
		topics: records('Topics'),
		categories: records('Categories'),
		labels: records('Labels such as Opinion or Paid News'),
		entities: records('Named entities'),
		companies: records('Companies mentioned'),
		people: records('People mentioned'),
		locations: records('Locations mentioned'),
		places: records('Places mentioned'),
		links: z.array(z.string()).nullish().describe('Links in the article'),
	})
	.loose()
	.describe('A news article');
export type Article = z.infer<typeof ArticleSchema>;

/** A story cluster: one narrative across many articles. */
export const StorySchema = z
	.object({
		id: text('Story (cluster) id'),
		name: text('Story name'),
		summary: text('Story summary'),
		shortSummary: text('One-line summary'),
		keyPoints: records('Key points'),
		createdAt: text('Creation timestamp'),
		updatedAt: text('Last update timestamp'),
		initializedAt: text('When the story first appeared'),
		uniqueCount: count('Unique articles in the story'),
		reprintCount: count('Reprints in the story'),
		totalCount: count('All articles in the story'),
		uniqueSourcesCount: count('Distinct publishers'),
		sourceDiversity: count('Publisher diversity score'),
		sentiment: z.unknown().nullish().describe('Sentiment scores'),
		topTopics: records('Main topics'),
		topCategories: records('Main categories'),
		topCountries: records('Main countries'),
		topPeople: records('Main people'),
		topCompanies: records('Main companies'),
		topLocations: records('Main locations'),
	})
	.loose()
	.describe('A story cluster');
export type Story = z.infer<typeof StorySchema>;

/** A journalist entry. */
export const JournalistSchema = z
	.object({
		id: text('Journalist id'),
		name: text('Journalist name'),
		fullName: text('Full name'),
		title: text('Job title'),
		headline: text('Profile headline'),
		description: text('Profile description'),
		imageUrl: text('Profile image URL'),
		updatedAt: text('Last update timestamp'),
		avgMonthlyPosts: count('Average articles a month'),
		twitterHandle: text('Twitter/X handle'),
		linkedinUrl: text('LinkedIn profile URL'),
		websiteUrl: text('Website URL'),
		topSources: records('Publishers they write for most'),
		topTopics: records('Topics they cover most'),
		topCategories: records('Categories they cover most'),
		topCountries: records('Countries they cover most'),
		locations: records('Where they are based'),
	})
	.loose()
	.describe('A journalist');
export type Journalist = z.infer<typeof JournalistSchema>;

/** A person entity (keyed by Wikidata id). */
export const PersonSchema = z
	.object({
		wikidataId: text('Wikidata id, e.g. Q312556'),
		name: text('Person name'),
		description: text('Short description'),
		abstract: text('Longer abstract'),
		aliases: z.array(z.string()).nullish().describe('Other names'),
		occupation: records('Occupations'),
		position: records('Positions held'),
		politicalParty: records('Political parties'),
		gender: z.unknown().nullish().describe('Gender record'),
		dateOfBirth: z.unknown().nullish().describe('Date of birth record'),
		dateOfDeath: z.unknown().nullish().describe('Date of death record'),
		image: z.unknown().nullish().describe('Image record'),
		updatedAt: text('Last update timestamp'),
	})
	.loose()
	.describe('A person');
export type Person = z.infer<typeof PersonSchema>;

/** A company entity. */
export const CompanySchema = z
	.object({
		id: text('Company id'),
		name: text('Company name'),
		altNames: z.array(z.string()).nullish().describe('Other names'),
		domains: z.array(z.string()).nullish().describe('Web domains'),
		description: text('Description'),
		ceo: text('Chief executive'),
		industry: text('Industry'),
		sector: text('Sector'),
		country: text('Country'),
		city: text('City'),
		state: text('State'),
		fullTimeEmployees: count('Full-time employees'),
		yearFounded: count('Year founded'),
		revenue: z
			.union([z.string(), z.number()])
			.nullish()
			.describe('Revenue as Perigon reports it'),
		symbols: records('Stock symbols'),
		isin: text('ISIN'),
		logo: text('Logo URL'),
		favicon: text('Favicon URL'),
		updatedAt: text('Last update timestamp'),
	})
	.loose()
	.describe('A company');
export type Company = z.infer<typeof CompanySchema>;

/** The fields every list answer carries beside its array. */
const listEnvelope = {
	status: count('HTTP status Perigon echoes, 200 on success'),
	numResults: count('Total matching records across all pages'),
};

const ListArticlesOutputSchema = z
	.object({
		...listEnvelope,
		articles: z.array(ArticleSchema).describe('Articles on this page'),
	})
	.loose();

const ListStoriesOutputSchema = z
	.object({
		...listEnvelope,
		results: z.array(StorySchema).describe('Stories on this page'),
	})
	.loose();

const ListJournalistsOutputSchema = z
	.object({
		...listEnvelope,
		results: z.array(JournalistSchema).describe('Journalists on this page'),
	})
	.loose();

const ListPeopleOutputSchema = z
	.object({
		...listEnvelope,
		results: z.array(PersonSchema).describe('People on this page'),
	})
	.loose();

const ListCompaniesOutputSchema = z
	.object({
		...listEnvelope,
		results: z.array(CompanySchema).describe('Companies on this page'),
	})
	.loose();

/** A value or a list of values; a list is an OR filter. */
const oneOrMany = (description: string) =>
	z
		.union([z.string().min(1), z.array(z.string().min(1)).min(1)])
		.optional()
		.describe(`${description}; several values are ORed`);

const paging = (maxSize: number) => ({
	page: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Page number, starting at 0'),
	size: z
		.number()
		.int()
		.min(1)
		.max(maxSize)
		.optional()
		.describe(`Results per page (at most ${maxSize} on the free plan)`),
});

/** Filters the article and story searches share. */
const searchFilters = {
	q: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Keyword or boolean query (AND, OR, NOT, quotes) across title, description and content',
		),
	from: z
		.string()
		.min(1)
		.optional()
		.describe('Published after this time: ISO 8601 or yyyy-mm-dd'),
	to: z
		.string()
		.min(1)
		.optional()
		.describe('Published before this time: ISO 8601 or yyyy-mm-dd'),
	topic: oneOrMany('Topic, e.g. Markets, Cryptocurrency'),
	category: oneOrMany('Category, e.g. Tech, Business, Politics'),
	source: oneOrMany('Publisher domain, wildcards allowed (*.cnn.com)'),
	country: oneOrMany('Country code, e.g. us'),
};

export const ListArticlesInputSchema = z
	.object({
		...searchFilters,
		title: z.string().min(1).optional().describe('Query scoped to titles'),
		language: oneOrMany('ISO-639 language code, e.g. en'),
		label: oneOrMany('Label, e.g. Opinion, Paid News'),
		excludeLabel: oneOrMany('Label to leave out'),
		showReprints: z
			.boolean()
			.optional()
			.describe('Include syndicated reprints (Perigon default true)'),
		sortBy: z
			.enum([
				'relevance',
				'date',
				'reverseDate',
				'addDate',
				'reverseAddDate',
				'pubDate',
				'refreshDate',
			])
			.optional()
			.describe('Sort order'),
		...paging(100),
	})
	.describe('Query parameters for the Articles API');
export type ListArticlesInput = z.infer<typeof ListArticlesInputSchema>;
export type ListArticlesOutput = z.infer<typeof ListArticlesOutputSchema>;

export const ListStoriesInputSchema = z
	.object({
		...searchFilters,
		name: z.string().min(1).optional().describe('Query scoped to story names'),
		minUniqueSources: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Only stories covered by at least this many publishers'),
		sortBy: z
			.enum(['createdAt', 'updatedAt', 'relevance', 'count', 'totalCount'])
			.optional()
			.describe('Sort order'),
		...paging(100),
	})
	.describe('Query parameters for the Stories API');
export type ListStoriesInput = z.infer<typeof ListStoriesInputSchema>;
export type ListStoriesOutput = z.infer<typeof ListStoriesOutputSchema>;

export const ListJournalistsInputSchema = z
	.object({
		q: z
			.string()
			.min(1)
			.optional()
			.describe('Query across name, title and bio'),
		name: z.string().min(1).optional().describe('Journalist name'),
		source: oneOrMany('Publisher domain they write for'),
		topic: oneOrMany('Topic they cover'),
		country: oneOrMany('Country code they cover'),
		sortBy: z
			.enum(['avgMonthlyPosts', 'linkedinConnections', 'linkedinFollowers'])
			.optional()
			.describe('Sort order'),
		...paging(100),
	})
	.describe('Query parameters for the journalist directory');
export type ListJournalistsInput = z.infer<typeof ListJournalistsInputSchema>;
export type ListJournalistsOutput = z.infer<typeof ListJournalistsOutputSchema>;

export const ListPeopleInputSchema = z
	.object({
		name: z.string().min(1).optional().describe('Person name'),
		wikidataId: oneOrMany('Wikidata id, e.g. Q312556'),
		occupationLabel: z
			.string()
			.min(1)
			.optional()
			.describe('Occupation, e.g. politician'),
		...paging(100),
	})
	.describe('Query parameters for person entities');
export type ListPeopleInput = z.infer<typeof ListPeopleInputSchema>;
export type ListPeopleOutput = z.infer<typeof ListPeopleOutputSchema>;

export const ListCompaniesInputSchema = z
	.object({
		q: z
			.string()
			.min(1)
			.optional()
			.describe('Query across company names and descriptions'),
		name: z.string().min(1).optional().describe('Company name'),
		domain: oneOrMany('Company web domain'),
		symbol: oneOrMany('Stock symbol'),
		industry: z.string().min(1).optional().describe('Industry'),
		sector: z.string().min(1).optional().describe('Sector'),
		country: oneOrMany('Country code'),
		...paging(100),
	})
	.describe('Query parameters for company entities');
export type ListCompaniesInput = z.infer<typeof ListCompaniesInputSchema>;
export type ListCompaniesOutput = z.infer<typeof ListCompaniesOutputSchema>;

export const GetLimitsInputSchema = z
	.object({})
	.describe('Input for reading the plan limits (none)');
export type GetLimitsInput = z.infer<typeof GetLimitsInputSchema>;

export const LimitsSchema = z
	.object({
		organizationName: text('Workspace name'),
		requestsUsed: count('Requests used this period'),
		requestLimit: count('Requests the plan allows this period'),
		maxPageSize: count('Largest page size the plan allows'),
		paginationLimit: count('Deepest result the plan lets you page to'),
		articleContentTruncation: count(
			'Character limit on article content; null means no truncation',
		),
		since: text('Start of the current usage period'),
		lastMadeAt: text('When the last request was made'),
		resetAt: text('When the request counter resets'),
	})
	.loose()
	.describe('The plan limits and usage');
export type Limits = z.infer<typeof LimitsSchema>;

export const GetLimitsOutputSchema = z
	.object({ data: LimitsSchema })
	.loose()
	.describe('The plan limits, wrapped in data');
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
