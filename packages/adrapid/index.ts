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
	AdrapidEndpointInputs,
	AdrapidEndpointOutputs,
} from './endpoints/types';
import {
	AdrapidEndpointInputSchemas,
	AdrapidEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AdrapidSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAdrapidOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAdrapidTenantWebhook } from './webhooks/tenant-matcher';
import type { AdrapidWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AdrapidPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAdrapidPlugin['hooks'];
	webhookHooks?: InternalAdrapidPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof adrapidEndpointsNested>;
};

export type AdrapidContext = CorsairPluginContext<
	typeof AdrapidSchema,
	AdrapidPluginOptions
>;

export type AdrapidKeyBuilderContext = KeyBuilderContext<AdrapidPluginOptions>;

export type AdrapidBoundEndpoints = BindEndpoints<
	typeof adrapidEndpointsNested
>;

type AdrapidEndpoint<K extends keyof AdrapidEndpointOutputs> = CorsairEndpoint<
	AdrapidContext,
	AdrapidEndpointInputs[K],
	AdrapidEndpointOutputs[K]
>;

export type AdrapidEndpoints = {
	exampleGet: AdrapidEndpoint<'exampleGet'>;
};

type AdrapidWebhook<
	K extends keyof AdrapidWebhookOutputs,
	TEvent,
> = CorsairWebhook<AdrapidContext, TEvent, AdrapidWebhookOutputs[K]>;

export type AdrapidWebhooks = {
	example: AdrapidWebhook<'example', ExampleEvent>;
};

export type AdrapidBoundWebhooks = BindWebhooks<AdrapidWebhooks>;

const adrapidEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const adrapidWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const adrapidEndpointSchemas = {
	'example.get': {
		input: AdrapidEndpointInputSchemas.exampleGet,
		output: AdrapidEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof adrapidEndpointsNested
>;

const adrapidWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof adrapidWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const adrapidEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof adrapidEndpointsNested>;

export const adrapidAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAdrapidPlugin<T extends AdrapidPluginOptions> = CorsairPlugin<
	'adrapid',
	typeof AdrapidSchema,
	typeof adrapidEndpointsNested,
	typeof adrapidWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAdrapidPlugin = BaseAdrapidPlugin<AdrapidPluginOptions>;

export type ExternalAdrapidPlugin<T extends AdrapidPluginOptions> =
	BaseAdrapidPlugin<T>;

export function adrapid<const T extends AdrapidPluginOptions>(
	incomingOptions: AdrapidPluginOptions & T = {} as AdrapidPluginOptions & T,
): ExternalAdrapidPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'adrapid',
		authConfig: adrapidAuthConfig,
		schema: AdrapidSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: adrapidEndpointsNested,
		webhooks: adrapidWebhooksNested,
		endpointMeta: adrapidEndpointMeta,
		endpointSchemas: adrapidEndpointSchemas,
		webhookSchemas: adrapidWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-adrapid-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAdrapidTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAdrapidOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AdrapidKeyBuilderContext, source) => {
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
	} satisfies InternalAdrapidPlugin;
}

export type {
	AdrapidEndpointInputs,
	AdrapidEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AdrapidWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
