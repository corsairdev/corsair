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
import type { AmaraEndpointInputs, AmaraEndpointOutputs } from './endpoints/types';
import { AmaraEndpointInputSchemas, AmaraEndpointOutputSchemas } from './endpoints/types';
import type {
	AmaraWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { AmaraSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchAmaraTenantWebhook } from './webhooks/tenant-matcher';
import { resolveAmaraOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type AmaraPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAmaraPlugin['hooks'];
	webhookHooks?: InternalAmaraPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof amaraEndpointsNested>;
};

export type AmaraContext = CorsairPluginContext<
	typeof AmaraSchema,
	AmaraPluginOptions
>;

export type AmaraKeyBuilderContext = KeyBuilderContext<AmaraPluginOptions>;

export type AmaraBoundEndpoints = BindEndpoints<typeof amaraEndpointsNested>;

type AmaraEndpoint<
	K extends keyof AmaraEndpointOutputs,
> = CorsairEndpoint<
	AmaraContext,
	AmaraEndpointInputs[K],
	AmaraEndpointOutputs[K]
>;

export type AmaraEndpoints = {
	exampleGet: AmaraEndpoint<'exampleGet'>;
};

type AmaraWebhook<
	K extends keyof AmaraWebhookOutputs,
	TEvent,
> = CorsairWebhook<AmaraContext, TEvent, AmaraWebhookOutputs[K]>;

export type AmaraWebhooks = {
	example: AmaraWebhook<'example', ExampleEvent>;
};

export type AmaraBoundWebhooks = BindWebhooks<AmaraWebhooks>;

const amaraEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const amaraWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const amaraEndpointSchemas = {
	'example.get': {
		input: AmaraEndpointInputSchemas.exampleGet,
		output: AmaraEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof amaraEndpointsNested>;

const amaraWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof amaraWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const amaraEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof amaraEndpointsNested>;

export const amaraAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAmaraPlugin<T extends AmaraPluginOptions> = CorsairPlugin<
	'amara',
	typeof AmaraSchema,
	typeof amaraEndpointsNested,
	typeof amaraWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAmaraPlugin = BaseAmaraPlugin<AmaraPluginOptions>;

export type ExternalAmaraPlugin<T extends AmaraPluginOptions> =
	BaseAmaraPlugin<T>;

export function amara<const T extends AmaraPluginOptions>(
	incomingOptions: AmaraPluginOptions & T = {} as AmaraPluginOptions & T,
): ExternalAmaraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'amara',
		authConfig: amaraAuthConfig,
		schema: AmaraSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: amaraEndpointsNested,
		webhooks: amaraWebhooksNested,
		endpointMeta: amaraEndpointMeta,
		endpointSchemas: amaraEndpointSchemas,
		webhookSchemas: amaraWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-amara-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAmaraTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAmaraOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AmaraKeyBuilderContext, source) => {
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
	} satisfies InternalAmaraPlugin;
}

export type {
	ExampleEvent,
	AmaraWebhookOutputs,
} from './webhooks/types';

export type {
	AmaraEndpointInputs,
	AmaraEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
