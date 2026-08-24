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
	TextrazorEndpointInputs,
	TextrazorEndpointOutputs,
} from './endpoints/types';
import {
	TextrazorEndpointInputSchemas,
	TextrazorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TextrazorSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveTextrazorOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchTextrazorTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, TextrazorWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type TextrazorPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTextrazorPlugin['hooks'];
	webhookHooks?: InternalTextrazorPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof textrazorEndpointsNested>;
};

export type TextrazorContext = CorsairPluginContext<
	typeof TextrazorSchema,
	TextrazorPluginOptions
>;

export type TextrazorKeyBuilderContext =
	KeyBuilderContext<TextrazorPluginOptions>;

export type TextrazorBoundEndpoints = BindEndpoints<
	typeof textrazorEndpointsNested
>;

type TextrazorEndpoint<K extends keyof TextrazorEndpointOutputs> =
	CorsairEndpoint<
		TextrazorContext,
		TextrazorEndpointInputs[K],
		TextrazorEndpointOutputs[K]
	>;

export type TextrazorEndpoints = {
	exampleGet: TextrazorEndpoint<'exampleGet'>;
};

type TextrazorWebhook<
	K extends keyof TextrazorWebhookOutputs,
	TEvent,
> = CorsairWebhook<TextrazorContext, TEvent, TextrazorWebhookOutputs[K]>;

export type TextrazorWebhooks = {
	example: TextrazorWebhook<'example', ExampleEvent>;
};

export type TextrazorBoundWebhooks = BindWebhooks<TextrazorWebhooks>;

const textrazorEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const textrazorWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const textrazorEndpointSchemas = {
	'example.get': {
		input: TextrazorEndpointInputSchemas.exampleGet,
		output: TextrazorEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof textrazorEndpointsNested
>;

const textrazorWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof textrazorWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const textrazorEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof textrazorEndpointsNested
>;

export const textrazorAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTextrazorPlugin<T extends TextrazorPluginOptions> =
	CorsairPlugin<
		'textrazor',
		typeof TextrazorSchema,
		typeof textrazorEndpointsNested,
		typeof textrazorWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalTextrazorPlugin =
	BaseTextrazorPlugin<TextrazorPluginOptions>;

export type ExternalTextrazorPlugin<T extends TextrazorPluginOptions> =
	BaseTextrazorPlugin<T>;

export function textrazor<const T extends TextrazorPluginOptions>(
	incomingOptions: TextrazorPluginOptions & T = {} as TextrazorPluginOptions &
		T,
): ExternalTextrazorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'textrazor',
		authConfig: textrazorAuthConfig,
		schema: TextrazorSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: textrazorEndpointsNested,
		webhooks: textrazorWebhooksNested,
		endpointMeta: textrazorEndpointMeta,
		endpointSchemas: textrazorEndpointSchemas,
		webhookSchemas: textrazorWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-textrazor-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTextrazorTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTextrazorOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TextrazorKeyBuilderContext, source) => {
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
	} satisfies InternalTextrazorPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	TextrazorEndpointInputs,
	TextrazorEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	TextrazorWebhookOutputs,
} from './webhooks/types';
