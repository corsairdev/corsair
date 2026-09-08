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
	RequiredPluginWebhookSchemas,
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
import { ExampleWebhooks } from './webhooks';
import { resolveHookdeckOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchHookdeckTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, HookdeckWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type HookdeckPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHookdeckPlugin['hooks'];
	webhookHooks?: InternalHookdeckPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
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

type HookdeckWebhook<
	K extends keyof HookdeckWebhookOutputs,
	TEvent,
> = CorsairWebhook<HookdeckContext, TEvent, HookdeckWebhookOutputs[K]>;

export type HookdeckWebhooks = {
	example: HookdeckWebhook<'example', ExampleEvent>;
};

export type HookdeckBoundWebhooks = BindWebhooks<HookdeckWebhooks>;

const hookdeckEndpointsNested = {
	connections: {
		list: Connections.list,
		create: Connections.create,
		get: Connections.get,
		update: Connections.update,
		delete: Connections.delete,
	},
} as const;

const hookdeckWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

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

const hookdeckWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof hookdeckWebhooksNested
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
	oauth_2: {
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
		webhookHooks: options.webhookHooks,
		endpoints: hookdeckEndpointsNested,
		webhooks: hookdeckWebhooksNested,
		endpointMeta: hookdeckEndpointMeta,
		endpointSchemas: hookdeckEndpointSchemas,
		webhookSchemas: hookdeckWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-hookdeck-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHookdeckTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHookdeckOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HookdeckKeyBuilderContext, source) => {
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

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
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
export type {
	ExampleEvent,
	HookdeckWebhookOutputs,
} from './webhooks/types';
