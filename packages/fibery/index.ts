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
import type { FiberyEndpointInputs, FiberyEndpointOutputs } from './endpoints/types';
import { FiberyEndpointInputSchemas, FiberyEndpointOutputSchemas } from './endpoints/types';
import type {
	FiberyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FiberySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFiberyTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFiberyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FiberyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFiberyPlugin['hooks'];
	webhookHooks?: InternalFiberyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fiberyEndpointsNested>;
};

export type FiberyContext = CorsairPluginContext<
	typeof FiberySchema,
	FiberyPluginOptions
>;

export type FiberyKeyBuilderContext = KeyBuilderContext<FiberyPluginOptions>;

export type FiberyBoundEndpoints = BindEndpoints<typeof fiberyEndpointsNested>;

type FiberyEndpoint<
	K extends keyof FiberyEndpointOutputs,
> = CorsairEndpoint<
	FiberyContext,
	FiberyEndpointInputs[K],
	FiberyEndpointOutputs[K]
>;

export type FiberyEndpoints = {
	exampleGet: FiberyEndpoint<'exampleGet'>;
};

type FiberyWebhook<
	K extends keyof FiberyWebhookOutputs,
	TEvent,
> = CorsairWebhook<FiberyContext, TEvent, FiberyWebhookOutputs[K]>;

export type FiberyWebhooks = {
	example: FiberyWebhook<'example', ExampleEvent>;
};

export type FiberyBoundWebhooks = BindWebhooks<FiberyWebhooks>;

const fiberyEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const fiberyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const fiberyEndpointSchemas = {
	'example.get': {
		input: FiberyEndpointInputSchemas.exampleGet,
		output: FiberyEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fiberyEndpointsNested>;

const fiberyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof fiberyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fiberyEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fiberyEndpointsNested>;

export const fiberyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFiberyPlugin<T extends FiberyPluginOptions> = CorsairPlugin<
	'fibery',
	typeof FiberySchema,
	typeof fiberyEndpointsNested,
	typeof fiberyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFiberyPlugin = BaseFiberyPlugin<FiberyPluginOptions>;

export type ExternalFiberyPlugin<T extends FiberyPluginOptions> =
	BaseFiberyPlugin<T>;

export function fibery<const T extends FiberyPluginOptions>(
	incomingOptions: FiberyPluginOptions & T = {} as FiberyPluginOptions & T,
): ExternalFiberyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fibery',
		authConfig: fiberyAuthConfig,
		schema: FiberySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: fiberyEndpointsNested,
		webhooks: fiberyWebhooksNested,
		endpointMeta: fiberyEndpointMeta,
		endpointSchemas: fiberyEndpointSchemas,
		webhookSchemas: fiberyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-fibery-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFiberyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFiberyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FiberyKeyBuilderContext, source) => {
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
	} satisfies InternalFiberyPlugin;
}

export type {
	ExampleEvent,
	FiberyWebhookOutputs,
} from './webhooks/types';

export type {
	FiberyEndpointInputs,
	FiberyEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
