export interface TelegramUpdate {
	update_id: number;
	message?: TelegramMessage;
	edited_message?: TelegramMessage;
	channel_post?: TelegramMessage;
	edited_channel_post?: TelegramMessage;
	inline_query?: TelegramInlineQuery;
	chosen_inline_result?: unknown;
	callback_query?: TelegramCallbackQuery;
	shipping_query?: TelegramShippingQuery;
	pre_checkout_query?: TelegramPreCheckoutQuery;
	poll?: TelegramPoll;
	poll_answer?: unknown;
	my_chat_member?: unknown;
	chat_member?: unknown;
	chat_join_request?: unknown;
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
	animation?: unknown;
	audio?: unknown;
	document?: unknown;
	photo?: unknown[];
	sticker?: unknown;
	video?: unknown;
	video_note?: unknown;
	voice?: unknown;
	caption?: string;
	caption_entities?: TelegramMessageEntity[];
	contact?: unknown;
	dice?: unknown;
	game?: unknown;
	poll?: TelegramPoll;
	venue?: unknown;
	location?: unknown;
	new_chat_members?: TelegramUser[];
	new_chat_member?: TelegramUser;
	left_chat_member?: TelegramUser;
	new_chat_title?: string;
	new_chat_photo?: unknown[];
	delete_chat_photo?: boolean;
	group_chat_created?: boolean;
	supergroup_chat_created?: boolean;
	channel_chat_created?: boolean;
	message_auto_delete_timer_changed?: unknown;
	migrate_to_chat_id?: number;
	migrate_from_chat_id?: number;
	pinned_message?: TelegramMessage;
	invoice?: unknown;
	successful_payment?: unknown;
	connected_website?: string;
	write_access_allowed?: unknown;
	passport_data?: unknown;
	proximity_alert_triggered?: unknown;
	forum_topic_created?: unknown;
	forum_topic_closed?: unknown;
	forum_topic_reopened?: unknown;
	general_forum_topic_hidden?: unknown;
	general_forum_topic_unhidden?: unknown;
	video_chat_scheduled?: unknown;
	video_chat_started?: unknown;
	video_chat_ended?: unknown;
	video_chat_participants_invited?: unknown;
	web_app_data?: unknown;
	reply_markup?: unknown;
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
	photo?: unknown;
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
	permissions?: unknown;
	slow_mode_delay?: number;
	message_auto_delete_time?: number;
	has_aggressive_anti_spam_enabled?: boolean;
	has_hidden_members?: boolean;
	has_protected_content?: boolean;
	sticker_set_name?: string;
	can_set_sticker_set?: boolean;
	linked_chat_id?: number;
	location?: unknown;
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
	[key: string]: unknown;
}

export interface TelegramInlineQuery {
	id: string;
	from: TelegramUser;
	query: string;
	offset: string;
	chat_type?: string;
	location?: unknown;
	[key: string]: unknown;
}

export interface TelegramShippingQuery {
	id: string;
	from: TelegramUser;
	invoice_payload: string;
	shipping_address: unknown;
	[key: string]: unknown;
}

export interface TelegramPreCheckoutQuery {
	id: string;
	from: TelegramUser;
	currency: string;
	total_amount: number;
	invoice_payload: string;
	shipping_option_id?: string;
	order_info?: unknown;
	[key: string]: unknown;
}

export interface TelegramPoll {
	id: string;
	question: string;
	options: Array<{
		text: string;
		voter_count: number;
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
} from '../../../core';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createTelegramMatch(eventType: keyof TelegramUpdate): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
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
		return { valid: true };
	}

	const headers = request.headers;
	const providedToken = Array.isArray(headers['x-telegram-bot-api-secret-token'])
		? headers['x-telegram-bot-api-secret-token'][0]
		: headers['x-telegram-bot-api-secret-token'];

	if (!providedToken) {
		return { valid: false, error: 'Missing secret token header' };
	}

	const isValid = providedToken === secretToken;

	return {
		valid: isValid,
		error: isValid ? undefined : 'Invalid secret token',
	};
}
