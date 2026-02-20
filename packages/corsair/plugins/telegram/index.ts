import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginAuthConfig,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type { TelegramEndpointInputs, TelegramEndpointOutputs } from './endpoints/types';
import type {
	TelegramWebhookOutputs,
	CallbackQueryEvent,
	ChannelPostEvent,
	EditedChannelPostEvent,
	EditedMessageEvent,
	InlineQueryEvent,
	MessageEvent,
	PollEvent,
	PreCheckoutQueryEvent,
	ShippingQueryEvent,
} from './webhooks/types';
import { Chat, Callback, File, Messages, Webhook, Updates, Me } from './endpoints';
import { TelegramSchema } from './schema';
import {
	CallbackQueryWebhooks,
	ChannelPostWebhooks,
	EditedChannelPostWebhooks,
	EditedMessageWebhooks,
	InlineQueryWebhooks,
	MessageWebhooks,
	PollWebhooks,
	PreCheckoutQueryWebhooks,
	ShippingQueryWebhooks,
} from './webhooks';
import { errorHandlers } from './error-handlers';

/**
 * Plugin options type - configure authentication and behavior
 * 
 * AUTH CONFIGURATION:
 * - authType: The authentication method to use. Options:
 *   - 'api_key': For API key authentication (most common)
 *   - 'oauth_2': For OAuth 2.0 authentication
 *   - 'bot_token': For bot token authentication
 *   Update PickAuth<'api_key'> to include all auth types your plugin supports.
 *   Example: PickAuth<'api_key' | 'oauth_2'> for plugins that support both.
 * 
 * - key: Optional API key to use directly (bypasses key manager)
 * - webhookSecret: Optional webhook secret for signature verification
 */
