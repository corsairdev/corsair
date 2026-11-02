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
	WoodpeckerCoEndpointInputs,
	WoodpeckerCoEndpointOutputs,
} from './endpoints/types';
import {
	WoodpeckerCoEndpointInputSchemas,
	WoodpeckerCoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WoodpeckerCoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveWoodpeckerCoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchWoodpeckerCoTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ExampleEvent,
	WoodpeckerCoWebhookOutputs,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type WoodpeckerCoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWoodpeckerCoPlugin['hooks'];
	webhookHooks?: InternalWoodpeckerCoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof woodpeckerCoEndpointsNested>;
};

export type WoodpeckerCoContext = CorsairPluginContext<
	typeof WoodpeckerCoSchema,
	WoodpeckerCoPluginOptions
>;

export type WoodpeckerCoKeyBuilderContext =
	KeyBuilderContext<WoodpeckerCoPluginOptions>;

export type WoodpeckerCoBoundEndpoints = BindEndpoints<
	typeof woodpeckerCoEndpointsNested
>;

type WoodpeckerCoEndpoint<K extends keyof WoodpeckerCoEndpointOutputs> =
	CorsairEndpoint<
		WoodpeckerCoContext,
		WoodpeckerCoEndpointInputs[K],
		WoodpeckerCoEndpointOutputs[K]
	>;

export type WoodpeckerCoEndpoints = {
	exampleGet: WoodpeckerCoEndpoint<'exampleGet'>;
};

type WoodpeckerCoWebhook<
	K extends keyof WoodpeckerCoWebhookOutputs,
	TEvent,
> = CorsairWebhook<WoodpeckerCoContext, TEvent, WoodpeckerCoWebhookOutputs[K]>;

export type WoodpeckerCoWebhooks = {
	example: WoodpeckerCoWebhook<'example', ExampleEvent>;
};

export type WoodpeckerCoBoundWebhooks = BindWebhooks<WoodpeckerCoWebhooks>;

const woodpeckerCoEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const woodpeckerCoWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const woodpeckerCoEndpointSchemas = {
	'example.get': {
		input: WoodpeckerCoEndpointInputSchemas.exampleGet,
		output: WoodpeckerCoEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof woodpeckerCoEndpointsNested
>;

const woodpeckerCoWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof woodpeckerCoWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const woodpeckerCoEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof woodpeckerCoEndpointsNested
>;

export const woodpeckerCoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWoodpeckerCoPlugin<T extends WoodpeckerCoPluginOptions> =
	CorsairPlugin<
		'woodpeckerco',
		typeof WoodpeckerCoSchema,
		typeof woodpeckerCoEndpointsNested,
		typeof woodpeckerCoWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalWoodpeckerCoPlugin =
	BaseWoodpeckerCoPlugin<WoodpeckerCoPluginOptions>;

export type ExternalWoodpeckerCoPlugin<T extends WoodpeckerCoPluginOptions> =
	BaseWoodpeckerCoPlugin<T>;

export function woodpeckerco<const T extends WoodpeckerCoPluginOptions>(
	incomingOptions: WoodpeckerCoPluginOptions &
		T = {} as WoodpeckerCoPluginOptions & T,
): ExternalWoodpeckerCoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'woodpeckerco',
		authConfig: woodpeckerCoAuthConfig,
		schema: WoodpeckerCoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: woodpeckerCoEndpointsNested,
		webhooks: woodpeckerCoWebhooksNested,
		endpointMeta: woodpeckerCoEndpointMeta,
		endpointSchemas: woodpeckerCoEndpointSchemas,
		webhookSchemas: woodpeckerCoWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-woodpeckerco-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchWoodpeckerCoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveWoodpeckerCoOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WoodpeckerCoKeyBuilderContext, source) => {
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
	} satisfies InternalWoodpeckerCoPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	WoodpeckerCoEndpointInputs,
	WoodpeckerCoEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	WoodpeckerCoWebhookOutputs,
} from './webhooks/types';
