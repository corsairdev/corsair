import { z } from 'zod';

const IsoDateSchema = z.iso.date();

const PublishDateFilterSchema = z.string().refine((value) => {
	if (IsoDateSchema.safeParse(value).success) return true;
	const match = /^(\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value);
	if (!match) return false;
	if (!IsoDateSchema.safeParse(match[1]).success) return false;
	const hours = Number(match[2]);
	const minutes = Number(match[3]);
	const seconds = Number(match[4]);
	return hours < 24 && minutes < 60 && seconds < 60;
}, 'Date must be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS');

export const WorldNewsArticleSchema = z.object({
	id: z.number(),
	title: z.string(),
	text: z.string().optional(),
	summary: z.string().nullable().optional(),
	url: z.string(),
	image: z.string().nullable().optional(),
	video: z.string().nullable().optional(),
	publish_date: z.string().optional(),
	author: z.string().nullable().optional(),
	authors: z.array(z.string().nullable()).optional(),
	category: z.string().optional(),
	language: z.string().optional(),
	source_country: z.string().optional(),
	sentiment: z.number().optional(),
});

export type WorldNewsArticle = z.infer<typeof WorldNewsArticleSchema>;

export const WorldNewsImageItemSchema = z.object({
	title: z.string().optional(),
	url: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
});

export const WorldNewsVideoItemSchema = z.object({
	title: z.string().optional(),
	url: z.string(),
	summary: z.string().optional(),
	duration: z.number().optional(),
	thumbnail: z.string().optional(),
});

export const WorldNewsEntityItemSchema = z.object({
	name: z.string(),
	type: z.string(),
	sentiment: z.number().optional(),
});

export const WorldNewsRssItemSchema = z.object({
	title: z.string().optional(),
	link: z.string().optional(),
	guid: z.string().optional(),
	pubDate: z.string().optional(),
	description: z.string().optional(),
	author: z.string().optional(),
	category: z.string().optional(),
	enclosureUrl: z.string().optional(),
});

