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
import type { FolkEndpointInputs, FolkEndpointOutputs } from './endpoints/types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './endpoints/types';
import type {
	FolkWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FolkSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFolkTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFolkOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FolkPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFolkPlugin['hooks'];
	webhookHooks?: InternalFolkPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof folkEndpointsNested>;
};

export type FolkContext = CorsairPluginContext<
	typeof FolkSchema,
	FolkPluginOptions
>;

export type FolkKeyBuilderContext = KeyBuilderContext<FolkPluginOptions>;

export type FolkBoundEndpoints = BindEndpoints<typeof folkEndpointsNested>;

type FolkEndpoint<
	K extends keyof FolkEndpointOutputs,
> = CorsairEndpoint<
	FolkContext,
	FolkEndpointInputs[K],
	FolkEndpointOutputs[K]
>;

export type FolkEndpoints = {
	exampleGet: FolkEndpoint<'exampleGet'>;
};

type FolkWebhook<
	K extends keyof FolkWebhookOutputs,
	TEvent,
> = CorsairWebhook<FolkContext, TEvent, FolkWebhookOutputs[K]>;

export type FolkWebhooks = {
	example: FolkWebhook<'example', ExampleEvent>;
};

export type FolkBoundWebhooks = BindWebhooks<FolkWebhooks>;

const folkEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const folkWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const folkEndpointSchemas = {
	'example.get': {
		input: FolkEndpointInputSchemas.exampleGet,
		output: FolkEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof folkEndpointsNested>;

const folkWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof folkWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const folkEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof folkEndpointsNested>;

export const folkAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFolkPlugin<T extends FolkPluginOptions> = CorsairPlugin<
	'folk',
	typeof FolkSchema,
	typeof folkEndpointsNested,
	typeof folkWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFolkPlugin = BaseFolkPlugin<FolkPluginOptions>;

export type ExternalFolkPlugin<T extends FolkPluginOptions> =
	BaseFolkPlugin<T>;

export function folk<const T extends FolkPluginOptions>(
	incomingOptions: FolkPluginOptions & T = {} as FolkPluginOptions & T,
): ExternalFolkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'folk',
		authConfig: folkAuthConfig,
		schema: FolkSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: folkEndpointsNested,
		webhooks: folkWebhooksNested,
		endpointMeta: folkEndpointMeta,
		endpointSchemas: folkEndpointSchemas,
		webhookSchemas: folkWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-folk-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFolkTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFolkOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FolkKeyBuilderContext, source) => {
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
	} satisfies InternalFolkPlugin;
}

export type {
	ExampleEvent,
	FolkWebhookOutputs,
} from './webhooks/types';

export type {
	FolkEndpointInputs,
	FolkEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
