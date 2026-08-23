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
	AivoovEndpointInputs,
	AivoovEndpointOutputs,
} from './endpoints/types';
import {
	AivoovEndpointInputSchemas,
	AivoovEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AivoovSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAivoovOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAivoovTenantWebhook } from './webhooks/tenant-matcher';
import type { AivoovWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AivoovPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAivoovPlugin['hooks'];
	webhookHooks?: InternalAivoovPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof aivoovEndpointsNested>;
};

export type AivoovContext = CorsairPluginContext<
	typeof AivoovSchema,
	AivoovPluginOptions
>;

export type AivoovKeyBuilderContext = KeyBuilderContext<AivoovPluginOptions>;

export type AivoovBoundEndpoints = BindEndpoints<typeof aivoovEndpointsNested>;

type AivoovEndpoint<K extends keyof AivoovEndpointOutputs> = CorsairEndpoint<
	AivoovContext,
	AivoovEndpointInputs[K],
	AivoovEndpointOutputs[K]
>;

export type AivoovEndpoints = {
	exampleGet: AivoovEndpoint<'exampleGet'>;
};

type AivoovWebhook<
	K extends keyof AivoovWebhookOutputs,
	TEvent,
> = CorsairWebhook<AivoovContext, TEvent, AivoovWebhookOutputs[K]>;

export type AivoovWebhooks = {
	example: AivoovWebhook<'example', ExampleEvent>;
};

export type AivoovBoundWebhooks = BindWebhooks<AivoovWebhooks>;

const aivoovEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const aivoovWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const aivoovEndpointSchemas = {
	'example.get': {
		input: AivoovEndpointInputSchemas.exampleGet,
		output: AivoovEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof aivoovEndpointsNested
>;

const aivoovWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof aivoovWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const aivoovEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof aivoovEndpointsNested>;

export const aivoovAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAivoovPlugin<T extends AivoovPluginOptions> = CorsairPlugin<
	'aivoov',
	typeof AivoovSchema,
	typeof aivoovEndpointsNested,
	typeof aivoovWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAivoovPlugin = BaseAivoovPlugin<AivoovPluginOptions>;

export type ExternalAivoovPlugin<T extends AivoovPluginOptions> =
	BaseAivoovPlugin<T>;

export function aivoov<const T extends AivoovPluginOptions>(
	incomingOptions: AivoovPluginOptions & T = {} as AivoovPluginOptions & T,
): ExternalAivoovPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'aivoov',
		authConfig: aivoovAuthConfig,
		schema: AivoovSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: aivoovEndpointsNested,
		webhooks: aivoovWebhooksNested,
		endpointMeta: aivoovEndpointMeta,
		endpointSchemas: aivoovEndpointSchemas,
		webhookSchemas: aivoovWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-aivoov-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAivoovTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAivoovOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AivoovKeyBuilderContext, source) => {
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
	} satisfies InternalAivoovPlugin;
}

export type {
	AivoovEndpointInputs,
	AivoovEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AivoovWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
