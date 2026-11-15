import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest, pathSegment } from '../client';
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
		`rooms/${pathSegment(parsedInput.room_id)}`,
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

export const create: ChatworkEndpoints['roomsCreate'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.roomsCreate.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['roomsCreate']
	>('rooms', ctx.key, {
		method: 'POST',
		form: parsedInput,
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.roomsCreate.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.rooms.create',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};

export const update: ChatworkEndpoints['roomsUpdate'] = async (ctx, input) => {
	const { room_id, ...form } =
		ChatworkEndpointInputSchemas.roomsUpdate.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['roomsUpdate']
	>(`rooms/${pathSegment(room_id)}`, ctx.key, {
		method: 'PUT',
		form,
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.roomsUpdate.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.rooms.update',
		{ room_id, ...form },
		'completed',
	);

	return validatedResult;
};

export const deleteRoom: ChatworkEndpoints['roomsDelete'] = async (
	ctx,
	input,
) => {
	const { room_id, action_type } =
		ChatworkEndpointInputSchemas.roomsDelete.parse(input);
	await makeChatworkRequest<void>(`rooms/${pathSegment(room_id)}`, ctx.key, {
		method: 'DELETE',
		form: { action_type },
		authType: ctx.options?.authType,
	});

	if (ctx.db.rooms) {
		try {
			await ctx.db.rooms.deleteByEntityId(String(room_id));
		} catch (error) {
			console.warn('Failed to remove Chatwork room from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.rooms.delete',
		{ room_id, action_type },
		'completed',
	);

	return { success: true };
};
