import type {
	AuthTypes,
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
import { Example } from './endpoints';
import type {
	BlackbaudEndpointInputs,
	BlackbaudEndpointOutputs,
} from './endpoints/types';
import {
	BlackbaudEndpointInputSchemas,
	BlackbaudEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BlackbaudSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBlackbaudOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBlackbaudTenantWebhook } from './webhooks/tenant-matcher';
import type { BlackbaudWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BlackbaudPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBlackbaudPlugin['hooks'];
	webhookHooks?: InternalBlackbaudPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof blackbaudEndpointsNested>;
};

export type BlackbaudContext = CorsairPluginContext<
	typeof BlackbaudSchema,
	BlackbaudPluginOptions
>;

export type BlackbaudKeyBuilderContext =
	KeyBuilderContext<BlackbaudPluginOptions>;

export type BlackbaudBoundEndpoints = BindEndpoints<
	typeof blackbaudEndpointsNested
>;

type BlackbaudEndpoint<K extends keyof BlackbaudEndpointOutputs> =
	CorsairEndpoint<
		BlackbaudContext,
		BlackbaudEndpointInputs[K],
		BlackbaudEndpointOutputs[K]
	>;

export type BlackbaudEndpoints = {
	exampleGet: BlackbaudEndpoint<'exampleGet'>;
};

type BlackbaudWebhook<
	K extends keyof BlackbaudWebhookOutputs,
	TEvent,
> = CorsairWebhook<BlackbaudContext, TEvent, BlackbaudWebhookOutputs[K]>;

export type BlackbaudWebhooks = {
	example: BlackbaudWebhook<'example', ExampleEvent>;
};

export type BlackbaudBoundWebhooks = BindWebhooks<BlackbaudWebhooks>;

const blackbaudEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const blackbaudWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const blackbaudEndpointSchemas = {
	'example.get': {
		input: BlackbaudEndpointInputSchemas.exampleGet,
		output: BlackbaudEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof blackbaudEndpointsNested
>;

const blackbaudWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof blackbaudWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const blackbaudEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof blackbaudEndpointsNested
>;

export const blackbaudAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBlackbaudPlugin<T extends BlackbaudPluginOptions> =
	CorsairPlugin<
		'blackbaud',
		typeof BlackbaudSchema,
		typeof blackbaudEndpointsNested,
		typeof blackbaudWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBlackbaudPlugin =
	BaseBlackbaudPlugin<BlackbaudPluginOptions>;

export type ExternalBlackbaudPlugin<T extends BlackbaudPluginOptions> =
	BaseBlackbaudPlugin<T>;

export function blackbaud<const T extends BlackbaudPluginOptions>(
	incomingOptions: BlackbaudPluginOptions & T = {} as BlackbaudPluginOptions &
		T,
): ExternalBlackbaudPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'blackbaud',
		authConfig: blackbaudAuthConfig,
		schema: BlackbaudSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: blackbaudEndpointsNested,
		webhooks: blackbaudWebhooksNested,
		endpointMeta: blackbaudEndpointMeta,
		endpointSchemas: blackbaudEndpointSchemas,
		webhookSchemas: blackbaudWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-blackbaud-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBlackbaudTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBlackbaudOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BlackbaudKeyBuilderContext, source) => {
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
	} satisfies InternalBlackbaudPlugin;
}

export type {
	BlackbaudEndpointInputs,
	BlackbaudEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BlackbaudWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
