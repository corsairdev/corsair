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
import type { BreezeEndpointInputs, BreezeEndpointOutputs } from './endpoints/types';
import { BreezeEndpointInputSchemas, BreezeEndpointOutputSchemas } from './endpoints/types';
import type {
	BreezeWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Projects } from './endpoints';
import { BreezeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchBreezeTenantWebhook } from './webhooks/tenant-matcher';
import { resolveBreezeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type BreezePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBreezePlugin['hooks'];
	webhookHooks?: InternalBreezePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof breezeEndpointsNested>;
};

export type BreezeContext = CorsairPluginContext<
	typeof BreezeSchema,
	BreezePluginOptions
>;

export type BreezeKeyBuilderContext = KeyBuilderContext<BreezePluginOptions>;

export type BreezeBoundEndpoints = BindEndpoints<typeof breezeEndpointsNested>;

type BreezeEndpoint<
	K extends keyof BreezeEndpointOutputs,
> = CorsairEndpoint<
	BreezeContext,
	BreezeEndpointInputs[K],
	BreezeEndpointOutputs[K]
>;

export type BreezeEndpoints = {
    getProjects: BreezeEndpoint<'getProjects'>;
};

type BreezeWebhook<
	K extends keyof BreezeWebhookOutputs,
	TEvent,
> = CorsairWebhook<BreezeContext, TEvent, BreezeWebhookOutputs[K]>;

export type BreezeWebhooks = {
	example: BreezeWebhook<'example', ExampleEvent>;
};

export type BreezeBoundWebhooks = BindWebhooks<BreezeWebhooks>;

const breezeEndpointsNested = {
    projects: {
        get: Projects.get,
    },
} as const;

const breezeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const breezeEndpointSchemas = {
    'projects.get': {
        input: BreezeEndpointInputSchemas.getProjects,
        output: BreezeEndpointOutputSchemas.getProjects,
    },
} as const satisfies RequiredPluginEndpointSchemas<typeof breezeEndpointsNested>;

const breezeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof breezeWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const breezeEndpointMeta = {
    'projects.get': {
        riskLevel: 'read',
        description: 'Get all active Breeze projects',
    },
} as const satisfies RequiredPluginEndpointMeta<typeof breezeEndpointsNested>;

export const breezeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBreezePlugin<T extends BreezePluginOptions> = CorsairPlugin<
	'breeze',
	typeof BreezeSchema,
	typeof breezeEndpointsNested,
	typeof breezeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBreezePlugin = BaseBreezePlugin<BreezePluginOptions>;

export type ExternalBreezePlugin<T extends BreezePluginOptions> =
	BaseBreezePlugin<T>;

export function breeze<const T extends BreezePluginOptions>(
	incomingOptions: BreezePluginOptions & T = {} as BreezePluginOptions & T,
): ExternalBreezePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'breeze',
		authConfig: breezeAuthConfig,
		schema: BreezeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: breezeEndpointsNested,
		webhooks: breezeWebhooksNested,
		endpointMeta: breezeEndpointMeta,
		endpointSchemas: breezeEndpointSchemas,
		webhookSchemas: breezeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-breeze-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBreezeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBreezeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BreezeKeyBuilderContext, source) => {
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
	} satisfies InternalBreezePlugin;
}

export type {
	ExampleEvent,
	BreezeWebhookOutputs,
} from './webhooks/types';

export type {
	BreezeEndpointInputs,
	BreezeEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
