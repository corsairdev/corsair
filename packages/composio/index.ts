import type {
	AuthTypes,
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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import {
	ActionsEndpoints,
	AppsEndpoints,
	ConnectionsEndpoints,
	ToolsEndpoints,
} from './endpoints';
import type {
	ComposioEndpointInputs,
	ComposioEndpointOutputs,
} from './endpoints/types';
import {
	ComposioEndpointInputSchemas,
	ComposioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ComposioSchema } from './schema';
import { TriggerWebhooks } from './webhooks';
import type {
	ComposioWebhookOutputs,
	ProjectEvent,
	TriggerMessageEvent,
} from './webhooks/types';

export type ComposioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalComposioPlugin['hooks'];
	webhookHooks?: InternalComposioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof composioEndpointsNested>;
};

export type ComposioContext = CorsairPluginContext<
	typeof ComposioSchema,
	ComposioPluginOptions
>;

export type ComposioKeyBuilderContext =
	KeyBuilderContext<ComposioPluginOptions>;

export type ComposioBoundEndpoints = BindEndpoints<
	typeof composioEndpointsNested
>;

type ComposioEndpoint<
	K extends keyof ComposioEndpointOutputs,
	Input,
> = CorsairEndpoint<ComposioContext, Input, ComposioEndpointOutputs[K]>;

export type ComposioEndpoints = {
	toolsList: ComposioEndpoint<'toolsList', ComposioEndpointInputs['toolsList']>;
	toolGet: ComposioEndpoint<'toolGet', ComposioEndpointInputs['toolGet']>;
	actionsList: ComposioEndpoint<
		'actionsList',
		ComposioEndpointInputs['actionsList']
	>;
	actionGet: ComposioEndpoint<'actionGet', ComposioEndpointInputs['actionGet']>;
	actionExecute: ComposioEndpoint<
		'actionExecute',
		ComposioEndpointInputs['actionExecute']
	>;
	connectionsList: ComposioEndpoint<
		'connectionsList',
		ComposioEndpointInputs['connectionsList']
	>;
	connectionCreate: ComposioEndpoint<
		'connectionCreate',
		ComposioEndpointInputs['connectionCreate']
	>;
	connectionDelete: ComposioEndpoint<
		'connectionDelete',
		ComposioEndpointInputs['connectionDelete']
	>;
	appsList: ComposioEndpoint<'appsList', ComposioEndpointInputs['appsList']>;
};

type ComposioWebhook<
	K extends keyof ComposioWebhookOutputs,
	TEvent,
> = CorsairWebhook<ComposioContext, TEvent, ComposioWebhookOutputs[K]>;

export type ComposioWebhooks = {
	triggerMessage: ComposioWebhook<'triggerMessage', TriggerMessageEvent>;
	projectEvent: ComposioWebhook<'projectEvent', ProjectEvent>;
};

export type ComposioBoundWebhooks = BindWebhooks<ComposioWebhooks>;

const composioEndpointsNested = {
	tools: {
		list: ToolsEndpoints.list,
		get: ToolsEndpoints.get,
	},
	actions: {
		list: ActionsEndpoints.list,
		get: ActionsEndpoints.get,
		execute: ActionsEndpoints.execute,
	},
	connections: {
		list: ConnectionsEndpoints.list,
		create: ConnectionsEndpoints.create,
		delete: ConnectionsEndpoints.delete,
	},
	apps: {
		list: AppsEndpoints.list,
	},
} as const;

const composioWebhooksNested = {
	triggers: {
		message: TriggerWebhooks.triggerMessage,
		projectEvent: TriggerWebhooks.projectEvent,
	},
} as const;

export const composioEndpointSchemas = {
	'tools.list': {
		input: ComposioEndpointInputSchemas.toolsList,
		output: ComposioEndpointOutputSchemas.toolsList,
	},
	'tools.get': {
		input: ComposioEndpointInputSchemas.toolGet,
		output: ComposioEndpointOutputSchemas.toolGet,
	},
	'actions.list': {
		input: ComposioEndpointInputSchemas.actionsList,
		output: ComposioEndpointOutputSchemas.actionsList,
	},
	'actions.get': {
		input: ComposioEndpointInputSchemas.actionGet,
		output: ComposioEndpointOutputSchemas.actionGet,
	},
	'actions.execute': {
		input: ComposioEndpointInputSchemas.actionExecute,
		output: ComposioEndpointOutputSchemas.actionExecute,
	},
	'connections.list': {
		input: ComposioEndpointInputSchemas.connectionsList,
		output: ComposioEndpointOutputSchemas.connectionsList,
	},
	'connections.create': {
		input: ComposioEndpointInputSchemas.connectionCreate,
		output: ComposioEndpointOutputSchemas.connectionCreate,
	},
	'connections.delete': {
		input: ComposioEndpointInputSchemas.connectionDelete,
		output: ComposioEndpointOutputSchemas.connectionDelete,
	},
	'apps.list': {
		input: ComposioEndpointInputSchemas.appsList,
		output: ComposioEndpointOutputSchemas.appsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof composioEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const composioEndpointMeta = {
	'tools.list': {
		riskLevel: 'read',
		description: 'List executable Composio tools (v3)',
	},
	'tools.get': {
		riskLevel: 'read',
		description: 'Get a tool by slug',
	},
	'actions.list': {
		riskLevel: 'read',
		description: 'List tools for a toolkit (alias of tools.list)',
	},
	'actions.get': {
		riskLevel: 'read',
		description: 'Get a tool by slug (alias of tools.get)',
	},
	'actions.execute': {
		riskLevel: 'write',
		description: 'Execute a tool by slug',
	},
	'connections.list': {
		riskLevel: 'read',
		description: 'List connected accounts',
	},
	'connections.create': {
		riskLevel: 'write',
		description: 'Create a connected-account auth link',
	},
	'connections.delete': {
		riskLevel: 'write',
		description: 'Delete a connected account',
	},
	'apps.list': {
		riskLevel: 'read',
		description: 'List toolkits (apps)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof composioEndpointsNested>;

export const composioAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseComposioPlugin<T extends ComposioPluginOptions> = CorsairPlugin<
	'composio',
	typeof ComposioSchema,
	typeof composioEndpointsNested,
	typeof composioWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalComposioPlugin = BaseComposioPlugin<ComposioPluginOptions>;

export type ExternalComposioPlugin<T extends ComposioPluginOptions> =
	BaseComposioPlugin<T>;

export function composio<const T extends ComposioPluginOptions>(
	incomingOptions: ComposioPluginOptions & T = {} as ComposioPluginOptions & T,
): ExternalComposioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'composio',
		schema: ComposioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: composioEndpointsNested,
		webhooks: composioWebhooksNested,
		endpointMeta: composioEndpointMeta,
		endpointSchemas: composioEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// Standard Webhooks headers used by Composio
			return (
				'webhook-signature' in headers &&
				'webhook-id' in headers &&
				'webhook-timestamp' in headers
			);
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ComposioKeyBuilderContext, source) => {
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
	} satisfies InternalComposioPlugin;
}

export type {
	ComposioEndpointInputs,
	ComposioEndpointOutputs,
} from './endpoints/types';
export type {
	ComposioWebhookOutputs,
	ProjectEvent,
	TriggerMessageEvent,
} from './webhooks/types';
