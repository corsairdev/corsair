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
import type { ReplyEndpointInputs, ReplyEndpointOutputs } from './endpoints/types';
import { ReplyEndpointInputSchemas, ReplyEndpointOutputSchemas } from './endpoints/types';
import type {
	ReplyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ReplySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchReplyTenantWebhook } from './webhooks/tenant-matcher';
import { resolveReplyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ReplyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalReplyPlugin['hooks'];
	webhookHooks?: InternalReplyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof replyEndpointsNested>;
};

export type ReplyContext = CorsairPluginContext<
	typeof ReplySchema,
	ReplyPluginOptions
>;

export type ReplyKeyBuilderContext = KeyBuilderContext<ReplyPluginOptions>;

export type ReplyBoundEndpoints = BindEndpoints<typeof replyEndpointsNested>;

type ReplyEndpoint<
	K extends keyof ReplyEndpointOutputs,
> = CorsairEndpoint<
	ReplyContext,
	ReplyEndpointInputs[K],
	ReplyEndpointOutputs[K]
>;

export type ReplyEndpoints = {
    createPersonalList: ReplyEndpoint<'createPersonalList'>;
};

type ReplyWebhook<
	K extends keyof ReplyWebhookOutputs,
	TEvent,
> = CorsairWebhook<ReplyContext, TEvent, ReplyWebhookOutputs[K]>;

export type ReplyWebhooks = {
	example: ReplyWebhook<'example', ExampleEvent>;
};

export type ReplyBoundWebhooks = BindWebhooks<ReplyWebhooks>;

const replyEndpointsNested = {
    createPersonalList: Example.createPersonalList,
} as const;

const replyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const replyEndpointSchemas = {
    'createPersonalList': {
        input: ReplyEndpointInputSchemas.createPersonalList,
        output: ReplyEndpointOutputSchemas.createPersonalList,
    },
} as const satisfies RequiredPluginEndpointSchemas<typeof replyEndpointsNested>;

const replyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof replyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const replyEndpointMeta = {
    'createPersonalList': {
        riskLevel: 'write',
        description: 'Create a personal contact list in Reply.io',
    },
} as const satisfies RequiredPluginEndpointMeta<typeof replyEndpointsNested>;

export const replyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseReplyPlugin<T extends ReplyPluginOptions> = CorsairPlugin<
	'reply',
	typeof ReplySchema,
	typeof replyEndpointsNested,
	typeof replyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalReplyPlugin = BaseReplyPlugin<ReplyPluginOptions>;

export type ExternalReplyPlugin<T extends ReplyPluginOptions> =
	BaseReplyPlugin<T>;

export function reply<const T extends ReplyPluginOptions>(
	incomingOptions: ReplyPluginOptions & T = {} as ReplyPluginOptions & T,
): ExternalReplyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'reply',
		authConfig: replyAuthConfig,
		schema: ReplySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: replyEndpointsNested,
		webhooks: replyWebhooksNested,
		endpointMeta: replyEndpointMeta,
		endpointSchemas: replyEndpointSchemas,
		webhookSchemas: replyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-reply-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchReplyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveReplyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ReplyKeyBuilderContext, source) => {
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
	} satisfies InternalReplyPlugin;
}

export type {
	ExampleEvent,
	ReplyWebhookOutputs,
} from './webhooks/types';

export type {
	ReplyEndpointInputs,
	ReplyEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
