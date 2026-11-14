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
import type { ThinkificEndpointInputs, ThinkificEndpointOutputs } from './endpoints/types';
import { ThinkificEndpointInputSchemas, ThinkificEndpointOutputSchemas } from './endpoints/types';
import type {
	ThinkificWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ThinkificSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchThinkificTenantWebhook } from './webhooks/tenant-matcher';
import { resolveThinkificOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ThinkificPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalThinkificPlugin['hooks'];
	webhookHooks?: InternalThinkificPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof thinkificEndpointsNested>;
};

export type ThinkificContext = CorsairPluginContext<
	typeof ThinkificSchema,
	ThinkificPluginOptions
>;

export type ThinkificKeyBuilderContext = KeyBuilderContext<ThinkificPluginOptions>;

export type ThinkificBoundEndpoints = BindEndpoints<typeof thinkificEndpointsNested>;

type ThinkificEndpoint<
	K extends keyof ThinkificEndpointOutputs,
> = CorsairEndpoint<
	ThinkificContext,
	ThinkificEndpointInputs[K],
	ThinkificEndpointOutputs[K]
>;

export type ThinkificEndpoints = {
	exampleGet: ThinkificEndpoint<'exampleGet'>;
};

type ThinkificWebhook<
	K extends keyof ThinkificWebhookOutputs,
	TEvent,
> = CorsairWebhook<ThinkificContext, TEvent, ThinkificWebhookOutputs[K]>;

export type ThinkificWebhooks = {
	example: ThinkificWebhook<'example', ExampleEvent>;
};

export type ThinkificBoundWebhooks = BindWebhooks<ThinkificWebhooks>;

const thinkificEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const thinkificWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const thinkificEndpointSchemas = {
	'example.get': {
		input: ThinkificEndpointInputSchemas.exampleGet,
		output: ThinkificEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof thinkificEndpointsNested>;

const thinkificWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof thinkificWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const thinkificEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof thinkificEndpointsNested>;

export const thinkificAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseThinkificPlugin<T extends ThinkificPluginOptions> = CorsairPlugin<
	'thinkific',
	typeof ThinkificSchema,
	typeof thinkificEndpointsNested,
	typeof thinkificWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalThinkificPlugin = BaseThinkificPlugin<ThinkificPluginOptions>;

export type ExternalThinkificPlugin<T extends ThinkificPluginOptions> =
	BaseThinkificPlugin<T>;

export function thinkific<const T extends ThinkificPluginOptions>(
	incomingOptions: ThinkificPluginOptions & T = {} as ThinkificPluginOptions & T,
): ExternalThinkificPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'thinkific',
		authConfig: thinkificAuthConfig,
		schema: ThinkificSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: thinkificEndpointsNested,
		webhooks: thinkificWebhooksNested,
		endpointMeta: thinkificEndpointMeta,
		endpointSchemas: thinkificEndpointSchemas,
		webhookSchemas: thinkificWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-thinkific-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchThinkificTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveThinkificOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ThinkificKeyBuilderContext, source) => {
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
	} satisfies InternalThinkificPlugin;
}

export type {
	ExampleEvent,
	ThinkificWebhookOutputs,
} from './webhooks/types';

export type {
	ThinkificEndpointInputs,
	ThinkificEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
