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
import type { DovetailEndpointInputs, DovetailEndpointOutputs } from './endpoints/types';
import { DovetailEndpointInputSchemas, DovetailEndpointOutputSchemas } from './endpoints/types';
import type {
	DovetailWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { DovetailSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchDovetailTenantWebhook } from './webhooks/tenant-matcher';
import { resolveDovetailOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type DovetailPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDovetailPlugin['hooks'];
	webhookHooks?: InternalDovetailPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dovetailEndpointsNested>;
};

export type DovetailContext = CorsairPluginContext<
	typeof DovetailSchema,
	DovetailPluginOptions
>;

export type DovetailKeyBuilderContext = KeyBuilderContext<DovetailPluginOptions>;

export type DovetailBoundEndpoints = BindEndpoints<typeof dovetailEndpointsNested>;

type DovetailEndpoint<
	K extends keyof DovetailEndpointOutputs,
> = CorsairEndpoint<
	DovetailContext,
	DovetailEndpointInputs[K],
	DovetailEndpointOutputs[K]
>;

export type DovetailEndpoints = {
	exampleGet: DovetailEndpoint<'exampleGet'>;
};

type DovetailWebhook<
	K extends keyof DovetailWebhookOutputs,
	TEvent,
> = CorsairWebhook<DovetailContext, TEvent, DovetailWebhookOutputs[K]>;

export type DovetailWebhooks = {
	example: DovetailWebhook<'example', ExampleEvent>;
};

export type DovetailBoundWebhooks = BindWebhooks<DovetailWebhooks>;

const dovetailEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const dovetailWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const dovetailEndpointSchemas = {
	'example.get': {
		input: DovetailEndpointInputSchemas.exampleGet,
		output: DovetailEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof dovetailEndpointsNested>;

const dovetailWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof dovetailWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dovetailEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof dovetailEndpointsNested>;

export const dovetailAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDovetailPlugin<T extends DovetailPluginOptions> = CorsairPlugin<
	'dovetail',
	typeof DovetailSchema,
	typeof dovetailEndpointsNested,
	typeof dovetailWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDovetailPlugin = BaseDovetailPlugin<DovetailPluginOptions>;

export type ExternalDovetailPlugin<T extends DovetailPluginOptions> =
	BaseDovetailPlugin<T>;

export function dovetail<const T extends DovetailPluginOptions>(
	incomingOptions: DovetailPluginOptions & T = {} as DovetailPluginOptions & T,
): ExternalDovetailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dovetail',
		authConfig: dovetailAuthConfig,
		schema: DovetailSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dovetailEndpointsNested,
		webhooks: dovetailWebhooksNested,
		endpointMeta: dovetailEndpointMeta,
		endpointSchemas: dovetailEndpointSchemas,
		webhookSchemas: dovetailWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-dovetail-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDovetailTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDovetailOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DovetailKeyBuilderContext, source) => {
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
	} satisfies InternalDovetailPlugin;
}

export type {
	ExampleEvent,
	DovetailWebhookOutputs,
} from './webhooks/types';

export type {
	DovetailEndpointInputs,
	DovetailEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
