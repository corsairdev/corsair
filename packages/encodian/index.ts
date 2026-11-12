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
import type { EncodianEndpointInputs, EncodianEndpointOutputs } from './endpoints/types';
import { EncodianEndpointInputSchemas, EncodianEndpointOutputSchemas } from './endpoints/types';
import type {
	EncodianWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { EncodianSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchEncodianTenantWebhook } from './webhooks/tenant-matcher';
import { resolveEncodianOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type EncodianPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalEncodianPlugin['hooks'];
	webhookHooks?: InternalEncodianPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof encodianEndpointsNested>;
};

export type EncodianContext = CorsairPluginContext<
	typeof EncodianSchema,
	EncodianPluginOptions
>;

export type EncodianKeyBuilderContext = KeyBuilderContext<EncodianPluginOptions>;

export type EncodianBoundEndpoints = BindEndpoints<typeof encodianEndpointsNested>;

type EncodianEndpoint<
	K extends keyof EncodianEndpointOutputs,
> = CorsairEndpoint<
	EncodianContext,
	EncodianEndpointInputs[K],
	EncodianEndpointOutputs[K]
>;

export type EncodianEndpoints = {
	exampleGet: EncodianEndpoint<'exampleGet'>;
};

type EncodianWebhook<
	K extends keyof EncodianWebhookOutputs,
	TEvent,
> = CorsairWebhook<EncodianContext, TEvent, EncodianWebhookOutputs[K]>;

export type EncodianWebhooks = {
	example: EncodianWebhook<'example', ExampleEvent>;
};

export type EncodianBoundWebhooks = BindWebhooks<EncodianWebhooks>;

const encodianEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const encodianWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const encodianEndpointSchemas = {
	'example.get': {
		input: EncodianEndpointInputSchemas.exampleGet,
		output: EncodianEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof encodianEndpointsNested>;

const encodianWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof encodianWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const encodianEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof encodianEndpointsNested>;

export const encodianAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEncodianPlugin<T extends EncodianPluginOptions> = CorsairPlugin<
	'encodian',
	typeof EncodianSchema,
	typeof encodianEndpointsNested,
	typeof encodianWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEncodianPlugin = BaseEncodianPlugin<EncodianPluginOptions>;

export type ExternalEncodianPlugin<T extends EncodianPluginOptions> =
	BaseEncodianPlugin<T>;

export function encodian<const T extends EncodianPluginOptions>(
	incomingOptions: EncodianPluginOptions & T = {} as EncodianPluginOptions & T,
): ExternalEncodianPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'encodian',
		authConfig: encodianAuthConfig,
		schema: EncodianSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: encodianEndpointsNested,
		webhooks: encodianWebhooksNested,
		endpointMeta: encodianEndpointMeta,
		endpointSchemas: encodianEndpointSchemas,
		webhookSchemas: encodianWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-encodian-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchEncodianTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveEncodianOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EncodianKeyBuilderContext, source) => {
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
	} satisfies InternalEncodianPlugin;
}

export type {
	ExampleEvent,
	EncodianWebhookOutputs,
} from './webhooks/types';

export type {
	EncodianEndpointInputs,
	EncodianEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
