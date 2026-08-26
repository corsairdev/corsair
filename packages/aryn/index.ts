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
	ArynEndpointInputs,
	ArynEndpointOutputs,
} from './endpoints/types';
import {
	ArynEndpointInputSchemas,
	ArynEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ArynSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveArynOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchArynTenantWebhook } from './webhooks/tenant-matcher';
import type { ArynWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ArynPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalArynPlugin['hooks'];
	webhookHooks?: InternalArynPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof arynEndpointsNested>;
};

export type ArynContext = CorsairPluginContext<
	typeof ArynSchema,
	ArynPluginOptions
>;

export type ArynKeyBuilderContext = KeyBuilderContext<ArynPluginOptions>;

export type ArynBoundEndpoints = BindEndpoints<typeof arynEndpointsNested>;

type ArynEndpoint<K extends keyof ArynEndpointOutputs> = CorsairEndpoint<
	ArynContext,
	ArynEndpointInputs[K],
	ArynEndpointOutputs[K]
>;

export type ArynEndpoints = {
	exampleGet: ArynEndpoint<'exampleGet'>;
};

type ArynWebhook<K extends keyof ArynWebhookOutputs, TEvent> = CorsairWebhook<
	ArynContext,
	TEvent,
	ArynWebhookOutputs[K]
>;

export type ArynWebhooks = {
	example: ArynWebhook<'example', ExampleEvent>;
};

export type ArynBoundWebhooks = BindWebhooks<ArynWebhooks>;

const arynEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const arynWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const arynEndpointSchemas = {
	'example.get': {
		input: ArynEndpointInputSchemas.exampleGet,
		output: ArynEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof arynEndpointsNested>;

const arynWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof arynWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const arynEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof arynEndpointsNested>;

export const arynAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseArynPlugin<T extends ArynPluginOptions> = CorsairPlugin<
	'aryn',
	typeof ArynSchema,
	typeof arynEndpointsNested,
	typeof arynWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalArynPlugin = BaseArynPlugin<ArynPluginOptions>;

export type ExternalArynPlugin<T extends ArynPluginOptions> = BaseArynPlugin<T>;

export function aryn<const T extends ArynPluginOptions>(
	incomingOptions: ArynPluginOptions & T = {} as ArynPluginOptions & T,
): ExternalArynPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'aryn',
		authConfig: arynAuthConfig,
		schema: ArynSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: arynEndpointsNested,
		webhooks: arynWebhooksNested,
		endpointMeta: arynEndpointMeta,
		endpointSchemas: arynEndpointSchemas,
		webhookSchemas: arynWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-aryn-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchArynTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveArynOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ArynKeyBuilderContext, source) => {
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
	} satisfies InternalArynPlugin;
}

export type {
	ArynEndpointInputs,
	ArynEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	ArynWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
