import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';

export const list: ChatworkEndpoints['roomsList'] = async (ctx, input) => {
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['roomsList']
	>('rooms', ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});

	await logEventFromContext(
		ctx,
		'chatwork.rooms.list',
		{ ...input },
		'completed',
	);

	return result;
};

export const get: ChatworkEndpoints['roomsGet'] = async (ctx, input) => {
	const result = await makeChatworkRequest<ChatworkEndpointOutputs['roomsGet']>(
		`rooms/${input.room_id}`,
		ctx.key,
		{
			method: 'GET',
			authType: ctx.options?.authType,
		},
	);

	await logEventFromContext(
		ctx,
		'chatwork.rooms.get',
		{ ...input },
		'completed',
	);

	return result;
};
