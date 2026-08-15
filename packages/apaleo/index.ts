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
import type { ApaleoEndpointInputs, ApaleoEndpointOutputs } from './endpoints/types';
import { ApaleoEndpointInputSchemas, ApaleoEndpointOutputSchemas } from './endpoints/types';
import type {
	ApaleoWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ApaleoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchApaleoTenantWebhook } from './webhooks/tenant-matcher';
import { resolveApaleoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ApaleoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalApaleoPlugin['hooks'];
	webhookHooks?: InternalApaleoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apaleoEndpointsNested>;
};

export type ApaleoContext = CorsairPluginContext<
	typeof ApaleoSchema,
	ApaleoPluginOptions
>;

export type ApaleoKeyBuilderContext = KeyBuilderContext<ApaleoPluginOptions>;

export type ApaleoBoundEndpoints = BindEndpoints<typeof apaleoEndpointsNested>;

type ApaleoEndpoint<
	K extends keyof ApaleoEndpointOutputs,
> = CorsairEndpoint<
	ApaleoContext,
	ApaleoEndpointInputs[K],
	ApaleoEndpointOutputs[K]
>;

export type ApaleoEndpoints = {
	exampleGet: ApaleoEndpoint<'exampleGet'>;
};

type ApaleoWebhook<
	K extends keyof ApaleoWebhookOutputs,
	TEvent,
> = CorsairWebhook<ApaleoContext, TEvent, ApaleoWebhookOutputs[K]>;

export type ApaleoWebhooks = {
	example: ApaleoWebhook<'example', ExampleEvent>;
};

export type ApaleoBoundWebhooks = BindWebhooks<ApaleoWebhooks>;

const apaleoEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const apaleoWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const apaleoEndpointSchemas = {
	'example.get': {
		input: ApaleoEndpointInputSchemas.exampleGet,
		output: ApaleoEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof apaleoEndpointsNested>;

const apaleoWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof apaleoWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const apaleoEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof apaleoEndpointsNested>;

export const apaleoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseApaleoPlugin<T extends ApaleoPluginOptions> = CorsairPlugin<
	'apaleo',
	typeof ApaleoSchema,
	typeof apaleoEndpointsNested,
	typeof apaleoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalApaleoPlugin = BaseApaleoPlugin<ApaleoPluginOptions>;

export type ExternalApaleoPlugin<T extends ApaleoPluginOptions> =
	BaseApaleoPlugin<T>;

export function apaleo<const T extends ApaleoPluginOptions>(
	incomingOptions: ApaleoPluginOptions & T = {} as ApaleoPluginOptions & T,
): ExternalApaleoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'apaleo',
		authConfig: apaleoAuthConfig,
		schema: ApaleoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: apaleoEndpointsNested,
		webhooks: apaleoWebhooksNested,
		endpointMeta: apaleoEndpointMeta,
		endpointSchemas: apaleoEndpointSchemas,
		webhookSchemas: apaleoWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-apaleo-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchApaleoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveApaleoOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ApaleoKeyBuilderContext, source) => {
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
	} satisfies InternalApaleoPlugin;
}

export type {
	ExampleEvent,
	ApaleoWebhookOutputs,
} from './webhooks/types';

export type {
	ApaleoEndpointInputs,
	ApaleoEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
