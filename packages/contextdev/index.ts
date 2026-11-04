import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Brand, News, People, Web } from './endpoints';
import type {
	ContextDevEndpointInputs,
	ContextDevEndpointOutputs,
} from './endpoints/types';
import {
	ContextDevEndpointInputSchemas,
	ContextDevEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ContextDevSchema } from './schema';

export type ContextDevPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalContextDevPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof contextdevEndpointsNested>;
};

export type ContextDevContext = CorsairPluginContext<
	typeof ContextDevSchema,
	ContextDevPluginOptions
>;

export type ContextDevKeyBuilderContext =
	KeyBuilderContext<ContextDevPluginOptions>;

export type ContextDevBoundEndpoints = BindEndpoints<
	typeof contextdevEndpointsNested
>;

type ContextDevEndpoint<K extends keyof ContextDevEndpointOutputs> =
	CorsairEndpoint<
		ContextDevContext,
		ContextDevEndpointInputs[K],
		ContextDevEndpointOutputs[K]
	>;

export type ContextDevEndpoints = {
	brandRetrieve: ContextDevEndpoint<'brandRetrieve'>;
	brandSearch: ContextDevEndpoint<'brandSearch'>;
	brandStyleguide: ContextDevEndpoint<'brandStyleguide'>;
	brandFonts: ContextDevEndpoint<'brandFonts'>;
	brandNaics: ContextDevEndpoint<'brandNaics'>;
	brandSic: ContextDevEndpoint<'brandSic'>;
	brandPrefetch: ContextDevEndpoint<'brandPrefetch'>;
	webScrape: ContextDevEndpoint<'webScrape'>;
	webUrls: ContextDevEndpoint<'webUrls'>;
	webCrawl: ContextDevEndpoint<'webCrawl'>;
	webExtract: ContextDevEndpoint<'webExtract'>;
	webSearch: ContextDevEndpoint<'webSearch'>;
	webAnswers: ContextDevEndpoint<'webAnswers'>;
	newsSearch: ContextDevEndpoint<'newsSearch'>;
	peopleEnrich: ContextDevEndpoint<'peopleEnrich'>;
	accountUsage: ContextDevEndpoint<'accountUsage'>;
};

const contextdevEndpointsNested = {
	brand: {
		retrieve: Brand.retrieve,
		search: Brand.search,
		styleguide: Brand.styleguide,
		fonts: Brand.fonts,
		naics: Brand.naics,
		sic: Brand.sic,
		prefetch: Brand.prefetch,
	},
	web: {
		scrape: Web.scrape,
		urls: Web.urls,
		crawl: Web.crawl,
		extract: Web.extract,
		search: Web.search,
		answers: Web.answers,
	},
	news: {
		search: News.search,
	},
	people: {
		enrich: People.enrich,
	},
	account: {
		usage: Account.usage,
	},
} as const;

