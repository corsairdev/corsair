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
	AllImagesAiEndpointInputs,
	AllImagesAiEndpointOutputs,
} from './endpoints/types';
import {
	AllImagesAiEndpointInputSchemas,
	AllImagesAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AllImagesAiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAllImagesAiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAllImagesAiTenantWebhook } from './webhooks/tenant-matcher';
import type { AllImagesAiWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AllImagesAiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAllImagesAiPlugin['hooks'];
	webhookHooks?: InternalAllImagesAiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof allImagesAiEndpointsNested>;
};

export type AllImagesAiContext = CorsairPluginContext<
	typeof AllImagesAiSchema,
	AllImagesAiPluginOptions
>;

export type AllImagesAiKeyBuilderContext =
	KeyBuilderContext<AllImagesAiPluginOptions>;

export type AllImagesAiBoundEndpoints = BindEndpoints<
	typeof allImagesAiEndpointsNested
>;

type AllImagesAiEndpoint<K extends keyof AllImagesAiEndpointOutputs> =
	CorsairEndpoint<
		AllImagesAiContext,
		AllImagesAiEndpointInputs[K],
		AllImagesAiEndpointOutputs[K]
	>;

export type AllImagesAiEndpoints = {
	exampleGet: AllImagesAiEndpoint<'exampleGet'>;
};

type AllImagesAiWebhook<
	K extends keyof AllImagesAiWebhookOutputs,
	TEvent,
> = CorsairWebhook<AllImagesAiContext, TEvent, AllImagesAiWebhookOutputs[K]>;

export type AllImagesAiWebhooks = {
	example: AllImagesAiWebhook<'example', ExampleEvent>;
};

export type AllImagesAiBoundWebhooks = BindWebhooks<AllImagesAiWebhooks>;

const allImagesAiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const allImagesAiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const allImagesAiEndpointSchemas = {
	'example.get': {
		input: AllImagesAiEndpointInputSchemas.exampleGet,
		output: AllImagesAiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof allImagesAiEndpointsNested
>;

const allImagesAiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof allImagesAiWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const allImagesAiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof allImagesAiEndpointsNested
>;

export const allImagesAiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAllImagesAiPlugin<T extends AllImagesAiPluginOptions> =
	CorsairPlugin<
		'allimagesai',
		typeof AllImagesAiSchema,
		typeof allImagesAiEndpointsNested,
		typeof allImagesAiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAllImagesAiPlugin =
	BaseAllImagesAiPlugin<AllImagesAiPluginOptions>;

export type ExternalAllImagesAiPlugin<T extends AllImagesAiPluginOptions> =
	BaseAllImagesAiPlugin<T>;

export function allimagesai<const T extends AllImagesAiPluginOptions>(
	incomingOptions: AllImagesAiPluginOptions &
		T = {} as AllImagesAiPluginOptions & T,
): ExternalAllImagesAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'allimagesai',
		authConfig: allImagesAiAuthConfig,
		schema: AllImagesAiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: allImagesAiEndpointsNested,
		webhooks: allImagesAiWebhooksNested,
		endpointMeta: allImagesAiEndpointMeta,
		endpointSchemas: allImagesAiEndpointSchemas,
		webhookSchemas: allImagesAiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-allimagesai-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAllImagesAiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAllImagesAiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AllImagesAiKeyBuilderContext, source) => {
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
	} satisfies InternalAllImagesAiPlugin;
}

export type {
	AllImagesAiEndpointInputs,
	AllImagesAiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AllImagesAiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
