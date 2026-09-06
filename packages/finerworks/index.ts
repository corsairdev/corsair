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
	FinerWorksEndpointInputs,
	FinerWorksEndpointOutputs,
} from './endpoints/types';
import {
	FinerWorksEndpointInputSchemas,
	FinerWorksEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FinerWorksSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveFinerWorksOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchFinerWorksTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, FinerWorksWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type FinerWorksPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFinerWorksPlugin['hooks'];
	webhookHooks?: InternalFinerWorksPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof finerWorksEndpointsNested>;
};

export type FinerWorksContext = CorsairPluginContext<
	typeof FinerWorksSchema,
	FinerWorksPluginOptions
>;

export type FinerWorksKeyBuilderContext =
	KeyBuilderContext<FinerWorksPluginOptions>;

export type FinerWorksBoundEndpoints = BindEndpoints<
	typeof finerWorksEndpointsNested
>;

type FinerWorksEndpoint<K extends keyof FinerWorksEndpointOutputs> =
	CorsairEndpoint<
		FinerWorksContext,
		FinerWorksEndpointInputs[K],
		FinerWorksEndpointOutputs[K]
	>;

export type FinerWorksEndpoints = {
	testConnection: FinerWorksEndpoint<'exampleGet'>;
};

type FinerWorksWebhook<
	K extends keyof FinerWorksWebhookOutputs,
	TEvent,
> = CorsairWebhook<FinerWorksContext, TEvent, FinerWorksWebhookOutputs[K]>;

export type FinerWorksWebhooks = {
	example: FinerWorksWebhook<'example', ExampleEvent>;
};

export type FinerWorksBoundWebhooks = BindWebhooks<FinerWorksWebhooks>;

const finerWorksEndpointsNested = {
	testConnection: {
		get: Example.get,
	},
} as const;

const finerWorksWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const finerWorksEndpointSchemas = {
	'testConnection.get': {
		input: FinerWorksEndpointInputSchemas.exampleGet,
		output: FinerWorksEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof finerWorksEndpointsNested
>;

const finerWorksWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof finerWorksWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const finerWorksEndpointMeta = {
	'testConnection.get': {
		riskLevel: 'read',
		description: 'Test FinerWorks API connection',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof finerWorksEndpointsNested
>;

export const finerWorksAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFinerWorksPlugin<T extends FinerWorksPluginOptions> =
	CorsairPlugin<
		'finerworks',
		typeof FinerWorksSchema,
		typeof finerWorksEndpointsNested,
		typeof finerWorksWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalFinerWorksPlugin =
	BaseFinerWorksPlugin<FinerWorksPluginOptions>;

export type ExternalFinerWorksPlugin<T extends FinerWorksPluginOptions> =
	BaseFinerWorksPlugin<T>;

export function finerworks<const T extends FinerWorksPluginOptions>(
	incomingOptions: FinerWorksPluginOptions & T = {} as FinerWorksPluginOptions &
		T,
): ExternalFinerWorksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'finerworks',
		authConfig: finerWorksAuthConfig,
		schema: FinerWorksSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: finerWorksEndpointsNested,
		webhooks: finerWorksWebhooksNested,
		endpointMeta: finerWorksEndpointMeta,
		endpointSchemas: finerWorksEndpointSchemas,
		webhookSchemas: finerWorksWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-finerworks-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchFinerWorksTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFinerWorksOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: FinerWorksKeyBuilderContext, source) => {
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
	} satisfies InternalFinerWorksPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	FinerWorksEndpointInputs,
	FinerWorksEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	FinerWorksWebhookOutputs,
} from './webhooks/types';
