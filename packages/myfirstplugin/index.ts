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
	MyFirstPluginEndpointInputs,
	MyFirstPluginEndpointOutputs,
} from './endpoints/types';
import {
	MyFirstPluginEndpointInputSchemas,
	MyFirstPluginEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MyFirstPluginSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveMyFirstPluginOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchMyFirstPluginTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ExampleEvent,
	MyFirstPluginWebhookOutputs,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type MyFirstPluginPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMyFirstPluginPlugin['hooks'];
	webhookHooks?: InternalMyFirstPluginPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof myFirstPluginEndpointsNested>;
};

export type MyFirstPluginContext = CorsairPluginContext<
	typeof MyFirstPluginSchema,
	MyFirstPluginPluginOptions
>;

export type MyFirstPluginKeyBuilderContext =
	KeyBuilderContext<MyFirstPluginPluginOptions>;

export type MyFirstPluginBoundEndpoints = BindEndpoints<
	typeof myFirstPluginEndpointsNested
>;

type MyFirstPluginEndpoint<K extends keyof MyFirstPluginEndpointOutputs> =
	CorsairEndpoint<
		MyFirstPluginContext,
		MyFirstPluginEndpointInputs[K],
		MyFirstPluginEndpointOutputs[K]
	>;

export type MyFirstPluginEndpoints = {
	exampleGet: MyFirstPluginEndpoint<'exampleGet'>;
};

type MyFirstPluginWebhook<
	K extends keyof MyFirstPluginWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	MyFirstPluginContext,
	TEvent,
	MyFirstPluginWebhookOutputs[K]
>;

export type MyFirstPluginWebhooks = {
	example: MyFirstPluginWebhook<'example', ExampleEvent>;
};

export type MyFirstPluginBoundWebhooks = BindWebhooks<MyFirstPluginWebhooks>;

const myFirstPluginEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const myFirstPluginWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const myFirstPluginEndpointSchemas = {
	'example.get': {
		input: MyFirstPluginEndpointInputSchemas.exampleGet,
		output: MyFirstPluginEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof myFirstPluginEndpointsNested
>;

const myFirstPluginWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof myFirstPluginWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const myFirstPluginEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof myFirstPluginEndpointsNested
>;

export const myFirstPluginAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMyFirstPluginPlugin<T extends MyFirstPluginPluginOptions> =
	CorsairPlugin<
		'myfirstplugin',
		typeof MyFirstPluginSchema,
		typeof myFirstPluginEndpointsNested,
		typeof myFirstPluginWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalMyFirstPluginPlugin =
	BaseMyFirstPluginPlugin<MyFirstPluginPluginOptions>;

export type ExternalMyFirstPluginPlugin<T extends MyFirstPluginPluginOptions> =
	BaseMyFirstPluginPlugin<T>;

export function myfirstplugin<const T extends MyFirstPluginPluginOptions>(
	incomingOptions: MyFirstPluginPluginOptions &
		T = {} as MyFirstPluginPluginOptions & T,
): ExternalMyFirstPluginPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'myfirstplugin',
		authConfig: myFirstPluginAuthConfig,
		schema: MyFirstPluginSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: myFirstPluginEndpointsNested,
		webhooks: myFirstPluginWebhooksNested,
		endpointMeta: myFirstPluginEndpointMeta,
		endpointSchemas: myFirstPluginEndpointSchemas,
		webhookSchemas: myFirstPluginWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-myfirstplugin-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchMyFirstPluginTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMyFirstPluginOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MyFirstPluginKeyBuilderContext, source) => {
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
	} satisfies InternalMyFirstPluginPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	MyFirstPluginEndpointInputs,
	MyFirstPluginEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	MyFirstPluginWebhookOutputs,
} from './webhooks/types';
