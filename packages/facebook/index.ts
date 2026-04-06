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
import type { FacebookEndpointInputs, FacebookEndpointOutputs } from './endpoints/types';
import {
	FacebookEndpointInputSchemas,
	FacebookEndpointOutputSchemas,
} from './endpoints/types';
import type {
	FacebookChallengePayload,
	FacebookChallengeResponse,
	FacebookWebhookOutputs,
	FacebookWebhookPayload,
} from './webhooks/types';
import {
	FacebookChallengePayloadSchema,
	FacebookChallengeResponseSchema,
	FacebookWebhookPayloadSchema,
} from './webhooks/types';
import { Messages, Pages } from './endpoints';
import { FacebookSchema } from './schema';
import { ChallengeWebhooks, DeliveryWebhooks, MessageWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type FacebookPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	webhookVerifyToken?: string;
	hooks?: InternalFacebookPlugin['hooks'];
	webhookHooks?: InternalFacebookPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof facebookEndpointsNested>;
};

export type FacebookContext = CorsairPluginContext<
	typeof FacebookSchema,
	FacebookPluginOptions
>;

export type FacebookKeyBuilderContext = KeyBuilderContext<FacebookPluginOptions>;

export type FacebookBoundEndpoints = BindEndpoints<typeof facebookEndpointsNested>;

type FacebookEndpoint<K extends keyof FacebookEndpointOutputs> = CorsairEndpoint<
	FacebookContext,
	FacebookEndpointInputs[K],
	FacebookEndpointOutputs[K]
>;

export type FacebookEndpoints = {
	sendMessage: FacebookEndpoint<'sendMessage'>;
	getMessages: FacebookEndpoint<'getMessages'>;
	getPageDetails: FacebookEndpoint<'getPageDetails'>;
	listConversations: FacebookEndpoint<'listConversations'>;
};

type FacebookWebhook<
	K extends keyof FacebookWebhookOutputs,
	TEvent,
> = CorsairWebhook<FacebookContext, TEvent, FacebookWebhookOutputs[K]>;

export type FacebookWebhooks = {
	challenge: FacebookWebhook<'challenge', FacebookChallengePayload>;
	message: FacebookWebhook<'message', FacebookWebhookPayload>;
	delivery: FacebookWebhook<'delivery', FacebookWebhookPayload>;
};

export type FacebookBoundWebhooks = BindWebhooks<typeof facebookWebhooksNested>;

const facebookEndpointsNested = {
	messages: {
		sendMessage: Messages.sendMessage,
		getMessages: Messages.getMessages,
	},
	pages: {
		getPageDetails: Pages.getPageDetails,
		listConversations: Pages.listConversations,
	},
} as const;

const facebookWebhooksNested = {
	challenge: {
		challenge: ChallengeWebhooks.challenge,
	},
	message: {
		message: MessageWebhooks.message,
	},
	delivery: {
		delivery: DeliveryWebhooks.delivery,
	},
} as const;

export const facebookEndpointSchemas = {
	'messages.sendMessage': {
		input: FacebookEndpointInputSchemas.sendMessage,
		output: FacebookEndpointOutputSchemas.sendMessage,
	},
	'messages.getMessages': {
		input: FacebookEndpointInputSchemas.getMessages,
		output: FacebookEndpointOutputSchemas.getMessages,
	},
	'pages.getPageDetails': {
		input: FacebookEndpointInputSchemas.getPageDetails,
		output: FacebookEndpointOutputSchemas.getPageDetails,
	},
	'pages.listConversations': {
		input: FacebookEndpointInputSchemas.listConversations,
		output: FacebookEndpointOutputSchemas.listConversations,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof facebookEndpointsNested>;

export const facebookWebhookSchemas: RequiredPluginWebhookSchemas<
	typeof facebookWebhooksNested
> = {
	'challenge.challenge': {
		description: 'Responds to the Facebook Messenger webhook verification challenge.',
		payload: FacebookChallengePayloadSchema,
		response: FacebookChallengeResponseSchema,
	},
	'message.message': {
		description: 'Fires when an inbound Facebook Messenger message event is received.',
		payload: FacebookWebhookPayloadSchema,
		response: FacebookWebhookPayloadSchema,
	},
	'delivery.delivery': {
		description: 'Fires when Facebook Messenger sends delivery or read status events.',
		payload: FacebookWebhookPayloadSchema,
		response: FacebookWebhookPayloadSchema,
	},
};

const defaultAuthType: AuthTypes = 'api_key' as const;

const facebookEndpointMeta = {
	'messages.sendMessage': {
		riskLevel: 'write',
		description: 'Send a Facebook Messenger text message using the Send API.',
	},
	'messages.getMessages': {
		riskLevel: 'read',
		description: 'List Facebook Messenger messages previously persisted by endpoints or webhooks.',
	},
	'pages.getPageDetails': {
		riskLevel: 'read',
		description: 'Fetch Facebook Page profile details from the Graph API.',
	},
	'pages.listConversations': {
		riskLevel: 'read',
		description: 'List Facebook Page conversations from the Graph API and optionally persist them.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof facebookEndpointsNested>;

export const facebookAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFacebookPlugin<T extends FacebookPluginOptions> = CorsairPlugin<
	'facebook',
	typeof FacebookSchema,
	typeof facebookEndpointsNested,
	typeof facebookWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFacebookPlugin = BaseFacebookPlugin<FacebookPluginOptions>;
export type ExternalFacebookPlugin<T extends FacebookPluginOptions> = BaseFacebookPlugin<T>;

export function facebook<const T extends FacebookPluginOptions>(
	incomingOptions: FacebookPluginOptions & T = {} as FacebookPluginOptions & T,
): ExternalFacebookPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'facebook',
		schema: FacebookSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: facebookEndpointsNested,
		webhooks: facebookWebhooksNested,
		endpointMeta: facebookEndpointMeta,
		endpointSchemas: facebookEndpointSchemas,
		webhookSchemas: facebookWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			try {
				const body = typeof request.body === 'string'
					? JSON.parse(request.body)
					: request.body;

				if (!body || typeof body !== 'object') {
					return false;
				}

				if ('object' in body && body.object === 'page') {
					return Array.isArray((body as { entry?: unknown[] }).entry);
				}

				if ('hub.challenge' in body || 'hub' in body) {
					return true;
				}

				return false;
			} catch {
				return false;
			}
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		authConfig: facebookAuthConfig,
		keyBuilder: async (ctx: FacebookKeyBuilderContext, source) => {
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

			return '';
		},
	} satisfies InternalFacebookPlugin;
}

export type {
	FacebookChallengePayload,
	FacebookChallengeResponse,
	FacebookDeliveryWebhookResponse,
	FacebookInboundMessage,
	FacebookWebhookOutputs,
	FacebookWebhookPayload,
} from './webhooks/types';

export type {
	FacebookEndpointInputs,
	FacebookEndpointOutputs,
	GetMessagesInput,
	GetMessagesResponse,
	GetPageDetailsInput,
	GetPageDetailsResponse,
	ListConversationsInput,
	ListConversationsResponse,
	SendMessageInput,
	SendMessageResponse,
} from './endpoints/types';
