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
import { Flow } from './endpoints';
import type {
	CeligoEndpointInputs,
	CeligoEndpointOutputs,
} from './endpoints/types';
import {
	CeligoEndpointInputSchemas,
	CeligoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CeligoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveCeligoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCeligoTenantWebhook } from './webhooks/tenant-matcher';
import type { CeligoWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type CeligoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCeligoPlugin['hooks'];
	webhookHooks?: InternalCeligoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof celigoEndpointsNested>;
};

export type CeligoContext = CorsairPluginContext<
	typeof CeligoSchema,
	CeligoPluginOptions
>;

export type CeligoKeyBuilderContext = KeyBuilderContext<CeligoPluginOptions>;

export type CeligoBoundEndpoints = BindEndpoints<typeof celigoEndpointsNested>;

type CeligoEndpoint<K extends keyof CeligoEndpointOutputs> = CorsairEndpoint<
	CeligoContext,
	CeligoEndpointInputs[K],
	CeligoEndpointOutputs[K]
>;

export type CeligoEndpoints = {
	getFlow: CeligoEndpoint<'getFlow'>;
};

type CeligoWebhook<
	K extends keyof CeligoWebhookOutputs,
	TEvent,
> = CorsairWebhook<CeligoContext, TEvent, CeligoWebhookOutputs[K]>;

export type CeligoWebhooks = {
	example: CeligoWebhook<'example', ExampleEvent>;
};

export type CeligoBoundWebhooks = BindWebhooks<CeligoWebhooks>;

const celigoEndpointsNested = {
	flow: {
		get: Flow.get,
	},
} as const;

const celigoWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const celigoEndpointSchemas = {
	'flow.get': {
		input: CeligoEndpointInputSchemas.getFlow,
		output: CeligoEndpointOutputSchemas.getFlow,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof celigoEndpointsNested
>;

const celigoWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof celigoWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const celigoEndpointMeta = {
	'flow.get': {
		riskLevel: 'read',
		description: 'Get a Celigo flow by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof celigoEndpointsNested>;

export const celigoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCeligoPlugin<T extends CeligoPluginOptions> = CorsairPlugin<
	'celigo',
	typeof CeligoSchema,
	typeof celigoEndpointsNested,
	typeof celigoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCeligoPlugin = BaseCeligoPlugin<CeligoPluginOptions>;

export type ExternalCeligoPlugin<T extends CeligoPluginOptions> =
	BaseCeligoPlugin<T>;

export function celigo<const T extends CeligoPluginOptions>(
	incomingOptions: CeligoPluginOptions & T = {} as CeligoPluginOptions & T,
): ExternalCeligoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'celigo',
		authConfig: celigoAuthConfig,
		schema: CeligoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: celigoEndpointsNested,
		webhooks: celigoWebhooksNested,
		endpointMeta: celigoEndpointMeta,
		endpointSchemas: celigoEndpointSchemas,
		webhookSchemas: celigoWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-celigo-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchCeligoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCeligoOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: CeligoKeyBuilderContext, source) => {
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
	} satisfies InternalCeligoPlugin;
}

export type {
	CeligoEndpointInputs,
	CeligoEndpointOutputs,
	GetFlowInput,
	GetFlowResponse,
} from './endpoints/types';
export type {
	CeligoWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
