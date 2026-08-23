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
import { Session } from './endpoints';
import type {
	DevinMcpEndpointInputs,
	DevinMcpEndpointOutputs,
} from './endpoints/types';
import {
	DevinMcpEndpointInputSchemas,
	DevinMcpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DevinMcpSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDevinMcpOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDevinMcpTenantWebhook } from './webhooks/tenant-matcher';
import type { DevinMcpWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DevinMcpPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDevinMcpPlugin['hooks'];
	webhookHooks?: InternalDevinMcpPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof devinMcpEndpointsNested>;
};

export type DevinMcpContext = CorsairPluginContext<
	typeof DevinMcpSchema,
	DevinMcpPluginOptions
>;

export type DevinMcpKeyBuilderContext =
	KeyBuilderContext<DevinMcpPluginOptions>;

export type DevinMcpBoundEndpoints = BindEndpoints<
	typeof devinMcpEndpointsNested
>;

type DevinMcpEndpoint<K extends keyof DevinMcpEndpointOutputs> =
	CorsairEndpoint<
		DevinMcpContext,
		DevinMcpEndpointInputs[K],
		DevinMcpEndpointOutputs[K]
	>;

export type DevinMcpEndpoints = {
	createSession: DevinMcpEndpoint<'createSession'>;
	getSession: DevinMcpEndpoint<'getSession'>;
	listSessions: DevinMcpEndpoint<'listSessions'>;
	sendMessage: DevinMcpEndpoint<'sendMessage'>;
};

type DevinMcpWebhook<
	K extends keyof DevinMcpWebhookOutputs,
	TEvent,
> = CorsairWebhook<DevinMcpContext, TEvent, DevinMcpWebhookOutputs[K]>;

export type DevinMcpWebhooks = {
	example: DevinMcpWebhook<'example', ExampleEvent>;
};

export type DevinMcpBoundWebhooks = BindWebhooks<DevinMcpWebhooks>;

const devinMcpEndpointsNested = {
	session: {
		create: Session.create,
		get: Session.get,
		list: Session.list,
		sendMessage: Session.sendMessage,
	},
} as const;

const devinMcpWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const devinMcpEndpointSchemas = {
	'session.create': {
		input: DevinMcpEndpointInputSchemas.createSession,
		output: DevinMcpEndpointOutputSchemas.createSession,
	},
	'session.get': {
		input: DevinMcpEndpointInputSchemas.getSession,
		output: DevinMcpEndpointOutputSchemas.getSession,
	},
	'session.list': {
		input: DevinMcpEndpointInputSchemas.listSessions,
		output: DevinMcpEndpointOutputSchemas.listSessions,
	},
	'session.sendMessage': {
		input: DevinMcpEndpointInputSchemas.sendMessage,
		output: DevinMcpEndpointOutputSchemas.sendMessage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof devinMcpEndpointsNested
>;

const devinMcpWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof devinMcpWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const devinMcpEndpointMeta = {
	'session.create': {
		riskLevel: 'write',
		description: 'Create a new Devin session to start working on a task',
	},
	'session.get': {
		riskLevel: 'read',
		description: 'Get details and status of an existing Devin session',
	},
	'session.list': {
		riskLevel: 'read',
		description: 'List Devin sessions',
	},
	'session.sendMessage': {
		riskLevel: 'write',
		description: 'Send a follow-up message to an existing Devin session',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof devinMcpEndpointsNested>;

export const devinMcpAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDevinMcpPlugin<T extends DevinMcpPluginOptions> = CorsairPlugin<
	'devinmcp',
	typeof DevinMcpSchema,
	typeof devinMcpEndpointsNested,
	typeof devinMcpWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDevinMcpPlugin = BaseDevinMcpPlugin<DevinMcpPluginOptions>;

export type ExternalDevinMcpPlugin<T extends DevinMcpPluginOptions> =
	BaseDevinMcpPlugin<T>;

export function devinmcp<const T extends DevinMcpPluginOptions>(
	incomingOptions: DevinMcpPluginOptions & T = {} as DevinMcpPluginOptions & T,
): ExternalDevinMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'devinmcp',
		authConfig: devinMcpAuthConfig,
		schema: DevinMcpSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: devinMcpEndpointsNested,
		webhooks: devinMcpWebhooksNested,
		endpointMeta: devinMcpEndpointMeta,
		endpointSchemas: devinMcpEndpointSchemas,
		webhookSchemas: devinMcpWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-devinmcp-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDevinMcpTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDevinMcpOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DevinMcpKeyBuilderContext, source) => {
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
	} satisfies InternalDevinMcpPlugin;
}

export type {
	CreateSessionInput,
	CreateSessionResponse,
	DevinMcpEndpointInputs,
	DevinMcpEndpointOutputs,
	GetSessionInput,
	GetSessionResponse,
	ListSessionsInput,
	ListSessionsResponse,
	SendMessageInput,
	SendMessageResponse,
} from './endpoints/types';
export type {
	DevinMcpWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
