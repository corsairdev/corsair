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
import { Lists } from './endpoints';
import type {
	CampaynEndpointInputs,
	CampaynEndpointOutputs,
} from './endpoints/types';
import {
	CampaynEndpointInputSchemas,
	CampaynEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CampaynSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveCampaynOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCampaynTenantWebhook } from './webhooks/tenant-matcher';
import type { CampaynWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type CampaynPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCampaynPlugin['hooks'];
	webhookHooks?: InternalCampaynPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof campaynEndpointsNested>;
};

export type CampaynContext = CorsairPluginContext<
	typeof CampaynSchema,
	CampaynPluginOptions
>;

export type CampaynKeyBuilderContext = KeyBuilderContext<CampaynPluginOptions>;

export type CampaynBoundEndpoints = BindEndpoints<
	typeof campaynEndpointsNested
>;

type CampaynEndpoint<K extends keyof CampaynEndpointOutputs> = CorsairEndpoint<
	CampaynContext,
	CampaynEndpointInputs[K],
	CampaynEndpointOutputs[K]
>;

export type CampaynEndpoints = {
	listsGet: CampaynEndpoint<'listsGet'>;
};

export type CampaynWebhooks = {
	example: CampaynWebhook<'example', ExampleEvent>;
};

type CampaynWebhook<
	K extends keyof CampaynWebhookOutputs,
	TEvent,
> = CorsairWebhook<CampaynContext, TEvent, CampaynWebhookOutputs[K]>;

export type CampaynBoundWebhooks = BindWebhooks<CampaynWebhooks>;

const campaynEndpointsNested = {
	lists: {
		get: Lists.get,
	},
} as const;

const campaynWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const campaynEndpointSchemas = {
	'lists.get': {
		input: CampaynEndpointInputSchemas.listsGet,
		output: CampaynEndpointOutputSchemas.listsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof campaynEndpointsNested
>;

const campaynWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof campaynWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const campaynEndpointMeta = {
	'lists.get': {
		riskLevel: 'read',
		description: 'Get Campayn mailing lists',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof campaynEndpointsNested>;

export const campaynAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCampaynPlugin<T extends CampaynPluginOptions> = CorsairPlugin<
	'campayn',
	typeof CampaynSchema,
	typeof campaynEndpointsNested,
	typeof campaynWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCampaynPlugin = BaseCampaynPlugin<CampaynPluginOptions>;

export type ExternalCampaynPlugin<T extends CampaynPluginOptions> =
	BaseCampaynPlugin<T>;

export function campayn<const T extends CampaynPluginOptions>(
	incomingOptions: CampaynPluginOptions & T = {} as CampaynPluginOptions & T,
): ExternalCampaynPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'campayn',
		authConfig: campaynAuthConfig,
		schema: CampaynSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: campaynEndpointsNested,
		webhooks: campaynWebhooksNested,
		endpointMeta: campaynEndpointMeta,
		endpointSchemas: campaynEndpointSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			// Campayn webhook signature format is not documented
			// in issue #1566, so keep the generated matcher for now.
			return 'x-campayn-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchCampaynTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCampaynOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: CampaynKeyBuilderContext, source) => {
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
	} satisfies InternalCampaynPlugin;
}

export type {
	CampaynEndpointInputs,
	CampaynEndpointOutputs,
} from './endpoints/types';
export type {
	CampaynWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
