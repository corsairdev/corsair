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
import type { ConfluenceEndpointInputs, ConfluenceEndpointOutputs } from './endpoints/types';
import { ConfluenceEndpointInputSchemas, ConfluenceEndpointOutputSchemas } from './endpoints/types';
import type {
	ConfluenceWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ConfluenceSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchConfluenceTenantWebhook } from './webhooks/tenant-matcher';
import { resolveConfluenceOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ConfluencePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalConfluencePlugin['hooks'];
	webhookHooks?: InternalConfluencePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof confluenceEndpointsNested>;
};

export type ConfluenceContext = CorsairPluginContext<
	typeof ConfluenceSchema,
	ConfluencePluginOptions
>;

export type ConfluenceKeyBuilderContext = KeyBuilderContext<ConfluencePluginOptions>;

export type ConfluenceBoundEndpoints = BindEndpoints<typeof confluenceEndpointsNested>;

type ConfluenceEndpoint<
	K extends keyof ConfluenceEndpointOutputs,
> = CorsairEndpoint<
	ConfluenceContext,
	ConfluenceEndpointInputs[K],
	ConfluenceEndpointOutputs[K]
>;

export type ConfluenceEndpoints = {
	exampleGet: ConfluenceEndpoint<'exampleGet'>;
};

type ConfluenceWebhook<
	K extends keyof ConfluenceWebhookOutputs,
	TEvent,
> = CorsairWebhook<ConfluenceContext, TEvent, ConfluenceWebhookOutputs[K]>;

export type ConfluenceWebhooks = {
	example: ConfluenceWebhook<'example', ExampleEvent>;
};

export type ConfluenceBoundWebhooks = BindWebhooks<ConfluenceWebhooks>;

const confluenceEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const confluenceWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const confluenceEndpointSchemas = {
	'example.get': {
		input: ConfluenceEndpointInputSchemas.exampleGet,
		output: ConfluenceEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof confluenceEndpointsNested>;

const confluenceWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof confluenceWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const confluenceEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof confluenceEndpointsNested>;

export const confluenceAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseConfluencePlugin<T extends ConfluencePluginOptions> = CorsairPlugin<
	'confluence',
	typeof ConfluenceSchema,
	typeof confluenceEndpointsNested,
	typeof confluenceWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalConfluencePlugin = BaseConfluencePlugin<ConfluencePluginOptions>;

export type ExternalConfluencePlugin<T extends ConfluencePluginOptions> =
	BaseConfluencePlugin<T>;

export function confluence<const T extends ConfluencePluginOptions>(
	incomingOptions: ConfluencePluginOptions & T = {} as ConfluencePluginOptions & T,
): ExternalConfluencePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'confluence',
		authConfig: confluenceAuthConfig,
		schema: ConfluenceSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: confluenceEndpointsNested,
		webhooks: confluenceWebhooksNested,
		endpointMeta: confluenceEndpointMeta,
		endpointSchemas: confluenceEndpointSchemas,
		webhookSchemas: confluenceWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-confluence-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchConfluenceTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveConfluenceOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ConfluenceKeyBuilderContext, source) => {
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
	} satisfies InternalConfluencePlugin;
}

export type {
	ExampleEvent,
	ConfluenceWebhookOutputs,
} from './webhooks/types';

export type {
	ConfluenceEndpointInputs,
	ConfluenceEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
