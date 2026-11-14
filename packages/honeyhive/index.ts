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
import type { HoneyHiveEndpointInputs, HoneyHiveEndpointOutputs } from './endpoints/types';
import { HoneyHiveEndpointInputSchemas, HoneyHiveEndpointOutputSchemas } from './endpoints/types';
import type {
	HoneyHiveWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { HoneyHiveSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchHoneyHiveTenantWebhook } from './webhooks/tenant-matcher';
import { resolveHoneyHiveOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type HoneyHivePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHoneyHivePlugin['hooks'];
	webhookHooks?: InternalHoneyHivePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof honeyHiveEndpointsNested>;
};

export type HoneyHiveContext = CorsairPluginContext<
	typeof HoneyHiveSchema,
	HoneyHivePluginOptions
>;

export type HoneyHiveKeyBuilderContext = KeyBuilderContext<HoneyHivePluginOptions>;

export type HoneyHiveBoundEndpoints = BindEndpoints<typeof honeyHiveEndpointsNested>;

type HoneyHiveEndpoint<
	K extends keyof HoneyHiveEndpointOutputs,
> = CorsairEndpoint<
	HoneyHiveContext,
	HoneyHiveEndpointInputs[K],
	HoneyHiveEndpointOutputs[K]
>;

export type HoneyHiveEndpoints = {
	exampleGet: HoneyHiveEndpoint<'exampleGet'>;
};

type HoneyHiveWebhook<
	K extends keyof HoneyHiveWebhookOutputs,
	TEvent,
> = CorsairWebhook<HoneyHiveContext, TEvent, HoneyHiveWebhookOutputs[K]>;

export type HoneyHiveWebhooks = {
	example: HoneyHiveWebhook<'example', ExampleEvent>;
};

export type HoneyHiveBoundWebhooks = BindWebhooks<HoneyHiveWebhooks>;

const honeyHiveEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const honeyHiveWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const honeyHiveEndpointSchemas = {
	'example.get': {
		input: HoneyHiveEndpointInputSchemas.exampleGet,
		output: HoneyHiveEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof honeyHiveEndpointsNested>;

const honeyHiveWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof honeyHiveWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const honeyHiveEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof honeyHiveEndpointsNested>;

export const honeyHiveAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHoneyHivePlugin<T extends HoneyHivePluginOptions> = CorsairPlugin<
	'honeyhive',
	typeof HoneyHiveSchema,
	typeof honeyHiveEndpointsNested,
	typeof honeyHiveWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHoneyHivePlugin = BaseHoneyHivePlugin<HoneyHivePluginOptions>;

export type ExternalHoneyHivePlugin<T extends HoneyHivePluginOptions> =
	BaseHoneyHivePlugin<T>;

export function honeyhive<const T extends HoneyHivePluginOptions>(
	incomingOptions: HoneyHivePluginOptions & T = {} as HoneyHivePluginOptions & T,
): ExternalHoneyHivePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'honeyhive',
		authConfig: honeyHiveAuthConfig,
		schema: HoneyHiveSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: honeyHiveEndpointsNested,
		webhooks: honeyHiveWebhooksNested,
		endpointMeta: honeyHiveEndpointMeta,
		endpointSchemas: honeyHiveEndpointSchemas,
		webhookSchemas: honeyHiveWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-honeyhive-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHoneyHiveTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHoneyHiveOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HoneyHiveKeyBuilderContext, source) => {
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
	} satisfies InternalHoneyHivePlugin;
}

export type {
	ExampleEvent,
	HoneyHiveWebhookOutputs,
} from './webhooks/types';

export type {
	HoneyHiveEndpointInputs,
	HoneyHiveEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
