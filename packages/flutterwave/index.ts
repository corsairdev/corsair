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
	FlutterwaveEndpointInputs,
	FlutterwaveEndpointOutputs,
} from './endpoints/types';
import {
	FlutterwaveEndpointInputSchemas,
	FlutterwaveEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FlutterwaveSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveFlutterwaveOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchFlutterwaveTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, FlutterwaveWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type FlutterwavePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFlutterwavePlugin['hooks'];
	webhookHooks?: InternalFlutterwavePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof flutterwaveEndpointsNested>;
};

export type FlutterwaveContext = CorsairPluginContext<
	typeof FlutterwaveSchema,
	FlutterwavePluginOptions
>;

export type FlutterwaveKeyBuilderContext =
	KeyBuilderContext<FlutterwavePluginOptions>;

export type FlutterwaveBoundEndpoints = BindEndpoints<
	typeof flutterwaveEndpointsNested
>;

type FlutterwaveEndpoint<K extends keyof FlutterwaveEndpointOutputs> =
	CorsairEndpoint<
		FlutterwaveContext,
		FlutterwaveEndpointInputs[K],
		FlutterwaveEndpointOutputs[K]
	>;

export type FlutterwaveEndpoints = {
	initializePayment: FlutterwaveEndpoint<'initializePayment'>;
};

type FlutterwaveWebhook<
	K extends keyof FlutterwaveWebhookOutputs,
	TEvent,
> = CorsairWebhook<FlutterwaveContext, TEvent, FlutterwaveWebhookOutputs[K]>;

export type FlutterwaveWebhooks = {
	example: FlutterwaveWebhook<'example', ExampleEvent>;
};

export type FlutterwaveBoundWebhooks = BindWebhooks<FlutterwaveWebhooks>;

const flutterwaveEndpointsNested = {
	payments: {
		initialize: Example.initializePayment,
	},
} as const;

const flutterwaveWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const flutterwaveEndpointSchemas = {
	'payments.initialize': {
		input: FlutterwaveEndpointInputSchemas.initializePayment,
		output: FlutterwaveEndpointOutputSchemas.initializePayment,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof flutterwaveEndpointsNested
>;

const flutterwaveWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof flutterwaveWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const flutterwaveEndpointMeta = {
	'payments.initialize': {
		riskLevel: 'write',
		description: 'Initialize a Flutterwave payment',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof flutterwaveEndpointsNested
>;

export const flutterwaveAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFlutterwavePlugin<T extends FlutterwavePluginOptions> =
	CorsairPlugin<
		'flutterwave',
		typeof FlutterwaveSchema,
		typeof flutterwaveEndpointsNested,
		typeof flutterwaveWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalFlutterwavePlugin =
	BaseFlutterwavePlugin<FlutterwavePluginOptions>;

export type ExternalFlutterwavePlugin<T extends FlutterwavePluginOptions> =
	BaseFlutterwavePlugin<T>;

export function flutterwave<const T extends FlutterwavePluginOptions>(
	incomingOptions: FlutterwavePluginOptions &
		T = {} as FlutterwavePluginOptions & T,
): ExternalFlutterwavePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'flutterwave',
		authConfig: flutterwaveAuthConfig,
		schema: FlutterwaveSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: flutterwaveEndpointsNested,
		webhooks: flutterwaveWebhooksNested,
		endpointMeta: flutterwaveEndpointMeta,
		endpointSchemas: flutterwaveEndpointSchemas,
		webhookSchemas: flutterwaveWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			return 'verif-hash' in headers;
		},

		pluginTenantWebhookMatcher: matchFlutterwaveTenantWebhook,

		oauthWebhookTenantLinkResolver: resolveFlutterwaveOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: FlutterwaveKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const result = await ctx.keys.get_webhook_signature();
				return result ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const result = await ctx.keys.get_api_key();
				return result ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const result = await ctx.keys.get_access_token();
				return result ?? '';
			}

			return '';
		},
	} satisfies InternalFlutterwavePlugin;
}

export type {
	FlutterwaveEndpointInputs,
	FlutterwaveEndpointOutputs,
	InitializePaymentInput,
	InitializePaymentResponse,
} from './endpoints/types';
export type {
	ExampleEvent,
	FlutterwaveWebhookOutputs,
} from './webhooks/types';
