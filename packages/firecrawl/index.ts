import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	AgentEndpoints,
	CrawlEndpoints,
	MapEndpoints,
	ScrapeEndpoints,
	SearchEndpoints,
} from './endpoints';
import type {
	FirecrawlEndpointInputs,
	FirecrawlEndpointOutputs,
} from './endpoints/types';
import {
	FirecrawlEndpointInputSchemas,
	FirecrawlEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers as defaultErrorHandlers } from './error-handlers';
import type { FirecrawlContext } from './plugin-context';
import { FirecrawlSchema } from './schema';
import * as Wh from './webhooks';
import {
	AgentActionEventSchema,
	AgentCancelledEventSchema,
	AgentCompletedEventSchema,
	AgentFailedEventSchema,
	AgentStartedEventSchema,
	BatchScrapeCompletedEventSchema,
	BatchScrapePageEventSchema,
	BatchScrapeStartedEventSchema,
	CrawlCompletedEventSchema,
	CrawlPageEventSchema,
	CrawlStartedEventSchema,
	ExtractCompletedEventSchema,
	ExtractFailedEventSchema,
	ExtractStartedEventSchema,
} from './webhooks/types';

const firecrawlEndpointsNested = {
	scrape: {
		run: ScrapeEndpoints.run,
	},
	map: {
		run: MapEndpoints.run,
	},
	search: {
		run: SearchEndpoints.run,
	},
	crawl: {
		start: CrawlEndpoints.start,
		get: CrawlEndpoints.get,
		cancel: CrawlEndpoints.cancel,
	},
	agent: {
		start: AgentEndpoints.start,
		get: AgentEndpoints.get,
		cancel: AgentEndpoints.cancel,
	},
} as const;

export type FirecrawlPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFirecrawlPlugin['hooks'];
	webhookHooks?: InternalFirecrawlPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof firecrawlEndpointsNested>;
};

export type { FirecrawlContext };

export type FirecrawlKeyBuilderContext =
	KeyBuilderContext<FirecrawlPluginOptions>;

export type FirecrawlBoundEndpoints = BindEndpoints<
	typeof firecrawlEndpointsNested
>;

type FirecrawlEndpoint<K extends keyof FirecrawlEndpointOutputs> =
	CorsairEndpoint<
		FirecrawlContext,
		FirecrawlEndpointInputs[K],
		FirecrawlEndpointOutputs[K]
	>;

export type FirecrawlEndpoints = {
	scrapeRun: FirecrawlEndpoint<'scrapeRun'>;
	mapRun: FirecrawlEndpoint<'mapRun'>;
	searchRun: FirecrawlEndpoint<'searchRun'>;
	crawlStart: FirecrawlEndpoint<'crawlStart'>;
	crawlGet: FirecrawlEndpoint<'crawlGet'>;
	crawlCancel: FirecrawlEndpoint<'crawlCancel'>;
	agentStart: FirecrawlEndpoint<'agentStart'>;
	agentGet: FirecrawlEndpoint<'agentGet'>;
	agentCancel: FirecrawlEndpoint<'agentCancel'>;
};

const firecrawlWebhooksNested = {
	crawl: {
		started: Wh.Crawl.started,
		page: Wh.Crawl.page,
		completed: Wh.Crawl.completed,
	},
	batchScrape: {
		started: Wh.BatchScrape.started,
		page: Wh.BatchScrape.page,
		completed: Wh.BatchScrape.completed,
	},
	extract: {
		started: Wh.Extract.started,
		completed: Wh.Extract.completed,
		failed: Wh.Extract.failed,
	},
	agent: {
		started: Wh.Agent.started,
		action: Wh.Agent.action,
		completed: Wh.Agent.completed,
		failed: Wh.Agent.failed,
		cancelled: Wh.Agent.cancelled,
	},
} as const;

export type FirecrawlWebhooks = typeof firecrawlWebhooksNested;

export type FirecrawlBoundWebhooks = BindWebhooks<FirecrawlWebhooks>;

export const firecrawlEndpointSchemas = {
	'scrape.run': {
		input: FirecrawlEndpointInputSchemas.scrapeRun,
		output: FirecrawlEndpointOutputSchemas.scrapeRun,
	},
	'map.run': {
		input: FirecrawlEndpointInputSchemas.mapRun,
		output: FirecrawlEndpointOutputSchemas.mapRun,
	},
	'search.run': {
		input: FirecrawlEndpointInputSchemas.searchRun,
		output: FirecrawlEndpointOutputSchemas.searchRun,
	},
	'crawl.start': {
		input: FirecrawlEndpointInputSchemas.crawlStart,
		output: FirecrawlEndpointOutputSchemas.crawlStart,
	},
	'crawl.get': {
		input: FirecrawlEndpointInputSchemas.crawlGet,
		output: FirecrawlEndpointOutputSchemas.crawlGet,
	},
	'crawl.cancel': {
		input: FirecrawlEndpointInputSchemas.crawlCancel,
		output: FirecrawlEndpointOutputSchemas.crawlCancel,
	},
	'agent.start': {
		input: FirecrawlEndpointInputSchemas.agentStart,
		output: FirecrawlEndpointOutputSchemas.agentStart,
	},
	'agent.get': {
		input: FirecrawlEndpointInputSchemas.agentGet,
		output: FirecrawlEndpointOutputSchemas.agentGet,
	},
	'agent.cancel': {
		input: FirecrawlEndpointInputSchemas.agentCancel,
		output: FirecrawlEndpointOutputSchemas.agentCancel,
	},
} as const;