export type TelegramPluginOptions = {
	authType?: PickAuth<'bot_token'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTelegramPlugin['hooks'];
	webhookHooks?: InternalTelegramPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type TelegramContext = CorsairPluginContext<
	typeof TelegramSchema,
	TelegramPluginOptions
>;

export type TelegramKeyBuilderContext = KeyBuilderContext<TelegramPluginOptions>;

export type TelegramBoundEndpoints = BindEndpoints<typeof telegramEndpointsNested>;

type TelegramEndpoint<
	K extends keyof TelegramEndpointOutputs,
> = CorsairEndpoint<TelegramContext, TelegramEndpointInputs[K], TelegramEndpointOutputs[K]>;

export type TelegramEndpoints = {
	getChat: TelegramEndpoint<'getChat'>;
	getChatAdministrators: TelegramEndpoint<'getChatAdministrators'>;
	getChatMember: TelegramEndpoint<'getChatMember'>;
	answerCallbackQuery: TelegramEndpoint<'answerCallbackQuery'>;
	answerInlineQuery: TelegramEndpoint<'answerInlineQuery'>;
	getFile: TelegramEndpoint<'getFile'>;
	sendMessage: TelegramEndpoint<'sendMessage'>;
	sendMessageAndWaitForResponse: TelegramEndpoint<'sendMessageAndWaitForResponse'>;
	editMessageText: TelegramEndpoint<'editMessageText'>;
	deleteMessage: TelegramEndpoint<'deleteMessage'>;
	pinChatMessage: TelegramEndpoint<'pinChatMessage'>;
	unpinChatMessage: TelegramEndpoint<'unpinChatMessage'>;
	sendPhoto: TelegramEndpoint<'sendPhoto'>;
	sendVideo: TelegramEndpoint<'sendVideo'>;
	sendAudio: TelegramEndpoint<'sendAudio'>;
	sendDocument: TelegramEndpoint<'sendDocument'>;
	sendSticker: TelegramEndpoint<'sendSticker'>;
	sendAnimation: TelegramEndpoint<'sendAnimation'>;
	sendLocation: TelegramEndpoint<'sendLocation'>;
	sendMediaGroup: TelegramEndpoint<'sendMediaGroup'>;
	sendChatAction: TelegramEndpoint<'sendChatAction'>;
	setWebhook: TelegramEndpoint<'setWebhook'>;
	deleteWebhook: TelegramEndpoint<'deleteWebhook'>;
	getUpdates: TelegramEndpoint<'getUpdates'>;
	getMe: TelegramEndpoint<'getMe'>;
};

type TelegramWebhook<
	K extends keyof TelegramWebhookOutputs,
	TEvent,
> = CorsairWebhook<TelegramContext, TEvent, TelegramWebhookOutputs[K]>;

export type TelegramWebhooks = {
	callbackQuery: TelegramWebhook<'callbackQuery', CallbackQueryEvent>;
	channelPost: TelegramWebhook<'channelPost', ChannelPostEvent>;
	editedChannelPost: TelegramWebhook<'editedChannelPost', EditedChannelPostEvent>;
	editedMessage: TelegramWebhook<'editedMessage', EditedMessageEvent>;
	inlineQuery: TelegramWebhook<'inlineQuery', InlineQueryEvent>;
	message: TelegramWebhook<'message', MessageEvent>;
	poll: TelegramWebhook<'poll', PollEvent>;
	preCheckoutQuery: TelegramWebhook<'preCheckoutQuery', PreCheckoutQueryEvent>;
	shippingQuery: TelegramWebhook<'shippingQuery', ShippingQueryEvent>;
};

export type TelegramBoundWebhooks = BindWebhooks<TelegramWebhooks>;

const telegramEndpointsNested = {
	chat: {
		getChat: Chat.getChat,
		getChatAdministrators: Chat.getChatAdministrators,
		getChatMember: Chat.getChatMember,
	},
	callback: {
		answerCallbackQuery: Callback.answerCallbackQuery,
		answerInlineQuery: Callback.answerInlineQuery,
	},
	file: {
		getFile: File.getFile,
	},
	messages: {
		sendMessage: Messages.sendMessage,
		sendMessageAndWaitForResponse: Messages.sendMessageAndWaitForResponse,
		editMessageText: Messages.editMessageText,
		deleteMessage: Messages.deleteMessage,
		pinChatMessage: Messages.pinChatMessage,
		unpinChatMessage: Messages.unpinChatMessage,
		sendPhoto: Messages.sendPhoto,
		sendVideo: Messages.sendVideo,
		sendAudio: Messages.sendAudio,
		sendDocument: Messages.sendDocument,
		sendSticker: Messages.sendSticker,
		sendAnimation: Messages.sendAnimation,
		sendLocation: Messages.sendLocation,
		sendMediaGroup: Messages.sendMediaGroup,
		sendChatAction: Messages.sendChatAction,
	},
	webhook: {
		setWebhook: Webhook.setWebhook,
		deleteWebhook: Webhook.deleteWebhook,
	},
	updates: {
		getUpdates: Updates.getUpdates,
	},
	me: {
		getMe: Me.getMe,
	},
} as const;

const telegramWebhooksNested = {
	callbackQuery: {
		callbackQuery: CallbackQueryWebhooks.callbackQuery,
	},
	channelPost: {
		channelPost: ChannelPostWebhooks.channelPost,
	},
	editedChannelPost: {
		editedChannelPost: EditedChannelPostWebhooks.editedChannelPost,
	},
	editedMessage: {
		editedMessage: EditedMessageWebhooks.editedMessage,
	},
	inlineQuery: {
		inlineQuery: InlineQueryWebhooks.inlineQuery,
	},
	message: {
		message: MessageWebhooks.message,
	},
	poll: {
		poll: PollWebhooks.poll,
	},
	preCheckoutQuery: {
		preCheckoutQuery: PreCheckoutQueryWebhooks.preCheckoutQuery,
	},
	shippingQuery: {
		shippingQuery: ShippingQueryWebhooks.shippingQuery,
	},
} as const;

const defaultAuthType: AuthTypes = 'bot_token';

export const telegramAuthConfig = {
	bot_token: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTelegramPlugin<T extends TelegramPluginOptions> = CorsairPlugin<
	'telegram',
	typeof TelegramSchema,
	typeof telegramEndpointsNested,
	typeof telegramWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalTelegramPlugin = BaseTelegramPlugin<TelegramPluginOptions>;

export type ExternalTelegramPlugin<T extends TelegramPluginOptions> =
	BaseTelegramPlugin<T>;

export function telegram<const T extends TelegramPluginOptions>(
	incomingOptions: TelegramPluginOptions & T = {} as TelegramPluginOptions & T,
): ExternalTelegramPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'telegram',
		schema: TelegramSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: telegramEndpointsNested,
		webhooks: telegramWebhooksNested,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasSecretToken = 'x-telegram-bot-api-secret-token' in headers;
			return hasSecretToken;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TelegramKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					return '';
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'bot_token') {
				const res = await ctx.keys.get_bot_token();
				if (!res) {
					return '';
				}
				return res;
			}

			return '';
		},
	} satisfies InternalTelegramPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CallbackQueryEvent,
	ChannelPostEvent,
	EditedChannelPostEvent,
	EditedMessageEvent,
	InlineQueryEvent,
	MessageEvent,
	PollEvent,
	PreCheckoutQueryEvent,
	ShippingQueryEvent,
	TelegramUpdate,
	TelegramMessage,
	TelegramUser,
	TelegramChat,
	TelegramWebhookOutputs,
} from './webhooks/types';

export type {
	TelegramEndpointInputs,
	TelegramEndpointOutputs,
} from './endpoints/types';
