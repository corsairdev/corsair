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
import type { FeltEndpointInputs, FeltEndpointOutputs } from './endpoints/types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './endpoints/types';
import type {
	FeltWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FeltSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFeltTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFeltOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FeltPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFeltPlugin['hooks'];
	webhookHooks?: InternalFeltPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof feltEndpointsNested>;
};

export type FeltContext = CorsairPluginContext<
	typeof FeltSchema,
	FeltPluginOptions
>;

export type FeltKeyBuilderContext = KeyBuilderContext<FeltPluginOptions>;

export type FeltBoundEndpoints = BindEndpoints<typeof feltEndpointsNested>;

type FeltEndpoint<
	K extends keyof FeltEndpointOutputs,
> = CorsairEndpoint<
	FeltContext,
	FeltEndpointInputs[K],
	FeltEndpointOutputs[K]
>;

export type FeltEndpoints = {
	exampleGet: FeltEndpoint<'exampleGet'>;
};

type FeltWebhook<
	K extends keyof FeltWebhookOutputs,
	TEvent,
> = CorsairWebhook<FeltContext, TEvent, FeltWebhookOutputs[K]>;

export type FeltWebhooks = {
	example: FeltWebhook<'example', ExampleEvent>;
};

export type FeltBoundWebhooks = BindWebhooks<FeltWebhooks>;

const feltEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const feltWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const feltEndpointSchemas = {
	'example.get': {
		input: FeltEndpointInputSchemas.exampleGet,
		output: FeltEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof feltEndpointsNested>;

const feltWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof feltWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const feltEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof feltEndpointsNested>;

export const feltAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFeltPlugin<T extends FeltPluginOptions> = CorsairPlugin<
	'felt',
	typeof FeltSchema,
	typeof feltEndpointsNested,
	typeof feltWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFeltPlugin = BaseFeltPlugin<FeltPluginOptions>;

export type ExternalFeltPlugin<T extends FeltPluginOptions> =
	BaseFeltPlugin<T>;

export function felt<const T extends FeltPluginOptions>(
	incomingOptions: FeltPluginOptions & T = {} as FeltPluginOptions & T,
): ExternalFeltPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'felt',
		authConfig: feltAuthConfig,
		schema: FeltSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: feltEndpointsNested,
		webhooks: feltWebhooksNested,
		endpointMeta: feltEndpointMeta,
		endpointSchemas: feltEndpointSchemas,
		webhookSchemas: feltWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-felt-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFeltTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFeltOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FeltKeyBuilderContext, source) => {
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
	} satisfies InternalFeltPlugin;
}

export type {
	ExampleEvent,
	FeltWebhookOutputs,
} from './webhooks/types';

export type {
	FeltEndpointInputs,
	FeltEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
