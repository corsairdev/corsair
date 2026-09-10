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
import {
	Account,
	AgenticScraper,
	Endpoint,
	Feedback,
	Markdownify,
	ScheduledJobs,
	SchemaGenerator,
	Scrape,
	SearchScraper,
	Sitemap,
	SmartCrawler,
	SmartScraper,
	Utilities,
} from './endpoints';
import type {
	ScrapegraphAiEndpointInputs,
	ScrapegraphAiEndpointOutputs,
} from './endpoints/types';
import {
	ScrapegraphAiEndpointInputSchemas,
	ScrapegraphAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ScrapegraphAiSchema } from './schema';

export type ScrapegraphAiPluginOptions = {
	/** ScrapeGraphAI's AI-powered web scraping, search, and crawling API. */
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalScrapegraphAiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof scrapegraphAiEndpointsNested>;
};

export type ScrapegraphAiContext = CorsairPluginContext<
	typeof ScrapegraphAiSchema,
	ScrapegraphAiPluginOptions
>;

export type ScrapegraphAiKeyBuilderContext =
	KeyBuilderContext<ScrapegraphAiPluginOptions>;

export type ScrapegraphAiBoundEndpoints = BindEndpoints<
	typeof scrapegraphAiEndpointsNested
>;

type ScrapegraphAiEndpoint<K extends keyof ScrapegraphAiEndpointOutputs> =
	CorsairEndpoint<
		ScrapegraphAiContext,
		ScrapegraphAiEndpointInputs[K],
		ScrapegraphAiEndpointOutputs[K]
	>;

export type ScrapegraphAiEndpoints = {
	searchScraperStart: ScrapegraphAiEndpoint<'searchScraper.start'>;
	searchScraperStatus: ScrapegraphAiEndpoint<'searchScraper.status'>;
	searchScraperHistory: ScrapegraphAiEndpoint<'searchScraper.history'>;

	smartScraperStart: ScrapegraphAiEndpoint<'smartScraper.start'>;
	smartScraperStatus: ScrapegraphAiEndpoint<'smartScraper.status'>;
	smartScraperHistory: ScrapegraphAiEndpoint<'smartScraper.history'>;

	markdownifyStart: ScrapegraphAiEndpoint<'markdownify.start'>;
	markdownifyStatus: ScrapegraphAiEndpoint<'markdownify.status'>;
	markdownifyHistory: ScrapegraphAiEndpoint<'markdownify.history'>;

	smartCrawlerStart: ScrapegraphAiEndpoint<'smartCrawler.start'>;
	smartCrawlerStatus: ScrapegraphAiEndpoint<'smartCrawler.status'>;
	smartCrawlerHistory: ScrapegraphAiEndpoint<'smartCrawler.history'>;
	smartCrawlerWebhookLogs: ScrapegraphAiEndpoint<'smartCrawler.webhookLogs'>;

	agenticScraperHistory: ScrapegraphAiEndpoint<'agenticScraper.history'>;
	agenticScraperGetLiveSessionUrl: ScrapegraphAiEndpoint<'agenticScraper.getLiveSessionUrl'>;

	scrapeHistory: ScrapegraphAiEndpoint<'scrape.history'>;

	sitemapHistory: ScrapegraphAiEndpoint<'sitemap.history'>;

	schemaGenerate: ScrapegraphAiEndpoint<'schema.generate'>;

	endpointGetSuggestions: ScrapegraphAiEndpoint<'endpoint.getSuggestions'>;
	endpointSave: ScrapegraphAiEndpoint<'endpoint.save'>;

	accountCredits: ScrapegraphAiEndpoint<'account.credits'>;
	accountValidateApiKey: ScrapegraphAiEndpoint<'account.validateApiKey'>;
	accountUsageTimeline: ScrapegraphAiEndpoint<'account.usageTimeline'>;

	feedbackSubmit: ScrapegraphAiEndpoint<'feedback.submit'>;
	feedbackSubmitProduct: ScrapegraphAiEndpoint<'feedback.submitProduct'>;

	scheduledJobsList: ScrapegraphAiEndpoint<'scheduledJobs.list'>;

	utilitiesToonify: ScrapegraphAiEndpoint<'utilities.toonify'>;
};

