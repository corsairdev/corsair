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
import type { AnthropicAdministratorEndpointInputs, AnthropicAdministratorEndpointOutputs } from './endpoints/types';
import { AnthropicAdministratorEndpointInputSchemas, AnthropicAdministratorEndpointOutputSchemas } from './endpoints/types';
import type {
	AnthropicAdministratorWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { AnthropicAdministratorSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchAnthropicAdministratorTenantWebhook } from './webhooks/tenant-matcher';
import { resolveAnthropicAdministratorOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type AnthropicAdministratorPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAnthropicAdministratorPlugin['hooks'];
	webhookHooks?: InternalAnthropicAdministratorPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof anthropicAdministratorEndpointsNested>;
};

export type AnthropicAdministratorContext = CorsairPluginContext<
	typeof AnthropicAdministratorSchema,
	AnthropicAdministratorPluginOptions
>;

export type AnthropicAdministratorKeyBuilderContext = KeyBuilderContext<AnthropicAdministratorPluginOptions>;

export type AnthropicAdministratorBoundEndpoints = BindEndpoints<typeof anthropicAdministratorEndpointsNested>;

type AnthropicAdministratorEndpoint<
	K extends keyof AnthropicAdministratorEndpointOutputs,
> = CorsairEndpoint<
	AnthropicAdministratorContext,
	AnthropicAdministratorEndpointInputs[K],
	AnthropicAdministratorEndpointOutputs[K]
>;

export type AnthropicAdministratorEndpoints = {
	exampleGet: AnthropicAdministratorEndpoint<'exampleGet'>;
};

type AnthropicAdministratorWebhook<
	K extends keyof AnthropicAdministratorWebhookOutputs,
	TEvent,
> = CorsairWebhook<AnthropicAdministratorContext, TEvent, AnthropicAdministratorWebhookOutputs[K]>;

export type AnthropicAdministratorWebhooks = {
	example: AnthropicAdministratorWebhook<'example', ExampleEvent>;
};

export type AnthropicAdministratorBoundWebhooks = BindWebhooks<AnthropicAdministratorWebhooks>;

const anthropicAdministratorEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const anthropicAdministratorWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const anthropicAdministratorEndpointSchemas = {
	'example.get': {
		input: AnthropicAdministratorEndpointInputSchemas.exampleGet,
		output: AnthropicAdministratorEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof anthropicAdministratorEndpointsNested>;

const anthropicAdministratorWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof anthropicAdministratorWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const anthropicAdministratorEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof anthropicAdministratorEndpointsNested>;

export const anthropicAdministratorAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAnthropicAdministratorPlugin<T extends AnthropicAdministratorPluginOptions> = CorsairPlugin<
	'anthropicadministrator',
	typeof AnthropicAdministratorSchema,
	typeof anthropicAdministratorEndpointsNested,
	typeof anthropicAdministratorWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAnthropicAdministratorPlugin = BaseAnthropicAdministratorPlugin<AnthropicAdministratorPluginOptions>;

export type ExternalAnthropicAdministratorPlugin<T extends AnthropicAdministratorPluginOptions> =
	BaseAnthropicAdministratorPlugin<T>;

export function anthropicadministrator<const T extends AnthropicAdministratorPluginOptions>(
	incomingOptions: AnthropicAdministratorPluginOptions & T = {} as AnthropicAdministratorPluginOptions & T,
): ExternalAnthropicAdministratorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'anthropicadministrator',
		authConfig: anthropicAdministratorAuthConfig,
		schema: AnthropicAdministratorSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: anthropicAdministratorEndpointsNested,
		webhooks: anthropicAdministratorWebhooksNested,
		endpointMeta: anthropicAdministratorEndpointMeta,
		endpointSchemas: anthropicAdministratorEndpointSchemas,
		webhookSchemas: anthropicAdministratorWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-anthropicadministrator-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAnthropicAdministratorTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAnthropicAdministratorOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AnthropicAdministratorKeyBuilderContext, source) => {
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
	} satisfies InternalAnthropicAdministratorPlugin;
}

export type {
	ExampleEvent,
	AnthropicAdministratorWebhookOutputs,
} from './webhooks/types';

export type {
	AnthropicAdministratorEndpointInputs,
	AnthropicAdministratorEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
