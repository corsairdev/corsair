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
import type { ZohoBooksEndpointInputs, ZohoBooksEndpointOutputs } from './endpoints/types';
import { ZohoBooksEndpointInputSchemas, ZohoBooksEndpointOutputSchemas } from './endpoints/types';
import type {
	ZohoBooksWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ZohoBooksSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchZohoBooksTenantWebhook } from './webhooks/tenant-matcher';
import { resolveZohoBooksOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ZohoBooksPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalZohoBooksPlugin['hooks'];
	webhookHooks?: InternalZohoBooksPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zohoBooksEndpointsNested>;
};

export type ZohoBooksContext = CorsairPluginContext<
	typeof ZohoBooksSchema,
	ZohoBooksPluginOptions
>;

export type ZohoBooksKeyBuilderContext = KeyBuilderContext<ZohoBooksPluginOptions>;

export type ZohoBooksBoundEndpoints = BindEndpoints<typeof zohoBooksEndpointsNested>;

type ZohoBooksEndpoint<
	K extends keyof ZohoBooksEndpointOutputs,
> = CorsairEndpoint<
	ZohoBooksContext,
	ZohoBooksEndpointInputs[K],
	ZohoBooksEndpointOutputs[K]
>;

export type ZohoBooksEndpoints = {
	exampleGet: ZohoBooksEndpoint<'exampleGet'>;
};

type ZohoBooksWebhook<
	K extends keyof ZohoBooksWebhookOutputs,
	TEvent,
> = CorsairWebhook<ZohoBooksContext, TEvent, ZohoBooksWebhookOutputs[K]>;

export type ZohoBooksWebhooks = {
	example: ZohoBooksWebhook<'example', ExampleEvent>;
};

export type ZohoBooksBoundWebhooks = BindWebhooks<ZohoBooksWebhooks>;

const zohoBooksEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const zohoBooksWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const zohoBooksEndpointSchemas = {
	'example.get': {
		input: ZohoBooksEndpointInputSchemas.exampleGet,
		output: ZohoBooksEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof zohoBooksEndpointsNested>;

const zohoBooksWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof zohoBooksWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const zohoBooksEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zohoBooksEndpointsNested>;

export const zohoBooksAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseZohoBooksPlugin<T extends ZohoBooksPluginOptions> = CorsairPlugin<
	'zohobooks',
	typeof ZohoBooksSchema,
	typeof zohoBooksEndpointsNested,
	typeof zohoBooksWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalZohoBooksPlugin = BaseZohoBooksPlugin<ZohoBooksPluginOptions>;

export type ExternalZohoBooksPlugin<T extends ZohoBooksPluginOptions> =
	BaseZohoBooksPlugin<T>;

export function zohobooks<const T extends ZohoBooksPluginOptions>(
	incomingOptions: ZohoBooksPluginOptions & T = {} as ZohoBooksPluginOptions & T,
): ExternalZohoBooksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zohobooks',
		authConfig: zohoBooksAuthConfig,
		schema: ZohoBooksSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zohoBooksEndpointsNested,
		webhooks: zohoBooksWebhooksNested,
		endpointMeta: zohoBooksEndpointMeta,
		endpointSchemas: zohoBooksEndpointSchemas,
		webhookSchemas: zohoBooksWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-zohobooks-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchZohoBooksTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveZohoBooksOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZohoBooksKeyBuilderContext, source) => {
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
	} satisfies InternalZohoBooksPlugin;
}

export type {
	ExampleEvent,
	ZohoBooksWebhookOutputs,
} from './webhooks/types';

export type {
	ZohoBooksEndpointInputs,
	ZohoBooksEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
