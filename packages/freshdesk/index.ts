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
import type { FreshdeskEndpointInputs, FreshdeskEndpointOutputs } from './endpoints/types';
import { FreshdeskEndpointInputSchemas, FreshdeskEndpointOutputSchemas } from './endpoints/types';
import type {
	FreshdeskWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FreshdeskSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFreshdeskTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFreshdeskOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FreshdeskPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFreshdeskPlugin['hooks'];
	webhookHooks?: InternalFreshdeskPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof freshdeskEndpointsNested>;
};

export type FreshdeskContext = CorsairPluginContext<
	typeof FreshdeskSchema,
	FreshdeskPluginOptions
>;

export type FreshdeskKeyBuilderContext = KeyBuilderContext<FreshdeskPluginOptions>;

export type FreshdeskBoundEndpoints = BindEndpoints<typeof freshdeskEndpointsNested>;

type FreshdeskEndpoint<
	K extends keyof FreshdeskEndpointOutputs,
> = CorsairEndpoint<
	FreshdeskContext,
	FreshdeskEndpointInputs[K],
	FreshdeskEndpointOutputs[K]
>;

export type FreshdeskEndpoints = {
	exampleGet: FreshdeskEndpoint<'exampleGet'>;
};

type FreshdeskWebhook<
	K extends keyof FreshdeskWebhookOutputs,
	TEvent,
> = CorsairWebhook<FreshdeskContext, TEvent, FreshdeskWebhookOutputs[K]>;

export type FreshdeskWebhooks = {
	example: FreshdeskWebhook<'example', ExampleEvent>;
};

export type FreshdeskBoundWebhooks = BindWebhooks<FreshdeskWebhooks>;

const freshdeskEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const freshdeskWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const freshdeskEndpointSchemas = {
	'example.get': {
		input: FreshdeskEndpointInputSchemas.exampleGet,
		output: FreshdeskEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof freshdeskEndpointsNested>;

const freshdeskWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof freshdeskWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const freshdeskEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof freshdeskEndpointsNested>;

export const freshdeskAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFreshdeskPlugin<T extends FreshdeskPluginOptions> = CorsairPlugin<
	'freshdesk',
	typeof FreshdeskSchema,
	typeof freshdeskEndpointsNested,
	typeof freshdeskWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFreshdeskPlugin = BaseFreshdeskPlugin<FreshdeskPluginOptions>;

export type ExternalFreshdeskPlugin<T extends FreshdeskPluginOptions> =
	BaseFreshdeskPlugin<T>;

export function freshdesk<const T extends FreshdeskPluginOptions>(
	incomingOptions: FreshdeskPluginOptions & T = {} as FreshdeskPluginOptions & T,
): ExternalFreshdeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'freshdesk',
		authConfig: freshdeskAuthConfig,
		schema: FreshdeskSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: freshdeskEndpointsNested,
		webhooks: freshdeskWebhooksNested,
		endpointMeta: freshdeskEndpointMeta,
		endpointSchemas: freshdeskEndpointSchemas,
		webhookSchemas: freshdeskWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-freshdesk-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFreshdeskTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFreshdeskOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FreshdeskKeyBuilderContext, source) => {
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
	} satisfies InternalFreshdeskPlugin;
}

export type {
	ExampleEvent,
	FreshdeskWebhookOutputs,
} from './webhooks/types';

export type {
	FreshdeskEndpointInputs,
	FreshdeskEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
