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
	BrowserToolEndpointInputs,
	BrowserToolEndpointOutputs,
} from './endpoints/types';
import {
	BrowserToolEndpointInputSchemas,
	BrowserToolEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrowserToolSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBrowserToolOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBrowserToolTenantWebhook } from './webhooks/tenant-matcher';
import type { BrowserToolWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BrowserToolPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBrowserToolPlugin['hooks'];
	webhookHooks?: InternalBrowserToolPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browserToolEndpointsNested>;
};

export type BrowserToolContext = CorsairPluginContext<
	typeof BrowserToolSchema,
	BrowserToolPluginOptions
>;

export type BrowserToolKeyBuilderContext =
	KeyBuilderContext<BrowserToolPluginOptions>;

export type BrowserToolBoundEndpoints = BindEndpoints<
	typeof browserToolEndpointsNested
>;

type BrowserToolEndpoint<K extends keyof BrowserToolEndpointOutputs> =
	CorsairEndpoint<
		BrowserToolContext,
		BrowserToolEndpointInputs[K],
		BrowserToolEndpointOutputs[K]
	>;

export type BrowserToolEndpoints = {
	exampleGet: BrowserToolEndpoint<'exampleGet'>;
};

type BrowserToolWebhook<
	K extends keyof BrowserToolWebhookOutputs,
	TEvent,
> = CorsairWebhook<BrowserToolContext, TEvent, BrowserToolWebhookOutputs[K]>;

export type BrowserToolWebhooks = {
	example: BrowserToolWebhook<'example', ExampleEvent>;
};

export type BrowserToolBoundWebhooks = BindWebhooks<BrowserToolWebhooks>;

const browserToolEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const browserToolWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const browserToolEndpointSchemas = {
	'example.get': {
		input: BrowserToolEndpointInputSchemas.exampleGet,
		output: BrowserToolEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof browserToolEndpointsNested
>;

const browserToolWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof browserToolWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const browserToolEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof browserToolEndpointsNested
>;

export const browserToolAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBrowserToolPlugin<T extends BrowserToolPluginOptions> =
	CorsairPlugin<
		'browsertool',
		typeof BrowserToolSchema,
		typeof browserToolEndpointsNested,
		typeof browserToolWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBrowserToolPlugin =
	BaseBrowserToolPlugin<BrowserToolPluginOptions>;

export type ExternalBrowserToolPlugin<T extends BrowserToolPluginOptions> =
	BaseBrowserToolPlugin<T>;

export function browsertool<const T extends BrowserToolPluginOptions>(
	incomingOptions: BrowserToolPluginOptions &
		T = {} as BrowserToolPluginOptions & T,
): ExternalBrowserToolPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'browsertool',
		authConfig: browserToolAuthConfig,
		schema: BrowserToolSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: browserToolEndpointsNested,
		webhooks: browserToolWebhooksNested,
		endpointMeta: browserToolEndpointMeta,
		endpointSchemas: browserToolEndpointSchemas,
		webhookSchemas: browserToolWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-browsertool-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBrowserToolTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBrowserToolOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BrowserToolKeyBuilderContext, source) => {
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
	} satisfies InternalBrowserToolPlugin;
}

export type {
	BrowserToolEndpointInputs,
	BrowserToolEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BrowserToolWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
