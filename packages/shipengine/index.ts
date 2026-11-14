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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { ShipEngineEndpointInputs, ShipEngineEndpointOutputs } from './endpoints/types';
import { ShipEngineEndpointInputSchemas, ShipEngineEndpointOutputSchemas } from './endpoints/types';
import type {
	ShipEngineWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ShipEngineSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchShipEngineTenantWebhook } from './webhooks/tenant-matcher';
import { resolveShipEngineOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ShipEnginePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalShipEnginePlugin['hooks'];
	webhookHooks?: InternalShipEnginePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof shipEngineEndpointsNested>;
};

export type ShipEngineContext = CorsairPluginContext<
	typeof ShipEngineSchema,
	ShipEnginePluginOptions
>;

export type ShipEngineKeyBuilderContext = KeyBuilderContext<ShipEnginePluginOptions>;

export type ShipEngineBoundEndpoints = BindEndpoints<typeof shipEngineEndpointsNested>;

type ShipEngineEndpoint<
	K extends keyof ShipEngineEndpointOutputs,
> = CorsairEndpoint<
	ShipEngineContext,
	ShipEngineEndpointInputs[K],
	ShipEngineEndpointOutputs[K]
>;

export type ShipEngineEndpoints = {
	exampleGet: ShipEngineEndpoint<'exampleGet'>;
};

type ShipEngineWebhook<
	K extends keyof ShipEngineWebhookOutputs,
	TEvent,
> = CorsairWebhook<ShipEngineContext, TEvent, ShipEngineWebhookOutputs[K]>;

export type ShipEngineWebhooks = {
	example: ShipEngineWebhook<'example', ExampleEvent>;
};

export type ShipEngineBoundWebhooks = BindWebhooks<ShipEngineWebhooks>;

const shipEngineEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const shipEngineWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const shipEngineEndpointSchemas = {
	'example.get': {
		input: ShipEngineEndpointInputSchemas.exampleGet,
		output: ShipEngineEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof shipEngineEndpointsNested>;

const shipEngineWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof shipEngineWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const shipEngineEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof shipEngineEndpointsNested>;

export const shipEngineAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseShipEnginePlugin<T extends ShipEnginePluginOptions> = CorsairPlugin<
	'shipengine',
	typeof ShipEngineSchema,
	typeof shipEngineEndpointsNested,
	typeof shipEngineWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalShipEnginePlugin = BaseShipEnginePlugin<ShipEnginePluginOptions>;

export type ExternalShipEnginePlugin<T extends ShipEnginePluginOptions> =
	BaseShipEnginePlugin<T>;

export function shipengine<const T extends ShipEnginePluginOptions>(
	incomingOptions: ShipEnginePluginOptions & T = {} as ShipEnginePluginOptions & T,
): ExternalShipEnginePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'shipengine',
		authConfig: shipEngineAuthConfig,
		schema: ShipEngineSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: shipEngineEndpointsNested,
		webhooks: shipEngineWebhooksNested,
		endpointMeta: shipEngineEndpointMeta,
		endpointSchemas: shipEngineEndpointSchemas,
		webhookSchemas: shipEngineWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-shipengine-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchShipEngineTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveShipEngineOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ShipEngineKeyBuilderContext, source) => {
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
	} satisfies InternalShipEnginePlugin;
}

export type {
	ExampleEvent,
	ShipEngineWebhookOutputs,
} from './webhooks/types';

export type {
	ShipEngineEndpointInputs,
	ShipEngineEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
