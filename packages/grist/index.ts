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
import type { GristEndpointInputs, GristEndpointOutputs } from './endpoints/types';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './endpoints/types';
import type {
	GristWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GristSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGristTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGristOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GristPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGristPlugin['hooks'];
	webhookHooks?: InternalGristPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gristEndpointsNested>;
};

export type GristContext = CorsairPluginContext<
	typeof GristSchema,
	GristPluginOptions
>;

export type GristKeyBuilderContext = KeyBuilderContext<GristPluginOptions>;

export type GristBoundEndpoints = BindEndpoints<typeof gristEndpointsNested>;

type GristEndpoint<
	K extends keyof GristEndpointOutputs,
> = CorsairEndpoint<
	GristContext,
	GristEndpointInputs[K],
	GristEndpointOutputs[K]
>;

export type GristEndpoints = {
	exampleGet: GristEndpoint<'exampleGet'>;
};

type GristWebhook<
	K extends keyof GristWebhookOutputs,
	TEvent,
> = CorsairWebhook<GristContext, TEvent, GristWebhookOutputs[K]>;

export type GristWebhooks = {
	example: GristWebhook<'example', ExampleEvent>;
};

export type GristBoundWebhooks = BindWebhooks<GristWebhooks>;

const gristEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const gristWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const gristEndpointSchemas = {
	'example.get': {
		input: GristEndpointInputSchemas.exampleGet,
		output: GristEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof gristEndpointsNested>;

const gristWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof gristWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const gristEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gristEndpointsNested>;

export const gristAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGristPlugin<T extends GristPluginOptions> = CorsairPlugin<
	'grist',
	typeof GristSchema,
	typeof gristEndpointsNested,
	typeof gristWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGristPlugin = BaseGristPlugin<GristPluginOptions>;

export type ExternalGristPlugin<T extends GristPluginOptions> =
	BaseGristPlugin<T>;

export function grist<const T extends GristPluginOptions>(
	incomingOptions: GristPluginOptions & T = {} as GristPluginOptions & T,
): ExternalGristPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'grist',
		authConfig: gristAuthConfig,
		schema: GristSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gristEndpointsNested,
		webhooks: gristWebhooksNested,
		endpointMeta: gristEndpointMeta,
		endpointSchemas: gristEndpointSchemas,
		webhookSchemas: gristWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-grist-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGristTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGristOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GristKeyBuilderContext, source) => {
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
	} satisfies InternalGristPlugin;
}

export type {
	ExampleEvent,
	GristWebhookOutputs,
} from './webhooks/types';

export type {
	GristEndpointInputs,
	GristEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
