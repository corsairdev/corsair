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
import type { FingertipEndpointInputs, FingertipEndpointOutputs } from './endpoints/types';
import { FingertipEndpointInputSchemas, FingertipEndpointOutputSchemas } from './endpoints/types';
import type {
	FingertipWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FingertipSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFingertipTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFingertipOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FingertipPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFingertipPlugin['hooks'];
	webhookHooks?: InternalFingertipPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fingertipEndpointsNested>;
};

export type FingertipContext = CorsairPluginContext<
	typeof FingertipSchema,
	FingertipPluginOptions
>;

export type FingertipKeyBuilderContext = KeyBuilderContext<FingertipPluginOptions>;

export type FingertipBoundEndpoints = BindEndpoints<typeof fingertipEndpointsNested>;

type FingertipEndpoint<
	K extends keyof FingertipEndpointOutputs,
> = CorsairEndpoint<
	FingertipContext,
	FingertipEndpointInputs[K],
	FingertipEndpointOutputs[K]
>;

export type FingertipEndpoints = {
	exampleGet: FingertipEndpoint<'exampleGet'>;
};

type FingertipWebhook<
	K extends keyof FingertipWebhookOutputs,
	TEvent,
> = CorsairWebhook<FingertipContext, TEvent, FingertipWebhookOutputs[K]>;

export type FingertipWebhooks = {
	example: FingertipWebhook<'example', ExampleEvent>;
};

export type FingertipBoundWebhooks = BindWebhooks<FingertipWebhooks>;

const fingertipEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const fingertipWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const fingertipEndpointSchemas = {
	'example.get': {
		input: FingertipEndpointInputSchemas.exampleGet,
		output: FingertipEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fingertipEndpointsNested>;

const fingertipWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof fingertipWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fingertipEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fingertipEndpointsNested>;

export const fingertipAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFingertipPlugin<T extends FingertipPluginOptions> = CorsairPlugin<
	'fingertip',
	typeof FingertipSchema,
	typeof fingertipEndpointsNested,
	typeof fingertipWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFingertipPlugin = BaseFingertipPlugin<FingertipPluginOptions>;

export type ExternalFingertipPlugin<T extends FingertipPluginOptions> =
	BaseFingertipPlugin<T>;

export function fingertip<const T extends FingertipPluginOptions>(
	incomingOptions: FingertipPluginOptions & T = {} as FingertipPluginOptions & T,
): ExternalFingertipPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fingertip',
		authConfig: fingertipAuthConfig,
		schema: FingertipSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: fingertipEndpointsNested,
		webhooks: fingertipWebhooksNested,
		endpointMeta: fingertipEndpointMeta,
		endpointSchemas: fingertipEndpointSchemas,
		webhookSchemas: fingertipWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-fingertip-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFingertipTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFingertipOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FingertipKeyBuilderContext, source) => {
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
	} satisfies InternalFingertipPlugin;
}

export type {
	ExampleEvent,
	FingertipWebhookOutputs,
} from './webhooks/types';

export type {
	FingertipEndpointInputs,
	FingertipEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
