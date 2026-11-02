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
	ZohoDeskEndpointInputs,
	ZohoDeskEndpointOutputs,
} from './endpoints/types';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZohoDeskSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveZohoDeskOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchZohoDeskTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, ZohoDeskWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ZohoDeskPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalZohoDeskPlugin['hooks'];
	webhookHooks?: InternalZohoDeskPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zohoDeskEndpointsNested>;
};

export type ZohoDeskContext = CorsairPluginContext<
	typeof ZohoDeskSchema,
	ZohoDeskPluginOptions
>;

export type ZohoDeskKeyBuilderContext =
	KeyBuilderContext<ZohoDeskPluginOptions>;

export type ZohoDeskBoundEndpoints = BindEndpoints<
	typeof zohoDeskEndpointsNested
>;

type ZohoDeskEndpoint<K extends keyof ZohoDeskEndpointOutputs> =
	CorsairEndpoint<
		ZohoDeskContext,
		ZohoDeskEndpointInputs[K],
		ZohoDeskEndpointOutputs[K]
	>;

export type ZohoDeskEndpoints = {
	exampleGet: ZohoDeskEndpoint<'exampleGet'>;
};

type ZohoDeskWebhook<
	K extends keyof ZohoDeskWebhookOutputs,
	TEvent,
> = CorsairWebhook<ZohoDeskContext, TEvent, ZohoDeskWebhookOutputs[K]>;

export type ZohoDeskWebhooks = {
	example: ZohoDeskWebhook<'example', ExampleEvent>;
};

export type ZohoDeskBoundWebhooks = BindWebhooks<ZohoDeskWebhooks>;

const zohoDeskEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const zohoDeskWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const zohoDeskEndpointSchemas = {
	'example.get': {
		input: ZohoDeskEndpointInputSchemas.exampleGet,
		output: ZohoDeskEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zohoDeskEndpointsNested
>;

const zohoDeskWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof zohoDeskWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const zohoDeskEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zohoDeskEndpointsNested>;

export const zohoDeskAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseZohoDeskPlugin<T extends ZohoDeskPluginOptions> = CorsairPlugin<
	'zohodesk',
	typeof ZohoDeskSchema,
	typeof zohoDeskEndpointsNested,
	typeof zohoDeskWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalZohoDeskPlugin = BaseZohoDeskPlugin<ZohoDeskPluginOptions>;

export type ExternalZohoDeskPlugin<T extends ZohoDeskPluginOptions> =
	BaseZohoDeskPlugin<T>;

export function zohodesk<const T extends ZohoDeskPluginOptions>(
	incomingOptions: ZohoDeskPluginOptions & T = {} as ZohoDeskPluginOptions & T,
): ExternalZohoDeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zohodesk',
		authConfig: zohoDeskAuthConfig,
		schema: ZohoDeskSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zohoDeskEndpointsNested,
		webhooks: zohoDeskWebhooksNested,
		endpointMeta: zohoDeskEndpointMeta,
		endpointSchemas: zohoDeskEndpointSchemas,
		webhookSchemas: zohoDeskWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-zohodesk-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchZohoDeskTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveZohoDeskOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZohoDeskKeyBuilderContext, source) => {
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
	} satisfies InternalZohoDeskPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	ZohoDeskEndpointInputs,
	ZohoDeskEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	ZohoDeskWebhookOutputs,
} from './webhooks/types';
