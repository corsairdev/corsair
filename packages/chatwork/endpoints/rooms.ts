import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const list: ChatworkEndpoints['roomsList'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.roomsList.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['roomsList']
	>('rooms', ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});
	const validatedResult = ChatworkEndpointOutputSchemas.roomsList.parse(result);

	if (ctx.db.rooms) {
		try {
			for (const room of validatedResult) {
				await ctx.db.rooms.upsertByEntityId(String(room.room_id), room);
			}
		} catch (error) {
			console.warn('Failed to save Chatwork rooms to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.rooms.list',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};

export const get: ChatworkEndpoints['roomsGet'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.roomsGet.parse(input);
	const result = await makeChatworkRequest<ChatworkEndpointOutputs['roomsGet']>(
		`rooms/${parsedInput.room_id}`,
		ctx.key,
		{
			method: 'GET',
			authType: ctx.options?.authType,
		},
	);
	const validatedResult = ChatworkEndpointOutputSchemas.roomsGet.parse(result);

	if (ctx.db.rooms) {
		try {
			await ctx.db.rooms.upsertByEntityId(
				String(validatedResult.room_id),
				validatedResult,
			);
		} catch (error) {
			console.warn('Failed to save Chatwork room to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.rooms.get',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};
