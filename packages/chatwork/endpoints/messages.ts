import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest, pathSegment } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const list: ChatworkEndpoints['messagesList'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.messagesList.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesList'] | null
	>(`rooms/${pathSegment(parsedInput.room_id)}/messages`, ctx.key, {
		method: 'GET',
		query: { force: parsedInput.force },
		authType: ctx.options?.authType,
	});
	const validatedResult = ChatworkEndpointOutputSchemas.messagesList.parse(
		result ?? [],
	);

	if (ctx.db.messages) {
		try {
			for (const message of validatedResult) {
				await ctx.db.messages.upsertByEntityId(message.message_id, {
					...message,
					room_id: parsedInput.room_id,
				});
			}
		} catch (error) {
			console.warn('Failed to save Chatwork messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.messages.list',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};

export const get: ChatworkEndpoints['messagesGet'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.messagesGet.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesGet']
	>(
		`rooms/${pathSegment(parsedInput.room_id)}/messages/${pathSegment(parsedInput.message_id)}`,
		ctx.key,
		{
			method: 'GET',
			authType: ctx.options?.authType,
		},
	);
	const validatedResult =
		ChatworkEndpointOutputSchemas.messagesGet.parse(result);

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(validatedResult.message_id, {
				...validatedResult,
				room_id: parsedInput.room_id,
			});
		} catch (error) {
			console.warn('Failed to save Chatwork message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.messages.get',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};

export const send: ChatworkEndpoints['messagesSend'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.messagesSend.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesSend']
	>(`rooms/${pathSegment(parsedInput.room_id)}/messages`, ctx.key, {
		method: 'POST',
		form: { body: parsedInput.body, self_unread: parsedInput.self_unread },
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.messagesSend.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.messages.send',
		{
			room_id: parsedInput.room_id,
			self_unread: parsedInput.self_unread,
			body_length: parsedInput.body.length,
		},
		'completed',
	);

	return validatedResult;
};

export const update: ChatworkEndpoints['messagesUpdate'] = async (
	ctx,
	input,
) => {
	const { room_id, message_id, body } =
		ChatworkEndpointInputSchemas.messagesUpdate.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesUpdate']
	>(
		`rooms/${pathSegment(room_id)}/messages/${pathSegment(message_id)}`,
		ctx.key,
		{
			method: 'PUT',
			form: { body },
			authType: ctx.options?.authType,
		},
	);
	const validatedResult =
		ChatworkEndpointOutputSchemas.messagesUpdate.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.messages.update',
		{ room_id, message_id, body_length: body.length },
		'completed',
	);

	return validatedResult;
};

export const deleteMessage: ChatworkEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	const { room_id, message_id } =
		ChatworkEndpointInputSchemas.messagesDelete.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesDelete']
	>(
		`rooms/${pathSegment(room_id)}/messages/${pathSegment(message_id)}`,
		ctx.key,
		{
			method: 'DELETE',
			authType: ctx.options?.authType,
		},
	);
	const validatedResult =
		ChatworkEndpointOutputSchemas.messagesDelete.parse(result);

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.deleteByEntityId(message_id);
		} catch (error) {
			console.warn('Failed to remove Chatwork message from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.messages.delete',
		{ room_id, message_id },
		'completed',
	);

	return validatedResult;
};

export const markRead: ChatworkEndpoints['messagesMarkRead'] = async (
	ctx,
	input,
) => {
	const { room_id, message_id } =
		ChatworkEndpointInputSchemas.messagesMarkRead.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesMarkRead']
	>(`rooms/${pathSegment(room_id)}/messages/read`, ctx.key, {
		method: 'PUT',
		form: { message_id },
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.messagesMarkRead.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.messages.markRead',
		{ room_id, message_id },
		'completed',
	);

	return validatedResult;
};

export const markUnread: ChatworkEndpoints['messagesMarkUnread'] = async (
	ctx,
	input,
) => {
	const { room_id, message_id } =
		ChatworkEndpointInputSchemas.messagesMarkUnread.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesMarkUnread']
	>(`rooms/${pathSegment(room_id)}/messages/unread`, ctx.key, {
		method: 'PUT',
		form: { message_id },
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.messagesMarkUnread.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.messages.markUnread',
		{ room_id, message_id },
		'completed',
	);

	return validatedResult;
};
