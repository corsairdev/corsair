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
	SerpapiEndpointInputs,
	SerpapiEndpointOutputs,
} from './endpoints/types';
import {
	SerpapiEndpointInputSchemas,
	SerpapiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SerpapiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveSerpapiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchSerpapiTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, SerpapiWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type SerpapiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSerpapiPlugin['hooks'];
	webhookHooks?: InternalSerpapiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof serpapiEndpointsNested>;
};

export type SerpapiContext = CorsairPluginContext<
	typeof SerpapiSchema,
	SerpapiPluginOptions
>;

export type SerpapiKeyBuilderContext = KeyBuilderContext<SerpapiPluginOptions>;

export type SerpapiBoundEndpoints = BindEndpoints<
	typeof serpapiEndpointsNested
>;

type SerpapiEndpoint<K extends keyof SerpapiEndpointOutputs> = CorsairEndpoint<
	SerpapiContext,
	SerpapiEndpointInputs[K],
	SerpapiEndpointOutputs[K]
>;

export type SerpapiEndpoints = {
	exampleGet: SerpapiEndpoint<'exampleGet'>;
};

type SerpapiWebhook<
	K extends keyof SerpapiWebhookOutputs,
	TEvent,
> = CorsairWebhook<SerpapiContext, TEvent, SerpapiWebhookOutputs[K]>;

export type SerpapiWebhooks = {
	example: SerpapiWebhook<'example', ExampleEvent>;
};

export type SerpapiBoundWebhooks = BindWebhooks<SerpapiWebhooks>;

const serpapiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const serpapiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const serpapiEndpointSchemas = {
	'example.get': {
		input: SerpapiEndpointInputSchemas.exampleGet,
		output: SerpapiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof serpapiEndpointsNested
>;

const serpapiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof serpapiWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const serpapiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof serpapiEndpointsNested>;

export const serpapiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSerpapiPlugin<T extends SerpapiPluginOptions> = CorsairPlugin<
	'serpapi',
	typeof SerpapiSchema,
	typeof serpapiEndpointsNested,
	typeof serpapiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSerpapiPlugin = BaseSerpapiPlugin<SerpapiPluginOptions>;

export type ExternalSerpapiPlugin<T extends SerpapiPluginOptions> =
	BaseSerpapiPlugin<T>;

export function serpapi<const T extends SerpapiPluginOptions>(
	incomingOptions: SerpapiPluginOptions & T = {} as SerpapiPluginOptions & T,
): ExternalSerpapiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'serpapi',
		authConfig: serpapiAuthConfig,
		schema: SerpapiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: serpapiEndpointsNested,
		webhooks: serpapiWebhooksNested,
		endpointMeta: serpapiEndpointMeta,
		endpointSchemas: serpapiEndpointSchemas,
		webhookSchemas: serpapiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-serpapi-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchSerpapiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveSerpapiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SerpapiKeyBuilderContext, source) => {
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
	} satisfies InternalSerpapiPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	SerpapiEndpointInputs,
	SerpapiEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	SerpapiWebhookOutputs,
} from './webhooks/types';
