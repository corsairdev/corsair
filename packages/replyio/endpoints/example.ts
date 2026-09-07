import { logEventFromContext } from 'corsair/core';
import type { ReplyioEndpoints } from '..';
import type { ReplyioEndpointOutputs } from './types';
import { makeReplyioRequest } from '../client';

export const get: ReplyioEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeReplyioRequest<ReplyioEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'replyio.example.get', { ...input }, 'completed');
	return response;
};
