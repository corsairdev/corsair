import { z } from 'zod';

const TelegramUserSchema = z.object({
	id: z.number(),
	is_bot: z.boolean(),
	first_name: z.string(),
	last_name: z.string().optional(),
	username: z.string().optional(),
	language_code: z.string().optional(),
	is_premium: z.boolean().optional(),
	added_to_attachment_menu: z.boolean().optional(),
	can_join_groups: z.boolean().optional(),
	can_read_all_group_messages: z.boolean().optional(),
	supports_inline_queries: z.boolean().optional(),
});

const TelegramChatPhotoSchema = z.object({
	small_file_id: z.string(),
	small_file_unique_id: z.string(),
	big_file_id: z.string(),
	big_file_unique_id: z.string(),
});

const TelegramChatPermissionsSchema = z.object({
	can_send_messages: z.boolean().optional(),
	can_send_audios: z.boolean().optional(),
	can_send_documents: z.boolean().optional(),
	can_send_photos: z.boolean().optional(),
	can_send_videos: z.boolean().optional(),
	can_send_video_notes: z.boolean().optional(),
	can_send_voice_notes: z.boolean().optional(),
	can_send_polls: z.boolean().optional(),
	can_send_other_messages: z.boolean().optional(),
	can_add_web_page_previews: z.boolean().optional(),
	can_change_info: z.boolean().optional(),
	can_invite_users: z.boolean().optional(),
	can_pin_messages: z.boolean().optional(),
	can_manage_topics: z.boolean().optional(),
});

const TelegramChatLocationSchema = z.object({
	location: z.object({
		latitude: z.number(),
		longitude: z.number(),
		horizontal_accuracy: z.number().optional(),
		live_period: z.number().optional(),
		heading: z.number().optional(),
		proximity_alert_radius: z.number().optional(),
	}),
	address: z.string(),
});

const TelegramMaskPositionSchema = z.object({
	point: z.string(),
	x_shift: z.number(),
	y_shift: z.number(),
	scale: z.number(),
});

const TelegramWebAppInfoSchema = z.object({
	url: z.string(),
});

const TelegramLoginUrlSchema = z.object({
	url: z.string(),
	forward_text: z.string().optional(),
	bot_username: z.string().optional(),
	request_write_access: z.boolean().optional(),
});

const TelegramSwitchInlineQueryChosenChatSchema = z.object({
	query: z.string().optional(),
	allow_user_chats: z.boolean().optional(),
	allow_bot_chats: z.boolean().optional(),
	allow_group_chats: z.boolean().optional(),
	allow_channel_chats: z.boolean().optional(),
});

const TelegramKeyboardButtonPollTypeSchema = z.object({
	type: z.string().optional(),
});

// z.ZodType<any> required for mutually recursive schemas (TelegramChat references TelegramMessage and vice versa)
const TelegramChatSchema: z.ZodType<any> = z
	.object({
		id: z.number(),
		type: z.enum(['private', 'group', 'supergroup', 'channel']),
		title: z.string().optional(),
		username: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		is_forum: z.boolean().optional(),
		active_usernames: z.array(z.string()).optional(),
		emoji_status_custom_emoji_id: z.string().optional(),
		bio: z.string().optional(),
		has_private_forwards: z.boolean().optional(),
		has_restricted_voice_and_video_messages: z.boolean().optional(),
		join_to_send_messages: z.boolean().optional(),
		join_by_request: z.boolean().optional(),
		description: z.string().optional(),
		invite_link: z.string().optional(),
		pinned_message: z.lazy(() => TelegramMessageSchema).optional(),
		slow_mode_delay: z.number().optional(),
		message_auto_delete_time: z.number().optional(),
		has_aggressive_anti_spam_enabled: z.boolean().optional(),
		has_hidden_members: z.boolean().optional(),
		has_protected_content: z.boolean().optional(),
		sticker_set_name: z.string().optional(),
		can_set_sticker_set: z.boolean().optional(),
		linked_chat_id: z.number().optional(),
	})
	.passthrough();

const TelegramMessageEntitySchema = z.object({
	type: z.string(),
	offset: z.number(),
	length: z.number(),
	url: z.string().optional(),
	user: TelegramUserSchema.optional(),
	language: z.string().optional(),
	custom_emoji_id: z.string().optional(),
});

