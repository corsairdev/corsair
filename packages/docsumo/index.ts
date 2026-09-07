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
	DocsumoEndpointInputs,
	DocsumoEndpointOutputs,
} from './endpoints/types';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DocsumoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDocsumoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDocsumoTenantWebhook } from './webhooks/tenant-matcher';
import type { DocsumoWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DocsumoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDocsumoPlugin['hooks'];
	webhookHooks?: InternalDocsumoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docsumoEndpointsNested>;
};

export type DocsumoContext = CorsairPluginContext<
	typeof DocsumoSchema,
	DocsumoPluginOptions
>;

export type DocsumoKeyBuilderContext = KeyBuilderContext<DocsumoPluginOptions>;

export type DocsumoBoundEndpoints = BindEndpoints<
	typeof docsumoEndpointsNested
>;

type DocsumoEndpoint<K extends keyof DocsumoEndpointOutputs> = CorsairEndpoint<
	DocsumoContext,
	DocsumoEndpointInputs[K],
	DocsumoEndpointOutputs[K]
>;

export type DocsumoEndpoints = {
	exampleGet: DocsumoEndpoint<'exampleGet'>;
};

type DocsumoWebhook<
	K extends keyof DocsumoWebhookOutputs,
	TEvent,
> = CorsairWebhook<DocsumoContext, TEvent, DocsumoWebhookOutputs[K]>;

export type DocsumoWebhooks = {
	example: DocsumoWebhook<'example', ExampleEvent>;
};

export type DocsumoBoundWebhooks = BindWebhooks<DocsumoWebhooks>;

const docsumoEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const docsumoWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const docsumoEndpointSchemas = {
	'example.get': {
		input: DocsumoEndpointInputSchemas.exampleGet,
		output: DocsumoEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docsumoEndpointsNested
>;

const docsumoWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof docsumoWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const docsumoEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof docsumoEndpointsNested>;

export const docsumoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDocsumoPlugin<T extends DocsumoPluginOptions> = CorsairPlugin<
	'docsumo',
	typeof DocsumoSchema,
	typeof docsumoEndpointsNested,
	typeof docsumoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDocsumoPlugin = BaseDocsumoPlugin<DocsumoPluginOptions>;

export type ExternalDocsumoPlugin<T extends DocsumoPluginOptions> =
	BaseDocsumoPlugin<T>;

export function docsumo<const T extends DocsumoPluginOptions>(
	incomingOptions: DocsumoPluginOptions & T = {} as DocsumoPluginOptions & T,
): ExternalDocsumoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'docsumo',
		authConfig: docsumoAuthConfig,
		schema: DocsumoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: docsumoEndpointsNested,
		webhooks: docsumoWebhooksNested,
		endpointMeta: docsumoEndpointMeta,
		endpointSchemas: docsumoEndpointSchemas,
		webhookSchemas: docsumoWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-docsumo-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDocsumoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDocsumoOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DocsumoKeyBuilderContext, source) => {
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
	} satisfies InternalDocsumoPlugin;
}

export type {
	DocsumoEndpointInputs,
	DocsumoEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	DocsumoWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
