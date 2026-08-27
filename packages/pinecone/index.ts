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
	PineconeEndpointInputs,
	PineconeEndpointOutputs,
} from './endpoints/types';
import {
	PineconeEndpointInputSchemas,
	PineconeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PineconeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolvePineconeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchPineconeTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, PineconeWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type PineconePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPineconePlugin['hooks'];
	webhookHooks?: InternalPineconePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pineconeEndpointsNested>;
};

export type PineconeContext = CorsairPluginContext<
	typeof PineconeSchema,
	PineconePluginOptions
>;

export type PineconeKeyBuilderContext =
	KeyBuilderContext<PineconePluginOptions>;

export type PineconeBoundEndpoints = BindEndpoints<
	typeof pineconeEndpointsNested
>;

type PineconeEndpoint<K extends keyof PineconeEndpointOutputs> =
	CorsairEndpoint<
		PineconeContext,
		PineconeEndpointInputs[K],
		PineconeEndpointOutputs[K]
	>;

export type PineconeEndpoints = {
	exampleGet: PineconeEndpoint<'exampleGet'>;
};

type PineconeWebhook<
	K extends keyof PineconeWebhookOutputs,
	TEvent,
> = CorsairWebhook<PineconeContext, TEvent, PineconeWebhookOutputs[K]>;

export type PineconeWebhooks = {
	example: PineconeWebhook<'example', ExampleEvent>;
};

export type PineconeBoundWebhooks = BindWebhooks<PineconeWebhooks>;

const pineconeEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const pineconeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const pineconeEndpointSchemas = {
	'example.get': {
		input: PineconeEndpointInputSchemas.exampleGet,
		output: PineconeEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pineconeEndpointsNested
>;

const pineconeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof pineconeWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const pineconeEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pineconeEndpointsNested>;

export const pineconeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePineconePlugin<T extends PineconePluginOptions> = CorsairPlugin<
	'pinecone',
	typeof PineconeSchema,
	typeof pineconeEndpointsNested,
	typeof pineconeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalPineconePlugin = BasePineconePlugin<PineconePluginOptions>;

export type ExternalPineconePlugin<T extends PineconePluginOptions> =
	BasePineconePlugin<T>;

export function pinecone<const T extends PineconePluginOptions>(
	incomingOptions: PineconePluginOptions & T = {} as PineconePluginOptions & T,
): ExternalPineconePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pinecone',
		authConfig: pineconeAuthConfig,
		schema: PineconeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: pineconeEndpointsNested,
		webhooks: pineconeWebhooksNested,
		endpointMeta: pineconeEndpointMeta,
		endpointSchemas: pineconeEndpointSchemas,
		webhookSchemas: pineconeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-pinecone-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchPineconeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolvePineconeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PineconeKeyBuilderContext, source) => {
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
	} satisfies InternalPineconePlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	PineconeEndpointInputs,
	PineconeEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	PineconeWebhookOutputs,
} from './webhooks/types';