export const contextdevEndpointSchemas = {
	'brand.retrieve': {
		input: ContextDevEndpointInputSchemas.brandRetrieve,
		output: ContextDevEndpointOutputSchemas.brandRetrieve,
	},
	'brand.search': {
		input: ContextDevEndpointInputSchemas.brandSearch,
		output: ContextDevEndpointOutputSchemas.brandSearch,
	},
	'brand.styleguide': {
		input: ContextDevEndpointInputSchemas.brandStyleguide,
		output: ContextDevEndpointOutputSchemas.brandStyleguide,
	},
	'brand.fonts': {
		input: ContextDevEndpointInputSchemas.brandFonts,
		output: ContextDevEndpointOutputSchemas.brandFonts,
	},
	'brand.naics': {
		input: ContextDevEndpointInputSchemas.brandNaics,
		output: ContextDevEndpointOutputSchemas.brandNaics,
	},
	'brand.sic': {
		input: ContextDevEndpointInputSchemas.brandSic,
		output: ContextDevEndpointOutputSchemas.brandSic,
	},
	'brand.prefetch': {
		input: ContextDevEndpointInputSchemas.brandPrefetch,
		output: ContextDevEndpointOutputSchemas.brandPrefetch,
	},
	'web.scrape': {
		input: ContextDevEndpointInputSchemas.webScrape,
		output: ContextDevEndpointOutputSchemas.webScrape,
	},
	'web.urls': {
		input: ContextDevEndpointInputSchemas.webUrls,
		output: ContextDevEndpointOutputSchemas.webUrls,
	},
	'web.crawl': {
		input: ContextDevEndpointInputSchemas.webCrawl,
		output: ContextDevEndpointOutputSchemas.webCrawl,
	},
	'web.extract': {
		input: ContextDevEndpointInputSchemas.webExtract,
		output: ContextDevEndpointOutputSchemas.webExtract,
	},
	'web.search': {
		input: ContextDevEndpointInputSchemas.webSearch,
		output: ContextDevEndpointOutputSchemas.webSearch,
	},
	'web.answers': {
		input: ContextDevEndpointInputSchemas.webAnswers,
		output: ContextDevEndpointOutputSchemas.webAnswers,
	},
	'news.search': {
		input: ContextDevEndpointInputSchemas.newsSearch,
		output: ContextDevEndpointOutputSchemas.newsSearch,
	},
	'people.enrich': {
		input: ContextDevEndpointInputSchemas.peopleEnrich,
		output: ContextDevEndpointOutputSchemas.peopleEnrich,
	},
	'account.usage': {
		input: ContextDevEndpointInputSchemas.accountUsage,
		output: ContextDevEndpointOutputSchemas.accountUsage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof contextdevEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const contextdevEndpointMeta = {
	'brand.retrieve': {
		riskLevel: 'read',
		description:
			'Get a brand profile (logos, colors, socials, address, industry) by domain, name, email, ticker, URL, or card transaction',
	},
	'brand.search': {
		riskLevel: 'read',
		description: 'Find up to 10 brands by name or domain',
	},
	'brand.styleguide': {
		riskLevel: 'read',
		description:
			"Extract a website's colors, typography, spacing, shadows, and button styles",
	},
	'brand.fonts': {
		riskLevel: 'read',
		description:
			'List the fonts a website uses and how much of the page each covers',
	},
	'brand.naics': {
		riskLevel: 'read',
		description: 'Classify a brand or business description into NAICS codes',
	},
	'brand.sic': {
		riskLevel: 'read',
		description: 'Classify a brand or business description into SIC codes',
	},
	'brand.prefetch': {
		riskLevel: 'write',
		description:
			'Queue brand or styleguide data so a later lookup returns sooner',
	},
	'web.scrape': {
		riskLevel: 'read',
		description:
			'Scrape a URL as HTML, Markdown, screenshot, images, highlights, or schema-driven JSON',
	},
	'web.urls': {
		riskLevel: 'read',
		description: "Map a domain's URLs with titles and descriptions",
	},
	'web.crawl': {
		riskLevel: 'read',
		description:
			'Crawl a website (up to 500 pages) and return each page as Markdown',
	},
	'web.extract': {
		riskLevel: 'read',
		description: 'Extract structured data from a website using a JSON Schema',
	},
	'web.search': {
		riskLevel: 'read',
		description:
			'Search the web, optionally with page Markdown or highlights per result',
	},
	'web.answers': {
		riskLevel: 'read',
		description:
			'Research a task on the web and return a sourced answer in a requested JSON shape',
	},
	'news.search': {
		riskLevel: 'read',
		description:
			'Search company news by name, domain, ticker, or ISIN, paginated by cursor',
	},
	'people.enrich': {
		riskLevel: 'read',
		description:
			'Find a person from an email, profile URLs, or name and return their profile with a match score',
	},
	'account.usage': {
		riskLevel: 'read',
		description:
			'Get the credit balance, current-period usage, and next refill',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof contextdevEndpointsNested
>;

export type BaseContextDevPlugin<T extends ContextDevPluginOptions> =
	CorsairPlugin<
		'contextdev',
		typeof ContextDevSchema,
		typeof contextdevEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalContextDevPlugin =
	BaseContextDevPlugin<ContextDevPluginOptions>;

export type ExternalContextDevPlugin<T extends ContextDevPluginOptions> =
	BaseContextDevPlugin<T>;

export function contextdev<const T extends ContextDevPluginOptions>(
	incomingOptions: ContextDevPluginOptions & T = {} as ContextDevPluginOptions &
		T,
): ExternalContextDevPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'contextdev',
		schema: ContextDevSchema,
		options: options,
		hooks: options.hooks,
		endpoints: contextdevEndpointsNested,
		webhooks: {},
		endpointMeta: contextdevEndpointMeta,
		endpointSchemas: contextdevEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ContextDevKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('contextdev', 'api_key');
		},
	} satisfies InternalContextDevPlugin;
}

export type {
	AnswersInput,
	AnswersResponse,
	Brand,
	BrandRetrieveInput,
	BrandRetrieveResponse,
	BrandSearchInput,
	BrandSearchResponse,
	ContextDevEndpointInputs,
	ContextDevEndpointOutputs,
	CrawlInput,
	CrawlResponse,
	ExtractInput,
	ExtractResponse,
	FontsInput,
	FontsResponse,
	NaicsInput,
	NaicsResponse,
	NewsArticle,
	NewsSearchInput,
	NewsSearchResponse,
	PeopleEnrichInput,
	PeopleEnrichResponse,
	Person,
	PrefetchInput,
	PrefetchResponse,
	ScrapeInput,
	ScrapeResponse,
	SicInput,
	SicResponse,
	StyleguideInput,
	StyleguideResponse,
	UrlsInput,
	UrlsResponse,
	UsageInput,
	UsageResponse,
	WebSearchInput,
	WebSearchResponse,
} from './endpoints/types';
