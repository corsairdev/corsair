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
	DripcelEndpointInputs,
	DripcelEndpointOutputs,
} from './endpoints/types';
import {
	DripcelEndpointInputSchemas,
	DripcelEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DripcelSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDripcelOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDripcelTenantWebhook } from './webhooks/tenant-matcher';
import type { DripcelWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DripcelPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDripcelPlugin['hooks'];
	webhookHooks?: InternalDripcelPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dripcelEndpointsNested>;
};

export type DripcelContext = CorsairPluginContext<
	typeof DripcelSchema,
	DripcelPluginOptions
>;

export type DripcelKeyBuilderContext = KeyBuilderContext<DripcelPluginOptions>;

export type DripcelBoundEndpoints = BindEndpoints<
	typeof dripcelEndpointsNested
>;

type DripcelEndpoint<K extends keyof DripcelEndpointOutputs> = CorsairEndpoint<
	DripcelContext,
	DripcelEndpointInputs[K],
	DripcelEndpointOutputs[K]
>;

export type DripcelEndpoints = {
	exampleGet: DripcelEndpoint<'exampleGet'>;
};

type DripcelWebhook<
	K extends keyof DripcelWebhookOutputs,
	TEvent,
> = CorsairWebhook<DripcelContext, TEvent, DripcelWebhookOutputs[K]>;

export type DripcelWebhooks = {
	example: DripcelWebhook<'example', ExampleEvent>;
};

export type DripcelBoundWebhooks = BindWebhooks<DripcelWebhooks>;

const dripcelEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const dripcelWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const dripcelEndpointSchemas = {
	'example.get': {
		input: DripcelEndpointInputSchemas.exampleGet,
		output: DripcelEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dripcelEndpointsNested
>;

const dripcelWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof dripcelWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dripcelEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof dripcelEndpointsNested>;

export const dripcelAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDripcelPlugin<T extends DripcelPluginOptions> = CorsairPlugin<
	'dripcel',
	typeof DripcelSchema,
	typeof dripcelEndpointsNested,
	typeof dripcelWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDripcelPlugin = BaseDripcelPlugin<DripcelPluginOptions>;

export type ExternalDripcelPlugin<T extends DripcelPluginOptions> =
	BaseDripcelPlugin<T>;

export function dripcel<const T extends DripcelPluginOptions>(
	incomingOptions: DripcelPluginOptions & T = {} as DripcelPluginOptions & T,
): ExternalDripcelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dripcel',
		authConfig: dripcelAuthConfig,
		schema: DripcelSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dripcelEndpointsNested,
		webhooks: dripcelWebhooksNested,
		endpointMeta: dripcelEndpointMeta,
		endpointSchemas: dripcelEndpointSchemas,
		webhookSchemas: dripcelWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-dripcel-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDripcelTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDripcelOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DripcelKeyBuilderContext, source) => {
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
	} satisfies InternalDripcelPlugin;
}

export type {
	DripcelEndpointInputs,
	DripcelEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	DripcelWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
