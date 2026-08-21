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
import type { AnonyflowEndpointInputs, AnonyflowEndpointOutputs } from './endpoints/types';
import { AnonyflowEndpointInputSchemas, AnonyflowEndpointOutputSchemas } from './endpoints/types';
import type {
	AnonyflowWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { AnonyflowSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchAnonyflowTenantWebhook } from './webhooks/tenant-matcher';
import { resolveAnonyflowOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type AnonyflowPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAnonyflowPlugin['hooks'];
	webhookHooks?: InternalAnonyflowPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof anonyflowEndpointsNested>;
};

export type AnonyflowContext = CorsairPluginContext<
	typeof AnonyflowSchema,
	AnonyflowPluginOptions
>;

export type AnonyflowKeyBuilderContext = KeyBuilderContext<AnonyflowPluginOptions>;

export type AnonyflowBoundEndpoints = BindEndpoints<typeof anonyflowEndpointsNested>;

type AnonyflowEndpoint<
	K extends keyof AnonyflowEndpointOutputs,
> = CorsairEndpoint<
	AnonyflowContext,
	AnonyflowEndpointInputs[K],
	AnonyflowEndpointOutputs[K]
>;

export type AnonyflowEndpoints = {
	exampleGet: AnonyflowEndpoint<'exampleGet'>;
};

type AnonyflowWebhook<
	K extends keyof AnonyflowWebhookOutputs,
	TEvent,
> = CorsairWebhook<AnonyflowContext, TEvent, AnonyflowWebhookOutputs[K]>;

export type AnonyflowWebhooks = {
	example: AnonyflowWebhook<'example', ExampleEvent>;
};

export type AnonyflowBoundWebhooks = BindWebhooks<AnonyflowWebhooks>;

const anonyflowEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const anonyflowWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const anonyflowEndpointSchemas = {
	'example.get': {
		input: AnonyflowEndpointInputSchemas.exampleGet,
		output: AnonyflowEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof anonyflowEndpointsNested>;

const anonyflowWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof anonyflowWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const anonyflowEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof anonyflowEndpointsNested>;

export const anonyflowAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAnonyflowPlugin<T extends AnonyflowPluginOptions> = CorsairPlugin<
	'anonyflow',
	typeof AnonyflowSchema,
	typeof anonyflowEndpointsNested,
	typeof anonyflowWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAnonyflowPlugin = BaseAnonyflowPlugin<AnonyflowPluginOptions>;

export type ExternalAnonyflowPlugin<T extends AnonyflowPluginOptions> =
	BaseAnonyflowPlugin<T>;

export function anonyflow<const T extends AnonyflowPluginOptions>(
	incomingOptions: AnonyflowPluginOptions & T = {} as AnonyflowPluginOptions & T,
): ExternalAnonyflowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'anonyflow',
		authConfig: anonyflowAuthConfig,
		schema: AnonyflowSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: anonyflowEndpointsNested,
		webhooks: anonyflowWebhooksNested,
		endpointMeta: anonyflowEndpointMeta,
		endpointSchemas: anonyflowEndpointSchemas,
		webhookSchemas: anonyflowWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-anonyflow-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAnonyflowTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAnonyflowOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AnonyflowKeyBuilderContext, source) => {
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
	} satisfies InternalAnonyflowPlugin;
}

export type {
	ExampleEvent,
	AnonyflowWebhookOutputs,
} from './webhooks/types';

export type {
	AnonyflowEndpointInputs,
	AnonyflowEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
