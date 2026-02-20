import { logEventFromContext } from '../../utils/events';
import type { TelegramEndpoints } from '..';
import { makeTelegramRequest } from '../client';
import type { TelegramEndpointOutputs } from './types';

export const sendMessage: TelegramEndpoints['sendMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['sendMessage']>(
		'sendMessage',
		ctx.key,
		{
			method: 'POST',
			body: {
				chat_id: input.chat_id,
				text: input.text,
				parse_mode: input.parse_mode,
				entities: input.entities,
				disable_web_page_preview: input.disable_web_page_preview,
				disable_notification: input.disable_notification,
				protect_content: input.protect_content,
				reply_to_message_id: input.reply_to_message_id,
				allow_sending_without_reply: input.allow_sending_without_reply,
				reply_markup: input.reply_markup,
			},
		},
	);

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendMessage',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendMessageAndWaitForResponse: TelegramEndpoints['sendMessageAndWaitForResponse'] =
	async (ctx, input) => {
		const result = await makeTelegramRequest<
			TelegramEndpointOutputs['sendMessageAndWaitForResponse']
		>('sendMessage', ctx.key, {
			method: 'POST',
			body: {
				chat_id: input.chat_id,
				text: input.text,
				parse_mode: input.parse_mode,
				entities: input.entities,
				disable_web_page_preview: input.disable_web_page_preview,
				disable_notification: input.disable_notification,
				protect_content: input.protect_content,
				reply_to_message_id: input.reply_to_message_id,
				allow_sending_without_reply: input.allow_sending_without_reply,
				reply_markup: input.reply_markup,
			},
		});

		await logEventFromContext(
			ctx,
			'telegram.messages.sendMessageAndWaitForResponse',
			{ ...input },
			'completed',
		);
		return result;
	};

export const editMessageText: TelegramEndpoints['editMessageText'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['editMessageText']
	>('editMessageText', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			message_id: input.message_id,
			inline_message_id: input.inline_message_id,
			text: input.text,
			parse_mode: input.parse_mode,
			entities: input.entities,
			disable_web_page_preview: input.disable_web_page_preview,
			reply_markup: input.reply_markup,
		},
	});

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to update message in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.editMessageText',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteMessage: TelegramEndpoints['deleteMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['deleteMessage']
	>('deleteMessage', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			message_id: input.message_id,
		},
	});

	if (result && ctx.db.messages) {
		try {
			await ctx.db.messages.deleteByEntityId(input.message_id.toString());
		} catch (error) {
			console.warn('Failed to delete message from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.deleteMessage',
		{ ...input },
		'completed',
	);
	return result;
};

export const pinChatMessage: TelegramEndpoints['pinChatMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['pinChatMessage']
	>('pinChatMessage', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			message_id: input.message_id,
			disable_notification: input.disable_notification,
		},
	});

	await logEventFromContext(
		ctx,
		'telegram.messages.pinChatMessage',
		{ ...input },
		'completed',
	);
	return result;
};

