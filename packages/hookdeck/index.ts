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
import { Connections } from './endpoints';
import type {
	HookdeckEndpointInputs,
	HookdeckEndpointOutputs,
} from './endpoints/types';
import {
	HookdeckEndpointInputSchemas,
	HookdeckEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HookdeckSchema } from './schema';

export type HookdeckPluginOptions = {
	/** Authentication method. Only api_key is supported (Hookdeck project API key). */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager). */
	key?: string;
	/** Optional: lifecycle hooks for endpoints. */
	hooks?: InternalHookdeckPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults). */
	errorHandlers?: CorsairErrorHandler;
	/** Permission configuration for the Hookdeck plugin. */
	permissions?: PluginPermissionsConfig<typeof hookdeckEndpointsNested>;
};

export type HookdeckContext = CorsairPluginContext<
	typeof HookdeckSchema,
	HookdeckPluginOptions
>;

export type HookdeckKeyBuilderContext =
	KeyBuilderContext<HookdeckPluginOptions>;

export type HookdeckBoundEndpoints = BindEndpoints<
	typeof hookdeckEndpointsNested
>;

type HookdeckEndpoint<K extends keyof HookdeckEndpointOutputs> =
	CorsairEndpoint<
		HookdeckContext,
		HookdeckEndpointInputs[K],
		HookdeckEndpointOutputs[K]
	>;

export type HookdeckEndpoints = {
	connectionsList: HookdeckEndpoint<'connectionsList'>;
	connectionsCreate: HookdeckEndpoint<'connectionsCreate'>;
	connectionsGet: HookdeckEndpoint<'connectionsGet'>;
	connectionsUpdate: HookdeckEndpoint<'connectionsUpdate'>;
	connectionsDelete: HookdeckEndpoint<'connectionsDelete'>;
};

const hookdeckEndpointsNested = {
	connections: {
		list: Connections.list,
		create: Connections.create,
		get: Connections.get,
		update: Connections.update,
		delete: Connections.delete,
	},
} as const;

// No webhooks — this plugin covers Hookdeck connection management (a
// pull-based REST surface); the generator's example webhook was removed.
const hookdeckWebhooksNested = {} as const;

export const hookdeckEndpointSchemas = {
	'connections.list': {
		input: HookdeckEndpointInputSchemas.connectionsList,
		output: HookdeckEndpointOutputSchemas.connectionsList,
	},
	'connections.create': {
		input: HookdeckEndpointInputSchemas.connectionsCreate,
		output: HookdeckEndpointOutputSchemas.connectionsCreate,
	},
	'connections.get': {
		input: HookdeckEndpointInputSchemas.connectionsGet,
		output: HookdeckEndpointOutputSchemas.connectionsGet,
	},
	'connections.update': {
		input: HookdeckEndpointInputSchemas.connectionsUpdate,
		output: HookdeckEndpointOutputSchemas.connectionsUpdate,
	},
	'connections.delete': {
		input: HookdeckEndpointInputSchemas.connectionsDelete,
		output: HookdeckEndpointOutputSchemas.connectionsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof hookdeckEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hookdeckEndpointMeta = {
	'connections.list': {
		riskLevel: 'read',
		description: 'List all connections',
	},
	'connections.create': {
		riskLevel: 'write',
		description: 'Create a new connection',
	},
	'connections.get': {
		riskLevel: 'read',
		description: 'Get a connection by ID',
	},
	'connections.update': {
		riskLevel: 'write',
		description: 'Update an existing connection',
	},
	'connections.delete': {
		riskLevel: 'write',
		description: 'Delete a connection',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof hookdeckEndpointsNested>;

export const hookdeckAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHookdeckPlugin<T extends HookdeckPluginOptions> = CorsairPlugin<
	'hookdeck',
	typeof HookdeckSchema,
	typeof hookdeckEndpointsNested,
	typeof hookdeckWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHookdeckPlugin = BaseHookdeckPlugin<HookdeckPluginOptions>;

export type ExternalHookdeckPlugin<T extends HookdeckPluginOptions> =
	BaseHookdeckPlugin<T>;

export function hookdeck<const T extends HookdeckPluginOptions>(
	incomingOptions: HookdeckPluginOptions & T = {} as HookdeckPluginOptions & T,
): ExternalHookdeckPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hookdeck',
		authConfig: hookdeckAuthConfig,
		schema: HookdeckSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: hookdeckEndpointsNested,
		webhooks: hookdeckWebhooksNested,
		endpointMeta: hookdeckEndpointMeta,
		endpointSchemas: hookdeckEndpointSchemas,
		// No webhooks — connection management only.
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HookdeckKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalHookdeckPlugin;
}

export type {
	HookdeckEndpointInputs,
	HookdeckEndpointOutputs,
} from './endpoints/types';