const TelegramPhotoSizeSchema = z.object({
	file_id: z.string(),
	file_unique_id: z.string(),
	width: z.number(),
	height: z.number(),
	file_size: z.number().optional(),
});

const TelegramVideoSchema = z.object({
	file_id: z.string(),
	file_unique_id: z.string(),
	width: z.number(),
	height: z.number(),
	duration: z.number(),
	thumb: TelegramPhotoSizeSchema.optional(),
	file_name: z.string().optional(),
	mime_type: z.string().optional(),
	file_size: z.number().optional(),
});

const TelegramAudioSchema = z.object({
	file_id: z.string(),
	file_unique_id: z.string(),
	duration: z.number(),
	performer: z.string().optional(),
	title: z.string().optional(),
	file_name: z.string().optional(),
	mime_type: z.string().optional(),
	file_size: z.number().optional(),
	thumb: TelegramPhotoSizeSchema.optional(),
});

const TelegramDocumentSchema = z.object({
	file_id: z.string(),
	file_unique_id: z.string(),
	thumb: TelegramPhotoSizeSchema.optional(),
	file_name: z.string().optional(),
	mime_type: z.string().optional(),
	file_size: z.number().optional(),
});

const TelegramStickerSchema = z.object({
	file_id: z.string(),
	file_unique_id: z.string(),
	type: z.string(),
	width: z.number(),
	height: z.number(),
	is_animated: z.boolean(),
	is_video: z.boolean(),
	thumb: TelegramPhotoSizeSchema.optional(),
	emoji: z.string().optional(),
	set_name: z.string().optional(),
	premium_animation: z
		.object({
			file_id: z.string(),
			file_unique_id: z.string(),
		})
		.optional(),
	mask_position: TelegramMaskPositionSchema.optional(),
	custom_emoji_id: z.string().optional(),
	needs_repainting: z.boolean().optional(),
	file_size: z.number().optional(),
});

const TelegramAnimationSchema = z.object({
	file_id: z.string(),
	file_unique_id: z.string(),
	width: z.number(),
	height: z.number(),
	duration: z.number(),
	thumb: TelegramPhotoSizeSchema.optional(),
	file_name: z.string().optional(),
	mime_type: z.string().optional(),
	file_size: z.number().optional(),
});

const TelegramLocationSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	horizontal_accuracy: z.number().optional(),
	live_period: z.number().optional(),
	heading: z.number().optional(),
	proximity_alert_radius: z.number().optional(),
});

// z.ZodType<any> required for mutually recursive schemas (TelegramMessage references TelegramChat and vice versa)
const TelegramMessageSchema: z.ZodType<any> = z.object({
	message_id: z.number(),
	from: TelegramUserSchema.optional(),
	sender_chat: TelegramChatSchema.optional(),
	date: z.number(),
	chat: z.object({
		id: z.number(),
		type: z.string(),
	}),
	forward_from: TelegramUserSchema.optional(),
	forward_from_chat: TelegramChatSchema.optional(),
	forward_from_message_id: z.number().optional(),
	forward_signature: z.string().optional(),
	forward_sender_name: z.string().optional(),
	forward_date: z.number().optional(),
	is_automatic_forward: z.boolean().optional(),
	reply_to_message: z.lazy(() => TelegramMessageSchema).optional(),
	via_bot: TelegramUserSchema.optional(),
	edit_date: z.number().optional(),
	has_protected_content: z.boolean().optional(),
	media_group_id: z.string().optional(),
	author_signature: z.string().optional(),
	text: z.string().optional(),
	entities: z.array(TelegramMessageEntitySchema).optional(),
	caption: z.string().optional(),
	caption_entities: z.array(TelegramMessageEntitySchema).optional(),
	photo: z.array(TelegramPhotoSizeSchema).optional(),
	video: TelegramVideoSchema.optional(),
	audio: TelegramAudioSchema.optional(),
	document: TelegramDocumentSchema.optional(),
	sticker: TelegramStickerSchema.optional(),
	animation: TelegramAnimationSchema.optional(),
	location: TelegramLocationSchema.optional(),
});

