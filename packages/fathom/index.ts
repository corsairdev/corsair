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
import type { FathomEndpointInputs, FathomEndpointOutputs } from './endpoints/types';
import { FathomEndpointInputSchemas, FathomEndpointOutputSchemas } from './endpoints/types';
import type {
	FathomWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FathomSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFathomTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFathomOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FathomPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFathomPlugin['hooks'];
	webhookHooks?: InternalFathomPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fathomEndpointsNested>;
};

export type FathomContext = CorsairPluginContext<
	typeof FathomSchema,
	FathomPluginOptions
>;

export type FathomKeyBuilderContext = KeyBuilderContext<FathomPluginOptions>;

export type FathomBoundEndpoints = BindEndpoints<typeof fathomEndpointsNested>;

type FathomEndpoint<
	K extends keyof FathomEndpointOutputs,
> = CorsairEndpoint<
	FathomContext,
	FathomEndpointInputs[K],
	FathomEndpointOutputs[K]
>;

export type FathomEndpoints = {
	exampleGet: FathomEndpoint<'exampleGet'>;
};

type FathomWebhook<
	K extends keyof FathomWebhookOutputs,
	TEvent,
> = CorsairWebhook<FathomContext, TEvent, FathomWebhookOutputs[K]>;

export type FathomWebhooks = {
	example: FathomWebhook<'example', ExampleEvent>;
};

export type FathomBoundWebhooks = BindWebhooks<FathomWebhooks>;

const fathomEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const fathomWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const fathomEndpointSchemas = {
	'example.get': {
		input: FathomEndpointInputSchemas.exampleGet,
		output: FathomEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fathomEndpointsNested>;

const fathomWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof fathomWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fathomEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fathomEndpointsNested>;

export const fathomAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFathomPlugin<T extends FathomPluginOptions> = CorsairPlugin<
	'fathom',
	typeof FathomSchema,
	typeof fathomEndpointsNested,
	typeof fathomWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFathomPlugin = BaseFathomPlugin<FathomPluginOptions>;

export type ExternalFathomPlugin<T extends FathomPluginOptions> =
	BaseFathomPlugin<T>;

export function fathom<const T extends FathomPluginOptions>(
	incomingOptions: FathomPluginOptions & T = {} as FathomPluginOptions & T,
): ExternalFathomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fathom',
		authConfig: fathomAuthConfig,
		schema: FathomSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: fathomEndpointsNested,
		webhooks: fathomWebhooksNested,
		endpointMeta: fathomEndpointMeta,
		endpointSchemas: fathomEndpointSchemas,
		webhookSchemas: fathomWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-fathom-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFathomTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFathomOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FathomKeyBuilderContext, source) => {
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
	} satisfies InternalFathomPlugin;
}

export type {
	ExampleEvent,
	FathomWebhookOutputs,
} from './webhooks/types';

export type {
	FathomEndpointInputs,
	FathomEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
