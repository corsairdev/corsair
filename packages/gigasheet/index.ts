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
import type { GigasheetEndpointInputs, GigasheetEndpointOutputs } from './endpoints/types';
import { GigasheetEndpointInputSchemas, GigasheetEndpointOutputSchemas } from './endpoints/types';
import type {
	GigasheetWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GigasheetSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGigasheetTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGigasheetOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GigasheetPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGigasheetPlugin['hooks'];
	webhookHooks?: InternalGigasheetPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gigasheetEndpointsNested>;
};

export type GigasheetContext = CorsairPluginContext<
	typeof GigasheetSchema,
	GigasheetPluginOptions
>;

export type GigasheetKeyBuilderContext = KeyBuilderContext<GigasheetPluginOptions>;

export type GigasheetBoundEndpoints = BindEndpoints<typeof gigasheetEndpointsNested>;

type GigasheetEndpoint<
	K extends keyof GigasheetEndpointOutputs,
> = CorsairEndpoint<
	GigasheetContext,
	GigasheetEndpointInputs[K],
	GigasheetEndpointOutputs[K]
>;

export type GigasheetEndpoints = {
	exampleGet: GigasheetEndpoint<'exampleGet'>;
};

type GigasheetWebhook<
	K extends keyof GigasheetWebhookOutputs,
	TEvent,
> = CorsairWebhook<GigasheetContext, TEvent, GigasheetWebhookOutputs[K]>;

export type GigasheetWebhooks = {
	example: GigasheetWebhook<'example', ExampleEvent>;
};

export type GigasheetBoundWebhooks = BindWebhooks<GigasheetWebhooks>;

const gigasheetEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const gigasheetWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const gigasheetEndpointSchemas = {
	'example.get': {
		input: GigasheetEndpointInputSchemas.exampleGet,
		output: GigasheetEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof gigasheetEndpointsNested>;

const gigasheetWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof gigasheetWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const gigasheetEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gigasheetEndpointsNested>;

export const gigasheetAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGigasheetPlugin<T extends GigasheetPluginOptions> = CorsairPlugin<
	'gigasheet',
	typeof GigasheetSchema,
	typeof gigasheetEndpointsNested,
	typeof gigasheetWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGigasheetPlugin = BaseGigasheetPlugin<GigasheetPluginOptions>;

export type ExternalGigasheetPlugin<T extends GigasheetPluginOptions> =
	BaseGigasheetPlugin<T>;

export function gigasheet<const T extends GigasheetPluginOptions>(
	incomingOptions: GigasheetPluginOptions & T = {} as GigasheetPluginOptions & T,
): ExternalGigasheetPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gigasheet',
		authConfig: gigasheetAuthConfig,
		schema: GigasheetSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gigasheetEndpointsNested,
		webhooks: gigasheetWebhooksNested,
		endpointMeta: gigasheetEndpointMeta,
		endpointSchemas: gigasheetEndpointSchemas,
		webhookSchemas: gigasheetWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-gigasheet-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGigasheetTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGigasheetOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GigasheetKeyBuilderContext, source) => {
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
	} satisfies InternalGigasheetPlugin;
}

export type {
	ExampleEvent,
	GigasheetWebhookOutputs,
} from './webhooks/types';

export type {
	GigasheetEndpointInputs,
	GigasheetEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