const TelegramInlineKeyboardButtonSchema = z.object({
	text: z.string(),
	url: z.string().optional(),
	callback_data: z.string().optional(),
	web_app: TelegramWebAppInfoSchema.optional(),
	login_url: TelegramLoginUrlSchema.optional(),
	switch_inline_query: z.string().optional(),
	switch_inline_query_current_chat: z.string().optional(),
	switch_inline_query_chosen_chat:
		TelegramSwitchInlineQueryChosenChatSchema.optional(),
	callback_game: z.object({}).passthrough().optional(),
	pay: z.boolean().optional(),
});

const TelegramInlineKeyboardMarkupSchema = z.object({
	inline_keyboard: z.array(z.array(TelegramInlineKeyboardButtonSchema)),
});

const TelegramKeyboardButtonSchema = z.object({
	text: z.string(),
	request_contact: z.boolean().optional(),
	request_location: z.boolean().optional(),
	request_poll: TelegramKeyboardButtonPollTypeSchema.optional(),
	web_app: TelegramWebAppInfoSchema.optional(),
});

const TelegramReplyKeyboardMarkupSchema = z.object({
	keyboard: z.array(z.array(TelegramKeyboardButtonSchema)),
	is_persistent: z.boolean().optional(),
	resize_keyboard: z.boolean().optional(),
	one_time_keyboard: z.boolean().optional(),
	input_field_placeholder: z.string().optional(),
	selective: z.boolean().optional(),
});

const TelegramReplyKeyboardRemoveSchema = z.object({
	remove_keyboard: z.literal(true),
	selective: z.boolean().optional(),
});

const TelegramForceReplySchema = z.object({
	force_reply: z.literal(true),
	input_field_placeholder: z.string().optional(),
	selective: z.boolean().optional(),
});

const TelegramReplyMarkupSchema = z.union([
	TelegramInlineKeyboardMarkupSchema,
	TelegramReplyKeyboardMarkupSchema,
	TelegramReplyKeyboardRemoveSchema,
	TelegramForceReplySchema,
]);

const TelegramInlineQueryResultSchema = z.object({
	type: z.string(),
	id: z.string(),
});

const TelegramInputMediaSchema = z.object({
	type: z.string(),
	media: z.string(),
	caption: z.string().optional(),
	parse_mode: z.string().optional(),
	caption_entities: z.array(TelegramMessageEntitySchema).optional(),
});

const TelegramChatMemberSchema = z
	.object({
		status: z.string(),
		user: TelegramUserSchema,
	})
	.passthrough();

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
	results: z.array(TelegramInlineQueryResultSchema),
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
	entities: z.array(TelegramMessageEntitySchema).optional(),
	disable_web_page_preview: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: TelegramReplyMarkupSchema.optional(),
});

const EditMessageTextInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]).optional(),
	message_id: z.number().optional(),
	inline_message_id: z.string().optional(),
	text: z.string(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	entities: z.array(TelegramMessageEntitySchema).optional(),
	disable_web_page_preview: z.boolean().optional(),
	reply_markup: TelegramReplyMarkupSchema.optional(),
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
	caption_entities: z.array(TelegramMessageEntitySchema).optional(),
	has_spoiler: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: TelegramReplyMarkupSchema.optional(),
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
	caption_entities: z.array(TelegramMessageEntitySchema).optional(),
	has_spoiler: z.boolean().optional(),
	supports_streaming: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: TelegramReplyMarkupSchema.optional(),
});

const SendAudioInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	audio: z.union([z.string(), z.instanceof(File)]),
	caption: z.string().optional(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	caption_entities: z.array(TelegramMessageEntitySchema).optional(),
	duration: z.number().optional(),
	performer: z.string().optional(),
	title: z.string().optional(),
	thumb: z.union([z.string(), z.instanceof(File)]).optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: TelegramReplyMarkupSchema.optional(),
});

const SendDocumentInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	document: z.union([z.string(), z.instanceof(File)]),
	thumb: z.union([z.string(), z.instanceof(File)]).optional(),
	caption: z.string().optional(),
	parse_mode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	caption_entities: z.array(TelegramMessageEntitySchema).optional(),
	disable_content_type_detection: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: TelegramReplyMarkupSchema.optional(),
});

const SendStickerInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	sticker: z.union([z.string(), z.instanceof(File)]),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: TelegramReplyMarkupSchema.optional(),
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
	caption_entities: z.array(TelegramMessageEntitySchema).optional(),
	has_spoiler: z.boolean().optional(),
	disable_notification: z.boolean().optional(),
	protect_content: z.boolean().optional(),
	reply_to_message_id: z.number().optional(),
	allow_sending_without_reply: z.boolean().optional(),
	reply_markup: TelegramReplyMarkupSchema.optional(),
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
	reply_markup: TelegramReplyMarkupSchema.optional(),
});

const SendMediaGroupInputSchema = z.object({
	chat_id: z.union([z.string(), z.number()]),
	media: z.array(TelegramInputMediaSchema),
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
	certificate: z.union([z.string(), z.instanceof(File)]).optional(),
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

const GetMeOutputSchema = z.object({
	id: z.number(),
	is_bot: z.boolean(),
	first_name: z.string(),
	username: z.string().optional(),
	can_join_groups: z.boolean().optional(),
	can_read_all_group_messages: z.boolean().optional(),
	supports_inline_queries: z.boolean().optional(),
});

const GetChatOutputSchema = z.object({
	id: z.number(),
	type: z.string(),
	title: z.string().optional(),
	username: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
});

const SendMessageOutputSchema = z.object({
	message_id: z.number(),
	from: TelegramUserSchema.optional(),
	date: z.number(),
	chat: z.object({
		id: z.number(),
		type: z.string(),
	}),
	text: z.string().optional(),
});

const GetUpdatesOutputSchema = z.array(
	z.object({
		update_id: z.number(),
		message: TelegramMessageSchema.optional(),
		edited_message: TelegramMessageSchema.optional(),
		channel_post: TelegramMessageSchema.optional(),
		callback_query: z
			.object({
				id: z.string(),
				from: TelegramUserSchema,
				message: TelegramMessageSchema.optional(),
				inline_message_id: z.string().optional(),
				chat_instance: z.string(),
				data: z.string().optional(),
				game_short_name: z.string().optional(),
			})
			.optional(),
	}),
);

const GetFileOutputSchema = z.object({
	file_id: z.string(),
	file_unique_id: z.string(),
	file_size: z.number().optional(),
	file_path: z.string().optional(),
});

const SendPhotoOutputSchema = z.object({
	message_id: z.number(),
	from: TelegramUserSchema.optional(),
	date: z.number(),
	chat: z.object({
		id: z.number(),
		type: z.string(),
	}),
	photo: z.array(TelegramPhotoSizeSchema).optional(),
	caption: z.string().optional(),
});

export {
	GetMeOutputSchema,
	GetChatOutputSchema,
	SendMessageOutputSchema,
	GetUpdatesOutputSchema,
	GetFileOutputSchema,
	SendPhotoOutputSchema,
};

export type TelegramEndpointInputs = {
	getChat: z.infer<typeof GetChatInputSchema>;
	getChatAdministrators: z.infer<typeof GetChatAdministratorsInputSchema>;
	getChatMember: z.infer<typeof GetChatMemberInputSchema>;
	answerCallbackQuery: z.infer<typeof AnswerCallbackQueryInputSchema>;
	answerInlineQuery: z.infer<typeof AnswerInlineQueryInputSchema>;
	getFile: z.infer<typeof GetFileInputSchema>;
	sendMessage: z.infer<typeof SendMessageInputSchema>;
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
		type: 'private' | 'group' | 'supergroup' | 'channel';
		title?: string;
		username?: string;
		first_name?: string;
		last_name?: string;
		is_forum?: boolean;
		photo?: z.infer<typeof TelegramChatPhotoSchema>;
		active_usernames?: string[];
		emoji_status_custom_emoji_id?: string;
		bio?: string;
		has_private_forwards?: boolean;
		has_restricted_voice_and_video_messages?: boolean;
		join_to_send_messages?: boolean;
		join_by_request?: boolean;
		description?: string;
		invite_link?: string;
		pinned_message?: z.infer<typeof TelegramMessageSchema>;
		permissions?: z.infer<typeof TelegramChatPermissionsSchema>;
		slow_mode_delay?: number;
		message_auto_delete_time?: number;
		has_aggressive_anti_spam_enabled?: boolean;
		has_hidden_members?: boolean;
		has_protected_content?: boolean;
		sticker_set_name?: string;
		can_set_sticker_set?: boolean;
		linked_chat_id?: number;
		location?: z.infer<typeof TelegramChatLocationSchema>;
		// Telegram chat response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	getChatAdministrators: Array<{
		status: string;
		user: z.infer<typeof TelegramUserSchema>;
		// Telegram chat administrator response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	}>;
	getChatMember: {
		status: string;
		user: z.infer<typeof TelegramUserSchema>;
		// Telegram chat member response may include additional fields not explicitly typed - unknown allows for safe extension
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
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		text?: string;
		// Telegram send message response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	editMessageText:
		| {
				message_id?: number;
				from?: z.infer<typeof TelegramUserSchema>;
				date?: number;
				chat?: {
					id: number;
					type: string;
					// Telegram chat object in edit message response may include additional fields not explicitly typed - unknown allows for safe extension
					[key: string]: unknown;
				};
				text?: string;
				// Telegram edit message response may include additional fields not explicitly typed - unknown allows for safe extension
				[key: string]: unknown;
		  }
		| boolean;
	deleteMessage: boolean;
	pinChatMessage: boolean;
	unpinChatMessage: boolean;
	sendPhoto: {
		message_id: number;
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in photo message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		photo?: z.infer<typeof TelegramPhotoSizeSchema>[];
		caption?: string;
		// Telegram send photo response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	sendVideo: {
		message_id: number;
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in video message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		video?: z.infer<typeof TelegramVideoSchema>;
		caption?: string;
		// Telegram send video response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	sendAudio: {
		message_id: number;
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in audio message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		audio?: z.infer<typeof TelegramAudioSchema>;
		caption?: string;
		// Telegram send audio response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	sendDocument: {
		message_id: number;
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in document message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		document?: z.infer<typeof TelegramDocumentSchema>;
		caption?: string;
		// Telegram send document response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	sendSticker: {
		message_id: number;
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in sticker message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		sticker?: z.infer<typeof TelegramStickerSchema>;
		// Telegram send sticker response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	sendAnimation: {
		message_id: number;
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in animation message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		animation?: z.infer<typeof TelegramAnimationSchema>;
		caption?: string;
		// Telegram send animation response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	sendLocation: {
		message_id: number;
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in location message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		location?: z.infer<typeof TelegramLocationSchema>;
		// Telegram send location response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
	sendMediaGroup: Array<{
		message_id: number;
		from?: z.infer<typeof TelegramUserSchema>;
		date: number;
		chat: {
			id: number;
			type: string;
			// Telegram chat object in media group message response may include additional fields not explicitly typed - unknown allows for safe extension
			[key: string]: unknown;
		};
		// Telegram send media group response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	}>;
	sendChatAction: boolean;
	setWebhook: boolean;
	deleteWebhook: boolean;
	getUpdates: Array<{
		update_id: number;
		message?: z.infer<typeof TelegramMessageSchema>;
		edited_message?: z.infer<typeof TelegramMessageSchema>;
		channel_post?: z.infer<typeof TelegramMessageSchema>;
		edited_channel_post?: z.infer<typeof TelegramMessageSchema>;
		inline_query?: {
			id: string;
			from: z.infer<typeof TelegramUserSchema>;
			query: string;
			offset: string;
			chat_type?: string;
		};
		callback_query?: {
			id: string;
			from: z.infer<typeof TelegramUserSchema>;
			message?: z.infer<typeof TelegramMessageSchema>;
			inline_message_id?: string;
			chat_instance: string;
			data?: string;
			game_short_name?: string;
		};
		// Telegram get updates response may include additional fields not explicitly typed - unknown allows for safe extension
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
		// Telegram bot info response may include additional fields not explicitly typed - unknown allows for safe extension
		[key: string]: unknown;
	};
};
