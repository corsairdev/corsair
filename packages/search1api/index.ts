import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Content, Deepcrawl, Web } from './endpoints';
import type {
	Search1APIEndpointInputs,
	Search1APIEndpointOutputs,
} from './endpoints/types';
import {
	Search1APIEndpointInputSchemas,
	Search1APIEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { Search1APISchema } from './schema';

export type Search1APIPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSearch1APIPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof search1apiEndpointsNested>;
};

export type Search1APIContext = CorsairPluginContext<
	typeof Search1APISchema,
	Search1APIPluginOptions
>;

export type Search1APIKeyBuilderContext =
	KeyBuilderContext<Search1APIPluginOptions>;

export type Search1APIBoundEndpoints = BindEndpoints<
	typeof search1apiEndpointsNested
>;

type Search1APIEndpoint<K extends keyof Search1APIEndpointOutputs> =
	CorsairEndpoint<
		Search1APIContext,
		Search1APIEndpointInputs[K],
		Search1APIEndpointOutputs[K]
	>;

export type Search1APIEndpoints = {
	search: Search1APIEndpoint<'search'>;
	searchBatch: Search1APIEndpoint<'searchBatch'>;
	news: Search1APIEndpoint<'news'>;
	newsBatch: Search1APIEndpoint<'newsBatch'>;
	ask: Search1APIEndpoint<'ask'>;
	trending: Search1APIEndpoint<'trending'>;
	crawl: Search1APIEndpoint<'crawl'>;
	crawlBatch: Search1APIEndpoint<'crawlBatch'>;
	screenshot: Search1APIEndpoint<'screenshot'>;
	sitemap: Search1APIEndpoint<'sitemap'>;
	extract: Search1APIEndpoint<'extract'>;
	deepcrawlStart: Search1APIEndpoint<'deepcrawlStart'>;
	deepcrawlStatus: Search1APIEndpoint<'deepcrawlStatus'>;
	feedback: Search1APIEndpoint<'feedback'>;
	usage: Search1APIEndpoint<'usage'>;
	health: Search1APIEndpoint<'health'>;
};

const search1apiEndpointsNested = {
	web: {
		search: Web.search,
		searchBatch: Web.searchBatch,
		news: Web.news,
		newsBatch: Web.newsBatch,
		ask: Web.ask,
		trending: Web.trending,
		feedback: Web.feedback,
	},
	content: {
		crawl: Content.crawl,
		crawlBatch: Content.crawlBatch,
		screenshot: Content.screenshot,
		sitemap: Content.sitemap,
		extract: Content.extract,
	},
	deepcrawl: {
		start: Deepcrawl.start,
		status: Deepcrawl.status,
	},
	account: {
		usage: Account.usage,
		health: Account.health,
	},
} as const;

const search1apiWebhooksNested = {} as const;

