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
import type { AsinDataApiEndpointInputs, AsinDataApiEndpointOutputs } from './endpoints/types';
import { AsinDataApiEndpointInputSchemas, AsinDataApiEndpointOutputSchemas } from './endpoints/types';
import type {
	AsinDataApiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { AsinDataApiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchAsinDataApiTenantWebhook } from './webhooks/tenant-matcher';
import { resolveAsinDataApiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type AsinDataApiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAsinDataApiPlugin['hooks'];
	webhookHooks?: InternalAsinDataApiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof asinDataApiEndpointsNested>;
};

export type AsinDataApiContext = CorsairPluginContext<
	typeof AsinDataApiSchema,
	AsinDataApiPluginOptions
>;

export type AsinDataApiKeyBuilderContext = KeyBuilderContext<AsinDataApiPluginOptions>;

export type AsinDataApiBoundEndpoints = BindEndpoints<typeof asinDataApiEndpointsNested>;

type AsinDataApiEndpoint<
	K extends keyof AsinDataApiEndpointOutputs,
> = CorsairEndpoint<
	AsinDataApiContext,
	AsinDataApiEndpointInputs[K],
	AsinDataApiEndpointOutputs[K]
>;

export type AsinDataApiEndpoints = {
	exampleGet: AsinDataApiEndpoint<'exampleGet'>;
};

type AsinDataApiWebhook<
	K extends keyof AsinDataApiWebhookOutputs,
	TEvent,
> = CorsairWebhook<AsinDataApiContext, TEvent, AsinDataApiWebhookOutputs[K]>;

export type AsinDataApiWebhooks = {
	example: AsinDataApiWebhook<'example', ExampleEvent>;
};

export type AsinDataApiBoundWebhooks = BindWebhooks<AsinDataApiWebhooks>;

const asinDataApiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const asinDataApiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const asinDataApiEndpointSchemas = {
	'example.get': {
		input: AsinDataApiEndpointInputSchemas.exampleGet,
		output: AsinDataApiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof asinDataApiEndpointsNested>;

const asinDataApiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof asinDataApiWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const asinDataApiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof asinDataApiEndpointsNested>;

export const asinDataApiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAsinDataApiPlugin<T extends AsinDataApiPluginOptions> = CorsairPlugin<
	'asindataapi',
	typeof AsinDataApiSchema,
	typeof asinDataApiEndpointsNested,
	typeof asinDataApiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAsinDataApiPlugin = BaseAsinDataApiPlugin<AsinDataApiPluginOptions>;

export type ExternalAsinDataApiPlugin<T extends AsinDataApiPluginOptions> =
	BaseAsinDataApiPlugin<T>;

export function asindataapi<const T extends AsinDataApiPluginOptions>(
	incomingOptions: AsinDataApiPluginOptions & T = {} as AsinDataApiPluginOptions & T,
): ExternalAsinDataApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'asindataapi',
		authConfig: asinDataApiAuthConfig,
		schema: AsinDataApiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: asinDataApiEndpointsNested,
		webhooks: asinDataApiWebhooksNested,
		endpointMeta: asinDataApiEndpointMeta,
		endpointSchemas: asinDataApiEndpointSchemas,
		webhookSchemas: asinDataApiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-asindataapi-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAsinDataApiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAsinDataApiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AsinDataApiKeyBuilderContext, source) => {
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
	} satisfies InternalAsinDataApiPlugin;
}

export type {
	ExampleEvent,
	AsinDataApiWebhookOutputs,
} from './webhooks/types';

export type {
	AsinDataApiEndpointInputs,
	AsinDataApiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
