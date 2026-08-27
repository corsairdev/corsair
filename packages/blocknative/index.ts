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
	BlocknativeEndpointInputs,
	BlocknativeEndpointOutputs,
} from './endpoints/types';
import {
	BlocknativeEndpointInputSchemas,
	BlocknativeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BlocknativeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBlocknativeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBlocknativeTenantWebhook } from './webhooks/tenant-matcher';
import type { BlocknativeWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BlocknativePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBlocknativePlugin['hooks'];
	webhookHooks?: InternalBlocknativePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof blocknativeEndpointsNested>;
};

export type BlocknativeContext = CorsairPluginContext<
	typeof BlocknativeSchema,
	BlocknativePluginOptions
>;

export type BlocknativeKeyBuilderContext =
	KeyBuilderContext<BlocknativePluginOptions>;

export type BlocknativeBoundEndpoints = BindEndpoints<
	typeof blocknativeEndpointsNested
>;

type BlocknativeEndpoint<K extends keyof BlocknativeEndpointOutputs> =
	CorsairEndpoint<
		BlocknativeContext,
		BlocknativeEndpointInputs[K],
		BlocknativeEndpointOutputs[K]
	>;

export type BlocknativeEndpoints = {
	exampleGet: BlocknativeEndpoint<'exampleGet'>;
};

type BlocknativeWebhook<
	K extends keyof BlocknativeWebhookOutputs,
	TEvent,
> = CorsairWebhook<BlocknativeContext, TEvent, BlocknativeWebhookOutputs[K]>;

export type BlocknativeWebhooks = {
	example: BlocknativeWebhook<'example', ExampleEvent>;
};

export type BlocknativeBoundWebhooks = BindWebhooks<BlocknativeWebhooks>;

const blocknativeEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const blocknativeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const blocknativeEndpointSchemas = {
	'example.get': {
		input: BlocknativeEndpointInputSchemas.exampleGet,
		output: BlocknativeEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof blocknativeEndpointsNested
>;

const blocknativeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof blocknativeWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const blocknativeEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof blocknativeEndpointsNested
>;

export const blocknativeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBlocknativePlugin<T extends BlocknativePluginOptions> =
	CorsairPlugin<
		'blocknative',
		typeof BlocknativeSchema,
		typeof blocknativeEndpointsNested,
		typeof blocknativeWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBlocknativePlugin =
	BaseBlocknativePlugin<BlocknativePluginOptions>;

export type ExternalBlocknativePlugin<T extends BlocknativePluginOptions> =
	BaseBlocknativePlugin<T>;

export function blocknative<const T extends BlocknativePluginOptions>(
	incomingOptions: BlocknativePluginOptions &
		T = {} as BlocknativePluginOptions & T,
): ExternalBlocknativePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'blocknative',
		authConfig: blocknativeAuthConfig,
		schema: BlocknativeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: blocknativeEndpointsNested,
		webhooks: blocknativeWebhooksNested,
		endpointMeta: blocknativeEndpointMeta,
		endpointSchemas: blocknativeEndpointSchemas,
		webhookSchemas: blocknativeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-blocknative-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBlocknativeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBlocknativeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BlocknativeKeyBuilderContext, source) => {
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
	} satisfies InternalBlocknativePlugin;
}

export type {
	BlocknativeEndpointInputs,
	BlocknativeEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BlocknativeWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
