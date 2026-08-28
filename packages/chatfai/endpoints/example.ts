import { logEventFromContext } from 'corsair/core';
import type { ChatfaiEndpoints } from '..';
import { makeChatfaiRequest } from '../client';
import type { ChatfaiEndpointOutputs } from './types';

export const get: ChatfaiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeChatfaiRequest<
		ChatfaiEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'chatfai.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
