import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';

export const get: ChatworkEndpoints['accountGet'] = async (ctx, input) => {
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['accountGet']
	>('me', ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});

	await logEventFromContext(
		ctx,
		'chatwork.account.get',
		{ ...input },
		'completed',
	);

	return result;
};
