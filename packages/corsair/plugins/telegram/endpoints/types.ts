import { z } from 'zod';

const GetChatInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
});

const GetChatAdministratorsInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
});

const GetChatMemberInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	user_id: z.number(),
});

const AnswerCallbackQueryInputSchema = z.object({
	callback_query_id: z.string(),
	text: z.string().optional(),
	show_alert: z.boolean().optional(),
	url: z.string().optional(),
	cache_time: z.number().optional(),
});

const AnswerInlineQueryInputSchema = z.object({
	inline_query_id: z.string(),
	results: z.array(z.unknown()),
	cache_time: z.number().optional(),
	is_personal: z.boolean().optional(),
	next_offset: z.string().optional(),
	switch_pm_text: z.string().optional(),
	switch_pm_parameter: z.string().optional(),
});

const GetFileInputSchema = z.object({
	file_id: z.string(),
});

const SendMessageInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	text: z.string(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	entities: z.array(z.unknown()).optional(),
	disable_web_page_preview: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const SendMessageAndWaitForResponseInputSchema = SendMessageInputSchema;

const EditMessageTextInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]).optional(),
	message_id: z.number().optional(),
	inline_message_id: z.string().optional(),
	text: z.string(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	entities: z.array(z.unknown()).optional(),
	disable_web_page_preview: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const DeleteMessageInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	message_id: z.number(),
});

const PinChatMessageInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	message_id: z.number(),
	disable_notification: z.boolean().optional(),
});

const UnpinChatMessageInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	message_id: z.number().optional(),
});

const SendPhotoInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	photo: z.union([z.string(), z.instanceof(File)]),
	caption: z.string().optional(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	caption_entities: z.array(z.unknown()).optional(),
	has_spoiler: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const SendVideoInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	video: z.union([z.string(), z.instanceof(File)]),
	duration: z.number().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	thumb: z.union([z.string(), z.instanceof(File)]).optional(),
	caption: z.string().optional(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	caption_entities: z.array(z.unknown()).optional(),
	has_spoiler: z.boolean().optional(),
	supports_streaming: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const SendAudioInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	audio: z.union([z.string(), z.instanceof(File)]),
	caption: z.string().optional(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	caption_entities: z.array(z.unknown()).optional(),
	duration: z.number().optional(),
	performer: z.string().optional(),
	title: z.string().optional(),
	thumb: z.union([z.string(), z.instanceof(File)]).optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const SendDocumentInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	document: z.union([z.string(), z.instanceof(File)]),
	thumb: z.union([z.string(), z.instanceof(File)]).optional(),
	caption: z.string().optional(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	caption_entities: z.array(z.unknown()).optional(),
	disable_content_type_detection: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const SendStickerInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	sticker: z.union([z.string(), z.instanceof(File)]),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const SendAnimationInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	animation: z.union([z.string(), z.instanceof(File)]),
	duration: z.number().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	thumb: z.union([z.string(), z.instanceof(File)]).optional(),
	caption: z.string().optional(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	caption_entities: z.array(z.unknown()).optional(),
	has_spoiler: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const SendLocationInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	latitude: z.number(),
	longitude: z.number(),
	horizontal_accuracy: z.number().optional(),
	live_period: z.number().optional(),
	heading: z.number().optional(),
	proximity_alert_radius: z.number().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: z.unknown().optional(),
});

const SendMediaGroupInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	media: z.array(z.unknown()),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
});

const SendChatActionInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	action: z.enum([
		'typing',
		'upload_photo',
		'record_video',
		'upload_video',
		'record_voice',
		'upload_voice',
		'upload_document',
		'choose_sticker',
		'find_location',
		'record_video_note',
		'upload_video_note',
	]),
});

const SetWebhookInputSchema = z.object({
	url: z.string().url(),
	secret_token: z.string().optional(),
	certificate: z.unknown().optional(),
	ip_address: z.string().optional(),
	max_connections: z.number().optional(),
	allowed_updates: z.array(z.string()).optional(),
	drop_pending_updates: z.boolean().optional(),
});

const DeleteWebhookInputSchema = z.object({
	drop_pending_updates: z.boolean().optional(),
});

const GetUpdatesInputSchema = z.object({
	offset: z.number().optional(),
	limit: z.number().optional(),
	timeout: z.number().optional(),
	allowed_updates: z.array(z.string()).optional(),
});

const GetMeInputSchema = z.object({});

