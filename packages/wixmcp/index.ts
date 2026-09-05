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

import type {
	WixMcpEndpointInputs,
	WixMcpEndpointOutputs,
} from './endpoints/types';
import {
	WixMcpEndpointInputSchemas,
	WixMcpEndpointOutputSchemas,
} from './endpoints/types';

import type {
	WixMcpWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

import { WixMcp } from './endpoints';
import { WixMcpSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchWixMcpTenantWebhook } from './webhooks/tenant-matcher';
import { resolveWixMcpOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type WixMcpPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWixMcpPlugin['hooks'];
	webhookHooks?: InternalWixMcpPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wixMcpEndpointsNested>;
};

export type WixMcpContext = CorsairPluginContext<
	typeof WixMcpSchema,
	WixMcpPluginOptions
>;

export type WixMcpKeyBuilderContext =
	KeyBuilderContext<WixMcpPluginOptions>;

export type WixMcpBoundEndpoints =
	BindEndpoints<typeof wixMcpEndpointsNested>;

type WixMcpEndpoint<
	K extends keyof WixMcpEndpointOutputs,
> = CorsairEndpoint<
	WixMcpContext,
	WixMcpEndpointInputs[K],
	WixMcpEndpointOutputs[K]
>;

export type WixMcpEndpoints = {
	callTool: WixMcpEndpoint<'callTool'>;
};

type WixMcpWebhook<
	K extends keyof WixMcpWebhookOutputs,
	TEvent,
> = CorsairWebhook<WixMcpContext, TEvent, WixMcpWebhookOutputs[K]>;

export type WixMcpWebhooks = {
	example: WixMcpWebhook<'example', ExampleEvent>;
};

export type WixMcpBoundWebhooks =
	BindWebhooks<WixMcpWebhooks>;

const wixMcpEndpointsNested = {
	mcp: {
		callTool: WixMcp.callTool,
	},
} as const;

const wixMcpWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const wixMcpEndpointSchemas = {
	'mcp.callTool': {
		input: WixMcpEndpointInputSchemas.callTool,
		output: WixMcpEndpointOutputSchemas.callTool,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof wixMcpEndpointsNested
>;

const wixMcpWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof wixMcpWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const wixMcpEndpointMeta = {
	'mcp.callTool': {
		riskLevel: 'write',
		description: 'Call a tool on the Wix MCP server',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof wixMcpEndpointsNested
>;

export const wixMcpAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWixMcpPlugin<
	T extends WixMcpPluginOptions,
> = CorsairPlugin<
	'wixmcp',
	typeof WixMcpSchema,
	typeof wixMcpEndpointsNested,
	typeof wixMcpWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWixMcpPlugin =
	BaseWixMcpPlugin<WixMcpPluginOptions>;

export type ExternalWixMcpPlugin<
	T extends WixMcpPluginOptions,
> = BaseWixMcpPlugin<T>;

export function wixmcp<
	const T extends WixMcpPluginOptions,
>(
	incomingOptions: WixMcpPluginOptions & T =
		{} as WixMcpPluginOptions & T,
): ExternalWixMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'wixmcp',
		authConfig: wixMcpAuthConfig,
		schema: WixMcpSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: wixMcpEndpointsNested,
		webhooks: wixMcpWebhooksNested,
		endpointMeta: wixMcpEndpointMeta,
		endpointSchemas: wixMcpEndpointSchemas,
		webhookSchemas: wixMcpWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-wixmcp-signature' in headers;
		},

		pluginTenantWebhookMatcher:
			matchWixMcpTenantWebhook,

		oauthWebhookTenantLinkResolver:
			resolveWixMcpOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (
			ctx: WixMcpKeyBuilderContext,
			source,
		) => {
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

			if (
				source === 'endpoint' &&
				ctx.authType === 'api_key'
			) {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (
				source === 'endpoint' &&
				ctx.authType === 'oauth_2'
			) {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalWixMcpPlugin;
}

export type {
	ExampleEvent,
	WixMcpWebhookOutputs,
} from './webhooks/types';

export type {
	WixMcpEndpointInputs,
	WixMcpEndpointOutputs,
	CallToolInput,
	CallToolResponse,
} from './endpoints/types';