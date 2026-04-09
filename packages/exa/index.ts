import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	Answer,
	Contents,
	Events,
	Imports,
	Monitors,
	Search,
	WebhooksApi,
	Websets,
} from './endpoints';
import type { ExaEndpointInputs, ExaEndpointOutputs } from './endpoints/types';
import {
	ExaEndpointInputSchemas,
	ExaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ExaSchema } from './schema';
import { ContentWebhooks, SearchWebhooks, WebsetWebhooks } from './webhooks';
import type {
	ContentIndexedEvent,
	ExaWebhookOutputs,
	SearchAlertEvent,
	WebsetItemsFoundEvent,
	WebsetSearchCompletedEvent,
} from './webhooks/types';
import {
	ContentIndexedEventSchema,
	ExaContentIndexedPayloadSchema,
	ExaSearchAlertPayloadSchema,
	ExaWebsetItemsFoundPayloadSchema,
	ExaWebsetSearchCompletedPayloadSchema,
	SearchAlertEventSchema,
	WebsetItemsFoundEventSchema,
	WebsetSearchCompletedEventSchema,
} from './webhooks/types';

export type ExaEndpoints = {
	searchSearch: ExaEndpoint<'searchSearch'>;
	searchFindSimilar: ExaEndpoint<'searchFindSimilar'>;
	contentsGet: ExaEndpoint<'contentsGet'>;
	answerGet: ExaEndpoint<'answerGet'>;
	websetsCreate: ExaEndpoint<'websetsCreate'>;
	websetsGet: ExaEndpoint<'websetsGet'>;
	websetsDelete: ExaEndpoint<'websetsDelete'>;
	importsCreate: ExaEndpoint<'importsCreate'>;
	importsList: ExaEndpoint<'importsList'>;
	importsDelete: ExaEndpoint<'importsDelete'>;
	monitorsCreate: ExaEndpoint<'monitorsCreate'>;
	eventsList: ExaEndpoint<'eventsList'>;
	eventsGet: ExaEndpoint<'eventsGet'>;
	webhooksApiList: ExaEndpoint<'webhooksApiList'>;
};

const exaEndpointsNested = {
	search: {
		search: Search.search,
		findSimilar: Search.findSimilar,
	},
	contents: {
		get: Contents.get,
	},
	answer: {
		get: Answer.get,
	},
	websets: {
		create: Websets.create,
		get: Websets.get,
		delete: Websets.delete,
	},
	imports: {
		create: Imports.create,
		list: Imports.list,
		delete: Imports.delete,
	},
	monitors: {
		create: Monitors.create,
	},
	events: {
		list: Events.list,
		get: Events.get,
	},
	webhooksApi: {
		list: WebhooksApi.list,
	},
} as const;

export const exaEndpointSchemas = {
	'search.search': {
		input: ExaEndpointInputSchemas.searchSearch,
		output: ExaEndpointOutputSchemas.searchSearch,
	},
	'search.findSimilar': {
		input: ExaEndpointInputSchemas.searchFindSimilar,
		output: ExaEndpointOutputSchemas.searchFindSimilar,
	},
	'contents.get': {
		input: ExaEndpointInputSchemas.contentsGet,
		output: ExaEndpointOutputSchemas.contentsGet,
	},
	'answer.get': {
		input: ExaEndpointInputSchemas.answerGet,
		output: ExaEndpointOutputSchemas.answerGet,
	},
	'websets.create': {
		input: ExaEndpointInputSchemas.websetsCreate,
		output: ExaEndpointOutputSchemas.websetsCreate,
	},
	'websets.get': {
		input: ExaEndpointInputSchemas.websetsGet,
		output: ExaEndpointOutputSchemas.websetsGet,
	},
	'websets.delete': {
		input: ExaEndpointInputSchemas.websetsDelete,
		output: ExaEndpointOutputSchemas.websetsDelete,
	},
	'imports.create': {
		input: ExaEndpointInputSchemas.importsCreate,
		output: ExaEndpointOutputSchemas.importsCreate,
	},
	'imports.list': {
		input: ExaEndpointInputSchemas.importsList,
		output: ExaEndpointOutputSchemas.importsList,
	},
	'imports.delete': {
		input: ExaEndpointInputSchemas.importsDelete,
		output: ExaEndpointOutputSchemas.importsDelete,
	},
	'monitors.create': {
		input: ExaEndpointInputSchemas.monitorsCreate,
		output: ExaEndpointOutputSchemas.monitorsCreate,
	},
	'events.list': {
		input: ExaEndpointInputSchemas.eventsList,
		output: ExaEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: ExaEndpointInputSchemas.eventsGet,
		output: ExaEndpointOutputSchemas.eventsGet,
	},
	'webhooksApi.list': {
		input: ExaEndpointInputSchemas.webhooksApiList,
		output: ExaEndpointOutputSchemas.webhooksApiList,
	},
} as const;

export type ExaWebhooks = {
	searchAlert: ExaWebhook<'searchAlert', SearchAlertEvent>;
	contentIndexed: ExaWebhook<'contentIndexed', ContentIndexedEvent>;
	websetItemsFound: ExaWebhook<'websetItemsFound', WebsetItemsFoundEvent>;
	websetSearchCompleted: ExaWebhook<
		'websetSearchCompleted',
		WebsetSearchCompletedEvent
	>;
};

