import type {
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
import { Events, Memories, Webhooks } from './endpoints';
import type {
	Mem0EndpointInputs,
	Mem0EndpointOutputs,
} from './endpoints/types';
import {
	Mem0EndpointInputSchemas,
	Mem0EndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { Mem0Schema } from './schema';

export type Mem0PluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMem0Plugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mem0EndpointsNested>;
};

export type Mem0Context = CorsairPluginContext<
	typeof Mem0Schema,
	Mem0PluginOptions
>;

export type Mem0KeyBuilderContext = KeyBuilderContext<Mem0PluginOptions>;

export type Mem0BoundEndpoints = BindEndpoints<typeof mem0EndpointsNested>;

type Mem0Endpoint<K extends keyof Mem0EndpointOutputs> = CorsairEndpoint<
	Mem0Context,
	Mem0EndpointInputs[K],
	Mem0EndpointOutputs[K]
>;

export type Mem0Endpoints = {
	memoriesAdd: Mem0Endpoint<'memoriesAdd'>;
	memoriesSearch: Mem0Endpoint<'memoriesSearch'>;
	memoriesList: Mem0Endpoint<'memoriesList'>;
	memoriesGet: Mem0Endpoint<'memoriesGet'>;
	memoriesUpdate: Mem0Endpoint<'memoriesUpdate'>;
	memoriesDelete: Mem0Endpoint<'memoriesDelete'>;
	memoriesDeleteAll: Mem0Endpoint<'memoriesDeleteAll'>;
	memoriesHistory: Mem0Endpoint<'memoriesHistory'>;
	memoriesBatchUpdate: Mem0Endpoint<'memoriesBatchUpdate'>;
	memoriesBatchDelete: Mem0Endpoint<'memoriesBatchDelete'>;
	eventsGet: Mem0Endpoint<'eventsGet'>;
	eventsList: Mem0Endpoint<'eventsList'>;
	webhooksList: Mem0Endpoint<'webhooksList'>;
	webhooksCreate: Mem0Endpoint<'webhooksCreate'>;
	webhooksUpdate: Mem0Endpoint<'webhooksUpdate'>;
	webhooksDelete: Mem0Endpoint<'webhooksDelete'>;
};

export const mem0EndpointsNested = {
	memories: {
		add: Memories.add,
		search: Memories.search,
		list: Memories.list,
		get: Memories.get,
		update: Memories.update,
		delete: Memories.remove,
		deleteAll: Memories.deleteAll,
		history: Memories.history,
		batchUpdate: Memories.batchUpdate,
		batchDelete: Memories.batchDelete,
	},
	events: {
		get: Events.get,
		list: Events.list,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
} as const;

export const mem0EndpointSchemas = {
	'memories.add': {
		input: Mem0EndpointInputSchemas.memoriesAdd,
		output: Mem0EndpointOutputSchemas.memoriesAdd,
	},
	'memories.search': {
		input: Mem0EndpointInputSchemas.memoriesSearch,
		output: Mem0EndpointOutputSchemas.memoriesSearch,
	},
	'memories.list': {
		input: Mem0EndpointInputSchemas.memoriesList,
		output: Mem0EndpointOutputSchemas.memoriesList,
	},
	'memories.get': {
		input: Mem0EndpointInputSchemas.memoriesGet,
		output: Mem0EndpointOutputSchemas.memoriesGet,
	},
	'memories.update': {
		input: Mem0EndpointInputSchemas.memoriesUpdate,
		output: Mem0EndpointOutputSchemas.memoriesUpdate,
	},
	'memories.delete': {
		input: Mem0EndpointInputSchemas.memoriesDelete,
		output: Mem0EndpointOutputSchemas.memoriesDelete,
	},
	'memories.deleteAll': {
		input: Mem0EndpointInputSchemas.memoriesDeleteAll,
		output: Mem0EndpointOutputSchemas.memoriesDeleteAll,
	},
	'memories.history': {
		input: Mem0EndpointInputSchemas.memoriesHistory,
		output: Mem0EndpointOutputSchemas.memoriesHistory,
	},
	'memories.batchUpdate': {
		input: Mem0EndpointInputSchemas.memoriesBatchUpdate,
		output: Mem0EndpointOutputSchemas.memoriesBatchUpdate,
	},
	'memories.batchDelete': {
		input: Mem0EndpointInputSchemas.memoriesBatchDelete,
		output: Mem0EndpointOutputSchemas.memoriesBatchDelete,
	},
	'events.get': {
		input: Mem0EndpointInputSchemas.eventsGet,
		output: Mem0EndpointOutputSchemas.eventsGet,
	},
	'events.list': {
		input: Mem0EndpointInputSchemas.eventsList,
		output: Mem0EndpointOutputSchemas.eventsList,
	},
	'webhooks.list': {
		input: Mem0EndpointInputSchemas.webhooksList,
		output: Mem0EndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: Mem0EndpointInputSchemas.webhooksCreate,
		output: Mem0EndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: Mem0EndpointInputSchemas.webhooksUpdate,
		output: Mem0EndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: Mem0EndpointInputSchemas.webhooksDelete,
		output: Mem0EndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof mem0EndpointsNested>;

const defaultAuthType = 'api_key' as const;

export const mem0EndpointMeta = {
	'memories.add': {
		riskLevel: 'write',
		description:
			'Extract memories from conversation messages and store them for a user, agent, app or run; processing is queued and returns an event_id to poll',
	},
	'memories.search': {
		riskLevel: 'read',
		description:
			'Rank stored memories by relevance to a query with hybrid semantic, keyword and entity matching; entity IDs go inside `filters`',
	},
	'memories.list': {
		riskLevel: 'read',
		description:
			'List stored memories page by page, filtered by entity, date range or category; entity IDs go inside `filters`',
	},
	'memories.get': {
		riskLevel: 'read',
		description: 'Read one memory by its ID',
	},
	'memories.update': {
		riskLevel: 'write',
		description:
			"Change one memory's text or metadata, or set its expiration date; pass expiration_date as null to clear one",
	},
	'memories.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete one memory; delete_linked also removes memories linked to it',
	},
	'memories.deleteAll': {
		riskLevel: 'destructive',
		description:
			'Delete every memory matching a filter, or every memory for an entity when the filter is "*"; Mem0 queues the deletion and answers immediately',
	},
	'memories.history': {
		riskLevel: 'read',
		description:
			'Read the change history of one memory: each ADD, UPDATE and DELETE with its old and new text',
	},
	'memories.batchUpdate': {
		riskLevel: 'write',
		description: 'Update up to 1000 memories in one call',
	},
	'memories.batchDelete': {
		riskLevel: 'destructive',
		description: 'Permanently delete up to 1000 memories in one call',
	},
	'events.get': {
		riskLevel: 'read',
		description:
			'Read one queued event by ID to see whether an add or delete finished, failed, or is still running',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'List recent events for the organization and project, page by page, for dashboards or for finding failed writes',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List the webhooks registered on a project: each URL, its event subscriptions, and whether it is active',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a URL to receive Mem0 events for a project, subscribing it to memory add, update, delete or categorize and the ingest job events',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			"Change a webhook's label, URL or event subscriptions; the new event list replaces the old one",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Unregister a webhook so Mem0 stops posting events to its URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mem0EndpointsNested>;

export type BaseMem0Plugin<T extends Mem0PluginOptions> = CorsairPlugin<
	'mem0',
	typeof Mem0Schema,
	typeof mem0EndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalMem0Plugin = BaseMem0Plugin<Mem0PluginOptions>;

export type ExternalMem0Plugin<T extends Mem0PluginOptions> = BaseMem0Plugin<T>;

export function mem0<const T extends Mem0PluginOptions>(
	incomingOptions: Mem0PluginOptions & T = {} as Mem0PluginOptions & T,
): ExternalMem0Plugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mem0',
		schema: Mem0Schema,
		options: options,
		hooks: options.hooks,
		endpoints: mem0EndpointsNested,
		webhooks: {},
		endpointMeta: mem0EndpointMeta,
		endpointSchemas: mem0EndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: Mem0KeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('mem0', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMem0Plugin;
}

export { Mem0APIError } from './client';

export type {
	EventsGetInput,
	EventsGetResponse,
	EventsListInput,
	EventsListResponse,
	Mem0EndpointInputs,
	Mem0EndpointOutputs,
	Mem0Event,
	Mem0HistoryEntry,
	Mem0Memory,
	Mem0Message,
	Mem0SearchResult,
	Mem0Webhook,
	MemoriesAddInput,
	MemoriesAddResponse,
	MemoriesBatchDeleteInput,
	MemoriesBatchDeleteResponse,
	MemoriesBatchUpdateInput,
	MemoriesBatchUpdateResponse,
	MemoriesDeleteAllInput,
	MemoriesDeleteAllResponse,
	MemoriesDeleteInput,
	MemoriesDeleteResponse,
	MemoriesGetResponse,
	MemoriesHistoryResponse,
	MemoriesListInput,
	MemoriesListResponse,
	MemoriesSearchInput,
	MemoriesSearchResponse,
	MemoriesUpdateInput,
	MemoriesUpdateResponse,
	MemoryIdInput,
	ProjectIdInput,
	WebhooksCreateInput,
	WebhooksCreateResponse,
	WebhooksDeleteInput,
	WebhooksDeleteResponse,
	WebhooksListResponse,
	WebhooksUpdateInput,
	WebhooksUpdateResponse,
} from './endpoints/types';
