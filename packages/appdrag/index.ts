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
	AppdragEndpointInputs,
	AppdragEndpointOutputs,
} from './endpoints/types';
import {
	AppdragEndpointInputSchemas,
	AppdragEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AppdragSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAppdragOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAppdragTenantWebhook } from './webhooks/tenant-matcher';
import type { AppdragWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AppdragPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAppdragPlugin['hooks'];
	webhookHooks?: InternalAppdragPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof appdragEndpointsNested>;
};

export type AppdragContext = CorsairPluginContext<
	typeof AppdragSchema,
	AppdragPluginOptions
>;

export type AppdragKeyBuilderContext = KeyBuilderContext<AppdragPluginOptions>;

export type AppdragBoundEndpoints = BindEndpoints<
	typeof appdragEndpointsNested
>;

type AppdragEndpoint<K extends keyof AppdragEndpointOutputs> = CorsairEndpoint<
	AppdragContext,
	AppdragEndpointInputs[K],
	AppdragEndpointOutputs[K]
>;

export type AppdragEndpoints = {
	exampleGet: AppdragEndpoint<'exampleGet'>;
};

type AppdragWebhook<
	K extends keyof AppdragWebhookOutputs,
	TEvent,
> = CorsairWebhook<AppdragContext, TEvent, AppdragWebhookOutputs[K]>;

export type AppdragWebhooks = {
	example: AppdragWebhook<'example', ExampleEvent>;
};

export type AppdragBoundWebhooks = BindWebhooks<AppdragWebhooks>;

const appdragEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const appdragWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const appdragEndpointSchemas = {
	'example.get': {
		input: AppdragEndpointInputSchemas.exampleGet,
		output: AppdragEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof appdragEndpointsNested
>;

const appdragWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof appdragWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const appdragEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof appdragEndpointsNested>;

export const appdragAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAppdragPlugin<T extends AppdragPluginOptions> = CorsairPlugin<
	'appdrag',
	typeof AppdragSchema,
	typeof appdragEndpointsNested,
	typeof appdragWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAppdragPlugin = BaseAppdragPlugin<AppdragPluginOptions>;

export type ExternalAppdragPlugin<T extends AppdragPluginOptions> =
	BaseAppdragPlugin<T>;

export function appdrag<const T extends AppdragPluginOptions>(
	incomingOptions: AppdragPluginOptions & T = {} as AppdragPluginOptions & T,
): ExternalAppdragPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'appdrag',
		authConfig: appdragAuthConfig,
		schema: AppdragSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: appdragEndpointsNested,
		webhooks: appdragWebhooksNested,
		endpointMeta: appdragEndpointMeta,
		endpointSchemas: appdragEndpointSchemas,
		webhookSchemas: appdragWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-appdrag-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAppdragTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAppdragOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AppdragKeyBuilderContext, source) => {
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
	} satisfies InternalAppdragPlugin;
}

export type {
	AppdragEndpointInputs,
	AppdragEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AppdragWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
