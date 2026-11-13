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
import type { GiftUpEndpointInputs, GiftUpEndpointOutputs } from './endpoints/types';
import { GiftUpEndpointInputSchemas, GiftUpEndpointOutputSchemas } from './endpoints/types';
import type {
	GiftUpWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GiftUpSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGiftUpTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGiftUpOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GiftUpPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGiftUpPlugin['hooks'];
	webhookHooks?: InternalGiftUpPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof giftUpEndpointsNested>;
};

export type GiftUpContext = CorsairPluginContext<
	typeof GiftUpSchema,
	GiftUpPluginOptions
>;

export type GiftUpKeyBuilderContext = KeyBuilderContext<GiftUpPluginOptions>;

export type GiftUpBoundEndpoints = BindEndpoints<typeof giftUpEndpointsNested>;

type GiftUpEndpoint<
	K extends keyof GiftUpEndpointOutputs,
> = CorsairEndpoint<
	GiftUpContext,
	GiftUpEndpointInputs[K],
	GiftUpEndpointOutputs[K]
>;

export type GiftUpEndpoints = {
	exampleGet: GiftUpEndpoint<'exampleGet'>;
};

type GiftUpWebhook<
	K extends keyof GiftUpWebhookOutputs,
	TEvent,
> = CorsairWebhook<GiftUpContext, TEvent, GiftUpWebhookOutputs[K]>;

export type GiftUpWebhooks = {
	example: GiftUpWebhook<'example', ExampleEvent>;
};

export type GiftUpBoundWebhooks = BindWebhooks<GiftUpWebhooks>;

const giftUpEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const giftUpWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const giftUpEndpointSchemas = {
	'example.get': {
		input: GiftUpEndpointInputSchemas.exampleGet,
		output: GiftUpEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof giftUpEndpointsNested>;

const giftUpWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof giftUpWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const giftUpEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof giftUpEndpointsNested>;

export const giftUpAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGiftUpPlugin<T extends GiftUpPluginOptions> = CorsairPlugin<
	'giftup',
	typeof GiftUpSchema,
	typeof giftUpEndpointsNested,
	typeof giftUpWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGiftUpPlugin = BaseGiftUpPlugin<GiftUpPluginOptions>;

export type ExternalGiftUpPlugin<T extends GiftUpPluginOptions> =
	BaseGiftUpPlugin<T>;

export function giftup<const T extends GiftUpPluginOptions>(
	incomingOptions: GiftUpPluginOptions & T = {} as GiftUpPluginOptions & T,
): ExternalGiftUpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'giftup',
		authConfig: giftUpAuthConfig,
		schema: GiftUpSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: giftUpEndpointsNested,
		webhooks: giftUpWebhooksNested,
		endpointMeta: giftUpEndpointMeta,
		endpointSchemas: giftUpEndpointSchemas,
		webhookSchemas: giftUpWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-giftup-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGiftUpTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGiftUpOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GiftUpKeyBuilderContext, source) => {
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
	} satisfies InternalGiftUpPlugin;
}

export type {
	ExampleEvent,
	GiftUpWebhookOutputs,
} from './webhooks/types';

export type {
	GiftUpEndpointInputs,
	GiftUpEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
