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
import type { BoxheroEndpointInputs, BoxheroEndpointOutputs } from './endpoints/types';
import { BoxheroEndpointInputSchemas, BoxheroEndpointOutputSchemas } from './endpoints/types';
import type {
	BoxheroWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { BoxheroSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchBoxheroTenantWebhook } from './webhooks/tenant-matcher';
import { resolveBoxheroOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type BoxheroPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBoxheroPlugin['hooks'];
	webhookHooks?: InternalBoxheroPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boxheroEndpointsNested>;
};

export type BoxheroContext = CorsairPluginContext<
	typeof BoxheroSchema,
	BoxheroPluginOptions
>;

export type BoxheroKeyBuilderContext = KeyBuilderContext<BoxheroPluginOptions>;

export type BoxheroBoundEndpoints = BindEndpoints<typeof boxheroEndpointsNested>;

type BoxheroEndpoint<
	K extends keyof BoxheroEndpointOutputs,
> = CorsairEndpoint<
	BoxheroContext,
	BoxheroEndpointInputs[K],
	BoxheroEndpointOutputs[K]
>;

export type BoxheroEndpoints = {
	exampleGet: BoxheroEndpoint<'exampleGet'>;
};

type BoxheroWebhook<
	K extends keyof BoxheroWebhookOutputs,
	TEvent,
> = CorsairWebhook<BoxheroContext, TEvent, BoxheroWebhookOutputs[K]>;

export type BoxheroWebhooks = {
	example: BoxheroWebhook<'example', ExampleEvent>;
};

export type BoxheroBoundWebhooks = BindWebhooks<BoxheroWebhooks>;

const boxheroEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const boxheroWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const boxheroEndpointSchemas = {
	'example.get': {
		input: BoxheroEndpointInputSchemas.exampleGet,
		output: BoxheroEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof boxheroEndpointsNested>;

const boxheroWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof boxheroWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const boxheroEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof boxheroEndpointsNested>;

export const boxheroAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBoxheroPlugin<T extends BoxheroPluginOptions> = CorsairPlugin<
	'boxhero',
	typeof BoxheroSchema,
	typeof boxheroEndpointsNested,
	typeof boxheroWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBoxheroPlugin = BaseBoxheroPlugin<BoxheroPluginOptions>;

export type ExternalBoxheroPlugin<T extends BoxheroPluginOptions> =
	BaseBoxheroPlugin<T>;

export function boxhero<const T extends BoxheroPluginOptions>(
	incomingOptions: BoxheroPluginOptions & T = {} as BoxheroPluginOptions & T,
): ExternalBoxheroPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'boxhero',
		authConfig: boxheroAuthConfig,
		schema: BoxheroSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: boxheroEndpointsNested,
		webhooks: boxheroWebhooksNested,
		endpointMeta: boxheroEndpointMeta,
		endpointSchemas: boxheroEndpointSchemas,
		webhookSchemas: boxheroWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-boxhero-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBoxheroTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBoxheroOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoxheroKeyBuilderContext, source) => {
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
	} satisfies InternalBoxheroPlugin;
}

export type {
	ExampleEvent,
	BoxheroWebhookOutputs,
} from './webhooks/types';

export type {
	BoxheroEndpointInputs,
	BoxheroEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
