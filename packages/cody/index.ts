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
	CodyEndpointInputs,
	CodyEndpointOutputs,
} from './endpoints/types';
import {
	CodyEndpointInputSchemas,
	CodyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveCodyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCodyTenantWebhook } from './webhooks/tenant-matcher';
import type { CodyWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type CodyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCodyPlugin['hooks'];
	webhookHooks?: InternalCodyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codyEndpointsNested>;
};

export type CodyContext = CorsairPluginContext<
	typeof CodySchema,
	CodyPluginOptions
>;

export type CodyKeyBuilderContext = KeyBuilderContext<CodyPluginOptions>;

export type CodyBoundEndpoints = BindEndpoints<typeof codyEndpointsNested>;

type CodyEndpoint<K extends keyof CodyEndpointOutputs> = CorsairEndpoint<
	CodyContext,
	CodyEndpointInputs[K],
	CodyEndpointOutputs[K]
>;

export type CodyEndpoints = {
	exampleGet: CodyEndpoint<'exampleGet'>;
};

type CodyWebhook<K extends keyof CodyWebhookOutputs, TEvent> = CorsairWebhook<
	CodyContext,
	TEvent,
	CodyWebhookOutputs[K]
>;

export type CodyWebhooks = {
	example: CodyWebhook<'example', ExampleEvent>;
};

export type CodyBoundWebhooks = BindWebhooks<CodyWebhooks>;

const codyEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const codyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const codyEndpointSchemas = {
	'example.get': {
		input: CodyEndpointInputSchemas.exampleGet,
		output: CodyEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof codyEndpointsNested>;

const codyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof codyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const codyEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof codyEndpointsNested>;

export const codyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodyPlugin<T extends CodyPluginOptions> = CorsairPlugin<
	'cody',
	typeof CodySchema,
	typeof codyEndpointsNested,
	typeof codyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCodyPlugin = BaseCodyPlugin<CodyPluginOptions>;

export type ExternalCodyPlugin<T extends CodyPluginOptions> = BaseCodyPlugin<T>;

export function cody<const T extends CodyPluginOptions>(
	incomingOptions: CodyPluginOptions & T = {} as CodyPluginOptions & T,
): ExternalCodyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cody',
		authConfig: codyAuthConfig,
		schema: CodySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: codyEndpointsNested,
		webhooks: codyWebhooksNested,
		endpointMeta: codyEndpointMeta,
		endpointSchemas: codyEndpointSchemas,
		webhookSchemas: codyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-cody-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCodyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCodyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodyKeyBuilderContext, source) => {
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
	} satisfies InternalCodyPlugin;
}

export type {
	CodyEndpointInputs,
	CodyEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	CodyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
