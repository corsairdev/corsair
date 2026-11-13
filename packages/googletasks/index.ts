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
import type { GoogleTasksEndpointInputs, GoogleTasksEndpointOutputs } from './endpoints/types';
import { GoogleTasksEndpointInputSchemas, GoogleTasksEndpointOutputSchemas } from './endpoints/types';
import type {
	GoogleTasksWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GoogleTasksSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGoogleTasksTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGoogleTasksOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GoogleTasksPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGoogleTasksPlugin['hooks'];
	webhookHooks?: InternalGoogleTasksPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleTasksEndpointsNested>;
};

export type GoogleTasksContext = CorsairPluginContext<
	typeof GoogleTasksSchema,
	GoogleTasksPluginOptions
>;

export type GoogleTasksKeyBuilderContext = KeyBuilderContext<GoogleTasksPluginOptions>;

export type GoogleTasksBoundEndpoints = BindEndpoints<typeof googleTasksEndpointsNested>;

type GoogleTasksEndpoint<
	K extends keyof GoogleTasksEndpointOutputs,
> = CorsairEndpoint<
	GoogleTasksContext,
	GoogleTasksEndpointInputs[K],
	GoogleTasksEndpointOutputs[K]
>;

export type GoogleTasksEndpoints = {
	exampleGet: GoogleTasksEndpoint<'exampleGet'>;
};

type GoogleTasksWebhook<
	K extends keyof GoogleTasksWebhookOutputs,
	TEvent,
> = CorsairWebhook<GoogleTasksContext, TEvent, GoogleTasksWebhookOutputs[K]>;

export type GoogleTasksWebhooks = {
	example: GoogleTasksWebhook<'example', ExampleEvent>;
};

export type GoogleTasksBoundWebhooks = BindWebhooks<GoogleTasksWebhooks>;

const googleTasksEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const googleTasksWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const googleTasksEndpointSchemas = {
	'example.get': {
		input: GoogleTasksEndpointInputSchemas.exampleGet,
		output: GoogleTasksEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof googleTasksEndpointsNested>;

const googleTasksWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof googleTasksWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const googleTasksEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof googleTasksEndpointsNested>;

export const googleTasksAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleTasksPlugin<T extends GoogleTasksPluginOptions> = CorsairPlugin<
	'googletasks',
	typeof GoogleTasksSchema,
	typeof googleTasksEndpointsNested,
	typeof googleTasksWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGoogleTasksPlugin = BaseGoogleTasksPlugin<GoogleTasksPluginOptions>;

export type ExternalGoogleTasksPlugin<T extends GoogleTasksPluginOptions> =
	BaseGoogleTasksPlugin<T>;

export function googletasks<const T extends GoogleTasksPluginOptions>(
	incomingOptions: GoogleTasksPluginOptions & T = {} as GoogleTasksPluginOptions & T,
): ExternalGoogleTasksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googletasks',
		authConfig: googleTasksAuthConfig,
		schema: GoogleTasksSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleTasksEndpointsNested,
		webhooks: googleTasksWebhooksNested,
		endpointMeta: googleTasksEndpointMeta,
		endpointSchemas: googleTasksEndpointSchemas,
		webhookSchemas: googleTasksWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-googletasks-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGoogleTasksTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGoogleTasksOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleTasksKeyBuilderContext, source) => {
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
	} satisfies InternalGoogleTasksPlugin;
}

export type {
	ExampleEvent,
	GoogleTasksWebhookOutputs,
} from './webhooks/types';

export type {
	GoogleTasksEndpointInputs,
	GoogleTasksEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