export const search1apiEndpointSchemas = {
	'web.search': {
		input: Search1APIEndpointInputSchemas.search,
		output: Search1APIEndpointOutputSchemas.search,
	},
	'web.searchBatch': {
		input: Search1APIEndpointInputSchemas.searchBatch,
		output: Search1APIEndpointOutputSchemas.searchBatch,
	},
	'web.news': {
		input: Search1APIEndpointInputSchemas.news,
		output: Search1APIEndpointOutputSchemas.news,
	},
	'web.newsBatch': {
		input: Search1APIEndpointInputSchemas.newsBatch,
		output: Search1APIEndpointOutputSchemas.newsBatch,
	},
	'web.ask': {
		input: Search1APIEndpointInputSchemas.ask,
		output: Search1APIEndpointOutputSchemas.ask,
	},
	'web.trending': {
		input: Search1APIEndpointInputSchemas.trending,
		output: Search1APIEndpointOutputSchemas.trending,
	},
	'content.crawl': {
		input: Search1APIEndpointInputSchemas.crawl,
		output: Search1APIEndpointOutputSchemas.crawl,
	},
	'content.crawlBatch': {
		input: Search1APIEndpointInputSchemas.crawlBatch,
		output: Search1APIEndpointOutputSchemas.crawlBatch,
	},
	'content.screenshot': {
		input: Search1APIEndpointInputSchemas.screenshot,
		output: Search1APIEndpointOutputSchemas.screenshot,
	},
	'content.sitemap': {
		input: Search1APIEndpointInputSchemas.sitemap,
		output: Search1APIEndpointOutputSchemas.sitemap,
	},
	'content.extract': {
		input: Search1APIEndpointInputSchemas.extract,
		output: Search1APIEndpointOutputSchemas.extract,
	},
	'deepcrawl.start': {
		input: Search1APIEndpointInputSchemas.deepcrawlStart,
		output: Search1APIEndpointOutputSchemas.deepcrawlStart,
	},
	'deepcrawl.status': {
		input: Search1APIEndpointInputSchemas.deepcrawlStatus,
		output: Search1APIEndpointOutputSchemas.deepcrawlStatus,
	},
	'web.feedback': {
		input: Search1APIEndpointInputSchemas.feedback,
		output: Search1APIEndpointOutputSchemas.feedback,
	},
	'account.usage': {
		input: Search1APIEndpointInputSchemas.usage,
		output: Search1APIEndpointOutputSchemas.usage,
	},
	'account.health': {
		input: Search1APIEndpointInputSchemas.health,
		output: Search1APIEndpointOutputSchemas.health,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof search1apiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const search1apiEndpointMeta = {
	'web.search': {
		riskLevel: 'read',
		description: 'Search the web across 19 engines, with optional crawling',
	},
	'web.searchBatch': {
		riskLevel: 'read',
		description: 'Run many web searches in a single request',
	},
	'web.news': {
		riskLevel: 'read',
		description: 'Search recent news across six sources',
	},
	'web.newsBatch': {
		riskLevel: 'read',
		description: 'Run many news searches in a single request',
	},
	'web.ask': {
		riskLevel: 'read',
		description:
			'Agentic search that picks engines and reranks results automatically',
	},
	'web.trending': {
		riskLevel: 'read',
		description: 'Get trending topics from GitHub or Hacker News',
	},
	'web.feedback': {
		riskLevel: 'write',
		description:
			'Report a Search1API problem or feature request from an agent run',
	},
	'content.crawl': {
		riskLevel: 'read',
		description: 'Crawl a URL and return its readable content',
	},
	'content.crawlBatch': {
		riskLevel: 'read',
		description: 'Crawl many URLs in a single request',
	},
	'content.screenshot': {
		riskLevel: 'read',
		description: 'Render a page as a PNG, JPEG, or WebP image',
	},
	'content.sitemap': {
		riskLevel: 'read',
		description: "Extract a site's URLs from its sitemap",
	},
	'content.extract': {
		riskLevel: 'read',
		description: 'Extract structured data from a page with a prompt',
	},
	'deepcrawl.start': {
		riskLevel: 'write',
		description: 'Start an asynchronous whole-site crawl',
	},
	'deepcrawl.status': {
		riskLevel: 'read',
		description: "Check a deepcrawl task's status and result archive",
	},
	'account.usage': {
		riskLevel: 'read',
		description: 'Get the remaining credit balance',
	},
	'account.health': {
		riskLevel: 'read',
		description: 'Check whether the Search1API API is serving traffic',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof search1apiEndpointsNested
>;

export const search1apiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseSearch1APIPlugin<T extends Search1APIPluginOptions> =
	CorsairPlugin<
		'search1api',
		typeof Search1APISchema,
		typeof search1apiEndpointsNested,
		typeof search1apiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalSearch1APIPlugin =
	BaseSearch1APIPlugin<Search1APIPluginOptions>;

export type ExternalSearch1APIPlugin<T extends Search1APIPluginOptions> =
	BaseSearch1APIPlugin<T>;

export function search1api<const T extends Search1APIPluginOptions>(
	incomingOptions: Search1APIPluginOptions & T = {} as Search1APIPluginOptions &
		T,
): ExternalSearch1APIPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'search1api',
		authConfig: search1apiAuthConfig,
		schema: Search1APISchema,
		options,
		hooks: options.hooks,
		endpoints: search1apiEndpointsNested,
		webhooks: search1apiWebhooksNested,
		endpointMeta: search1apiEndpointMeta,
		endpointSchemas: search1apiEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: Search1APIKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) {
					return key;
				}
			}
			throw new AuthMissingError('search1api', 'api_key');
		},
	} satisfies InternalSearch1APIPlugin;
}

export type {
	AskInput,
	AskResponse,
	AskResult,
	CrawlBatchInput,
	CrawlBatchResponse,
	CrawlInput,
	CrawlResponse,
	CrawlResult,
	DeepcrawlStartInput,
	DeepcrawlStartResponse,
	DeepcrawlStatusInput,
	DeepcrawlStatusResponse,
	ExtractInput,
	ExtractResponse,
	FeedbackInput,
	FeedbackResponse,
	HealthInput,
	HealthResponse,
	NewsBatchInput,
	NewsBatchResponse,
	NewsInput,
	NewsResponse,
	ScreenshotInput,
	ScreenshotResponse,
	Search1APIEndpointInputs,
	Search1APIEndpointOutputs,
	SearchBatchInput,
	SearchBatchResponse,
	SearchInput,
	SearchResponse,
	SearchResult,
	SearchResultMetadata,
	SitemapInput,
	SitemapResponse,
	TrendingInput,
	TrendingResponse,
	TrendingResult,
	UsageInput,
	UsageResponse,
} from './endpoints/types';
