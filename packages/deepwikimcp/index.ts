import type {
	AuthTypes,
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
import { Wiki } from './endpoints';
import type {
	DeepwikiMcpEndpointInputs,
	DeepwikiMcpEndpointOutputs,
} from './endpoints/types';
import {
	DeepwikiMcpEndpointInputSchemas,
	DeepwikiMcpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DeepwikiMcpSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDeepwikiMcpOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDeepwikiMcpTenantWebhook } from './webhooks/tenant-matcher';
import type { DeepwikiMcpWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DeepwikiMcpPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDeepwikiMcpPlugin['hooks'];
	webhookHooks?: InternalDeepwikiMcpPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof deepwikiMcpEndpointsNested>;
};

export type DeepwikiMcpContext = CorsairPluginContext<
	typeof DeepwikiMcpSchema,
	DeepwikiMcpPluginOptions
>;
export type DeepwikiMcpKeyBuilderContext =
	KeyBuilderContext<DeepwikiMcpPluginOptions>;
export type DeepwikiMcpBoundEndpoints = BindEndpoints<
	typeof deepwikiMcpEndpointsNested
>;

type DeepwikiMcpEndpoint<K extends keyof DeepwikiMcpEndpointOutputs> =
	CorsairEndpoint<
		DeepwikiMcpContext,
		DeepwikiMcpEndpointInputs[K],
		DeepwikiMcpEndpointOutputs[K]
	>;

export type DeepwikiMcpEndpoints = {
	askQuestion: DeepwikiMcpEndpoint<'askQuestion'>;
	readWikiContents: DeepwikiMcpEndpoint<'readWikiContents'>;
	readWikiStructure: DeepwikiMcpEndpoint<'readWikiStructure'>;
};

type DeepwikiMcpWebhook<
	K extends keyof DeepwikiMcpWebhookOutputs,
	TEvent,
> = CorsairWebhook<DeepwikiMcpContext, TEvent, DeepwikiMcpWebhookOutputs[K]>;

export type DeepwikiMcpWebhooks = {
	example: DeepwikiMcpWebhook<'example', ExampleEvent>;
};
export type DeepwikiMcpBoundWebhooks = BindWebhooks<DeepwikiMcpWebhooks>;

const deepwikiMcpEndpointsNested = {
	wiki: {
		askQuestion: Wiki.askQuestion,
		readWikiContents: Wiki.readWikiContents,
		readWikiStructure: Wiki.readWikiStructure,
	},
} as const;

const deepwikiMcpWebhooksNested = {
	example: { example: ExampleWebhooks.example },
} as const;

export const deepwikiMcpEndpointSchemas = {
	'wiki.askQuestion': {
		input: DeepwikiMcpEndpointInputSchemas.askQuestion,
		output: DeepwikiMcpEndpointOutputSchemas.askQuestion,
	},
	'wiki.readWikiContents': {
		input: DeepwikiMcpEndpointInputSchemas.readWikiContents,
		output: DeepwikiMcpEndpointOutputSchemas.readWikiContents,
	},
	'wiki.readWikiStructure': {
		input: DeepwikiMcpEndpointInputSchemas.readWikiStructure,
		output: DeepwikiMcpEndpointOutputSchemas.readWikiStructure,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof deepwikiMcpEndpointsNested
>;

const deepwikiMcpWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof deepwikiMcpWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const deepwikiMcpEndpointMeta = {
	'wiki.askQuestion': {
		riskLevel: 'read',
		description: 'Ask a question about one or more GitHub repositories',
	},
	'wiki.readWikiContents': {
		riskLevel: 'read',
		description: 'Read documentation contents for a GitHub repository',
	},
	'wiki.readWikiStructure': {
		riskLevel: 'read',
		description: 'Read documentation topics for a GitHub repository',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof deepwikiMcpEndpointsNested
>;

export const deepwikiMcpAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
	oauth_2: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseDeepwikiMcpPlugin<T extends DeepwikiMcpPluginOptions> =
	CorsairPlugin<
		'deepwikimcp',
		typeof DeepwikiMcpSchema,
		typeof deepwikiMcpEndpointsNested,
		typeof deepwikiMcpWebhooksNested,
		T,
		typeof defaultAuthType
	>;
export type InternalDeepwikiMcpPlugin =
	BaseDeepwikiMcpPlugin<DeepwikiMcpPluginOptions>;
export type ExternalDeepwikiMcpPlugin<T extends DeepwikiMcpPluginOptions> =
	BaseDeepwikiMcpPlugin<T>;

export function deepwikimcp<const T extends DeepwikiMcpPluginOptions>(
	incomingOptions: DeepwikiMcpPluginOptions &
		T = {} as DeepwikiMcpPluginOptions & T,
): ExternalDeepwikiMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'deepwikimcp',
		authConfig: deepwikiMcpAuthConfig,
		schema: DeepwikiMcpSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: deepwikiMcpEndpointsNested,
		webhooks: deepwikiMcpWebhooksNested,
		endpointMeta: deepwikiMcpEndpointMeta,
		endpointSchemas: deepwikiMcpEndpointSchemas,
		pluginWebhookMatcher: (request) =>
			'x-deepwikimcp-signature' in request.headers,
		pluginTenantWebhookMatcher: matchDeepwikiMcpTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDeepwikiMcpOAuthWebhookTenantLink,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: DeepwikiMcpKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret)
				return options.webhookSecret;
			if (source === 'webhook')
				return (await ctx.keys.get_webhook_signature()) ?? '';
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key')
				return (await ctx.keys.get_api_key()) ?? '';
			if (source === 'endpoint' && ctx.authType === 'oauth_2')
				return (await ctx.keys.get_access_token()) ?? '';
			return '';
		},
	} satisfies InternalDeepwikiMcpPlugin;
}

export type {
	AskQuestionInput,
	DeepwikiMcpEndpointInputs,
	DeepwikiMcpEndpointOutputs,
	DeepwikiMcpToolResponse,
	ReadWikiContentsInput,
	ReadWikiStructureInput,
} from './endpoints/types';
export type { DeepwikiMcpWebhookOutputs, ExampleEvent } from './webhooks/types';
