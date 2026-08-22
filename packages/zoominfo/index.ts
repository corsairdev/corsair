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
import { Zoominfo } from './endpoints';
import type {
	ZoominfoEndpointInputs,
	ZoominfoEndpointOutputs,
} from './endpoints/types';
import {
	ZoominfoEndpointInputSchemas,
	ZoominfoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZoominfoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveZoominfoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchZoominfoTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, ZoominfoWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ZoominfoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalZoominfoPlugin['hooks'];
	webhookHooks?: InternalZoominfoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zoominfoEndpointsNested>;
};

export type ZoominfoContext = CorsairPluginContext<
	typeof ZoominfoSchema,
	ZoominfoPluginOptions
>;

export type ZoominfoKeyBuilderContext =
	KeyBuilderContext<ZoominfoPluginOptions>;

export type ZoominfoBoundEndpoints = BindEndpoints<
	typeof zoominfoEndpointsNested
>;

type ZoominfoEndpoint<K extends keyof ZoominfoEndpointOutputs> =
	CorsairEndpoint<
		ZoominfoContext,
		ZoominfoEndpointInputs[K],
		ZoominfoEndpointOutputs[K]
	>;

export type ZoominfoEndpoints = {
	exampleGet: ZoominfoEndpoint<'searchCompanies'>;
};

type ZoominfoWebhook<
	K extends keyof ZoominfoWebhookOutputs,
	TEvent,
> = CorsairWebhook<ZoominfoContext, TEvent, ZoominfoWebhookOutputs[K]>;

export type ZoominfoWebhooks = {
	example: ZoominfoWebhook<'example', ExampleEvent>;
};

export type ZoominfoBoundWebhooks = BindWebhooks<ZoominfoWebhooks>;

const zoominfoEndpointsNested = {
	zoominfo: {
		searchCompanies: Zoominfo.searchCompanies,
	},
} as const;

const zoominfoWebhooksNested = {
	zoominfo: {
		searchCompanies: Zoominfo.searchCompanies,
	},
} as const;

export const zoominfoEndpointSchemas = {
	'zoominfo.searchCompanies': {
		input: ZoominfoEndpointInputSchemas.searchCompanies,
		output: ZoominfoEndpointOutputSchemas.searchCompanies,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zoominfoEndpointsNested
>;

const zoominfoWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof zoominfoWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const zoominfoEndpointMeta = {
	'zoominfo.searchCompanies': {
		riskLevel: 'read',
		description: 'Search for companies in ZoomInfo',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zoominfoEndpointsNested>;

export const zoominfoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseZoominfoPlugin<T extends ZoominfoPluginOptions> = CorsairPlugin<
	'zoominfo',
	typeof ZoominfoSchema,
	typeof zoominfoEndpointsNested,
	typeof zoominfoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalZoominfoPlugin = BaseZoominfoPlugin<ZoominfoPluginOptions>;

export type ExternalZoominfoPlugin<T extends ZoominfoPluginOptions> =
	BaseZoominfoPlugin<T>;

export function zoominfo<const T extends ZoominfoPluginOptions>(
	incomingOptions: ZoominfoPluginOptions & T = {} as ZoominfoPluginOptions & T,
): ExternalZoominfoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zoominfo',
		authConfig: zoominfoAuthConfig,
		schema: ZoominfoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zoominfoEndpointsNested,
		webhooks: zoominfoWebhooksNested,
		endpointMeta: zoominfoEndpointMeta,
		endpointSchemas: zoominfoEndpointSchemas,
		webhookSchemas: zoominfoWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-zoominfo-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchZoominfoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveZoominfoOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZoominfoKeyBuilderContext, source) => {
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
	} satisfies InternalZoominfoPlugin;
}

export type {
	SearchCompaniesInput,
	SearchCompaniesResponse,
	ZoominfoEndpointInputs,
	ZoominfoEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	ZoominfoWebhookOutputs,
} from './webhooks/types';
