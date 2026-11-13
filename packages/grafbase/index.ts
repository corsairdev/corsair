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
import type { GrafbaseEndpointInputs, GrafbaseEndpointOutputs } from './endpoints/types';
import { GrafbaseEndpointInputSchemas, GrafbaseEndpointOutputSchemas } from './endpoints/types';
import type {
	GrafbaseWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GrafbaseSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGrafbaseTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGrafbaseOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GrafbasePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGrafbasePlugin['hooks'];
	webhookHooks?: InternalGrafbasePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof grafbaseEndpointsNested>;
};

export type GrafbaseContext = CorsairPluginContext<
	typeof GrafbaseSchema,
	GrafbasePluginOptions
>;

export type GrafbaseKeyBuilderContext = KeyBuilderContext<GrafbasePluginOptions>;

export type GrafbaseBoundEndpoints = BindEndpoints<typeof grafbaseEndpointsNested>;

type GrafbaseEndpoint<
	K extends keyof GrafbaseEndpointOutputs,
> = CorsairEndpoint<
	GrafbaseContext,
	GrafbaseEndpointInputs[K],
	GrafbaseEndpointOutputs[K]
>;

export type GrafbaseEndpoints = {
	exampleGet: GrafbaseEndpoint<'exampleGet'>;
};

type GrafbaseWebhook<
	K extends keyof GrafbaseWebhookOutputs,
	TEvent,
> = CorsairWebhook<GrafbaseContext, TEvent, GrafbaseWebhookOutputs[K]>;

export type GrafbaseWebhooks = {
	example: GrafbaseWebhook<'example', ExampleEvent>;
};

export type GrafbaseBoundWebhooks = BindWebhooks<GrafbaseWebhooks>;

const grafbaseEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const grafbaseWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const grafbaseEndpointSchemas = {
	'example.get': {
		input: GrafbaseEndpointInputSchemas.exampleGet,
		output: GrafbaseEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof grafbaseEndpointsNested>;

const grafbaseWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof grafbaseWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const grafbaseEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof grafbaseEndpointsNested>;

export const grafbaseAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGrafbasePlugin<T extends GrafbasePluginOptions> = CorsairPlugin<
	'grafbase',
	typeof GrafbaseSchema,
	typeof grafbaseEndpointsNested,
	typeof grafbaseWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGrafbasePlugin = BaseGrafbasePlugin<GrafbasePluginOptions>;

export type ExternalGrafbasePlugin<T extends GrafbasePluginOptions> =
	BaseGrafbasePlugin<T>;

export function grafbase<const T extends GrafbasePluginOptions>(
	incomingOptions: GrafbasePluginOptions & T = {} as GrafbasePluginOptions & T,
): ExternalGrafbasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'grafbase',
		authConfig: grafbaseAuthConfig,
		schema: GrafbaseSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: grafbaseEndpointsNested,
		webhooks: grafbaseWebhooksNested,
		endpointMeta: grafbaseEndpointMeta,
		endpointSchemas: grafbaseEndpointSchemas,
		webhookSchemas: grafbaseWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-grafbase-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGrafbaseTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGrafbaseOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GrafbaseKeyBuilderContext, source) => {
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
	} satisfies InternalGrafbasePlugin;
}

export type {
	ExampleEvent,
	GrafbaseWebhookOutputs,
} from './webhooks/types';

export type {
	GrafbaseEndpointInputs,
	GrafbaseEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
