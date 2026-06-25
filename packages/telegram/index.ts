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
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Callback,
	Chat,
	File,
	Me,
	Messages,
	Updates,
	Webhook,
} from './endpoints';
import type {
	TelegramEndpointInputs,
	TelegramEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
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
import { matchTelegramTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CallbackQueryEvent,
	ChannelPostEvent,
	EditedChannelPostEvent,
	EditedMessageEvent,
	InlineQueryEvent,
	MessageEvent,
	PollEvent,
	PreCheckoutQueryEvent,
	ShippingQueryEvent,
	TelegramWebhookOutputs,
} from './webhooks/types';

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

export type TelegramKeyBuilderContext =
	KeyBuilderContext<TelegramPluginOptions>;

export type TelegramBoundEndpoints = BindEndpoints<
	typeof telegramEndpointsNested
>;

type TelegramEndpoint<K extends keyof TelegramEndpointOutputs> =
	CorsairEndpoint<
		TelegramContext,
		TelegramEndpointInputs[K],
		TelegramEndpointOutputs[K]
	>;

export type TelegramEndpoints = {
	getChat: TelegramEndpoint<'getChat'>;
	getChatAdministrators: TelegramEndpoint<'getChatAdministrators'>;
	getChatMember: TelegramEndpoint<'getChatMember'>;
	answerCallbackQuery: TelegramEndpoint<'answerCallbackQuery'>;
	answerInlineQuery: TelegramEndpoint<'answerInlineQuery'>;
	getFile: TelegramEndpoint<'getFile'>;
	sendMessage: TelegramEndpoint<'sendMessage'>;
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
	editedChannelPost: TelegramWebhook<
		'editedChannelPost',
		EditedChannelPostEvent
	>;
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

const telegramEndpointMeta = {
	'chat.getChat': { riskLevel: 'read', description: 'Get chat information' },
	'chat.getChatAdministrators': {
		riskLevel: 'read',
		description: 'Get chat administrators',
	},
	'chat.getChatMember': {
		riskLevel: 'read',
		description: 'Get chat member information',
	},
	'callback.answerCallbackQuery': {
		riskLevel: 'write',
		description: 'Answer callback query',
	},
	'callback.answerInlineQuery': {
		riskLevel: 'write',
		description: 'Answer inline query',
	},
	'file.getFile': { riskLevel: 'read', description: 'Get a file' },
	'messages.sendMessage': { riskLevel: 'write', description: 'Send a message' },
	'messages.editMessageText': {
		riskLevel: 'write',
		description: 'Edit message text',
	},
	'messages.deleteMessage': {
		riskLevel: 'destructive',
		description: 'Delete a message',
	},
	'messages.pinChatMessage': {
		riskLevel: 'write',
		description: 'Pin a chat message',
	},
	'messages.unpinChatMessage': {
		riskLevel: 'write',
		description: 'Unpin a chat message',
	},
	'messages.sendPhoto': { riskLevel: 'write', description: 'Send photo' },
	'messages.sendVideo': { riskLevel: 'write', description: 'Send video' },
	'messages.sendAudio': { riskLevel: 'write', description: 'Send audio' },
	'messages.sendDocument': { riskLevel: 'write', description: 'Send document' },
	'messages.sendSticker': { riskLevel: 'write', description: 'Send sticker' },
	'messages.sendAnimation': {
		riskLevel: 'write',
		description: 'Send animation',
	},
	'messages.sendLocation': { riskLevel: 'write', description: 'Send location' },
	'messages.sendMediaGroup': {
		riskLevel: 'write',
		description: 'Send media group',
	},
	'messages.sendChatAction': {
		riskLevel: 'write',
		description: 'Send a chat action',
	},
	'webhook.setWebhook': { riskLevel: 'write', description: 'Set webhook' },
	'webhook.deleteWebhook': {
		riskLevel: 'destructive',
		description: 'Delete webhook',
	},
	'updates.getUpdates': { riskLevel: 'read', description: 'Get updates' },
	'me.getMe': { riskLevel: 'read', description: 'Get bot info' },
} as const satisfies RequiredPluginEndpointMeta<typeof telegramEndpointsNested>;

const defaultAuthType: AuthTypes = 'bot_token';

export const telegramAuthConfig = {
	bot_token: {
		account: ['bot_id'] as const,
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
	// Default to empty object; cast required because TS cannot verify {} satisfies the generic constraint T at compile time
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
		endpointMeta: telegramEndpointMeta,
		pluginWebhookMatcher: (request) => {
			const body =
				typeof request.body === 'string'
					? JSON.parse(request.body)
					: request.body;

			if (!body || typeof body !== 'object') {
				return false;
			}

			const hasSignature = 'x-telegram-bot-api-secret-token' in request.headers;

			return hasSignature && 'update_id' in body;
		},
		pluginTenantWebhookMatcher: matchTelegramTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		authConfig: telegramAuthConfig,
		keyBuilder: async (ctx: TelegramKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new Error(
						'[auth-missing:telegram:webhook_signature]: Telegram webhook signature is missing',
					);
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'bot_token') {
				const res = await ctx.keys.get_bot_token();
				if (!res) {
					throw new Error(
						'[auth-missing:telegram:bot_token]: Telegram bot token is missing',
					);
				}
				return res;
			}

			throw new AuthMissingError('telegram', 'bot_token');
		},
	} satisfies InternalTelegramPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	TelegramEndpointInputs,
	TelegramEndpointOutputs,
} from './endpoints/types';
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
	TelegramChat,
	TelegramMessage,
	TelegramUpdate,
	TelegramUser,
	TelegramWebhookOutputs,
} from './webhooks/types';
