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
import type { WhatsAppEndpointInputs, WhatsAppEndpointOutputs } from './endpoints/types';
import {
	WhatsAppEndpointInputSchemas,
	WhatsAppEndpointOutputSchemas,
} from './endpoints/types';
import type {
	MessageEvent,
	StatusEvent,
	WhatsAppWebhookOutputs,
} from './webhooks/types';
import {
	WhatsAppMessageEventSchema,
	WhatsAppStatusEventSchema,
} from './webhooks/types';
import { Messages } from './endpoints';
import { WhatsAppSchema } from './schema';
import { MessageWebhooks, StatusWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type WhatsAppPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWhatsAppPlugin['hooks'];
	webhookHooks?: InternalWhatsAppPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof whatsAppEndpointsNested>;
};

export type WhatsAppContext = CorsairPluginContext<
	typeof WhatsAppSchema,
	WhatsAppPluginOptions
>;

export type WhatsAppKeyBuilderContext = KeyBuilderContext<WhatsAppPluginOptions>;

export type WhatsAppBoundEndpoints = BindEndpoints<typeof whatsAppEndpointsNested>;

type WhatsAppEndpoint<K extends keyof WhatsAppEndpointOutputs> = CorsairEndpoint<
	WhatsAppContext,
	WhatsAppEndpointInputs[K],
	WhatsAppEndpointOutputs[K]
>;

export type WhatsAppEndpoints = {
	sendMessage: WhatsAppEndpoint<'sendMessage'>;
	getMessages: WhatsAppEndpoint<'getMessages'>;
	listConversations: WhatsAppEndpoint<'listConversations'>;
};

type WhatsAppWebhook<
	K extends keyof WhatsAppWebhookOutputs,
	TEvent,
> = CorsairWebhook<WhatsAppContext, TEvent, WhatsAppWebhookOutputs[K]>;

export type WhatsAppWebhooks = {
	message: WhatsAppWebhook<'message', MessageEvent>;
	status: WhatsAppWebhook<'status', StatusEvent>;
};

export type WhatsAppBoundWebhooks = BindWebhooks<WhatsAppWebhooks>;

const whatsAppEndpointsNested = {
	messages: {
		sendMessage: Messages.sendMessage,
		getMessages: Messages.getMessages,
		listConversations: Messages.listConversations,
	},
} as const;

const whatsAppWebhooksNested = {
	message: {
		message: MessageWebhooks.message,
	},
	status: {
		status: StatusWebhooks.status,
	},
} as const;

export const whatsAppEndpointSchemas = {
	'messages.sendMessage': {
		input: WhatsAppEndpointInputSchemas.sendMessage,
		output: WhatsAppEndpointOutputSchemas.sendMessage,
	},
	'messages.getMessages': {
		input: WhatsAppEndpointInputSchemas.getMessages,
		output: WhatsAppEndpointOutputSchemas.getMessages,
	},
	'messages.listConversations': {
		input: WhatsAppEndpointInputSchemas.listConversations,
		output: WhatsAppEndpointOutputSchemas.listConversations,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof whatsAppEndpointsNested>;

export const whatsAppWebhookSchemas: RequiredPluginWebhookSchemas<
	typeof whatsAppWebhooksNested
> = {
	'message.message': {
		description: 'Fires when an inbound WhatsApp message is received from a user.',
		payload: WhatsAppMessageEventSchema,
		response: WhatsAppMessageEventSchema,
	},
	'status.status': {
		description: 'Fires when Meta sends a WhatsApp outbound message status update.',
		payload: WhatsAppStatusEventSchema,
		response: WhatsAppStatusEventSchema,
	},
};

const defaultAuthType: AuthTypes = 'api_key' as const;

const whatsAppEndpointMeta = {
	'messages.sendMessage': {
		riskLevel: 'write',
		description: 'Send a WhatsApp text message through the WhatsApp Cloud API.',
	},
	'messages.getMessages': {
		riskLevel: 'read',
		description: 'List WhatsApp messages previously persisted by API calls or webhooks.',
	},
	'messages.listConversations': {
		riskLevel: 'read',
		description: 'List WhatsApp conversations previously persisted from status webhooks.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof whatsAppEndpointsNested>;

export const whatsAppAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWhatsAppPlugin<T extends WhatsAppPluginOptions> = CorsairPlugin<
	'whatsapp',
	typeof WhatsAppSchema,
	typeof whatsAppEndpointsNested,
	typeof whatsAppWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWhatsAppPlugin = BaseWhatsAppPlugin<WhatsAppPluginOptions>;

export type ExternalWhatsAppPlugin<T extends WhatsAppPluginOptions> =
	BaseWhatsAppPlugin<T>;

export function whatsapp<const T extends WhatsAppPluginOptions>(
	incomingOptions: WhatsAppPluginOptions & T = {} as WhatsAppPluginOptions & T,
): ExternalWhatsAppPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'whatsapp',
		schema: WhatsAppSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: whatsAppEndpointsNested,
		webhooks: whatsAppWebhooksNested,
		endpointMeta: whatsAppEndpointMeta,
		endpointSchemas: whatsAppEndpointSchemas,
		webhookSchemas: whatsAppWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			try {
				const body = typeof request.body === 'string'
					? JSON.parse(request.body)
					: request.body;

				if (!body || typeof body !== 'object' || !('object' in body)) {
					return false;
				}

				if (body.object !== 'whatsapp_business_account') {
					return false;
				}

				if (!Array.isArray((body as { entry?: unknown[] }).entry)) {
					return false;
				}

				return (body as { entry: Array<{ changes?: Array<{ field?: string }> }> }).entry.some(
					(entry) => entry.changes?.some((change) => change.field === 'messages'),
				);
			} catch {
				return false;
			}
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		authConfig: whatsAppAuthConfig,
		keyBuilder: async (ctx: WhatsAppKeyBuilderContext, source) => {
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
	} satisfies InternalWhatsAppPlugin;
}

export type {
	MessageEvent,
	StatusEvent,
	WhatsAppIncomingMessage,
	WhatsAppStatus,
	WhatsAppWebhookOutputs,
	WhatsAppWebhookPayload,
} from './webhooks/types';

export type {
	GetMessagesInput,
	GetMessagesResponse,
	ListConversationsInput,
	ListConversationsResponse,
	SendMessageInput,
	SendMessageResponse,
	WhatsAppEndpointInputs,
	WhatsAppEndpointOutputs,
} from './endpoints/types';