export const WorldNewsSourceItemSchema = z.object({
	name: z.string(),
	url: z.string(),
	language: z.string().optional(),
	country: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const TopNewsInputSchema = z.object({
	sourceCountry: z
		.string()
		.length(2)
		.describe(
			'The 2-letter ISO 3166 country code for which top news should be retrieved (e.g., "us", "in", "gb").',
		),
	language: z
		.string()
		.length(2)
		.describe(
			'The 2-letter ISO 639-1 language code of the top news (e.g., "en", "es", "fr").',
		),
	date: IsoDateSchema.optional().describe(
		'The date for which the top news should be retrieved (YYYY-MM-DD). Defaults to today.',
	),
	headlinesOnly: z
		.boolean()
		.optional()
		.describe(
			'Whether to only return basic headline fields (id, title, url). Defaults to false.',
		),
	maxNewsPerCluster: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe(
			'How many news articles to return per story cluster. Default is 1.',
		),
});

export const ExtractNewsInputSchema = z.object({
	url: z
		.string()
		.url()
		.describe('The URL of the news article to extract into structured data.'),
	analyze: z
		.boolean()
		.optional()
		.describe(
			'Whether to analyze the extracted news (extract named entities, detect sentiment, etc.). Defaults to false.',
		),
});

export const ExtractNewsLinksInputSchema = z.object({
	url: z
		.string()
		.url()
		.describe(
			'The webpage or site URL from which news article links should be extracted.',
		),
	analyze: z
		.boolean()
		.optional()
		.describe('Whether to analyze extracted links. Defaults to false.'),
	prefix: z
		.string()
		.max(100)
		.optional()
		.describe('The prefix that discovered news links must start with.'),
	subDomain: z
		.boolean()
		.optional()
		.describe(
			'Whether to include links to news articles on sub-domains. Defaults to true.',
		),
});

export const GetGeoCoordinatesInputSchema = z.object({
	location: z
		.string()
		.min(1)
		.max(1000)
		.describe(
			'The address or location name to geocode (e.g., "Tokyo, Japan" or "Mumbai, India").',
		),
});

export const NewsWebsiteToRssFeedInputSchema = z.object({
	url: z
		.string()
		.url()
		.describe(
			'The URL of the news website/page to convert into an RSS 2.0 feed.',
		),
	extractNews: z
		.boolean()
		.optional()
		.describe(
			'Whether to extract full article text/data for each item in the feed (costs additional quota). Defaults to false.',
		),
});

export const SearchNewsSourcesInputSchema = z.object({
	name: z
		.string()
		.min(3)
		.max(1000)
		.describe(
			'The (partial) name of the news source to search for (e.g. "bbc", "reuters", "times").',
		),
});

export const SearchNewsInputSchema = z
	.object({
		text: z
			.string()
			.min(3)
			.max(100)
			.optional()
			.describe(
				'Search query text. Supports implicit AND, OR, negation with -, parentheses, and quotes for exact phrases.',
			),
		textMatchIndexes: z
			.string()
			.optional()
			.describe(
				'Where to search for text: "title", "content", or "title,content".',
			),
		sourceCountry: z
			.string()
			.length(2)
			.optional()
			.describe('Filter by 2-letter ISO 3166 country code.'),
		language: z
			.string()
			.length(2)
			.optional()
			.describe('Filter by 2-letter ISO 639-1 language code.'),
		minSentiment: z
			.number()
			.min(-1)
			.max(1)
			.optional()
			.describe(
				'Minimum sentiment score between -1.0 (very negative) and 1.0 (very positive).',
			),
		maxSentiment: z
			.number()
			.min(-1)
			.max(1)
			.optional()
			.describe('Maximum sentiment score between -1.0 and 1.0.'),
		earliestPublishDate: PublishDateFilterSchema.optional().describe(
			'Filter for news published on or after this timestamp (YYYY-MM-DD HH:MM:SS or YYYY-MM-DD).',
		),
		latestPublishDate: PublishDateFilterSchema.optional().describe(
			'Filter for news published on or before this timestamp (YYYY-MM-DD HH:MM:SS or YYYY-MM-DD).',
		),
		newsSources: z
			.string()
			.optional()
			.describe(
				'Comma-separated list of up to 10 news sources (e.g., "bbc.co.uk,nytimes.com").',
			),
		authors: z
			.string()
			.optional()
			.describe('Comma-separated list of author names.'),
		categories: z
			.string()
			.optional()
			.describe(
				'Comma-separated categories (politics, sports, business, technology, entertainment, health, science, etc.).',
			),
		entities: z
			.string()
			.optional()
			.describe(
				'Filter by semantic entities (e.g., "ORG:Tesla,PER:Elon Musk").',
			),
		locationFilter: z
			.string()
			.optional()
			.describe(
				'Filter by geographic radius in the format "latitude,longitude,radius in km" (radius: 1-100).',
			),
		sort: z
			.string()
			.optional()
			.describe('Sort criteria, typically "publish-time".'),
		sortDirection: z
			.enum(['ASC', 'DESC'])
			.optional()
			.describe(
				'Sort direction: "ASC" or "DESC". Defaults to DESC for publish-time.',
			),
		offset: z
			.number()
			.int()
			.min(0)
			.max(100000)
			.optional()
			.describe('Number of results to skip for pagination.'),
		number: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Number of results to return (1-100). Defaults to 10.'),
	})
	.refine(
		(input) =>
			input.text !== undefined ||
			input.sourceCountry !== undefined ||
			input.language !== undefined ||
			input.minSentiment !== undefined ||
			input.maxSentiment !== undefined ||
			input.earliestPublishDate !== undefined ||
			input.latestPublishDate !== undefined ||
			input.newsSources !== undefined ||
			input.authors !== undefined ||
			input.categories !== undefined ||
			input.entities !== undefined ||
			input.locationFilter !== undefined,
		{ message: 'At least one search filter is required' },
	);

// ─────────────────────────────────────────────────────────────────────────────
// Output Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const TopNewsOutputSchema = z.object({
	top_news: z.array(
		z.object({
			news: z.array(WorldNewsArticleSchema),
		}),
	),
	language: z.string().optional(),
	country: z.string().optional(),
});

