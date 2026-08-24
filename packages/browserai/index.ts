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
	BrowseraiEndpointInputs,
	BrowseraiEndpointOutputs,
} from './endpoints/types';
import {
	BrowseraiEndpointInputSchemas,
	BrowseraiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrowseraiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBrowseraiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBrowseraiTenantWebhook } from './webhooks/tenant-matcher';
import type { BrowseraiWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BrowseraiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBrowseraiPlugin['hooks'];
	webhookHooks?: InternalBrowseraiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browseraiEndpointsNested>;
};

export type BrowseraiContext = CorsairPluginContext<
	typeof BrowseraiSchema,
	BrowseraiPluginOptions
>;

export type BrowseraiKeyBuilderContext =
	KeyBuilderContext<BrowseraiPluginOptions>;

export type BrowseraiBoundEndpoints = BindEndpoints<
	typeof browseraiEndpointsNested
>;

type BrowseraiEndpoint<K extends keyof BrowseraiEndpointOutputs> =
	CorsairEndpoint<
		BrowseraiContext,
		BrowseraiEndpointInputs[K],
		BrowseraiEndpointOutputs[K]
	>;

export type BrowseraiEndpoints = {
	exampleGet: BrowseraiEndpoint<'exampleGet'>;
};

type BrowseraiWebhook<
	K extends keyof BrowseraiWebhookOutputs,
	TEvent,
> = CorsairWebhook<BrowseraiContext, TEvent, BrowseraiWebhookOutputs[K]>;

export type BrowseraiWebhooks = {
	example: BrowseraiWebhook<'example', ExampleEvent>;
};

export type BrowseraiBoundWebhooks = BindWebhooks<BrowseraiWebhooks>;

const browseraiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const browseraiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const browseraiEndpointSchemas = {
	'example.get': {
		input: BrowseraiEndpointInputSchemas.exampleGet,
		output: BrowseraiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof browseraiEndpointsNested
>;

const browseraiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof browseraiWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const browseraiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof browseraiEndpointsNested
>;

export const browseraiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBrowseraiPlugin<T extends BrowseraiPluginOptions> =
	CorsairPlugin<
		'browserai',
		typeof BrowseraiSchema,
		typeof browseraiEndpointsNested,
		typeof browseraiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBrowseraiPlugin =
	BaseBrowseraiPlugin<BrowseraiPluginOptions>;

export type ExternalBrowseraiPlugin<T extends BrowseraiPluginOptions> =
	BaseBrowseraiPlugin<T>;

export function browserai<const T extends BrowseraiPluginOptions>(
	incomingOptions: BrowseraiPluginOptions & T = {} as BrowseraiPluginOptions &
		T,
): ExternalBrowseraiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'browserai',
		authConfig: browseraiAuthConfig,
		schema: BrowseraiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: browseraiEndpointsNested,
		webhooks: browseraiWebhooksNested,
		endpointMeta: browseraiEndpointMeta,
		endpointSchemas: browseraiEndpointSchemas,
		webhookSchemas: browseraiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-browserai-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBrowseraiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBrowseraiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BrowseraiKeyBuilderContext, source) => {
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
	} satisfies InternalBrowseraiPlugin;
}

export type {
	BrowseraiEndpointInputs,
	BrowseraiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BrowseraiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
