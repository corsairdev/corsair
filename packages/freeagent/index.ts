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
import type { FreeAgentEndpointInputs, FreeAgentEndpointOutputs } from './endpoints/types';
import { FreeAgentEndpointInputSchemas, FreeAgentEndpointOutputSchemas } from './endpoints/types';
import type {
	FreeAgentWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FreeAgentSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFreeAgentTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFreeAgentOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FreeAgentPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFreeAgentPlugin['hooks'];
	webhookHooks?: InternalFreeAgentPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof freeAgentEndpointsNested>;
};

export type FreeAgentContext = CorsairPluginContext<
	typeof FreeAgentSchema,
	FreeAgentPluginOptions
>;

export type FreeAgentKeyBuilderContext = KeyBuilderContext<FreeAgentPluginOptions>;

export type FreeAgentBoundEndpoints = BindEndpoints<typeof freeAgentEndpointsNested>;

type FreeAgentEndpoint<
	K extends keyof FreeAgentEndpointOutputs,
> = CorsairEndpoint<
	FreeAgentContext,
	FreeAgentEndpointInputs[K],
	FreeAgentEndpointOutputs[K]
>;

export type FreeAgentEndpoints = {
	exampleGet: FreeAgentEndpoint<'exampleGet'>;
};

type FreeAgentWebhook<
	K extends keyof FreeAgentWebhookOutputs,
	TEvent,
> = CorsairWebhook<FreeAgentContext, TEvent, FreeAgentWebhookOutputs[K]>;

export type FreeAgentWebhooks = {
	example: FreeAgentWebhook<'example', ExampleEvent>;
};

export type FreeAgentBoundWebhooks = BindWebhooks<FreeAgentWebhooks>;

const freeAgentEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const freeAgentWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const freeAgentEndpointSchemas = {
	'example.get': {
		input: FreeAgentEndpointInputSchemas.exampleGet,
		output: FreeAgentEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof freeAgentEndpointsNested>;

const freeAgentWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof freeAgentWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const freeAgentEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof freeAgentEndpointsNested>;

export const freeAgentAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFreeAgentPlugin<T extends FreeAgentPluginOptions> = CorsairPlugin<
	'freeagent',
	typeof FreeAgentSchema,
	typeof freeAgentEndpointsNested,
	typeof freeAgentWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFreeAgentPlugin = BaseFreeAgentPlugin<FreeAgentPluginOptions>;

export type ExternalFreeAgentPlugin<T extends FreeAgentPluginOptions> =
	BaseFreeAgentPlugin<T>;

export function freeagent<const T extends FreeAgentPluginOptions>(
	incomingOptions: FreeAgentPluginOptions & T = {} as FreeAgentPluginOptions & T,
): ExternalFreeAgentPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'freeagent',
		authConfig: freeAgentAuthConfig,
		schema: FreeAgentSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: freeAgentEndpointsNested,
		webhooks: freeAgentWebhooksNested,
		endpointMeta: freeAgentEndpointMeta,
		endpointSchemas: freeAgentEndpointSchemas,
		webhookSchemas: freeAgentWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-freeagent-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFreeAgentTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFreeAgentOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FreeAgentKeyBuilderContext, source) => {
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
	} satisfies InternalFreeAgentPlugin;
}

export type {
	ExampleEvent,
	FreeAgentWebhookOutputs,
} from './webhooks/types';

export type {
	FreeAgentEndpointInputs,
	FreeAgentEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
