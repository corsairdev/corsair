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
import type { FormdeskEndpointInputs, FormdeskEndpointOutputs } from './endpoints/types';
import { FormdeskEndpointInputSchemas, FormdeskEndpointOutputSchemas } from './endpoints/types';
import type {
	FormdeskWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FormdeskSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFormdeskTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFormdeskOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FormdeskPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFormdeskPlugin['hooks'];
	webhookHooks?: InternalFormdeskPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof formdeskEndpointsNested>;
};

export type FormdeskContext = CorsairPluginContext<
	typeof FormdeskSchema,
	FormdeskPluginOptions
>;

export type FormdeskKeyBuilderContext = KeyBuilderContext<FormdeskPluginOptions>;

export type FormdeskBoundEndpoints = BindEndpoints<typeof formdeskEndpointsNested>;

type FormdeskEndpoint<
	K extends keyof FormdeskEndpointOutputs,
> = CorsairEndpoint<
	FormdeskContext,
	FormdeskEndpointInputs[K],
	FormdeskEndpointOutputs[K]
>;

export type FormdeskEndpoints = {
	exampleGet: FormdeskEndpoint<'exampleGet'>;
};

type FormdeskWebhook<
	K extends keyof FormdeskWebhookOutputs,
	TEvent,
> = CorsairWebhook<FormdeskContext, TEvent, FormdeskWebhookOutputs[K]>;

export type FormdeskWebhooks = {
	example: FormdeskWebhook<'example', ExampleEvent>;
};

export type FormdeskBoundWebhooks = BindWebhooks<FormdeskWebhooks>;

const formdeskEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const formdeskWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const formdeskEndpointSchemas = {
	'example.get': {
		input: FormdeskEndpointInputSchemas.exampleGet,
		output: FormdeskEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof formdeskEndpointsNested>;

const formdeskWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof formdeskWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const formdeskEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof formdeskEndpointsNested>;

export const formdeskAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFormdeskPlugin<T extends FormdeskPluginOptions> = CorsairPlugin<
	'formdesk',
	typeof FormdeskSchema,
	typeof formdeskEndpointsNested,
	typeof formdeskWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFormdeskPlugin = BaseFormdeskPlugin<FormdeskPluginOptions>;

export type ExternalFormdeskPlugin<T extends FormdeskPluginOptions> =
	BaseFormdeskPlugin<T>;

export function formdesk<const T extends FormdeskPluginOptions>(
	incomingOptions: FormdeskPluginOptions & T = {} as FormdeskPluginOptions & T,
): ExternalFormdeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'formdesk',
		authConfig: formdeskAuthConfig,
		schema: FormdeskSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: formdeskEndpointsNested,
		webhooks: formdeskWebhooksNested,
		endpointMeta: formdeskEndpointMeta,
		endpointSchemas: formdeskEndpointSchemas,
		webhookSchemas: formdeskWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-formdesk-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFormdeskTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFormdeskOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FormdeskKeyBuilderContext, source) => {
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
	} satisfies InternalFormdeskPlugin;
}

export type {
	ExampleEvent,
	FormdeskWebhookOutputs,
} from './webhooks/types';

export type {
	FormdeskEndpointInputs,
	FormdeskEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
