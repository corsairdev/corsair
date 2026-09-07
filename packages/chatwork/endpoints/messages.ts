import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';

export const list: ChatworkEndpoints['messagesList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.force !== undefined) {
		query.force = input.force;
	}

	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesList']
	>(`rooms/${input.room_id}/messages`, ctx.key, {
		method: 'GET',
		query,
		authType: ctx.options?.authType,
	});

	await logEventFromContext(
		ctx,
		'chatwork.messages.list',
		{ ...input },
		'completed',
	);

	return result ?? [];
};

export const get: ChatworkEndpoints['messagesGet'] = async (ctx, input) => {
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesGet']
	>(`rooms/${input.room_id}/messages/${input.message_id}`, ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});

	await logEventFromContext(
		ctx,
		'chatwork.messages.get',
		{ ...input },
		'completed',
	);

	return result;
};

export const send: ChatworkEndpoints['messagesSend'] = async (ctx, input) => {
	const payload: Record<string, unknown> = {
		body: input.body,
	};

	if (input.self_unread !== undefined) {
		payload.self_unread =
			typeof input.self_unread === 'boolean'
				? input.self_unread
					? 1
					: 0
				: input.self_unread;
	}

	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['messagesSend']
	>(`rooms/${input.room_id}/messages`, ctx.key, {
		method: 'POST',
		body: payload,
		mediaType: 'application/x-www-form-urlencoded',
		authType: ctx.options?.authType,
	});

	await logEventFromContext(
		ctx,
		'chatwork.messages.send',
		{ ...input },
		'completed',
	);

	return result;
};
