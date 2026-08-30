import type {
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
import type { AuthTypes } from 'corsair/core';
import type { CampaynEndpointInputs, CampaynEndpointOutputs } from './endpoints/types';
import { CampaynEndpointInputSchemas, CampaynEndpointOutputSchemas } from './endpoints/types';
import type {
	CampaynWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { CampaynSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchCampaynTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCampaynOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

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

export type CampaynBoundEndpoints = BindEndpoints<typeof campaynEndpointsNested>;

type CampaynEndpoint<
	K extends keyof CampaynEndpointOutputs,
> = CorsairEndpoint<
	CampaynContext,
	CampaynEndpointInputs[K],
	CampaynEndpointOutputs[K]
>;

export type CampaynEndpoints = {
	exampleGet: CampaynEndpoint<'exampleGet'>;
};

type CampaynWebhook<
	K extends keyof CampaynWebhookOutputs,
	TEvent,
> = CorsairWebhook<CampaynContext, TEvent, CampaynWebhookOutputs[K]>;

export type CampaynWebhooks = {
	example: CampaynWebhook<'example', ExampleEvent>;
};

export type CampaynBoundWebhooks = BindWebhooks<CampaynWebhooks>;

const campaynEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const campaynWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const campaynEndpointSchemas = {
	'example.get': {
		input: CampaynEndpointInputSchemas.exampleGet,
		output: CampaynEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof campaynEndpointsNested>;

const campaynWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof campaynWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const campaynEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
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
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: campaynEndpointsNested,
		webhooks: campaynWebhooksNested,
		endpointMeta: campaynEndpointMeta,
		endpointSchemas: campaynEndpointSchemas,
		webhookSchemas: campaynWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
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
	ExampleEvent,
	CampaynWebhookOutputs,
} from './webhooks/types';

export type {
	CampaynEndpointInputs,
	CampaynEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
