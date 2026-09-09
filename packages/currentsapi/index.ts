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
	CurrentsApiEndpointInputs,
	CurrentsApiEndpointOutputs,
} from './endpoints/types';
import {
	CurrentsApiEndpointInputSchemas,
	CurrentsApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CurrentsApiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveCurrentsApiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCurrentsApiTenantWebhook } from './webhooks/tenant-matcher';
import type { CurrentsApiWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type CurrentsApiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCurrentsApiPlugin['hooks'];
	webhookHooks?: InternalCurrentsApiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof currentsApiEndpointsNested>;
};

export type CurrentsApiContext = CorsairPluginContext<
	typeof CurrentsApiSchema,
	CurrentsApiPluginOptions
>;

export type CurrentsApiKeyBuilderContext =
	KeyBuilderContext<CurrentsApiPluginOptions>;

export type CurrentsApiBoundEndpoints = BindEndpoints<
	typeof currentsApiEndpointsNested
>;

type CurrentsApiEndpoint<K extends keyof CurrentsApiEndpointOutputs> =
	CorsairEndpoint<
		CurrentsApiContext,
		CurrentsApiEndpointInputs[K],
		CurrentsApiEndpointOutputs[K]
	>;

export type CurrentsApiEndpoints = {
	exampleGet: CurrentsApiEndpoint<'exampleGet'>;
};

type CurrentsApiWebhook<
	K extends keyof CurrentsApiWebhookOutputs,
	TEvent,
> = CorsairWebhook<CurrentsApiContext, TEvent, CurrentsApiWebhookOutputs[K]>;

export type CurrentsApiWebhooks = {
	example: CurrentsApiWebhook<'example', ExampleEvent>;
};

export type CurrentsApiBoundWebhooks = BindWebhooks<CurrentsApiWebhooks>;

const currentsApiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const currentsApiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const currentsApiEndpointSchemas = {
	'example.get': {
		input: CurrentsApiEndpointInputSchemas.exampleGet,
		output: CurrentsApiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof currentsApiEndpointsNested
>;

const currentsApiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof currentsApiWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const currentsApiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof currentsApiEndpointsNested
>;

export const currentsApiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCurrentsApiPlugin<T extends CurrentsApiPluginOptions> =
	CorsairPlugin<
		'currentsapi',
		typeof CurrentsApiSchema,
		typeof currentsApiEndpointsNested,
		typeof currentsApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCurrentsApiPlugin =
	BaseCurrentsApiPlugin<CurrentsApiPluginOptions>;

export type ExternalCurrentsApiPlugin<T extends CurrentsApiPluginOptions> =
	BaseCurrentsApiPlugin<T>;

export function currentsapi<const T extends CurrentsApiPluginOptions>(
	incomingOptions: CurrentsApiPluginOptions &
		T = {} as CurrentsApiPluginOptions & T,
): ExternalCurrentsApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'currentsapi',
		authConfig: currentsApiAuthConfig,
		schema: CurrentsApiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: currentsApiEndpointsNested,
		webhooks: currentsApiWebhooksNested,
		endpointMeta: currentsApiEndpointMeta,
		endpointSchemas: currentsApiEndpointSchemas,
		webhookSchemas: currentsApiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-currentsapi-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCurrentsApiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCurrentsApiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CurrentsApiKeyBuilderContext, source) => {
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
	} satisfies InternalCurrentsApiPlugin;
}

export type {
	CurrentsApiEndpointInputs,
	CurrentsApiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	CurrentsApiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
