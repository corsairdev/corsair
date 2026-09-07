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
	ExtractaaiEndpointInputs,
	ExtractaaiEndpointOutputs,
} from './endpoints/types';
import {
	ExtractaaiEndpointInputSchemas,
	ExtractaaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ExtractaaiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveExtractaaiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchExtractaaiTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, ExtractaaiWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ExtractaaiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalExtractaaiPlugin['hooks'];
	webhookHooks?: InternalExtractaaiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof extractaaiEndpointsNested>;
};

export type ExtractaaiContext = CorsairPluginContext<
	typeof ExtractaaiSchema,
	ExtractaaiPluginOptions
>;

export type ExtractaaiKeyBuilderContext =
	KeyBuilderContext<ExtractaaiPluginOptions>;

export type ExtractaaiBoundEndpoints = BindEndpoints<
	typeof extractaaiEndpointsNested
>;

type ExtractaaiEndpoint<K extends keyof ExtractaaiEndpointOutputs> =
	CorsairEndpoint<
		ExtractaaiContext,
		ExtractaaiEndpointInputs[K],
		ExtractaaiEndpointOutputs[K]
	>;

export type ExtractaaiEndpoints = {
	exampleGet: ExtractaaiEndpoint<'exampleGet'>;
};

type ExtractaaiWebhook<
	K extends keyof ExtractaaiWebhookOutputs,
	TEvent,
> = CorsairWebhook<ExtractaaiContext, TEvent, ExtractaaiWebhookOutputs[K]>;

export type ExtractaaiWebhooks = {
	example: ExtractaaiWebhook<'example', ExampleEvent>;
};

export type ExtractaaiBoundWebhooks = BindWebhooks<ExtractaaiWebhooks>;

const extractaaiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const extractaaiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const extractaaiEndpointSchemas = {
	'example.get': {
		input: ExtractaaiEndpointInputSchemas.exampleGet,
		output: ExtractaaiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof extractaaiEndpointsNested
>;

const extractaaiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof extractaaiWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const extractaaiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof extractaaiEndpointsNested
>;

export const extractaaiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseExtractaaiPlugin<T extends ExtractaaiPluginOptions> =
	CorsairPlugin<
		'extractaai',
		typeof ExtractaaiSchema,
		typeof extractaaiEndpointsNested,
		typeof extractaaiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalExtractaaiPlugin =
	BaseExtractaaiPlugin<ExtractaaiPluginOptions>;

export type ExternalExtractaaiPlugin<T extends ExtractaaiPluginOptions> =
	BaseExtractaaiPlugin<T>;

export function extractaai<const T extends ExtractaaiPluginOptions>(
	incomingOptions: ExtractaaiPluginOptions & T = {} as ExtractaaiPluginOptions &
		T,
): ExternalExtractaaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'extractaai',
		authConfig: extractaaiAuthConfig,
		schema: ExtractaaiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: extractaaiEndpointsNested,
		webhooks: extractaaiWebhooksNested,
		endpointMeta: extractaaiEndpointMeta,
		endpointSchemas: extractaaiEndpointSchemas,
		webhookSchemas: extractaaiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-extractaai-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchExtractaaiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveExtractaaiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ExtractaaiKeyBuilderContext, source) => {
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
	} satisfies InternalExtractaaiPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	ExtractaaiEndpointInputs,
	ExtractaaiEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	ExtractaaiWebhookOutputs,
} from './webhooks/types';
