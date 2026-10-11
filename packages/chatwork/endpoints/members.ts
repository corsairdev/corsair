import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const list: ChatworkEndpoints['membersList'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.membersList.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['membersList']
	>(`rooms/${parsedInput.room_id}/members`, ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.membersList.parse(result);

	if (ctx.db.members) {
		try {
			for (const member of validatedResult) {
				await ctx.db.members.upsertByEntityId(
					`${parsedInput.room_id}:${member.account_id}`,
					{
						...member,
						room_id: parsedInput.room_id,
					},
				);
			}
		} catch (error) {
			console.warn('Failed to save Chatwork members to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.members.list',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};

export const update: ChatworkEndpoints['membersUpdate'] = async (
	ctx,
	input,
) => {
	const { room_id, ...form } =
		ChatworkEndpointInputSchemas.membersUpdate.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['membersUpdate']
	>(`rooms/${room_id}/members`, ctx.key, {
		method: 'PUT',
		form,
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.membersUpdate.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.members.update',
		{ room_id, ...form },
		'completed',
	);

	return validatedResult;
};
