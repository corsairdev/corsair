import type {
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
import type { AuthTypes } from 'corsair/core';
import type { BrexEndpointInputs, BrexEndpointOutputs } from './endpoints/types';
import { BrexEndpointInputSchemas, BrexEndpointOutputSchemas } from './endpoints/types';
import type {
	BrexWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { BrexSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchBrexTenantWebhook } from './webhooks/tenant-matcher';
import { resolveBrexOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type BrexPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBrexPlugin['hooks'];
	webhookHooks?: InternalBrexPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof brexEndpointsNested>;
};

export type BrexContext = CorsairPluginContext<
	typeof BrexSchema,
	BrexPluginOptions
>;

export type BrexKeyBuilderContext = KeyBuilderContext<BrexPluginOptions>;

export type BrexBoundEndpoints = BindEndpoints<typeof brexEndpointsNested>;

type BrexEndpoint<
	K extends keyof BrexEndpointOutputs,
> = CorsairEndpoint<
	BrexContext,
	BrexEndpointInputs[K],
	BrexEndpointOutputs[K]
>;

export type BrexEndpoints = {
	exampleGet: BrexEndpoint<'exampleGet'>;
};

type BrexWebhook<
	K extends keyof BrexWebhookOutputs,
	TEvent,
> = CorsairWebhook<BrexContext, TEvent, BrexWebhookOutputs[K]>;

export type BrexWebhooks = {
	example: BrexWebhook<'example', ExampleEvent>;
};

export type BrexBoundWebhooks = BindWebhooks<BrexWebhooks>;

const brexEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const brexWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const brexEndpointSchemas = {
	'example.get': {
		input: BrexEndpointInputSchemas.exampleGet,
		output: BrexEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof brexEndpointsNested>;

const brexWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof brexWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const brexEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof brexEndpointsNested>;

export const brexAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBrexPlugin<T extends BrexPluginOptions> = CorsairPlugin<
	'brex',
	typeof BrexSchema,
	typeof brexEndpointsNested,
	typeof brexWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBrexPlugin = BaseBrexPlugin<BrexPluginOptions>;

export type ExternalBrexPlugin<T extends BrexPluginOptions> =
	BaseBrexPlugin<T>;

export function brex<const T extends BrexPluginOptions>(
	incomingOptions: BrexPluginOptions & T = {} as BrexPluginOptions & T,
): ExternalBrexPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'brex',
		authConfig: brexAuthConfig,
		schema: BrexSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: brexEndpointsNested,
		webhooks: brexWebhooksNested,
		endpointMeta: brexEndpointMeta,
		endpointSchemas: brexEndpointSchemas,
		webhookSchemas: brexWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-brex-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBrexTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBrexOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BrexKeyBuilderContext, source) => {
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
	} satisfies InternalBrexPlugin;
}

export type {
	ExampleEvent,
	BrexWebhookOutputs,
} from './webhooks/types';

export type {
	BrexEndpointInputs,
	BrexEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
