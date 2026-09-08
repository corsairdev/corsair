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
import type { ReplyioEndpointInputs, ReplyioEndpointOutputs } from './endpoints/types';
import { ReplyioEndpointInputSchemas, ReplyioEndpointOutputSchemas } from './endpoints/types';
import type {
	ReplyioWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ReplyioSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchReplyioTenantWebhook } from './webhooks/tenant-matcher';
import { resolveReplyioOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ReplyioPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalReplyioPlugin['hooks'];
	webhookHooks?: InternalReplyioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof replyioEndpointsNested>;
};

export type ReplyioContext = CorsairPluginContext<
	typeof ReplyioSchema,
	ReplyioPluginOptions
>;

export type ReplyioKeyBuilderContext = KeyBuilderContext<ReplyioPluginOptions>;

export type ReplyioBoundEndpoints = BindEndpoints<typeof replyioEndpointsNested>;

type ReplyioEndpoint<
	K extends keyof ReplyioEndpointOutputs,
> = CorsairEndpoint<
	ReplyioContext,
	ReplyioEndpointInputs[K],
	ReplyioEndpointOutputs[K]
>;

export type ReplyioEndpoints = {
	exampleGet: ReplyioEndpoint<'exampleGet'>;
};

type ReplyioWebhook<
	K extends keyof ReplyioWebhookOutputs,
	TEvent,
> = CorsairWebhook<ReplyioContext, TEvent, ReplyioWebhookOutputs[K]>;

export type ReplyioWebhooks = {
	example: ReplyioWebhook<'example', ExampleEvent>;
};

export type ReplyioBoundWebhooks = BindWebhooks<ReplyioWebhooks>;

const replyioEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const replyioWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const replyioEndpointSchemas = {
	'example.get': {
		input: ReplyioEndpointInputSchemas.exampleGet,
		output: ReplyioEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof replyioEndpointsNested>;

const replyioWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof replyioWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const replyioEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof replyioEndpointsNested>;

export const replyioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseReplyioPlugin<T extends ReplyioPluginOptions> = CorsairPlugin<
	'replyio',
	typeof ReplyioSchema,
	typeof replyioEndpointsNested,
	typeof replyioWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalReplyioPlugin = BaseReplyioPlugin<ReplyioPluginOptions>;

export type ExternalReplyioPlugin<T extends ReplyioPluginOptions> =
	BaseReplyioPlugin<T>;

export function replyio<const T extends ReplyioPluginOptions>(
	incomingOptions: ReplyioPluginOptions & T = {} as ReplyioPluginOptions & T,
): ExternalReplyioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'replyio',
		authConfig: replyioAuthConfig,
		schema: ReplyioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: replyioEndpointsNested,
		webhooks: replyioWebhooksNested,
		endpointMeta: replyioEndpointMeta,
		endpointSchemas: replyioEndpointSchemas,
		webhookSchemas: replyioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-replyio-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchReplyioTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveReplyioOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ReplyioKeyBuilderContext, source) => {
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
	} satisfies InternalReplyioPlugin;
}

export type {
	ExampleEvent,
	ReplyioWebhookOutputs,
} from './webhooks/types';

export type {
	ReplyioEndpointInputs,
	ReplyioEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
