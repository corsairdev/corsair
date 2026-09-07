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
import { readBodyRecord } from 'corsair/core';
import { Example } from './endpoints';
import type {
	WaboxappEndpointInputs,
	WaboxappEndpointOutputs,
} from './endpoints/types';
import {
	WaboxappEndpointInputSchemas,
	WaboxappEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WaboxappSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveWaboxappOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchWaboxappTenantWebhook } from './webhooks/tenant-matcher';
import type { MessageEvent, WaboxappWebhookOutputs } from './webhooks/types';
import { MessageEventSchema } from './webhooks/types';

export type WaboxappPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWaboxappPlugin['hooks'];
	webhookHooks?: InternalWaboxappPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof waboxappEndpointsNested>;
};

export type WaboxappContext = CorsairPluginContext<
	typeof WaboxappSchema,
	WaboxappPluginOptions
>;

export type WaboxappKeyBuilderContext =
	KeyBuilderContext<WaboxappPluginOptions>;

export type WaboxappBoundEndpoints = BindEndpoints<
	typeof waboxappEndpointsNested
>;

type WaboxappEndpoint<K extends keyof WaboxappEndpointOutputs> =
	CorsairEndpoint<
		WaboxappContext,
		WaboxappEndpointInputs[K],
		WaboxappEndpointOutputs[K]
	>;

export type WaboxappEndpoints = {
	exampleGet: WaboxappEndpoint<'exampleGet'>;
};

type WaboxappWebhook<
	K extends keyof WaboxappWebhookOutputs,
	TEvent,
> = CorsairWebhook<WaboxappContext, TEvent, WaboxappWebhookOutputs[K]>;

export type WaboxappWebhooks = {
	message: WaboxappWebhook<'message', MessageEvent>;
};

export type WaboxappBoundWebhooks = BindWebhooks<WaboxappWebhooks>;

const waboxappEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const waboxappWebhooksNested = {
	example: {
		message: ExampleWebhooks.example,
	},
} as const;

export const waboxappEndpointSchemas = {
	'example.get': {
		input: WaboxappEndpointInputSchemas.exampleGet,
		output: WaboxappEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof waboxappEndpointsNested
>;

const waboxappWebhookSchemas = {
	'example.message': {
		description: 'A new incoming WhatsApp message',
		payload: MessageEventSchema,
		response: MessageEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof waboxappWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const waboxappEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof waboxappEndpointsNested>;

export const waboxappAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWaboxappPlugin<T extends WaboxappPluginOptions> = CorsairPlugin<
	'waboxapp',
	typeof WaboxappSchema,
	typeof waboxappEndpointsNested,
	typeof waboxappWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWaboxappPlugin = BaseWaboxappPlugin<WaboxappPluginOptions>;

export type ExternalWaboxappPlugin<T extends WaboxappPluginOptions> =
	BaseWaboxappPlugin<T>;

export function waboxapp<const T extends WaboxappPluginOptions>(
	incomingOptions: WaboxappPluginOptions & T = {} as WaboxappPluginOptions & T,
): ExternalWaboxappPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'waboxapp',
		authConfig: waboxappAuthConfig,
		schema: WaboxappSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: waboxappEndpointsNested,
		webhooks: waboxappWebhooksNested,
		endpointMeta: waboxappEndpointMeta,
		endpointSchemas: waboxappEndpointSchemas,
		webhookSchemas: waboxappWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			// Waboxapp does not sign webhooks — confirmed empirically via
			// sandbox capture (no x-* / signature header present). Route
			// anything that looks like a Waboxapp payload instead, i.e. has
			// an `event` field in the (form-urlencoded) body.
			const body = readBodyRecord(request);
			return body !== null && typeof body.event === 'string';
		},
		pluginTenantWebhookMatcher: matchWaboxappTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveWaboxappOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WaboxappKeyBuilderContext, source) => {
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
	} satisfies InternalWaboxappPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	WaboxappEndpointInputs,
	WaboxappEndpointOutputs,
} from './endpoints/types';
export type {
	MessageEvent,
	WaboxappWebhookOutputs,
} from './webhooks/types';
