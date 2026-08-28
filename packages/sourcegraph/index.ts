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
	SourcegraphEndpointInputs,
	SourcegraphEndpointOutputs,
} from './endpoints/types';
import {
	SourcegraphEndpointInputSchemas,
	SourcegraphEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SourcegraphSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveSourcegraphOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchSourcegraphTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, SourcegraphWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type SourcegraphPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSourcegraphPlugin['hooks'];
	webhookHooks?: InternalSourcegraphPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sourcegraphEndpointsNested>;
};

export type SourcegraphContext = CorsairPluginContext<
	typeof SourcegraphSchema,
	SourcegraphPluginOptions
>;

export type SourcegraphKeyBuilderContext =
	KeyBuilderContext<SourcegraphPluginOptions>;

export type SourcegraphBoundEndpoints = BindEndpoints<
	typeof sourcegraphEndpointsNested
>;

type SourcegraphEndpoint<K extends keyof SourcegraphEndpointOutputs> =
	CorsairEndpoint<
		SourcegraphContext,
		SourcegraphEndpointInputs[K],
		SourcegraphEndpointOutputs[K]
	>;

export type SourcegraphEndpoints = {
	exampleGet: SourcegraphEndpoint<'exampleGet'>;
};

type SourcegraphWebhook<
	K extends keyof SourcegraphWebhookOutputs,
	TEvent,
> = CorsairWebhook<SourcegraphContext, TEvent, SourcegraphWebhookOutputs[K]>;

export type SourcegraphWebhooks = {
	example: SourcegraphWebhook<'example', ExampleEvent>;
};

export type SourcegraphBoundWebhooks = BindWebhooks<SourcegraphWebhooks>;

const sourcegraphEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const sourcegraphWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const sourcegraphEndpointSchemas = {
	'example.get': {
		input: SourcegraphEndpointInputSchemas.exampleGet,
		output: SourcegraphEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sourcegraphEndpointsNested
>;

const sourcegraphWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof sourcegraphWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const sourcegraphEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof sourcegraphEndpointsNested
>;

export const sourcegraphAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSourcegraphPlugin<T extends SourcegraphPluginOptions> =
	CorsairPlugin<
		'sourcegraph',
		typeof SourcegraphSchema,
		typeof sourcegraphEndpointsNested,
		typeof sourcegraphWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalSourcegraphPlugin =
	BaseSourcegraphPlugin<SourcegraphPluginOptions>;

export type ExternalSourcegraphPlugin<T extends SourcegraphPluginOptions> =
	BaseSourcegraphPlugin<T>;

export function sourcegraph<const T extends SourcegraphPluginOptions>(
	incomingOptions: SourcegraphPluginOptions &
		T = {} as SourcegraphPluginOptions & T,
): ExternalSourcegraphPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sourcegraph',
		authConfig: sourcegraphAuthConfig,
		schema: SourcegraphSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: sourcegraphEndpointsNested,
		webhooks: sourcegraphWebhooksNested,
		endpointMeta: sourcegraphEndpointMeta,
		endpointSchemas: sourcegraphEndpointSchemas,
		webhookSchemas: sourcegraphWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-sourcegraph-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchSourcegraphTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveSourcegraphOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SourcegraphKeyBuilderContext, source) => {
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
	} satisfies InternalSourcegraphPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	SourcegraphEndpointInputs,
	SourcegraphEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	SourcegraphWebhookOutputs,
} from './webhooks/types';
