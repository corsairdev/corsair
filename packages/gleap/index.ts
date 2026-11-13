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
import type { GleapEndpointInputs, GleapEndpointOutputs } from './endpoints/types';
import { GleapEndpointInputSchemas, GleapEndpointOutputSchemas } from './endpoints/types';
import type {
	GleapWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GleapSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGleapTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGleapOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GleapPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGleapPlugin['hooks'];
	webhookHooks?: InternalGleapPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gleapEndpointsNested>;
};

export type GleapContext = CorsairPluginContext<
	typeof GleapSchema,
	GleapPluginOptions
>;

export type GleapKeyBuilderContext = KeyBuilderContext<GleapPluginOptions>;

export type GleapBoundEndpoints = BindEndpoints<typeof gleapEndpointsNested>;

type GleapEndpoint<
	K extends keyof GleapEndpointOutputs,
> = CorsairEndpoint<
	GleapContext,
	GleapEndpointInputs[K],
	GleapEndpointOutputs[K]
>;

export type GleapEndpoints = {
	exampleGet: GleapEndpoint<'exampleGet'>;
};

type GleapWebhook<
	K extends keyof GleapWebhookOutputs,
	TEvent,
> = CorsairWebhook<GleapContext, TEvent, GleapWebhookOutputs[K]>;

export type GleapWebhooks = {
	example: GleapWebhook<'example', ExampleEvent>;
};

export type GleapBoundWebhooks = BindWebhooks<GleapWebhooks>;

const gleapEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const gleapWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const gleapEndpointSchemas = {
	'example.get': {
		input: GleapEndpointInputSchemas.exampleGet,
		output: GleapEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof gleapEndpointsNested>;

const gleapWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof gleapWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const gleapEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gleapEndpointsNested>;

export const gleapAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGleapPlugin<T extends GleapPluginOptions> = CorsairPlugin<
	'gleap',
	typeof GleapSchema,
	typeof gleapEndpointsNested,
	typeof gleapWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGleapPlugin = BaseGleapPlugin<GleapPluginOptions>;

export type ExternalGleapPlugin<T extends GleapPluginOptions> =
	BaseGleapPlugin<T>;

export function gleap<const T extends GleapPluginOptions>(
	incomingOptions: GleapPluginOptions & T = {} as GleapPluginOptions & T,
): ExternalGleapPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gleap',
		authConfig: gleapAuthConfig,
		schema: GleapSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gleapEndpointsNested,
		webhooks: gleapWebhooksNested,
		endpointMeta: gleapEndpointMeta,
		endpointSchemas: gleapEndpointSchemas,
		webhookSchemas: gleapWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-gleap-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGleapTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGleapOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GleapKeyBuilderContext, source) => {
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
	} satisfies InternalGleapPlugin;
}

export type {
	ExampleEvent,
	GleapWebhookOutputs,
} from './webhooks/types';

export type {
	GleapEndpointInputs,
	GleapEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
