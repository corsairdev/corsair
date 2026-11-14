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
import type { HubPlannerEndpointInputs, HubPlannerEndpointOutputs } from './endpoints/types';
import { HubPlannerEndpointInputSchemas, HubPlannerEndpointOutputSchemas } from './endpoints/types';
import type {
	HubPlannerWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { HubPlannerSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchHubPlannerTenantWebhook } from './webhooks/tenant-matcher';
import { resolveHubPlannerOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type HubPlannerPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHubPlannerPlugin['hooks'];
	webhookHooks?: InternalHubPlannerPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hubPlannerEndpointsNested>;
};

export type HubPlannerContext = CorsairPluginContext<
	typeof HubPlannerSchema,
	HubPlannerPluginOptions
>;

export type HubPlannerKeyBuilderContext = KeyBuilderContext<HubPlannerPluginOptions>;

export type HubPlannerBoundEndpoints = BindEndpoints<typeof hubPlannerEndpointsNested>;

type HubPlannerEndpoint<
	K extends keyof HubPlannerEndpointOutputs,
> = CorsairEndpoint<
	HubPlannerContext,
	HubPlannerEndpointInputs[K],
	HubPlannerEndpointOutputs[K]
>;

export type HubPlannerEndpoints = {
	exampleGet: HubPlannerEndpoint<'exampleGet'>;
};

type HubPlannerWebhook<
	K extends keyof HubPlannerWebhookOutputs,
	TEvent,
> = CorsairWebhook<HubPlannerContext, TEvent, HubPlannerWebhookOutputs[K]>;

export type HubPlannerWebhooks = {
	example: HubPlannerWebhook<'example', ExampleEvent>;
};

export type HubPlannerBoundWebhooks = BindWebhooks<HubPlannerWebhooks>;

const hubPlannerEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const hubPlannerWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const hubPlannerEndpointSchemas = {
	'example.get': {
		input: HubPlannerEndpointInputSchemas.exampleGet,
		output: HubPlannerEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof hubPlannerEndpointsNested>;

const hubPlannerWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof hubPlannerWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hubPlannerEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof hubPlannerEndpointsNested>;

export const hubPlannerAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHubPlannerPlugin<T extends HubPlannerPluginOptions> = CorsairPlugin<
	'hubplanner',
	typeof HubPlannerSchema,
	typeof hubPlannerEndpointsNested,
	typeof hubPlannerWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHubPlannerPlugin = BaseHubPlannerPlugin<HubPlannerPluginOptions>;

export type ExternalHubPlannerPlugin<T extends HubPlannerPluginOptions> =
	BaseHubPlannerPlugin<T>;

export function hubplanner<const T extends HubPlannerPluginOptions>(
	incomingOptions: HubPlannerPluginOptions & T = {} as HubPlannerPluginOptions & T,
): ExternalHubPlannerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hubplanner',
		authConfig: hubPlannerAuthConfig,
		schema: HubPlannerSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: hubPlannerEndpointsNested,
		webhooks: hubPlannerWebhooksNested,
		endpointMeta: hubPlannerEndpointMeta,
		endpointSchemas: hubPlannerEndpointSchemas,
		webhookSchemas: hubPlannerWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-hubplanner-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHubPlannerTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHubPlannerOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HubPlannerKeyBuilderContext, source) => {
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
	} satisfies InternalHubPlannerPlugin;
}

export type {
	ExampleEvent,
	HubPlannerWebhookOutputs,
} from './webhooks/types';

export type {
	HubPlannerEndpointInputs,
	HubPlannerEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