const scrapegraphAiEndpointsNested = {
	searchScraper: {
		start: SearchScraper.start,
		status: SearchScraper.status,
		history: SearchScraper.history,
	},
	smartScraper: {
		start: SmartScraper.start,
		status: SmartScraper.status,
		history: SmartScraper.history,
	},
	markdownify: {
		start: Markdownify.start,
		status: Markdownify.status,
		history: Markdownify.history,
	},
	smartCrawler: {
		start: SmartCrawler.start,
		status: SmartCrawler.status,
		history: SmartCrawler.history,
		webhookLogs: SmartCrawler.webhookLogs,
	},
	agenticScraper: {
		history: AgenticScraper.history,
		getLiveSessionUrl: AgenticScraper.getLiveSessionUrl,
	},
	scrape: {
		history: Scrape.history,
	},
	sitemap: {
		history: Sitemap.history,
	},
	schema: {
		generate: SchemaGenerator.generate,
	},
	endpoint: {
		getSuggestions: Endpoint.getSuggestions,
		save: Endpoint.save,
	},
	account: {
		credits: Account.credits,
		validateApiKey: Account.validateApiKey,
		usageTimeline: Account.usageTimeline,
	},
	feedback: {
		submit: Feedback.submit,
		submitProduct: Feedback.submitProduct,
	},
	scheduledJobs: {
		list: ScheduledJobs.list,
	},
	utilities: {
		toonify: Utilities.toonify,
	},
} as const;

/**
 * No webhook capability - the catalog this plugin implements has no trigger
 * actions. `webhook_url` fields accepted on some `start` requests point at
 * the *caller's own* server, not at Corsair, so there's nothing for this
 * plugin to receive or match.
 */
const scrapegraphAiWebhooksNested = {} as const;