const exaWebhooksNested = {
	search: {
		searchAlert: SearchWebhooks.searchAlert,
	},
	content: {
		contentIndexed: ContentWebhooks.contentIndexed,
	},
	webset: {
		websetItemsFound: WebsetWebhooks.websetItemsFound,
		websetSearchCompleted: WebsetWebhooks.websetSearchCompleted,
	},
} as const;

const exaWebhookSchemas = {
	'search.searchAlert': {
		description: 'A monitored search query has new matching results',
		payload: ExaSearchAlertPayloadSchema,
		response: SearchAlertEventSchema,
	},
	'content.contentIndexed': {
		description: 'A new web page has been indexed by Exa',
		payload: ExaContentIndexedPayloadSchema,
		response: ContentIndexedEventSchema,
	},
	'webset.websetItemsFound': {
		description: 'New items were found for a webset search',
		payload: ExaWebsetItemsFoundPayloadSchema,
		response: WebsetItemsFoundEventSchema,
	},
	'webset.websetSearchCompleted': {
		description: 'A webset search has completed',
		payload: ExaWebsetSearchCompletedPayloadSchema,
		response: WebsetSearchCompletedEventSchema,
	},
} as const;

const defaultAuthType = 'api_key' as const;

const exaEndpointMeta = {
	'search.search': {
		riskLevel: 'read',
		description: 'Search the web using neural or keyword search',
	},
	'search.findSimilar': {
		riskLevel: 'read',
		description: 'Find web pages semantically similar to a given URL',
	},
	'contents.get': {
		riskLevel: 'read',
		description:
			'Retrieve full text, highlights, or summaries from URLs or document IDs',
	},
	'answer.get': {
		riskLevel: 'read',
		description:
			'Generate a direct, citation-backed answer to a natural language question',
	},
	'websets.create': {
		riskLevel: 'write',
		description:
			'Create a new webset with search, import, and enrichment setup',
	},
	'websets.get': {
		riskLevel: 'read',
		description: 'Get details of a specific webset by its ID',
	},
	'websets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webset [DESTRUCTIVE]',
	},
	'imports.create': {
		riskLevel: 'write',
		description: 'Create a new import to upload data into a webset',
	},
	'imports.list': {
		riskLevel: 'read',
		description: 'List all imports for a webset',
	},
	'imports.delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing import [DESTRUCTIVE]',
	},
	'monitors.create': {
		riskLevel: 'write',
		description: 'Create a new monitor to watch a webset for changes',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List all events that have occurred for a webset',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get details of a specific webset event by its ID',
	},
	'webhooksApi.list': {
		riskLevel: 'read',
		description: 'List all webhooks configured for websets',
	},
} satisfies RequiredPluginEndpointMeta<typeof exaEndpointsNested>;

export const exaAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ExaBoundEndpoints = BindEndpoints<typeof exaEndpointsNested>;

type ExaEndpoint<K extends keyof ExaEndpointOutputs> = CorsairEndpoint<
	ExaContext,
	ExaEndpointInputs[K],
	ExaEndpointOutputs[K]
>;

type ExaWebhook<K extends keyof ExaWebhookOutputs, TEvent> = CorsairWebhook<
	ExaContext,
	TEvent,
	ExaWebhookOutputs[K]
>;

export type ExaBoundWebhooks = BindWebhooks<ExaWebhooks>;

export type ExaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalExaPlugin['hooks'];
	webhookHooks?: InternalExaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof exaEndpointsNested>;
};

export type ExaContext = CorsairPluginContext<
	typeof ExaSchema,
	ExaPluginOptions
>;

export type ExaKeyBuilderContext = KeyBuilderContext<ExaPluginOptions>;

export type BaseExaPlugin<T extends ExaPluginOptions> = CorsairPlugin<
	'exa',
	typeof ExaSchema,
	typeof exaEndpointsNested,
	typeof exaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalExaPlugin = BaseExaPlugin<ExaPluginOptions>;

export type ExternalExaPlugin<T extends ExaPluginOptions> = BaseExaPlugin<T>;

export function exa<const T extends ExaPluginOptions>(
	incomingOptions: ExaPluginOptions & T = {} as ExaPluginOptions & T,
): ExternalExaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'exa',
		schema: ExaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: exaEndpointsNested,
		webhooks: exaWebhooksNested,
		endpointMeta: exaEndpointMeta,
		endpointSchemas: exaEndpointSchemas,
		webhookSchemas: exaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-exa-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ExaKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalExaPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ContentIndexedEvent,
	ExaWebhookOutputs,
	SearchAlertEvent,
	WebsetItemsFoundEvent,
	WebsetSearchCompletedEvent,
} from './webhooks/types';

export { createExaEventMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	EventsGetInput,
	EventsListInput,
	EventsListResponse,
	ExaEndpointInputs,
	ExaEndpointOutputs,
	FindSimilarInput,
	FindSimilarResponse,
	GetAnswerInput,
	GetAnswerResponse,
	GetContentsInput,
	GetContentsResponse,
	ImportsCreateInput,
	ImportsDeleteInput,
	ImportsDeleteResponse,
	ImportsListInput,
	ImportsListResponse,
	MonitorsCreateInput,
	SearchInput,
	SearchResponse,
	SearchResult,
	WebhookApi,
	WebhooksApiListInput,
	WebhooksApiListResponse,
	Webset,
	WebsetEvent,
	WebsetImport,
	WebsetMonitor,
	WebsetsCreateInput,
	WebsetsDeleteInput,
	WebsetsDeleteResponse,
	WebsetsGetInput,
} from './endpoints/types';
