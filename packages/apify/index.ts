import type {
	BindEndpoints,
	BindWebhooks,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { ApifyEndpointInputs, ApifyEndpointOutputs } from './endpoints/types';
import type { ApifyWebhookOutputs, ApifyWebhookPayload } from './webhooks/types';
import { apifyEndpointMeta, apifyEndpointsNested, apifyEndpointSchemas } from './endpoints';
import { ApifySchema } from './schema';
import { ApifyWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type ApifyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalApifyPlugin['hooks'];
	webhookHooks?: InternalApifyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apifyEndpointsNested>;
};

export type ApifyContext = CorsairPluginContext<typeof ApifySchema, ApifyPluginOptions>;
export type ApifyKeyBuilderContext = KeyBuilderContext<ApifyPluginOptions>;
export type ApifyBoundEndpoints = BindEndpoints<typeof apifyEndpointsNested>;
export type ApifyBoundWebhooks = BindWebhooks<typeof apifyWebhooksNested>;

const apifyWebhooksNested = { apify: { webhook: ApifyWebhooks.webhook } } as const;
const defaultAuthType: AuthTypes = 'api_key' as const;

export const apifyAuthConfig = {
	api_key: { account: ['one'] as const },
} as const satisfies PluginAuthConfig;

export type BaseApifyPlugin<T extends ApifyPluginOptions> = CorsairPlugin<
	'apify',
	typeof ApifySchema,
	typeof apifyEndpointsNested,
	typeof apifyWebhooksNested,
	T,
	typeof defaultAuthType
>;
export type InternalApifyPlugin = BaseApifyPlugin<ApifyPluginOptions>;
export type ExternalApifyPlugin<T extends ApifyPluginOptions> = BaseApifyPlugin<T>;

export function apify<const T extends ApifyPluginOptions>(incomingOptions: ApifyPluginOptions & T = {} as ApifyPluginOptions & T): ExternalApifyPlugin<T> {
	const options = { ...incomingOptions, authType: incomingOptions.authType ?? defaultAuthType };
	return {
		id: 'apify',
		schema: ApifySchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: apifyEndpointsNested,
		webhooks: apifyWebhooksNested,
		endpointMeta: apifyEndpointMeta,
		endpointSchemas: apifyEndpointSchemas,
		pluginWebhookMatcher: (request) => 'x-apify-webhook' in request.headers,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: ApifyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) return options.webhookSecret;
			if (source === 'webhook') return (await ctx.keys.get_webhook_signature()) ?? '';
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') return (await ctx.keys.get_api_key()) ?? '';
			return '';
		},
	} satisfies InternalApifyPlugin;
}

export type { ApifyWebhookPayload, ApifyWebhookOutputs } from './webhooks/types';
export type { ApifyEndpointInputs, ApifyEndpointOutputs } from './endpoints/types';
