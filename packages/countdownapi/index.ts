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
	CountdownApiEndpointInputs,
	CountdownApiEndpointOutputs,
} from './endpoints/types';
import {
	CountdownApiEndpointInputSchemas,
	CountdownApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CountdownApiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveCountdownApiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCountdownApiTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CountdownApiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type CountdownApiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCountdownApiPlugin['hooks'];
	webhookHooks?: InternalCountdownApiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof countdownApiEndpointsNested>;
};

export type CountdownApiContext = CorsairPluginContext<
	typeof CountdownApiSchema,
	CountdownApiPluginOptions
>;

export type CountdownApiKeyBuilderContext =
	KeyBuilderContext<CountdownApiPluginOptions>;

export type CountdownApiBoundEndpoints = BindEndpoints<
	typeof countdownApiEndpointsNested
>;

type CountdownApiEndpoint<K extends keyof CountdownApiEndpointOutputs> =
	CorsairEndpoint<
		CountdownApiContext,
		CountdownApiEndpointInputs[K],
		CountdownApiEndpointOutputs[K]
	>;

export type CountdownApiEndpoints = {
	exampleGet: CountdownApiEndpoint<'exampleGet'>;
};

type CountdownApiWebhook<
	K extends keyof CountdownApiWebhookOutputs,
	TEvent,
> = CorsairWebhook<CountdownApiContext, TEvent, CountdownApiWebhookOutputs[K]>;

export type CountdownApiWebhooks = {
	example: CountdownApiWebhook<'example', ExampleEvent>;
};

export type CountdownApiBoundWebhooks = BindWebhooks<CountdownApiWebhooks>;

const countdownApiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const countdownApiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const countdownApiEndpointSchemas = {
	'example.get': {
		input: CountdownApiEndpointInputSchemas.exampleGet,
		output: CountdownApiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof countdownApiEndpointsNested
>;

const countdownApiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof countdownApiWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const countdownApiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof countdownApiEndpointsNested
>;

export const countdownApiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCountdownApiPlugin<T extends CountdownApiPluginOptions> =
	CorsairPlugin<
		'countdownapi',
		typeof CountdownApiSchema,
		typeof countdownApiEndpointsNested,
		typeof countdownApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCountdownApiPlugin =
	BaseCountdownApiPlugin<CountdownApiPluginOptions>;

export type ExternalCountdownApiPlugin<T extends CountdownApiPluginOptions> =
	BaseCountdownApiPlugin<T>;

export function countdownapi<const T extends CountdownApiPluginOptions>(
	incomingOptions: CountdownApiPluginOptions &
		T = {} as CountdownApiPluginOptions & T,
): ExternalCountdownApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'countdownapi',
		authConfig: countdownApiAuthConfig,
		schema: CountdownApiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: countdownApiEndpointsNested,
		webhooks: countdownApiWebhooksNested,
		endpointMeta: countdownApiEndpointMeta,
		endpointSchemas: countdownApiEndpointSchemas,
		webhookSchemas: countdownApiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-countdownapi-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCountdownApiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCountdownApiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CountdownApiKeyBuilderContext, source) => {
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
	} satisfies InternalCountdownApiPlugin;
}

export type {
	CountdownApiEndpointInputs,
	CountdownApiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	CountdownApiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
