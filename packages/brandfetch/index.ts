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
	BrandfetchEndpointInputs,
	BrandfetchEndpointOutputs,
} from './endpoints/types';
import {
	BrandfetchEndpointInputSchemas,
	BrandfetchEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrandfetchSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBrandfetchOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBrandfetchTenantWebhook } from './webhooks/tenant-matcher';
import type { BrandfetchWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BrandfetchPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBrandfetchPlugin['hooks'];
	webhookHooks?: InternalBrandfetchPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof brandfetchEndpointsNested>;
};

export type BrandfetchContext = CorsairPluginContext<
	typeof BrandfetchSchema,
	BrandfetchPluginOptions
>;

export type BrandfetchKeyBuilderContext =
	KeyBuilderContext<BrandfetchPluginOptions>;

export type BrandfetchBoundEndpoints = BindEndpoints<
	typeof brandfetchEndpointsNested
>;

type BrandfetchEndpoint<K extends keyof BrandfetchEndpointOutputs> =
	CorsairEndpoint<
		BrandfetchContext,
		BrandfetchEndpointInputs[K],
		BrandfetchEndpointOutputs[K]
	>;

export type BrandfetchEndpoints = {
	getBrandInfo: BrandfetchEndpoint<'getBrandInfo'>;
};

type BrandfetchWebhook<
	K extends keyof BrandfetchWebhookOutputs,
	TEvent,
> = CorsairWebhook<BrandfetchContext, TEvent, BrandfetchWebhookOutputs[K]>;

export type BrandfetchWebhooks = {
	example: BrandfetchWebhook<'example', ExampleEvent>;
};

export type BrandfetchBoundWebhooks = BindWebhooks<BrandfetchWebhooks>;

const brandfetchEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const brandfetchWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const brandfetchEndpointSchemas = {
	'example.get': {
		input: BrandfetchEndpointInputSchemas.getBrandInfo,
		output: BrandfetchEndpointOutputSchemas.getBrandInfo,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof brandfetchEndpointsNested
>;

const brandfetchWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof brandfetchWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const brandfetchEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get brand information by domain',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof brandfetchEndpointsNested
>;

export const brandfetchAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBrandfetchPlugin<T extends BrandfetchPluginOptions> =
	CorsairPlugin<
		'brandfetch',
		typeof BrandfetchSchema,
		typeof brandfetchEndpointsNested,
		typeof brandfetchWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBrandfetchPlugin =
	BaseBrandfetchPlugin<BrandfetchPluginOptions>;

export type ExternalBrandfetchPlugin<T extends BrandfetchPluginOptions> =
	BaseBrandfetchPlugin<T>;

export function brandfetch<const T extends BrandfetchPluginOptions>(
	incomingOptions: BrandfetchPluginOptions & T = {} as BrandfetchPluginOptions &
		T,
): ExternalBrandfetchPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'brandfetch',

		authConfig: brandfetchAuthConfig,

		schema: BrandfetchSchema,

		options,

		hooks: options.hooks,

		webhookHooks: options.webhookHooks,

		endpoints: brandfetchEndpointsNested,

		webhooks: brandfetchWebhooksNested,

		endpointMeta: brandfetchEndpointMeta,

		endpointSchemas: brandfetchEndpointSchemas,

		webhookSchemas: brandfetchWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			return 'x-brandfetch-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchBrandfetchTenantWebhook,

		oauthWebhookTenantLinkResolver: resolveBrandfetchOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: BrandfetchKeyBuilderContext, source) => {
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
	} satisfies InternalBrandfetchPlugin;
}

export type {
	BrandfetchEndpointInputs,
	BrandfetchEndpointOutputs,
	GetBrandInfoInput,
	GetBrandInfoResponse,
} from './endpoints/types';
export type {
	BrandfetchWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
