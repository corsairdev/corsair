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
import type { OmnisendEndpointInputs, OmnisendEndpointOutputs } from './endpoints/types';
import { OmnisendEndpointInputSchemas, OmnisendEndpointOutputSchemas } from './endpoints/types';
import type {
	OmnisendWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { OmnisendSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchOmnisendTenantWebhook } from './webhooks/tenant-matcher';
import { resolveOmnisendOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type OmnisendPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalOmnisendPlugin['hooks'];
	webhookHooks?: InternalOmnisendPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof omnisendEndpointsNested>;
};

export type OmnisendContext = CorsairPluginContext<
	typeof OmnisendSchema,
	OmnisendPluginOptions
>;

export type OmnisendKeyBuilderContext = KeyBuilderContext<OmnisendPluginOptions>;

export type OmnisendBoundEndpoints = BindEndpoints<typeof omnisendEndpointsNested>;

type OmnisendEndpoint<
	K extends keyof OmnisendEndpointOutputs,
> = CorsairEndpoint<
	OmnisendContext,
	OmnisendEndpointInputs[K],
	OmnisendEndpointOutputs[K]
>;

export type OmnisendEndpoints = {
	exampleGet: OmnisendEndpoint<'exampleGet'>;
};

type OmnisendWebhook<
	K extends keyof OmnisendWebhookOutputs,
	TEvent,
> = CorsairWebhook<OmnisendContext, TEvent, OmnisendWebhookOutputs[K]>;

export type OmnisendWebhooks = {
	example: OmnisendWebhook<'example', ExampleEvent>;
};

export type OmnisendBoundWebhooks = BindWebhooks<OmnisendWebhooks>;

const omnisendEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const omnisendWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const omnisendEndpointSchemas = {
	'example.get': {
		input: OmnisendEndpointInputSchemas.exampleGet,
		output: OmnisendEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof omnisendEndpointsNested>;

const omnisendWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof omnisendWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const omnisendEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof omnisendEndpointsNested>;

export const omnisendAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOmnisendPlugin<T extends OmnisendPluginOptions> = CorsairPlugin<
	'omnisend',
	typeof OmnisendSchema,
	typeof omnisendEndpointsNested,
	typeof omnisendWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOmnisendPlugin = BaseOmnisendPlugin<OmnisendPluginOptions>;

export type ExternalOmnisendPlugin<T extends OmnisendPluginOptions> =
	BaseOmnisendPlugin<T>;

export function omnisend<const T extends OmnisendPluginOptions>(
	incomingOptions: OmnisendPluginOptions & T = {} as OmnisendPluginOptions & T,
): ExternalOmnisendPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'omnisend',
		authConfig: omnisendAuthConfig,
		schema: OmnisendSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: omnisendEndpointsNested,
		webhooks: omnisendWebhooksNested,
		endpointMeta: omnisendEndpointMeta,
		endpointSchemas: omnisendEndpointSchemas,
		webhookSchemas: omnisendWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-omnisend-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchOmnisendTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveOmnisendOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OmnisendKeyBuilderContext, source) => {
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
	} satisfies InternalOmnisendPlugin;
}

export type {
	ExampleEvent,
	OmnisendWebhookOutputs,
} from './webhooks/types';

export type {
	OmnisendEndpointInputs,
	OmnisendEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
