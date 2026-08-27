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
	HereEndpointInputs,
	HereEndpointOutputs,
} from './endpoints/types';
import {
	HereEndpointInputSchemas,
	HereEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HereSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveHereOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchHereTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, HereWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type HerePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHerePlugin['hooks'];
	webhookHooks?: InternalHerePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hereEndpointsNested>;
};

export type HereContext = CorsairPluginContext<
	typeof HereSchema,
	HerePluginOptions
>;

export type HereKeyBuilderContext = KeyBuilderContext<HerePluginOptions>;

export type HereBoundEndpoints = BindEndpoints<typeof hereEndpointsNested>;

type HereEndpoint<K extends keyof HereEndpointOutputs> = CorsairEndpoint<
	HereContext,
	HereEndpointInputs[K],
	HereEndpointOutputs[K]
>;

export type HereEndpoints = {
	exampleGet: HereEndpoint<'exampleGet'>;
};

type HereWebhook<K extends keyof HereWebhookOutputs, TEvent> = CorsairWebhook<
	HereContext,
	TEvent,
	HereWebhookOutputs[K]
>;

export type HereWebhooks = {
	example: HereWebhook<'example', ExampleEvent>;
};

export type HereBoundWebhooks = BindWebhooks<HereWebhooks>;

const hereEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const hereWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const hereEndpointSchemas = {
	'example.get': {
		input: HereEndpointInputSchemas.exampleGet,
		output: HereEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof hereEndpointsNested>;

const hereWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof hereWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hereEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof hereEndpointsNested>;

export const hereAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHerePlugin<T extends HerePluginOptions> = CorsairPlugin<
	'here',
	typeof HereSchema,
	typeof hereEndpointsNested,
	typeof hereWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHerePlugin = BaseHerePlugin<HerePluginOptions>;

export type ExternalHerePlugin<T extends HerePluginOptions> = BaseHerePlugin<T>;

export function here<const T extends HerePluginOptions>(
	incomingOptions: HerePluginOptions & T = {} as HerePluginOptions & T,
): ExternalHerePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'here',
		authConfig: hereAuthConfig,
		schema: HereSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: hereEndpointsNested,
		webhooks: hereWebhooksNested,
		endpointMeta: hereEndpointMeta,
		endpointSchemas: hereEndpointSchemas,
		webhookSchemas: hereWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-here-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHereTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHereOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HereKeyBuilderContext, source) => {
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
	} satisfies InternalHerePlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	HereEndpointInputs,
	HereEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	HereWebhookOutputs,
} from './webhooks/types';
