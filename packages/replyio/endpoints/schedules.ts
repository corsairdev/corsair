import { logEventFromContext } from 'corsair/core';
import { makeReplyioRequest } from '../client';
import type { ReplyioEndpoint, ReplyioEndpointContext } from './context';

export const deleteSchedule: ReplyioEndpoint<'schedulesDelete'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	await makeReplyioRequest(`schedules/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'replyio.schedules.delete',
		{ id: input.id },
		'completed',
	);
	return { success: true };
};
