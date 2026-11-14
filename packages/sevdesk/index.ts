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
import type { SevdeskEndpointInputs, SevdeskEndpointOutputs } from './endpoints/types';
import { SevdeskEndpointInputSchemas, SevdeskEndpointOutputSchemas } from './endpoints/types';
import type {
	SevdeskWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { SevdeskSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchSevdeskTenantWebhook } from './webhooks/tenant-matcher';
import { resolveSevdeskOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type SevdeskPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSevdeskPlugin['hooks'];
	webhookHooks?: InternalSevdeskPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sevdeskEndpointsNested>;
};

export type SevdeskContext = CorsairPluginContext<
	typeof SevdeskSchema,
	SevdeskPluginOptions
>;

export type SevdeskKeyBuilderContext = KeyBuilderContext<SevdeskPluginOptions>;

export type SevdeskBoundEndpoints = BindEndpoints<typeof sevdeskEndpointsNested>;

type SevdeskEndpoint<
	K extends keyof SevdeskEndpointOutputs,
> = CorsairEndpoint<
	SevdeskContext,
	SevdeskEndpointInputs[K],
	SevdeskEndpointOutputs[K]
>;

export type SevdeskEndpoints = {
	exampleGet: SevdeskEndpoint<'exampleGet'>;
};

type SevdeskWebhook<
	K extends keyof SevdeskWebhookOutputs,
	TEvent,
> = CorsairWebhook<SevdeskContext, TEvent, SevdeskWebhookOutputs[K]>;

export type SevdeskWebhooks = {
	example: SevdeskWebhook<'example', ExampleEvent>;
};

export type SevdeskBoundWebhooks = BindWebhooks<SevdeskWebhooks>;

const sevdeskEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const sevdeskWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const sevdeskEndpointSchemas = {
	'example.get': {
		input: SevdeskEndpointInputSchemas.exampleGet,
		output: SevdeskEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof sevdeskEndpointsNested>;

const sevdeskWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof sevdeskWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const sevdeskEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof sevdeskEndpointsNested>;

export const sevdeskAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSevdeskPlugin<T extends SevdeskPluginOptions> = CorsairPlugin<
	'sevdesk',
	typeof SevdeskSchema,
	typeof sevdeskEndpointsNested,
	typeof sevdeskWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSevdeskPlugin = BaseSevdeskPlugin<SevdeskPluginOptions>;

export type ExternalSevdeskPlugin<T extends SevdeskPluginOptions> =
	BaseSevdeskPlugin<T>;

export function sevdesk<const T extends SevdeskPluginOptions>(
	incomingOptions: SevdeskPluginOptions & T = {} as SevdeskPluginOptions & T,
): ExternalSevdeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sevdesk',
		authConfig: sevdeskAuthConfig,
		schema: SevdeskSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: sevdeskEndpointsNested,
		webhooks: sevdeskWebhooksNested,
		endpointMeta: sevdeskEndpointMeta,
		endpointSchemas: sevdeskEndpointSchemas,
		webhookSchemas: sevdeskWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-sevdesk-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchSevdeskTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveSevdeskOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SevdeskKeyBuilderContext, source) => {
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
	} satisfies InternalSevdeskPlugin;
}

export type {
	ExampleEvent,
	SevdeskWebhookOutputs,
} from './webhooks/types';

export type {
	SevdeskEndpointInputs,
	SevdeskEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
