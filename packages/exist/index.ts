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
	ExistEndpointInputs,
	ExistEndpointOutputs,
} from './endpoints/types';
import {
	ExistEndpointInputSchemas,
	ExistEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ExistSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveExistOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchExistTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, ExistWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ExistPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalExistPlugin['hooks'];
	webhookHooks?: InternalExistPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof existEndpointsNested>;
};

export type ExistContext = CorsairPluginContext<
	typeof ExistSchema,
	ExistPluginOptions
>;

export type ExistKeyBuilderContext = KeyBuilderContext<ExistPluginOptions>;

export type ExistBoundEndpoints = BindEndpoints<typeof existEndpointsNested>;

type ExistEndpoint<K extends keyof ExistEndpointOutputs> = CorsairEndpoint<
	ExistContext,
	ExistEndpointInputs[K],
	ExistEndpointOutputs[K]
>;

export type ExistEndpoints = {
	exampleGet: ExistEndpoint<'exampleGet'>;
};

type ExistWebhook<K extends keyof ExistWebhookOutputs, TEvent> = CorsairWebhook<
	ExistContext,
	TEvent,
	ExistWebhookOutputs[K]
>;

export type ExistWebhooks = {
	example: ExistWebhook<'example', ExampleEvent>;
};

export type ExistBoundWebhooks = BindWebhooks<ExistWebhooks>;

const existEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const existWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const existEndpointSchemas = {
	'example.get': {
		input: ExistEndpointInputSchemas.exampleGet,
		output: ExistEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof existEndpointsNested>;

const existWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof existWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const existEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof existEndpointsNested>;

export const existAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseExistPlugin<T extends ExistPluginOptions> = CorsairPlugin<
	'exist',
	typeof ExistSchema,
	typeof existEndpointsNested,
	typeof existWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalExistPlugin = BaseExistPlugin<ExistPluginOptions>;

export type ExternalExistPlugin<T extends ExistPluginOptions> =
	BaseExistPlugin<T>;

export function exist<const T extends ExistPluginOptions>(
	incomingOptions: ExistPluginOptions & T = {} as ExistPluginOptions & T,
): ExternalExistPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'exist',
		authConfig: existAuthConfig,
		schema: ExistSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: existEndpointsNested,
		webhooks: existWebhooksNested,
		endpointMeta: existEndpointMeta,
		endpointSchemas: existEndpointSchemas,
		webhookSchemas: existWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-exist-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchExistTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveExistOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ExistKeyBuilderContext, source) => {
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
	} satisfies InternalExistPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	ExistEndpointInputs,
	ExistEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	ExistWebhookOutputs,
} from './webhooks/types';
