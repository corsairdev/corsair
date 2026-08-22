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
import type { AnthropicAdminEndpointInputs, AnthropicAdminEndpointOutputs } from './endpoints/types';
import { AnthropicAdminEndpointInputSchemas, AnthropicAdminEndpointOutputSchemas } from './endpoints/types';
import type {
	AnthropicAdminWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Workspaces } from './endpoints';
import { AnthropicAdminSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchAnthropicAdminTenantWebhook } from './webhooks/tenant-matcher';
import { resolveAnthropicAdminOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type AnthropicAdminPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAnthropicAdminPlugin['hooks'];
	webhookHooks?: InternalAnthropicAdminPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof anthropicAdminEndpointsNested>;
};

export type AnthropicAdminContext = CorsairPluginContext<
	typeof AnthropicAdminSchema,
	AnthropicAdminPluginOptions
>;

export type AnthropicAdminKeyBuilderContext = KeyBuilderContext<AnthropicAdminPluginOptions>;

export type AnthropicAdminBoundEndpoints = BindEndpoints<typeof anthropicAdminEndpointsNested>;

type AnthropicAdminEndpoint<
	K extends keyof AnthropicAdminEndpointOutputs,
> = CorsairEndpoint<
	AnthropicAdminContext,
	AnthropicAdminEndpointInputs[K],
	AnthropicAdminEndpointOutputs[K]
>;

export type AnthropicAdminEndpoints = {
	listWorkspaces: AnthropicAdminEndpoint<'listWorkspaces'>;
};

type AnthropicAdminWebhook<
	K extends keyof AnthropicAdminWebhookOutputs,
	TEvent,
> = CorsairWebhook<AnthropicAdminContext, TEvent, AnthropicAdminWebhookOutputs[K]>;

export type AnthropicAdminWebhooks = {
	example: AnthropicAdminWebhook<'example', ExampleEvent>;
};

export type AnthropicAdminBoundWebhooks = BindWebhooks<AnthropicAdminWebhooks>;

const anthropicAdminEndpointsNested = {
	workspaces: {
		list: Workspaces.list,
	},
} as const;

const anthropicAdminWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const anthropicAdminEndpointSchemas = {
	'workspaces.list': {
		input: AnthropicAdminEndpointInputSchemas.listWorkspaces,
		output: AnthropicAdminEndpointOutputSchemas.listWorkspaces,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof anthropicAdminEndpointsNested>;

const anthropicAdminWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof anthropicAdminWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const anthropicAdminEndpointMeta = {
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List all workspaces in the Anthropic organization',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof anthropicAdminEndpointsNested>;

export const anthropicAdminAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAnthropicAdminPlugin<T extends AnthropicAdminPluginOptions> = CorsairPlugin<
	'anthropicadmin',
	typeof AnthropicAdminSchema,
	typeof anthropicAdminEndpointsNested,
	typeof anthropicAdminWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAnthropicAdminPlugin = BaseAnthropicAdminPlugin<AnthropicAdminPluginOptions>;

export type ExternalAnthropicAdminPlugin<T extends AnthropicAdminPluginOptions> =
	BaseAnthropicAdminPlugin<T>;

export function anthropicadmin<const T extends AnthropicAdminPluginOptions>(
	incomingOptions: AnthropicAdminPluginOptions & T = {} as AnthropicAdminPluginOptions & T,
): ExternalAnthropicAdminPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'anthropicadmin',
		authConfig: anthropicAdminAuthConfig,
		schema: AnthropicAdminSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: anthropicAdminEndpointsNested,
		webhooks: anthropicAdminWebhooksNested,
		endpointMeta: anthropicAdminEndpointMeta,
		endpointSchemas: anthropicAdminEndpointSchemas,
		webhookSchemas: anthropicAdminWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-anthropicadmin-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAnthropicAdminTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAnthropicAdminOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AnthropicAdminKeyBuilderContext, source) => {
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
	} satisfies InternalAnthropicAdminPlugin;
}

export type {
	ExampleEvent,
	AnthropicAdminWebhookOutputs,
} from './webhooks/types';

export type {
	AnthropicAdminEndpointInputs,
	AnthropicAdminEndpointOutputs,
	ListWorkspacesInput,
	ListWorkspacesResponse,
} from './endpoints/types';
