import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const list: ChatworkEndpoints['messagesList'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.messagesList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.force !== undefined) {
		query.force = parsedInput.force;
	}

	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesList']
	>(`rooms/${parsedInput.room_id}/messages`, ctx.key, {
		method: 'GET',
		query,
		authType: ctx.options?.authType,
		defaultEmptyArray: true,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.messagesList.parse(result);

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
		`rooms/${parsedInput.room_id}/messages/${parsedInput.message_id}`,
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
	const payload: Record<string, unknown> = {
		body: parsedInput.body,
	};

	if (parsedInput.self_unread !== undefined) {
		payload.self_unread =
			typeof parsedInput.self_unread === 'boolean'
				? parsedInput.self_unread
					? 1
					: 0
				: parsedInput.self_unread;
	}

	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesSend']
	>(`rooms/${parsedInput.room_id}/messages`, ctx.key, {
		method: 'POST',
		body: payload,
		mediaType: 'application/x-www-form-urlencoded',
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
