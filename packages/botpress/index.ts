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
	BotpressEndpointInputs,
	BotpressEndpointOutputs,
} from './endpoints/types';
import {
	BotpressEndpointInputSchemas,
	BotpressEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BotpressSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBotpressOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBotpressTenantWebhook } from './webhooks/tenant-matcher';
import type { BotpressWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BotpressPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBotpressPlugin['hooks'];
	webhookHooks?: InternalBotpressPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof botpressEndpointsNested>;
};

export type BotpressContext = CorsairPluginContext<
	typeof BotpressSchema,
	BotpressPluginOptions
>;

export type BotpressKeyBuilderContext =
	KeyBuilderContext<BotpressPluginOptions>;

export type BotpressBoundEndpoints = BindEndpoints<
	typeof botpressEndpointsNested
>;

type BotpressEndpoint<K extends keyof BotpressEndpointOutputs> =
	CorsairEndpoint<
		BotpressContext,
		BotpressEndpointInputs[K],
		BotpressEndpointOutputs[K]
	>;

export type BotpressEndpoints = {
	exampleGet: BotpressEndpoint<'exampleGet'>;
};

type BotpressWebhook<
	K extends keyof BotpressWebhookOutputs,
	TEvent,
> = CorsairWebhook<BotpressContext, TEvent, BotpressWebhookOutputs[K]>;

export type BotpressWebhooks = {
	example: BotpressWebhook<'example', ExampleEvent>;
};

export type BotpressBoundWebhooks = BindWebhooks<BotpressWebhooks>;

const botpressEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const botpressWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const botpressEndpointSchemas = {
	'example.get': {
		input: BotpressEndpointInputSchemas.exampleGet,
		output: BotpressEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof botpressEndpointsNested
>;

const botpressWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof botpressWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const botpressEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof botpressEndpointsNested>;

export const botpressAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBotpressPlugin<T extends BotpressPluginOptions> = CorsairPlugin<
	'botpress',
	typeof BotpressSchema,
	typeof botpressEndpointsNested,
	typeof botpressWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBotpressPlugin = BaseBotpressPlugin<BotpressPluginOptions>;

export type ExternalBotpressPlugin<T extends BotpressPluginOptions> =
	BaseBotpressPlugin<T>;

export function botpress<const T extends BotpressPluginOptions>(
	incomingOptions: BotpressPluginOptions & T = {} as BotpressPluginOptions & T,
): ExternalBotpressPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'botpress',
		authConfig: botpressAuthConfig,
		schema: BotpressSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: botpressEndpointsNested,
		webhooks: botpressWebhooksNested,
		endpointMeta: botpressEndpointMeta,
		endpointSchemas: botpressEndpointSchemas,
		webhookSchemas: botpressWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-botpress-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBotpressTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBotpressOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BotpressKeyBuilderContext, source) => {
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
	} satisfies InternalBotpressPlugin;
}

export type {
	BotpressEndpointInputs,
	BotpressEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BotpressWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
