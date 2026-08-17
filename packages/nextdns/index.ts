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
	NextDNSEndpointInputs,
	NextDNSEndpointOutputs,
} from './endpoints/types';
import {
	NextDNSEndpointInputSchemas,
	NextDNSEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NextDNSSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveNextDNSOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchNextDNSTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, NextDNSWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type NextDNSPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalNextDNSPlugin['hooks'];
	webhookHooks?: InternalNextDNSPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof nextDNSEndpointsNested>;
};

export type NextDNSContext = CorsairPluginContext<
	typeof NextDNSSchema,
	NextDNSPluginOptions
>;

export type NextDNSKeyBuilderContext = KeyBuilderContext<NextDNSPluginOptions>;

export type NextDNSBoundEndpoints = BindEndpoints<
	typeof nextDNSEndpointsNested
>;

type NextDNSEndpoint<K extends keyof NextDNSEndpointOutputs> = CorsairEndpoint<
	NextDNSContext,
	NextDNSEndpointInputs[K],
	NextDNSEndpointOutputs[K]
>;

export type NextDNSEndpoints = {
	exampleGet: NextDNSEndpoint<'exampleGet'>;
};

type NextDNSWebhook<
	K extends keyof NextDNSWebhookOutputs,
	TEvent,
> = CorsairWebhook<NextDNSContext, TEvent, NextDNSWebhookOutputs[K]>;

export type NextDNSWebhooks = {
	example: NextDNSWebhook<'example', ExampleEvent>;
};

export type NextDNSBoundWebhooks = BindWebhooks<NextDNSWebhooks>;

const nextDNSEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const nextDNSWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const nextDNSEndpointSchemas = {
	'example.get': {
		input: NextDNSEndpointInputSchemas.exampleGet,
		output: NextDNSEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof nextDNSEndpointsNested
>;

const nextDNSWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof nextDNSWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const nextDNSEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof nextDNSEndpointsNested>;

export const nextDNSAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseNextDNSPlugin<T extends NextDNSPluginOptions> = CorsairPlugin<
	'nextdns',
	typeof NextDNSSchema,
	typeof nextDNSEndpointsNested,
	typeof nextDNSWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalNextDNSPlugin = BaseNextDNSPlugin<NextDNSPluginOptions>;

export type ExternalNextDNSPlugin<T extends NextDNSPluginOptions> =
	BaseNextDNSPlugin<T>;

export function nextdns<const T extends NextDNSPluginOptions>(
	incomingOptions: NextDNSPluginOptions & T = {} as NextDNSPluginOptions & T,
): ExternalNextDNSPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'nextdns',
		authConfig: nextDNSAuthConfig,
		schema: NextDNSSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: nextDNSEndpointsNested,
		webhooks: nextDNSWebhooksNested,
		endpointMeta: nextDNSEndpointMeta,
		endpointSchemas: nextDNSEndpointSchemas,
		webhookSchemas: nextDNSWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-nextdns-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchNextDNSTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveNextDNSOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NextDNSKeyBuilderContext, source) => {
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
	} satisfies InternalNextDNSPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	NextDNSEndpointInputs,
	NextDNSEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	NextDNSWebhookOutputs,
} from './webhooks/types';