export const unpinChatMessage: TelegramEndpoints['unpinChatMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['unpinChatMessage']
	>('unpinChatMessage', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			message_id: input.message_id,
		},
	});

	await logEventFromContext(
		ctx,
		'telegram.messages.unpinChatMessage',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendPhoto: TelegramEndpoints['sendPhoto'] = async (ctx, input) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['sendPhoto']>(
		'sendPhoto',
		ctx.key,
		{
			method: 'POST',
			body: {
				chat_id: input.chat_id,
				photo: input.photo,
				caption: input.caption,
				parse_mode: input.parse_mode,
				caption_entities: input.caption_entities,
				has_spoiler: input.has_spoiler,
				disable_notification: input.disable_notification,
				protect_content: input.protect_content,
				reply_to_message_id: input.reply_to_message_id,
				allow_sending_without_reply: input.allow_sending_without_reply,
				reply_markup: input.reply_markup,
			},
		},
	);

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save photo message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendPhoto',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendVideo: TelegramEndpoints['sendVideo'] = async (ctx, input) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['sendVideo']>(
		'sendVideo',
		ctx.key,
		{
			method: 'POST',
			body: {
				chat_id: input.chat_id,
				video: input.video,
				duration: input.duration,
				width: input.width,
				height: input.height,
				thumb: input.thumb,
				caption: input.caption,
				parse_mode: input.parse_mode,
				caption_entities: input.caption_entities,
				has_spoiler: input.has_spoiler,
				supports_streaming: input.supports_streaming,
				disable_notification: input.disable_notification,
				protect_content: input.protect_content,
				reply_to_message_id: input.reply_to_message_id,
				allow_sending_without_reply: input.allow_sending_without_reply,
				reply_markup: input.reply_markup,
			},
		},
	);

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save video message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendVideo',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendAudio: TelegramEndpoints['sendAudio'] = async (ctx, input) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['sendAudio']>(
		'sendAudio',
		ctx.key,
		{
			method: 'POST',
			body: {
				chat_id: input.chat_id,
				audio: input.audio,
				caption: input.caption,
				parse_mode: input.parse_mode,
				caption_entities: input.caption_entities,
				duration: input.duration,
				performer: input.performer,
				title: input.title,
				thumb: input.thumb,
				disable_notification: input.disable_notification,
				protect_content: input.protect_content,
				reply_to_message_id: input.reply_to_message_id,
				allow_sending_without_reply: input.allow_sending_without_reply,
				reply_markup: input.reply_markup,
			},
		},
	);

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save audio message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendAudio',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendDocument: TelegramEndpoints['sendDocument'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['sendDocument']
	>('sendDocument', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			document: input.document,
			thumb: input.thumb,
			caption: input.caption,
			parse_mode: input.parse_mode,
			caption_entities: input.caption_entities,
			disable_content_type_detection: input.disable_content_type_detection,
			disable_notification: input.disable_notification,
			protect_content: input.protect_content,
			reply_to_message_id: input.reply_to_message_id,
			allow_sending_without_reply: input.allow_sending_without_reply,
			reply_markup: input.reply_markup,
		},
	});

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save document message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendDocument',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendSticker: TelegramEndpoints['sendSticker'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['sendSticker']
	>('sendSticker', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			sticker: input.sticker,
			disable_notification: input.disable_notification,
			protect_content: input.protect_content,
			reply_to_message_id: input.reply_to_message_id,
			allow_sending_without_reply: input.allow_sending_without_reply,
			reply_markup: input.reply_markup,
		},
	});

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save sticker message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendSticker',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendAnimation: TelegramEndpoints['sendAnimation'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['sendAnimation']
	>('sendAnimation', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			animation: input.animation,
			duration: input.duration,
			width: input.width,
			height: input.height,
			thumb: input.thumb,
			caption: input.caption,
			parse_mode: input.parse_mode,
			caption_entities: input.caption_entities,
			has_spoiler: input.has_spoiler,
			disable_notification: input.disable_notification,
			protect_content: input.protect_content,
			reply_to_message_id: input.reply_to_message_id,
			allow_sending_without_reply: input.allow_sending_without_reply,
			reply_markup: input.reply_markup,
		},
	});

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save animation message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendAnimation',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendLocation: TelegramEndpoints['sendLocation'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['sendLocation']
	>('sendLocation', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			latitude: input.latitude,
			longitude: input.longitude,
			horizontal_accuracy: input.horizontal_accuracy,
			live_period: input.live_period,
			heading: input.heading,
			proximity_alert_radius: input.proximity_alert_radius,
			disable_notification: input.disable_notification,
			protect_content: input.protect_content,
			reply_to_message_id: input.reply_to_message_id,
			allow_sending_without_reply: input.allow_sending_without_reply,
			reply_markup: input.reply_markup,
		},
	});

	if (result && result.message_id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.message_id.toString(), {
				...result,
				message_id: result.message_id,
				chat_id: result.chat.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save location message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendLocation',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendMediaGroup: TelegramEndpoints['sendMediaGroup'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['sendMediaGroup']
	>('sendMediaGroup', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			media: input.media,
			disable_notification: input.disable_notification,
			protect_content: input.protect_content,
			reply_to_message_id: input.reply_to_message_id,
			allow_sending_without_reply: input.allow_sending_without_reply,
		},
	});

	if (result && Array.isArray(result) && ctx.db.messages) {
		try {
			for (const message of result) {
				if (message.message_id) {
					await ctx.db.messages.upsertByEntityId(message.message_id.toString(), {
						...message,
						message_id: message.message_id,
						chat_id: message.chat.id.toString(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save media group messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.messages.sendMediaGroup',
		{ ...input },
		'completed',
	);
	return result;
};

export const sendChatAction: TelegramEndpoints['sendChatAction'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['sendChatAction']
	>('sendChatAction', ctx.key, {
		method: 'POST',
		body: {
			chat_id: input.chat_id,
			action: input.action,
		},
	});

	await logEventFromContext(
		ctx,
		'telegram.messages.sendChatAction',
		{ ...input },
		'completed',
	);
	return result;
};
