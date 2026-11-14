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
import type { HandwryttenEndpointInputs, HandwryttenEndpointOutputs } from './endpoints/types';
import { HandwryttenEndpointInputSchemas, HandwryttenEndpointOutputSchemas } from './endpoints/types';
import type {
	HandwryttenWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { HandwryttenSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchHandwryttenTenantWebhook } from './webhooks/tenant-matcher';
import { resolveHandwryttenOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type HandwryttenPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHandwryttenPlugin['hooks'];
	webhookHooks?: InternalHandwryttenPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof handwryttenEndpointsNested>;
};

export type HandwryttenContext = CorsairPluginContext<
	typeof HandwryttenSchema,
	HandwryttenPluginOptions
>;

export type HandwryttenKeyBuilderContext = KeyBuilderContext<HandwryttenPluginOptions>;

export type HandwryttenBoundEndpoints = BindEndpoints<typeof handwryttenEndpointsNested>;

type HandwryttenEndpoint<
	K extends keyof HandwryttenEndpointOutputs,
> = CorsairEndpoint<
	HandwryttenContext,
	HandwryttenEndpointInputs[K],
	HandwryttenEndpointOutputs[K]
>;

export type HandwryttenEndpoints = {
	exampleGet: HandwryttenEndpoint<'exampleGet'>;
};

type HandwryttenWebhook<
	K extends keyof HandwryttenWebhookOutputs,
	TEvent,
> = CorsairWebhook<HandwryttenContext, TEvent, HandwryttenWebhookOutputs[K]>;

export type HandwryttenWebhooks = {
	example: HandwryttenWebhook<'example', ExampleEvent>;
};

export type HandwryttenBoundWebhooks = BindWebhooks<HandwryttenWebhooks>;

const handwryttenEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const handwryttenWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const handwryttenEndpointSchemas = {
	'example.get': {
		input: HandwryttenEndpointInputSchemas.exampleGet,
		output: HandwryttenEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof handwryttenEndpointsNested>;

const handwryttenWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof handwryttenWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const handwryttenEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof handwryttenEndpointsNested>;

export const handwryttenAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHandwryttenPlugin<T extends HandwryttenPluginOptions> = CorsairPlugin<
	'handwrytten',
	typeof HandwryttenSchema,
	typeof handwryttenEndpointsNested,
	typeof handwryttenWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHandwryttenPlugin = BaseHandwryttenPlugin<HandwryttenPluginOptions>;

export type ExternalHandwryttenPlugin<T extends HandwryttenPluginOptions> =
	BaseHandwryttenPlugin<T>;

export function handwrytten<const T extends HandwryttenPluginOptions>(
	incomingOptions: HandwryttenPluginOptions & T = {} as HandwryttenPluginOptions & T,
): ExternalHandwryttenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'handwrytten',
		authConfig: handwryttenAuthConfig,
		schema: HandwryttenSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: handwryttenEndpointsNested,
		webhooks: handwryttenWebhooksNested,
		endpointMeta: handwryttenEndpointMeta,
		endpointSchemas: handwryttenEndpointSchemas,
		webhookSchemas: handwryttenWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-handwrytten-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHandwryttenTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHandwryttenOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HandwryttenKeyBuilderContext, source) => {
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
	} satisfies InternalHandwryttenPlugin;
}

export type {
	ExampleEvent,
	HandwryttenWebhookOutputs,
} from './webhooks/types';

export type {
	HandwryttenEndpointInputs,
	HandwryttenEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
