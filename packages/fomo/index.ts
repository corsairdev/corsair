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
import type { FomoEndpointInputs, FomoEndpointOutputs } from './endpoints/types';
import { FomoEndpointInputSchemas, FomoEndpointOutputSchemas } from './endpoints/types';
import type {
	FomoWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FomoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFomoTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFomoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FomoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFomoPlugin['hooks'];
	webhookHooks?: InternalFomoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fomoEndpointsNested>;
};

export type FomoContext = CorsairPluginContext<
	typeof FomoSchema,
	FomoPluginOptions
>;

export type FomoKeyBuilderContext = KeyBuilderContext<FomoPluginOptions>;

export type FomoBoundEndpoints = BindEndpoints<typeof fomoEndpointsNested>;

type FomoEndpoint<
	K extends keyof FomoEndpointOutputs,
> = CorsairEndpoint<
	FomoContext,
	FomoEndpointInputs[K],
	FomoEndpointOutputs[K]
>;

export type FomoEndpoints = {
	exampleGet: FomoEndpoint<'exampleGet'>;
};

type FomoWebhook<
	K extends keyof FomoWebhookOutputs,
	TEvent,
> = CorsairWebhook<FomoContext, TEvent, FomoWebhookOutputs[K]>;

export type FomoWebhooks = {
	example: FomoWebhook<'example', ExampleEvent>;
};

export type FomoBoundWebhooks = BindWebhooks<FomoWebhooks>;

const fomoEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const fomoWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const fomoEndpointSchemas = {
	'example.get': {
		input: FomoEndpointInputSchemas.exampleGet,
		output: FomoEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fomoEndpointsNested>;

const fomoWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof fomoWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fomoEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fomoEndpointsNested>;

export const fomoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFomoPlugin<T extends FomoPluginOptions> = CorsairPlugin<
	'fomo',
	typeof FomoSchema,
	typeof fomoEndpointsNested,
	typeof fomoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFomoPlugin = BaseFomoPlugin<FomoPluginOptions>;

export type ExternalFomoPlugin<T extends FomoPluginOptions> =
	BaseFomoPlugin<T>;

export function fomo<const T extends FomoPluginOptions>(
	incomingOptions: FomoPluginOptions & T = {} as FomoPluginOptions & T,
): ExternalFomoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fomo',
		authConfig: fomoAuthConfig,
		schema: FomoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: fomoEndpointsNested,
		webhooks: fomoWebhooksNested,
		endpointMeta: fomoEndpointMeta,
		endpointSchemas: fomoEndpointSchemas,
		webhookSchemas: fomoWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-fomo-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFomoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFomoOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FomoKeyBuilderContext, source) => {
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
	} satisfies InternalFomoPlugin;
}

export type {
	ExampleEvent,
	FomoWebhookOutputs,
} from './webhooks/types';

export type {
	FomoEndpointInputs,
	FomoEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
