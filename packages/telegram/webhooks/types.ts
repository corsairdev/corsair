export interface TelegramUpdate {
	update_id: number;
	message?: TelegramMessage;
	edited_message?: TelegramMessage;
	channel_post?: TelegramMessage;
	edited_channel_post?: TelegramMessage;
	inline_query?: TelegramInlineQuery;
	callback_query?: TelegramCallbackQuery;
	shipping_query?: TelegramShippingQuery;
	pre_checkout_query?: TelegramPreCheckoutQuery;
	poll?: TelegramPoll;
	// Telegram API may include additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramMessage {
	message_id: number;
	from?: TelegramUser;
	sender_chat?: TelegramChat;
	date: number;
	chat: TelegramChat;
	forward_from?: TelegramUser;
	forward_from_chat?: TelegramChat;
	forward_from_message_id?: number;
	forward_signature?: string;
	forward_sender_name?: string;
	forward_date?: number;
	is_automatic_forward?: boolean;
	reply_to_message?: TelegramMessage;
	via_bot?: TelegramUser;
	edit_date?: number;
	has_protected_content?: boolean;
	media_group_id?: string;
	author_signature?: string;
	text?: string;
	entities?: TelegramMessageEntity[];
	caption?: string;
	caption_entities?: TelegramMessageEntity[];
	new_chat_members?: TelegramUser[];
	left_chat_member?: TelegramUser;
	new_chat_title?: string;
	delete_chat_photo?: boolean;
	group_chat_created?: boolean;
	supergroup_chat_created?: boolean;
	channel_chat_created?: boolean;
	migrate_to_chat_id?: number;
	migrate_from_chat_id?: number;
	pinned_message?: TelegramMessage;
	// Telegram message objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramUser {
	id: number;
	is_bot: boolean;
	first_name: string;
	last_name?: string;
	username?: string;
	language_code?: string;
	is_premium?: boolean;
	added_to_attachment_menu?: boolean;
	can_join_groups?: boolean;
	can_read_all_group_messages?: boolean;
	supports_inline_queries?: boolean;
	// Telegram user objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramChat {
	id: number;
	type: 'private' | 'group' | 'supergroup' | 'channel';
	title?: string;
	username?: string;
	first_name?: string;
	last_name?: string;
	is_forum?: boolean;
	active_usernames?: string[];
	emoji_status_custom_emoji_id?: string;
	bio?: string;
	has_private_forwards?: boolean;
	has_restricted_voice_and_video_messages?: boolean;
	join_to_send_messages?: boolean;
	join_by_request?: boolean;
	description?: string;
	invite_link?: string;
	pinned_message?: TelegramMessage;
	slow_mode_delay?: number;
	message_auto_delete_time?: number;
	has_aggressive_anti_spam_enabled?: boolean;
	has_hidden_members?: boolean;
	has_protected_content?: boolean;
	sticker_set_name?: string;
	can_set_sticker_set?: boolean;
	linked_chat_id?: number;
	// Telegram chat objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramMessageEntity {
	type: string;
	offset: number;
	length: number;
	url?: string;
	user?: TelegramUser;
	language?: string;
	custom_emoji_id?: string;
	// Telegram message entity objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramCallbackQuery {
	id: string;
	from: TelegramUser;
	message?: TelegramMessage;
	inline_message_id?: string;
	chat_instance: string;
	data?: string;
	game_short_name?: string;
	// Telegram callback query objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramInlineQuery {
	id: string;
	from: TelegramUser;
	query: string;
	offset: string;
	chat_type?: string;
	// Telegram inline query objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramShippingQuery {
	id: string;
	from: TelegramUser;
	invoice_payload: string;
	// Telegram shipping query objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramPreCheckoutQuery {
	id: string;
	from: TelegramUser;
	currency: string;
	total_amount: number;
	invoice_payload: string;
	shipping_option_id?: string;
	// Telegram pre-checkout query objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface TelegramPoll {
	id: string;
	question: string;
	options: Array<{
		text: string;
		voter_count: number;
		// Telegram poll option objects may contain additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	}>;
	total_voter_count: number;
	is_closed: boolean;
	is_anonymous: boolean;
	type: string;
	allows_multiple_answers: boolean;
	correct_option_id?: number;
	explanation?: string;
	explanation_entities?: TelegramMessageEntity[];
	open_period?: number;
	close_date?: number;
	// Telegram poll objects may contain additional fields not explicitly typed - unknown allows for safe extension
	[key: string]: unknown;
}

export interface CallbackQueryEvent {
	update_id: number;
	callback_query: TelegramCallbackQuery;
}

export interface ChannelPostEvent {
	update_id: number;
	channel_post: TelegramMessage;
}

export interface EditedChannelPostEvent {
	update_id: number;
	edited_channel_post: TelegramMessage;
}

export interface EditedMessageEvent {
	update_id: number;
	edited_message: TelegramMessage;
}

export interface InlineQueryEvent {
	update_id: number;
	inline_query: TelegramInlineQuery;
}

export interface MessageEvent {
	update_id: number;
	message: TelegramMessage;
}

export interface PollEvent {
	update_id: number;
	poll: TelegramPoll;
}

export interface PreCheckoutQueryEvent {
	update_id: number;
	pre_checkout_query: TelegramPreCheckoutQuery;
}

export interface ShippingQueryEvent {
	update_id: number;
	shipping_query: TelegramShippingQuery;
}

export type TelegramWebhookOutputs = {
	callbackQuery: CallbackQueryEvent;
	channelPost: ChannelPostEvent;
	editedChannelPost: EditedChannelPostEvent;
	editedMessage: EditedMessageEvent;
	inlineQuery: InlineQueryEvent;
	message: MessageEvent;
	poll: PollEvent;
	preCheckoutQuery: PreCheckoutQueryEvent;
	shippingQuery: ShippingQueryEvent;
};

import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';

// Body can be string or object from webhook request - unknown ensures type safety before parsing
function parseBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
}

export function createTelegramMatch(
	eventType: keyof TelegramUpdate,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// parseBody returns unknown; cast is safe because Telegram only sends TelegramUpdate objects to this endpoint
		const parsedBody = parseBody(request.body) as TelegramUpdate;

		if (!parsedBody || typeof parsedBody !== 'object') {
			return false;
		}

		return eventType in parsedBody && parsedBody[eventType] !== undefined;
	};
}

export function verifyTelegramWebhookSignature(
	request: WebhookRequest<unknown>,
	secretToken: string,
): { valid: boolean; error?: string } {
	if (!secretToken) {
		// No secret configured — skip verification (valid deployment scenario)
		return { valid: true };
	}

	const headers = request.headers;
	const providedToken = Array.isArray(
		headers['x-telegram-bot-api-secret-token'],
	)
		? headers['x-telegram-bot-api-secret-token'][0]
		: headers['x-telegram-bot-api-secret-token'];

	if (!providedToken) {
		return {
			valid: false,
			error: 'Missing x-telegram-bot-api-secret-token header',
		};
	}

	const isValid = providedToken === secretToken;

	return {
		valid: isValid,
		error: isValid ? undefined : 'Invalid secret token',
	};
}