export type TelegramEndpointInputs = {
	getChat: z.infer<typeof GetChatInputSchema>;
	getChatAdministrators: z.infer<typeof GetChatAdministratorsInputSchema>;
	getChatMember: z.infer<typeof GetChatMemberInputSchema>;
	answerCallbackQuery: z.infer<typeof AnswerCallbackQueryInputSchema>;
	answerInlineQuery: z.infer<typeof AnswerInlineQueryInputSchema>;
	getFile: z.infer<typeof GetFileInputSchema>;
	sendMessage: z.infer<typeof SendMessageInputSchema>;
	sendMessageAndWaitForResponse: z.infer<typeof SendMessageAndWaitForResponseInputSchema>;
	editMessageText: z.infer<typeof EditMessageTextInputSchema>;
	deleteMessage: z.infer<typeof DeleteMessageInputSchema>;
	pinChatMessage: z.infer<typeof PinChatMessageInputSchema>;
	unpinChatMessage: z.infer<typeof UnpinChatMessageInputSchema>;
	sendPhoto: z.infer<typeof SendPhotoInputSchema>;
	sendVideo: z.infer<typeof SendVideoInputSchema>;
	sendAudio: z.infer<typeof SendAudioInputSchema>;
	sendDocument: z.infer<typeof SendDocumentInputSchema>;
	sendSticker: z.infer<typeof SendStickerInputSchema>;
	sendAnimation: z.infer<typeof SendAnimationInputSchema>;
	sendLocation: z.infer<typeof SendLocationInputSchema>;
	sendMediaGroup: z.infer<typeof SendMediaGroupInputSchema>;
	sendChatAction: z.infer<typeof SendChatActionInputSchema>;
	setWebhook: z.infer<typeof SetWebhookInputSchema>;
	deleteWebhook: z.infer<typeof DeleteWebhookInputSchema>;
	getUpdates: z.infer<typeof GetUpdatesInputSchema>;
	getMe: z.infer<typeof GetMeInputSchema>;
};

export type TelegramEndpointOutputs = {
	getChat: {
		id: number;
		type: string;
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
		pinned_message?: unknown;
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
	};
	getChatAdministrators: Array<{
		status: string;
		user: unknown;
		[key: string]: unknown;
	}>;
	getChatMember: {
		status: string;
		user: unknown;
		[key: string]: unknown;
	};
	answerCallbackQuery: boolean;
	answerInlineQuery: boolean;
	getFile: {
		file_id: string;
		file_unique_id: string;
		file_size?: number;
		file_path?: string;
	};
	sendMessage: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		text?: string;
		[key: string]: unknown;
	};
	sendMessageAndWaitForResponse: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		text?: string;
		[key: string]: unknown;
	};
	editMessageText: {
		message_id?: number;
		from?: unknown;
		date?: number;
		chat?: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		text?: string;
		[key: string]: unknown;
	} | boolean;
	deleteMessage: boolean;
	pinChatMessage: boolean;
	unpinChatMessage: boolean;
	sendPhoto: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		photo?: unknown[];
		caption?: string;
		[key: string]: unknown;
	};
	sendVideo: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		video?: unknown;
		caption?: string;
		[key: string]: unknown;
	};
	sendAudio: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		audio?: unknown;
		caption?: string;
		[key: string]: unknown;
	};
	sendDocument: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		document?: unknown;
		caption?: string;
		[key: string]: unknown;
	};
	sendSticker: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		sticker?: unknown;
		[key: string]: unknown;
	};
	sendAnimation: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		animation?: unknown;
		caption?: string;
		[key: string]: unknown;
	};
	sendLocation: {
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		location?: unknown;
		[key: string]: unknown;
	};
	sendMediaGroup: Array<{
		message_id: number;
		from?: unknown;
		date: number;
		chat: {
			id: number;
			type: string;
			[key: string]: unknown;
		};
		[key: string]: unknown;
	}>;
	sendChatAction: boolean;
	setWebhook: {
		ok: boolean;
		result: boolean;
		description?: string;
	};
	deleteWebhook: {
		ok: boolean;
		result: boolean;
		description?: string;
	};
	getUpdates: Array<{
		update_id: number;
		message?: {
			message_id: number;
			from?: {
				id: number;
				is_bot: boolean;
				first_name?: string;
				last_name?: string;
				username?: string;
				language_code?: string;
				[key: string]: unknown;
			};
			chat: {
				id: number;
				type: string;
				title?: string;
				username?: string;
				first_name?: string;
				last_name?: string;
				[key: string]: unknown;
			};
			date: number;
			text?: string;
			[key: string]: unknown;
		};
		edited_message?: unknown;
		channel_post?: unknown;
		edited_channel_post?: unknown;
		inline_query?: unknown;
		callback_query?: unknown;
		[key: string]: unknown;
	}>;
	getMe: {
		id: number;
		is_bot: boolean;
		first_name: string;
		username?: string;
		can_join_groups?: boolean;
		can_read_all_group_messages?: boolean;
		supports_inline_queries?: boolean;
		[key: string]: unknown;
	};
};
