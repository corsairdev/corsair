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
import type { GoSquaredEndpointInputs, GoSquaredEndpointOutputs } from './endpoints/types';
import { GoSquaredEndpointInputSchemas, GoSquaredEndpointOutputSchemas } from './endpoints/types';
import type {
	GoSquaredWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GoSquaredSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGoSquaredTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGoSquaredOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GoSquaredPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGoSquaredPlugin['hooks'];
	webhookHooks?: InternalGoSquaredPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof goSquaredEndpointsNested>;
};

export type GoSquaredContext = CorsairPluginContext<
	typeof GoSquaredSchema,
	GoSquaredPluginOptions
>;

export type GoSquaredKeyBuilderContext = KeyBuilderContext<GoSquaredPluginOptions>;

export type GoSquaredBoundEndpoints = BindEndpoints<typeof goSquaredEndpointsNested>;

type GoSquaredEndpoint<
	K extends keyof GoSquaredEndpointOutputs,
> = CorsairEndpoint<
	GoSquaredContext,
	GoSquaredEndpointInputs[K],
	GoSquaredEndpointOutputs[K]
>;

export type GoSquaredEndpoints = {
	exampleGet: GoSquaredEndpoint<'exampleGet'>;
};

type GoSquaredWebhook<
	K extends keyof GoSquaredWebhookOutputs,
	TEvent,
> = CorsairWebhook<GoSquaredContext, TEvent, GoSquaredWebhookOutputs[K]>;

export type GoSquaredWebhooks = {
	example: GoSquaredWebhook<'example', ExampleEvent>;
};

export type GoSquaredBoundWebhooks = BindWebhooks<GoSquaredWebhooks>;

const goSquaredEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const goSquaredWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const goSquaredEndpointSchemas = {
	'example.get': {
		input: GoSquaredEndpointInputSchemas.exampleGet,
		output: GoSquaredEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof goSquaredEndpointsNested>;

const goSquaredWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof goSquaredWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const goSquaredEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof goSquaredEndpointsNested>;

export const goSquaredAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoSquaredPlugin<T extends GoSquaredPluginOptions> = CorsairPlugin<
	'gosquared',
	typeof GoSquaredSchema,
	typeof goSquaredEndpointsNested,
	typeof goSquaredWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGoSquaredPlugin = BaseGoSquaredPlugin<GoSquaredPluginOptions>;

export type ExternalGoSquaredPlugin<T extends GoSquaredPluginOptions> =
	BaseGoSquaredPlugin<T>;

export function gosquared<const T extends GoSquaredPluginOptions>(
	incomingOptions: GoSquaredPluginOptions & T = {} as GoSquaredPluginOptions & T,
): ExternalGoSquaredPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gosquared',
		authConfig: goSquaredAuthConfig,
		schema: GoSquaredSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: goSquaredEndpointsNested,
		webhooks: goSquaredWebhooksNested,
		endpointMeta: goSquaredEndpointMeta,
		endpointSchemas: goSquaredEndpointSchemas,
		webhookSchemas: goSquaredWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-gosquared-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGoSquaredTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGoSquaredOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoSquaredKeyBuilderContext, source) => {
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
	} satisfies InternalGoSquaredPlugin;
}

export type {
	ExampleEvent,
	GoSquaredWebhookOutputs,
} from './webhooks/types';

export type {
	GoSquaredEndpointInputs,
	GoSquaredEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