export const ExtractNewsOutputSchema = z.object({
	title: z.string().optional(),
	text: z.string().optional(),
	url: z.string().optional(),
	image: z.string().nullable().optional(),
	images: z.array(WorldNewsImageItemSchema).optional(),
	video: z.string().nullable().optional(),
	videos: z.array(WorldNewsVideoItemSchema).optional(),
	publish_date: z.string().optional(),
	author: z.string().nullable().optional(),
	authors: z.array(z.string().nullable()).optional(),
	language: z.string().optional(),
	source_country: z.string().optional(),
	sentiment: z.number().optional(),
	entities: z.array(WorldNewsEntityItemSchema).optional(),
});

export const ExtractNewsLinksOutputSchema = z.object({
	status: z.string().optional(),
	news_links: z.array(z.string()),
});

export const GetGeoCoordinatesOutputSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	city: z.string().optional(),
});

export const NewsWebsiteToRssFeedOutputSchema = z.object({
	title: z.string().optional(),
	link: z.string().optional(),
	description: z.string().optional(),
	pubDate: z.string().optional(),
	lastBuildDate: z.string().optional(),
	language: z.string().optional(),
	items: z.array(WorldNewsRssItemSchema),
	rawXml: z.string().optional(),
});

export const SearchNewsSourcesOutputSchema = z.object({
	available: z.number(),
	sources: z.array(WorldNewsSourceItemSchema),
});

export const SearchNewsOutputSchema = z.object({
	offset: z.number(),
	number: z.number(),
	available: z.number(),
	news: z.array(WorldNewsArticleSchema),
});

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Input/Output Schema Registries
// ─────────────────────────────────────────────────────────────────────────────

export const WorldNewsApiEndpointInputSchemas = {
	'news.topNews': TopNewsInputSchema,
	'news.extractNews': ExtractNewsInputSchema,
	'news.extractNewsLinks': ExtractNewsLinksInputSchema,
	'news.getGeoCoordinates': GetGeoCoordinatesInputSchema,
	'news.newsWebsiteToRssFeed': NewsWebsiteToRssFeedInputSchema,
	'news.searchNewsSources': SearchNewsSourcesInputSchema,
	'news.searchNews': SearchNewsInputSchema,
} as const;

export const WorldNewsApiEndpointOutputSchemas = {
	'news.topNews': TopNewsOutputSchema,
	'news.extractNews': ExtractNewsOutputSchema,
	'news.extractNewsLinks': ExtractNewsLinksOutputSchema,
	'news.getGeoCoordinates': GetGeoCoordinatesOutputSchema,
	'news.newsWebsiteToRssFeed': NewsWebsiteToRssFeedOutputSchema,
	'news.searchNewsSources': SearchNewsSourcesOutputSchema,
	'news.searchNews': SearchNewsOutputSchema,
} as const;

export type WorldNewsApiEndpointInputs = {
	'news.topNews': z.infer<typeof TopNewsInputSchema>;
	'news.extractNews': z.infer<typeof ExtractNewsInputSchema>;
	'news.extractNewsLinks': z.infer<typeof ExtractNewsLinksInputSchema>;
	'news.getGeoCoordinates': z.infer<typeof GetGeoCoordinatesInputSchema>;
	'news.newsWebsiteToRssFeed': z.infer<typeof NewsWebsiteToRssFeedInputSchema>;
	'news.searchNewsSources': z.infer<typeof SearchNewsSourcesInputSchema>;
	'news.searchNews': z.infer<typeof SearchNewsInputSchema>;
};

export type WorldNewsApiEndpointOutputs = {
	'news.topNews': z.infer<typeof TopNewsOutputSchema>;
	'news.extractNews': z.infer<typeof ExtractNewsOutputSchema>;
	'news.extractNewsLinks': z.infer<typeof ExtractNewsLinksOutputSchema>;
	'news.getGeoCoordinates': z.infer<typeof GetGeoCoordinatesOutputSchema>;
	'news.newsWebsiteToRssFeed': z.infer<typeof NewsWebsiteToRssFeedOutputSchema>;
	'news.searchNewsSources': z.infer<typeof SearchNewsSourcesOutputSchema>;
	'news.searchNews': z.infer<typeof SearchNewsOutputSchema>;
};
