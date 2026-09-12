import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';

export const list: ChatworkEndpoints['membersList'] = async (ctx, input) => {
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['membersList']
	>(`rooms/${input.room_id}/members`, ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});

	await logEventFromContext(
		ctx,
		'chatwork.members.list',
		{ ...input },
		'completed',
	);

	return result;
};
