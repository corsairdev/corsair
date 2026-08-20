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
	AblyEndpointInputs,
	AblyEndpointOutputs,
} from './endpoints/types';
import {
	AblyEndpointInputSchemas,
	AblyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AblySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAblyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAblyTenantWebhook } from './webhooks/tenant-matcher';
import type { AblyWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AblyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAblyPlugin['hooks'];
	webhookHooks?: InternalAblyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ablyEndpointsNested>;
};

export type AblyContext = CorsairPluginContext<
	typeof AblySchema,
	AblyPluginOptions
>;

export type AblyKeyBuilderContext = KeyBuilderContext<AblyPluginOptions>;

export type AblyBoundEndpoints = BindEndpoints<typeof ablyEndpointsNested>;

type AblyEndpoint<K extends keyof AblyEndpointOutputs> = CorsairEndpoint<
	AblyContext,
	AblyEndpointInputs[K],
	AblyEndpointOutputs[K]
>;

export type AblyEndpoints = {
	exampleGet: AblyEndpoint<'exampleGet'>;
};

type AblyWebhook<K extends keyof AblyWebhookOutputs, TEvent> = CorsairWebhook<
	AblyContext,
	TEvent,
	AblyWebhookOutputs[K]
>;

export type AblyWebhooks = {
	example: AblyWebhook<'example', ExampleEvent>;
};

export type AblyBoundWebhooks = BindWebhooks<AblyWebhooks>;

const ablyEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const ablyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const ablyEndpointSchemas = {
	'example.get': {
		input: AblyEndpointInputSchemas.exampleGet,
		output: AblyEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ablyEndpointsNested>;

const ablyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof ablyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ablyEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ablyEndpointsNested>;

export const ablyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAblyPlugin<T extends AblyPluginOptions> = CorsairPlugin<
	'ably',
	typeof AblySchema,
	typeof ablyEndpointsNested,
	typeof ablyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAblyPlugin = BaseAblyPlugin<AblyPluginOptions>;

export type ExternalAblyPlugin<T extends AblyPluginOptions> = BaseAblyPlugin<T>;

export function ably<const T extends AblyPluginOptions>(
	incomingOptions: AblyPluginOptions & T = {} as AblyPluginOptions & T,
): ExternalAblyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ably',
		authConfig: ablyAuthConfig,
		schema: AblySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ablyEndpointsNested,
		webhooks: ablyWebhooksNested,
		endpointMeta: ablyEndpointMeta,
		endpointSchemas: ablyEndpointSchemas,
		webhookSchemas: ablyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-ably-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAblyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAblyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AblyKeyBuilderContext, source) => {
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
	} satisfies InternalAblyPlugin;
}

export type {
	AblyEndpointInputs,
	AblyEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AblyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
