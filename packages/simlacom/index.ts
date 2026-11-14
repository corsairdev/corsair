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
import type { SimlaComEndpointInputs, SimlaComEndpointOutputs } from './endpoints/types';
import { SimlaComEndpointInputSchemas, SimlaComEndpointOutputSchemas } from './endpoints/types';
import type {
	SimlaComWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { SimlaComSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchSimlaComTenantWebhook } from './webhooks/tenant-matcher';
import { resolveSimlaComOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type SimlaComPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSimlaComPlugin['hooks'];
	webhookHooks?: InternalSimlaComPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof simlaComEndpointsNested>;
};

export type SimlaComContext = CorsairPluginContext<
	typeof SimlaComSchema,
	SimlaComPluginOptions
>;

export type SimlaComKeyBuilderContext = KeyBuilderContext<SimlaComPluginOptions>;

export type SimlaComBoundEndpoints = BindEndpoints<typeof simlaComEndpointsNested>;

type SimlaComEndpoint<
	K extends keyof SimlaComEndpointOutputs,
> = CorsairEndpoint<
	SimlaComContext,
	SimlaComEndpointInputs[K],
	SimlaComEndpointOutputs[K]
>;

export type SimlaComEndpoints = {
	exampleGet: SimlaComEndpoint<'exampleGet'>;
};

type SimlaComWebhook<
	K extends keyof SimlaComWebhookOutputs,
	TEvent,
> = CorsairWebhook<SimlaComContext, TEvent, SimlaComWebhookOutputs[K]>;

export type SimlaComWebhooks = {
	example: SimlaComWebhook<'example', ExampleEvent>;
};

export type SimlaComBoundWebhooks = BindWebhooks<SimlaComWebhooks>;

const simlaComEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const simlaComWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const simlaComEndpointSchemas = {
	'example.get': {
		input: SimlaComEndpointInputSchemas.exampleGet,
		output: SimlaComEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof simlaComEndpointsNested>;

const simlaComWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof simlaComWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const simlaComEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof simlaComEndpointsNested>;

export const simlaComAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSimlaComPlugin<T extends SimlaComPluginOptions> = CorsairPlugin<
	'simlacom',
	typeof SimlaComSchema,
	typeof simlaComEndpointsNested,
	typeof simlaComWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSimlaComPlugin = BaseSimlaComPlugin<SimlaComPluginOptions>;

export type ExternalSimlaComPlugin<T extends SimlaComPluginOptions> =
	BaseSimlaComPlugin<T>;

export function simlacom<const T extends SimlaComPluginOptions>(
	incomingOptions: SimlaComPluginOptions & T = {} as SimlaComPluginOptions & T,
): ExternalSimlaComPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'simlacom',
		authConfig: simlaComAuthConfig,
		schema: SimlaComSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: simlaComEndpointsNested,
		webhooks: simlaComWebhooksNested,
		endpointMeta: simlaComEndpointMeta,
		endpointSchemas: simlaComEndpointSchemas,
		webhookSchemas: simlaComWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-simlacom-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchSimlaComTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveSimlaComOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SimlaComKeyBuilderContext, source) => {
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
	} satisfies InternalSimlaComPlugin;
}

export type {
	ExampleEvent,
	SimlaComWebhookOutputs,
} from './webhooks/types';

export type {
	SimlaComEndpointInputs,
	SimlaComEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
