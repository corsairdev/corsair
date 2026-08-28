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
import type { WixEndpointInputs, WixEndpointOutputs } from './endpoints/types';
import { WixEndpointInputSchemas, WixEndpointOutputSchemas } from './endpoints/types';
import type {
	WixWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { WixSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchWixTenantWebhook } from './webhooks/tenant-matcher';
import { resolveWixOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type WixPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWixPlugin['hooks'];
	webhookHooks?: InternalWixPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wixEndpointsNested>;
};

export type WixContext = CorsairPluginContext<
	typeof WixSchema,
	WixPluginOptions
>;

export type WixKeyBuilderContext = KeyBuilderContext<WixPluginOptions>;

export type WixBoundEndpoints = BindEndpoints<typeof wixEndpointsNested>;

type WixEndpoint<
	K extends keyof WixEndpointOutputs,
> = CorsairEndpoint<
	WixContext,
	WixEndpointInputs[K],
	WixEndpointOutputs[K]
>;

export type WixEndpoints = {
	exampleGet: WixEndpoint<'exampleGet'>;
};

type WixWebhook<
	K extends keyof WixWebhookOutputs,
	TEvent,
> = CorsairWebhook<WixContext, TEvent, WixWebhookOutputs[K]>;

export type WixWebhooks = {
	example: WixWebhook<'example', ExampleEvent>;
};

export type WixBoundWebhooks = BindWebhooks<WixWebhooks>;

const wixEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const wixWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const wixEndpointSchemas = {
	'example.get': {
		input: WixEndpointInputSchemas.exampleGet,
		output: WixEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof wixEndpointsNested>;

const wixWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof wixWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const wixEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof wixEndpointsNested>;

export const wixAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWixPlugin<T extends WixPluginOptions> = CorsairPlugin<
	'wix',
	typeof WixSchema,
	typeof wixEndpointsNested,
	typeof wixWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWixPlugin = BaseWixPlugin<WixPluginOptions>;

export type ExternalWixPlugin<T extends WixPluginOptions> =
	BaseWixPlugin<T>;

export function wix<const T extends WixPluginOptions>(
	incomingOptions: WixPluginOptions & T = {} as WixPluginOptions & T,
): ExternalWixPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wix',
		authConfig: wixAuthConfig,
		schema: WixSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: wixEndpointsNested,
		webhooks: wixWebhooksNested,
		endpointMeta: wixEndpointMeta,
		endpointSchemas: wixEndpointSchemas,
		webhookSchemas: wixWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-wix-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchWixTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveWixOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WixKeyBuilderContext, source) => {
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
	} satisfies InternalWixPlugin;
}

export type {
	ExampleEvent,
	WixWebhookOutputs,
} from './webhooks/types';

export type {
	WixEndpointInputs,
	WixEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