export const scrapegraphAiEndpointSchemas = {
	'searchScraper.start': {
		input: ScrapegraphAiEndpointInputSchemas['searchScraper.start'],
		output: ScrapegraphAiEndpointOutputSchemas['searchScraper.start'],
	},
	'searchScraper.status': {
		input: ScrapegraphAiEndpointInputSchemas['searchScraper.status'],
		output: ScrapegraphAiEndpointOutputSchemas['searchScraper.status'],
	},
	'searchScraper.history': {
		input: ScrapegraphAiEndpointInputSchemas['searchScraper.history'],
		output: ScrapegraphAiEndpointOutputSchemas['searchScraper.history'],
	},
	'smartScraper.start': {
		input: ScrapegraphAiEndpointInputSchemas['smartScraper.start'],
		output: ScrapegraphAiEndpointOutputSchemas['smartScraper.start'],
	},
	'smartScraper.status': {
		input: ScrapegraphAiEndpointInputSchemas['smartScraper.status'],
		output: ScrapegraphAiEndpointOutputSchemas['smartScraper.status'],
	},
	'smartScraper.history': {
		input: ScrapegraphAiEndpointInputSchemas['smartScraper.history'],
		output: ScrapegraphAiEndpointOutputSchemas['smartScraper.history'],
	},
	'markdownify.start': {
		input: ScrapegraphAiEndpointInputSchemas['markdownify.start'],
		output: ScrapegraphAiEndpointOutputSchemas['markdownify.start'],
	},
	'markdownify.status': {
		input: ScrapegraphAiEndpointInputSchemas['markdownify.status'],
		output: ScrapegraphAiEndpointOutputSchemas['markdownify.status'],
	},
	'markdownify.history': {
		input: ScrapegraphAiEndpointInputSchemas['markdownify.history'],
		output: ScrapegraphAiEndpointOutputSchemas['markdownify.history'],
	},
	'smartCrawler.start': {
		input: ScrapegraphAiEndpointInputSchemas['smartCrawler.start'],
		output: ScrapegraphAiEndpointOutputSchemas['smartCrawler.start'],
	},
	'smartCrawler.status': {
		input: ScrapegraphAiEndpointInputSchemas['smartCrawler.status'],
		output: ScrapegraphAiEndpointOutputSchemas['smartCrawler.status'],
	},
	'smartCrawler.history': {
		input: ScrapegraphAiEndpointInputSchemas['smartCrawler.history'],
		output: ScrapegraphAiEndpointOutputSchemas['smartCrawler.history'],
	},
	'smartCrawler.webhookLogs': {
		input: ScrapegraphAiEndpointInputSchemas['smartCrawler.webhookLogs'],
		output: ScrapegraphAiEndpointOutputSchemas['smartCrawler.webhookLogs'],
	},
	'agenticScraper.history': {
		input: ScrapegraphAiEndpointInputSchemas['agenticScraper.history'],
		output: ScrapegraphAiEndpointOutputSchemas['agenticScraper.history'],
	},
	'agenticScraper.getLiveSessionUrl': {
		input:
			ScrapegraphAiEndpointInputSchemas['agenticScraper.getLiveSessionUrl'],
		output:
			ScrapegraphAiEndpointOutputSchemas['agenticScraper.getLiveSessionUrl'],
	},
	'scrape.history': {
		input: ScrapegraphAiEndpointInputSchemas['scrape.history'],
		output: ScrapegraphAiEndpointOutputSchemas['scrape.history'],
	},
	'sitemap.history': {
		input: ScrapegraphAiEndpointInputSchemas['sitemap.history'],
		output: ScrapegraphAiEndpointOutputSchemas['sitemap.history'],
	},
	'schema.generate': {
		input: ScrapegraphAiEndpointInputSchemas['schema.generate'],
		output: ScrapegraphAiEndpointOutputSchemas['schema.generate'],
	},
	'endpoint.getSuggestions': {
		input: ScrapegraphAiEndpointInputSchemas['endpoint.getSuggestions'],
		output: ScrapegraphAiEndpointOutputSchemas['endpoint.getSuggestions'],
	},
	'endpoint.save': {
		input: ScrapegraphAiEndpointInputSchemas['endpoint.save'],
		output: ScrapegraphAiEndpointOutputSchemas['endpoint.save'],
	},
	'account.credits': {
		input: ScrapegraphAiEndpointInputSchemas['account.credits'],
		output: ScrapegraphAiEndpointOutputSchemas['account.credits'],
	},
	'account.validateApiKey': {
		input: ScrapegraphAiEndpointInputSchemas['account.validateApiKey'],
		output: ScrapegraphAiEndpointOutputSchemas['account.validateApiKey'],
	},
	'account.usageTimeline': {
		input: ScrapegraphAiEndpointInputSchemas['account.usageTimeline'],
		output: ScrapegraphAiEndpointOutputSchemas['account.usageTimeline'],
	},
	'feedback.submit': {
		input: ScrapegraphAiEndpointInputSchemas['feedback.submit'],
		output: ScrapegraphAiEndpointOutputSchemas['feedback.submit'],
	},
	'feedback.submitProduct': {
		input: ScrapegraphAiEndpointInputSchemas['feedback.submitProduct'],
		output: ScrapegraphAiEndpointOutputSchemas['feedback.submitProduct'],
	},
	'scheduledJobs.list': {
		input: ScrapegraphAiEndpointInputSchemas['scheduledJobs.list'],
		output: ScrapegraphAiEndpointOutputSchemas['scheduledJobs.list'],
	},
	'utilities.toonify': {
		input: ScrapegraphAiEndpointInputSchemas['utilities.toonify'],
		output: ScrapegraphAiEndpointOutputSchemas['utilities.toonify'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof scrapegraphAiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const scrapegraphAiEndpointMeta = {
	'searchScraper.start': {
		riskLevel: 'write',
		description: 'Start an AI-powered web search job (async, spends credits)',
	},
	'searchScraper.status': {
		riskLevel: 'read',
		description: 'Get status and results for a SearchScraper job',
	},
	'searchScraper.history': {
		riskLevel: 'read',
		description: 'List past SearchScraper requests',
	},

	'smartScraper.start': {
		riskLevel: 'write',
		description:
			'Start an AI-powered structured extraction job for a webpage (async, spends credits)',
	},
	'smartScraper.status': {
		riskLevel: 'read',
		description: 'Get status and results for a SmartScraper job',
	},
	'smartScraper.history': {
		riskLevel: 'read',
		description: 'List past SmartScraper requests',
	},

	'markdownify.start': {
		riskLevel: 'write',
		description:
			'Start converting a webpage to clean Markdown (async, spends credits)',
	},
	'markdownify.status': {
		riskLevel: 'read',
		description: 'Get status and results for a Markdownify job',
	},
	'markdownify.history': {
		riskLevel: 'read',
		description: 'List past Markdownify requests',
	},

	'smartCrawler.start': {
		riskLevel: 'write',
		description:
			'Start a multi-page crawl of a site with optional AI extraction (async, spends credits)',
	},
	'smartCrawler.status': {
		riskLevel: 'read',
		description: 'Get status and results for a SmartCrawler job',
	},
	'smartCrawler.history': {
		riskLevel: 'read',
		description: 'List past SmartCrawler requests',
	},
	'smartCrawler.webhookLogs': {
		riskLevel: 'read',
		description: 'Get webhook delivery logs for a SmartCrawler job',
	},

	'agenticScraper.history': {
		riskLevel: 'read',
		description: 'List past agentic (browser-driven) scraper requests',
	},
	'agenticScraper.getLiveSessionUrl': {
		riskLevel: 'write',
		description: 'Open a live, remotely-controllable browser session for a URL',
	},

	'scrape.history': {
		riskLevel: 'read',
		description: 'List past single-page Scrape requests',
	},

	'sitemap.history': {
		riskLevel: 'read',
		description: 'List past sitemap generation requests',
	},

	'schema.generate': {
		riskLevel: 'write',
		description:
			'Generate or refine a JSON schema from a natural-language prompt (spends credits)',
	},

	'endpoint.getSuggestions': {
		riskLevel: 'write',
		description:
			'Analyze a webpage and suggest reusable scraping endpoint configs (spends credits)',
	},
	'endpoint.save': {
		riskLevel: 'write',
		description: 'Save custom scraping endpoint configurations',
	},

	'account.credits': {
		riskLevel: 'read',
		description: 'Get remaining and used credit balance',
	},
	'account.validateApiKey': {
		riskLevel: 'read',
		description: 'Validate that the configured API key is active',
	},
	'account.usageTimeline': {
		riskLevel: 'read',
		description: 'Get a timeline of past request usage',
	},

	'feedback.submit': {
		riskLevel: 'write',
		description: 'Submit a rating/feedback for a completed request',
	},
	'feedback.submitProduct': {
		riskLevel: 'write',
		description: 'Submit general product feedback',
	},

	'scheduledJobs.list': {
		riskLevel: 'read',
		description: 'List scheduled recurring scraping jobs',
	},

	'utilities.toonify': {
		riskLevel: 'read',
		description:
			'Convert JSON to TOON (Token-Oriented Object Notation) to reduce LLM token usage',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof scrapegraphAiEndpointsNested
>;

export const scrapegraphAiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseScrapegraphAiPlugin<T extends ScrapegraphAiPluginOptions> =
	CorsairPlugin<
		'scrapegraphai',
		typeof ScrapegraphAiSchema,
		typeof scrapegraphAiEndpointsNested,
		typeof scrapegraphAiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalScrapegraphAiPlugin =
	BaseScrapegraphAiPlugin<ScrapegraphAiPluginOptions>;

export type ExternalScrapegraphAiPlugin<T extends ScrapegraphAiPluginOptions> =
	BaseScrapegraphAiPlugin<T>;

export function scrapegraphai<const T extends ScrapegraphAiPluginOptions>(
	incomingOptions: ScrapegraphAiPluginOptions &
		T = {} as ScrapegraphAiPluginOptions & T,
): ExternalScrapegraphAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'scrapegraphai',
		authConfig: scrapegraphAiAuthConfig,
		schema: ScrapegraphAiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: scrapegraphAiEndpointsNested,
		webhooks: scrapegraphAiWebhooksNested,
		endpointMeta: scrapegraphAiEndpointMeta,
		endpointSchemas: scrapegraphAiEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ScrapegraphAiKeyBuilderContext) => {
			if (options.key) return options.key;
			const res = await ctx.keys.get_api_key();
			if (res) return res;
			throw new AuthMissingError('scrapegraphai', 'api_key');
		},
	} satisfies InternalScrapegraphAiPlugin;
}

export type {
	ScrapegraphAiEndpointInputs,
	ScrapegraphAiEndpointOutputs,
} from './endpoints/types';
