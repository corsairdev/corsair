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
	AscoraEndpointInputs,
	AscoraEndpointOutputs,
} from './endpoints/types';
import {
	AscoraEndpointInputSchemas,
	AscoraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AscoraSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAscoraOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAscoraTenantWebhook } from './webhooks/tenant-matcher';
import type { AscoraWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AscoraPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAscoraPlugin['hooks'];
	webhookHooks?: InternalAscoraPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ascoraEndpointsNested>;
};

export type AscoraContext = CorsairPluginContext<
	typeof AscoraSchema,
	AscoraPluginOptions
>;

export type AscoraKeyBuilderContext = KeyBuilderContext<AscoraPluginOptions>;

export type AscoraBoundEndpoints = BindEndpoints<typeof ascoraEndpointsNested>;

type AscoraEndpoint<K extends keyof AscoraEndpointOutputs> = CorsairEndpoint<
	AscoraContext,
	AscoraEndpointInputs[K],
	AscoraEndpointOutputs[K]
>;

export type AscoraEndpoints = {
	exampleGet: AscoraEndpoint<'exampleGet'>;
};

type AscoraWebhook<
	K extends keyof AscoraWebhookOutputs,
	TEvent,
> = CorsairWebhook<AscoraContext, TEvent, AscoraWebhookOutputs[K]>;

export type AscoraWebhooks = {
	example: AscoraWebhook<'example', ExampleEvent>;
};

export type AscoraBoundWebhooks = BindWebhooks<AscoraWebhooks>;

const ascoraEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const ascoraWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const ascoraEndpointSchemas = {
	'example.get': {
		input: AscoraEndpointInputSchemas.exampleGet,
		output: AscoraEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ascoraEndpointsNested
>;

const ascoraWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof ascoraWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ascoraEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ascoraEndpointsNested>;

export const ascoraAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAscoraPlugin<T extends AscoraPluginOptions> = CorsairPlugin<
	'ascora',
	typeof AscoraSchema,
	typeof ascoraEndpointsNested,
	typeof ascoraWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAscoraPlugin = BaseAscoraPlugin<AscoraPluginOptions>;

export type ExternalAscoraPlugin<T extends AscoraPluginOptions> =
	BaseAscoraPlugin<T>;

export function ascora<const T extends AscoraPluginOptions>(
	incomingOptions: AscoraPluginOptions & T = {} as AscoraPluginOptions & T,
): ExternalAscoraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ascora',
		authConfig: ascoraAuthConfig,
		schema: AscoraSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ascoraEndpointsNested,
		webhooks: ascoraWebhooksNested,
		endpointMeta: ascoraEndpointMeta,
		endpointSchemas: ascoraEndpointSchemas,
		webhookSchemas: ascoraWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-ascora-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAscoraTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAscoraOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AscoraKeyBuilderContext, source) => {
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
	} satisfies InternalAscoraPlugin;
}

export type {
	AscoraEndpointInputs,
	AscoraEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AscoraWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
