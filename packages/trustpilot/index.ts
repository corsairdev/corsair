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
import type { TrustpilotEndpointInputs, TrustpilotEndpointOutputs } from './endpoints/types';
import { TrustpilotEndpointInputSchemas, TrustpilotEndpointOutputSchemas } from './endpoints/types';
import type {
	TrustpilotWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { TrustpilotSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchTrustpilotTenantWebhook } from './webhooks/tenant-matcher';
import { resolveTrustpilotOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type TrustpilotPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTrustpilotPlugin['hooks'];
	webhookHooks?: InternalTrustpilotPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof trustpilotEndpointsNested>;
};

export type TrustpilotContext = CorsairPluginContext<
	typeof TrustpilotSchema,
	TrustpilotPluginOptions
>;

export type TrustpilotKeyBuilderContext = KeyBuilderContext<TrustpilotPluginOptions>;

export type TrustpilotBoundEndpoints = BindEndpoints<typeof trustpilotEndpointsNested>;

type TrustpilotEndpoint<
	K extends keyof TrustpilotEndpointOutputs,
> = CorsairEndpoint<
	TrustpilotContext,
	TrustpilotEndpointInputs[K],
	TrustpilotEndpointOutputs[K]
>;

export type TrustpilotEndpoints = {
	exampleGet: TrustpilotEndpoint<'exampleGet'>;
};

type TrustpilotWebhook<
	K extends keyof TrustpilotWebhookOutputs,
	TEvent,
> = CorsairWebhook<TrustpilotContext, TEvent, TrustpilotWebhookOutputs[K]>;

export type TrustpilotWebhooks = {
	example: TrustpilotWebhook<'example', ExampleEvent>;
};

export type TrustpilotBoundWebhooks = BindWebhooks<TrustpilotWebhooks>;

const trustpilotEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const trustpilotWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const trustpilotEndpointSchemas = {
	'example.get': {
		input: TrustpilotEndpointInputSchemas.exampleGet,
		output: TrustpilotEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof trustpilotEndpointsNested>;

const trustpilotWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof trustpilotWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const trustpilotEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof trustpilotEndpointsNested>;

export const trustpilotAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTrustpilotPlugin<T extends TrustpilotPluginOptions> = CorsairPlugin<
	'trustpilot',
	typeof TrustpilotSchema,
	typeof trustpilotEndpointsNested,
	typeof trustpilotWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTrustpilotPlugin = BaseTrustpilotPlugin<TrustpilotPluginOptions>;

export type ExternalTrustpilotPlugin<T extends TrustpilotPluginOptions> =
	BaseTrustpilotPlugin<T>;

export function trustpilot<const T extends TrustpilotPluginOptions>(
	incomingOptions: TrustpilotPluginOptions & T = {} as TrustpilotPluginOptions & T,
): ExternalTrustpilotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'trustpilot',
		authConfig: trustpilotAuthConfig,
		schema: TrustpilotSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: trustpilotEndpointsNested,
		webhooks: trustpilotWebhooksNested,
		endpointMeta: trustpilotEndpointMeta,
		endpointSchemas: trustpilotEndpointSchemas,
		webhookSchemas: trustpilotWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-trustpilot-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTrustpilotTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTrustpilotOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TrustpilotKeyBuilderContext, source) => {
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
	} satisfies InternalTrustpilotPlugin;
}

export type {
	ExampleEvent,
	TrustpilotWebhookOutputs,
} from './webhooks/types';

export type {
	TrustpilotEndpointInputs,
	TrustpilotEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
