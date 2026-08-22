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
	AsticaAiEndpointInputs,
	AsticaAiEndpointOutputs,
} from './endpoints/types';
import {
	AsticaAiEndpointInputSchemas,
	AsticaAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AsticaAiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAsticaAiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAsticaAiTenantWebhook } from './webhooks/tenant-matcher';
import type { AsticaAiWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AsticaAiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAsticaAiPlugin['hooks'];
	webhookHooks?: InternalAsticaAiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof asticaAiEndpointsNested>;
};

export type AsticaAiContext = CorsairPluginContext<
	typeof AsticaAiSchema,
	AsticaAiPluginOptions
>;

export type AsticaAiKeyBuilderContext =
	KeyBuilderContext<AsticaAiPluginOptions>;

export type AsticaAiBoundEndpoints = BindEndpoints<
	typeof asticaAiEndpointsNested
>;

type AsticaAiEndpoint<K extends keyof AsticaAiEndpointOutputs> =
	CorsairEndpoint<
		AsticaAiContext,
		AsticaAiEndpointInputs[K],
		AsticaAiEndpointOutputs[K]
	>;

export type AsticaAiEndpoints = {
	exampleGet: AsticaAiEndpoint<'exampleGet'>;
};

type AsticaAiWebhook<
	K extends keyof AsticaAiWebhookOutputs,
	TEvent,
> = CorsairWebhook<AsticaAiContext, TEvent, AsticaAiWebhookOutputs[K]>;

export type AsticaAiWebhooks = {
	example: AsticaAiWebhook<'example', ExampleEvent>;
};

export type AsticaAiBoundWebhooks = BindWebhooks<AsticaAiWebhooks>;

const asticaAiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const asticaAiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const asticaAiEndpointSchemas = {
	'example.get': {
		input: AsticaAiEndpointInputSchemas.exampleGet,
		output: AsticaAiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof asticaAiEndpointsNested
>;

const asticaAiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof asticaAiWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const asticaAiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof asticaAiEndpointsNested>;

export const asticaAiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAsticaAiPlugin<T extends AsticaAiPluginOptions> = CorsairPlugin<
	'asticaai',
	typeof AsticaAiSchema,
	typeof asticaAiEndpointsNested,
	typeof asticaAiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAsticaAiPlugin = BaseAsticaAiPlugin<AsticaAiPluginOptions>;

export type ExternalAsticaAiPlugin<T extends AsticaAiPluginOptions> =
	BaseAsticaAiPlugin<T>;

export function asticaai<const T extends AsticaAiPluginOptions>(
	incomingOptions: AsticaAiPluginOptions & T = {} as AsticaAiPluginOptions & T,
): ExternalAsticaAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'asticaai',
		authConfig: asticaAiAuthConfig,
		schema: AsticaAiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: asticaAiEndpointsNested,
		webhooks: asticaAiWebhooksNested,
		endpointMeta: asticaAiEndpointMeta,
		endpointSchemas: asticaAiEndpointSchemas,
		webhookSchemas: asticaAiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-asticaai-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAsticaAiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAsticaAiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AsticaAiKeyBuilderContext, source) => {
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
	} satisfies InternalAsticaAiPlugin;
}

export type {
	AsticaAiEndpointInputs,
	AsticaAiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AsticaAiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
