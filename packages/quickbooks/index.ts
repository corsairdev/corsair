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
import type { QuickBooksEndpointInputs, QuickBooksEndpointOutputs } from './endpoints/types';
import { QuickBooksEndpointInputSchemas, QuickBooksEndpointOutputSchemas } from './endpoints/types';
import type {
	QuickBooksWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { QuickBooksSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchQuickBooksTenantWebhook } from './webhooks/tenant-matcher';
import { resolveQuickBooksOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type QuickBooksPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalQuickBooksPlugin['hooks'];
	webhookHooks?: InternalQuickBooksPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof quickBooksEndpointsNested>;
};

export type QuickBooksContext = CorsairPluginContext<
	typeof QuickBooksSchema,
	QuickBooksPluginOptions
>;

export type QuickBooksKeyBuilderContext = KeyBuilderContext<QuickBooksPluginOptions>;

export type QuickBooksBoundEndpoints = BindEndpoints<typeof quickBooksEndpointsNested>;

type QuickBooksEndpoint<
	K extends keyof QuickBooksEndpointOutputs,
> = CorsairEndpoint<
	QuickBooksContext,
	QuickBooksEndpointInputs[K],
	QuickBooksEndpointOutputs[K]
>;

export type QuickBooksEndpoints = {
	exampleGet: QuickBooksEndpoint<'exampleGet'>;
};

type QuickBooksWebhook<
	K extends keyof QuickBooksWebhookOutputs,
	TEvent,
> = CorsairWebhook<QuickBooksContext, TEvent, QuickBooksWebhookOutputs[K]>;

export type QuickBooksWebhooks = {
	example: QuickBooksWebhook<'example', ExampleEvent>;
};

export type QuickBooksBoundWebhooks = BindWebhooks<QuickBooksWebhooks>;

const quickBooksEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const quickBooksWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const quickBooksEndpointSchemas = {
	'example.get': {
		input: QuickBooksEndpointInputSchemas.exampleGet,
		output: QuickBooksEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof quickBooksEndpointsNested>;

const quickBooksWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof quickBooksWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const quickBooksEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof quickBooksEndpointsNested>;

export const quickBooksAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseQuickBooksPlugin<T extends QuickBooksPluginOptions> = CorsairPlugin<
	'quickbooks',
	typeof QuickBooksSchema,
	typeof quickBooksEndpointsNested,
	typeof quickBooksWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalQuickBooksPlugin = BaseQuickBooksPlugin<QuickBooksPluginOptions>;

export type ExternalQuickBooksPlugin<T extends QuickBooksPluginOptions> =
	BaseQuickBooksPlugin<T>;

export function quickbooks<const T extends QuickBooksPluginOptions>(
	incomingOptions: QuickBooksPluginOptions & T = {} as QuickBooksPluginOptions & T,
): ExternalQuickBooksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'quickbooks',
		authConfig: quickBooksAuthConfig,
		schema: QuickBooksSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: quickBooksEndpointsNested,
		webhooks: quickBooksWebhooksNested,
		endpointMeta: quickBooksEndpointMeta,
		endpointSchemas: quickBooksEndpointSchemas,
		webhookSchemas: quickBooksWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-quickbooks-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchQuickBooksTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveQuickBooksOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: QuickBooksKeyBuilderContext, source) => {
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
	} satisfies InternalQuickBooksPlugin;
}

export type {
	ExampleEvent,
	QuickBooksWebhookOutputs,
} from './webhooks/types';

export type {
	QuickBooksEndpointInputs,
	QuickBooksEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
