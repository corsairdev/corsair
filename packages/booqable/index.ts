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
	BooqableEndpointInputs,
	BooqableEndpointOutputs,
} from './endpoints/types';
import {
	BooqableEndpointInputSchemas,
	BooqableEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BooqableSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBooqableOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBooqableTenantWebhook } from './webhooks/tenant-matcher';
import type { BooqableWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BooqablePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBooqablePlugin['hooks'];
	webhookHooks?: InternalBooqablePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof booqableEndpointsNested>;
};

export type BooqableContext = CorsairPluginContext<
	typeof BooqableSchema,
	BooqablePluginOptions
>;

export type BooqableKeyBuilderContext =
	KeyBuilderContext<BooqablePluginOptions>;

export type BooqableBoundEndpoints = BindEndpoints<
	typeof booqableEndpointsNested
>;

type BooqableEndpoint<K extends keyof BooqableEndpointOutputs> =
	CorsairEndpoint<
		BooqableContext,
		BooqableEndpointInputs[K],
		BooqableEndpointOutputs[K]
	>;

export type BooqableEndpoints = {
	exampleGet: BooqableEndpoint<'exampleGet'>;
};

type BooqableWebhook<
	K extends keyof BooqableWebhookOutputs,
	TEvent,
> = CorsairWebhook<BooqableContext, TEvent, BooqableWebhookOutputs[K]>;

export type BooqableWebhooks = {
	example: BooqableWebhook<'example', ExampleEvent>;
};

export type BooqableBoundWebhooks = BindWebhooks<BooqableWebhooks>;

const booqableEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const booqableWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const booqableEndpointSchemas = {
	'example.get': {
		input: BooqableEndpointInputSchemas.exampleGet,
		output: BooqableEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof booqableEndpointsNested
>;

const booqableWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof booqableWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const booqableEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof booqableEndpointsNested>;

export const booqableAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBooqablePlugin<T extends BooqablePluginOptions> = CorsairPlugin<
	'booqable',
	typeof BooqableSchema,
	typeof booqableEndpointsNested,
	typeof booqableWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBooqablePlugin = BaseBooqablePlugin<BooqablePluginOptions>;

export type ExternalBooqablePlugin<T extends BooqablePluginOptions> =
	BaseBooqablePlugin<T>;

export function booqable<const T extends BooqablePluginOptions>(
	incomingOptions: BooqablePluginOptions & T = {} as BooqablePluginOptions & T,
): ExternalBooqablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'booqable',
		authConfig: booqableAuthConfig,
		schema: BooqableSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: booqableEndpointsNested,
		webhooks: booqableWebhooksNested,
		endpointMeta: booqableEndpointMeta,
		endpointSchemas: booqableEndpointSchemas,
		webhookSchemas: booqableWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-booqable-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBooqableTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBooqableOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BooqableKeyBuilderContext, source) => {
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
	} satisfies InternalBooqablePlugin;
}

export type {
	BooqableEndpointInputs,
	BooqableEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BooqableWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