const firecrawlWebhookSchemas = {
	'crawl.started': {
		description: 'A crawl job started processing',
		payload: CrawlStartedEventSchema,
		response: CrawlStartedEventSchema,
	},
	'crawl.page': {
		description: 'A page was scraped during a crawl',
		payload: CrawlPageEventSchema,
		response: CrawlPageEventSchema,
	},
	'crawl.completed': {
		description: 'A crawl job finished',
		payload: CrawlCompletedEventSchema,
		response: CrawlCompletedEventSchema,
	},
	'batchScrape.started': {
		description: 'A batch scrape job started',
		payload: BatchScrapeStartedEventSchema,
		response: BatchScrapeStartedEventSchema,
	},
	'batchScrape.page': {
		description: 'A URL was scraped in a batch job',
		payload: BatchScrapePageEventSchema,
		response: BatchScrapePageEventSchema,
	},
	'batchScrape.completed': {
		description: 'A batch scrape job completed',
		payload: BatchScrapeCompletedEventSchema,
		response: BatchScrapeCompletedEventSchema,
	},
	'extract.started': {
		description: 'An extract job started',
		payload: ExtractStartedEventSchema,
		response: ExtractStartedEventSchema,
	},
	'extract.completed': {
		description: 'An extract job completed successfully',
		payload: ExtractCompletedEventSchema,
		response: ExtractCompletedEventSchema,
	},
	'extract.failed': {
		description: 'An extract job failed',
		payload: ExtractFailedEventSchema,
		response: ExtractFailedEventSchema,
	},
	'agent.started': {
		description: 'An agent job started',
		payload: AgentStartedEventSchema,
		response: AgentStartedEventSchema,
	},
	'agent.action': {
		description: 'The agent executed a tool action',
		payload: AgentActionEventSchema,
		response: AgentActionEventSchema,
	},
	'agent.completed': {
		description: 'An agent job completed successfully',
		payload: AgentCompletedEventSchema,
		response: AgentCompletedEventSchema,
	},
	'agent.failed': {
		description: 'An agent job failed',
		payload: AgentFailedEventSchema,
		response: AgentFailedEventSchema,
	},
	'agent.cancelled': {
		description: 'An agent job was cancelled',
		payload: AgentCancelledEventSchema,
		response: AgentCancelledEventSchema,
	},
} as const;

const defaultAuthType = 'api_key' as const;

const firecrawlEndpointMeta = {
	'scrape.run': {
		riskLevel: 'read',
		description: 'Scrape a single URL (markdown, JSON, etc.)',
	},
	'map.run': {
		riskLevel: 'read',
		description: 'Map all URLs discovered from a site',
	},
	'search.run': {
		riskLevel: 'read',
		description: 'Search the web and retrieve page content',
	},
	'crawl.start': {
		riskLevel: 'write',
		description: 'Start a recursive crawl from a base URL',
	},
	'crawl.get': {
		riskLevel: 'read',
		description: 'Get status and results for a crawl job',
	},
	'crawl.cancel': {
		riskLevel: 'write',
		description: 'Cancel an in-flight crawl job',
	},
	'agent.start': {
		riskLevel: 'write',
		description: 'Start an agentic extraction job',
	},
	'agent.get': {
		riskLevel: 'read',
		description: 'Get status for an agent job',
	},
	'agent.cancel': {
		riskLevel: 'write',
		description: 'Cancel an in-flight agent job',
	},
} satisfies RequiredPluginEndpointMeta<typeof firecrawlEndpointsNested>;

export type BaseFirecrawlPlugin<T extends FirecrawlPluginOptions> =
	CorsairPlugin<
		'firecrawl',
		typeof FirecrawlSchema,
		typeof firecrawlEndpointsNested,
		typeof firecrawlWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalFirecrawlPlugin =
	BaseFirecrawlPlugin<FirecrawlPluginOptions>;

export type ExternalFirecrawlPlugin<T extends FirecrawlPluginOptions> =
	BaseFirecrawlPlugin<T>;

export function firecrawl<const T extends FirecrawlPluginOptions>(
	incomingOptions: FirecrawlPluginOptions & T = {} as FirecrawlPluginOptions &
		T,
): ExternalFirecrawlPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'firecrawl',
		schema: FirecrawlSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: firecrawlEndpointsNested,
		webhooks: firecrawlWebhooksNested,
		endpointMeta: firecrawlEndpointMeta,
		endpointSchemas: firecrawlEndpointSchemas,
		webhookSchemas: firecrawlWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return (
				'x-firecrawl-signature' in headers || 'X-Firecrawl-Signature' in headers
			);
		},
		errorHandlers: {
			...defaultErrorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FirecrawlKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalFirecrawlPlugin;
}

export type {
	FirecrawlEndpointInputs,
	FirecrawlEndpointOutputs,
} from './endpoints/types';

export type {
	AgentActionEvent,
	AgentCancelledEvent,
	AgentCompletedEvent,
	AgentFailedEvent,
	AgentStartedEvent,
	BatchScrapeCompletedEvent,
	BatchScrapePageEvent,
	BatchScrapeStartedEvent,
	CrawlCompletedEvent,
	CrawlPageEvent,
	CrawlStartedEvent,
	ExtractCompletedEvent,
	ExtractFailedEvent,
	ExtractStartedEvent,
	FirecrawlWebhookEvent,
	FirecrawlWebhookOutputs,
} from './webhooks/types';
export { verifyFirecrawlWebhookSignature } from './webhooks/types';
