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
import type { ProductboardEndpointInputs, ProductboardEndpointOutputs } from './endpoints/types';
import { ProductboardEndpointInputSchemas, ProductboardEndpointOutputSchemas } from './endpoints/types';
import type {
	ProductboardWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ProductboardSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchProductboardTenantWebhook } from './webhooks/tenant-matcher';
import { resolveProductboardOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ProductboardPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalProductboardPlugin['hooks'];
	webhookHooks?: InternalProductboardPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof productboardEndpointsNested>;
};

export type ProductboardContext = CorsairPluginContext<
	typeof ProductboardSchema,
	ProductboardPluginOptions
>;

export type ProductboardKeyBuilderContext = KeyBuilderContext<ProductboardPluginOptions>;

export type ProductboardBoundEndpoints = BindEndpoints<typeof productboardEndpointsNested>;

type ProductboardEndpoint<
	K extends keyof ProductboardEndpointOutputs,
> = CorsairEndpoint<
	ProductboardContext,
	ProductboardEndpointInputs[K],
	ProductboardEndpointOutputs[K]
>;

export type ProductboardEndpoints = {
	exampleGet: ProductboardEndpoint<'exampleGet'>;
};

type ProductboardWebhook<
	K extends keyof ProductboardWebhookOutputs,
	TEvent,
> = CorsairWebhook<ProductboardContext, TEvent, ProductboardWebhookOutputs[K]>;

export type ProductboardWebhooks = {
	example: ProductboardWebhook<'example', ExampleEvent>;
};

export type ProductboardBoundWebhooks = BindWebhooks<ProductboardWebhooks>;

const productboardEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const productboardWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const productboardEndpointSchemas = {
	'example.get': {
		input: ProductboardEndpointInputSchemas.exampleGet,
		output: ProductboardEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof productboardEndpointsNested>;

const productboardWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof productboardWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const productboardEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof productboardEndpointsNested>;

export const productboardAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseProductboardPlugin<T extends ProductboardPluginOptions> = CorsairPlugin<
	'productboard',
	typeof ProductboardSchema,
	typeof productboardEndpointsNested,
	typeof productboardWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalProductboardPlugin = BaseProductboardPlugin<ProductboardPluginOptions>;

export type ExternalProductboardPlugin<T extends ProductboardPluginOptions> =
	BaseProductboardPlugin<T>;

export function productboard<const T extends ProductboardPluginOptions>(
	incomingOptions: ProductboardPluginOptions & T = {} as ProductboardPluginOptions & T,
): ExternalProductboardPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'productboard',
		authConfig: productboardAuthConfig,
		schema: ProductboardSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: productboardEndpointsNested,
		webhooks: productboardWebhooksNested,
		endpointMeta: productboardEndpointMeta,
		endpointSchemas: productboardEndpointSchemas,
		webhookSchemas: productboardWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-productboard-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchProductboardTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveProductboardOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ProductboardKeyBuilderContext, source) => {
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
	} satisfies InternalProductboardPlugin;
}

export type {
	ExampleEvent,
	ProductboardWebhookOutputs,
} from './webhooks/types';

export type {
	ProductboardEndpointInputs,
	ProductboardEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
