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
import { SavedObjects } from './endpoints';
import type {
	KibanaEndpointInputs,
	KibanaEndpointOutputs,
	SavedObjectsFindInput,
	SavedObjectsFindResponse,
	SavedObjectsGetInput,
	SavedObjectsGetResponse,
} from './endpoints/types';
import {
	KibanaEndpointInputSchemas,
	KibanaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KibanaSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveKibanaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchKibanaTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, KibanaWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type KibanaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	webhookSecret?: string;
	hooks?: InternalKibanaPlugin['hooks'];
	webhookHooks?: InternalKibanaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kibanaEndpointsNested>;
};

export const kibanaAuthConfig = {
	api_key: {
		account: ['base_url', 'tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KibanaContext = CorsairPluginContext<
	typeof KibanaSchema,
	KibanaPluginOptions,
	undefined,
	typeof kibanaAuthConfig
>;

export type KibanaKeyBuilderContext = KeyBuilderContext<
	KibanaPluginOptions,
	typeof kibanaAuthConfig
>;

export type KibanaBoundEndpoints = BindEndpoints<typeof kibanaEndpointsNested>;

type KibanaEndpoint<K extends keyof KibanaEndpointOutputs> = CorsairEndpoint<
	KibanaContext,
	KibanaEndpointInputs[K],
	KibanaEndpointOutputs[K]
>;

export type KibanaEndpoints = {
	savedObjectsFind: KibanaEndpoint<'savedObjectsFind'>;
	savedObjectsGet: KibanaEndpoint<'savedObjectsGet'>;
};

type KibanaWebhook<
	K extends keyof KibanaWebhookOutputs,
	TEvent,
> = CorsairWebhook<KibanaContext, TEvent, KibanaWebhookOutputs[K]>;

export type KibanaWebhooks = {
	example: KibanaWebhook<'example', ExampleEvent>;
};

export type KibanaBoundWebhooks = BindWebhooks<KibanaWebhooks>;

const kibanaEndpointsNested = {
	savedObjects: {
		find: SavedObjects.find,
		get: SavedObjects.get,
	},
} as const;

const kibanaWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const kibanaEndpointSchemas = {
	'savedObjects.find': {
		input: KibanaEndpointInputSchemas.savedObjectsFind,
		output: KibanaEndpointOutputSchemas.savedObjectsFind,
	},
	'savedObjects.get': {
		input: KibanaEndpointInputSchemas.savedObjectsGet,
		output: KibanaEndpointOutputSchemas.savedObjectsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof kibanaEndpointsNested
>;

const kibanaWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof kibanaWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const kibanaEndpointMeta = {
	'savedObjects.find': {
		riskLevel: 'read',
		description: 'Find saved objects matching the criteria',
	},
	'savedObjects.get': {
		riskLevel: 'read',
		description: 'Get a saved object by type and ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kibanaEndpointsNested>;

export type BaseKibanaPlugin<T extends KibanaPluginOptions> = CorsairPlugin<
	'kibana',
	typeof KibanaSchema,
	typeof kibanaEndpointsNested,
	typeof kibanaWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof kibanaAuthConfig
>;

export type InternalKibanaPlugin = BaseKibanaPlugin<KibanaPluginOptions>;

export type ExternalKibanaPlugin<T extends KibanaPluginOptions> =
	BaseKibanaPlugin<T>;

export function kibana<const T extends KibanaPluginOptions>(
	incomingOptions: KibanaPluginOptions & T = {} as KibanaPluginOptions & T,
): ExternalKibanaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kibana',
		authConfig: kibanaAuthConfig,
		schema: KibanaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: kibanaEndpointsNested,
		webhooks: kibanaWebhooksNested,
		endpointMeta: kibanaEndpointMeta,
		endpointSchemas: kibanaEndpointSchemas,
		webhookSchemas: kibanaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-kibana-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchKibanaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveKibanaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: KibanaKeyBuilderContext, source) => {
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
	} satisfies InternalKibanaPlugin;
}

export type {
	KibanaEndpointInputs,
	KibanaEndpointOutputs,
	SavedObjectsFindInput,
	SavedObjectsFindResponse,
	SavedObjectsGetInput,
	SavedObjectsGetResponse,
} from './endpoints/types';
export type {
	ExampleEvent,
	KibanaWebhookOutputs,
} from './webhooks/types';
