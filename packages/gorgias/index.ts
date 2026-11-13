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
import type { GorgiasEndpointInputs, GorgiasEndpointOutputs } from './endpoints/types';
import { GorgiasEndpointInputSchemas, GorgiasEndpointOutputSchemas } from './endpoints/types';
import type {
	GorgiasWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GorgiasSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGorgiasTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGorgiasOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GorgiasPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGorgiasPlugin['hooks'];
	webhookHooks?: InternalGorgiasPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gorgiasEndpointsNested>;
};

export type GorgiasContext = CorsairPluginContext<
	typeof GorgiasSchema,
	GorgiasPluginOptions
>;

export type GorgiasKeyBuilderContext = KeyBuilderContext<GorgiasPluginOptions>;

export type GorgiasBoundEndpoints = BindEndpoints<typeof gorgiasEndpointsNested>;

type GorgiasEndpoint<
	K extends keyof GorgiasEndpointOutputs,
> = CorsairEndpoint<
	GorgiasContext,
	GorgiasEndpointInputs[K],
	GorgiasEndpointOutputs[K]
>;

export type GorgiasEndpoints = {
	exampleGet: GorgiasEndpoint<'exampleGet'>;
};

type GorgiasWebhook<
	K extends keyof GorgiasWebhookOutputs,
	TEvent,
> = CorsairWebhook<GorgiasContext, TEvent, GorgiasWebhookOutputs[K]>;

export type GorgiasWebhooks = {
	example: GorgiasWebhook<'example', ExampleEvent>;
};

export type GorgiasBoundWebhooks = BindWebhooks<GorgiasWebhooks>;

const gorgiasEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const gorgiasWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const gorgiasEndpointSchemas = {
	'example.get': {
		input: GorgiasEndpointInputSchemas.exampleGet,
		output: GorgiasEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof gorgiasEndpointsNested>;

const gorgiasWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof gorgiasWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const gorgiasEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gorgiasEndpointsNested>;

export const gorgiasAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGorgiasPlugin<T extends GorgiasPluginOptions> = CorsairPlugin<
	'gorgias',
	typeof GorgiasSchema,
	typeof gorgiasEndpointsNested,
	typeof gorgiasWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGorgiasPlugin = BaseGorgiasPlugin<GorgiasPluginOptions>;

export type ExternalGorgiasPlugin<T extends GorgiasPluginOptions> =
	BaseGorgiasPlugin<T>;

export function gorgias<const T extends GorgiasPluginOptions>(
	incomingOptions: GorgiasPluginOptions & T = {} as GorgiasPluginOptions & T,
): ExternalGorgiasPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gorgias',
		authConfig: gorgiasAuthConfig,
		schema: GorgiasSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gorgiasEndpointsNested,
		webhooks: gorgiasWebhooksNested,
		endpointMeta: gorgiasEndpointMeta,
		endpointSchemas: gorgiasEndpointSchemas,
		webhookSchemas: gorgiasWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-gorgias-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGorgiasTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGorgiasOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GorgiasKeyBuilderContext, source) => {
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
	} satisfies InternalGorgiasPlugin;
}

export type {
	ExampleEvent,
	GorgiasWebhookOutputs,
} from './webhooks/types';

export type {
	GorgiasEndpointInputs,
	GorgiasEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
