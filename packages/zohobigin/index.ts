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
import type { ZohoBiginEndpointInputs, ZohoBiginEndpointOutputs } from './endpoints/types';
import { ZohoBiginEndpointInputSchemas, ZohoBiginEndpointOutputSchemas } from './endpoints/types';
import type {
	ZohoBiginWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ZohoBiginSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchZohoBiginTenantWebhook } from './webhooks/tenant-matcher';
import { resolveZohoBiginOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ZohoBiginPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalZohoBiginPlugin['hooks'];
	webhookHooks?: InternalZohoBiginPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zohoBiginEndpointsNested>;
};

export type ZohoBiginContext = CorsairPluginContext<
	typeof ZohoBiginSchema,
	ZohoBiginPluginOptions
>;

export type ZohoBiginKeyBuilderContext = KeyBuilderContext<ZohoBiginPluginOptions>;

export type ZohoBiginBoundEndpoints = BindEndpoints<typeof zohoBiginEndpointsNested>;

type ZohoBiginEndpoint<
	K extends keyof ZohoBiginEndpointOutputs,
> = CorsairEndpoint<
	ZohoBiginContext,
	ZohoBiginEndpointInputs[K],
	ZohoBiginEndpointOutputs[K]
>;

export type ZohoBiginEndpoints = {
	exampleGet: ZohoBiginEndpoint<'exampleGet'>;
};

type ZohoBiginWebhook<
	K extends keyof ZohoBiginWebhookOutputs,
	TEvent,
> = CorsairWebhook<ZohoBiginContext, TEvent, ZohoBiginWebhookOutputs[K]>;

export type ZohoBiginWebhooks = {
	example: ZohoBiginWebhook<'example', ExampleEvent>;
};

export type ZohoBiginBoundWebhooks = BindWebhooks<ZohoBiginWebhooks>;

const zohoBiginEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const zohoBiginWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const zohoBiginEndpointSchemas = {
	'example.get': {
		input: ZohoBiginEndpointInputSchemas.exampleGet,
		output: ZohoBiginEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof zohoBiginEndpointsNested>;

const zohoBiginWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof zohoBiginWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const zohoBiginEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zohoBiginEndpointsNested>;

export const zohoBiginAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseZohoBiginPlugin<T extends ZohoBiginPluginOptions> = CorsairPlugin<
	'zohobigin',
	typeof ZohoBiginSchema,
	typeof zohoBiginEndpointsNested,
	typeof zohoBiginWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalZohoBiginPlugin = BaseZohoBiginPlugin<ZohoBiginPluginOptions>;

export type ExternalZohoBiginPlugin<T extends ZohoBiginPluginOptions> =
	BaseZohoBiginPlugin<T>;

export function zohobigin<const T extends ZohoBiginPluginOptions>(
	incomingOptions: ZohoBiginPluginOptions & T = {} as ZohoBiginPluginOptions & T,
): ExternalZohoBiginPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zohobigin',
		authConfig: zohoBiginAuthConfig,
		schema: ZohoBiginSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zohoBiginEndpointsNested,
		webhooks: zohoBiginWebhooksNested,
		endpointMeta: zohoBiginEndpointMeta,
		endpointSchemas: zohoBiginEndpointSchemas,
		webhookSchemas: zohoBiginWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-zohobigin-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchZohoBiginTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveZohoBiginOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZohoBiginKeyBuilderContext, source) => {
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
	} satisfies InternalZohoBiginPlugin;
}

export type {
	ExampleEvent,
	ZohoBiginWebhookOutputs,
} from './webhooks/types';

export type {
	ZohoBiginEndpointInputs,
	ZohoBiginEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
