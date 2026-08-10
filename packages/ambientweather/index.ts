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
import { Example } from './endpoints';
import type {
	AmbientWeatherEndpointInputs,
	AmbientWeatherEndpointOutputs,
} from './endpoints/types';
import {
	AmbientWeatherEndpointInputSchemas,
	AmbientWeatherEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AmbientWeatherSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAmbientWeatherOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAmbientWeatherTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AmbientWeatherWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AmbientWeatherPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAmbientWeatherPlugin['hooks'];
	webhookHooks?: InternalAmbientWeatherPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ambientWeatherEndpointsNested>;
};

export type AmbientWeatherContext = CorsairPluginContext<
	typeof AmbientWeatherSchema,
	AmbientWeatherPluginOptions
>;

export type AmbientWeatherKeyBuilderContext =
	KeyBuilderContext<AmbientWeatherPluginOptions>;

export type AmbientWeatherBoundEndpoints = BindEndpoints<
	typeof ambientWeatherEndpointsNested
>;

type AmbientWeatherEndpoint<K extends keyof AmbientWeatherEndpointOutputs> =
	CorsairEndpoint<
		AmbientWeatherContext,
		AmbientWeatherEndpointInputs[K],
		AmbientWeatherEndpointOutputs[K]
	>;

export type AmbientWeatherEndpoints = {
	exampleGet: AmbientWeatherEndpoint<'exampleGet'>;
};

type AmbientWeatherWebhook<
	K extends keyof AmbientWeatherWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	AmbientWeatherContext,
	TEvent,
	AmbientWeatherWebhookOutputs[K]
>;

export type AmbientWeatherWebhooks = {
	example: AmbientWeatherWebhook<'example', ExampleEvent>;
};

export type AmbientWeatherBoundWebhooks = BindWebhooks<AmbientWeatherWebhooks>;

const ambientWeatherEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const ambientWeatherWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const ambientWeatherEndpointSchemas = {
	'example.get': {
		input: AmbientWeatherEndpointInputSchemas.exampleGet,
		output: AmbientWeatherEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ambientWeatherEndpointsNested
>;

const ambientWeatherWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof ambientWeatherWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ambientWeatherEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof ambientWeatherEndpointsNested
>;

export const ambientWeatherAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAmbientWeatherPlugin<T extends AmbientWeatherPluginOptions> =
	CorsairPlugin<
		'ambientweather',
		typeof AmbientWeatherSchema,
		typeof ambientWeatherEndpointsNested,
		typeof ambientWeatherWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAmbientWeatherPlugin =
	BaseAmbientWeatherPlugin<AmbientWeatherPluginOptions>;

export type ExternalAmbientWeatherPlugin<
	T extends AmbientWeatherPluginOptions,
> = BaseAmbientWeatherPlugin<T>;

export function ambientweather<const T extends AmbientWeatherPluginOptions>(
	incomingOptions: AmbientWeatherPluginOptions &
		T = {} as AmbientWeatherPluginOptions & T,
): ExternalAmbientWeatherPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ambientweather',
		authConfig: ambientWeatherAuthConfig,
		schema: AmbientWeatherSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ambientWeatherEndpointsNested,
		webhooks: ambientWeatherWebhooksNested,
		endpointMeta: ambientWeatherEndpointMeta,
		endpointSchemas: ambientWeatherEndpointSchemas,
		webhookSchemas: ambientWeatherWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-ambientweather-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAmbientWeatherTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAmbientWeatherOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AmbientWeatherKeyBuilderContext, source) => {
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
	} satisfies InternalAmbientWeatherPlugin;
}

export type {
	AmbientWeatherEndpointInputs,
	AmbientWeatherEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AmbientWeatherWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
