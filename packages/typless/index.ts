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
	TyplessEndpointInputs,
	TyplessEndpointOutputs,
} from './endpoints/types';
import {
	TyplessEndpointInputSchemas,
	TyplessEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TyplessSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveTyplessOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchTyplessTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, TyplessWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type TyplessPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTyplessPlugin['hooks'];
	webhookHooks?: InternalTyplessPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof typlessEndpointsNested>;
};

export type TyplessContext = CorsairPluginContext<
	typeof TyplessSchema,
	TyplessPluginOptions
>;

export type TyplessKeyBuilderContext = KeyBuilderContext<TyplessPluginOptions>;

export type TyplessBoundEndpoints = BindEndpoints<
	typeof typlessEndpointsNested
>;

type TyplessEndpoint<K extends keyof TyplessEndpointOutputs> = CorsairEndpoint<
	TyplessContext,
	TyplessEndpointInputs[K],
	TyplessEndpointOutputs[K]
>;

export type TyplessEndpoints = {
	exampleGet: TyplessEndpoint<'exampleGet'>;
};

type TyplessWebhook<
	K extends keyof TyplessWebhookOutputs,
	TEvent,
> = CorsairWebhook<TyplessContext, TEvent, TyplessWebhookOutputs[K]>;

export type TyplessWebhooks = {
	example: TyplessWebhook<'example', ExampleEvent>;
};

export type TyplessBoundWebhooks = BindWebhooks<TyplessWebhooks>;

const typlessEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const typlessWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const typlessEndpointSchemas = {
	'example.get': {
		input: TyplessEndpointInputSchemas.exampleGet,
		output: TyplessEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof typlessEndpointsNested
>;

const typlessWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof typlessWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const typlessEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof typlessEndpointsNested>;

export const typlessAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTyplessPlugin<T extends TyplessPluginOptions> = CorsairPlugin<
	'typless',
	typeof TyplessSchema,
	typeof typlessEndpointsNested,
	typeof typlessWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTyplessPlugin = BaseTyplessPlugin<TyplessPluginOptions>;

export type ExternalTyplessPlugin<T extends TyplessPluginOptions> =
	BaseTyplessPlugin<T>;

export function typless<const T extends TyplessPluginOptions>(
	incomingOptions: TyplessPluginOptions & T = {} as TyplessPluginOptions & T,
): ExternalTyplessPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'typless',
		authConfig: typlessAuthConfig,
		schema: TyplessSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: typlessEndpointsNested,
		webhooks: typlessWebhooksNested,
		endpointMeta: typlessEndpointMeta,
		endpointSchemas: typlessEndpointSchemas,
		webhookSchemas: typlessWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-typless-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTyplessTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTyplessOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TyplessKeyBuilderContext, source) => {
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
	} satisfies InternalTyplessPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	TyplessEndpointInputs,
	TyplessEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	TyplessWebhookOutputs,
} from './webhooks/types';
